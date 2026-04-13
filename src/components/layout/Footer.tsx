"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Phone, Mail } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants/config";

const footerLinks = {
  services: [
    { name: "Plomberie", href: "/services/plomberie" },
    { name: "Électricité", href: "/services/electricite" },
    { name: "Coiffure", href: "/services/coiffure" },
    { name: "Livraison", href: "/services/livraison" },
    { name: "Tous les services", href: "/services" },
  ],
  company: [
    { name: "À propos", href: "/about" },
    { name: "Carrières", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Presse", href: "/press" },
  ],
  support: [
    { name: "Centre d'aide", href: "/help" },
    { name: "Contact", href: "/contact" },
    { name: "CGU", href: "/terms" },
    { name: "Confidentialité", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#181c1d] text-white">
      <div className="max-w-screen-2xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-black tracking-tight text-white">
              Allo Services CI
            </Link>
            <p className="text-primary font-semibold mt-2">
              Le bon prestataire, au bon moment, près de chez vous.
            </p>
            <p className="text-white/60 mt-3 max-w-sm">
              Le premier réseau de professionnels vérifiés en Côte d&apos;Ivoire pour tous vos besoins du quotidien.
            </p>
            
            {/* Contact */}
            <div className="mt-4 space-y-2">
              <a 
                href={`tel:${APP_CONFIG.contact.phoneInternational}`}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-medium">{APP_CONFIG.contact.phoneFormatted}</span>
              </a>
              <a 
                href={`mailto:${APP_CONFIG.contact.email}`}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>{APP_CONFIG.contact.email}</span>
              </a>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://facebook.com/alloservicesci"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#004150] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/alloservicesci"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#004150] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${APP_CONFIG.contact.phoneInternational.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#004150] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Allo Services CI. Tous droits réservés. Fait avec ❤️ en 🇨🇮
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40">Paiement sécurisé:</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium text-orange-400">Orange</span>
                <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium text-yellow-400">MTN</span>
                <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium text-cyan-400">Wave</span>
                <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium text-blue-400">Moov</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
