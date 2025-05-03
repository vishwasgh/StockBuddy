'use client';

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
import { Button } from "@/app/components/ui/button"; // Adjust the import path based on your project structure
import { Input } from "@/app/components/ui/input"; // Adjust the import path based on your project structure

interface Stock {
  "Security Code": number;
  "Issuer Name": string;
  "Security Id": string;
  "Security Name": string;
  "Status": string;
  "Group": string;
  "Face Value": string;
  "ISIN No": string;
  "Industry": string;
  "Instrument": string;
  "Sector Name": string;
  "Industry New Name": string;
  "Igroup Name": string;
  "ISubgroup Name": string;
}

export default function StockScreener() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [stocksPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchStocks = async () => {
    try {
      const response = await fetch(`http://localhost:2000/stock-screener`);
      const data = await response.json();
      setStocks(data); // Assuming the API returns an array of stocks directly
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleRowClick = (securityId: string) => {
    router.push(`/stock/${securityId}`);
  };

  // Filter stocks based on the search term
  const filteredStocks = stocks.filter(stock => 
    stock["Security Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock["Issuer Name"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the stocks to display for the current page
  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = filteredStocks.slice(indexOfFirstStock, indexOfLastStock);

  // Calculate total pages
  const totalPages = Math.ceil(filteredStocks.length / stocksPerPage);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Stock Screener</h2>
      <Input
        type="text"
        placeholder="Search stocks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {currentStocks.length > 0 ? (
                  Object.keys(currentStocks[0]).map((key) => (
                    <TableHead key={key} className="cursor-pointer">
                      {key}
                    </TableHead>
                  ))
                ) : (
                  <TableHead>
                    <TableCell>No Data Available</TableCell>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStocks.length > 0 ? (
                currentStocks.map((stock) => (
                  <TableRow 
                    key={stock["Security Code"]} 
                    onClick={() => handleRowClick(stock["Security Id"])}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {Object.values(stock).map((value, index) => (
                      <TableCell key={index}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={14} className="text-center">No stocks found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-between mt-4">
  <Button 
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
    disabled={currentPage === 1}
    className="p-2 bg-black text-white rounded disabled:opacity-50"
  >
    Previous
  </Button>
  <span>Page {currentPage} of {totalPages}</span>
  <Button 
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
    disabled={currentPage === totalPages}
    className="p-2 bg-black text-white rounded disabled:opacity-50"
  >
    Next
  </Button>
</div>
    </div>
  );
}