"use client";

import Link from "next/link";
import { 
  Wrench, 
  Zap, 
  Scissors, 
  Truck, 
  Wrench as Build,
  Sparkles,
  Heart,
  GraduationCap,
  Camera,
  MoreHorizontal,
  type LucideIcon 
} from "lucide-react";

const categories = [
  { id: 1, name: "Plomberie", slug: "plomberie", icon: Wrench, bgColor: "bg-teal-50", iconColor: "text-teal-800", hoverBg: "group-hover:bg-teal-700", count: 450 },
  { id: 2, name: "Électricité", slug: "electricite", icon: Zap, bgColor: "bg-amber-50", iconColor: "text-amber-800", hoverBg: "group-hover:bg-amber-600", count: 320 },
  { id: 3, name: "Coiffure", slug: "coiffure", icon: Scissors, bgColor: "bg-rose-50", iconColor: "text-rose-800", hoverBg: "group-hover:bg-rose-600", count: 280 },
  { id: 4, name: "Livraison", slug: "livraison", icon: Truck, bgColor: "bg-blue-50", iconColor: "text-blue-800", hoverBg: "group-hover:bg-blue-600", count: 420 },
  { id: 5, name: "Réparation", slug: "reparation", icon: Build, bgColor: "bg-slate-50", iconColor: "text-slate-800", hoverBg: "group-hover:bg-slate-800", count: 200 },
];

export function CategoriesGrid() {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 -mt-16 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              href={`/services/${category.slug}`}
              className="group bg-white p-6 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl ${category.bgColor} flex items-center justify-center ${category.iconColor} ${category.hoverBg} group-hover:text-white transition-colors`}>
                <Icon className="h-8 w-8" />
              </div>
              <span className="font-bold text-[#181c1d]">{category.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default CategoriesGrid;
