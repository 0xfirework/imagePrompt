"use client";

import * as React from "react";
import { useRef, useState } from "react";

import { Button } from "@saasfly/ui/button";
import { Card } from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";

export default function Client({ lang }: { lang: string }) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [model, setModel] = useState("general");
  const [language, setLanguage] = useState("English");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function onSelectFile(f?: File) {
    const _f = f ?? fileInput.current?.files?.[0] ?? null;
    if (!_f) return;
    setFile(_f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(_f);
  }

  async function generate() {
    setLoading(true);
    setPrompt("");
    try {
      const body: any = {
        source: activeTab === "upload" ? "upload" : "url",
        model,
        language,
      };
      if (activeTab === "url") body.imageUrl = url;
      if (activeTab === "upload" && preview) body.imageDataUrl = preview;
      const res = await fetch("/api/tools/img2prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { prompt: string };
      setPrompt(data.prompt);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="mx-auto max-w-4xl text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-6xl">
          Free Image to Prompt Generator
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Convert Image to Prompt to generate your own image
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 rounded-t-xl border border-border/60 bg-background p-2 text-sm">
          <Tab active>Image to Prompt</Tab>
          <Tab>Text to Prompt</Tab>
        </div>
        <Card className="rounded-t-none border-t-0 p-4 md:p-6">
          {/* Upload + Preview */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-3 flex gap-4 border-b pb-2 text-sm">
                <button
                  className={`border-b-2 px-1 pb-1 ${
                    activeTab === "upload"
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("upload")}
                >
                  Upload Image
                </button>
                <button
                  className={`border-b-2 px-1 pb-1 ${
                    activeTab === "url"
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("url")}
                >
                  Input Image URL
                </button>
              </div>

              {activeTab === "upload" ? (
                <div
                  className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 text-center transition-colors hover:border-violet-400 hover:bg-violet-50/40"
                  onClick={() => fileInput.current?.click()}
                >
                  <Icons.Post className="mb-3 h-8 w-8 text-violet-600" />
                  <p className="text-sm text-muted-foreground">
                    Upload a photo or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, or WEBP up to 4MB
                  </p>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={() => onSelectFile()}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-md border border-border/60 bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="https://.../image.png"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button onClick={() => setPreview(url)} variant="outline">
                    Preview
                  </Button>
                </div>
              )}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Image Preview</p>
              <div className="flex h-56 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="preview"
                    className="max-h-full max-w-full"
                  />
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    <Icons.Post className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    Your image will show here
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Models */}
          <div className="grid gap-3 md:grid-cols-4">
            {(
              [
                {
                  key: "general",
                  title: "General Image Prompt",
                  desc: "Natural language description of the image",
                },
                {
                  key: "flux",
                  title: "Flux",
                  desc: "Optimized for state-of-the-art Flux models",
                },
                {
                  key: "midjourney",
                  title: "Midjourney",
                  desc: "Tailored for Midjourney parameters",
                },
                {
                  key: "sd",
                  title: "Stable Diffusion",
                  desc: "Formatted for SD models",
                },
              ] as const
            ).map((m) => (
              <button
                key={m.key}
                className={`rounded-lg border border-border/60 p-4 text-left text-sm transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  model === m.key
                    ? "ring-2 ring-violet-600 border-transparent bg-violet-50/40 dark:bg-muted/40"
                    : ""
                }`}
                onClick={() => setModel(m.key)}
                type="button"
              >
                <p className="font-medium">{m.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-3">
              <label className="text-sm">Prompt Language</label>
              <select
                className="rounded-md border border-border/60 bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {["English", "中文", "Deutsch", "日本語", "한국어"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            <Button onClick={generate} disabled={loading || !preview} size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
              {loading ? (
                <>
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                "Generate Prompt"
              )}
            </Button>
          </div>

          <div className="mt-4">
            <textarea
              className="min-h-[140px] w-full rounded-lg border border-border/60 bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Generated prompt will appear here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Tab({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
        active ? "bg-muted/40 font-medium" : "text-muted-foreground"
      }`}
    >
      {children}
    </div>
  );
}
