'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

// Define the types for news items and news data
interface NewsItemProps {
  title: string;
  description: string;
  source: string;
  date: string;
  link: string; // Added link property
}

interface NewsData {
  last24h: NewsItemProps[];
  indianews: NewsItemProps[];
  stocknews: NewsItemProps[];
  iponews: NewsItemProps[];
  commoditynews: NewsItemProps[];
  cryptonews: NewsItemProps[];
}

// News item component
const NewsItem: React.FC<NewsItemProps> = ({ title, description, source, date, link }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{source}</span>
        <span>{date}</span>
      </div>
      <a href={link} className="text-blue-500">Read more</a>
    </CardContent>
  </Card>
);

export default function MarketNewsPage() {
  const [newsData, setNewsData] = useState<NewsData>({
    last24h: [],
    indianews: [],
    stocknews: [],
    iponews: [],
    commoditynews: [],
    cryptonews: [],
  }); // Initialize with empty arrays
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to manage error messages
  const [activeTab, setActiveTab] = useState<keyof NewsData>("last24h"); // State to manage the active tab

  // Fetch news data from the API based on the active tab
  const fetchNewsData = async (newsType: keyof NewsData) => {
    try {
      const response = await fetch(`http://localhost:2000/get-news-data?scraping_tool=playwright&browser=firefox&news_type=${newsType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }
      const data = await response.json();

      // Log the data to see its structure
      console.log("API Response:", data);

      // Check if Titles and Descriptions are objects
      if (typeof data.Titles !== 'object' || typeof data.Descriptions !== 'object') {
        throw new Error('Invalid data format: Titles or Descriptions is not an object');
      }

      // Transform the API response into the expected format
      const transformedData: NewsItemProps[] = Object.keys(data.Titles).map((key) => ({
        title: data.Titles[key],
        description: data.Descriptions[key] || '',
        source: data.source, // Replace with actual source if available
        date: new Date().toLocaleDateString(), // Replace with actual date if available
        link: data.Links[key] || '', // Add link if available
      }));

      // Update the state safely
      setNewsData((prevData) => ({
        ...prevData,
        [newsType]: transformedData, // Set the specific news type data
      }));
    } catch (err) {
      console.error("Error fetching news data:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData(activeTab); // Fetch news data when the component mounts or when the active tab changes
  }, [activeTab]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error message
  }

  // Get the current items based on the active tab
  const currentItems = newsData[activeTab] || [];

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-8">Market News</h1> 
      <Tabs defaultValue="last24h" className="w-full" onValueChange={(value) => setActiveTab(value as keyof NewsData)}>
        <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 h-auto">
          <TabsTrigger value="last24h">Last 24h</TabsTrigger>
          <TabsTrigger value="indianews">India News</TabsTrigger>
          <TabsTrigger value="stocknews">Stock News</TabsTrigger>
          <TabsTrigger value="iponews">IPO News</TabsTrigger>
          <TabsTrigger value="commoditynews">Commodity News</TabsTrigger>
          <TabsTrigger value="cryptonews"><h1>Crypto News</h1></TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {currentItems.map((item: NewsItemProps, index: number) => (
            <NewsItem key={index} {...item} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}