"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, locales } from "@/i18n/context";
import { localeNames } from "@/i18n/config";

const navItems = [
  { labelKey: "nav.home", href: "/", children: [] },
  {
    labelKey: "nav.smas.label",
    href: "/smas",
    children: [
      { labelKey: "nav.smas.component1", href: "/smas/component-1" },
      { labelKey: "nav.smas.component2", href: "/smas/component-2" },
      { labelKey: "nav.smas.component3", href: "/smas/component-3" },
      { labelKey: "nav.smas.component4", href: "/smas/component-4" },
    ],
  },
  {
    labelKey: "nav.news.label",
    href: "/news",
    children: [
      { labelKey: "nav.news.news", href: "/news" },
      { labelKey: "nav.news.events", href: "/news/events" },
    ],
  },
  {
    labelKey: "nav.publications.label",
    href: "/publications",
    children: [
      { labelKey: "nav.publications.reports", href: "/publications/reports" },
      {
        labelKey: "nav.publications.adaptation",
        href: "/publications/adaptation",
      },
      {
        labelKey: "nav.publications.knowledge",
        href: "/publications/knowledge",
      },
      { labelKey: "nav.publications.training", href: "/publications/training" },
    ],
  },
  {
    labelKey: "nav.work.label",
    href: "/work-with-us",
    children: [{ labelKey: "nav.work.tenders", href: "/work-with-us/tenders" }],
  },
  {
    labelKey: "nav.water.label",
    href: "/water",
    children: [
      { labelKey: "nav.water.gambia", href: "/water/gambia" },
      { labelKey: "nav.water.guineaBissau", href: "/water/guinea-bissau" },
      { labelKey: "nav.water.mauritania", href: "/water/mauritania" },
      { labelKey: "nav.water.senegal", href: "/water/senegal" },
    ],
  },
  { labelKey: "nav.map", href: "/map", children: [] },
];

