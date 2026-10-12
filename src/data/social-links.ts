export type SocialChannel = 'instagram' | 'facebook' | 'whatsapp' | 'youtube';

export interface SocialLink {
  id: SocialChannel;
  label: string;
  /** Vollständige Adresse (https://…). Leer lassen = Kanal wird nicht angezeigt. */
  url: string;
}

// Diese Kanäle erscheinen in der festen Leiste am unteren Bildschirmrand
// (SocialBar). Die Reihenfolge hier ist die Reihenfolge dort.
//
// ACHTUNG – PLATZHALTER: Die Adressen unten zeigen nur auf die Startseite der
// jeweiligen Plattform und müssen durch die echten Kanal-Adressen ersetzt werden:
//   Instagram: https://www.instagram.com/<profilname>/
//   Facebook:  https://www.facebook.com/<seitenname>
//   WhatsApp:  https://whatsapp.com/channel/<kanal-id>   (Kanal-Link aus der WhatsApp-App)
//   YouTube:   https://www.youtube.com/@<kanalname>
// Einen Kanal ausblenden: url auf '' setzen (ist keine Adresse da, erscheint er nicht).
export const socialLinks: SocialLink[] = [
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/' },
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/' },
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://www.whatsapp.com/' },
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/' },
];

/** Nur Kanäle mit gültiger https-Adresse. */
export const activeSocialLinks = socialLinks.filter((l) => l.url.startsWith('https://'));
