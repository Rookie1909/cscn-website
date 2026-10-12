export type SocialChannel = 'instagram' | 'facebook' | 'discord' | 'whatsapp' | 'youtube';

export interface SocialLink {
  id: SocialChannel;
  label: string;
  /** Vollständige Adresse (https://…). */
  url: string;
  /** true = Kanal ist noch nicht live: Icon wird ausgegraut mit „Demnächst“ gezeigt, ohne Link. */
  comingSoon?: boolean;
}

// Diese Kanäle erscheinen in der festen Leiste am unteren Bildschirmrand
// (SocialBar). Die Reihenfolge hier ist die Reihenfolge dort.
//
// Kanal geht live:    url eintragen und `comingSoon: true` entfernen.
// Kanal ausblenden:   Eintrag löschen (oder url '' lassen und kein comingSoon setzen).
// Noch offene Adressen:
//   WhatsApp: https://whatsapp.com/channel/<kanal-id>   (Kanal-Link aus der WhatsApp-App)
//   YouTube:  https://www.youtube.com/@<kanalname>
export const socialLinks: SocialLink[] = [
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/cannabissocialclub_nordheide/' },
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/CSCNordheide' },
  { id: 'discord', label: 'Discord', url: 'https://discord.gg/mYVN4vtkv6' },
  { id: 'whatsapp', label: 'WhatsApp', url: '', comingSoon: true },
  { id: 'youtube', label: 'YouTube', url: '', comingSoon: true },
];

/** Alles, was in der Leiste erscheint: Kanäle mit https-Adresse und „Demnächst“-Platzhalter. */
export const visibleSocialLinks = socialLinks.filter((l) => l.url.startsWith('https://') || l.comingSoon);
