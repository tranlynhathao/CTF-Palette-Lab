/**
 * Trigger a browser download for a Blob.
 * Used by every export path so cleanup behaviour is consistent.
 */
export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * URL-friendly slug for use in download filenames.
 * Falls back to "palette" if the input collapses to an empty string.
 */
export function slugifyPaletteName(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "palette";
}

/**
 * Resolve a path inside the deployed `public/` folder, honouring Vite's
 * configured base URL. Works in dev (base "/") and on a GitHub Pages project
 * site (base "/<repo>/") without any code changes.
 */
export function publicAssetUrl(pathFromPublic: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const trimmedBase = base.endsWith("/") ? base : base + "/";
  const trimmedPath = pathFromPublic.replace(/^\/+/, "");
  return trimmedBase + trimmedPath;
}

/**
 * Build a download filename from project + palette + suffix slugs.
 *  assetFilename("My Brand", "Cubic Cyber Noir", "logo", "svg")
 *    → "my-brand-cubic-cyber-noir-logo.svg"
 *  assetFilename("", "Cubic Cyber Noir", "logo", "svg")
 *    → "cubic-cyber-noir-logo.svg"
 */
export function assetFilename(
  projectName: string,
  paletteName: string,
  suffix: string,
  ext: string,
): string {
  const parts = [projectName, paletteName, suffix]
    .map((p) => slugifyPaletteName(p ?? ""))
    .filter((p) => p && p !== "palette");
  return `${parts.join("-") || "asset"}.${ext}`;
}
