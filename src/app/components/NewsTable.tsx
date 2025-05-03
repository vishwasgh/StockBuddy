'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface NewsItem {
  title: string;
  description: string;
  link: string;
}

const newsTypes = ['last24h', 'worldnews', 'indianews', 'stocknews', 'iponews', 'commoditynews', 'cryptonews'];

const NewsTable: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsType, setNewsType] = useState('last24h');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/get-news-data?scraping_tool=playwright&browser=firefox&news_type=${newsType}`);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [newsType]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Market News</h2>
        
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {item.title}
                </a>
              </TableCell>
              <TableCell>{item.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NewsTable;

