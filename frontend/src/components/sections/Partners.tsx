"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/context";

const countries = [
  {
    name: "The Gambia",
    nameFr: "La Gambie",
    code: "GM",
    flag: "🇬🇲",
    href: "/water/gambia",
  },
  {
    name: "Guinea-Bissau",
    nameFr: "Guinée-Bissau",
    code: "GW",
    flag: "🇬🇼",
    href: "/water/guinea-bissau",
  },
  {
    name: "Mauritania",
    nameFr: "Mauritanie",
    code: "MR",
    flag: "🇲🇷",
    href: "/water/mauritania",
  },
  {
    name: "Senegal",
    nameFr: "Sénégal",
    code: "SN",
    flag: "🇸🇳",
    href: "/water/senegal",
  },
];

const organizations = [
  {
    name: "OSS",
    src: "/partners/oss_2.png",
    fullNameEn: "Observatory of the Sahara and the Sahel",
    fullNameFr: "Observatoire du Sahara et du Sahel",
    href: "/partners/oss",
    website: "https://www.oss-online.org",
  },
  {
    name: "OMVS",
    src: "/partners/omvs_1.png",
    fullNameEn: "Organization for the Development of the Senegal River",
    fullNameFr: "Organisation pour la Mise en Valeur du fleuve Sénégal",
    href: "/partners/omvs",
    website: "https://www.omvs.org",
  },
  {
    name: "OMVG",
    src: "/partners/omvg_1.png",
    fullNameEn: "Organization for the Development of the Gambia River",
    fullNameFr: "Organisation pour la Mise en Valeur du fleuve Gambie",
    href: "/partners/omvg",
    website: "https://www.omvg.org",
  },
  {
    name: "GEF",
    src: "/partners/gef_1.png",
    fullNameEn: "Global Environment Facility",
    fullNameFr: "Fonds pour l'Environnement Mondial",
    href: "/partners/gef",
    website: "https://www.thegef.org",
  },
  {
    name: "UNEP",
    src: "/partners/unep_1.png",
    fullNameEn: "United Nations Environment Programme",
    fullNameFr: "Programme des Nations Unies pour l'Environnement",
    href: "/partners/unep",
    website: "https://www.unep.org",
  },
];

