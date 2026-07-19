"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";
import { cn, getProductImageUrl } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  disabled
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [localFile, setLocalFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle value changes from parent (e.g. initial load or after upload)
  useEffect(() => {
    if (value) {
      setPreview(getProductImageUrl(value));
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Immediate local preview
      const localUrl = URL.createObjectURL(file);
      setLocalFile(localUrl);
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!onUpload) return;
    
    // Validate file type (frontend check)
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const url = await onUpload(file);
      onChange(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onClear = () => {
    if (localFile) {
      URL.revokeObjectURL(localFile);
      setLocalFile(null);
    }
    onChange("");
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cleanup local URLs
  useEffect(() => {
    return () => {
      if (localFile) URL.revokeObjectURL(localFile);
    };
  }, [localFile]);

  // Use local preview if available, otherwise fallback to prop-based preview
  const displayUrl = localFile || preview;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 transition-all flex flex-col items-center justify-center min-h-[200px] gap-4",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
          disabled && "opacity-50 cursor-not-allowed",
          !displayUrl && "hover:border-primary/50 cursor-pointer"
        )}
        onClick={() => !displayUrl && !disabled && fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled || uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading image...</p>
          </div>
        ) : displayUrl ? (
          <div className="relative group w-full h-full flex items-center justify-center">
            <img
              src={displayUrl}
              alt="Preview"
              className="max-h-[300px] w-auto rounded-lg object-contain shadow-sm"
              onError={(e) => {
                console.error("Failed to load image:", displayUrl);
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
