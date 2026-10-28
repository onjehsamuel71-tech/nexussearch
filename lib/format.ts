const MARKDOWN_PATTERNS: RegExp[] = [
  /^#{1,6}\s+/gm,
  /\*\*(.*?)\*\*/g,
  /\*(.*?)\*/g,
  /__(.*?)__/g,
  /_(.*?)_/g,
  /`{1,3}(.*?)`{1,3}/g,
  /~~(.*?)~~/g,
  /\[([^\]]*)\]\([^)]*\)/g,
  /\[[^\]]*\]/g,
  /\|\|/g,
  /\|/g,
  /^\s*[-*+]\s+/gm,
  /^\s*>\s?/gm,
  /^\s*\d+\.\s+/gm,
];

const DISAMBIGUATION_PATTERNS: RegExp[] = [
  /\bfor other uses[^.]*\./gi,
  /\bmay refer to:?/gi,
  /\bdisambiguation\b/gi,
  /\bthis article is about[^.]*\./gi,
  /\bsee also:?.*$/gim,
  /\bfrom wikipedia,? the free encyclopedia\b/gi,
];

export function cleanSnippet(raw: string): string {
  if (!raw) return "";

  let text = raw;

  for (const pattern of DISAMBIGUATION_PATTERNS) {
    text = text.replace(pattern, " ");
  }

  for (const pattern of MARKDOWN_PATTERNS) {
    text = text.replace(pattern, "$1");
  }

  text = text
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return text;
}

export function truncateSnippet(text: string, max = 180): string {
  const cleaned = cleanSnippet(text);
  if (cleaned.length <= max) return cleaned;

  const slice = cleaned.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");

  if (lastSpace > max * 0.6) {
    return `${slice.slice(0, lastSpace).replace(/[,;:.\-–—]+$/, "")}...`;
  }

  return `${slice.replace(/[,;:.\-–—]+$/, "")}...`;
}