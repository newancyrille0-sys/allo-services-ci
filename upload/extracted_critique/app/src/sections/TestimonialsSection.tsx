import { useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTestimonials } from '@/lib/storage';
import type { Testimonial as TestimonialType } from '@/types';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = () => {
      const loaded = getTestimonials();
      setTestimonials(loaded);
      setIsLoading(false);
    };

    loadTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse bg-gray-100 rounded-3xl h-64" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-white" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <MessageSquare className="w-4 h-4" />
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ce que disent nos{' '}
            <span className="gradient-text">clients</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les expériences de nos utilisateurs satisfaits
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-10">
                <Quote className="w-24 h-24 text-blue-600" />
              </div>

              {/* Decorative */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-100/50 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                        <img
                          src={currentTestimonial.clientPhoto || `https://ui-avatars.com/api/?name=${currentTestimonial.clientName}&background=random&size=128`}
                          alt={currentTestimonial.clientName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Quote className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    {/* Rating */}
                    <div className="flex items-center justify-center lg:justify-start gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < currentTestimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl lg:text-2xl text-gray-800 font-medium mb-6 leading-relaxed">
                      "{currentTestimonial.comment}"
                    </blockquote>

                    {/* Author */}
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {currentTestimonial.clientName}
                      </p>
                      <p className="text-blue-600 font-medium">
                        Service utilisé : {currentTestimonial.serviceUsed}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full w-12 h-12 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* Dots */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-blue-600 w-8'
                          : 'bg-gray-300 hover:bg-gray-400 w-2'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full w-12 h-12 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {[
            { value: '10,000+', label: 'Clients satisfaits' },
            { value: '500+', label: 'Prestataires' },
            { value: '50,000+', label: 'Services réalisés' },
            { value: '4.9/5', label: 'Note moyenne' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300"
            >
              <p className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
