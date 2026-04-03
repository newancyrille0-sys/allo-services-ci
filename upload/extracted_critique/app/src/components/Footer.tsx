import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Shield,
  HelpCircle,
  FileText,
  MessageCircle
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Plomberie', href: '/services?category=plomberie' },
      { label: 'Électricité', href: '/services?category=electricite' },
      { label: 'Beauté & Bien-être', href: '/services?category=beaute' },
      { label: 'Livraison', href: '/services?category=livraison' },
      { label: 'Réparations', href: '/services?category=reparation' },
    ],
    company: [
      { label: 'À propos', href: '#' },
      { label: 'Comment ça marche', href: '#' },
      { label: 'Devenir prestataire', href: '/devenir-prestataire' },
      { label: 'Tarifs', href: '#' },
    ],
    support: [
      { label: 'FAQ', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Mentions légales', href: '#' },
      { label: 'Politique de confidentialité', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img 
                src="/logo.png" 
                alt="Allo Services CI" 
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              La plateforme de référence pour trouver des prestataires de confiance en Côte d'Ivoire. 
              Simple, rapide et sécurisé.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Abidjan, Côte d'Ivoire<br />
                  Cocody, Rue des Jardins
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a 
                  href="tel:+2250700000000" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  +225 07 00 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a 
                  href="mailto:contact@alloservices.ci" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  contact@alloservices.ci
                </a>
              </li>
            </ul>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex flex-col gap-2">
                <Link 
                  to="/admin"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Shield className="w-4 h-4" />
                  Espace Admin
                </Link>
                <Link 
                  to="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <HelpCircle className="w-4 h-4" />
                  Centre d'aide
                </Link>
                <Link 
                  to="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Conditions d'utilisation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              {currentYear} Allo Services CI. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Confidentialité
              </Link>
              <Link to="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                CGU
              </Link>
              <Link to="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
