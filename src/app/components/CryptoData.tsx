'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface CryptoDataProps {
  symbol: string;
}

interface CryptoDataResponse {
  Open: Record<string, number>;
  High: Record<string, number>;
  Low: Record<string, number>;
  Close: Record<string, number>;
  Volume: Record<string, number>;
}

const CryptoData: React.FC<CryptoDataProps> = ({ symbol }) => {
  const [cryptoData, setCryptoData] = useState<CryptoDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      setError(null);
      try {
        const response = await fetch(`http://localhost:2000/get-stock-data?ticker=${symbol}&interval=1min&api=binance`);
        if (!response.ok) {
          throw new Error('Failed to fetch cryptocurrency data');
        }
        const data: CryptoDataResponse = await response.json();
        setCryptoData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cryptocurrency data:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cryptocurrency data');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchCryptoData();

    // Auto-refresh every 5 seconds (5000 ms)
    const interval = setInterval(fetchCryptoData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return <div>Loading cryptocurrency data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!cryptoData) {
    return null; 
  }

  // Extract the latest data points
  const timestamps = Object.keys(cryptoData.Close);
  const latestTimestamp = timestamps[timestamps.length - 1];
  const previousTimestamp = timestamps[timestamps.length - 2];

  const currentPrice = cryptoData.Close[latestTimestamp];
  const previousPrice = cryptoData.Close[previousTimestamp];
  const priceChange = currentPrice - previousPrice;
  const percentageChange = (priceChange / previousPrice) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Performance of {symbol}</CardTitle>
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
            <div className="font-semibold">₹{cryptoData.Open[latestTimestamp].toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">High</div>
            <div className="font-semibold">₹{Math.max(...Object.values(cryptoData.High)).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Low</div>
            <div className="font-semibold">₹{Math.min(...Object.values(cryptoData.Low)).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Volume</div>
            <div className="font-semibold">{cryptoData.Volume[latestTimestamp].toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoData;
