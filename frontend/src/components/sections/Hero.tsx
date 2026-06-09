"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/context";

const slides = [
  {
    type: "video",
    src: "https://assets.mixkit.co/videos/572/572-720.mp4",
    overlay: "from-smas-deep-blue/70 via-smas-charcoal/50 to-transparent",
  },
  {
    type: "video",
    src: "https://assets.mixkit.co/videos/51492/51492-720.mp4",
    overlay: "from-smas-aqua/70 via-smas-charcoal/50 to-transparent",
  },
  {
    type: "video",
    src: "https://assets.mixkit.co/videos/51662/51662-720.mp4",
    overlay: "from-smas-soft-green/70 via-smas-charcoal/50 to-transparent",
  },
];

// Country data with flags for the hero stats
const beneficiaryCountries = [
  { name: "Gambia", nameFr: "Gambie", flag: "🇬🇲" },
  { name: "Guinea-Bissau", nameFr: "Guinée-Bissau", flag: "🇬🇼" },
  { name: "Mauritania", nameFr: "Mauritanie", flag: "🇲🇷" },
  { name: "Senegal", nameFr: "Sénégal", flag: "🇸🇳" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t, locale } = useI18n();

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 hero-slide ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          {slide.type === "video" ? (
            <video
              src={slide.src}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={slide.src}
              alt={`Hero slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-smas-aqua/10 rounded-full blur-3xl" />
          </div>
        </div>
      ))}

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-smas-charcoal/50 via-transparent to-smas-charcoal/20 z-[2]" />

      {/* Spacer for navbar */}
      <div className="h-16 sm:h-20 md:h-24" />

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex items-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 md:gap-12 lg:gap-20">

            {/* Left Side - Text Content */}
            <div className="flex-1 w-full">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <span className="w-2 h-2 bg-smas-aqua rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-medium tracking-wide">
                  {t("hero.badge")}
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl text-white leading-tight mb-6 animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                {t("hero.title")}{" "}
                <span className="text-smas-aqua">{t("hero.titleHighlight")}</span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-white/80 text-sm md:text-base lg:text-lg max-w-2xl mb-8 leading-relaxed animate-fade-in-up"
                style={{ animationDelay: "0.6s" }}
              >
                {t("hero.subtitle")}
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row gap-4 animate-fade-in-up mb-10"
                style={{ animationDelay: "0.8s" }}
              >
                <Button
                  onClick={scrollToAbout}
                  className="btn-primary flex items-center justify-center gap-2 text-sm px-6 py-4"
                  size="lg"
                >
                  {t("hero.learnMore")}
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Link href="/map" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="btn-secondary text-sm px-6 py-4 w-full sm:w-auto"
                    size="lg"
                  >
                    {t("hero.accessData")}
                  </Button>
                </Link>
              </div>

              {/* Beneficiary Countries with flags */}
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "1s" }}
              >
                <p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-medium">
                  {t("hero.implementedBy")} — {t("partners.countries")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {beneficiaryCountries.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/15 hover:bg-white/20 transition-all duration-200"
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-white/90 text-sm font-medium">
                        {locale === "fr" ? c.nameFr : c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Stats card */}
            <div
              className="w-full lg:w-auto lg:min-w-[320px] animate-fade-in-up"
              style={{ animationDelay: "0.9s" }}
            >
              <div className="bg-white/8 backdrop-blur-md rounded-3xl p-7 border border-white/15 shadow-2xl">
                <h3 className="text-white/80 text-xs font-semibold mb-6 text-center tracking-widest uppercase">
                  {t("about.label")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-5 text-center">
                    <span className="block font-montserrat font-bold text-3xl text-smas-aqua mb-1">4</span>
                    <span className="text-white/70 text-xs font-medium">{t("about.countries")}</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 text-center">
                    <span className="block font-montserrat font-bold text-3xl text-smas-aqua mb-1">300K</span>
                    <span className="text-white/70 text-xs font-medium">{t("about.area")}</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 text-center">
                    <span className="block font-montserrat font-bold text-3xl text-smas-aqua mb-1">15M+</span>
                    <span className="text-white/70 text-xs font-medium">{locale === "fr" ? "Personnes desservies" : "People Served"}</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 text-center">
                    <span className="block font-montserrat font-bold text-3xl text-smas-aqua mb-1">3</span>
                    <span className="text-white/70 text-xs font-medium">{t("about.years")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentSlide(index);
                setTimeout(() => setIsTransitioning(false), 1200);
              }
            }}
            className={`transition-all duration-500 ${
              index === currentSlide
                ? "w-8 h-1.5 bg-white rounded-full"
                : "w-2 h-1.5 bg-white/50 rounded-full hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-20 right-6 hidden md:flex items-center gap-2 z-20">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/60 animate-bounce z-20">
        <span className="text-[10px] font-medium tracking-wider uppercase">{t("hero.scroll")}</span>
        <ArrowDown className="w-3.5 h-3.5" />
      </div>
    </section>
  );
}
