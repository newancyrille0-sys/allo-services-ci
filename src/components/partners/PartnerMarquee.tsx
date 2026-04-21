"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  notificationMessage?: string;
}

interface PartnerMarqueeProps {
  location: "home" | "publicite" | "dashboard";
  className?: string;
  variant?: "default" | "notification";
}

export function PartnerMarquee({ 
  location, 
  className = "",
  variant = "default"
}: PartnerMarqueeProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const params = new URLSearchParams({ location });
        if (variant === "notification") {
          params.append("includeNotification", "true");
        }
        
        const response = await fetch(`/api/partners?${params.toString()}`);
        
        if (!response.ok) {
          console.error("Error fetching partners: HTTP", response.status);
          return;
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          setPartners(data.data);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, [location, variant]);

  if (isLoading || partners.length === 0) {
    return null;
  }

  // Doubler les partenaires pour créer l'effet de défilement infini
  const duplicatedPartners = [...partners, ...partners];

  if (variant === "notification") {
    return (
      <div className={`bg-gradient-to-r from-[#001e40] to-[#003366] py-3 overflow-hidden ${className}`}>
        <div className="marquee-container">
          <div className="marquee-content flex items-center gap-8 animate-marquee">
            {duplicatedPartners.map((partner, index) => (
              <div 
                key={`${partner.id}-${index}`}
                className="flex items-center gap-3 shrink-0"
              >
                <div className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <span className="text-white text-sm whitespace-nowrap">
                  {partner.notificationMessage || partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .marquee-container:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    );
  }

  // Style pour la page d'accueil et publicité
  const isDark = location === "publicite";

  return (
    <div className={`${isDark ? "bg-gray-900" : "bg-white"} py-4 overflow-hidden border-y ${isDark ? "border-gray-800" : "border-gray-100"} ${className}`}>
      <div className="flex items-center gap-4 mb-3 px-4">
        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Nos partenaires
        </span>
        <div className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-100"}`}></div>
      </div>
      <div className="marquee-container">
        <div className="marquee-content flex items-center gap-12 animate-marquee-slow">
          {duplicatedPartners.map((partner, index) => (
            <PartnerLogo 
              key={`${partner.id}-${index}`} 
              partner={partner} 
              isDark={isDark}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 40s linear infinite;
        }
        .marquee-container:hover .animate-marquee-slow {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function PartnerLogo({ partner, isDark }: { partner: Partner; isDark: boolean }) {
  const content = (
    <div className="flex items-center gap-3 shrink-0 group cursor-pointer">
      <div className={`relative w-16 h-10 rounded-lg overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-50"} group-hover:scale-105 transition-transform`}>
        <Image
          src={partner.logoUrl}
          alt={partner.name}
          fill
          className="object-contain p-2"
        />
      </div>
      <div className="flex flex-col">
        <span className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"} group-hover:text-[#001e40]`}>
          {partner.name}
        </span>
        {partner.description && (
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {partner.description}
          </span>
        )}
      </div>
    </div>
  );

  if (partner.websiteUrl) {
    return (
      <Link href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    );
  }

  return content;
}

// Composant pour les notifications de partenaires dans les dashboards
export function PartnerNotification() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        // Vérifier si on doit afficher les notifications (après 3h de session)
        const sessionStart = localStorage.getItem("sessionStart");
        const now = Date.now();
        
        if (!sessionStart) {
          localStorage.setItem("sessionStart", now.toString());
          setIsVisible(false);
          return;
        }

        const sessionStartTime = parseInt(sessionStart);
        const threeHours = 3 * 60 * 60 * 1000;
        
        if (now - sessionStartTime < threeHours) {
          setIsVisible(false);
          return;
        }

        const response = await fetch("/api/partners?location=dashboard&includeNotification=true");
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          setPartners(data.data);
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.error("Error fetching partner notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (isLoading || !isVisible || partners.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#001e40] to-[#003366] rounded-xl p-4 mb-6 relative overflow-hidden">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-white/50 hover:text-white"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-[#4edea3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="text-white font-bold text-sm">Nos Partenaires</span>
      </div>
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {partners.map((partner) => (
          <div key={partner.id} className="flex items-center gap-2 shrink-0">
            <div className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              <Image
                src={partner.logoUrl}
                alt={partner.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="text-white text-sm whitespace-nowrap">
              {partner.notificationMessage || partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnerMarquee;
