import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface MultipleImageUploadProps {
  images: string[];
  onChange: (value: string[]) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
  maxFiles?: number;
  label: string;
}

export function MultipleImageUpload({
  images,
  onChange,
  onRemove,
  disabled,
  maxFiles = 10,
  label
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadError(null);
    const uploadedUrls: string[] = [];

    try {
      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/imagekit/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Upload response:", errorText);
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.error || "Upload failed");
          }

          uploadedUrls.push(data.url);
        } catch (error) {
          console.error("Individual file upload error:", error);
          throw error;
        }
      }

      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [images, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: maxFiles - images.length,
    disabled: isUploading || disabled || images.length >= maxFiles
  });

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} ({images.length}/{maxFiles})
      </label>
      
      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          <p className="font-medium">Upload failed:</p>
          <p className="text-sm">{uploadError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={`Upload ${index + 1}`}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <button
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {images.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg transition cursor-pointer ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:bg-gray-50'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <UploadCloud className={`h-10 w-10 ${
              isDragActive ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <p className="text-sm text-center text-gray-500">
              {isUploading 
                ? "Uploading..." 
                : isDragActive
                ? "Drop the files here..."
                : `Drop up to ${maxFiles - images.length} images here, or click to select`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
