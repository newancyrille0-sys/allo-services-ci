"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Icons
const Icons = {
  person: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  notifications: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  monetization: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  mail: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  sms: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  lockReset: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
};

export default function AdminSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsDispatch, setSmsDispatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    fullName: "Jean-Philippe Koffi",
    email: "jp.koffi@alloservices.ci",
    bio: "Lead Regional Administrator for Abidjan Hub. Responsible for technical dispatch and quality assurance."
  });

  // Platform fees
  const [platformFees] = useState({
    standardFee: 12.5,
    prioritySurcharge: 15
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-8 pt-24 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#001e40] font-['Manrope',sans-serif] mb-2">
            System Settings
          </h1>
          <p className="text-[#43474f] text-lg">
            Configure your administrative workspace and platform parameters.
          </p>
        </header>

        {/* Settings Grid */}
        <div className="space-y-6">
          {/* Profile Configuration */}
          <section className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold font-['Manrope',sans-serif] text-[#001e40]">Profile Configuration</h3>
                <p className="text-sm text-[#43474f]">Update your personal administrative identity.</p>
              </div>
              <span className="text-[#003366]">{Icons.person}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-[#f2f4f6] border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-[#3a5f94] transition-all text-[#191c1e]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-[#f2f4f6] border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-[#3a5f94] transition-all text-[#191c1e]"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Bio / Administrative Role</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-[#f2f4f6] border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-[#3a5f94] transition-all text-[#191c1e] resize-none"
                />
              </div>
            </div>
          </section>

          {/* Notification Protocol */}
          <section className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold font-['Manrope',sans-serif] text-[#001e40]">Notification Protocol</h3>
                <p className="text-sm text-[#43474f]">Manage how the Sovereign Ledger alerts you.</p>
              </div>
              <span className="text-[#003366]">{Icons.notifications}</span>
            </div>
            <div className="space-y-4">
              {/* Email Alerts Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#f2f4f6] rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center">
                    <span className="text-white text-lg">{Icons.mail}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#191c1e]">Email Alerts</p>
                    <p className="text-xs text-[#43474f]">New technician applications and high-value requests.</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors",
                    emailAlerts ? "bg-[#00b27b]" : "bg-[#c3c6d1]"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    emailAlerts ? "right-1" : "left-1"
                  )}></div>
                </button>
              </div>

              {/* SMS Dispatch Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#f2f4f6] rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#d0e1fb] flex items-center justify-center">
                    <span className="text-[#54647a] text-lg">{Icons.sms}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#191c1e]">SMS Dispatch</p>
                    <p className="text-xs text-[#43474f]">Immediate notification for critical system failures.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSmsDispatch(!smsDispatch)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors",
                    smsDispatch ? "bg-[#00b27b]" : "bg-[#c3c6d1]"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    smsDispatch ? "right-1" : "left-1"
                  )}></div>
                </button>
              </div>
            </div>
          </section>

          {/* Platform Monetization */}
          <section className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold font-['Manrope',sans-serif] text-[#001e40]">Platform Monetization</h3>
                <p className="text-sm text-[#43474f]">Global fee structures and transaction logic.</p>
              </div>
              <span className="text-[#003366]">{Icons.monetization}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Standard Service Fee */}
              <div className="p-6 bg-[#003366] text-white rounded-xl col-span-1 md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-70">Standard Service Fee</label>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black font-['Manrope',sans-serif]">{platformFees.standardFee}</span>
                  <span className="text-xl font-bold opacity-80">%</span>
                </div>
                <p className="mt-4 text-sm opacity-90 leading-relaxed">
                  Applied to all standard residential service requests across all categories.
                </p>
              </div>

              {/* Priority Surcharge */}
              <div className="p-6 bg-[#f2f4f6] rounded-xl flex flex-col justify-between">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#43474f]">Priority Surcharge</label>
                <div className="mt-4">
                  <span className="text-2xl font-black text-[#001e40]">+{platformFees.prioritySurcharge}%</span>
                </div>
                <p className="text-[10px] text-[#43474f] mt-2 italic">Auto-applied after 20:00 GMT</p>
              </div>
            </div>
          </section>

          {/* Sovereign Security */}
          <section className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold font-['Manrope',sans-serif] text-[#001e40]">Sovereign Security</h3>
                <p className="text-sm text-[#43474f]">Credential management and authentication layers.</p>
              </div>
              <span className="text-[#003366]">{Icons.shield}</span>
            </div>
            <div className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between border-b border-[#e6e8ea] pb-4">
                <div>
                  <p className="font-semibold text-[#191c1e]">Two-Factor Authentication</p>
                  <p className="text-xs text-[#43474f]">Enabled via Google Authenticator</p>
                </div>
                <div className="flex items-center gap-2 text-[#00b27b] bg-[#003c27]/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#00b27b] status-glow"></div>
                  <span className="text-[10px] font-bold uppercase">Active</span>
                </div>
              </div>

              {/* Rotate Master Key */}
              <button className="flex items-center gap-2 text-[#001e40] font-bold text-sm hover:underline">
                <span className="text-lg">{Icons.lockReset}</span>
                Rotate Master Encryption Key
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 lg:left-64 h-20 bg-white/90 backdrop-blur-xl border-t-0 shadow-[0px_-12px_32px_rgba(25,28,30,0.04)] z-[60] flex items-center justify-center lg:justify-end px-12">
        <div className="flex gap-4 w-full max-w-4xl">
          <button className="hidden md:block px-6 py-2.5 text-sm font-semibold text-[#505f76] hover:bg-[#e6e8ea] transition-colors rounded-md">
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 md:flex-none px-12 py-2.5 bg-gradient-to-r from-[#001e40] to-[#003366] text-white text-sm font-bold rounded-md shadow-lg shadow-[#001e40]/20 hover:opacity-95 transition-all active:scale-98 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save System Changes"}
          </button>
        </div>
      </footer>
    </div>
  );
}
