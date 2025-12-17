'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { TOOLS, TOOL_GROUPS, ToolGroupId } from '../config/tools.config'; 

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toolsByGroup: Record<string, typeof TOOLS> = {
    calculators: TOOLS.filter(t => t.group === 'calculators'),
    finance: TOOLS.filter(t => t.group === 'finance'),
    listing: TOOLS.filter(t => t.group === 'listing'),
    operations: TOOLS.filter(t => t.group === 'operations'),
    assets: TOOLS.filter(t => t.group === 'assets'), 
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
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

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center space-x-1">
            
            <Dropdown title={TOOL_GROUPS.calculators || 'Calculators'} icon={<CalculatorIcon />}>
              <div className="grid grid-cols-2 w-[380px] gap-1 p-2">
                {toolsByGroup.calculators.map(tool => (
                  <MenuLink 
                    key={tool.slug} 
                    href={`/tools/${tool.slug}`} // UPDATED LINK
                    title={tool.label} 
                    desc={tool.desc} 
                    active={pathname === `/tools/${tool.slug}`} // UPDATED ACTIVE CHECK
                  />
                ))}
              </div>
            </Dropdown>

            <Dropdown title={TOOL_GROUPS.finance || 'Finance'} icon={<BanknotesIcon />}>
              <div className="grid grid-cols-2 w-[380px] gap-1 p-2">
                {toolsByGroup.finance.map(tool => (
                  <MenuLink 
                    key={tool.slug} 
                    href={`/tools/${tool.slug}`} // UPDATED LINK
                    title={tool.label} 
                    desc={tool.desc} 
                    active={pathname === `/tools/${tool.slug}`} 
                  />
                ))}
              </div>
            </Dropdown>

            <Dropdown title={TOOL_GROUPS.listing || 'Listing'} icon={<ListIcon />}>
              <div className="grid grid-cols-2 w-[380px] gap-1 p-2">
                {toolsByGroup.listing.map(tool => (
                  <MenuLink 
                    key={tool.slug} 
                    href={`/tools/${tool.slug}`} // UPDATED LINK
                    title={tool.label} 
                    desc={tool.desc} 
                    active={pathname === `/tools/${tool.slug}`} 
                  />
                ))}
              </div>
            </Dropdown>

            <Dropdown title={TOOL_GROUPS.operations || 'Operations'} icon={<CogIcon />}>
              <div className="w-64 p-2 space-y-1">
                {toolsByGroup.operations.map(tool => (
                  <MenuLink 
                    key={tool.slug} 
                    href={`/tools/${tool.slug}`} // UPDATED LINK
                    title={tool.label} 
                    active={pathname === `/tools/${tool.slug}`} 
                  />
                ))}
              </div>
            </Dropdown>

            <Dropdown title={TOOL_GROUPS.assets || 'Assets'} icon={<LayersIcon />}>
              <div className="w-64 p-2 space-y-1">
                {toolsByGroup.assets.map(tool => (
                   <MenuLink 
                     key={tool.slug} 
                     href={`/tools/${tool.slug}`} // UPDATED LINK
                     title={tool.label} 
                     desc={tool.desc} 
                     active={pathname === `/tools/${tool.slug}`} 
                   />
                ))}
              </div>
            </Dropdown>

            <Link href="/tools" className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              All Tools
            </Link>

            <Link
              href="/tools/calculator" // UPDATED from /calculator to /tools/calculator
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 ml-2"
            >
              Start
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <MobileSection title="Calculators">
              {toolsByGroup.calculators.map(tool => (
                <MobileLink 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`} // UPDATED LINK
                  active={pathname === `/tools/${tool.slug}`}
                >
                  {tool.label}
                </MobileLink>
              ))}
            </MobileSection>

            <MobileSection title="Finance">
              {toolsByGroup.finance.map(tool => (
                <MobileLink 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`} // UPDATED LINK
                  active={pathname === `/tools/${tool.slug}`}
                >
                  {tool.label}
                </MobileLink>
              ))}
            </MobileSection>

            <MobileSection title="Listing">
              {toolsByGroup.listing.map(tool => (
                <MobileLink 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`} // UPDATED LINK
                  active={pathname === `/tools/${tool.slug}`}
                >
                  {tool.label}
                </MobileLink>
              ))}
            </MobileSection>

            <MobileSection title="Operations">
              {toolsByGroup.operations.map(tool => (
                <MobileLink 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`} // UPDATED LINK
                  active={pathname === `/tools/${tool.slug}`}
                >
                  {tool.label}
                </MobileLink>
              ))}
            </MobileSection>

            <MobileSection title="Assets">
              {toolsByGroup.assets.map(tool => (
                <MobileLink 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`} // UPDATED LINK
                  active={pathname === `/tools/${tool.slug}`}
                >
                  {tool.label}
                </MobileLink>
              ))}
            </MobileSection>

             <Link href="/tools" className="block text-sm font-bold text-blue-600 py-2 border-t mt-2">
               View All Tools →
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* --- SUB COMPONENTS --- */

function Dropdown({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative group h-full flex items-center px-2">
      <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors py-2 focus:outline-none">
        <span className="text-gray-400 group-hover:text-blue-600 transition-colors">{icon}</span>
        <span>{title}</span>
        <span className="text-gray-400 group-hover:text-blue-600 transition-colors transform group-hover:rotate-180 duration-200">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
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

function MenuLink({ href, title, desc, active }: { href: string; title: string; desc?: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group ${active ? 'bg-gray-50' : ''}`}
    >
      <div className={`text-sm font-medium ${active ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'}`}>
        {title}
      </div>
      {desc && (
        <div className="text-[10px] text-gray-400 group-hover:text-gray-500 leading-tight">
          {desc}
        </div>
      )}
    </Link>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="font-bold text-gray-900 text-sm border-b pb-1 mb-2 uppercase tracking-wider">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2 pl-2">{children}</div>
    </div>
  );
}

function MobileLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm py-1 block ${active ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
    >
      {children}
    </Link>
  );
}

/* --- ICONS --- */
const CalculatorIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const CogIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BanknotesIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LayersIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);