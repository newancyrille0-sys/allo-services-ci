"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tight text-[#00693E]">
          Allo Services CI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/services" 
            className="text-slate-600 hover:text-[#00693E] transition-colors font-semibold"
          >
            Services
          </Link>
          <Link 
            href="/providers" 
            className="text-slate-600 hover:text-[#00693E] transition-colors font-semibold"
          >
            Prestataires
          </Link>
          <Link 
            href="/publications" 
            className="text-slate-600 hover:text-[#00693E] transition-colors font-semibold flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            Publications
          </Link>
          <Link 
            href="/login" 
            className="text-slate-600 hover:text-[#00693E] transition-colors font-semibold"
          >
            Connexion
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2.5 rounded-xl font-bold hover:scale-95 duration-200 transition-transform">
              S&apos;inscrire
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden text-[#00693E]">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
              <SheetTitle className="text-[#00693E]">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              <Link 
                href="/services" 
                className="text-[#181c1d] hover:text-[#00693E] transition-colors font-semibold py-2"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/providers" 
                className="text-[#181c1d] hover:text-[#00693E] transition-colors font-semibold py-2"
                onClick={() => setIsOpen(false)}
              >
                Prestataires
              </Link>
              <Link 
                href="/publications" 
                className="text-[#181c1d] hover:text-[#00693E] transition-colors font-semibold py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <FileText className="h-4 w-4" />
                Publications
              </Link>
              <Link 
                href="/login" 
                className="text-[#181c1d] hover:text-[#00693E] transition-colors font-semibold py-2"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-primary-container text-white">
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Header;
