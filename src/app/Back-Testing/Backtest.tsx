'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';

interface Trade {
    EntryPrice: number;
    ExitPrice: number;
    ProfitLoss: number;
    EntryTime: string;
    ExitTime: string;
}

interface BacktestResults {
    results_best_returns: {
        "Win Rate %": number;
        "Return %": number;
        Trades: Trade[];
    };
    results_best_winrate: {
        "Win Rate %": number;
        "Return %": number;
        Trades: Trade[];
    };
}

const Backtest: React.FC<{ symbol: string }> = ({ symbol }) => {
    const [results, setResults] = useState<BacktestResults | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Function to convert nested trade object to an array
    const transformTrades = (trades: any): Trade[] => {
        const tradeArray: Trade[] = [];
        const tradeCount = Object.keys(trades.EntryPrice).length;

        for (let i = 0; i < tradeCount; i++) {
            tradeArray.push({
                EntryPrice: trades.EntryPrice[i],
                ExitPrice: trades.ExitPrice[i],
                ProfitLoss: trades["Profit&Loss"][i],
                EntryTime: trades.EntryTime[i],
                ExitTime: trades.ExitTime[i],
            });
        }

        return tradeArray;
    };

    const handleBacktest = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:2000/backtest?ticker=${symbol}&interval=1hr&api=yfinance&s_name=SmaCross`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Transform trades from nested objects to array
            const bestReturnsTrades = transformTrades(data.results_best_returns.Trades);
            const bestWinrateTrades = transformTrades(data.results_best_winrate.Trades);

            const transformedResults: BacktestResults = {
                results_best_returns: {
                    "Win Rate %": data.results_best_returns["Win Rate %"],
                    "Return %": data.results_best_returns["Return %"],
                    Trades: bestReturnsTrades,
                },
                results_best_winrate: {
                    "Win Rate %": data.results_best_winrate["Win Rate %"],
                    "Return %": data.results_best_winrate["Return %"],
                    Trades: bestWinrateTrades,
                }
            };

            setResults(transformedResults);
        } catch (error) {
            setError('Error fetching backtest data');
            console.error('Error fetching backtest data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Backtest for {symbol}</h1>
            
            <div className="mb-4">
                <Button
                    onClick={handleBacktest}
                    disabled={loading}
                    className={`mt-2 w-full ${loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-600'}`}
                >
                    {loading ? 'Loading...' : 'Run Backtest'}
                </Button>
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            {results && (
                <div>
                    <div className="flex justify-between mt-4 mb-4">
                        <div className="flex-1 mr-2">
                            <h3 className="text-lg font-semibold">Best Returns</h3>
                            <p>Win Rate: {results.results_best_returns["Win Rate %"]}%</p>
                            <p>Return: {results.results_best_returns["Return %"]}%</p>
                        </div>
                        <div className="flex-1 ml-2">
                            <h3 className="text-lg font-semibold">Best Win Rate</h3>
                            <p>Win Rate: {results.results_best_winrate["Win Rate %"]}%</p>
                            <p>Return: {results.results_best_winrate["Return %"]}%</p>
                        </div>
                    </div>

                    {/* Table for Best Returns Trades */}
                    <h2 className="text-xl font-semibold mb-2">Best Returns Trades</h2>
                    <Table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border px-4 py-2">Entry Price</TableHead>
                                <TableHead className="border px-4 py-2">Exit Price</TableHead>
                                <TableHead className="border px-4 py-2">Profit/Loss</TableHead>
                                <TableHead className="border px-4 py-2">Entry Time</TableHead>
                                <TableHead className="border px-4 py-2">Exit Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {results.results_best_returns.Trades.map((trade, index) => (
                                <TableRow key={index} className="hover:bg-gray-100 transition duration-200">
                                    <TableCell className="border px-4 py-2">{trade.EntryPrice}</TableCell>
                                    <TableCell className="border px-4 py-2">{trade.ExitPrice}</TableCell>
                                    <TableCell className={`border px-4 py-2 ${trade.ProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {trade.ProfitLoss}
                                    </TableCell>
                                    <TableCell className="border px-4 py-2">{trade.EntryTime}</TableCell>
                                    <TableCell className="border px-4 py-2">{trade.ExitTime}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Table for Best Win Rate Trades */}
                    <h2 className="text-xl font-semibold mt-8 mb-2">Best Win Rate Trades</h2>
                    <Table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border px-4 py-2">Entry Price</TableHead>
                                <TableHead className="border px-4 py-2">Exit Price</TableHead>
                                <TableHead className="border px-4 py-2">Profit/Loss</TableHead>
                                <TableHead className="border px-4 py-2">Entry Time</TableHead>
                                <TableHead className="border px-4 py-2">Exit Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {results.results_best_winrate.Trades.map((trade, index) => (
                                <TableRow key={index} className="hover:bg-gray-100 transition duration-200">
                                    <TableCell className="border px-4 py-2">{trade.EntryPrice}</TableCell>
                                    <TableCell className="border px-4 py-2">{trade.ExitPrice}</TableCell>
                                    <TableCell className={`border px-4 py-2 ${trade.ProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {trade.ProfitLoss}
                                    </TableCell>
                                    <TableCell className="border px-4 py-2">{trade.EntryTime}</TableCell>
                                    <TableCell className="border px-4 py-2">{trade.ExitTime}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default Backtest;
