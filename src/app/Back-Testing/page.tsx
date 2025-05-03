'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button'; // Ensure this path is correct
import { Input } from '@/app/components/ui/input'; // Ensure this path is correct
import Backtest from './Backtest';

const BackTestingPage: React.FC = () => {
  const [symbol, setSymbol] = useState<string>(''); // Initialize with an empty string

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value); // Update the symbol state with user input
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission
    // You can add any additional logic here if needed
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-8">Back Testing For Stocks</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex">
        <Input
          type="text"
          value={symbol}
          onChange={handleInputChange}
          className="border rounded p-2 mr-2 flex-1"
          placeholder="Enter stock symbol without space"
          required // Make the input required
        />
        
      </form>
      {symbol && <Backtest symbol={symbol} />} {/* Render Backtest component only if symbol is provided */}
    </div>
  );
};

export default BackTestingPage;