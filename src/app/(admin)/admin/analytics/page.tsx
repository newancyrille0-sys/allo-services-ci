"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Icons
const Icons = {
  trendingUp: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  ),
  click: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
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
  download: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
};

// Traffic data for chart
const trafficData = [
  { day: "MON", value: 40, active: false },
  { day: "TUE", value: 55, active: false },
  { day: "WED", value: 48, active: true },
  { day: "THU", value: 70, active: false },
  { day: "FRI", value: 62, active: false },
  { day: "SAT", value: 28, active: false },
  { day: "SUN", value: 22, active: false },
];

// Service distribution
const serviceDistribution = [
  { name: "Technical Maintenance", percentage: 45, color: "#001e40" },
  { name: "Emergency Repair", percentage: 30, color: "#00b27b" },
  { name: "Consultation", percentage: 25, color: "#505f76" },
];

// Recent requests
const recentRequests = [
  { id: "#AS-9021", client: "Bictogo Marine", category: "HVAC Systems", priority: "CRITICAL", status: "ACTIVE", value: "$4,200" },
  { id: "#AS-8842", client: "Global Corp CI", category: "Security Grid", priority: "MEDIUM", status: "PENDING", value: "$1,850" },
  { id: "#AS-8711", client: "Sodeci Logistics", category: "Fleet Maintenance", priority: "LOW", status: "ACTIVE", value: "$12,900" },
];

