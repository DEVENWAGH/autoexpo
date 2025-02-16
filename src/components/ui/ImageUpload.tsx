'use client';

import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
    onUploadSuccess: (url: string, fileId: string) => void;
    onUploadError: (error: Error) => void;
    label?: string;
    isMultiple?: boolean;
}

export function ImageUpload({ 
    onUploadSuccess, 
    onUploadError, 
    label = 'Upload Image',
    isMultiple = false 
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = useCallback(async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/imagekit/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Upload failed');
            }

            const data = await response.json();
            onUploadSuccess(data.url, data.fileId);
        } catch (error) {
            onUploadError(error instanceof Error ? error : new Error('Upload failed'));
        } finally {
            setUploading(false);
        }
    }, [onUploadSuccess, onUploadError]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        if (isMultiple) {
            Array.from(files).forEach(file => handleUpload(file));
        } else {
            handleUpload(files[0]);
        }
    }, [handleUpload, isMultiple]);

    return (
        <div className="relative">
            <input
                type="file"
                onChange={handleChange}
                multiple={isMultiple}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
            />
            <div className={`flex items-center justify-center px-6 py-4 border-2 border-dashed rounded-lg ${
                uploading ? 'border-gray-600 bg-gray-800/50' : 'border-gray-700 hover:border-gray-500'
            }`}>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Upload className="w-5 h-5" />
                    <span>{uploading ? 'Uploading...' : label}</span>
                </div>
            </div>
        </div>
    );
}
