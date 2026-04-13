import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1a14]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
