"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  title: string;
  embedUrl?: string;
  onClose: () => void;
}

export default function VideoPlayer({
  url,
  title,
  embedUrl,
  onClose,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);

  // Extract YouTube video ID from URL if embedUrl is not provided
  const getYoutubeEmbedUrl = (url: string): string => {
    if (embedUrl) return embedUrl;

    // Try to extract YouTube ID from various URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }

    // Return original URL if no match found
    return url;
  };

  const youtubeEmbedUrl = getYoutubeEmbedUrl(url);

  useEffect(() => {
    // Add event listener for escape key to close the modal
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    // Remove scroll from body
    document.body.style.overflow = "hidden";

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close if clicking outside the video container
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-2 bg-gray-800 text-white">
          <h3 className="text-sm md:text-base line-clamp-1">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close video"
          >
            <X size={20} />
          </button>
        </div>

        <div className="aspect-video relative">
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          <iframe
            src={youtubeEmbedUrl}
            title={title}
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0"
            onLoad={() => setIsReady(true)}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
