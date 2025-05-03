// src/app/CryptoPage.tsx
'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import CryptoData from '@/app/components/CryptoData';
import CryptoPredictor from '@/app/components/CryptoPrediction';
import CryptoImageAnalysis from '@/app/components/CryptoImageAnalysis';
import CryptoChart from '@/app/components/CryptoChart';


export default function CryptoPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = React.use(params);
  const symbol = resolvedParams?.symbol.toUpperCase();

  if (!symbol) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h3 className="text-lg font-semibold">{symbol}</h3>
      <div className="mt-8 p-6 w-full h-96 bg-white rounded-lg shadow-lg">
        <CryptoChart symbol={symbol} />
      </div>
      <div className="mt-8">
        <CryptoData symbol={symbol} />
      </div>
      <div className="mt-8">
        <CryptoPredictor symbol={symbol} />
      </div>
      <div className="mt-8">
        <CryptoImageAnalysis symbol={symbol} />
      </div>
   {/*   <div className="mt-8">
        <Backtest symbol={symbol} /> {/* Pass the symbol to the Backtest component 
      </div> 
    */}
    </div>
  );
}