import type { BookName, Sthana } from "@/api/species";

export type BookSthanaOption = { value: Sthana; label: string };

export const BOOK_STHANA_OPTIONS: Record<BookName, BookSthanaOption[]> = {
  Charaka_Samhita: [
    { value: "Sutra_Sthana", label: "Sutra Sthana" },
    { value: "Nidana_Sthana", label: "Nidana Sthana" },
    { value: "Vimana_Sthana", label: "Vimana Sthana" },
    { value: "Sharir_Sthana", label: "Sharir Sthana" },
    { value: "Indriya_Sthana", label: "Indriya Sthana" },
    { value: "Chikitsa_Sthana", label: "Chikitsa Sthana" },
    { value: "Kalpa_Sthana", label: "Kalpa Sthana" },
    { value: "Sidhi_Sthana", label: "Siddhi Sthana" },
  ],
  Sushruta_Samhita: [
    { value: "Sutra_Sthana", label: "Sutra Sthana" },
    { value: "Sharir_Sthana", label: "Sharir Sthana" },
    { value: "Nidana_Sthana", label: "Nidana Sthana" },
    { value: "Chikitsa_Sthana", label: "Chikitsa Sthana" },
    { value: "Kalpana_Sthana", label: "Kalpana Sthana" },
    { value: "Uttar_Tantra", label: "Uttar Tantra" },
  ],
  Ashtang_Hridaya: [
    { value: "Sutra_Sthana", label: "Sutra Sthana" },
    { value: "Nidana_Sthana", label: "Nidana Sthana" },
    { value: "Sharir_Sthana", label: "Sharir Sthana" },
    { value: "Kalpa_siddhi_Sthana", label: "Kalpa siddhi Sthana" },
    { value: "Chikitsa_Sthana", label: "Chikitsa Sthana" },
    { value: "Uttar_Tantra", label: "Uttar Tantra" },
  ],
  Ashtang_Samgraha: [
    { value: "Sutra_Sthana", label: "Sutra Sthana" },
    { value: "Sharir_Sthana", label: "Sharir Sthana" },
    { value: "Nidana_Sthana", label: "Nidana Sthana" },
    { value: "Chikitsa_Sthana", label: "Chikitsa Sthana" },
    { value: "Kalpa_Sthana", label: "Kalpa Sthana" },
    { value: "Uttar_Tantra", label: "Uttar Tantra" },
  ],
};

export function getSthanaOptionsForBook(book: BookName): BookSthanaOption[] {
  return BOOK_STHANA_OPTIONS[book] ?? [];
}

export function isSthanaValidForBook(
  book: BookName,
  sthana: Sthana | null | undefined
): boolean {
  if (!sthana) return false;
  return getSthanaOptionsForBook(book).some((o) => o.value === sthana);
}

export function formatSthanaLabel(sthana: Sthana): string {
  return sthana.replace(/_/g, " ");
}
