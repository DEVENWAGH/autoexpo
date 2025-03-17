"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
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
  maxFiles = 5,
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, maxFiles - images.length);
      setPlaceholderSelected(false);

      // Convert Files to data URLs
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            // Here we're getting a data URL, but we'll use it as is and let the API handle it
            const dataUrl = e.target.result as string;

            // Call the upload API to convert data URL to ImageKit URL immediately
            fetch("/api/imagekit/upload", {
              method: "POST",
              body: (() => {
                const fd = new FormData();
                fd.append("file", dataUrl);
                fd.append("folder", "/vehicles");
                return fd;
              })(),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  onChange([...images, data.url]);
                } else {
                  console.error("Upload failed:", data.error);
                }
              })
              .catch((error) => {
                console.error("Error uploading image:", error);
              });
          }
        };
        reader.readAsDataURL(file);
      });
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
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300",
          error ? "border-destructive" : "",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop images here, or click to select files
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-md overflow-hidden border border-border"
            >
              <Image
                src={image}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
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
