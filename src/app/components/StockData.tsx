'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface StockDataProps {
  ticker: string;
}

interface StockDataResponse {
  Open: Record<string, number>;
  High: Record<string, number>;
  Low: Record<string, number>;
  Close: Record<string, number>;
  Volume: Record<string, number>;
}

const StockData: React.FC<StockDataProps> = ({ ticker }) => {
  const [stockData, setStockData] = useState<StockDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:2000/get-stock-data?ticker=${ticker}&interval=1min&api=yfinance`);
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        const data: StockDataResponse = await response.json();
        setStockData(data);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [ticker]);

  if (loading) {
    return <div>Loading stock data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!stockData) {
    return null; // Handle case where stockData is null
  }

  // Extract the latest data points
  const timestamps = Object.keys(stockData.Close);
  const latestTimestamp = timestamps[timestamps.length - 1];
  const currentPrice = stockData.Close[latestTimestamp]; // Use the latest closing price
  const previousPrice = stockData.Close[timestamps[timestamps.length - 2]]; // Get the previous price
  const priceChange = currentPrice - previousPrice;
  const percentageChange = (priceChange / previousPrice) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance of {ticker}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="font-semibold">₹{currentPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Change</div>
            <div className={`font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({percentageChange.toFixed(2)}%)
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Open</div>
            <div className="font-semibold">₹{stockData.Open[latestTimestamp].toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">High</div>
            <div className="font-semibold">₹{Math.max(...Object.values(stockData.High)).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Low</div>
            <div className="font-semibold">₹{Math.min(...Object.values(stockData.Low)).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Volume</div>
            <div className="font-semibold">{stockData.Volume[latestTimestamp].toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockData;