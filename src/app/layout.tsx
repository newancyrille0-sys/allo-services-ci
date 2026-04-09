import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AssistantChat } from "@/components/assistant/AssistantChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#004150",
};

export const metadata: Metadata = {
  title: {
    default: "Allo Services CI - Excellence & Confiance",
    template: "%s | Allo Services CI",
  },
  description:
    "Le premier réseau de professionnels vérifiés en Côte d'Ivoire pour tous vos besoins du quotidien. Plomberie, électricité, coiffure, livraison...",
  keywords: [
    "services",
    "Côte d'Ivoire",
    "prestataires",
    "Abidjan",
    "plombier",
    "électricien",
    "coiffure",
    "livraison",
  ],
  authors: [{ name: "Allo Services CI" }],
  creator: "Allo Services CI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-body antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
        <AssistantChat />
      </body>
    </html>
  );
}
