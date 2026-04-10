"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Icons
const Icons = {
  trendingUp: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  ),
  person: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  handyman: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  mail: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  gavel: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 20L11 10" />
      <path d="M6 15L13 8" />
      <path d="M14 4L20 10" />
      <path d="M19 14L22 17" />
      <path d="M4 21H14" />
    </svg>
  ),
  editNote: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </svg>
  ),
  barChart: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  rocket: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  sms: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  newReleases: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  sell: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  ),
};

// Types
interface Task {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  count: number;
  countBg: string;
}

interface Content {
  id: number;
  title: string;
  category: string;
  time: string;
  status: 'published' | 'draft';
}

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data
  const stats = [
    { label: "Utilisateurs actifs", value: "1,247", change: "+12%", icon: Icons.person, iconBg: "bg-[#d0e1fb]", iconColor: "text-[#54647a]" },
    { label: "Prestations terminées", value: "328", change: "+5%", icon: Icons.handyman, iconBg: "bg-[#003c27]", iconColor: "text-[#4edea3]" },
    { label: "Réservations validées", value: "2,156", change: "+18%", icon: Icons.calendar, iconBg: "bg-[#003366]", iconColor: "text-[#d5e3ff]" },
  ];

  const tasks: Task[] = [
    { id: 1, icon: Icons.mail, title: "Messages non lus", description: "Réponses requises rapidement", count: 5, countBg: "bg-red-500" },
    { id: 2, icon: Icons.shield, title: "KYC en attente", description: "Vérification d'identité prestataire", count: 3, countBg: "bg-[#003366]" },
    { id: 3, icon: Icons.gavel, title: "Litiges à arbitrer", description: "Conflits client vs technicien", count: 2, countBg: "bg-[#505f76]" },
  ];

  const quickActions = [
    { icon: Icons.editNote, title: "Nouveau Post Contenu", primary: true },
    { icon: Icons.email, title: "Email Campagne", primary: false },
    { icon: Icons.barChart, title: "Générer Rapport", primary: false },
  ];

  const recentContent: Content[] = [
    { id: 1, title: "Guide: Nettoyage Industriel", category: "Marketing & SEO", time: "Il y a 2h", status: "published" },
    { id: 2, title: "Offre: Installation Domotique", category: "Promotions", time: "Hier", status: "draft" },
    { id: 3, title: "News: Nouveaux Tarifs 2024", category: "Annonces", time: "02 Mai", status: "published" },
  ];

  if (!mounted) return null;

  return (
    <div className="p-8 pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8">
        {/* Center Column: Main Feed */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Page Header */}
          <div className="flex items-end justify-between mb-2">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40] font-['Manrope',sans-serif]">
                Résumé Performances
              </h1>
              <p className="text-sm text-[#43474f] mt-1">Analyse des 28 derniers jours d&apos;activité</p>
            </div>
            <span className="px-3 py-1 bg-[#d5e3ff] text-[#001b3c] text-[10px] font-bold rounded-full uppercase tracking-tighter">
              Live Monitor
            </span>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] hover:bg-[#f7f9fb] transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-2 rounded-lg", stat.iconBg)}>
                    <span className={stat.iconColor}>{stat.icon}</span>
                  </div>
                  <span className="text-[#00b27b] font-bold text-xs flex items-center gap-1">
                    {Icons.trendingUp}
                    {stat.change}
                  </span>
                </div>
                <p className="text-4xl font-extrabold text-[#001e40] mb-1 tracking-tighter font-['Manrope',sans-serif]">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tasks & Quick Actions Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tasks List */}
            <div className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#001e40] font-['Manrope',sans-serif]">Liste de tâches</h3>
                <button className="text-xs font-bold text-[#3a5f94] hover:underline">Tout voir</button>
              </div>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-[#f2f4f6] rounded-xl group hover:bg-[#eceef0] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#001e40] shadow-sm">
                        {task.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191c1e]">{task.title}</p>
                        <p className="text-xs text-[#43474f]">{task.description}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center",
                      task.countBg
                    )}>
                      {task.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-[#001e40] mb-6 font-['Manrope',sans-serif]">Création Rapide</h3>
              <div className="grid grid-cols-1 gap-4 flex-1">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-xl transition-all hover:-translate-y-1 active:scale-95",
                      action.primary
                        ? "bg-gradient-to-r from-[#001e40] to-[#003366] text-white shadow-lg shadow-[#001e40]/10"
                        : "bg-[#e0e3e5] text-[#191c1e] hover:bg-[#e6e8ea]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {action.icon}
                      <span className="font-bold">{action.title}</span>
                    </div>
                    <span className={action.primary ? "opacity-50" : "text-slate-400"}>
                      {Icons.chevronRight}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Content Table */}
          <div className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-[#001e40] font-['Manrope',sans-serif]">Aperçu contenu récent</h3>
              <button className="p-2 rounded-lg bg-[#f2f4f6] hover:bg-[#eceef0] transition-colors">
                <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                </svg>
              </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-3 bg-[#f2f4f6] rounded-t-xl text-[10px] uppercase tracking-widest font-black text-[#001e40]/60">
              <div className="col-span-6">Titre / Catégorie</div>
              <div className="col-span-3 text-center">Date</div>
              <div className="col-span-3 text-right">Statut</div>
            </div>

            {/* Table Rows */}
            {recentContent.map((content, index) => (
              <div
                key={content.id}
                className={cn(
                  "grid grid-cols-12 px-4 py-5 items-center hover:bg-[#f7f9fb] transition-colors",
                  index === recentContent.length - 1 ? "rounded-b-xl" : "",
                  index % 2 === 1 ? "bg-[#f2f4f6]/30" : ""
                )}
              >
                <div className="col-span-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#d0e1fb] to-[#d5e3ff] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#001e40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#191c1e]">{content.title}</p>
                    <p className="text-[10px] font-medium text-slate-400">{content.category}</p>
                  </div>
                </div>
                <div className="col-span-3 text-center text-xs font-medium text-[#43474f]">{content.time}</div>
                <div className="col-span-3 text-right">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-full",
                    content.status === 'published'
                      ? "bg-[#003c27] text-[#6ffbbe]"
                      : "bg-[#d0e1fb] text-[#54647a]"
                  )}>
                    {content.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Context Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Objectives Card */}
          <div className="bg-gradient-to-br from-[#001e40] to-[#003366] text-white rounded-xl p-8 shadow-xl shadow-[#001e40]/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#003366] rounded-full opacity-20"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-extrabold mb-6 tracking-tight flex items-center gap-2 font-['Manrope',sans-serif]">
                <span className="text-[#4edea3]">{Icons.rocket}</span>
                Objectifs du jour
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Croissance Inscrits</span>
                    <span>70%</span>
                  </div>
                  <div className="h-2 bg-[#003366] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4edea3] w-[70%]"></div>
                  </div>
                  <p className="text-[10px] text-[#a7c8ff]">+10% inscrits ciblés</p>
                </div>
                <div className="flex items-center gap-4 bg-[#003366]/40 p-4 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#4edea3] flex items-center justify-center bg-[#4edea3]">
                    <span className="text-[#002113]">{Icons.check}</span>
                  </div>
                  <span className="text-sm font-medium">Vérifier 3 KYC prioritaires</span>
                </div>
                <div className="flex items-center gap-4 bg-[#003366]/40 p-4 rounded-xl border border-white/5">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center"></div>
                  <span className="text-sm font-medium">Répondre tickets support Nv 2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips & Updates Card */}
          <div className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-[#001e40] mb-6 font-['Manrope',sans-serif]">Conseils & Updates</h3>
            <div className="space-y-4">
              <div className="p-4 bg-[#f2f4f6] rounded-xl border-l-4 border-[#3a5f94]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#3a5f94]">{Icons.sms}</span>
                  <span className="text-xs font-black uppercase text-[#3a5f94] tracking-widest">Optimisation</span>
                </div>
                <p className="text-sm font-bold text-[#191c1e] mb-1">Activer les SMS transactionnels</p>
                <p className="text-xs text-[#43474f]">Réduisez le taux d&apos;annulation de 15% en activant les rappels automatiques.</p>
              </div>
              <div className="p-4 bg-[#f2f4f6] rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#003c27]">{Icons.newReleases}</span>
                  <span className="text-xs font-black uppercase text-[#003c27] tracking-widest">Nouveau</span>
                </div>
                <p className="text-sm font-bold text-[#191c1e] mb-1">Tracking Live Techniciens</p>
                <p className="text-xs text-[#43474f]">La mise à jour v4.2 est disponible pour le suivi cartographique en temps réel.</p>
              </div>
              <div className="p-4 bg-[#003c27] rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#4edea3]">{Icons.sell}</span>
                  <span className="text-xs font-black uppercase text-[#4edea3] tracking-widest">Promotion</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">Promo d&apos;été: -20% frais</p>
                <p className="text-xs text-[#4edea3]/80">Campagne d&apos;activation pour les nouveaux prestataires ce weekend.</p>
              </div>
            </div>
          </div>

          {/* Health Status */}
          <div className="bg-white/50 border border-slate-200/50 rounded-xl p-6 flex flex-col items-center text-center">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Health Status</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse status-glow"></span>
              <span className="text-xs font-bold text-[#001e40]">All Systems Operational</span>
            </div>
            <div className="w-full h-24 bg-gradient-to-br from-[#f2f4f6] to-[#eceef0] rounded-lg flex items-center justify-center opacity-60">
              <svg className="w-full h-16 text-[#001e40]/30" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M0,30 Q20,45 40,30 T80,30 T120,20 T160,35 T200,25" />
                <path d="M0,35 Q20,50 40,35 T80,35 T120,25 T160,40 T200,30" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