export default function AdminAnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<"30days" | "quarter" | "custom">("30days");

  return (
    <div className="min-h-screen">
      {/* Page Header with Time Filter */}
      <div className="p-8 pt-24 pb-0">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-[#001e40] font-['Manrope',sans-serif] tracking-tight">
                Command Center
              </h1>
              <p className="text-[#43474f] mt-1 text-sm">
                Real-time performance metrics and infrastructure health.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl shadow-sm">
              <button
                onClick={() => setTimeFilter("30days")}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                  timeFilter === "30days" ? "bg-[#e6e8ea] text-[#001e40]" : "text-[#43474f] hover:bg-[#f2f4f6]"
                )}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeFilter("quarter")}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                  timeFilter === "quarter" ? "bg-[#e6e8ea] text-[#001e40]" : "text-[#43474f] hover:bg-[#f2f4f6]"
                )}
              >
                Last Quarter
              </button>
              <button
                onClick={() => setTimeFilter("custom")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#43474f] hover:bg-[#f2f4f6] rounded-lg transition-colors"
              >
                {Icons.calendar}
                Custom Range
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 pt-0">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Growth Rate */}
            <div className="bg-white p-8 rounded-xl relative overflow-hidden group hover:bg-[#f7f9fb] transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[#d0e1fb] rounded-lg text-[#54647a]">
                  {Icons.trendingUp}
                </div>
                <span className="text-[#003c27] font-bold text-sm bg-[#6ffbbe]/30 px-2 py-1 rounded-full">
                  +12.4%
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#43474f] uppercase tracking-wider mb-1">
                Growth Rate
              </h3>
              <p className="text-3xl font-black text-[#001e40] font-['Manrope',sans-serif] tracking-tighter">
                4,822 <span className="text-sm font-normal text-[#43474f] tracking-normal">users</span>
              </p>
              <div className="mt-6 h-1 w-full bg-[#f2f4f6] rounded-full overflow-hidden">
                <div className="h-full bg-[#003366] w-3/4 rounded-full"></div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white p-8 rounded-xl relative overflow-hidden group hover:bg-[#f7f9fb] transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[#003366] rounded-lg text-white">
                  {Icons.click}
                </div>
                <span className="text-[#003c27] font-bold text-sm bg-[#6ffbbe]/30 px-2 py-1 rounded-full">
                  +2.1%
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#43474f] uppercase tracking-wider mb-1">
                Conversion Rate
              </h3>
              <p className="text-3xl font-black text-[#001e40] font-['Manrope',sans-serif] tracking-tighter">
                18.65 <span className="text-sm font-normal text-[#43474f] tracking-normal">%</span>
              </p>
              <div className="mt-6 h-1 w-full bg-[#f2f4f6] rounded-full overflow-hidden">
                <div className="h-full bg-[#505f76] w-2/3 rounded-full"></div>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="bg-white p-8 rounded-xl relative overflow-hidden group hover:bg-[#f7f9fb] transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[#003c27] rounded-lg text-[#00b27b]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" fill="none" />
                    <line x1="9" y1="9" x2="9.01" y2="9" stroke="white" strokeWidth="3" />
                    <line x1="15" y1="9" x2="15.01" y2="9" stroke="white" strokeWidth="3" />
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00b27b] animate-pulse status-glow"></span>
                  <span className="text-xs font-bold text-[#00b27b]">LIVE</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-[#43474f] uppercase tracking-wider mb-1">
                Customer Satisfaction
              </h3>
              <p className="text-3xl font-black text-[#001e40] font-['Manrope',sans-serif] tracking-tighter">
                4.92 <span className="text-sm font-normal text-[#43474f] tracking-normal">/ 5.0</span>
              </p>
              <div className="mt-6 h-1 w-full bg-[#f2f4f6] rounded-full overflow-hidden">
                <div className="h-full bg-[#00b27b] w-[98%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Platform Traffic Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-xl">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h4 className="text-xl font-bold text-[#001e40] font-['Manrope',sans-serif] tracking-tight">
                    Platform Traffic
                  </h4>
                  <p className="text-xs text-[#43474f]">Daily unique visitors across all territories.</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#003366]"></span>
                    <span className="text-xs font-medium text-[#43474f]">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#d3e4fe]"></span>
                    <span className="text-xs font-medium text-[#43474f]">Projected</span>
                  </div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="relative h-[300px] w-full flex items-end justify-between px-4">
                {/* Background Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-t border-dashed border-[#e0e3e5] w-full"></div>
                  ))}
                </div>

                {/* Area Chart SVG */}
                <svg className="absolute bottom-0 left-0 w-full h-48" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <defs>
                    <linearGradient id="gradient-traffic" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#003366" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#003366" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,20 L0,15 C10,12 20,18 30,10 C40,5 50,12 60,8 C70,4 80,10 90,5 L100,8 L100,20 Z"
                    fill="url(#gradient-traffic)"
                  />
                  <path
                    d="M0,15 C10,12 20,18 30,10 C40,5 50,12 60,8 C70,4 80,10 90,5 L100,8"
                    fill="none"
                    stroke="#003366"
                    strokeWidth="0.5"
                  />
                </svg>

                {/* Bar Chart */}
                {trafficData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 z-10">
                    <div
                      className={cn(
                        "w-12 rounded-t-lg transition-all",
                        item.active ? "h-28 bg-[#003366] shadow-lg" : "h-24 bg-[#f2f4f6]"
                      )}
                    ></div>
                    <span className={cn(
                      "text-[10px] font-bold",
                      item.active ? "text-[#001e40]" : "text-[#43474f]"
                    )}>
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Portfolio Pie Chart */}
            <div className="bg-white p-8 rounded-xl flex flex-col">
              <h4 className="text-xl font-bold text-[#001e40] font-['Manrope',sans-serif] tracking-tight mb-2">
                Service Portfolio
              </h4>
              <p className="text-xs text-[#43474f] mb-8">Revenue breakdown by service category.</p>

              {/* Pie Chart */}
              <div className="relative w-48 h-48 mx-auto mb-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#f2f4f6" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    fill="transparent"
                    r="15.915"
                    stroke="#001e40"
                    strokeDasharray="45 55"
                    strokeDashoffset="0"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    fill="transparent"
                    r="15.915"
                    stroke="#00b27b"
                    strokeDasharray="30 70"
                    strokeDashoffset="-45"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    fill="transparent"
                    r="15.915"
                    stroke="#505f76"
                    strokeDasharray="25 75"
                    strokeDashoffset="-75"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#001e40]">$2.4M</span>
                  <span className="text-[10px] font-bold text-[#43474f] tracking-wider">TOTAL</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-4">
                {serviceDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                      <span className="text-sm font-semibold text-[#191c1e]">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-[#001e40]">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="bg-white rounded-xl overflow-hidden shadow-[0px_12px_32px_rgba(25,28,30,0.06)]">
            <div className="px-8 py-6 flex justify-between items-center">
              <h4 className="text-xl font-bold text-[#001e40] font-['Manrope',sans-serif] tracking-tight">
                Recent Infrastructure Requests
              </h4>
              <button className="text-sm font-bold text-[#003366] hover:underline flex items-center gap-2">
                {Icons.download}
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#e0e3e5]/30">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-wider">Service ID</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-wider">Client</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-wider">Category</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-wider">Priority</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-wider text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e3e5]/10">
                  {recentRequests.map((request, index) => (
                    <tr
                      key={request.id}
                      className={cn(
                        "hover:bg-[#f7f9fb] transition-colors",
                        index % 2 === 1 ? "bg-[#f2f4f6]/20" : ""
                      )}
                    >
                      <td className="px-8 py-5 text-sm font-bold text-[#001e40]">{request.id}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black",
                            index === 0 ? "bg-[#d5e3ff] text-[#001e40]" :
                            index === 1 ? "bg-[#d3e4fe] text-[#0b1c30]" :
                            "bg-[#6ffbbe] text-[#002113]"
                          )}>
                            {request.client.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium">{request.client}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-[#43474f]">{request.category}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black",
                          request.priority === "CRITICAL" ? "bg-[#ffdad6] text-[#93000a]" :
                          request.priority === "MEDIUM" ? "bg-[#d0e1fb] text-[#54647a]" :
                          "bg-[#003c27] text-[#6ffbbe]"
                        )}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            request.status === "ACTIVE" ? "bg-[#00b27b] status-glow" : "bg-[#737780]"
                          )}></span>
                          <span className={cn(
                            "text-xs font-bold",
                            request.status === "ACTIVE" ? "text-[#00b27b]" : "text-[#737780]"
                          )}>
                            {request.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-[#001e40] text-right">{request.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
