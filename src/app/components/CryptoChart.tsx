'use client';

import React from 'react';

interface CryptoWidgetProps {
  symbol: string; // The cryptocurrency symbol (e.g., BTC, ETH)
}

const CryptoWidget: React.FC<CryptoWidgetProps> = ({ symbol }) => {
  const container = React.useRef<HTMLDivElement>(null);
  const scriptId = `tradingview-widget-${symbol}`; // Unique ID for the script

  React.useEffect(() => {
    // Check if the script already exists in the container
    if (container.current && !document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [[`BINANCE:${symbol}|1MIN`]], // Use the appropriate exchange and symbol
        chartOnly: false,
        width: '100%',
        height: '100%',
        locale: 'en',
        colorTheme: 'light',
        autosize: true,
        showVolume: true,
        showMA: true,
        hideDateRanges: false,
        hideMarketStatus: false,
        hideSymbolLogo: false,
        scalePosition: 'right',
        scaleMode: 'Normal',
        fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
        fontSize: '10',
        noTimeScale: false,
        valuesTracking: '1',
        changeMode: 'price-and-percent',
        chartType: 'area',
        lineWidth: 2,
        lineType: 0,
      });

      container.current.appendChild(script);
    }

    return () => {
      // Clean up the widget on component unmount
      if (container.current) {
        const scriptElement = document.getElementById(scriptId);
        if (scriptElement) {
          scriptElement.remove();
        }
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container h-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
};

export default CryptoWidget;