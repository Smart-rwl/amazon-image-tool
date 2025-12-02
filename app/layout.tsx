import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartRwl Seller Tools",
  description: "Tools for Amazon and Flipkart Sellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        
        {/* --- NAVIGATION BAR START --- */}
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              
              {/* Left Side: Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <span className="font-bold text-xl text-blue-600 tracking-tight">SmartRwl Tools</span>
                </Link>
              </div>

              {/* Right Side: Dropdown Menus */}
              <div className="flex items-center space-x-1 sm:space-x-4">
                
                {/* DROPDOWN 1: CALCULATORS */}
                <div className="relative group h-full flex items-center">
                  <button className="text-gray-600 group-hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                    <span>Calculators</span>
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {/* Menu Items */}
                  <div className="absolute top-12 left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-lg hidden group-hover:block animate-fade-in-down">
                    <div className="py-1">
                      <Link href="/calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Profit & RTO Calc</Link>
                      <Link href="/ppc-calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">PPC/Ads Calc</Link>
                      <Link href="/price-finder" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Target Price Finder</Link>
                      <Link href="/volumetric" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Volumetric Weight</Link>
                      <Link href="/odr-calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Account Health</Link>
                    </div>
                  </div>
                </div>

                {/* DROPDOWN 2: LISTING TOOLS */}
                <div className="relative group h-full flex items-center">
                  <button className="text-gray-600 group-hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                    <span>Listing Tools</span>
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {/* Menu Items */}
                  <div className="absolute top-12 left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-lg hidden group-hover:block animate-fade-in-down">
                    <div className="py-1">
                      <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Image Bulk Remover</Link>
                      <Link href="/keywords" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Keyword Optimizer</Link>
                      <Link href="/html-formatter" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">HTML Formatter</Link>
                      <Link href="/title-optimizer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Title Optimizer</Link>
                      <Link href="/bullet-builder" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Bullet Point Builder</Link>
                      <Link href="/lqs-checker" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Listing Auditor (LQS)</Link>
                    </div>
                  </div>
                </div>

                {/* DROPDOWN 3: OPERATIONS */}
                <div className="relative group h-full flex items-center">
                  <button className="text-gray-600 group-hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                    <span>Operations</span>
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {/* Menu Items */}
                  <div className="absolute top-12 right-0 w-48 bg-white border border-gray-100 shadow-xl rounded-lg hidden group-hover:block animate-fade-in-down">
                    <div className="py-1">
                      <Link href="/inventory" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Inventory Planner</Link>
                      <Link href="/deal-planner" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Discount Planner</Link>
                      <Link href="/qr-generator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">QR Generator</Link>
                      <Link href="/cbm-calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">CBM & Shipping Planner</Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </nav>
        {/* --- NAVIGATION BAR END --- */}

        <main>
          {children}
        </main>

      </body>
    </html>
  );
}