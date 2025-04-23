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
import { Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { formatDistanceToNow } from "date-fns";

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
      // Filter news by search query
      fetchNewsWithQuery();
    } else {
      // Filter videos by search query
      fetchVideosWithQuery();
    }
  };

  const fetchNewsWithQuery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/news?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data.success && data.articles) {
        setNewsItems(data.articles);
      }
    } catch (error) {
      console.error("Failed to fetch news with query:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideosWithQuery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/videos?q=${encodeURIComponent(searchQuery)}&vehicleType=${selectedVehicleType}`
      );
      const data = await response.json();
      if (data.success && data.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error("Failed to fetch videos with query:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleTypeChange = (type: string) => {
    setSelectedVehicleType(type);
    fetchVideosWithFilteredType(type);
  };

  const fetchVideosWithFilteredType = async (type: string) => {
    setIsLoading(true);
    try {
      const query = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : "";
      const response = await fetch(`/api/videos?vehicleType=${type}${query}`);
      const data = await response.json();
      if (data.success && data.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error("Failed to fetch videos with filter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Automotive News & Reviews
        </h1>
        <p className="text-muted-foreground mt-2">
          Stay updated with the latest automotive news and reviews from India
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="news">
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
                News
              </span>
            </TabsTrigger>
            <TabsTrigger value="videos">
              <span className="flex items-center gap-2">
                <Youtube size={18} />
                Reviews
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Input
              placeholder={
                activeTab === "news" ? "Search news..." : "Search reviews..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[300px]"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        <TabsContent value="news" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.imageUrl || "/placeholder-news.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">
                      {item.title}
                    </CardTitle>
                    <CardDescription>
                      {item.source} •{" "}
                      {formatDistanceToNow(new Date(item.publishedAt), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {item.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Read full article
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No news articles found</h3>
              <p className="text-muted-foreground mt-2">
                Try changing your search query
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              variant={selectedVehicleType === "all" ? "default" : "outline"}
              onClick={() => handleVehicleTypeChange("all")}
            >
              All
            </Button>
            <Button
              variant={selectedVehicleType === "car" ? "default" : "outline"}
              onClick={() => handleVehicleTypeChange("car")}
            >
              Cars
            </Button>
            <Button
              variant={selectedVehicleType === "bike" ? "default" : "outline"}
              onClick={() => handleVehicleTypeChange("bike")}
            >
              Bikes
            </Button>
            <Button
              variant={
                selectedVehicleType === "electric" ? "default" : "outline"
              }
              onClick={() => handleVehicleTypeChange("electric")}
            >
              Electric
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <Link
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative h-48 w-full group"
                  >
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="ml-1"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">
                      <Link
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500"
                      >
                        {video.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {video.channelTitle} •{" "}
                      {formatDistanceToNow(new Date(video.publishedAt), {
                        addSuffix: true,
                      })}
                      {video.viewCount && ` • ${video.viewCount} views`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No videos found</h3>
              <p className="text-muted-foreground mt-2">
                Try changing your search query or filters
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
