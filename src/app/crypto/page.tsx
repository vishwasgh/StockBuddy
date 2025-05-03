'use client';

import CryptoHeatmap from '../components/CryptoHeatmap';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

interface Crypto {
  Symbol: string;
  Price: number; // Changed to number for easier calculations
  Change: number; // Changed to number for easier calculations
}

export default function CryptoPage() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [previousPrices, setPreviousPrices] = useState<{ [key: string]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [cryptosPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchCryptos = async () => {
    try {
      const response = await fetch('http://localhost:2000/get-crypto-screener');
      const data = await response.json();

      // Transform the data into an array of Crypto objects
      const cryptoArray: Crypto[] = Object.keys(data.symbol).map(key => {
        const currentPrice = parseFloat(data.price[key]);
        const previousPrice = previousPrices[data.symbol[key]] || currentPrice; // Get previous price or current if not available
        const change = ((currentPrice - previousPrice) / previousPrice) * 100; // Calculate change percentage

        return {
          Symbol: data.symbol[key],
          Price: currentPrice,
          Change: change,
        };
      });

      setCryptos(cryptoArray);
      // Update previous prices
      const updatedPreviousPrices = { ...previousPrices };
      cryptoArray.forEach(crypto => {
        updatedPreviousPrices[crypto.Symbol] = crypto.Price; // Update previous price
      });
      setPreviousPrices(updatedPreviousPrices);
    } catch (error) {
      console.error("Error fetching cryptocurrencies:", error);
    }
  };

  useEffect(() => {
    fetchCryptos(); // Initial fetch
    const interval = setInterval(fetchCryptos, 5 * 1000); 

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  const handleRowClick = (symbol: string) => {
    router.push(`/crypto/${symbol}`);
  };

  // Filter cryptocurrencies based on the search term
  const filteredCryptos = cryptos.filter(crypto => 
    crypto.Symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the cryptocurrencies to display for the current page
  const indexOfLastCrypto = currentPage * cryptosPerPage;
  const indexOfFirstCrypto = indexOfLastCrypto - cryptosPerPage;
  const currentCryptos = filteredCryptos.slice(indexOfFirstCrypto, indexOfLastCrypto);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCryptos.length / cryptosPerPage);

  return (
    <div className="container mx-auto px-4 py-8 pt-20 space-y-4 flex flex-col md:flex-row">
      <div className="flex-1 md:w-2/3"> {/* Table container */}
        <h1 className="text-3xl font-bold mb-8">Cryptocurrency Market</h1>
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 max-w-md"
        />
        <div className="rounded-md border shadow-md w-full">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Symbol</TableHead>
                  <TableHead className="font-bold">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCryptos.length > 0 ? (
                  currentCryptos.map((crypto) => {
                    const priceColor = crypto.Change >= 0 ? 'text-green-500' : 'text-red-500';

                    return (
                      <TableRow 
                        key={crypto.Symbol} 
                        onClick={() => handleRowClick(crypto .Symbol)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="text-lg font-semibold">{crypto.Symbol}</TableCell>
                        <TableCell className={`${priceColor} text-lg font-bold`}>${crypto.Price.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">No cryptocurrencies found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-between mt-4 w-full">
          <Button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span> Page {currentPage} of {totalPages}</span>
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="md:w-1/3 md:pl-4"> {/* Heatmap container */}
        <CryptoHeatmap/>
      </div>
    </div>
  );
}