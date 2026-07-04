"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FileText,
  Mic,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Check,
  Send,
  Loader,
  Zap,
  Target,
  Building,
  Tag,
  CheckCircle,
  MessageSquare,
  Navigation,
  Camera,
  AlertTriangle,
  Users,
  Clock,
  TrendingUp,
  Shield,
  Brain,
  Landmark,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorderCard } from "@/components/citizen/VoiceRecorderCard";
import { GPSLocationCapture } from "@/components/citizen/GPSLocationCapture";
import { ReverseGeocodingCard } from "@/components/citizen/ReverseGeocodingCard";
import { EvidenceUpload } from "@/components/citizen/EvidenceUpload";
import { AIPreviewCard } from "@/components/citizen/AIPreviewCard";
import { EvidenceScoreGauge } from "@/components/citizen/EvidenceScoreGauge";
import { BackgroundClassificationCard } from "@/components/citizen/BackgroundClassificationCard";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import type { UILanguage } from "@/components/common/LanguageSwitcher";
import { complaintCategories } from "@/data/mock-citizen";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useReverseGeocoding } from "@/hooks/use-reverse-geocoding";
import { useBackgroundClassification } from "@/hooks/use-background-classification";
import { submitComplaint } from "@/services/complaint-api";
import { useTranslation } from "@/hooks/use-translation";
import type {
  AIPreview,
  ComplaintCategory,
  ComplaintSubmitResponse,
  DuplicateCheckResult,
  GeoAddress,
  GPSLocation,
  IssueClusterInfo,
} from "@/types/complaint";

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

type CategoryValue =
  | "road"
  | "water"
  | "electricity"
  | "healthcare"
  | "education"
  | "sanitation"
  | "other";

const categoryDetails: Record<string, { departments: string[]; tags: string[] }> = {
  road: {
    departments: ["Corporation Roads Division", "PWD", "Highways Department"],
    tags: ["pothole", "road-safety", "infrastructure", "shoulder-damage"],
  },
  water: {
    departments: ["Metro Water Board", "Corporation Water Wing", "PHED"],
    tags: ["water-supply", "drainage", "waterlogging", "pipe-leak"],
  },
  electricity: {
    departments: ["Electricity Board", "Power Distribution Company"],
    tags: ["power-cut", "street-light", "transformer", "voltage-fluctuation"],
  },
  healthcare: {
    departments: ["Health Department", "Medical Services", "PHC"],
    tags: ["medicine", "hospital", "ambulance", "vaccination"],
  },
  education: {
    departments: ["Education Department", "School Board"],
    tags: ["school", "infrastructure", "mid-day-meal", "teacher"],
  },
  sanitation: {
    departments: ["Corporation Sanitation Wing", "Swachh Bharat Mission"],
    tags: ["garbage", "sewage", "toilet", "cleaning"],
  },
  other: {
    departments: ["General Administration"],
    tags: ["other", "general"],
  },
};

