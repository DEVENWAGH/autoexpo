import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      const file = acceptedFiles[0];
      
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    disabled: isUploading || disabled
  });

  return (
    <div className="mb-4 relative">
      {value ? (
        <div className="relative w-full h-60">
          <Image
            src={value}
            alt="Upload"
            className="object-cover"
            fill
          />
          <button
            onClick={() => onRemove(value)}
            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 p-4 rounded-lg hover:bg-gray-50 transition cursor-pointer"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <UploadCloud className="h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-500">
              {isUploading ? "Uploading..." : "Drop an image here, or click to select"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
