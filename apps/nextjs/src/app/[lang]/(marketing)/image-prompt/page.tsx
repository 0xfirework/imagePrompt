import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import { Card } from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";

import type { Locale } from "~/config/i18n-config";
import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  const base = `/${params.lang}`;
  return {
    title: "Image to Prompt Generator",
    description:
      "Free image to prompt generator: convert any image into a detailed image prompt in seconds. Perfect prompt generator for AI art.",
    keywords: [
      "image to prompt",
      "image-to-prompt",
      "image to prompt generator",
      "impage to prompt generator",
      "image prompt",
      "prompt generator",
    ],
    alternates: {
      canonical: `${base}/image-prompt`,
    },
    openGraph: {
      title: "Image to Prompt Generator",
      description:
        "Convert images into rich prompts. The easiest image prompt generator for AI art and diffusion models.",
      url: `${base}/image-prompt`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Image to Prompt Generator",
      description:
        "Turn images into detailed prompts. Free and fast prompt generator for AI art.",
    },
  };
}

export default function ImagePromptLandingPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const base = `/${lang}`;
  return (
    <div className="relative bg-gradient-to-b from-white to-violet-50/60 dark:from-transparent dark:to-transparent">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-balance font-heading text-5xl font-semibold tracking-tight md:text-7xl md:leading-[1.1]">
            Free Image to Prompt Generator
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Convert any image into a detailed image prompt. A fast, accurate prompt generator for AI art.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href={`${base}/tools/image-to-prompt`}>
              <Button size="lg" className="px-7 bg-violet-600 hover:bg-violet-700 text-white">
                Try it now !
              </Button>
            </Link>
            <Link href={`${base}/docs`}>
              <Button size="lg" variant="outline" className="px-7">
                Tutorials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto grid gap-6 px-4 pb-6 md:grid-cols-4">
        <FeatureCard
          icon={<Icons.Post className="h-6 w-6 text-violet-600 dark:text-indigo-300" />}
          title="Image to Prompt"
          desc="Convert image to a detailed prompt to recreate visuals."
          href={`${base}/tools/image-to-prompt`}
        />
        <FeatureCard
          icon={<Icons.Rocket className="h-6 w-6 text-violet-600 dark:text-indigo-300" />}
          title="Magic Enhance"
          desc="Transform simple text into descriptive, high-quality prompts."
        />
        <FeatureCard
          icon={<Icons.Help className="h-6 w-6 text-violet-600 dark:text-indigo-300" />}
          title="AI Describe Image"
          desc="Let AI analyze and describe any image in detail."
        />
        <FeatureCard
          icon={<Icons.Settings className="h-6 w-6 text-violet-600 dark:text-indigo-300" />}
          title="AI Image Generator"
          desc="Turn prompts into stunning visuals with AI-powered rendering."
          href={`${base}/tools/ai-image-generator`}
        />
      </section>

      {/* SEO content blocks */}
      <section className="container mx-auto max-w-5xl px-4 pb-16 text-muted-foreground">
        <h2 className="mb-3 text-2xl font-semibold text-foreground">What is an Image to Prompt Generator?</h2>
        <p className="leading-relaxed">
          An <strong>image to prompt</strong> or <strong>image to prompt generator</strong> turns a picture into a
          structured <strong>image prompt</strong> you can reuse in AI art tools. It extracts style, subject,
          composition and lighting so your <strong>prompt generator</strong> results stay consistent.
        </p>
        <h2 className="mb-3 mt-8 text-2xl font-semibold text-foreground">How to use</h2>
        <ol className="list-decimal pl-5 leading-relaxed">
          <li>Open the <strong>Image to Prompt Generator</strong> and upload or paste an image URL.</li>
          <li>Select a target model style (General, Flux, Midjourney, Stable Diffusion).</li>
          <li>Click Generate to get a ready‑to‑use <strong>image prompt</strong>.</li>
        </ol>
        <h2 className="mb-3 mt-8 text-2xl font-semibold text-foreground">Why this prompt generator?</h2>
        <ul className="list-disc pl-5 leading-relaxed">
          <li>Purpose‑built for fast, accurate <strong>image to prompt</strong> conversion.</li>
          <li>Human‑readable wording that works across popular models.</li>
          <li>Free to start — try the <Link className="underline" href={`${base}/tools/image-to-prompt`}>image to prompt generator</Link> now.</li>
        </ul>
      </section>

      {/* Removed extra helpful links to keep the page clean */}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href?: string;
}) {
  const content = (
    <Card className="flex h-full cursor-pointer flex-col items-center gap-3 border border-border/60 bg-white p-8 text-center shadow-sm transition-colors hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-background/40 dark:shadow-none">
      <div className="flex items-center justify-center rounded-lg bg-violet-50 p-3 ring-1 ring-violet-100 dark:bg-muted/30">
        {icon}
      </div>
      <h3 className="mt-1 text-lg font-semibold leading-tight tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
  return href ? (
    <Link href={href} aria-label={title} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
