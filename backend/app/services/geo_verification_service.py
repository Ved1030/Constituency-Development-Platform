"""
Geo Verification Service – orchestrates the full geo-verification pipeline.

Pipeline:
1. Validate GPS data
2. Reverse geocode coordinates
3. Detect constituencies
4. Detect department/sector via AI
5. Search for duplicate complaints in radius
6. Calculate evidence score
7. Generate verification status
8. Build AI preview
"""

import json
import logging
import math
from datetime import datetime
from typing import Any, Dict, List, Optional

import httpx

from app.ai.geo_engine import (
    calculate_evidence_score,
    calculate_priority,
    detect_constituency,
    detect_department,
    estimate_resolution,
    find_duplicate_radius,
    generate_geo_summary,
    validate_location,
)
from app.core.config import settings
from app.core.exceptions import (
    CDPException,
    GPSAccuracyError,
    GPSDeniedError,
    NetworkTimeoutError,
    ReverseGeocodeError,
)
from app.core.logger import log_ai_step
from app.schemas.complaint import (
    AIPreview,
    ComplaintCreateRequest,
    DuplicateCheckResult,
    EvidenceScore,
    EvidenceUpload,
    GeoAddress,
    GPSLocation,
)

logger = logging.getLogger("app.services.geo_verification")


