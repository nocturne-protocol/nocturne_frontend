'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TradingInterfaceProps {
  ticker: string;
  assetName: string;
  currentPrice: number;
  assetImage: string;
}

export default function TradingInterface({ ticker, assetName, currentPrice, assetImage }: TradingInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [payAmount, setPayAmount] = useState<string>('0');
  const [receiveAmount, setReceiveAmount] = useState<string>('0');

  const handlePayAmountChange = (value: string) => {
    setPayAmount(value);
    const numValue = parseFloat(value) || 0;
    // If Buy: Pay USD -> Receive Token (value / price)
    // If Sell: Pay Token -> Receive USD (value * price)
    const calculated = activeTab === 'buy' 
      ? numValue / currentPrice 
      : numValue * currentPrice;
    
    setReceiveAmount(activeTab === 'buy' ? calculated.toFixed(6) : calculated.toFixed(2));
  };

  const handleReceiveAmountChange = (value: string) => {
    setReceiveAmount(value);
    const numValue = parseFloat(value) || 0;
    // If Buy: Receive Token <- Pay USD (value * price)
    // If Sell: Receive USD <- Pay Token (value / price)
    const calculated = activeTab === 'buy'
      ? numValue * currentPrice
      : numValue / currentPrice;
      
    setPayAmount(activeTab === 'buy' ? calculated.toFixed(2) : calculated.toFixed(6));
  };

  const handleTabChange = (tab: 'buy' | 'sell') => {
    setActiveTab(tab);
    setPayAmount('0');
    setReceiveAmount('0');
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-100 rounded-3xl p-6 mb-4">
        {/* Buy/Sell Tabs */}
        <div className="flex mb-6">
          <div className="bg-gray-200 p-1 rounded-xl inline-flex">
            <button
              onClick={() => handleTabChange('buy')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'buy'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => handleTabChange('sell')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'sell'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sell
            </button>
          </div>
          
          {/* Network Badge */}
          <div className="ml-auto flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-xl">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px]">◆</span>
            </div>
            <span className="text-blue-900 font-semibold text-sm">Ethereum</span>
          </div>
        </div>

        {/* Pay Section */}
        <div className="bg-white rounded-2xl p-4 mb-2 shadow-sm relative z-0">
          <label className="text-gray-400 text-xs font-medium mb-1 block">Pay</label>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={payAmount}
              onChange={(e) => handlePayAmountChange(e.target.value)}
              className="bg-transparent text-gray-900 text-3xl font-bold outline-none w-full"
              placeholder="0"
            />
            {activeTab === 'buy' ? (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full flex-shrink-0">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">$</span>
                </div>
                <span className="text-gray-900 font-semibold text-sm">USD</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full flex-shrink-0">
                <div className="w-5 h-5 relative rounded-full overflow-hidden">
                  <Image
                    src={assetImage}
                    alt={ticker}
                    width={20}
                    height={20}
                    className="object-cover"
                  />
                </div>
                <span className="text-gray-900 font-semibold text-sm">{ticker}</span>
              </div>
            )}
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-4 relative z-10">
          <div className="bg-gray-100 border-[3px] border-gray-100 rounded-full p-1">
            <div className="bg-white rounded-full p-1.5 shadow-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Receive Section */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm pt-6">
          <label className="text-gray-400 text-xs font-medium mb-1 block">Receive</label>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={receiveAmount}
              onChange={(e) => handleReceiveAmountChange(e.target.value)}
              className="bg-transparent text-gray-900 text-3xl font-bold outline-none w-full"
              placeholder="0"
            />
            {activeTab === 'buy' ? (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full flex-shrink-0">
                <div className="w-5 h-5 relative rounded-full overflow-hidden">
                  <Image
                    src={assetImage}
                    alt={ticker}
                    width={20}
                    height={20}
                    className="object-cover"
                  />
                </div>
                <span className="text-gray-900 font-semibold text-sm">{ticker}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full flex-shrink-0">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">$</span>
                </div>
                <span className="text-gray-900 font-semibold text-sm">USD</span>
              </div>
            )}
          </div>
        </div>

        {/* Rate Info */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Rate</span>
            <span className="text-gray-900 text-sm font-medium">
              1 {ticker} = {currentPrice.toFixed(2)} USD (${currentPrice.toFixed(2)})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-gray-500 text-sm">Shares Per Token</span>
              <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-500 font-bold">?</div>
            </div>
            <span className="text-gray-900 text-sm font-medium">1 {ticker} = 1.00 {ticker.replace('on', '')}</span>
          </div>
        </div>

        {/* Sign In Button */}
        <button className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-colors shadow-lg mb-6">
          Sign In to Continue
        </button>

        {/* Disclaimer */}
        <p className="text-gray-400 text-[10px] leading-relaxed text-justify">
          Global Markets tokens have not been registered under the US Securities Act of 1933, as amended, 
          or the securities or other laws of any other jurisdiction, and may not be offered or sold in the 
          US or to US persons unless registered under the Act or exempt therefrom. The tokens are offered 
          and sold in the EEA and UK solely to qualified investors, and in Switzerland solely to professional 
          clients. Other prohibitions and restrictions apply. See additional information below.*
        </p>
      </div>

      {/* Also Available On */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer">
        <span className="text-gray-900 font-semibold text-sm">Also Available On</span>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
             <div className="w-6 h-6 bg-black rounded-full border-2 border-white flex items-center justify-center z-10">
               <span className="text-white text-[8px] font-bold">B</span>
             </div>
             <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
               <span className="text-black text-[8px] font-bold">Op</span>
             </div>
          </div>
          <span className="text-gray-500 text-sm font-medium">& 3 more</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">?</span>
          </div>
          <span className="text-gray-900 font-semibold text-sm">Need help?</span>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
