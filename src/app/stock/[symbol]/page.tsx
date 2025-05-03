'use client';

import React, { useEffect, useState } from 'react';
import StockDetail from '../../components/StockDetail';
import { fetchStockData } from '../../../lib/api';
import { StockData } from '@/types/stock';
import { notFound } from 'next/navigation';
import { Card, CardContent } from "@/app/components/ui/card";


export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = React.use(params);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        const symbol = await resolvedParams.symbol; // Ensure symbol is resolved
        const data = await fetchStockData(symbol);
        
        if (!data) {
          throw new Error('No data returned from API');
        }
        
        setStockData(data);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getStockData();
  }, [resolvedParams]);

  // Access the query parameter
  const tvWidgetSymbol = new URLSearchParams(window.location.search).get('tvwidgetsymbol');

  // Extract the stock name from the tvWidgetSymbol if it exists
  const stockName = tvWidgetSymbol ? tvWidgetSymbol.split(':')[1] : null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <Card>
          <CardContent className="p-6">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stockData) {
    return notFound();
  }

  // Ensure stockData is not null before accessing its properties
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      {stockName && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{stockName}</h3>
        </div>
      )}
      {/* Ensure stockData is valid before rendering StockDetail */}
      {stockData && <StockDetail stock={stockData} />}
      
    </div>
  );
}