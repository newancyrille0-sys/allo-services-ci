"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Icons
const Icons = {
  search: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  star: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  ),
  gridView: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  listView: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  add: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  addCircle: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  ),
};

// Technician data
const technicians = [
  { id: 1, name: "Jean Dupont", specialty: "Master Electrician", rating: 4.9, requests: 24, status: "online", avatar: "JD" },
  { id: 2, name: "Fatou Koné", specialty: "Plumbing Expert", rating: 4.8, requests: 112, status: "busy", avatar: "FK" },
  { id: 3, name: "Marc Yao", specialty: "HVAC Specialist", rating: 4.7, requests: 88, status: "offline", avatar: "MY" },
  { id: 4, name: "Amélie Kouadio", specialty: "Smart Home Integrator", rating: 5.0, requests: 45, status: "online", avatar: "AK" },
  { id: 5, name: "David Bakayoko", specialty: "Appliance Repair", rating: 4.6, requests: 201, status: "online", avatar: "DB" },
  { id: 6, name: "Sophie Traoré", specialty: "Electrical Systems", rating: 4.9, requests: 33, status: "busy", avatar: "ST" },
  { id: 7, name: "Ibrahim Diaby", specialty: "Plumbing & Filtration", rating: 4.5, requests: 67, status: "online", avatar: "ID" },
];

const statusConfig = {
  online: { label: "Online", bg: "bg-[#6ffbbe]", text: "text-[#002113]" },
  busy: { label: "Busy", bg: "bg-[#b7c8e1]", text: "text-[#0b1c30]" },
  offline: { label: "Offline", bg: "bg-[#e6e8ea]", text: "text-slate-500" },
};

export default function AdminTechniciansPage() {
  const [specialty, setSpecialty] = useState("All Services");
  const [rating, setRating] = useState("All Ratings");
  const [status, setStatus] = useState("Any Status");

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="p-8 pt-24 pb-0">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-[#001e40] font-['Manrope',sans-serif] tracking-tight">
                Technicians
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Manage and monitor your service fleet in real-time.
              </p>
            </div>
            <button className="bg-gradient-to-r from-[#001e40] to-[#003366] text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg hover:opacity-90 transition-all active:scale-95">
              {Icons.add}
              <span className="ml-2">Add Technician</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-[#f2f4f6] rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#c3c6d1]/10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Specialty:</span>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="border-none bg-transparent text-sm font-semibold focus:ring-0 text-[#001e40] p-0"
              >
                <option>All Services</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>HVAC</option>
                <option>Appliance Repair</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#c3c6d1]/10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Min Rating:</span>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border-none bg-transparent text-sm font-semibold focus:ring-0 text-[#001e40] p-0"
              >
                <option>All Ratings</option>
                <option>4.5+ Stars</option>
                <option>4.0+ Stars</option>
                <option>3.5+ Stars</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#c3c6d1]/10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border-none bg-transparent text-sm font-semibold focus:ring-0 text-[#001e40] p-0"
              >
                <option>Any Status</option>
                <option>Online</option>
                <option>Busy</option>
                <option>Offline</option>
              </select>
            </div>
            <div className="ml-auto flex space-x-2">
              <button className="p-2 text-[#001e40] bg-white rounded-lg shadow-sm">
                {Icons.gridView}
              </button>
              <button className="p-2 text-slate-400 hover:text-[#001e40] transition-colors">
                {Icons.listView}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="p-8 pt-0">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {technicians.map((tech) => {
              const config = statusConfig[tech.status as keyof typeof statusConfig];
              return (
                <div
                  key={tech.id}
                  className="group bg-white rounded-xl p-5 hover:bg-[#f7f9fb] transition-all duration-300 hover:shadow-[0px_12px_32px_rgba(25,28,30,0.06)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#003c27]/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="flex justify-between items-start relative">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d0e1fb] to-[#d5e3ff] flex items-center justify-center text-lg font-black text-[#001e40] ring-4 ring-[#f2f4f6] shadow-sm">
                        {tech.avatar}
                      </div>
                      <span className={cn(
                        "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white",
                        tech.status === 'online' ? "bg-[#00b27b]" : tech.status === 'busy' ? "bg-[#505f76]" : "bg-slate-400"
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          tech.status === 'online' ? "bg-[#00b27b] status-glow" : "bg-white"
                        )}></div>
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={cn("inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", config.bg, config.text)}>
                        {config.label}
                      </div>
                      <div className="mt-2 flex items-center justify-end text-[#00b27b]">
                        {Icons.star}
                        <span className="text-sm font-bold ml-1">{tech.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-[#001e40] font-['Manrope',sans-serif]">{tech.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{tech.specialty}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#c3c6d1]/10 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-[#d0e1fb] flex items-center justify-center border-2 border-white text-[10px] font-bold text-[#54647a]">
                        {tech.requests}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 pl-4 mt-2">Requests Handled</span>
                    </div>
                    <button className="text-[#3a5f94] hover:underline text-xs font-bold uppercase tracking-widest">
                      Details
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add New Card */}
            <div className="group bg-white rounded-xl p-5 hover:bg-[#f7f9fb] transition-all duration-300 hover:shadow-[0px_12px_32px_rgba(25,28,30,0.06)] relative overflow-hidden border-2 border-dashed border-[#c3c6d1]/30 flex flex-col items-center justify-center text-center space-y-4 min-h-[240px]">
              <div className="w-16 h-16 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#001e40]/30 group-hover:text-[#001e40] transition-colors">
                {Icons.addCircle}
              </div>
              <div>
                <h4 className="font-bold text-[#001e40]">Onboard Technician</h4>
                <p className="text-xs text-slate-400 max-w-[120px] mx-auto mt-1">
                  Register a new specialist to the grid
                </p>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-between">
            <p className="text-sm text-slate-400 font-medium">
              Showing <span className="text-[#001e40] font-bold">7</span> of <span className="text-[#001e40] font-bold">42</span> registered technicians
            </p>
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f2f4f6] text-slate-400 hover:text-[#001e40] transition-colors">
                {Icons.chevronLeft}
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#001e40] text-white font-bold shadow-md">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f2f4f6] text-slate-600 hover:bg-[#e6e8ea] transition-colors font-bold">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f2f4f6] text-slate-600 hover:bg-[#e6e8ea] transition-colors font-bold">3</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f2f4f6] text-slate-400 hover:text-[#001e40] transition-colors">
                {Icons.chevronRight}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
