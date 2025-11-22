'use client';

import { Search, Moon, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="w-full px-15 h-16 flex items-center relative">
        {/* Left: Logo and Search */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
             <Image 
               src="/nocturne.jpg" 
               alt="Nocturne" 
               width={32} 
               height={32} 
               className="rounded-lg"
             />
          </Link>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search assets" 
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 w-64 transition-all"
            />
          </div>
        </div>

        {/* Center: Navigation - Absolutely centered */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600 absolute left-1/2 transform -translate-x-1/2">
            <Link href="#" className="hover:text-black">Explore</Link>
            <Link href="#" className="hover:text-black">Tools</Link>
            <Link href="#" className="hover:text-black">Learn</Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun size={20} className="text-gray-400 dark:text-gray-300" />
              )}
            </button>
          )}

          {isConnected ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => open()}
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </button>
              <button
                onClick={() => disconnect()}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

