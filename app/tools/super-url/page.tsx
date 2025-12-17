'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Link as LinkIcon, Copy, Check, ExternalLink, ArrowLeft, Globe 
} from 'lucide-react';

export default function SuperUrlPage() {
  // Form State
  const [marketplace, setMarketplace] = useState('www.amazon.com');
  const [asin, setAsin] = useState('');
  const [brand, setBrand] = useState('');
  const [keywords, setKeywords] = useState('');
  
  // Generated URLs State
  const [urls, setUrls] = useState<any[]>([]);

  const generateUrls = () => {
    if (!asin) return;

    const kwEncoded = encodeURIComponent(keywords);
    const brandEncoded = encodeURIComponent(brand);
    const generated = [];

    // 1. Canonical URL (SEO standard)
    // Format: amazon.com/Brand-Keywords-ASIN/dp/ASIN
    const slug = `${brand} ${keywords}`.trim().replace(/\s+/g, '-').toLowerCase();
    if (slug) {
        generated.push({
            type: 'Canonical URL',
            desc: 'Best for general SEO indexing. Uses keywords in the URL slug.',
            url: `https://${marketplace}/${slug}/dp/${asin}`
        });
    }

    // 2. Brand Store 2-Step URL
    // Forces Amazon to "search" for your keyword within your brand store
    if (brand && keywords) {
        generated.push({
            type: '2-Step Brand Store',
            desc: 'High power ranking. Simulates a search within your store.',
            url: `https://${marketplace}/s?me=${brandEncoded}&field-keywords=${kwEncoded}`
        });
    }

    // 3. Add to Cart URL (Direct)
    // Skips the product page, goes straight to cart (Risky if overused)
    generated.push({
        type: 'Direct Add-to-Cart',
        desc: 'Sends user directly to checkout. Use carefully.',
        url: `https://${marketplace}/gp/aws/cart/add.html?ASIN.1=${asin}&Quantity.1=1`
    });

    // 4. ASIN Search URL
    // Simple search for the ASIN
    generated.push({
        type: 'Plain ASIN Search',
        desc: 'Simple search result for your ASIN.',
        url: `https://${marketplace}/s?k=${asin}`
    });

    setUrls(generated);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/tools" className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-blue-600" /> Super URL Builder
            </h1>
            <p className="text-slate-500 text-sm">Generate SEO-friendly links for your launch campaigns.</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Marketplace</label>
            <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <select 
                    className="w-full pl-9 p-2 border border-slate-300 rounded-lg text-sm bg-slate-50"
                    value={marketplace}
                    onChange={(e) => setMarketplace(e.target.value)}
                >
                    <option value="www.amazon.com">Amazon US (.com)</option>
                    <option value="www.amazon.co.uk">Amazon UK (.co.uk)</option>
                    <option value="www.amazon.de">Amazon DE (.de)</option>
                    <option value="www.amazon.in">Amazon IN (.in)</option>
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">ASIN *</label>
            <input 
                type="text" 
                placeholder="B0..." 
                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                value={asin}
                onChange={(e) => setAsin(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Brand Name</label>
            <input 
                type="text" 
                placeholder="e.g. Nike" 
                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Target Keywords</label>
            <input 
                type="text" 
                placeholder="e.g. running shoes men" 
                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <button 
                onClick={generateUrls}
                disabled={!asin}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
            >
                Generate Links
            </button>
          </div>
        </div>

        {/* Results */}
        {urls.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
                <h3 className="font-bold text-slate-900">Generated Links</h3>
                {urls.map((item, i) => (
                    <UrlCard key={i} data={item} />
                ))}
            </div>
        )}

      </div>
    </div>
  );
}

function UrlCard({ data }: { data: any }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(data.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-sm text-slate-900">{data.type}</h4>
                    <p className="text-xs text-slate-500">{data.desc}</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={copyToClipboard}
                        className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    <a 
                        href={data.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
            <div className="bg-slate-50 p-2 rounded text-xs font-mono text-slate-600 break-all border border-slate-100">
                {data.url}
            </div>
        </div>
    );
}