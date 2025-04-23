import { NextRequest, NextResponse } from "next/server";

// News API key - Replace with your actual API key
const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
const NEWS_API_URL = "https://newsapi.org/v2/everything";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "automobile india car bike";
    
    // Fetch news from NewsAPI
    const response = await fetch(
      `${NEWS_API_URL}?q=${encodeURIComponent(
        query + " automobile india"
      )}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Map the API response to our format
    const articles = data.articles.map((article: any, index: number) => ({
      id: `news-${index}-${Date.now()}`,
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage || "/placeholder-news.jpg",
      publishedAt: article.publishedAt,
      source: article.source.name,
    }));

    return NextResponse.json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    
    // Return mock data if API fails (useful for development or when API key is missing)
    return NextResponse.json({
      success: true,
      articles: getMockNewsData(),
    });
  }
}

// Mock news data for development or when API fails
function getMockNewsData() {
  return [
    {
      id: "news-1",
      title: "Tata Motors Unveils New Electric SUV with 500km Range",
      description: "Tata Motors has launched its latest electric SUV in the Indian market with an impressive 500km range on a single charge, setting a new benchmark for electric vehicles in India.",
      url: "#",
      imageUrl: "/images/news/tata-ev.jpg",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Auto India Today",
    },
    {
      id: "news-2",
      title: "Maruti Suzuki Announces New Hybrid Technology for Small Cars",
      description: "Maruti Suzuki has announced the development of a new hybrid technology that will be implemented in their small car lineup, promising up to 35% better fuel efficiency.",
      url: "#",
      imageUrl: "/images/news/maruti-hybrid.jpg",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Car & Bike India",
    },
    {
      id: "news-3",
      title: "Royal Enfield Launches 650cc Adventure Tourer",
      description: "Royal Enfield has expanded its 650cc lineup with a new adventure touring motorcycle aimed at the premium segment, featuring modern technology and classic design elements.",
      url: "#",
      imageUrl: "/images/news/royal-enfield.jpg",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Bike Dekho",
    },
    {
      id: "news-4",
      title: "Hyundai to Introduce Level 2 ADAS Features Across All Models",
      description: "Hyundai has announced plans to introduce Level 2 Advanced Driver Assistance Systems (ADAS) across its entire model range in India within the next two years.",
      url: "#",
      imageUrl: "/images/news/hyundai-adas.jpg",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Auto Car India",
    },
    {
      id: "news-5",
      title: "Mahindra XUV700 Gets New Cutting-Edge Connected Features",
      description: "Mahindra has updated its flagship SUV, the XUV700, with new connected car features including remote engine start/stop, geo-fencing, and enhanced voice commands.",
      url: "#",
      imageUrl: "/images/news/mahindra-xuv.jpg",
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Motor Octane",
    },
    {
      id: "news-6",
      title: "Honda Motorcycle Launches BS6 Phase 2 Compliant Models",
      description: "Honda Motorcycle and Scooter India has updated its entire lineup to comply with the BS6 Phase 2 emission norms with minimal price increases across models.",
      url: "#",
      imageUrl: "/images/news/honda-bs6.jpg",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      source: "ZigWheels",
    },
  ];
}
