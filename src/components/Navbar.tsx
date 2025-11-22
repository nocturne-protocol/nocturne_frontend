import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo and Search */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
             <Image 
               src="/nocturne.jpg" 
               alt="Nocturne" 
               width={32} 
               height={32} 
               className="rounded-full"
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

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <Link href="#" className="hover:text-black">Explore</Link>
            <Link href="#" className="hover:text-black">Tools</Link>
            <Link href="#" className="hover:text-black">Learn</Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            Connect Wallet
          </button>
          <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
            Sign Up / Log In
          </button>
        </div>
      </div>
    </header>
  );
}

