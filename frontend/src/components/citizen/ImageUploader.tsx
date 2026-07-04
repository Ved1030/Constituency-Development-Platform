"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImagesChange?: (files: File[]) => void;
}

export function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setTimeout(() => {
      const newImages = files.map((f) => URL.createObjectURL(f));
      setImages((prev) => [...prev, ...newImages]);
      setIsUploading(false);
      onImagesChange?.(files);
    }, 1000);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Camera className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Add Photos</h3>
          <p className="text-xs text-muted-foreground">Show the issue visually (optional)</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((src, index) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
          >
            <img src={src} alt="" className="size-full object-cover" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="size-3" />
            </button>
          </motion.div>
        ))}

        {isUploading && (
          <div className="flex aspect-square items-center justify-center rounded-xl bg-muted">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        <button
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <Upload className="size-5" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
