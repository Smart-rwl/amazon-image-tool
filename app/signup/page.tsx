'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Loader2, User, Building, Phone, Mail, Lock, CheckCircle, AlertCircle 
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  
  // centralized form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // 1. Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    // 2. Validation: Basic password length check
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      setLoading(false);
      return;
    }

    // 3. Supabase Signup
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        // This stores the extra fields in the user's metadata in Supabase
        data: {
          full_name: formData.fullName,
          phone: formData.mobile,
          company: formData.companyName || null,
        },
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ 
        type: 'success', 
        text: 'Account created! Please check your email to confirm your registration.' 
      });
      // Optional: Clear form
      setFormData({ fullName: '', email: '', mobile: '', companyName: '', password: '', confirmPassword: '' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gray-900 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">Join thousands of sellers optimizing their business.</p>
        </div>

        <div className="p-8">
          
          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 text-sm rounded-lg border flex items-start gap-3 ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-600 border-red-100' 
                : 'bg-green-50 text-green-700 border-green-100'
            }`}>
              {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email & Mobile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile No.</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    name="mobile"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Company Name (Optional) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Company Name <span className="text-gray-400 font-normal normal-case">(Optional)</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  name="companyName"
                  type="text"
                  placeholder="e.g. Acme Sellers Ltd."
                  className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    className={`w-full pl-10 p-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}