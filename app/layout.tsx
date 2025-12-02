import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // Ensure this path matches where you saved the file above

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
      <body className={`${inter.className} bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]`}>
        
        {/* Modern Glassmorphism Navbar */}
        <Navbar />

        {/* Main Content with Padding for Fixed Header */}
        <main className="pt-20 min-h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}