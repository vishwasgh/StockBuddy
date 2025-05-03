'use client'; // This directive ensures the component is rendered on the client side

import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const widgetContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (widgetContainer.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: "BSE:SENSEX", title: "SENSEX" },
          { proName: "BSE:TATAMOTORS", title: "Tata Motors" },
          { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
          { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
          { proName: "BSE:RELIANCE", title: "Reliance" }
        ],
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: "adaptive",
        colorTheme: "dark",
        locale: "en"
      });
      widgetContainer.current.appendChild(script);
    }

    return () => {
      // Clean up the widget on component unmount
      if (widgetContainer.current) {
        widgetContainer.current.innerHTML = ''; // Clear the container
      }
    };
  }, []);

  return (
    <section className="relative text-gray-600 body-font bg-[url('/background.jpeg')] bg-cover bg-center bg-opacity-30 h-screen">
      <div className="tradingview-widget-container" ref={widgetContainer}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span className="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center h-full pl-10 pt-4">
        <h1 className="text-7xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Analyze.</h1>
        <h1 className="text-8xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Predict.</h1>
        <h1 className="text-9xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Succeed.</h1>
      </div>
    </section>
  );
};

export default Hero;