import { StockData, StockPredictionResponse } from '@/types/stock';

const API_BASE_URL = 'http://localhost:2000';

export async function fetchStockData(symbol: string): Promise<StockData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/get-stock-data?ticker=${symbol}&interval=1hr&api=yfinance`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    
    // Ensure the data matches the StockData type
    const stockData: StockData = {
      ticker: data.ticker || symbol,
      name: data.name || 'Unknown',
      currentPrice: data.currentPrice || data.Close?.[Object.keys(data.Close)[0]] || 0,
      priceChange: data.priceChange || 0,
      percentageChange: data.percentageChange || 0,
      volume: data.volume || data.Volume?.[Object.keys(data.Volume)[0]] || 0,
      marketCap: data.marketCap || 0,
      high: data.high || data.High?.[Object.keys(data.High)[0]] || 0,
      low: data.low || data.Low?.[Object.keys(data.Low)[0]] || 0,
      open: data.open || data.Open?.[Object.keys(data.Open)[0]] || 0,
      previousClose: data.previousClose || 0,
    };

    return stockData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error; // Re-throw the error to be handled by the component
  }
}

export async function fetchPredictionData(symbol: string, predictor: string): Promise<StockPredictionResponse | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stock-prediction?predictor=${predictor}&ticker=${symbol}&interval=1hr&api=yfinance&days_ahead=30`
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching prediction data:', error);
    throw error; // Re-throw the error to be handled by the component
  }
}

export async function searchStocks(query: string): Promise<StockData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search-stocks?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    return data.map((item: any) => ({
      ticker: item.ticker,
      name: item.name,
      currentPrice: item.currentPrice || 0,
      priceChange: item.priceChange || 0,
      percentageChange: item.percentageChange || 0,
      volume: item.volume || 0,
      marketCap: item.marketCap || 0,
    }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error; // Re-throw the error to be handled by the component
  }
}



