import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { LegalPage, type LegalSection } from '@/ui/modules/legal';

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'How you may use this website and how orders are arranged over WhatsApp.',
};

const UPDATED = 'Last updated 27 May 2026';

const INTRO =
  'These terms cover how you use this website and how orders are arranged. By using the site you agree to them.';

const SECTIONS: readonly LegalSection[] = [
  {
    heading: 'Using this site',
    body: [
      'You may browse and share links freely. The content, designs, and images are owned by us or our partners and may not be reused without permission.',
    ],
  },
  {
    heading: 'Product information',
    body: [
      'We show dimensions, finishes, and prices as accurately as we can. Natural materials such as wood and fabric vary slightly in grain and tone, so the piece you receive may differ a little from what you see on screen.',
    ],
  },
  {
    heading: 'Prices and orders',
    body: [
      'Prices are shown in Bangladeshi Taka (BDT) and may change without notice. This site does not take payment.',
      'An order is arranged and confirmed directly with you over WhatsApp. It is final only once we confirm availability and details with you.',
    ],
  },
  {
    heading: 'Liability',
    body: [
      'We provide this site as-is and take care to keep it accurate, but to the extent the law allows we are not liable for indirect losses arising from its use.',
    ],
  },
  {
    heading: 'Governing law',
    body: [
      'These terms are governed by the laws of Bangladesh. [Legal entity name and jurisdiction details to be confirmed before launch.]',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'Questions about these terms? Reach us on WhatsApp, or see the Contact page.',
    ],
  },
];

export default function TermsPage(): ReactElement {
  return (
    <LegalPage
      title="Terms"
      updated={UPDATED}
      intro={INTRO}
      sections={SECTIONS}
    />
  );
}
