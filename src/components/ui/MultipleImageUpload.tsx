import React, { useState, useRef, useCallback } from "react";
import { X, Upload } from "lucide-react";
import Image from "next/image";

interface MultipleImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
  label?: string;
  accept?: string;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  images,
  onChange,
  onRemove,
  maxFiles = 5,
  label = "Upload Images",
  accept = "image/*",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback(
    async (files: FileList) => {
      if (images.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const remainingSlots = maxFiles - images.length;
      const filesToProcess = Math.min(remainingSlots, files.length);

      setIsUploading(true);
      setUploadError(null);

      const newImages = [...images];
      let errorOccurred = false;

      try {
        for (let i = 0; i < filesToProcess; i++) {
          const file = files[i];
          console.log(`Processing file ${i + 1}/${filesToProcess}:`, file.name);

          // Create a FormData object for the current file
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "/vehicles");

          try {
            // Upload to ImageKit through our API
            const response = await fetch("/api/imagekit/upload", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error(`Upload failed for ${file.name}:`, errorData);
              errorOccurred = true;
              continue;
            }

            const result = await response.json();
            console.log(`Upload result for ${file.name}:`, result);

            if (result.success && result.url) {
              newImages.push(result.url);
            } else {
              console.error(`No URL returned for ${file.name}`);
              errorOccurred = true;
            }
          } catch (err) {
            console.error(`Error uploading ${file.name}:`, err);
            errorOccurred = true;
          }
        }

        // Update the images state with all successfully uploaded images
        if (newImages.length > images.length) {
          onChange(newImages);
        }

        if (errorOccurred) {
          setUploadError("Some files failed to upload. Please try again.");
        }
      } catch (error) {
        console.error("Error in processFiles:", error);
        setUploadError(
          "Failed to upload one or more images. Please try again."
        );
      } finally {
        setIsUploading(false);
      }
    },
    [images, maxFiles, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        // Clear the input
        e.target.value = "";
      }
    },
    [processFiles]
  );

  return (
    <div className="w-full">
      {uploadError && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-2 mb-3 rounded text-sm">
          {uploadError}
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isUploading ? "opacity-50 pointer-events-none" : ""
        } ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-600 hover:border-gray-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-400">
            {isUploading ? "Uploading..." : "Drag and drop or click to upload"}
          </p>
          <p className="text-xs text-gray-500">
            {images.length} / {maxFiles} images
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          multiple={true}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
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
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
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