const additionalPartners = [
  {
    name: "UNECE",
    src: "/partners/unece.png",
    fullNameEn: "United Nations Economic Commission for Europe",
    fullNameFr: "Commission Économique des Nations Unies pour l'Europe",
    website: "https://unece.org",
  },
  {
    name: "Water Hub",
    src: "/partners/waterhub_1.png",
    fullNameEn: "Water Hub",
    fullNameFr: "Water Hub",
    website: "https://www.genevawaterhub.org",
  },
  {
    name: "IGRAC",
    src: "/partners/igrac_1.png",
    fullNameEn: "International Groundwater Resources Assessment Centre",
    fullNameFr:
      "Centre International d'Évaluation des Ressources en Eaux Souterraines",
    website: "https://un-igrac.org",
  },
  {
    name: "Water Convention",
    src: "/partners/waterconvention.png",
    fullNameEn: "Water Convention (UNECE)",
    fullNameFr: "Convention sur l'Eau (UNECE)",
    website: "https://unece.org/environment-policy/water",
  },
  {
    name: "World Bank Group",
    src: "/partners/worldbank.png",
    fullNameEn: "World Bank Group – Water",
    fullNameFr: "Groupe Banque Mondiale – Eau",
    website: "https://www.worldbank.org/en/topic/water",
  },
  {
    name: "UE",
    src: "/partners/ue.png",
    fullNameEn: "European Union",
    fullNameFr: "Union Européenne",
    website: "https://international-partnerships.ec.europa.eu",
  },
  {
    name: "SDC",
    src: "/partners/SDC_1.png",
    fullNameEn: "Swiss Agency for Development and Cooperation",
    fullNameFr: "Agence Suisse pour le Développement et la Coopération",
    website: "https://www.sdc.admin.ch",
  },
];

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t, locale } = useI18n();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="partners"
      ref={sectionRef}
      className="w-full py-20 md:py-28 bg-smas-off-white"
    >
      <div className="section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 mb-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="w-8 h-0.5 bg-smas-deep-blue" />
            <span className="text-smas-deep-blue text-sm font-semibold uppercase tracking-wider">
              {t("partners.label")}
            </span>
            <span className="w-8 h-0.5 bg-smas-deep-blue" />
          </div>
          <h2
            className={`font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl text-smas-charcoal leading-tight mb-4 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("partners.title")}{" "}
            <span className="text-smas-deep-blue">
              {t("partners.titleHighlight")}
            </span>
          </h2>
          <p
            className={`text-smas-charcoal/70 leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("partners.subtitle")}
          </p>
        </div>

        {/* Beneficiary Countries with Flags */}
        <div className="mb-16">
          <h3
            className={`font-montserrat font-semibold text-lg text-smas-charcoal mb-8 text-center transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("partners.countries")}
          </h3>
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {countries.map((country) => (
              <Link key={country.code} href={country.href} className="group">
                <div className="bg-white rounded-2xl p-6 text-center border border-smas-sand-beige/50 card-hover hover:border-smas-aqua/40 transition-all duration-300 h-full">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {country.flag}
                  </div>
                  <p className="font-montserrat font-semibold text-smas-charcoal text-sm leading-tight">
                    {locale === "fr" ? country.nameFr : country.name}
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-smas-aqua opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t("common.learnMore")}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Partner Organizations with logos */}
        <div>
          <h3
            className={`font-montserrat font-semibold text-lg text-smas-charcoal mb-8 text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("partners.organizations")}
          </h3>
          <div
            className={`grid grid-cols-2 md:grid-cols-5 gap-4 transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {organizations.map((org) => (
              <a
                key={org.name}
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-white rounded-2xl p-5 text-center border border-smas-sand-beige/50 card-hover hover:border-smas-deep-blue/30 transition-all duration-300 h-full flex flex-col items-center justify-center gap-3">
                  <div className="relative w-full h-14">
                    <Image
                      src={org.src}
                      alt={org.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="160px"
                    />
                  </div>
                  <span className="text-xs text-smas-charcoal/50 line-clamp-2 leading-tight text-center">
                    {locale === "fr" ? org.fullNameFr : org.fullNameEn}
                  </span>
                  <div className="flex items-center justify-center gap-1 text-xs text-smas-aqua opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3 h-3" />
                    <span>
                      {org.website
                        .replace("https://www.", "")
                        .replace("https://", "")
                        .replace(/\/$/, "")}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Additional Partners */}
        <div className="mt-12">
          <h3
            className={`font-montserrat font-semibold text-lg text-smas-charcoal mb-8 text-center transition-all duration-1000 delay-900 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {locale === "fr"
              ? "Autres Partenaires du Projet SMAS"
              : "Other SMAS Project Partners"}
          </h3>
          <div
            className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {additionalPartners.map((partner) => (
              <a
                key={partner.name}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-white rounded-2xl p-4 text-center border border-smas-sand-beige/50 card-hover hover:border-smas-deep-blue/30 transition-all duration-300 h-full flex flex-col items-center justify-between gap-2">
                  <div className="relative w-full h-14 flex-shrink-0">
                    <Image
                      src={partner.src}
                      alt={partner.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="160px"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = "none";
                        const fallback =
                          target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div
                      style={{ display: "none" }}
                      className="absolute inset-0 items-center justify-center"
                    >
                      <span className="font-montserrat font-bold text-lg text-smas-deep-blue">
                        {partner.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-smas-charcoal/50 leading-snug text-center w-full">
                    {locale === "fr" ? partner.fullNameFr : partner.fullNameEn}
                  </span>
                  <div className="flex items-center justify-center gap-1 text-xs text-smas-aqua opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
