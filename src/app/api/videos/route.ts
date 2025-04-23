import { NextRequest, NextResponse } from "next/server";

// YouTube API key - Replace with your actual API key
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEO_DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleType = searchParams.get("vehicleType") || "all";
    const query = searchParams.get("q") || "";
    
    let searchQuery = "";
    
    if (vehicleType === "all") {
      searchQuery = query ? `${query} car bike review india` : "car bike review india";
    } else if (vehicleType === "car") {
      searchQuery = query ? `${query} car review india` : "car review india";
    } else if (vehicleType === "bike") {
      searchQuery = query ? `${query} bike motorcycle review india` : "bike motorcycle review india";
    } else if (vehicleType === "electric") {
      searchQuery = query ? `${query} electric vehicle review india` : "electric vehicle review india";
    }
    
    if (YOUTUBE_API_KEY) {
      // Fetch videos from YouTube
      const response = await fetch(
        `${YOUTUBE_API_URL}?part=snippet&maxResults=12&q=${encodeURIComponent(
          searchQuery
        )}&type=video&regionCode=IN&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const videoIds = data.items.map((item: any) => item.id.videoId).join(",");

      // Get additional details for the videos (view count, etc.)
      const detailsResponse = await fetch(
        `${YOUTUBE_VIDEO_DETAILS_URL}?part=statistics,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

      if (!detailsResponse.ok) {
        throw new Error(`YouTube details API responded with status: ${detailsResponse.status}`);
      }

      const detailsData = await detailsResponse.json();
      
      // Build a map of video details
      const videoDetailsMap: Record<string, any> = {};
      detailsData.items.forEach((item: any) => {
        videoDetailsMap[item.id] = item;
      });

      // Map the API response to our format with additional details
      const videos = data.items.map((item: any) => {
        const videoId = item.id.videoId;
        const details = videoDetailsMap[videoId];
        const viewCount = details?.statistics?.viewCount 
          ? formatViewCount(parseInt(details.statistics.viewCount)) 
          : undefined;
          
        return {
          id: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          viewCount,
        };
      });

      return NextResponse.json({
        success: true,
        videos,
      });
    } else {
      // Return mock data if API key is missing
      return NextResponse.json({
        success: true,
        videos: getMockVideoData(vehicleType, query),
      });
    }
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    
    // Return mock data if API fails
    const { searchParams } = new URL(request.url);
    const vehicleType = searchParams.get("vehicleType") || "all";
    const query = searchParams.get("q") || "";
    
    return NextResponse.json({
      success: true,
      videos: getMockVideoData(vehicleType, query),
    });
  }
}

// Format view count to human-readable format (e.g., 1.5M)
function formatViewCount(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  } else {
    return views.toString();
  }
}

// Mock video data for development or when API fails
function getMockVideoData(vehicleType = "all", query = "") {
  let videos = [
    {
      id: "video-1",
      title: "Tata Harrier 2023 Review - Most Advanced Tata SUV Ever!",
      description: "Check out our detailed review of the all-new Tata Harrier 2023 with ADAS features",
      thumbnailUrl: "/images/videos/tata-harrier.jpg",
      videoUrl: "https://www.youtube.com/watch?v=example1",
      channelTitle: "Indian Auto Reviews",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: "1.2M",
    },
    {
      id: "video-2",
      title: "Royal Enfield Himalayan 450 - First Ride Review",
      description: "We test the new Royal Enfield Himalayan 450 on various terrains to see how it performs",
      thumbnailUrl: "/images/videos/re-himalayan.jpg",
      videoUrl: "https://www.youtube.com/watch?v=example2",
      channelTitle: "BikeWorld India",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: "856K",
    },
    {
      id: "video-3",
      title: "Mahindra XUV700 vs Scorpio N - Which SUV to Buy?",
      description: "Detailed comparison review between Mahindra's flagship SUVs - XUV700 and Scorpio N",
      thumbnailUrl: "/images/videos/mahindra-comparison.jpg",
      videoUrl: "https://www.youtube.com/watch?v=example3",
      channelTitle: "Car Analysis",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: "2.1M",
    },
    {
      id: "video-4",
      title: "Honda Activa 6G vs TVS Jupiter - Best 110cc Scooter?",
      description: "Comprehensive comparison between the two most popular 110cc scooters in India",
      thumbnailUrl: "/images/videos/activa-jupiter.jpg",
      videoUrl: "https://www.youtube.com/watch?v=example4",
      channelTitle: "Scooter Guide",
      publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: "754K",
    },
    {
      id: "video-5",
      title: "Ola S1 Pro Electric Scooter - Long Term Review After 10,000km",
      description: "My experience with the Ola S1 Pro after riding it for 10,000 kilometers",
      thumbnailUrl: "/images/videos/ola-s1.jpg",
      videoUrl: "https://www.youtube.com/watch?v=example5",
      channelTitle: "Electric Vehicle Guide",
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: "1.5M",
    },
    {
      id: "video-6",
      title: "Maruti Suzuki Grand Vitara Hybrid - Detailed Mileage Test",
      description: "Testing the real-world fuel efficiency of the Grand Vitara Strong Hybrid in city and highway",
      thumbnailUrl: "/images/videos/grand-vitara.jpg",
      videoUrl: "https://www.youtube.com/watch?v=example6",
      channelTitle: "Mileage Master",
      publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: "980K",
    },
  ];

  // Filter based on vehicle type
  if (vehicleType === "car") {
    videos = videos.filter(v => 
      !v.title.toLowerCase().includes("bike") && 
      !v.title.toLowerCase().includes("scooter") &&
      !v.title.toLowerCase().includes("motorcycle") &&
      !v.title.toLowerCase().includes("himalayan"));
  } else if (vehicleType === "bike") {
    videos = videos.filter(v => 
      v.title.toLowerCase().includes("bike") || 
      v.title.toLowerCase().includes("scooter") ||
      v.title.toLowerCase().includes("motorcycle") ||
      v.title.toLowerCase().includes("himalayan") ||
      v.title.toLowerCase().includes("activa") ||
      v.title.toLowerCase().includes("jupiter"));
  } else if (vehicleType === "electric") {
    videos = videos.filter(v => 
      v.title.toLowerCase().includes("electric") || 
      v.title.toLowerCase().includes("ev") ||
      v.title.toLowerCase().includes("ola"));
  }

  // Filter based on query
  if (query) {
    const lowerQuery = query.toLowerCase();
    videos = videos.filter(v => 
      v.title.toLowerCase().includes(lowerQuery) || 
      v.description.toLowerCase().includes(lowerQuery) ||
      v.channelTitle.toLowerCase().includes(lowerQuery));
  }

  return videos;
}
