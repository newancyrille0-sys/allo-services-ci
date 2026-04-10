"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Icons
const Icons = {
  download: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  add: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  refresh: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,4 23,10 17,10" />
      <polyline points="1,20 1,14 7,14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  tune: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  calendar: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  moreVert: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
  trendingUp: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  checkCircle: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
  ),
  star: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  ),
};

// Mock data
const stats = [
  { label: "Total Active", value: "1,284", change: "+12.5%", icon: Icons.trendingUp, iconColor: "text-[#00b27b]" },
  { label: "Pending Sync", value: "42", change: "REQUIRES ATTENTION", icon: Icons.clock, iconColor: "text-amber-600" },
  { label: "Avg Response", value: "2.4h", change: "WITHIN SERVICE LIMITS", icon: Icons.checkCircle, iconColor: "text-[#00b27b]" },
  { label: "Satisfaction", value: "98.2%", change: "ELITE RATING", icon: Icons.star, iconColor: "text-blue-500" },
];

const requests = [
  { id: "#REQ-92841", client: "Jean-Marc Dupont", location: "Abidjan, Zone 4", service: "Electrical Repair", status: "Assigned", date: "28 Oct 2023, 09:45" },
  { id: "#REQ-92840", client: "Awa Kouadio", location: "Cocody, Angre", service: "Plumbing Emergency", status: "Pending", date: "28 Oct 2023, 08:30" },
  { id: "#REQ-92839", client: "Bakary N'Goran", location: "Plateau, Business District", service: "IT Infrastructure", status: "Completed", date: "27 Oct 2023, 16:12" },
  { id: "#REQ-92838", client: "Laurent Toure", location: "Bingerville", service: "Security CCTV", status: "Assigned", date: "27 Oct 2023, 14:05" },
  { id: "#REQ-92837", client: "Marie Konan", location: "Yopougon", service: "HVAC Maintenance", status: "Pending", date: "27 Oct 2023, 11:30" },
];

export default function AdminRequestsPage() {
  const [statusFilter, setStatusFilter] = useState("All States");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [dateRange] = useState("Oct 01 - Oct 28, 2023");

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="p-8 pt-24 pb-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-[#001e40] font-['Manrope',sans-serif] tracking-tight mb-2">
                Service Requests
              </h1>
              <p className="text-slate-500 max-w-xl">
                Comprehensive ledger of all service interactions across the ALLO ecosystem.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-[#e6e8ea] text-[#191c1e] font-semibold rounded-md text-sm hover:bg-[#d8dadc] transition-colors flex items-center gap-2">
                {Icons.download}
                Export CSV
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-[#001e40] to-[#003366] text-white font-semibold rounded-md text-sm shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
                {Icons.add}
                Create Request
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-[#001e40] font-['Manrope',sans-serif]">{stat.value}</p>
                <div className={cn("mt-4 flex items-center text-[10px] font-bold gap-1", stat.iconColor)}>
                  {stat.icon}
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-[#f2f4f6] p-5 rounded-xl mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border-none rounded-lg text-xs font-semibold px-4 py-2 focus:ring-1 focus:ring-[#001e40]/10"
              >
                <option>All States</option>
                <option>Pending</option>
                <option>Assigned</option>
                <option>Completed</option>
                <option>Escalated</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Date Range:</span>
              <div className="flex items-center bg-white rounded-lg px-3 py-1.5">
                {Icons.calendar}
                <input
                  type="text"
                  value={dateRange}
                  readOnly
                  className="bg-transparent border-none p-0 text-xs font-semibold focus:ring-0 w-40 ml-2"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Service:</span>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="bg-white border-none rounded-lg text-xs font-semibold px-4 py-2 focus:ring-1 focus:ring-[#001e40]/10"
              >
                <option>All Services</option>
                <option>Electrical</option>
                <option>Plumbing</option>
                <option>IT Support</option>
                <option>Security</option>
              </select>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-[#001e40] transition-colors">
                {Icons.refresh}
              </button>
              <button className="p-2 text-slate-400 hover:text-[#001e40] transition-colors">
                {Icons.tune}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="p-8 pt-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.06)] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f2f4f6]/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em]">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em]">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em]">Service Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em]">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((request, index) => (
                  <tr
                    key={request.id}
                    className={cn(
                      "hover:bg-slate-50/50 transition-colors group",
                      index % 2 === 1 ? "bg-[#f2f4f6]/20" : ""
                    )}
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs font-bold text-slate-400">{request.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold",
                          index === 0 ? "bg-[#d5e3ff] text-[#001e40]" :
                          index === 1 ? "bg-[#d3e4fe] text-[#0b1c30]" :
                          index === 2 ? "bg-[#6ffbbe] text-[#002113]" :
                          index === 3 ? "bg-[#a7c8ff] text-[#001e40]" :
                          "bg-[#d0e1fb] text-[#54647a]"
                        )}>
                          {request.client.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#191c1e]">{request.client}</p>
                          <p className="text-[10px] text-slate-400">{request.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-[#43474f]">{request.service}</td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        request.status === "Assigned" ? "bg-[#d0e1fb] text-[#54647a]" :
                        request.status === "Pending" ? "bg-amber-100 text-amber-800" :
                        "bg-[#003c27]/10 text-[#00b27b]"
                      )}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-slate-500 font-medium">{request.date}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-lg shadow-sm">
                        {Icons.moreVert}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Showing 1-10 of 2,482 entries
              </p>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded bg-[#f2f4f6] text-slate-400 hover:text-[#001e40] transition-colors">
                  {Icons.chevronLeft}
                </button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold bg-[#001e40] text-white">1</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100">2</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100">3</button>
                <span className="text-slate-400 px-1">...</span>
                <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100">248</button>
                <button className="p-1.5 rounded bg-[#f2f4f6] text-slate-400 hover:text-[#001e40] transition-colors">
                  {Icons.chevronRight}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
