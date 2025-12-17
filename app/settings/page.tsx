'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  User, Lock, Bell, CreditCard, ChevronLeft, 
  Save, Loader2, Mail, Shield, AlertCircle, Camera, Upload
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // State for image upload
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: '', // Added avatarUrl
    currency: 'INR',
    emailAlerts: true,
    marketingEmails: false,
    securityAlerts: true
  });

  // 1. FETCH USER DATA
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // PRE-FILL FORM with data from Supabase Metadata
      setFormData(prev => ({ 
        ...prev, 
        email: user.email || '', 
        fullName: user.user_metadata?.full_name || '', 
        phone: user.user_metadata?.phone || '',
        avatarUrl: user.user_metadata?.avatar_url || '', // Load existing image
      }));
      
      setLoading(false);
    };
    getUser();
  }, [router]);

  // 2. IMAGE UPLOAD FUNCTION (New Feature)
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      setUploadingImage(true);
      const file = event.target.files[0];
      
      // Create a unique file path: user_id/timestamp.ext
      const fileExt = file.name.split('.').pop();
      // This puts the file inside a folder matching the User ID
const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // A. Upload to Supabase Storage 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Get the Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // C. Update Local State immediately
      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));

      // D. Update User Metadata automatically so it persists
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      router.refresh(); // Refresh to update visuals elsewhere

    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // 3. REAL SAVE ACTION (Fixed logic)
  const handleSave = async () => {
    setSaving(true);
    try {
      // Update User Metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          currency: formData.currency 
          // Add other fields to metadata if needed
        }
      });

      if (error) throw error;

      alert('Profile updated successfully!');
      router.refresh(); 

    } catch (error: any) {
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg text-gray-900">Account Settings</h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="md:col-span-1 space-y-1">
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User className="w-4 h-4" />} label="My Profile" />
          <NavButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Lock className="w-4 h-4" />} label="Security" />
          <NavButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={<Bell className="w-4 h-4" />} label="Notifications" />
          <NavButton active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={<CreditCard className="w-4 h-4" />} label="Plans & Billing" />
        </aside>

        {/* CONTENT AREA */}
        <div className="md:col-span-3 space-y-6">
          
          {/* PROFILE SECTION */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Avatar Card (UPDATED with Upload Logic) */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                
                {/* Clickable Image Area */}
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-indigo-600 text-3xl font-bold">{user?.email?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploadingImage ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                  </div>

                  {/* Hidden Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-gray-900">Profile Photo</h3>
                  <p className="text-xs text-gray-500 mb-3">Accepts JPG, PNG or GIF (Max 2MB)</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload New'}
                  </button>
                </div>
              </div>

              {/* Personal Info Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="font-bold text-gray-900">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="email" 
                        disabled
                        className="w-full pl-9 p-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed"
                        value={formData.email}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">To change your email, please contact support.</p>
                  </div>
                </div>
              </div>

              {/* Preferences Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 border-b pb-4">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Default Currency</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                 <div>
                    <h3 className="font-bold text-gray-900 mb-1">Password</h3>
                    <p className="text-sm text-gray-500 mb-4">Update your password associated with this account.</p>
                    <button className="text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                      Change Password
                    </button>
                 </div>
                 
                 <div className="border-t pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                          Two-Factor Authentication <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">Recommended</span>
                        </h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </div>
                 </div>
               </div>

               <div className="bg-red-50 p-6 rounded-xl border border-red-100 space-y-4">
                 <h3 className="font-bold text-red-800 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Danger Zone</h3>
                 <p className="text-sm text-red-600">Once you delete your account, there is no going back. Please be certain.</p>
                 <button className="text-sm font-bold text-red-600 bg-white border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50">
                   Delete Account
                 </button>
               </div>
            </div>
          )}

          {/* NOTIFICATIONS SECTION */}
          {activeTab === 'notifications' && (
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="font-bold text-gray-900 border-b pb-4">Email Notifications</h3>
                
                <ToggleRow 
                  label="Weekly Report" 
                  desc="Receive a summary of your sales and inventory every Monday."
                  checked={formData.emailAlerts}
                  onChange={() => setFormData({...formData, emailAlerts: !formData.emailAlerts})}
                />
                
                <ToggleRow 
                  label="Security Alerts" 
                  desc="Get notified about new sign-ins and password changes."
                  checked={formData.securityAlerts}
                  onChange={() => setFormData({...formData, securityAlerts: !formData.securityAlerts})}
                />

                <ToggleRow 
                  label="Product Updates & Tips" 
                  desc="Stay in the loop with the latest features and selling tips."
                  checked={formData.marketingEmails}
                  onChange={() => setFormData({...formData, marketingEmails: !formData.marketingEmails})}
                />
             </div>
          )}

          {/* BILLING SECTION */}
          {activeTab === 'billing' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Current Plan */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl text-white shadow-lg flex justify-between items-center">
                 <div>
                   <p className="text-gray-400 text-xs font-bold uppercase mb-1">Current Plan</p>
                   <h2 className="text-2xl font-bold flex items-center gap-2">Free Starter <span className="text-xs bg-gray-700 px-2 py-1 rounded">Active</span></h2>
                   <p className="text-sm text-gray-400 mt-2">Limited to 50 calculations per month.</p>
                 </div>
                 <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105">
                   Upgrade to Pro
                 </button>
              </div>

              {/* Payment Methods */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Payment Methods</h3>
                    <button className="text-sm font-medium text-blue-600 hover:underline">+ Add Method</button>
                 </div>
                 <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No payment methods added yet.</p>
                 </div>
              </div>

              {/* Invoices */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-4">Billing History</h3>
                 <p className="text-sm text-gray-500 italic">No invoices found.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        active 
          ? 'bg-blue-50 text-blue-700 shadow-sm' 
          : 'text-gray-600 hover:bg-white hover:text-gray-900'
      }`}
    >
      <span className={active ? 'text-blue-600' : 'text-gray-400'}>{icon}</span>
      {label}
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
    </button>
  );
}

function ToggleRow({ label, desc, checked, onChange }: any) {
  return (
    <div className="flex items-start justify-between py-2">
      <div>
        <h4 className="text-sm font-bold text-gray-900">{label}</h4>
        <p className="text-xs text-gray-500 max-w-sm mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
      >
        <span 
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} 
        />
      </button>
    </div>
  );
}