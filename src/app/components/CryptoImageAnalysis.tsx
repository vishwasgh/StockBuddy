'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface CryptoImageAnalysisProps {
  symbol: string;
}

interface ImageData {
  imageUrl: string; // URL of the image
  analysis: string; // Analysis text
}

export default function CryptoImageAnalysis({ symbol }: CryptoImageAnalysisProps) {
  const [patternData, setPatternData] = useState<ImageData | null>(null);
  const [movementData, setMovementData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch pattern classification image
        const patternResponse = await fetch(`http://localhost:2000/image-analysis/pattern-classify?ticker=${symbol}&interval=1week&api=binance`);
        if (!patternResponse.ok) {
          const errorText = await patternResponse.text(); // Get the error message from the response
          throw new Error(`Failed to fetch pattern image: ${patternResponse.status} ${errorText}`);
        }
        const patternImageUrl = URL.createObjectURL(await patternResponse.blob()); // Create a URL for the image blob
        const patternAnalysis = "Pattern analysis description"; // Replace with actual analysis if available

        // Fetch movement classification image
        const movementResponse = await fetch(`http://localhost:2000/image-analysis/movement-classify?ticker=${symbol}&interval=1mon&api=binance`);
        if (!movementResponse.ok) {
          const errorText = await movementResponse.text(); // Get the error message from the response
          throw new Error(`Failed to fetch movement image: ${movementResponse.status} ${errorText}`);
        }
        const movementImageUrl = URL.createObjectURL(await movementResponse.blob()); // Create a URL for the image blob
        const movementAnalysis = "Movement analysis description"; // Replace with actual analysis if available

        // Set the state with the fetched data
        setPatternData({ imageUrl: patternImageUrl, analysis: patternAnalysis });
        setMovementData({ imageUrl: movementImageUrl, analysis: movementAnalysis });
      } catch (err) {
        console.error("Error fetching image analysis:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch image analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchImageAnalysis();
  }, [symbol]);

  if (loading) {
    return <div>Loading image analysis...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Analysis for {symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pattern" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pattern">Pattern Classification</TabsTrigger>
            <TabsTrigger value="movement">Movement Classification</TabsTrigger>
          </TabsList>
          <TabsContent value="pattern">
            {patternData && (
              <div className="space-y-4">
                <img 
                  src={patternData.imageUrl || "/placeholder.svg"} 
                  alt="Pattern Classification" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-muted-foreground">{patternData.analysis}</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="movement">
            {movementData && (
              <div className="space-y-4">
                <img 
                  src={movementData.imageUrl || "/placeholder.svg"} 
                  alt="Movement Classification" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-muted-foreground">{movementData.analysis}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}