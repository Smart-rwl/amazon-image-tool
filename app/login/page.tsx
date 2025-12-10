'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Call your existing API route
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid password');
      }

      // 2. Success! Force a router refresh to update cookies, then redirect
      router.refresh(); 
      router.push(redirectPath);

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="bg-slate-950/50 p-8 border-b border-slate-800 text-center">
          <div className="mx-auto bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-slate-400 text-sm mt-2">Enter password to manage assets</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                  required 
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm font-medium text-center bg-red-950/30 p-2 rounded border border-red-900/50">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Access Dashboard <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

           <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <Link href="/" className="text-slate-500 hover:text-white text-sm transition-colors">
              ← Back to Asset Manager
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}