// ---------------------------------------------------------------------------
// Client-side AI simulation (mirrors backend logic for preview)
// ---------------------------------------------------------------------------
function clientSideAIPreview(
  category: CategoryValue,
  title: string,
  description: string,
  gps: GPSLocation | null,
  address: GeoAddress | null,
  imageCount: number,
  hasVoice: boolean,
): AIPreview {
  const cat = categoryDetails[category] || categoryDetails.other;
  const dept = cat.departments[0] || "General Administration";

  let evidenceScore = 0;
  if (gps) evidenceScore += 15;
  if (imageCount > 0) evidenceScore += 15;
  if (hasVoice) evidenceScore += 10;
  if (gps && gps.accuracy !== null && gps.accuracy <= 30) evidenceScore += 15;
  if (gps && gps.accuracy !== null && gps.accuracy <= 10) evidenceScore += 5;
  if (description.length > 50) evidenceScore += 5;
  if (address?.village) evidenceScore += 10;
  evidenceScore += 15;
  evidenceScore = Math.min(100, evidenceScore);

  const sevMap: Record<string, number> = {
    healthcare: 1.3,
    electricity: 1.2,
    water: 1.15,
    sanitation: 1.1,
    road: 1.0,
    education: 0.9,
    other: 0.8,
  };
  let priority = 30 * (sevMap[category] || 1.0);
  if (evidenceScore >= 70) priority += 20;
  if (imageCount > 0) priority += 5;
  priority = Math.min(100, Math.round(priority));

  const baseDays: Record<string, number> = {
    road: 14,
    water: 10,
    electricity: 7,
    healthcare: 21,
    education: 30,
    sanitation: 7,
    other: 14,
  };
  let estDays = baseDays[category] || 14;
  if (priority >= 75) estDays = Math.max(1, Math.round(estDays * 0.5));
  else if (priority >= 50) estDays = Math.max(1, Math.round(estDays * 0.7));

  const dupProb = gps ? 0.15 : 0.05;

  return {
    detected_department: dept,
    detected_sector: cat.tags[0] ? cat.tags[0].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "General",
    detected_category: category,
    detected_location: address,
    gps_accuracy: gps?.accuracy ?? null,
    evidence_score: {
      total: evidenceScore,
      gps_present: !!gps,
      photo_present: imageCount > 0,
      voice_present: hasVoice,
      image_metadata_valid: imageCount > 0,
      multiple_reports_nearby: false,
      duplicate_radius_match: false,
      location_accuracy_score: gps && gps.accuracy !== null ? (gps.accuracy <= 10 ? 15 : gps.accuracy <= 30 ? 12 : 5) : 0,
      timestamp_valid: !!gps?.timestamp,
      ai_confidence_score: 12,
      breakdown: {},
    },
    duplicate_probability: dupProb,
    priority_prediction: priority,
    estimated_resolution_days: estDays,
    ai_confidence: 0.78,
    similar_complaints_nearby: 0,
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function NewComplaintPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [category, setCategory] = useState<CategoryValue | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [useVoice, setUseVoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [hasVoice, setHasVoice] = useState(false);
  const [address, setAddress] = useState<GeoAddress | null>(null);
  const [submitResult, setSubmitResult] = useState<ComplaintSubmitResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const steps = [
    { id: 1, label: t("citizen.newComplaint.category"), icon: FileText },
    { id: 2, label: t("citizen.newComplaint.details"), icon: MessageSquare },
    { id: 3, label: t("citizen.newComplaint.location"), icon: MapPin },
    { id: 4, label: t("citizen.newComplaint.evidence"), icon: Camera },
    { id: 5, label: t("citizen.newComplaint.aiReview"), icon: Zap },
  ];

  // Multilingual data from speech input
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [englishTranslation, setEnglishTranslation] = useState("");
  const [uiLanguage, setUiLanguage] = useState<UILanguage>({
    code: "en",
    name: "English",
    native_name: "English",
    flag: "\ud83c\uddee\ud83c\uddf3",
  });

  // Voice note data from evidence step
  const [voiceNotes, setVoiceNotes] = useState<Array<{
    audioBlob: Blob;
    transcript: string;
    language: string;
    englishTranslation: string;
  }>>([]);

  // Ref to track if description has been set from voice
  const voiceSetTextRef = useRef(false);

  // GPS hook
  const {
    location: gpsLocation,
    permissionState,
    isCapturing: isCapturingGPS,
    error: gpsError,
    accuracy: gpsAccuracy,
    requestPermission: requestGPS,
  } = useGeolocation({ enableHighAccuracy: true, timeout: 15000 });

  // Reverse geocoding hook
  const {
    address: geoAddress,
    isLoading: isGeocoding,
    error: geocodingError,
    reverseGeocode,
  } = useReverseGeocoding();

  // Auto-geocode when GPS location changes
  useEffect(() => {
    if (gpsLocation) {
      reverseGeocode(gpsLocation.latitude, gpsLocation.longitude);
    }
  }, [gpsLocation, reverseGeocode]);

  // Sync geocoded address
  useEffect(() => {
    if (geoAddress) {
      setAddress(geoAddress);
    }
  }, [geoAddress]);

  // Background classification — fires automatically when title/description change
  const {
    classification,
    isClassifying,
    triggerClassification,
  } = useBackgroundClassification({ debounceMs: 1500, minLength: 15 });

  // Trigger background classification when description changes
  useEffect(() => {
    if (description.length >= 15 && title.length >= 3) {
      triggerClassification({
        title,
        description,
        category: category || undefined,
        original_language: originalLanguage || undefined,
        english_translation: englishTranslation || undefined,
      });
    }
  }, [title, description, category, originalLanguage, englishTranslation, triggerClassification]);

  // Merge background classification into AI preview
  const aiPreview = useMemo(() => {
    const basePreview = category
      ? clientSideAIPreview(category, title, description, gpsLocation, address, imageCount, hasVoice)
      : null;

    // If we have a real AI classification from background, merge it in
    if (classification?.success && basePreview) {
      return {
        ...basePreview,
        detected_department: classification.detected_department || basePreview.detected_department,
        detected_sector: classification.detected_sector || basePreview.detected_sector,
        detected_category: classification.detected_category || basePreview.detected_category,
        priority_prediction: classification.priority_score || basePreview.priority_prediction,
        ai_confidence: classification.confidence || basePreview.ai_confidence,
        estimated_resolution_days: classification.estimated_resolution_days || basePreview.estimated_resolution_days,
      };
    }

    return basePreview;
  }, [category, title, description, gpsLocation, address, imageCount, hasVoice, classification]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return category !== null;
      case 2:
        return title.length >= 5 && description.length >= 10;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitComplaint({
        title,
        description,
        category: category!,
        sector: aiPreview?.detected_sector || null,
        gps: gpsLocation,
        address: address,
        evidence: {
          image_urls: [],
          voice_url: hasVoice ? "voice-mock" : null,
          video_url: null,
          text_description: description,
        },
        citizen_id: "CIT-001",
        citizen_name: "Arun Kumar",
        manual_ward: null,
        manual_village: null,
        original_language: originalLanguage,
        language_code: languageCode,
        original_text: originalText,
        final_text: description,
        english_translation: englishTranslation,
      });

      setSubmitResult(result);
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/citizen/complaints");
      }, 4000);
    } catch (err: any) {
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/citizen/complaints");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Submitted screen
  // ---------------------------------------------------------------------------
  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-success/10 mb-6">
            <CheckCircle className="size-10 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t("citizen.newComplaint.complaintSubmitted")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("citizen.newComplaint.complaintRegistered")}
            {submitResult?.complaint && (
              <>
                {" "}{t("citizen.newComplaint.yourIdIs")}{" "}
                <span className="font-medium text-primary">
                  {submitResult.complaint.complaint_uid}
                </span>
              </>
            )}
          </p>
          {submitResult?.complaint && (
            <div className="mt-4 rounded-xl bg-card border border-border p-3 text-left space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("citizen.newComplaint.evidenceScore")}</span>
                <span className="font-medium text-success">
                  {Math.round(submitResult.complaint.evidence_score)}/100
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("citizen.newComplaint.status")}</span>
                <span className="font-medium text-primary capitalize">
                  {submitResult.complaint.verification_status.replace(/_/g, " ")}
                </span>
              </div>
              {submitResult.complaint.department && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t("citizen.newComplaint.department")}</span>
                  <span className="font-medium text-foreground">
                    {submitResult.complaint.department}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader className="size-4 animate-spin" />
            {t("citizen.newComplaint.redirecting")}
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main form
  // ---------------------------------------------------------------------------
  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
      {/* Back button + Language Switcher */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="size-4" />
          {t("common.back")}
        </Button>
        <LanguageSwitcher
          currentLanguage={uiLanguage.code}
          onLanguageChange={setUiLanguage}
        />
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                  currentStep > step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.id
                      ? "bg-primary/10 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {currentStep > step.id ? <Check className="size-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2",
                  currentStep > step.id ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── Step 1: Category ─────────────────────────────────────── */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t("citizen.newComplaint.selectCategory")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("citizen.newComplaint.chooseCategory")}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {complaintCategories.map((cat) => {
                const isSelected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value as CategoryValue)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30 hover:shadow-sm",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl transition-all",
                        isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary",
                      )}
                    >
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{cat.label}</div>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[11px] text-primary"
                        >
                          {t("citizen.newComplaint.selected")}
                        </motion.div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── Step 2: Details ─────────────────────────────────────── */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("citizen.newComplaint.describeIssue")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("citizen.newComplaint.provideDetails")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseVoice(!useVoice)}
                className={cn("gap-2", useVoice && "border-primary text-primary bg-primary/5")}
              >
                <Mic className="size-4" />
                {useVoice ? t("citizen.newComplaint.typeInstead") : t("citizen.newComplaint.useVoice")}
              </Button>
            </div>

            {useVoice ? (
              <VoiceRecorderCard
                onTranscript={(text) => {
                  voiceSetTextRef.current = true;
                  setDescription(text);
                  setTitle(text.slice(0, 50));
                }}
                onMultilingualData={(data) => {
                  setOriginalLanguage(data.originalLanguage);
                  setLanguageCode(data.languageCode);
                  setOriginalText(data.originalText);
                  setEnglishTranslation(data.englishTranslation);
                }}
              />
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("citizen.newComplaint.title")}
                  </label>
                  <Input
                    placeholder={t("citizen.newComplaint.titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("citizen.newComplaint.description")}
                  </label>
                  <Textarea
                    placeholder={t("citizen.newComplaint.descriptionPlaceholder")}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      voiceSetTextRef.current = false;
                    }}
                    rows={5}
                  />
                </div>
              </>
            )}

            {/* Background AI classification indicator */}
            {isClassifying && (
              <div className="flex items-center gap-2 text-xs text-primary">
                <Loader className="size-3 animate-spin" />
                {t("citizen.newComplaint.aiAnalyzing")}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Step 3: GPS Location + Geocoding ─────────────────────── */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t("citizen.newComplaint.locationGps")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("citizen.newComplaint.captureGps")}
              </p>
            </div>

            <GPSLocationCapture
              location={gpsLocation}
              permissionState={permissionState}
              isCapturing={isCapturingGPS}
              error={gpsError}
              accuracy={gpsAccuracy}
              onRequestPermission={requestGPS}
            />

            {gpsLocation && (
              <ReverseGeocodingCard
                address={address}
                isLoading={isGeocoding}
                error={geocodingError}
                gpsLocation={gpsLocation}
                onAddressChange={setAddress}
              />
            )}

            {/* Manual address fallback */}
            {!gpsLocation && (
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {t("citizen.newComplaint.manualLocation")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("citizen.newComplaint.enterAddressFallback")}
                </p>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("citizen.newComplaint.manualLocationPlaceholder")}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-10 pl-9"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Step 4: Evidence Upload ─────────────────────────────── */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t("citizen.newComplaint.uploadEvidence")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("citizen.newComplaint.addPhotosVoice")}
              </p>
            </div>

            <EvidenceUpload
              onImagesChange={(files) => setImageCount((prev) => prev + files.length)}
              onVoiceChange={(blob) => setHasVoice(!!blob)}
              onVoiceNoteTranscript={(note) => {
                setVoiceNotes((prev) => [...prev, note]);
                setHasVoice(true);
              }}
              imageCount={imageCount}
              hasVoice={hasVoice}
            />

            {/* Voice notes list */}
            {voiceNotes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("citizen.newComplaint.voiceNotes")} ({voiceNotes.length})
                </p>
                {voiceNotes.map((note, i) => (
                  <div key={i} className="rounded-xl bg-muted/50 p-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-primary">{note.language}</span>
                      <span className="text-[10px] text-muted-foreground">{t("citizen.newComplaint.voiceNote")} {i + 1}</span>
                    </div>
                    <p className="text-xs text-foreground">{note.transcript}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick evidence tips */}
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
              <p className="text-xs font-medium text-primary mb-2">{t("citizen.newComplaint.evidenceTips")}</p>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <Check className="size-3 text-success shrink-0 mt-0.5" />
                  {t("citizen.newComplaint.captureMultipleAngles")}
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="size-3 text-success shrink-0 mt-0.5" />
                  {t("citizen.newComplaint.recordVoiceNote")}
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="size-3 text-success shrink-0 mt-0.5" />
                  {t("citizen.newComplaint.ensureGpsEnabled")}
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* ─── Step 5: AI Review & Submit ──────────────────────────── */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t("citizen.newComplaint.aiReviewSubmit")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("citizen.newComplaint.aiAnalyzed")}
              </p>
            </div>

            {/* Real AI classification result (already computed in background) */}
            <BackgroundClassificationCard
              classification={classification}
              isClassifying={isClassifying}
            />

            {aiPreview && <AIPreviewCard preview={aiPreview} />}

            {aiPreview?.evidence_score && (
              <EvidenceScoreGauge score={aiPreview.evidence_score} />
            )}

            {/* Complaint Summary */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{t("citizen.newComplaint.complaintSummary")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("citizen.newComplaint.category")}</span>
                  <span className="font-medium text-foreground capitalize">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("citizen.newComplaint.title")}</span>
                  <span className="font-medium text-foreground text-right max-w-[60%] truncate">
                    {title}
                  </span>
                </div>
                {originalLanguage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("citizen.newComplaint.spokenLanguage")}</span>
                    <span className="font-medium text-foreground">{originalLanguage}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("citizen.newComplaint.location")}</span>
                  <span className="font-medium text-foreground text-right max-w-[60%] truncate">
                    {address?.village || address?.district || location || t("citizen.newComplaint.gpsCaptured")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPS</span>
                  <span className={cn("font-medium", gpsLocation ? "text-success" : "text-amber-500")}>
                    {gpsLocation ? t("citizen.newComplaint.verified") : t("citizen.newComplaint.notCaptured")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("citizen.newComplaint.photos")}</span>
                  <span className="font-medium text-foreground">{imageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("citizen.newComplaint.voiceNote")}</span>
                  <span className="font-medium text-foreground">{hasVoice ? t("citizen.newComplaint.yes") : t("citizen.newComplaint.no")}</span>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 flex items-start gap-3">
                <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">{submitError}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          {t("common.previous")}
        </Button>

        {currentStep < 5 ? (
          <Button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
            className="gap-2"
          >
            {t("common.next")}
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader className="size-4 animate-spin" />
                {t("citizen.newComplaint.submitting")}
              </>
            ) : (
              <>
                <Send className="size-4" />
                {t("citizen.newComplaint.submitComplaint")}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
