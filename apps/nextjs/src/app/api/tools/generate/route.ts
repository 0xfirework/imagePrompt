import { NextRequest, NextResponse } from "next/server";

type Body = {
  prompt?: string;
  count?: number;
  aspect?: "1:1" | "16:9" | "3:4" | "4:3";
  seed?: number;
};

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

function sizeFromAspect(aspect: Body["aspect"]) {
  switch (aspect) {
    case "16:9":
      return { w: 1280, h: 720 };
    case "4:3":
      return { w: 1024, h: 768 };
    case "3:4":
      return { w: 768, h: 1024 };
    case "1:1":
    default:
      return { w: 768, h: 768 };
  }
}

function svgDataUrl({
  w,
  h,
  title,
  seed,
}: {
  w: number;
  h: number;
  title: string;
  seed: number;
}) {
  // deterministic palette from seed
  const colors = [
    ["#7C3AED", "#06B6D4"],
    ["#8B5CF6", "#22D3EE"],
    ["#6366F1", "#A78BFA"],
    ["#EC4899", "#8B5CF6"],
    ["#22C55E", "#06B6D4"],
  ];
  const pair = colors[seed % colors.length];
  const id = `g${seed % 9999}`;
  const safeTitle = (title ?? "").slice(0, 60).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="${id}" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${pair[0]}" />
      <stop offset="100%" stop-color="${pair[1]}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${id})" />
  <g fill="rgba(255,255,255,0.85)">
    <circle cx="${(seed * 97) % w}" cy="${(seed * 53) % h}" r="${(seed % 80) + 40}" fill="rgba(255,255,255,0.15)" />
    <circle cx="${(seed * 17) % w}" cy="${(seed * 73) % h}" r="${(seed % 50) + 20}" fill="rgba(255,255,255,0.12)" />
    <circle cx="${(seed * 31) % w}" cy="${(seed * 29) % h}" r="${(seed % 60) + 30}" fill="rgba(255,255,255,0.12)" />
  </g>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto" font-size="${Math.round(
          w / 18,
        )}" fill="white" opacity="0.9">Preview</text>
  <text x="50%" y="${Math.round(
    h * 0.62,
  )}" dominant-baseline="middle" text-anchor="middle"
        font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto" font-size="${Math.round(
          w / 28,
        )}" fill="white" opacity="0.9">${safeTitle}</text>
</svg>`;
  const b64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${b64}`;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Body;
  const prompt = body.prompt ?? "";
  const count = Math.max(1, Math.min(6, body.count ?? 4));
  const aspect = body.aspect ?? "1:1";
  const { w, h } = sizeFromAspect(aspect);
  const seedBase = Math.abs((body.seed ?? 12345) | 0);

  const images = Array.from({ length: count }).map((_, i) =>
    svgDataUrl({ w, h, title: prompt, seed: seedBase + i })
  );

  return NextResponse.json({ images });
}

