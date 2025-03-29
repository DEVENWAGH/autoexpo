"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MultipleImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
  maxSize?: number;
  label?: string;
  className?: string;
  usePlaceholder?: boolean;
  acceptedFileTypes?: string;
  defaultSelected?: boolean;
  required?: boolean;
  error?: boolean | string;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  images,
  onChange,
  maxFiles = 30,
  maxSize = 5 * 1024 * 1024, // 5MB
  label = "Upload Images",
  className = "",
  usePlaceholder = false,
  acceptedFileTypes = "image/*",
  defaultSelected = false,
  required = false,
  error = false,
}) => {
  const [placeholderSelected, setPlaceholderSelected] =
    useState(defaultSelected);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, maxFiles - images.length);
      if (newFiles.length === 0) return;

      setPlaceholderSelected(false);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Create an array to store all upload promises
        const uploadPromises = newFiles.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
              if (e.target?.result) {
                const dataUrl = e.target.result as string;
                try {
                  // Create FormData for this file
                  const fd = new FormData();
                  fd.append("file", dataUrl);
                  fd.append("folder", "/vehicles");

                  // Upload the file
                  const response = await fetch("/api/imagekit/upload", {
                    method: "POST",
                    body: fd,
                  });

                  const data = await response.json();
                  if (data.success) {
                    resolve(data.url);
                  } else {
                    console.error("Upload failed:", data.error);
                    reject(new Error(data.error || "Upload failed"));
                  }
                } catch (error) {
                  console.error("Error uploading image:", error);
                  reject(error);
                }
              } else {
                reject(new Error("Failed to read file"));
              }
            };
            reader.onerror = () => reject(new Error("File reading error"));
            reader.readAsDataURL(file);
          });
        });

        // Update progress as uploads complete
        let completed = 0;
        const totalFiles = uploadPromises.length;

        // Wait for all uploads to complete
        const uploadedUrls = await Promise.all(
          uploadPromises.map((promise) =>
            promise
              .then((url) => {
                completed++;
                setUploadProgress(Math.round((completed / totalFiles) * 100));
                return url;
              })
              .catch((err) => {
                completed++;
                setUploadProgress(Math.round((completed / totalFiles) * 100));
                console.error("Individual upload failed:", err);
                return null;
              })
          )
        );

        // Filter out any failed uploads
        const successfulUploads = uploadedUrls.filter(
          (url) => url !== null
        ) as string[];

        // Update state with all new images at once
        if (successfulUploads.length > 0) {
          onChange([...images, ...successfulUploads]);
        }
      } catch (error) {
        console.error("Error in batch upload:", error);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [images, maxFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: {
      [acceptedFileTypes]: [],
    },
    disabled: isUploading,
  });

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const selectPlaceholder = () => {
    if (usePlaceholder) {
      setPlaceholderSelected(true);
      onChange(["/placeholder.svg"]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Lightbox for full image preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white text-xl bg-black/30 rounded-full p-2 hover:bg-black/50"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={previewImage}
              alt="Full size preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300",
          error ? "border-destructive" : "",
          isUploading ? "opacity-70 cursor-not-allowed" : "",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isUploading
              ? `Uploading... ${uploadProgress}%`
              : "Drag & drop images here, or click to select files"}
          </p>
          <span className="text-xs text-muted-foreground">
            {`Max ${maxFiles} files, up to ${Math.round(
              maxSize / 1024 / 1024
            )}MB each`}
            {required && <span className="text-destructive ml-1">*</span>}
          </span>
          {typeof error === "string" && (
            <p className="text-xs text-destructive mt-1">{error}</p>
          )}

          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {usePlaceholder && (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={selectPlaceholder}
            className={cn(
              "text-xs px-3 py-1 rounded-md",
              placeholderSelected
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            Use Default Image
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-md overflow-hidden border border-border cursor-pointer"
              onClick={() => setPreviewImage(image)}
            >
              <Image
                src={image}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
