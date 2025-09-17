import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    imageDataUrl?: string;
    imageUrl?: string;
    source: "upload" | "url";
    model: string;
    language?: string;
  };

  const base = body.language ?? "English";
  const subject = body.imageUrl?.split("/").pop()?.split(".")[0]?.replace(/[-_]/g, " ") ??
    (body.imageDataUrl ? "an uploaded image" : "an image");

  const modelPhrase =
    body.model === "midjourney"
      ? "Midjourney-style descriptive prompt"
      : body.model === "flux"
        ? "Flux-model optimized prompt"
        : body.model === "sd"
          ? "Stable Diffusion formatted prompt"
          : "General descriptive prompt";

  const prompt = `${modelPhrase} in ${base}. Subject: ${subject}. Composition, lighting, colors, textures and context described in detail; cinematic, high fidelity, clear subject focus.`;

  return NextResponse.json({ prompt });
}

