export interface Region {
  id: string;
  label: string;
  focus: string;
}

export const REGIONS: Region[] = [
  { id: "all", label: "All Africa", focus: "" },
  { id: "ng", label: "Nigeria", focus: "in Nigeria" },
  { id: "ke", label: "Kenya", focus: "in Kenya" },
  { id: "za", label: "South Africa", focus: "in South Africa" },
  { id: "gh", label: "Ghana", focus: "in Ghana" },
  { id: "ea", label: "East Africa", focus: "in East Africa" },
  { id: "wa", label: "West Africa", focus: "in West Africa" },
];

export function buildRegionalQuery(query: string, regionId: string): string {
  const region = REGIONS.find((r) => r.id === regionId);
  const trimmed = query.trim();
  if (!region || !region.focus || !trimmed) return trimmed;
  return `${trimmed} ${region.focus}`;
}