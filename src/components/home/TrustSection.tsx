"use client";

import { Shield, CreditCard, Headphones, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Profils 100% Vérifiés",
    description: "Chaque prestataire passe un entretien rigoureux et une vérification d'identité systématique.",
  },
  {
    icon: CreditCard,
    title: "Paiements Sécurisés",
    description: "Vos transactions sont protégées. Le prestataire n'est payé qu'une fois le travail validé par vos soins.",
  },
  {
    icon: Headphones,
    title: "Assistance 24/7",
    description: "Une équipe locale dédiée pour vous accompagner avant, pendant et après chaque prestation.",
  },
];

export function TrustSection() {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 mt-32">
      <div className="bg-primary rounded-[3rem] p-10 md:p-20 overflow-hidden relative">
        {/* Background Icon */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Shield className="w-[30rem] h-[30rem] rotate-12 text-white" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Votre sécurité est notre priorité absolue.
            </h2>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="bg-white/10 p-3 rounded-2xl shrink-0">
                      <Icon className="w-6 h-6 text-[#50C878]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{feature.title}</h4>
                      <p className="text-white/60 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Chat Card */}
          <div className="relative">
            <div className="glass-card p-8 rounded-[2.5rem] relative z-20">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  AS
                </div>
                <div>
                  <div className="text-primary font-bold">Allo Services Support</div>
                  <div className="text-[#3f484c] text-xs">En ligne actuellement</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4">
                <div className="bg-[#f1f4f5] p-4 rounded-2xl rounded-tl-none mr-12 text-sm text-[#181c1d]">
                  Bonjour ! Comment puis-je vous aider à trouver le meilleur expert aujourd&apos;hui ?
                </div>
                <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none ml-12 text-sm">
                  Je cherche un électricien certifié sur Cocody pour demain 10h.
                </div>
                <div className="bg-[#f1f4f5] p-4 rounded-2xl rounded-tl-none mr-12 text-sm text-[#181c1d]">
                  Parfait. Nous avons 3 experts disponibles qui correspondent à vos critères.
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#fd7613] rounded-full blur-[80px] opacity-20" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#50C878] rounded-full blur-[100px] opacity-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
