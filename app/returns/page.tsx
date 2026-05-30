import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { LegalPage, type LegalSection } from '@/ui/modules/legal';

export const metadata: Metadata = {
  title: 'Returns & delivery',
  description:
    'How delivery works, pay-on-delivery, and what happens if a piece is not right.',
};

const UPDATED = 'Last updated 27 May 2026';

const INTRO = 'How delivery works, and what happens if a piece is not right.';

const SECTIONS: readonly LegalSection[] = [
  {
    heading: 'Delivery',
    body: [
      'We deliver within [areas served — to be confirmed before launch]. Lead time is typically [lead time — to be confirmed], as many pieces are prepared to order. We will confirm a delivery window with you on WhatsApp.',
    ],
  },
  {
    heading: 'Pay on delivery',
    body: [
      'Where available, you can pay when your piece arrives. We will confirm the payment options for your area before delivery.',
    ],
  },
  {
    heading: 'Inspect on arrival',
    body: [
      'Please check your piece on delivery. If anything is damaged or not as agreed, tell the delivery team and message us right away so we can put it right.',
    ],
  },
  {
    heading: 'Returns and exchanges',
    body: [
      'If a piece is not right, contact us within [return window — to be confirmed] of delivery. It should be unused and in its original condition.',
      'Made-to-order pieces and custom finishes may not be returnable except in the case of a fault.',
    ],
  },
  {
    heading: 'How to start a return',
    body: [
      'Message us on WhatsApp with your order details and a photo if relevant, and we will guide you through the next steps.',
    ],
  },
  {
    heading: 'Visit the showroom',
    body: [
      'Prefer to see and feel a piece first? You are welcome to visit our showroom — details are on the Contact page.',
    ],
  },
];

export default function ReturnsPage(): ReactElement {
  return (
    <LegalPage
      title="Returns & delivery"
      updated={UPDATED}
      intro={INTRO}
      sections={SECTIONS}
    />
  );
}
