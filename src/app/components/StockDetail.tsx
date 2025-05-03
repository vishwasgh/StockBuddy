'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Bell, Star } from 'lucide-react';
import StockData from './StockData';
import StockPrediction from './StockPrediction';
import ImageAnalysis from './ImageAnalysis';
import { StockData as StockDataType } from '@/types/stock';


interface StockDetailProps {
  stock: StockDataType;
}

export default function StockDetail({ stock }: StockDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{stock.ticker}</h1>
          <div className="flex items-baseline gap-2 mt-2">
            {/* Additional elements can go here */}
          </div>
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Stock Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-8 p-6 w-full h-96 bg-white rounded-lg shadow-lg">
              <SingleStockWidget symbol={stock.ticker} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto px-4 py-8 pt-20">
        <StockData {...stock} />
      </div>

      <StockPrediction ticker={stock.ticker} />
      <ImageAnalysis ticker={stock.ticker} />

      
    </div>
  );
}

function SingleStockWidget({ symbol }: { symbol: string }) {
  const container = React.useRef<HTMLDivElement>(null);
  const scriptId = `tradingview-widget-${symbol}`; // Unique ID for the script

  React.useEffect(() => {
    // Check if the script already exists in the container
    if (container.current && !document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [[`BSE:${symbol}|1MIN`]],
        chartOnly: false,
        width: '100%',
        height: '100%',
        locale: 'en',
        colorTheme: 'light',
        autosize: true,
        showVolume: false,
        showMA: false,
        hideDateRanges: false,
        hideMarketStatus: false,
        hideSymbolLogo: false,
        scalePosition: 'right',
        scaleMode: 'Normal',
        fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
        fontSize: '10',
        noTimeScale: false,
        valuesTracking: '1',
        changeMode: 'price-and-percent',
        chartType: 'area',
        lineWidth: 2,
        lineType: 0,
      });

      container.current.appendChild(script);
    }

    return () => {
      // Clean up the widget on component unmount
      if (container.current) {
        const scriptElement = document.getElementById(scriptId);
        if (scriptElement) {
          scriptElement.remove();
        }
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container h-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
}



