"use client";

import * as React from "react";
import { useState } from "react";

import { Button } from "@saasfly/ui/button";
import { Card } from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";

export default function Client({ lang }: { lang: string }) {
  const gen = useGenerator();
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="mx-auto max-w-4xl text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-6xl">
          AI Image Generator
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Type a prompt, choose options, and generate preview images. This demo
          uses on-device SVG previews; integrate your model API later.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-[1.05fr_1fr]">
        <Composer gen={gen} />
        <Gallery images={gen.images} loading={gen.loading} />
      </div>
    </div>
  );
}

function useGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  async function generate(input: {
    prompt: string;
    aspect: "1:1" | "16:9" | "3:4" | "4:3";
    count: number;
    seed?: number;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { images: string[] };
      setImages(data.images);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, images, generate } as const;
}

function Composer({
  gen,
}: {
  gen: ReturnType<typeof useGenerator>;
}) {
  const { loading, error, generate } = gen;
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState<"1:1" | "16:9" | "3:4" | "4:3">(
    "1:1",
  );
  const [count, setCount] = useState(4);
  const [seed, setSeed] = useState<number | undefined>(undefined);

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium">Prompt</label>
        <textarea
          className="min-h-[120px] w-full rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="A cozy reading nook with warm sunlight and plants"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="space-y-2">
            <label className="block text-xs text-muted-foreground">Aspect</label>
            <div className="grid grid-cols-4 gap-2">
              {(["1:1", "16:9", "3:4", "4:3"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAspect(a)}
                  className={`rounded-md border px-2 py-1 text-xs ${
                    aspect === a ? "border-violet-600 text-violet-600" : ""
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-muted-foreground">Count</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 w-8 rounded-md border"
                onClick={() => setCount((c) => Math.max(1, c - 1))}
              >
                -
              </button>
              <span className="w-6 text-center text-sm">{count}</span>
              <button
                type="button"
                className="h-8 w-8 rounded-md border"
                onClick={() => setCount((c) => Math.min(6, c + 1))}
              >
                +
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-muted-foreground">Seed</label>
            <input
              className="w-full rounded-md border bg-background p-2 text-sm"
              placeholder="optional"
              type="number"
              value={seed ?? ""}
              onChange={(e) =>
                setSeed(e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : null}

        <div className="flex items-center gap-3">
          <Button
            size="lg"
            disabled={loading || !prompt.trim()}
            onClick={() =>
              generate({ prompt: prompt.trim(), aspect, count, seed })
            }
          >
            {loading ? (
              <>
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" /> Generating
              </>
            ) : (
              <>
                <Icons.Rocket className="mr-2 h-4 w-4" /> Generate
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPrompt("");
              setSeed(undefined);
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Gallery({
  images,
  loading,
}: {
  images: string[];
  loading: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-2">
      {images.length === 0 ? (
        <Card className="col-span-2 flex min-h-[300px] items-center justify-center p-6 text-sm text-muted-foreground">
          {loading ? (
            <span className="flex items-center gap-2"><Icons.Spinner className="h-4 w-4 animate-spin"/> Generating…</span>
          ) : (
            "Generated images will appear here."
          )}
        </Card>
      ) : (
        images.map((src, i) => (
          <Card key={i} className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`generated-${i}`} className="w-full" />
            <div className="absolute bottom-2 right-2 flex gap-2">
              <a
                href={src}
                download={`ai-image-${i + 1}.svg`}
                className="rounded-md bg-background/70 px-2 py-1 text-xs backdrop-blur hover:bg-background"
              >
                Download
              </a>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

