import { Download, FileDown, FileImage, FileText, Info, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { usePaletteStore } from "../../store/paletteStore";
import { downloadBlob, publicAssetUrl, slugifyPaletteName } from "../../lib/download";
import { buildLogoSvg, logoSvgFilename } from "../../lib/exportSvg";
// PDF and ZIP exports pull in heavy dependencies (jspdf, svg2pdf.js, jszip).
// They're only needed when the user clicks one of those buttons, so we
// dynamic-import them inside the handlers — Vite code-splits them off the
// initial bundle and they're fetched on first use only.

type Busy = null | "svg" | "pdf" | "ai" | "zip";

/**
 * Adobe Illustrator-focused exports.
 *
 * The app does not synthesise a native `.ai` file from scratch — that format
 * is best produced inside Illustrator itself. Instead, we provide editable
 * vector SVG + vector PDF generated from the live palette, plus the original
 * `.ai` template, so designers can continue work without losing fidelity.
 */
export function IllustratorExportPanel() {
  const palette = usePaletteStore((s) => s.current);
  const showToast = usePaletteStore((s) => s.showToast);
  const [busy, setBusy] = useState<Busy>(null);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);

  // Check whether the original .ai exists at the deployed URL.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(publicAssetUrl("assets/logo/logo-ctf26.ai"), {
          method: "HEAD",
        });
        if (!cancelled) setAiAvailable(res.ok);
      } catch {
        if (!cancelled) setAiAvailable(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Exports follow the same colour mode the user is previewing, so what the
  // user sees in the Logo tab is what they download. Authentic + Palette-Aware
  // keep brand pink locked; Experimental overrides it (with a warning baked
  // into the SVG metadata).
  const mode = usePaletteStore((s) => s.logoMode);

  const onSvg = async () => {
    if (busy) return;
    setBusy("svg");
    try {
      const svg = buildLogoSvg({ palette, mode });
      downloadBlob(logoSvgFilename(palette), new Blob([svg], { type: "image/svg+xml" }));
      showToast("SVG exported");
    } catch (e) {
      showToast("SVG export failed");
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  const onPdf = async () => {
    if (busy) return;
    setBusy("pdf");
    try {
      const { buildLogoPdfBlob, logoPdfFilename } = await import("../../lib/exportPdf");
      const pdf = await buildLogoPdfBlob({ palette, mode });
      downloadBlob(logoPdfFilename(palette), pdf);
      showToast("PDF exported");
    } catch (e) {
      showToast("PDF export failed");
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  const onAi = async () => {
    if (busy || !aiAvailable) return;
    setBusy("ai");
    try {
      const res = await fetch(publicAssetUrl("assets/logo/logo-ctf26.ai"));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      downloadBlob("logo-original.ai", blob);
      showToast("Original AI downloaded");
    } catch (e) {
      showToast("Original AI not available");
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  const onZip = async () => {
    if (busy) return;
    setBusy("zip");
    try {
      const { buildIllustratorPackage } = await import("../../lib/exportPackage");
      const result = await buildIllustratorPackage({ palette, mode });
      downloadBlob(result.filename, result.blob);
      const note = result.aiIncluded
        ? result.pdfIncluded
          ? "Package exported (SVG + PDF + AI)"
          : "Package exported (SVG + AI, PDF skipped)"
        : "Package exported (SVG only — AI template missing)";
      showToast(note);
    } catch (e) {
      showToast("Package export failed");
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="panel p-4">
      <header className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="label-eyebrow">Adobe Illustrator Export</div>
          <h3 className="mt-0.5 text-[13px] font-semibold text-white">
            Designer-ready vector handoff
          </h3>
          <p className="mt-1 text-[11.5px] text-white/55">
            SVG and PDF generated live from this palette, plus the original{" "}
            <code className="font-mono">.ai</code> template. Brand pink{" "}
            <span className="font-mono text-pink-300">#E42175</span> stays exact.
          </p>
        </div>
        <span className="chip shrink-0">
          <span className="font-mono">{slugifyPaletteName(palette.name)}</span>
        </span>
      </header>

      <div className="grid gap-1.5">
        <ExportRow
          icon={<FileImage size={13} />}
          title="Download SVG"
          desc="Editable vector SVG. Best for opening directly in Illustrator or Figma."
          onClick={onSvg}
          busy={busy === "svg"}
          disabled={!!busy && busy !== "svg"}
        />
        <ExportRow
          icon={<FileText size={13} />}
          title="Download PDF"
          desc="Vector PDF for Illustrator workflows. Open in Illustrator, then Save As .ai."
          onClick={onPdf}
          busy={busy === "pdf"}
          disabled={!!busy && busy !== "pdf"}
        />
        <ExportRow
          icon={<FileDown size={13} />}
          title="Download Original AI"
          desc={
            aiAvailable === false
              ? "Master AI template is held outside this deployment. Contact the project owner for access."
              : "Original source / template file. Palette changes are not baked into this file."
          }
          onClick={onAi}
          busy={busy === "ai"}
          disabled={aiAvailable !== true || (!!busy && busy !== "ai")}
          missing={aiAvailable === false}
        />
        <ExportRow
          icon={<Package size={13} />}
          title="Download Illustrator Package"
          desc="ZIP with SVG, PDF, original AI, palette tokens, swatches and instructions."
          onClick={onZip}
          busy={busy === "zip"}
          disabled={!!busy && busy !== "zip"}
          accent
        />
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300/15 bg-amber-300/5 p-2.5 text-[11px] text-amber-100/80">
        <Info size={13} className="mt-0.5 shrink-0 text-amber-300/80" />
        <p>
          Native <span className="font-mono">.ai</span> generation is handled best inside
          Illustrator itself. Palette Workspace exports Illustrator-ready vector assets and ships
          the original <span className="font-mono">.ai</span> template so you can continue editing
          safely. For maximum editability, open the SVG or PDF in Illustrator and Save As{" "}
          <span className="font-mono">.ai</span>.
        </p>
      </div>
    </section>
  );
}

function ExportRow({
  icon,
  title,
  desc,
  onClick,
  busy,
  disabled,
  missing,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  busy?: boolean;
  disabled?: boolean;
  missing?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex items-start gap-3 rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
        accent
          ? "border-pink-400/25 bg-gradient-to-b from-pink-500/10 to-transparent hover:border-pink-400/40 hover:from-pink-500/20"
          : missing
            ? "border-amber-400/15 bg-amber-400/[0.03] hover:bg-amber-400/[0.06]"
            : "border-white/8 bg-black/30 hover:border-white/15 hover:bg-black/40"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
          accent ? "bg-pink-500/25 text-pink-100" : "bg-white/5 text-white/70"
        }`}
      >
        {busy ? <Loader2 size={13} className="animate-spin" /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-white">{title}</span>
          {accent && (
            <span className="rounded-full bg-pink-400/15 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-pink-200">
              Recommended
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[11px] text-white/55">{desc}</span>
      </span>
      <Download
        size={13}
        className="mt-1 shrink-0 text-white/30 transition group-hover:text-white/60"
      />
    </button>
  );
}
