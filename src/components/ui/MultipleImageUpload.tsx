"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface MultipleImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
  label?: string;
  usePlaceholder?: boolean;
  acceptedFileTypes?: string;
  defaultSelected?: boolean;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  images,
  onChange,
  maxFiles = 5,
  label = "Upload Images",
  usePlaceholder = false,
  acceptedFileTypes = "image/jpeg, image/png, image/webp",
  defaultSelected = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Limit the number of files
      const filesToProcess = acceptedFiles.slice(0, maxFiles - images.length);

      if (filesToProcess.length === 0) return;

      setIsUploading(true);

      try {
        // Convert files to Data URLs
        const newImages = await Promise.all(
          filesToProcess.map((file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(file);
            });
          })
        );

        // Update the state with new images
        onChange([...images, ...newImages]);
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [images, maxFiles, onChange]
  );

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes
      ? { "image/*": [".jpeg", ".jpg", ".png", ".webp"] }
      : undefined,
    maxFiles: Math.max(0, maxFiles - images.length),
    disabled: images.length >= maxFiles || isUploading,
  });

  // Remove an image
  const removeImage = useCallback(
    (index: number) => {
      // Create a new array without the removed image
      const updatedImages = images.filter((_, i) => i !== index);
      onChange(updatedImages);
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary"
          }
          ${
            images.length >= maxFiles || isUploading
              ? "opacity-60 cursor-not-allowed"
              : ""
          }`}
      >
        <input
          {...getInputProps()}
          disabled={images.length >= maxFiles || isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
          <Upload className="h-8 w-8" />
          <p className="text-sm font-medium">
            {isDragActive
              ? "Drop the images here..."
              : images.length >= maxFiles
              ? `Maximum of ${maxFiles} images reached`
              : `Click or drag to upload ${label}`}
          </p>
          <p className="text-xs">
            {images.length < maxFiles &&
              !isUploading &&
              `${images.length} of ${maxFiles} images uploaded`}
            {isUploading && "Uploading..."}
          </p>
        </div>
      </div>

      {/* Image preview area */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-md overflow-hidden border">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 
                           shadow hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No images + placeholder option */}
      {images.length === 0 && usePlaceholder && defaultSelected && (
        <div className="flex items-center justify-center p-4 border rounded-md">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <ImageIcon className="h-6 w-6" />
            <span>No images selected, a placeholder will be used</span>
          </div>
        </div>
      )}
    </div>
  );
};
