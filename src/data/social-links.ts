export type SocialChannel = 'instagram' | 'facebook' | 'whatsapp' | 'youtube';

export interface SocialLink {
  id: SocialChannel;
  label: string;
  /** Vollständige Adresse (https://…). Leer lassen = Kanal wird im Footer nicht angezeigt. */
  url: string;
}

// Hier die Adressen der laufenden Kanäle eintragen. Nur Kanäle mit Adresse
// erscheinen im Footer, die Reihenfolge hier ist die Reihenfolge dort.
//
// Beispiele:
//   Instagram: https://www.instagram.com/<profilname>/
//   Facebook:  https://www.facebook.com/<seitenname>
//   WhatsApp:  https://whatsapp.com/channel/<kanal-id>   (Kanal-Link aus der WhatsApp-App)
//   YouTube:   https://www.youtube.com/@<kanalname>
export const socialLinks: SocialLink[] = [
  { id: 'instagram', label: 'Instagram', url: '' },
  { id: 'facebook', label: 'Facebook', url: '' },
  { id: 'whatsapp', label: 'WhatsApp', url: '' },
  { id: 'youtube', label: 'YouTube', url: '' },
];
