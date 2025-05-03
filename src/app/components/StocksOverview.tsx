'use client';

import React, { useEffect, useRef, memo } from 'react';

const StocksOverview: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the script is already present
    const existingScript = document.getElementById('tradingview-hotlists-script');
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = 'tradingview-hotlists-script'; // Set an ID for the script
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: "light",
        dateRange: "12M",
        exchange: "BSE",
        showChart: true,
        locale: "en",
        largeChartUrl: "",
        isTransparent: false,
        showSymbolLogo: false,
        showFloatingTooltip: false,
        width: "400",
        height: "600", // Increased height for the widget
        plotLineColorGrowing: "rgba(41, 98, 255, 1)",
        plotLineColorFalling: "rgba(41, 98, 255, 1)",
        gridLineColor: "rgba(42, 46, 57, 0)",
        scaleFontColor: "rgba(219, 219, 219, 1)",
        belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
        belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
        belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
        belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
        symbolActiveColor: "rgba(41, 98, 255, 0.12)"
      });

      if (container.current) {
        container.current.appendChild(script);
      }
    }

    return () => {
      // Cleanup function to remove the script when the component unmounts
      const script = document.getElementById('tradingview-hotlists-script');
      if (script) {
        script.remove(); // Remove the script from the DOM
      }
      if (container.current) {
        container.current.innerHTML = ''; // Clear the container on unmount
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-full h-[650px] border rounded-lg shadow-lg p-4 bg-white"> {/* Increased height here */}
      <div className="tradingview-widget-container__widget" ref={container}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        
       
        </a>
      </div>
    </div>
  );
};

export default memo(StocksOverview);