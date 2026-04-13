"use client";

import { Search, CalendarCheck, Star, CreditCard } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Recherchez",
    description: "Trouvez le prestataire idéal parmi nos catégories de services en filtrant par ville et spécialité.",
    color: "bg-blue-100 text-blue-600",
    numberColor: "bg-blue-600",
  },
  {
    id: 2,
    icon: CalendarCheck,
    title: "Réservez",
    description: "Choisissez une date et une heure qui vous conviennent. Réservez en quelques clics.",
    color: "bg-green-100 text-green-600",
    numberColor: "bg-green-600",
  },
  {
    id: 3,
    icon: Star,
    title: "Profitez",
    description: "Le prestataire se déplace chez vous. Profitez d'un service de qualité professionnelle.",
    color: "bg-amber-100 text-amber-600",
    numberColor: "bg-amber-600",
  },
  {
    id: 4,
    icon: CreditCard,
    title: "Payez",
    description: "Paiement sécurisé via Orange Money, MTN Money, Wave ou Moov Money.",
    color: "bg-purple-100 text-purple-600",
    numberColor: "bg-purple-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-[#f7fafb]">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-widest text-sm uppercase">
            Comment ça marche
          </span>
          <h2 className="font-headline text-4xl font-extrabold text-editorial text-[#181c1d] mt-2">
            Réservez en 4 étapes simples
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative text-center">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-[#bfc8cc]" />
                )}

                {/* Step Number & Icon */}
                <div className="relative z-10 mb-6 inline-block">
                  <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mx-auto transition-all duration-300 hover:scale-110`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 ${step.numberColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {step.id}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-headline text-xl font-bold text-[#181c1d] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#3f484c] max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 text-center">
          <p className="text-[#70787c] mb-4">Paiements sécurisés via</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-orange-600 border border-orange-200">
              Orange Money
            </div>
            <div className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-yellow-600 border border-yellow-200">
              MTN MoMo
            </div>
            <div className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-cyan-600 border border-cyan-200">
              Wave
            </div>
            <div className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-blue-600 border border-blue-200">
              Moov Money
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