const partnerLogos = [
  {
    name: "OSS",
    src: "/partners/oss_2.png",
    url: "https://www.oss-online.org",
  },
  { name: "OMVS", src: "/partners/omvs_1.png", url: "https://www.omvs.org" },
  { name: "OMVG", src: "/partners/omvg_1.png", url: "https://www.omvg.org" },
  { name: "GEF", src: "/partners/gef_1.png", url: "https://www.thegef.org" },
  { name: "UNEP", src: "/partners/unep_1.png", url: "https://www.unep.org" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;

  return (
    <>
      {/* ── Top Contact Bar ─────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 overflow-hidden transition-all duration-300 bg-smas-deep-blue/95 backdrop-blur-md ${
          isScrolled ? "opacity-0 h-0 pointer-events-none" : "opacity-100 h-10"
        }`}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              smas@oss.org.tn
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              (+216) 71 206 633/634
            </span>
          </div>
          <div className="flex items-center gap-4">
            {[
              "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
              "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
            ].map((d, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-smas-aqua transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Header ─────────────────────────────────── */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent py-3 top-10"
            : "bg-white/98 backdrop-blur-md shadow-sm py-2 top-0"
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center gap-2">
            {/* ── Partner Logos ───────────────────────────────
                - xl+  : tous les 5 logos visibles
                - md→xl: 3 logos seulement
                - <md  : cachés (présents dans le menu burger)  */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              {partnerLogos.map((logo, i) => (
                <a
                  key={logo.name}
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={logo.name}
                  className={`group flex items-center justify-center ${i >= 3 ? "hidden xl:flex" : ""}`}
                >
                  <div
                    className={`transition-all duration-200 flex items-center justify-center rounded-lg overflow-hidden
                      h-9 w-[62px] xl:h-10 xl:w-[72px]
                      ${
                        isTransparent
                          ? "bg-white/95 shadow-md group-hover:shadow-lg group-hover:bg-white group-hover:scale-105"
                          : "bg-transparent group-hover:bg-gray-50 group-hover:scale-105"
                      }`}
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={64}
                      height={36}
                      className="object-contain p-1 w-full h-full"
                      sizes="72px"
                      priority
                    />
                  </div>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div
              className={`hidden xl:block w-px h-7 shrink-0 mx-1 transition-colors duration-300 ${
                isTransparent ? "bg-white/30" : "bg-gray-200"
              }`}
            />

            {/* Desktop nav — visible à partir de xl */}
            <nav className="hidden xl:flex items-center gap-0 flex-1 justify-end">
              {navItems.map((item) =>
                item.children.length > 0 ? (
                  <DropdownMenu key={item.labelKey}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                          isTransparent
                            ? "text-white/95 hover:text-white hover:bg-white/10"
                            : "text-smas-charcoal hover:text-smas-deep-blue hover:bg-smas-sand-beige/40"
                        }`}
                      >
                        {t(item.labelKey)}
                        <ChevronDown className="w-3 h-3 transition-transform group-data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-52 bg-white shadow-xl border-0 rounded-xl p-1"
                    >
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.labelKey} asChild>
                          <Link
                            href={child.href}
                            className="w-full cursor-pointer rounded-lg text-sm text-smas-charcoal hover:text-smas-deep-blue hover:bg-smas-sand-beige/50 px-3 py-2"
                          >
                            {t(child.labelKey)}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.labelKey}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
                      isTransparent
                        ? "text-white/95 hover:text-white hover:bg-white/10"
                        : "text-smas-charcoal hover:text-smas-deep-blue hover:bg-smas-sand-beige/40"
                    } ${
                      pathname === item.href
                        ? isTransparent
                          ? "text-white"
                          : "text-smas-deep-blue"
                        : ""
                    }`}
                  >
                    {t(item.labelKey)}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ${
                        pathname === item.href
                          ? "w-4/5"
                          : "w-0 group-hover:w-4/5"
                      } ${isTransparent ? "bg-white" : "bg-smas-deep-blue"}`}
                    />
                  </Link>
                ),
              )}
            </nav>

            {/* Spacer */}
            <div className="xl:hidden flex-1" />

            {/* ── Right Actions ──────────────────────────────── */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Langue */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isTransparent
                        ? "text-white/95 hover:bg-white/10"
                        : "text-smas-charcoal hover:bg-smas-sand-beige/50"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {locale.toUpperCase()}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-28 bg-white shadow-xl border-0 rounded-xl p-1"
                >
                  {locales.map((loc) => (
                    <DropdownMenuItem
                      key={loc}
                      onClick={() => setLocale(loc)}
                      className={`cursor-pointer rounded-lg text-sm px-3 py-2 ${
                        locale === loc
                          ? "bg-smas-sand-beige/50 text-smas-deep-blue font-medium"
                          : ""
                      }`}
                    >
                      {localeNames[loc]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Contact button — xl+ */}
              <Link href="/contact" className="hidden xl:block">
                <Button
                  size="sm"
                  className={`text-xs px-3 min-w-fit whitespace-nowrap transition-all duration-200 ${
                    isTransparent
                      ? "bg-white/15 text-white border border-white/30 hover:bg-white/25"
                      : "bg-smas-deep-blue text-white hover:bg-smas-deep-blue/90"
                  }`}
                >
                  {t("nav.contact")}
                </Button>
              </Link>

              {/* Burger — <xl */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`xl:hidden p-2 rounded-lg transition-all duration-200 ${
                  isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-smas-charcoal hover:bg-smas-sand-beige/50"
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* ── Mobile / Tablet Menu ────────────────────────── */}
          {isMobileMenuOpen && (
            <div className="xl:hidden absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-2xl overflow-hidden">
              {/* Logos dans le menu burger */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50 overflow-x-auto">
                {partnerLogos.map((logo) => (
                  <a
                    key={logo.name}
                    href={logo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 w-16 h-8 flex items-center justify-center"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={64}
                      height={32}
                      className="object-contain w-full h-full"
                      sizes="64px"
                    />
                  </a>
                ))}
              </div>

              <nav className="py-3 px-3 space-y-0.5 max-h-[75vh] overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.labelKey}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-smas-charcoal hover:bg-smas-sand-beige/40 rounded-xl transition-colors"
                    >
                      {t(item.labelKey)}
                    </Link>
                    {item.children.length > 0 && (
                      <div className="pl-4 space-y-0.5 mb-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.labelKey}
                            href={child.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-smas-charcoal/65 hover:bg-smas-sand-beige/40 hover:text-smas-deep-blue rounded-xl transition-colors"
                          >
                            {t(child.labelKey)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-semibold text-smas-deep-blue hover:bg-smas-sand-beige/40 rounded-xl transition-colors"
                  >
                    {t("nav.contact")}
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
