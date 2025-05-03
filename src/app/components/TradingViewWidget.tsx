'use client';

import React, { useEffect, useRef, useState } from 'react';

const TradingViewWidget: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const [scriptAdded, setScriptAdded] = useState(false);

  useEffect(() => {
    if (container.current && !scriptAdded) {
      // Ensure the widget container is cleared before appending the script
      container.current.innerHTML = '';

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
      script.type = 'text/javascript';
      script.async = true;

      script.onload = () => setScriptAdded(true);

      script.innerHTML = JSON.stringify({
        symbols: [['BSE:SENSEX|1D'], ['BSE:MIDCAP|1D']],
        chartOnly: false,
        width: '100%',
        height: 600,
        locale: 'en',
        colorTheme: 'light',
        autosize: false,
        showVolume: false,
        showMA: false,
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
        dateRanges: [
          '1d|1',
          '1m|30',
          '3m|60',
          '12m|1D',
          '60m|1W',
          'all|1M',
        ],
      });

      container.current.appendChild(script);
    }
  }, [scriptAdded]);

  return (
    <div className="flex flex-col justify-center items-center h-full pt-10">
      
      <div className="tradingview-widget-container w-full max-w-4xl h-96" ref={container}>
        {/* The TradingView widget will be injected here */}
      </div>
    </div>
  );
};

export default TradingViewWidget;
