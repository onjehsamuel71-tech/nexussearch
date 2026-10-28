export interface LanguageOption {
  code: string;
  label: string;
  native: string;
  speech: string;
  /** Instruction appended to the synthesis prompt for this language. */
  translationDirective: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    label: "English",
    native: "English",
    speech: "en-US",
    translationDirective:
      "Respond in clear, well-structured English. Do not translate.",
  },
  {
    code: "fr",
    label: "French",
    native: "Français",
    speech: "fr-FR",
    translationDirective:
      "You are a native French language translator. Translate the following text strictly into French. CRITICAL: Do NOT fall back to English words. Use native French vocabulary and grammar.",
  },
  {
    code: "ha",
    label: "Hausa",
    native: "Hausa",
    speech: "ha-NG",
    translationDirective:
      "You are a native Hausa language translator. Translate the following text strictly into Hausa. CRITICAL: Do NOT fall back to English words. Use native Hausa vocabulary (e.g. 'Mutum' for person, 'Gida' for house, 'Lafiya' for well-being).",
  },
  {
    code: "yo",
    label: "Yoruba",
    native: "Yorùbá",
    speech: "yo-NG",
    translationDirective:
      "You are a native Yoruba language translator. Translate the following text strictly into Yoruba. CRITICAL: Do NOT fall back to English words. Use native Yoruba vocabulary with proper diacritics (e.g. 'Ẹ káàbọ̀', 'Ọmọ' for child, 'Ilé' for house).",
  },
  {
    code: "ig",
    label: "Igbo",
    native: "Igbo",
    speech: "ig-NG",
    translationDirective:
      "You are a native Igbo language translator. Translate the following text strictly into Igbo. CRITICAL: Do NOT fall back to English words. Use native Igbo vocabulary and diacritics (e.g. 'Ndewo', 'Kedu', 'Ọdịnma').",
  },
  {
    code: "sw",
    label: "Swahili",
    native: "Kiswahili",
    speech: "sw-KE",
    translationDirective:
      "You are a native Swahili language translator. Translate the following text strictly into Kiswahili. CRITICAL: Do NOT fall back to English words. Use native Kiswahili vocabulary (e.g. 'Habari', 'Mtu' for person, 'Nyumba' for house).",
  },
];

export interface RegionOption {
  id: string;
  label: string;
  scope: string;
}

export const REGIONS: RegionOption[] = [
  { id: "all", label: "All Africa", scope: "Africa" },
  { id: "ng", label: "Nigeria", scope: "Nigeria" },
  { id: "ke", label: "Kenya", scope: "Kenya" },
  { id: "za", label: "South Africa", scope: "South Africa" },
  { id: "gh", label: "Ghana", scope: "Ghana" },
  { id: "ea", label: "East Africa", scope: "East Africa" },
  { id: "wa", label: "West Africa", scope: "West Africa" },
];

export function getLanguage(code: string): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function getRegion(id: string): RegionOption {
  return REGIONS.find((r) => r.id === id) ?? REGIONS[0];
}