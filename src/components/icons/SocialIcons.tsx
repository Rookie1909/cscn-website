import type { ComponentType } from 'react';
import { Facebook, Instagram, Youtube, type LucideProps } from 'lucide-react';
import type { SocialChannel } from '@/data/social-links';

// lucide-react hat kein WhatsApp-Logo, daher hier im selben Strichstil (24x24,
// 2px Linie, runde Enden) nachgezeichnet.
function WhatsApp(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

// Auch Discord fehlt in lucide-react: gleicher Strichstil, nachgezeichnet.
function Discord(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0-2 0" />
      <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0-2 0" />
      <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833-1.667 3.5-3c.667-1.667.5-5.833-1.5-11.5c-1.457-1.015-3-1.34-4.5-1.5l-.972 1.923a11.913 11.913 0 0 0-4.053 0l-.975-1.923c-1.5.16-3.043.485-4.5 1.5c-2 5.667-2.167 9.833-1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2-2 2-3" />
      <path d="M7 16.5c3.5 1 6.5 1 10 0" />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<SocialChannel, ComponentType<LucideProps>> = {
  instagram: Instagram,
  facebook: Facebook,
  discord: Discord,
  whatsapp: WhatsApp,
  youtube: Youtube,
};
