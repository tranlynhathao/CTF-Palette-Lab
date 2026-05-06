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

export function publicAssetUrl(pathFromPublic: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const trimmedBase = base.endsWith("/") ? base : base + "/";
  const trimmedPath = pathFromPublic.replace(/^\/+/, "");
  return trimmedBase + trimmedPath;
}

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
