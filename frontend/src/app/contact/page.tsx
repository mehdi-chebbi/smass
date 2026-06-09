'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="nav.contact"
      subtitleKey="pages.partners.subtitle"
    >
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-xl p-8 border border-smas-sand-beige/50">
          <h2 className="font-montserrat font-bold text-xl text-smas-charcoal mb-6">
            Send us a message
          </h2>
          <form className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-smas-charcoal mb-1">
                  First Name
                </label>
                <Input placeholder="Your first name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-smas-charcoal mb-1">
                  Last Name
                </label>
                <Input placeholder="Your last name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-smas-charcoal mb-1">
                Email
              </label>
              <Input type="email" placeholder="your.email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-smas-charcoal mb-1">
                Subject
              </label>
              <Input placeholder="Message subject" />
            </div>
            <div>
              <label className="block text-sm font-medium text-smas-charcoal mb-1">
                Message
              </label>
              <Textarea 
                placeholder="Your message..." 
                rows={5}
                className="resize-none"
              />
            </div>
            <Button className="w-full btn-primary">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-8 border border-smas-sand-beige/50">
            <h2 className="font-montserrat font-bold text-xl text-smas-charcoal mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-smas-deep-blue/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-smas-deep-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-smas-charcoal">Address</h3>
                  <p className="text-smas-charcoal/70 text-sm">
                    Boulevard du Leader Yasser Arafat<br />
                    BP 31, 1080 Tunis, Tunisia
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-smas-deep-blue/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-smas-deep-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-smas-charcoal">Email</h3>
                  <a href="mailto:contact@smas.oss" className="text-smas-deep-blue hover:underline text-sm">
                    contact@smas.oss
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-smas-deep-blue/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-smas-deep-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-smas-charcoal">Phone</h3>
                  <a href="tel:+21671206633" className="text-smas-deep-blue hover:underline text-sm">
                    +216 71 206 633
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-smas-deep-blue/10 to-smas-aqua/10 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-smas-deep-blue/30 mx-auto mb-2" />
              <p className="text-smas-charcoal/60 text-sm">Map</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
