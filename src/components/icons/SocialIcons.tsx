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

export const SOCIAL_ICONS: Record<SocialChannel, ComponentType<LucideProps>> = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: WhatsApp,
  youtube: Youtube,
};
