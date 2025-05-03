import React from 'react';
import TradingViewWidget from '../components/TradingViewWidget';
import StockScreener from '../components/StockScreener';
import StocksOverview from '../components/StocksOverview';

export default function StockPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8"> {/* Card container */}
        <h2 className="text-2xl font-bold mb-4 text-center">Stock Market</h2> {/* Title */}
        <div className="flex flex-col md:flex-row"> {/* Use flexbox for layout */}
          <div className="mb-8 md:mr-8 w-full md:w-2/3"> {/* Increased width for TradingViewWidget */}
            <TradingViewWidget />
          </div>
          <div className="mb-8 md:ml-4 w-full md:w-1/3"> {/* Adjusted width for StocksOverview */}
            <StocksOverview />
          </div>
        </div>
      </div>
      <div className="mt-12">
        <StockScreener />
      </div>
    </div>
  );
}