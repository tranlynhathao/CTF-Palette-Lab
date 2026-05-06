import logoSvg from "../../assets/logo/logo-ctf26.svg?raw";

export type ExactLogoProps = {
  pink?: string;
  light?: string;
  outline?: string;
  shadow?: string;
  /** Forwarded to `--logo-accent`; unused by the bundled artwork. */
  accent?: string;
  width?: number | string;
  className?: string;
  ariaLabel?: string;
};

export const HCMUS_CTF_BRAND_PINK = "#E42175" as const;

export function ExactCompetitionLogo({
  pink = HCMUS_CTF_BRAND_PINK,
  light = "#FFFFFF",
  outline = "#232020",
  shadow = "#232020",
  accent,
  width = "100%",
  className,
  ariaLabel = "Brand wordmark",
}: ExactLogoProps) {
  // The injected <svg> keeps its intrinsic width/height from pdf2svg; the
  // arbitrary-selector classes force it to fill the wrapper instead of
  // overflowing narrow containers and getting clipped.
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`block max-w-full [&>svg]:block [&>svg]:!h-full [&>svg]:!w-full ${className ?? ""}`}
      style={
        {
          width,
          maxWidth: "100%",
          aspectRatio: "210 / 70",
          lineHeight: 0,
          ["--logo-pink" as string]: pink,
          ["--logo-light" as string]: light,
          ["--logo-outline" as string]: outline,
          ["--logo-shadow" as string]: shadow,
          ...(accent ? { ["--logo-accent" as string]: accent } : {}),
        } as React.CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: logoSvg }}
    />
  );
}
