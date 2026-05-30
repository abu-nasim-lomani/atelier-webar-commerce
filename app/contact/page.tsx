import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { buildWhatsAppUrl } from '@/commerce';
import { ContactPage } from '@/ui/modules/legal';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Talk to a person — WhatsApp, email, or visit the showroom by appointment.',
};

const EMAIL = 'contact@atelier.com';
const ADDRESS_LINES = [
  'Atelier Showroom',
  'Notun Bajar, Dhaka',
  'Bangladesh',
] as const;
const HOURS = 'By appointment — confirm a time with us on WhatsApp.';

export default function Contact(): ReactElement {
  const whatsappUrl = buildWhatsAppUrl(
    'Hi — I have a question about your furniture.',
  );

  return (
    <ContactPage
      intro="The simplest way to reach us is on WhatsApp — send the piece you are considering and we will take it from there."
      whatsappUrl={whatsappUrl}
      email={EMAIL}
      addressLines={ADDRESS_LINES}
      hours={HOURS}
    />
  );
}
