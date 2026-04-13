"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Kouamé Jean-Baptiste",
    role: "Client à Abidjan",
    content: "J'ai trouvé un excellent plombier en moins de 10 minutes. Le service était rapide et professionnel. Je recommande vivement !",
    rating: 5,
    image: "https://i.pravatar.cc/100?img=33",
    service: "Plomberie",
  },
  {
    id: 2,
    name: "Aya Koné",
    role: "Cliente à Bouaké",
    content: "Grâce à Allo Services CI, j'ai pu trouver une femme de ménage formidable. Le système de réservation est très simple.",
    rating: 5,
    image: "https://i.pravatar.cc/100?img=44",
    service: "Ménage",
  },
  {
    id: 3,
    name: "Dr. Mamadou Diallo",
    role: "Client à San-Pédro",
    content: "En tant que prestataire, cette plateforme m'a permis de développer ma clientèle. Les outils sont excellents.",
    rating: 5,
    image: "https://i.pravatar.cc/100?img=52",
    service: "Consultation",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#fd7613] font-bold tracking-widest text-sm uppercase">
            Témoignages
          </span>
          <h2 className="font-headline text-4xl font-extrabold text-editorial text-[#181c1d] mt-2">
            Ce que disent nos utilisateurs
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white border border-[#bfc8cc]/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-[#50C878] mb-4" />

              {/* Content */}
              <p className="text-[#3f484c] mb-6 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#fd7613] fill-[#fd7613]" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-[#181c1d]">{testimonial.name}</p>
                  <p className="text-sm text-[#70787c]">{testimonial.role}</p>
                </div>
              </div>

              {/* Service Badge */}
              <div className="mt-4 pt-4 border-t border-[#bfc8cc]/20">
                <span className="text-xs font-medium text-primary bg-[#90EE90]/30 px-3 py-1 rounded-full">
                  {testimonial.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
