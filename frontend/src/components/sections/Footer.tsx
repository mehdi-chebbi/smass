'use client';

import Link from 'next/link';
import { Droplets, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useI18n } from '@/i18n/context';

const quickLinks = [
  { labelKey: 'nav.about.label', href: '/about' },
  { labelKey: 'nav.components.label', href: '/components' },
  { labelKey: 'nav.data.label', href: '/data' },
  { labelKey: 'nav.news.label', href: '/news' },
  { labelKey: 'nav.partners.label', href: '/partners' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-smas-charcoal text-white">
      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-smas-deep-blue flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="font-montserrat font-bold text-white text-lg">
                SMAS Project
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
              {t('footer.description')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-smas-deep-blue transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Tunis, Tunisia</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:contact@smas.oss" className="hover:text-white transition-colors">
                  contact@smas.oss
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+21671206633" className="hover:text-white transition-colors">
                  +216 71 206 633
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/privacy" className="text-white/40 hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <span className="text-white/20">|</span>
              <Link href="/terms" className="text-white/40 hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
