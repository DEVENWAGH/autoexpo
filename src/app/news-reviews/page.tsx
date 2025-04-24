"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Youtube, Play, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/navbar/Navbar";
import VideoPlayer from "@/components/VideoPlayer";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
}

export default function NewsReviewsPage() {
  const [activeTab, setActiveTab] = useState("news");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVehicleType, setSelectedVehicleType] = useState("all");
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    fetchNewsItems();
    fetchVideos();
  }, []);

  const fetchNewsItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/news`);
      const data = await response.json();
      if (data.success && data.articles) {
        setNewsItems(data.articles);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/videos?vehicleType=${selectedVehicleType}`
      );
      const data = await response.json();
      if (data.success && data.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === "news") {
      fetchNewsItems();
    } else {
      fetchVideos();
    }
  };

  const handleVehicleTypeChange = (type: string) => {
    setSelectedVehicleType(type);
  };

  const handlePlayVideo = (video: VideoItem) => {
    setPlayingVideo(video);
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-8 pt-24">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Automotive News & Reviews
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Stay updated with the latest automotive news and reviews from India
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList className="h-auto w-full sm:w-auto">
              <TabsTrigger value="news" className="flex-1 sm:flex-initial">
                <span className="flex items-center gap-2 text-xs sm:text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hidden sm:inline"
                  >
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6Z" />
                  </svg>
                  News
                </span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex-1 sm:flex-initial">
                <span className="flex items-center gap-2 text-xs sm:text-sm">
                  <Youtube size={16} className="hidden sm:inline" />
                  Reviews
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="flex w-full sm:w-auto">
              <Input
                placeholder={
                  activeTab === "news" ? "Search news..." : "Search reviews..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-r-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button
                onClick={handleSearch}
                className="rounded-l-none px-3"
                size="sm"
              >
                <Search size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>

          <TabsContent value="news" className="mt-4 sm:mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-36 sm:h-48 w-full" />
                    <CardHeader className="p-3 sm:p-6">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6 pt-0">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : newsItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {newsItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden flex flex-col h-full"
                  >
                    <div className="relative h-36 sm:h-48 w-full">
                      <Image
                        src={item.imageUrl || "/placeholder-news.jpg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="line-clamp-2 text-base sm:text-lg">
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-500 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {item.source} •{" "}
                        {formatDistanceToNow(new Date(item.publishedAt), {
                          addSuffix: true,
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6 pt-0 flex-grow">
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3">
                        {item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-3 sm:p-6 pt-0">
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs sm:text-sm"
                      >
                        Read full article
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <h3 className="text-lg sm:text-xl font-medium">
                  No news articles found
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                  Try changing your search query
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="mt-4 sm:mt-6">
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2">
              <Button
                variant={selectedVehicleType === "all" ? "default" : "outline"}
                onClick={() => handleVehicleTypeChange("all")}
                size="sm"
                className="min-w-[60px] text-xs sm:text-sm"
              >
                All
              </Button>
              <Button
                variant={selectedVehicleType === "car" ? "default" : "outline"}
                onClick={() => handleVehicleTypeChange("car")}
                size="sm"
                className="min-w-[60px] text-xs sm:text-sm"
              >
                Cars
              </Button>
              <Button
                variant={selectedVehicleType === "bike" ? "default" : "outline"}
                onClick={() => handleVehicleTypeChange("bike")}
                size="sm"
                className="min-w-[60px] text-xs sm:text-sm"
              >
                Bikes
              </Button>
              <Button
                variant={
                  selectedVehicleType === "electric" ? "default" : "outline"
                }
                onClick={() => handleVehicleTypeChange("electric")}
                size="sm"
                className="min-w-[60px] text-xs sm:text-sm"
              >
                Electric
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-36 sm:h-48 w-full" />
                    <CardHeader className="p-3 sm:p-6">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6 pt-0">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {videos.map((video) => {
                  let videoId = "";

                  if (video.id && video.id.length === 11) {
                    videoId = video.id;
                  } else {
                    const match = video.videoUrl?.match(
                      /(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/
                    );
                    if (match && match[1]) {
                      videoId = match[1];
                    }
                  }

                  const thumbnailUrl = videoId
                    ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
                    : "/images/placeholder-video.jpg";

                  if (!video.title || video.title.length < 5) {
                    return null;
                  }

                  return (
                    <Card
                      key={video.id || videoId}
                      className="overflow-hidden flex flex-col h-full"
                    >
                      <button
                        onClick={() => handlePlayVideo(video)}
                        className="block relative h-36 sm:h-48 w-full group bg-gray-200"
                        aria-label={`Play ${video.title}`}
                      >
                        <Image
                          src={thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          unoptimized={false}
                          onError={(e) => {
                            console.log("Image failed to load:", thumbnailUrl);
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;

                            if (thumbnailUrl.includes("mqdefault")) {
                              target.src = thumbnailUrl.replace(
                                "mqdefault",
                                "hqdefault"
                              );
                            } else if (thumbnailUrl.includes("hqdefault")) {
                              target.src = thumbnailUrl.replace(
                                "hqdefault",
                                "default"
                              );
                            } else {
                              target.src = "/images/placeholder-video.jpg";
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play fill="white" size={24} className="ml-1" />
                          </div>
                        </div>
                      </button>
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle className="line-clamp-2 text-base sm:text-lg">
                          <button
                            onClick={() => handlePlayVideo(video)}
                            className="text-left hover:text-blue-500 transition-colors"
                          >
                            {video.title}
                          </button>
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          {video.channelTitle} •{" "}
                          {formatDistanceToNow(new Date(video.publishedAt), {
                            addSuffix: true,
                          })}
                          {video.viewCount && ` • ${video.viewCount} views`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6 pt-0 flex-grow">
                        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
                          {video.description}
                        </p>
                      </CardContent>
                      <CardFooter className="p-3 sm:p-6 pt-0">
                        <Button
                          variant="outline"
                          onClick={() => handlePlayVideo(video)}
                          className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm py-1 sm:py-2"
                          size="sm"
                        >
                          <Youtube size={16} />
                          Watch Review
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <h3 className="text-lg sm:text-xl font-medium">
                  No videos found
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                  Try changing your search query or filters
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {playingVideo && (
        <VideoPlayer
          url={playingVideo.videoUrl}
          embedUrl={playingVideo.embedUrl}
          title={playingVideo.title}
          onClose={() => setPlayingVideo(null)}
        />
      )}
    </div>
  );
}
