import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import { Card } from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";

import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Image Prompt Landing",
  description: "Create better AI art with Image Prompt.",
};

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
            Create Better AI Art
            <br />
            with
            {" "}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Image Prompt
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Inspire ideas, enhance image prompts, and create masterpieces.
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

      {/* Helpful links */}
      <section className="container mx-auto px-4 pb-20 text-center text-sm text-muted-foreground">
        <span>You may be interested in: </span>
        <Link href={`${base}/docs`} className="text-violet-600 hover:underline dark:text-indigo-300">
          What is an Image Prompt?
        </Link>
        <span className="mx-2">·</span>
        <Link href={`${base}/blog`} className="text-violet-600 hover:underline dark:text-indigo-300">
          How to Write Effective Image Prompt?
        </Link>
      </section>
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
    <Card className="flex h-full cursor-pointer flex-col items-center gap-3 border-border/50 bg-white/90 p-8 text-center shadow-sm transition-colors hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-background/40 dark:shadow-none">
      <div className="flex items-center justify-center rounded-lg bg-violet-50 p-3 dark:bg-muted/30">
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
