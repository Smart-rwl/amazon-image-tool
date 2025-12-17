'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Ensure this path is correct
import { TOOLS, TOOL_GROUPS } from '../config/tools.config'; 
import { 
  Calculator, Banknote, FileText, Settings, Image as ImageIcon, 
  Menu, X, ChevronDown, Heart, User, LogOut, Settings as SettingsIcon 
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  // 1. Fetch User & Favorites on Mount
  useEffect(() => {
    // Get User
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Get Favorites
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userFavorites');
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse favorites', e);
        }
      }
    }
  }, []);

  // 2. Toggle Favorite Function
  const toggleFavorite = (slug: string) => {
    const newFavs = favorites.includes(slug)
      ? favorites.filter(s => s !== slug)
      : [...favorites, slug];
    
    setFavorites(newFavs);
    localStorage.setItem('userFavorites', JSON.stringify(newFavs));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  // 3. Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  // Helper to filter tools
  const getTools = (group: string) => TOOLS.filter(t => t.group === group);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                S
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                Smart Seller
              </span>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center space-x-1">
            
            <Dropdown title={TOOL_GROUPS.calculators} icon={<Calculator className="w-4 h-4" />}>
              <div className="grid grid-cols-2 w-[400px] gap-1 p-2">
                {getTools('calculators').map(tool => (
                  <MenuLink 
                    key={tool.slug} tool={tool} currentPath={pathname} 
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFav={() => toggleFavorite(tool.slug)}
                  />
                ))}
              </div>
            </Dropdown>

            <Dropdown title={TOOL_GROUPS.finance} icon={<Banknote className="w-4 h-4" />}>
              <div className="grid grid-cols-2 w-[400px] gap-1 p-2">
                {getTools('finance').map(tool => (
                  <MenuLink 
                    key={tool.slug} tool={tool} currentPath={pathname} 
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFav={() => toggleFavorite(tool.slug)}
                  />
                ))}
              </div>
            </Dropdown>

            <Dropdown title={TOOL_GROUPS.listing} icon={<FileText className="w-4 h-4" />}>
              <div className="grid grid-cols-2 w-[400px] gap-1 p-2">
                {getTools('listing').map(tool => (
                  <MenuLink 
                    key={tool.slug} tool={tool} currentPath={pathname} 
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFav={() => toggleFavorite(tool.slug)}
                  />
                ))}
              </div>
            </Dropdown>

            <Dropdown title={TOOL_GROUPS.operations} icon={<Settings className="w-4 h-4" />}>
              <div className="grid grid-cols-2 w-[400px] gap-1 p-2">
                {getTools('operations').map(tool => (
                  <MenuLink 
                    key={tool.slug} tool={tool} currentPath={pathname} 
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFav={() => toggleFavorite(tool.slug)}
                  />
                ))}
              </div>
            </Dropdown>

            <Dropdown title={TOOL_GROUPS.assets} icon={<ImageIcon className="w-4 h-4" />}>
              <div className="w-64 p-2 space-y-1">
                {getTools('assets').map(tool => (
                   <MenuLink 
                    key={tool.slug} tool={tool} currentPath={pathname} 
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFav={() => toggleFavorite(tool.slug)}
                   />
                ))}
              </div>
            </Dropdown>

            {/* --- REPLACED "START" BUTTON WITH PROFILE DROPDOWN --- */}
            <div className="ml-4 pl-4 border-l border-gray-200 relative">
              {user ? (
                <>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-full border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                          <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <Link 
                            href="/settings" 
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <SettingsIcon className="w-4 h-4 text-gray-400" /> Settings
                          </Link>
                          <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600">
                  Log In
                </Link>
              )}
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[85vh] overflow-y-auto shadow-xl">
          <div className="px-4 pt-4 pb-8 space-y-6">
            
            {/* Mobile Tool Sections */}
            <MobileSection title={TOOL_GROUPS.calculators} tools={getTools('calculators')} pathname={pathname} favorites={favorites} toggleFavorite={toggleFavorite} />
            <MobileSection title={TOOL_GROUPS.finance} tools={getTools('finance')} pathname={pathname} favorites={favorites} toggleFavorite={toggleFavorite} />
            <MobileSection title={TOOL_GROUPS.listing} tools={getTools('listing')} pathname={pathname} favorites={favorites} toggleFavorite={toggleFavorite} />
            <MobileSection title={TOOL_GROUPS.operations} tools={getTools('operations')} pathname={pathname} favorites={favorites} toggleFavorite={toggleFavorite} />
            <MobileSection title={TOOL_GROUPS.assets} tools={getTools('assets')} pathname={pathname} favorites={favorites} toggleFavorite={toggleFavorite} />

            {/* Mobile Profile Section */}
            <div className="border-t pt-4 mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      <Link href="/settings" className="text-xs text-blue-600 hover:underline">Manage Account</Link>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" className="block text-center w-full py-3 bg-blue-600 text-white font-bold rounded-lg">
                  Log In
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}

/* --- SUB COMPONENTS --- */

function Dropdown({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative group h-full flex items-center px-3">
      <button className="flex items-center space-x-1.5 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors py-2 outline-none">
        <span className="text-gray-400 group-hover:text-blue-600 transition-colors">{icon}</span>
        <span>{title}</span>
        <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:rotate-180" />
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-2 group-hover:translate-y-0 z-50">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
          {children}
        </div>
      </div>
    </div>
  );
}

function MenuLink({ tool, currentPath, isFavorite, onToggleFav }: { tool: any; currentPath: string; isFavorite: boolean; onToggleFav: () => void }) {
  const href = `/tools/${tool.slug}`;
  const isActive = currentPath === href;
  
  return (
    <div className="relative group/item">
      <Link
        href={href}
        className={`block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${isActive ? 'bg-blue-50/50' : ''}`}
      >
        <div className={`text-sm font-medium pr-6 ${isActive ? 'text-blue-600' : 'text-gray-800 group-hover/item:text-blue-600'}`}>
          {tool.label}
        </div>
        {tool.desc && (
          <div className="text-[10px] text-gray-400 group-hover/item:text-gray-500 leading-tight line-clamp-1 pr-4">
            {tool.desc}
          </div>
        )}
      </Link>
      
      {/* Heart Icon Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFav();
        }}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors z-10 opacity-0 group-hover/item:opacity-100 focus:opacity-100"
      >
        <Heart 
          className={`w-3.5 h-3.5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500 opacity-100' : 'text-gray-300 hover:text-red-400'}`} 
        />
      </button>
      {/* Ensure filled hearts are always visible even when not hovering */}
      {isFavorite && (
         <div className="absolute top-3 right-3 pointer-events-none group-hover/item:hidden">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
         </div>
      )}
    </div>
  );
}

function MobileSection({ title, tools, pathname, favorites, toggleFavorite }: { title: string; tools: any[]; pathname: string; favorites: string[], toggleFavorite: (slug:string) => void }) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-gray-900 text-xs border-b pb-1 uppercase tracking-wider text-opacity-50">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-1 pl-2">
        {tools.map(tool => {
           const isFav = favorites.includes(tool.slug);
           return (
             <div key={tool.slug} className="flex items-center justify-between pr-2">
               <Link
                 href={`/tools/${tool.slug}`}
                 className={`text-sm py-1.5 block flex-1 ${pathname === `/tools/${tool.slug}` ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
               >
                 {tool.label}
               </Link>
               <button 
                 onClick={() => toggleFavorite(tool.slug)}
                 className="p-1.5"
               >
                 <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
               </button>
             </div>
           );
        })}
      </div>
    </div>
  );
}