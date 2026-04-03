import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home, 
  Search, 
  Shield,
  ChevronDown,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCurrentUser, getCurrentProvider, setCurrentUser, setCurrentProvider } from '@/lib/storage';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUserState] = useState<any>(null);
  const [currentProvider, setCurrentProviderState] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    const provider = getCurrentProvider();
    setCurrentUserState(user);
    setCurrentProviderState(provider);
  }, [location]);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentProvider(null);
    setCurrentUserState(null);
    setCurrentProviderState(null);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/services', label: 'Services', icon: Search },
    { path: '/devenir-prestataire', label: 'Devenir Prestataire', icon: Briefcase },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center">
              <img 
                src="/logo.png" 
                alt="Allo Services CI" 
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-full p-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Admin Link */}
            <Link
              to="/admin"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              title="Espace Admin"
            >
              <Shield className="w-5 h-5" />
            </Link>

            {/* User/Provider Menu */}
            {currentUser || currentProvider ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-2 pr-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                      {currentUser?.firstName || currentProvider?.firstName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="px-3 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentUser?.firstName} {currentUser?.lastName}
                      {currentProvider?.firstName} {currentProvider?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {currentUser?.email || currentProvider?.email}
                    </p>
                  </div>
                  <div className="p-1">
                    {currentProvider && (
                      <DropdownMenuItem onClick={() => navigate('/prestataire/profil')} className="rounded-lg">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                        Mon profil prestataire
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/connexion">
                  <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                    Connexion
                  </Button>
                </Link>
                <Link to="/inscription">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-full px-5">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white border-t border-gray-100 px-4 py-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            
            {!currentUser && !currentProvider && (
              <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-2">
                <Link
                  to="/connexion"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <User className="w-5 h-5" />
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-blue-600 text-white"
                >
                  <User className="w-5 h-5" />
                  S'inscrire
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