class GeoVerificationService:
    """Orchestrates the full geo-verification pipeline for complaints."""

    # -- Reverse Geocoding --------------------------------------------------
    @staticmethod
    async def reverse_geocode(
        latitude: float,
        longitude: float,
    ) -> GeoAddress:
        """
        Reverse geocode GPS coordinates to address components.
        Uses Nominatim (OpenStreetMap) as fallback, with optional Geoapify.
        """
        log_ai_step("reverse_geocode_start", lat=latitude, lng=longitude)

        address = GeoAddress()

        # Try Geoapify first if key is available
        if settings.GEOAPIFY_KEY:
            try:
                address = await GeoVerificationService._geocode_geoapify(
                    latitude, longitude
                )
                if address.village or address.district:
                    log_ai_step("reverse_geocode_success", source="geoapify")
                    return address
            except Exception as e:
                logger.warning("Geoapify geocoding failed, trying Nominatim: %s", e)

        # Fallback to Nominatim
        try:
            address = await GeoVerificationService._geocode_nominatim(
                latitude, longitude
            )
            log_ai_step("reverse_geocode_success", source="nominatim")
            return address
        except Exception as e:
            logger.warning("Nominatim geocoding failed: %s", e)

        # Last resort: generate minimal address from coordinates
        log_ai_step("reverse_geocode_fallback", source="coordinates")
        address.raw_display = f"Location at ({latitude:.6f}, {longitude:.6f})"
        address.confidence = 0.1
        return address

    @staticmethod
    async def _geocode_nominatim(
        latitude: float, longitude: float
    ) -> GeoAddress:
        """Reverse geocode using Nominatim (OpenStreetMap)."""
        url = f"{settings.NOMINATIM_URL}/reverse"
        params = {
            "lat": latitude,
            "lon": longitude,
            "format": "json",
            "addressdetails": 1,
            "accept-language": "en",
        }
        headers = {"User-Agent": "ConstituencyDevPlatform/1.0"}

        async with httpx.AsyncClient(timeout=settings.REVERSE_GEOCODE_TIMEOUT) as client:
            resp = await client.get(url, params=params, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        addr = data.get("address", {})
        display = data.get("display_name", "")

        # Extract address components
        village = (
            addr.get("village")
            or addr.get("suburb")
            or addr.get("neighbourhood")
            or addr.get("hamlet")
            or addr.get("residential")
            or ""
        )
        ward = addr.get("ward", "")
        taluka = addr.get("county", addr.get("suburb", ""))
        district = addr.get("district", addr.get("city_district", ""))
        state = addr.get("state", "")
        pincode = addr.get("postcode", "")

        # Landmark detection from nearby features
        landmark_parts = []
        for feature_key in ("attraction", "building", "amenity", "tourism", "historic"):
            if addr.get(feature_key):
                landmark_parts.append(str(addr[feature_key]))
        nearest_landmark = ", ".join(landmark_parts[:2]) if landmark_parts else None

        confidence = 0.8 if village and district else 0.5

        return GeoAddress(
            village=village,
            ward=ward,
            taluka=taluka,
            district=district,
            state=state,
            pincode=pincode,
            assembly_constituency=None,  # Will be set by detect_constituency
            lok_sabha_constituency=None,
            nearest_landmark=nearest_landmark,
            confidence=confidence,
            raw_display=display,
        )

    @staticmethod
    async def _geocode_geoapify(
        latitude: float, longitude: float
    ) -> GeoAddress:
        """Reverse geocode using Geoapify API."""
        url = "https://api.geoapify.com/v1/reverse"
        params = {
            "lat": latitude,
            "lon": longitude,
            "apiKey": settings.GEOAPIFY_KEY,
            "format": "json",
            "lang": "en",
        }

        async with httpx.AsyncClient(timeout=settings.REVERSE_GEOCODE_TIMEOUT) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

        features = data.get("features", [])
        if not features:
            raise CDPException("No geocoding results from Geoapify")

        props = features[0].get("properties", {})
        addr = props.get("address", {})

        village = addr.get("city", addr.get("town", addr.get("village", "")))
        ward = addr.get("ward", "")
        district = addr.get("county", addr.get("state_district", ""))
        state = props.get("state", "")
        pincode = addr.get("postcode", "")

        return GeoAddress(
            village=village,
            ward=ward,
            taluka=addr.get("suburb", ""),
            district=district,
            state=state,
            pincode=pincode,
            assembly_constituency=None,
            lok_sabha_constituency=None,
            nearest_landmark=addr.get("name"),
            confidence=0.85,
            raw_display=props.get("formatted", ""),
        )

    # -- Full Pipeline ------------------------------------------------------
    @staticmethod
    async def process_complaint(
        request: ComplaintCreateRequest,
        existing_complaints: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Run the full geo-verification pipeline on a new complaint.

        Returns a dict with all computed fields ready for database storage.
        """
        log_ai_step("process_complaint_start", title=request.title)

        result: Dict[str, Any] = {
            "gps_latitude": None,
            "gps_longitude": None,
            "gps_accuracy": None,
            "gps_altitude": None,
            "gps_speed": None,
            "gps_heading": None,
            "gps_timestamp": None,
            "village": None,
            "ward": None,
            "taluka": None,
            "district": None,
            "state": None,
            "pincode": None,
            "assembly_constituency": None,
            "lok_sabha_constituency": None,
            "nearest_landmark": None,
            "verification_status": "unverified",
            "verification_confidence": 0.0,
            "evidence_score": 0.0,
            "duplicate_probability": 0.0,
            "cluster_id": None,
            "duplicate_count": 0,
            "ai_detected_category": request.category,
            "ai_detected_department": None,
            "ai_detected_sector": None,
            "ai_confidence": 0.0,
            "priority_prediction": 0.0,
            "estimated_resolution_days": None,
            "heatmap_key": None,
        }

        gps_quality = None
        has_gps = False
        has_photos = False
        has_voice = False
        has_timestamp = False

        # Step 1: GPS Validation
        if request.gps:
            has_gps = True
            gps_loc = request.gps
            result["gps_latitude"] = gps_loc.latitude
            result["gps_longitude"] = gps_loc.longitude
            result["gps_accuracy"] = gps_loc.accuracy
            result["gps_altitude"] = gps_loc.altitude
            result["gps_speed"] = gps_loc.speed
            result["gps_heading"] = gps_loc.heading
            result["gps_timestamp"] = gps_loc.timestamp or datetime.utcnow()
            has_timestamp = gps_loc.timestamp is not None

            gps_validation = validate_location(
                latitude=gps_loc.latitude,
                longitude=gps_loc.longitude,
                accuracy=gps_loc.accuracy,
                altitude=gps_loc.altitude,
                speed=gps_loc.speed,
                heading=gps_loc.heading,
            )

            if not gps_validation["is_valid"]:
                raise GPSDeniedError(
                    message=f"GPS data invalid: {', '.join(gps_validation['warnings'])}"
                )

            gps_quality = gps_validation["quality"]

            # Step 2: Reverse Geocoding
            try:
                geo_address = await GeoVerificationService.reverse_geocode(
                    gps_loc.latitude, gps_loc.longitude
                )
                result["village"] = request.manual_village or geo_address.village
                result["ward"] = request.manual_ward or geo_address.ward
                result["taluka"] = geo_address.taluka
                result["district"] = geo_address.district
                result["state"] = geo_address.state
                result["pincode"] = geo_address.pincode
                result["nearest_landmark"] = geo_address.nearest_landmark
                result["verification_confidence"] = geo_address.confidence or 0.5
            except Exception as e:
                logger.warning("Reverse geocoding failed: %s", e)
                # Continue without geocoding – don't fail the whole pipeline

            # Step 3: Constituency Detection
            constituency = detect_constituency(
                latitude=gps_loc.latitude,
                longitude=gps_loc.longitude,
                village=result["village"],
                ward=result["ward"],
            )
            result["assembly_constituency"] = constituency["assembly_constituency"]
            result["lok_sabha_constituency"] = constituency["lok_sabha_constituency"]
        elif request.address:
            # Manual address provided
            addr = request.address
            result["village"] = addr.village
            result["ward"] = addr.ward
            result["taluka"] = addr.taluka
            result["district"] = addr.district
            result["state"] = addr.state
            result["pincode"] = addr.pincode
            result["assembly_constituency"] = addr.assembly_constituency
            result["lok_sabha_constituency"] = addr.lok_sabha_constituency
            result["nearest_landmark"] = addr.nearest_landmark

        # Step 4: Department Detection
        dept_result = detect_department(
            category=request.category,
            title=request.title,
            description=request.description or "",
        )
        result["ai_detected_department"] = dept_result["department"]
        result["ai_detected_sector"] = dept_result["sector"]
        result["ai_confidence"] = dept_result["confidence"]
        result["estimated_resolution_days"] = dept_result["estimated_days"]

        # Step 5: Duplicate Detection
        if existing_complaints is not None and result["gps_latitude"] is not None:
            dup_result = find_duplicate_radius(
                latitude=result["gps_latitude"],
                longitude=result["gps_longitude"],
                category=request.category,
                existing_complaints=existing_complaints,
                radius_meters=settings.DUPLICATE_RADIUS_METERS,
            )
            if dup_result["is_duplicate"]:
                result["duplicate_probability"] = 0.85
                result["duplicate_count"] = dup_result["existing_report_count"]
                result["cluster_id"] = dup_result.get("nearest_complaint_id")

            # Also check medium and large radius
            medium_dup = find_duplicate_radius(
                latitude=result["gps_latitude"],
                longitude=result["gps_longitude"],
                category=request.category,
                existing_complaints=existing_complaints,
                radius_meters=settings.DUPLICATE_RADIUS_MEDIUM,
            )
            if medium_dup["is_duplicate"]:
                result["duplicate_probability"] = max(
                    result["duplicate_probability"], 0.6
                )
                result["duplicate_count"] = max(
                    result["duplicate_count"], medium_dup["existing_report_count"]
                )

        # Step 6: Evidence Score
        evidence = request.evidence
        if evidence:
            has_photos = bool(evidence.image_urls)
            has_voice = bool(evidence.voice_url)

        evidence_result = calculate_evidence_score(
            has_gps=has_gps,
            has_photos=has_photos,
            has_voice=has_voice,
            has_image_metadata=has_photos,  # Simplified: assume metadata if photos
            has_multiple_reports=result["duplicate_count"] > 0,
            has_duplicate_match=result["duplicate_probability"] > 0,
            gps_accuracy=result["gps_accuracy"],
            gps_quality=gps_quality,
            has_timestamp=has_timestamp,
            ai_confidence=result["ai_confidence"],
            description_length=len(request.description or ""),
        )
        result["evidence_score"] = evidence_result["total"]
        result["verification_status"] = evidence_result["verification_status"]

        # Step 7: Priority Prediction
        severity = "medium"
        if evidence_result["total"] >= 80:
            severity = "high"
        elif evidence_result["total"] >= 60:
            severity = "medium"
        else:
            severity = "low"

        priority_result = calculate_priority(
            category=request.category,
            severity=severity,
            evidence_score=evidence_result["total"],
            duplicate_count=result["duplicate_count"],
            description=request.description or "",
        )
        result["priority_prediction"] = priority_result["priority_score"]

        # Step 8: Heatmap Key
        if result["village"] and result["ward"]:
            result["heatmap_key"] = f"{result['village']}|{result['ward']}|{dept_result['department']}"

        log_ai_step(
            "process_complaint_complete",
            evidence_score=result["evidence_score"],
            verification=result["verification_status"],
            priority=result["priority_prediction"],
            duplicates=result["duplicate_count"],
        )

        return result

    # -- Build AI Preview ---------------------------------------------------
    @staticmethod
    def build_ai_preview(
        processing_result: Dict[str, Any],
        request: ComplaintCreateRequest,
    ) -> AIPreview:
        """Build the AI preview card shown before final submission."""

        address = None
        if processing_result.get("village"):
            address = GeoAddress(
                village=processing_result.get("village"),
                ward=processing_result.get("ward"),
                taluka=processing_result.get("taluka"),
                district=processing_result.get("district"),
                state=processing_result.get("state"),
                pincode=processing_result.get("pincode"),
                assembly_constituency=processing_result.get("assembly_constituency"),
                lok_sabha_constituency=processing_result.get("lok_sabha_constituency"),
                nearest_landmark=processing_result.get("nearest_landmark"),
                confidence=processing_result.get("verification_confidence"),
            )

        evidence_score = EvidenceScore(
            total=processing_result.get("evidence_score", 0),
            gps_present=processing_result.get("gps_latitude") is not None,
            photo_present=bool(request.evidence and request.evidence.image_urls),
            voice_present=bool(request.evidence and request.evidence.voice_url),
            location_accuracy_score=15.0 if processing_result.get("gps_accuracy", 999) <= 30 else 5.0,
        )

        return AIPreview(
            detected_department=processing_result.get("ai_detected_department"),
            detected_sector=processing_result.get("ai_detected_sector"),
            detected_category=processing_result.get("ai_detected_category"),
            detected_location=address,
            gps_accuracy=processing_result.get("gps_accuracy"),
            evidence_score=evidence_score,
            duplicate_probability=processing_result.get("duplicate_probability", 0.0),
            priority_prediction=processing_result.get("priority_prediction", 0.0),
            estimated_resolution_days=processing_result.get("estimated_resolution_days"),
            ai_confidence=processing_result.get("ai_confidence", 0.0),
            similar_complaints_nearby=processing_result.get("duplicate_count", 0),
        )


# Convenience alias
geo_verification_service = GeoVerificationService()
