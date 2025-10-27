import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export function Hero({ title, subtitle, ctaText, ctaLink, backgroundImage }: HeroProps) {
  return (
    <section className="relative h-[80vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-bold uppercase tracking-tight mb-6 text-white drop-shadow-2xl"
          data-testid="text-hero-title"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 font-medium drop-shadow-lg"
            data-testid="text-hero-subtitle"
          >
            {subtitle}
          </p>
        )}
        <Link href={ctaLink}>
          <Button
            size="lg"
            className="uppercase font-bold tracking-wide text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white text-white"
            data-testid="button-hero-cta"
          >
            {ctaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
