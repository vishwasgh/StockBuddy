'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

interface StockPredictionProps {
  ticker: string;
}

interface PredictionData {
  date: string;
  price: number;
}

export default function StockPrediction({ ticker }: StockPredictionProps) {
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePredictor, setActivePredictor] = useState<'fbprophet' | 'arima' | 'sarima' | 'sarimax'>('fbprophet');

  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        const response = await fetch(`http://localhost:2000/stock-prediction?predictor=${activePredictor}&ticker=${ticker}&interval=1hr&api=yfinance&days_ahead=30`);
        if (!response.ok) {
          throw new Error('Failed to fetch prediction data');
        }
        const data = await response.json();

        console.log("API Response:", data);

        if (typeof data.Forecast !== 'object' || typeof data.Date !== 'object') {
          throw new Error('Invalid data format: Forecast or Date is not an object');
        }

        // Normalize the date format and transform the data
        const transformedData: PredictionData[] = Object.keys(data.Forecast).map((key) => {
          const dateValue = data.Date[key] || key; // Use the key if Date is not available
          return {
            date: new Date(dateValue).toLocaleString(), // Normalize date format
            price: data.Forecast[key],
          };
        });

        console.log("Transformed Data:", transformedData);

        setPredictionData(transformedData);
      } catch (err) {
        console.error("Error fetching prediction data:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch prediction data');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictionData();
  }, [activePredictor, ticker]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Prediction for {ticker}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fbprophet" className="w-full" onValueChange={(value) => setActivePredictor(value as 'fbprophet' | 'arima' | 'sarima' | 'sarimax')}>
          <TabsList className="flex space-x-2">
            <TabsTrigger value="fbprophet">FBProphet</TabsTrigger>
            <TabsTrigger value="arima">ARIMA</TabsTrigger>
            <TabsTrigger value="sarima">SARIMA</TabsTrigger>
            <TabsTrigger value="sarimax">SARIMAX</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activePredictor}>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} interval={0} tick={{ fontSize: 12 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} formatter={( value) => [`Price: ₹${value}`, '']} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={predictionData[0]?.price < predictionData[predictionData.length - 1]?.price ? "#4ade80" : "#ef4444"}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}