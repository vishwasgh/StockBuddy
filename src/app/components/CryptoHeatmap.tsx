'use client';

import React, { useEffect, useRef, memo } from 'react';

const CryptoHeatmap: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the script is already present
    const existingScript = document.getElementById('tradingview-crypto-heatmap-script');
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = 'tradingview-crypto-heatmap-script'; // Set an ID for the script
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        dataSource: "Crypto",
        blockSize: "market_cap_calc",
        blockColor: "change",
        locale: "en",
        symbolUrl: "",
        colorTheme: "dark",
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        isMonoSize: false,
        width: 500,
        height: 1000
      });

      if (container.current) {
        container.current.appendChild(script);
      }
    }

    return () => {
      // Cleanup function to remove the script when the component unmounts
      const script = document.getElementById('tradingview-crypto-heatmap-script');
      if (script) {
        script.remove(); // Remove the script from the DOM
      }
      if (container.current) {
        container.current.innerHTML = ''; // Clear the container on unmount
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-full h-[1000px] border rounded-lg shadow-lg p-4 bg-white">
      <div className="tradingview-widget-container__widget" ref={container}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          
        </a>
      </div>
    </div>
  );
};

export default memo(CryptoHeatmap);