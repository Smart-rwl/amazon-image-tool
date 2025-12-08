'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* --- LOGO --- */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="font-rotura text-2xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-wide pt-1">
                Smart Seller Tools
              </span>
            </Link>
          </div>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center space-x-1">
            
            {/* 1. Calculators (General) */}
            <Dropdown title="Calculators" icon={<CalculatorIcon />}>
              <div className="grid grid-cols-2 w-[350px] gap-1 p-2">
                <MenuLink href="/calculator" title="Profit & RTO" desc="Net margin analysis" />
                <MenuLink href="/ppc-calculator" title="PPC/Ads" desc="ACOS & ROAS" />
                <MenuLink href="/volumetric" title="Volumetric" desc="Shipping weight" />
                <MenuLink href="/odr-calculator" title="Account Health" desc="ODR monitor" />
                <MenuLink href="/volume-calculator" title="Price Strategy" desc="Volume vs Price" />
                <MenuLink href="/influencer-roi" title="Influencer ROI" desc="Campaign tracker" />
              </div>
            </Dropdown>

            {/* 2. Finance (Cost & Pricing) */}
            <Dropdown title="Finance" icon={<BanknotesIcon />}>
              <div className="grid grid-cols-2 w-[350px] gap-1 p-2">
                <MenuLink href="/price-finder" title="Target Price" desc="Reverse calc" />
                <MenuLink href="/price-matcher" title="Price Match" desc="Competitor analysis" />
                <MenuLink href="/bundle-calculator" title="Bundle Profit" desc="Kit profitability" />
                <MenuLink href="/packaging-cost" title="Packaging Cost" desc="Tape & Box calc" />
                <MenuLink href="/landed-cost" title="Import Cost" desc="Duty & Freight" />
                <MenuLink href="/storage-fee-planner" title="Storage Fees" desc="FBA Monthly/LTSF" />
                {/* Note: Linking ltsf-calculator here as well in case you use that file specifically */}
                <MenuLink href="/ltsf-calculator" title="LTSF Calculator" desc="Long Term Fees" />
              </div>
            </Dropdown>

            {/* 3. Listing Tools */}
            <Dropdown title="Listing Tools" icon={<ListIcon />}>
               <div className="grid grid-cols-2 w-[350px] gap-1 p-2">
                <MenuLink href="/" title="Image Bulk Remover" />
                <MenuLink href="/keywords" title="Keyword Optimizer" />
                <MenuLink href="/html-formatter" title="HTML Formatter" />
                <MenuLink href="/title-optimizer" title="Title Optimizer" />
                <MenuLink href="/bullet-builder" title="Bullet Builder" />
                <MenuLink href="/lqs-checker" title="Listing Auditor" />
                <MenuLink href="/keyword-density" title="Competitor Analyzer" />
                <MenuLink href="/sku-generator" title="SKU Generator" />
                <MenuLink href="/keyword-mixer" title="Keyword Mixer" />
                <MenuLink href="/ab-test" title="A/B Significance" />
              </div>
            </Dropdown>

            {/* 4. Operations */}
            <Dropdown title="Operations" icon={<CogIcon />}>
               <div className="w-56 p-2 space-y-1">
                <MenuLink href="/inventory" title="Inventory Planner" />
                <MenuLink href="/deal-planner" title="Discount Planner" />
                <MenuLink href="/qr-generator" title="QR Generator" />
                <MenuLink href="/cbm-calculator" title="CBM & Shipping" />
                <MenuLink href="/barcode-generator" title="Barcode Generator" />
              </div>
            </Dropdown>

            <Link 
              href="/landed-cost"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 ml-2"
            >
              Start
            </Link>

          </div>

          {/* --- MOBILE HAMBURGER --- */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <MobileSection title="Calculators">
              <MobileLink href="/calculator">Profit & RTO</MobileLink>
              <MobileLink href="/ppc-calculator">PPC Calculator</MobileLink>
              <MobileLink href="/price-finder">Target Price</MobileLink>
              <MobileLink href="/volumetric">Volumetric Weight</MobileLink>
            </MobileSection>
            
            <MobileSection title="Finance">
              <MobileLink href="/price-matcher">Price Matcher</MobileLink>
              <MobileLink href="/bundle-calculator">Bundle Profit</MobileLink>
              <MobileLink href="/landed-cost">Import Cost</MobileLink>
              <MobileLink href="/storage-fee-planner">Storage Fees</MobileLink>
            </MobileSection>

            <MobileSection title="Listing Tools">
              <MobileLink href="/">Image Tool</MobileLink>
              <MobileLink href="/title-optimizer">Title Optimizer</MobileLink>
              <MobileLink href="/bullet-builder">Bullet Builder</MobileLink>
              <MobileLink href="/sku-generator">SKU Generator</MobileLink>
            </MobileSection>

            <MobileSection title="Operations">
              <MobileLink href="/inventory">Inventory</MobileLink>
              <MobileLink href="/cbm-calculator">Shipping CBM</MobileLink>
              <MobileLink href="/barcode-generator">Barcode Gen</MobileLink>
            </MobileSection>
          </div>
        </div>
      )}
    </nav>
  );
}

/* --- SUB-COMPONENTS --- */

function Dropdown({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="relative group h-full flex items-center px-2">
      <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors py-2 focus:outline-none">
        <span className="text-gray-400 group-hover:text-blue-600 transition-colors">{icon}</span>
        <span>{title}</span>
        <span className="text-gray-400 group-hover:text-blue-600 transition-colors transform group-hover:rotate-180 duration-200">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </span>
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-2 group-hover:translate-y-0 z-50">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
           {children}
        </div>
      </div>
    </div>
  );
}

function MenuLink({ href, title, desc }: { href: string, title: string, desc?: string }) {
  return (
    <Link href={href} className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600">{title}</div>
      {desc && <div className="text-[10px] text-gray-400 group-hover:text-gray-500 leading-tight">{desc}</div>}
    </Link>
  );
}

function MobileSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="font-bold text-gray-900 text-sm border-b pb-1 mb-2 uppercase tracking-wider">{title}</h3>
      <div className="grid grid-cols-2 gap-2 pl-2">
        {children}
      </div>
    </div>
  );
}

function MobileLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-gray-600 hover:text-blue-600 py-1 block">
      {children}
    </Link>
  );
}

/* --- ICONS --- */
const CalculatorIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const ListIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const CogIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BanknotesIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;