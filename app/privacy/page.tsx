import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { LegalPage, type LegalSection } from '@/ui/modules/legal';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'How we handle your information — kept minimal by design. No account, no checkout on this site.',
};

const UPDATED = 'Last updated 27 May 2026';

const INTRO =
  'This is a short, plain-language summary of how we handle your information. We keep it minimal by design: there is no account to create and no checkout on this site.';

const SECTIONS: readonly LegalSection[] = [
  {
    heading: 'What we collect',
    body: [
      'Browsing this site does not require you to share any personal details. We do not ask you to register or sign in.',
      'When you choose to continue a conversation on WhatsApp, the details you send — such as the piece, finish, room dimensions, and your message — are shared with us through WhatsApp so we can help you.',
    ],
  },
  {
    heading: 'How your configuration is handled',
    body: [
      'Your selections, such as the finish and room width, are stored only in the page address (the URL) so you can share or revisit them. They are not sent to a server by this website.',
    ],
  },
  {
    heading: 'Analytics',
    body: [
      'We may use privacy-respecting analytics to understand which pages are useful and improve the experience. This is aggregate and is not used to identify you. [Before launch: name the analytics provider, or remove this section if none is used.]',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'We use only what is essential for the site to function. We do not use advertising or cross-site tracking cookies.',
    ],
  },
  {
    heading: 'Your choices and contact',
    body: [
      'You can reach us any time with privacy questions at contact@atelier.com. If we make material changes to this policy, we will update the date shown above.',
    ],
  },
];

export default function PrivacyPage(): ReactElement {
  return (
    <LegalPage
      title="Privacy"
      updated={UPDATED}
      intro={INTRO}
      sections={SECTIONS}
    />
  );
}
