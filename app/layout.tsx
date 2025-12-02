import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // This is required for navigation

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
              
              {/* Left Side: Logo / Brand */}
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <span className="font-bold text-xl text-blue-600">SmartRwl Tools</span>
                </Link>
              </div>

              {/* Right Side: Menu Links */}
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Image Tool
                </Link>
                
                <Link 
                  href="/keywords" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Keyword Optimizer
                </Link>

                <Link 
                  href="/calculator" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profit Calculator
                </Link>

                <Link 
                  href="/html-formatter" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  HTML Formatter
                </Link>

                <Link 
                  href="/volumetric" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Volumetric
                </Link>

                <Link 
                  href="/inventory-planner" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  inventory Planner
                </Link>

                <Link 
                  href="/ppc-calculator" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  PPC Calculator
                </Link>

                <Link 
                  href="/deal-planner" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Deal Planner
                </Link>

                <Link 
                  href="/qr-generator" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  QR Generator
                </Link>
              </div>

            </div>
          </div>
        </nav>
        {/* --- NAVIGATION BAR END --- */}

        {/* This is where your page content (Image tool or Keyword tool) is inserted  */}
        <main>
          {children}
        </main>

      </body>
    </html>
  );
}