// types/stock.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export interface StockData {
    ticker: string;           // Stock ticker symbol, e.g., "AAPL"
    name?: string;            // Optional: Full name of the company
    currentPrice: number;     // Current stock price
    priceChange: number;      // Price change (e.g., +2.34)
    percentageChange: number; // Percentage change (e.g., +1.45%)
    volume?: number;          // Optional: Volume of stocks traded
    marketCap?: number;       // Optional: Market capitalization
    high?: number;            // Optional: Daily high price
    low?: number;             // Optional: Daily low price
    open?: number;            // Optional: Opening price
    previousClose?: number;   // Optional: Previous closing price
}

export interface StockPrediction {
    ticker: string;            // Stock ticker symbol
    predictor: string;         // Prediction model used, e.g., "XGBoost"
    predictedPrice: number;    // Predicted price
    daysAhead: number;         // Number of days ahead the prediction is for
    confidence: number;        // Confidence level of the prediction (percentage)
}

export interface StockSearchResult {
    ticker: string;            // Stock ticker symbol
    name: string;              // Full name of the company
    sector?: string;           // Optional: Sector of the company, e.g., "Technology"
    industry?: string;         // Optional: Industry of the company
}

export interface StockPredictionResponse {
    Date: { [key: string]: string }; // Map of date strings
    Forecast: { [key: string]: number }; // Map of date strings to predicted prices (numbers)
}

