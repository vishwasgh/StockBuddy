import React from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button'; // Adjust the import path based on your project structure

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <img
            src="/logo.jpeg" // Path relative to the public directory
            alt="Stockbuddy Logo"
            className="w-10 h-10 rounded-full" // Tailwind classes for size and styling
          />
          <span className="ml-3 text-2xl">Stockbuddy</span> {/* Increased font size */}
        </Link>

        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
          <Link href="/stock">
            <Button variant="link" className="mr-5 text-lg hover:text-gray-900">Stocks</Button> {/* Increased font size */}
          </Link>
          <Link href="/crypto">
            <Button variant="link" className="mr-5 text-lg hover:text-gray-900">Crypto</Button> {/* Increased font size */}
          </Link>
          <Link href="/Back-Testing">
            <Button variant="link" className="mr-5 text-lg hover:text-gray-900">Back Testing</Button> {/* Increased font size */}
          </Link>
          <Link href="/market-news">
            <Button variant="link" className="mr-5 text-lg hover:text-gray-900">Market News</Button> {/* Increased font size */}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;