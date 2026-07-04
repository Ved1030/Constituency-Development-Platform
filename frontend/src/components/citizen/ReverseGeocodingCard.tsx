"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Loader,
  Edit3,
  Check,
  X,
  Building2,
  Landmark,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GeoAddress, GPSLocation } from "@/types/complaint";

interface ReverseGeocodingCardProps {
  address: GeoAddress | null;
  isLoading: boolean;
  error: string | null;
  gpsLocation: GPSLocation | null;
  onAddressChange?: (address: GeoAddress) => void;
}

export function ReverseGeocodingCard({
  address,
  isLoading,
  error,
  gpsLocation,
  onAddressChange,
}: ReverseGeocodingCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState<Partial<GeoAddress>>({});

  const handleSave = () => {
    if (address && onAddressChange) {
      onAddressChange({ ...address, ...editedAddress });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAddress({});
    setIsEditing(false);
  };

  const displayAddress = isEditing ? { ...address, ...editedAddress } : address;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-foreground">
          <Map className="size-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Location Details</h3>
          <p className="text-xs text-muted-foreground">
            Auto-detected from GPS coordinates
          </p>
        </div>
        {address && !isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="size-4" />
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <Loader className="mx-auto size-6 animate-spin text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Detecting location...</p>
        </div>
      )}

      {error && !address && (
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 text-center">
          <MapPin className="mx-auto size-6 text-amber-500 mb-2" />
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      )}

      {displayAddress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {/* Address Fields */}
          <div className="space-y-2">
            <AddressField
              icon={<Building2 className="size-3" />}
              label="Village / Area"
              value={displayAddress.village}
              isEditing={isEditing}
              onChange={(v) => setEditedAddress((prev) => ({ ...prev, village: v }))}
            />
            <AddressField
              icon={<MapPin className="size-3" />}
              label="Ward"
              value={displayAddress.ward}
              isEditing={isEditing}
              onChange={(v) => setEditedAddress((prev) => ({ ...prev, ward: v }))}
            />
            <AddressField
              icon={<Map className="size-3" />}
              label="District"
              value={displayAddress.district}
              isEditing={isEditing}
              onChange={(v) => setEditedAddress((prev) => ({ ...prev, district: v }))}
            />
            <AddressField
              icon={<Map className="size-3" />}
              label="State"
              value={displayAddress.state}
              isEditing={isEditing}
              onChange={(v) => setEditedAddress((prev) => ({ ...prev, state: v }))}
            />
            <AddressField
              icon={<MapPin className="size-3" />}
              label="PIN Code"
              value={displayAddress.pincode}
              isEditing={isEditing}
              onChange={(v) => setEditedAddress((prev) => ({ ...prev, pincode: v }))}
            />
          </div>

          {/* Constituency Info */}
          {(displayAddress.assembly_constituency || displayAddress.lok_sabha_constituency) && (
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 space-y-2">
              {displayAddress.assembly_constituency && (
                <div className="flex items-center gap-2">
                  <Landmark className="size-3 text-primary" />
                  <span className="text-[10px] text-muted-foreground">Assembly:</span>
                  <span className="text-xs font-medium text-foreground">
                    {displayAddress.assembly_constituency}
                  </span>
                </div>
              )}
              {displayAddress.lok_sabha_constituency && (
                <div className="flex items-center gap-2">
                  <Landmark className="size-3 text-primary" />
                  <span className="text-[10px] text-muted-foreground">Lok Sabha:</span>
                  <span className="text-xs font-medium text-foreground">
                    {displayAddress.lok_sabha_constituency}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Nearest Landmark */}
          {displayAddress.nearest_landmark && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
              <Landmark className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Near:</span>
              <span className="text-xs font-medium text-foreground">
                {displayAddress.nearest_landmark}
              </span>
            </div>
          )}

          {/* Confidence */}
          {displayAddress.confidence !== null && displayAddress.confidence !== undefined && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Detection confidence</span>
              <span className={cn(
                "font-medium",
                displayAddress.confidence >= 0.7 ? "text-success" :
                displayAddress.confidence >= 0.4 ? "text-amber-500" : "text-destructive"
              )}>
                {Math.round(displayAddress.confidence * 100)}%
              </span>
            </div>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" onClick={handleSave} className="gap-1.5 flex-1">
                <Check className="size-3" />
                Save Changes
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="gap-1.5">
                <X className="size-3" />
                Cancel
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Address Field ────────────────────────────────────────────────────

interface AddressFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  isEditing: boolean;
  onChange?: (value: string) => void;
}

function AddressField({ icon, label, value, isEditing, onChange }: AddressFieldProps) {
  if (isEditing) {
    return (
      <div>
        <label className="mb-1 block text-[10px] text-muted-foreground">{label}</label>
        <Input
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="h-8 text-xs"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <span className="text-xs font-medium text-foreground">
        {value || "—"}
      </span>
    </div>
  );
}
