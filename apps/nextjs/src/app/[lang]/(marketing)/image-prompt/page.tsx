import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import { Card } from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";

import type { Locale } from "~/config/i18n-config";
import type { Metadata } from "next";

type Copy = {
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  features: { title: string; desc: string }[];
  howItWorksTitle: string;
  steps: { title: string; desc: string }[];
  whatTitle: string;
  whatDesc: string;
  whyTitle: string;
  whyItems: string[];
  whyCtaPrefix: string;
  whyCtaLinkText: string;
  whyCtaSuffix: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaStart: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

const copies: Record<Locale | "default", Copy> = {
  zh: {
    badge: "免费工具 · 无需注册",
    title: "图片转提示词生成器",
    subtitle: "将任意图片转为结构化、可复用的提示词，快速准确，适配主流 AI 模型。",
    ctaPrimary: "立即试用",
    ctaSecondary: "使用教程",
    features: [
      { title: "图片转提示词", desc: "将图片转为可复用的详细提示词。" },
      { title: "智能增强", desc: "把简短文本扩展为高质量提示词。" },
      { title: "AI 图像描述", desc: "由 AI 自动分析与细致描述图像。" },
      { title: "AI 图像生成", desc: "用提示词直接生成精美图片。" },
    ],
    howItWorksTitle: "使用步骤",
    steps: [
      { title: "上传或粘贴链接", desc: "添加图片文件或粘贴图片 URL。" },
      { title: "选择风格模型", desc: "通用 / Flux / Midjourney / SD。" },
      { title: "一键生成", desc: "立即复制结构化提示词。" },
    ],
    whatTitle: "什么是图片转提示词？",
    whatDesc:
      "图片转提示词工具可将图片转换为结构化的提示词，涵盖风格、主体、构图等信息，便于在 AI 作画工具中复现一致效果。",
    whyTitle: "为什么选择我们？",
    whyItems: [
      "面向实战的快速、准确转换。",
      "可读性强，适配多款流行模型。",
    ],
    whyCtaPrefix: "免费开始——立即体验",
    whyCtaLinkText: "图片转提示词生成器",
    whyCtaSuffix: "。",
    ctaTitle: "准备好把图片变成提示词了吗？",
    ctaDesc: "一键生成结构化提示词，轻松接入你的 AI 工作流。",
    ctaStart: "开始使用",
    seo: {
      title: "图片转提示词生成器 | Image to Prompt",
      description:
        "免费图片转提示词工具：秒级生成结构化提示词，适配 Midjourney、Stable Diffusion 等模型。",
      keywords: [
        "图片转提示词",
        "image to prompt",
        "提示词生成器",
        "image prompt",
      ],
    },
  },
  ko: {
    badge: "무료 도구 · 가입 불필요",
    title: "이미지 프롬프트 생성기",
    subtitle:
      "이미지를 구조화된 프롬프트로 빠르고 정확하게 변환합니다. 주요 AI 모델에 바로 사용할 수 있습니다.",
    ctaPrimary: "지금 바로 사용",
    ctaSecondary: "사용 가이드",
    features: [
      { title: "이미지→프롬프트", desc: "이미지를 재사용 가능한 상세 프롬프트로 변환." },
      { title: "매직 강화", desc: "짧은 문장을 고품질 프롬프트로 확장." },
      { title: "AI 이미지 설명", desc: "AI가 이미지를 분석하고 자세히 설명." },
      { title: "AI 이미지 생성", desc: "프롬프트로 멋진 이미지를 생성." },
    ],
    howItWorksTitle: "사용 방법",
    steps: [
      { title: "업로드 또는 링크", desc: "이미지 파일 추가 또는 URL 붙여넣기." },
      { title: "스타일 선택", desc: "General / Flux / Midjourney / SD." },
      { title: "생성", desc: "구조화된 프롬프트를 즉시 복사." },
    ],
    whatTitle: "이미지 프롬프트 생성기란?",
    whatDesc:
      "이미지→프롬프트 도구는 사진을 구조화된 프롬프트로 변환하여 스타일, 주제, 구도를 담아 AI 아트 도구에서 일관된 결과를 얻도록 돕습니다.",
    whyTitle: "왜 이 도구인가요?",
    whyItems: [
      "실사용에 맞춘 빠르고 정확한 변환.",
      "읽기 쉬운 문장으로 여러 모델에 호환.",
    ],
    whyCtaPrefix: "무료로 시작 — 지금",
    whyCtaLinkText: "생성기",
    whyCtaSuffix: "를 사용해 보세요.",
    ctaTitle: "이미지를 프롬프트로 바꿀 준비 되셨나요?",
    ctaDesc: "한 번의 클릭으로 구조화된 프롬프트를 생성하여 AI 워크플로에 연결하세요.",
    ctaStart: "지금 시작",
    seo: {
      title: "이미지 프롬프트 생성기 | Image to Prompt",
      description:
        "무료 이미지→프롬프트 생성기: 몇 초 만에 구조화된 프롬프트를 생성하고 Midjourney, Stable Diffusion 등에 사용하세요.",
      keywords: [
        "이미지 프롬프트",
        "image to prompt",
        "프롬프트 생성기",
        "image prompt",
      ],
    },
  },
  default: {
    badge: "Free tool — no sign‑up",
    title: "Image to Prompt Generator",
    subtitle:
      "Convert any image into a structured, reusable prompt. Fast, accurate and ready for popular AI models.",
    ctaPrimary: "Try it now",
    ctaSecondary: "Tutorials",
    features: [
      { title: "Image to Prompt", desc: "Turn images into detailed prompts you can reuse." },
      { title: "Magic Enhance", desc: "Expand simple text into high‑quality prompts." },
      { title: "AI Describe Image", desc: "Let AI analyze and describe visuals in detail." },
      { title: "AI Image Generator", desc: "Render stunning visuals directly from prompts." },
    ],
    howItWorksTitle: "How it works",
    steps: [
      { title: "Upload or link", desc: "Add an image file or paste a URL." },
      { title: "Choose style", desc: "General, Flux, Midjourney, or SD." },
      { title: "Generate", desc: "Copy the structured prompt instantly." },
    ],
    whatTitle: "What is an Image to Prompt Generator?",
    whatDesc:
      "An image to prompt tool converts a picture into a structured image prompt for AI art tools — capturing style, subject and composition so results stay consistent.",
    whyTitle: "Why this tool?",
    whyItems: [
      "Fast and accurate conversion tuned for real use.",
      "Readable wording that works across popular models.",
    ],
    whyCtaPrefix: "Free to start — try the",
    whyCtaLinkText: "generator",
    whyCtaSuffix: " now.",
    ctaTitle: "Ready to turn images into prompts?",
    ctaDesc: "One click to generate structured prompts for your AI workflow.",
    ctaStart: "Start now",
    seo: {
      title: "Image to Prompt Generator",
      description:
        "Free image to prompt generator: convert any image into a detailed image prompt in seconds. Perfect prompt generator for AI art.",
      keywords: [
        "image to prompt",
        "image-to-prompt",
        "image to prompt generator",
        "image prompt",
        "prompt generator",
      ],
    },
  },
};

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  const base = `/${params.lang}`;
  const copy = params.lang === "zh" ? copies.zh : copies.default;
  return {
    title: copy.seo.title,
    description: copy.seo.description,
    keywords: copy.seo.keywords,
    alternates: {
      canonical: `${base}/image-prompt`,
    },
    openGraph: {
      title: copy.seo.title,
      description: copy.seo.description,
      url: `${base}/image-prompt`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.seo.title,
      description: copy.seo.description,
    },
  };
}

export default function ImagePromptLandingPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const base = `/${lang}`;
  const copy = lang === "zh" ? copies.zh : lang === "ko" ? copies.ko : copies.default;
  return (
    <div className="relative overflow-hidden">
      {/* 背景装饰 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-violet-50/60 to-white dark:from-background dark:via-background/70 dark:to-background" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-200px] -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-700/20" />

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-900/50 dark:bg-violet-900/40 dark:text-violet-200">
            <Icons.ThumbsUp className="h-3.5 w-3.5" /> {copy.badge}
          </span>
          <h1 className="mt-5 text-balance bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text font-heading text-5xl font-semibold tracking-tight text-transparent md:text-6xl md:leading-[1.05]">{copy.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{copy.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={`${base}/tools/image-to-prompt`}>
              <Button size="lg" className="px-7 bg-violet-600 text-white hover:bg-violet-700">{copy.ctaPrimary}</Button>
            </Link>
            <Link href={`${base}/docs`}>
              <Button size="lg" variant="outline" className="px-7">{copy.ctaSecondary}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 功能卡片 */}
      <section className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={<Icons.Post className="h-6 w-6 text-violet-600 dark:text-indigo-300" />} title={copy.features[0].title} desc={copy.features[0].desc} href={`${base}/tools/image-to-prompt`} />
          <FeatureCard icon={<Icons.Rocket className="h-6 w-6 text-violet-600 dark:text-indigo-300" />} title={copy.features[1].title} desc={copy.features[1].desc} />
          <FeatureCard icon={<Icons.Help className="h-6 w-6 text-violet-600 dark:text-indigo-300" />} title={copy.features[2].title} desc={copy.features[2].desc} />
          <FeatureCard icon={<Icons.Settings className="h-6 w-6 text-violet-600 dark:text-indigo-300" />} title={copy.features[3].title} desc={copy.features[3].desc} href={`${base}/tools/ai-image-generator`} />
        </div>
      </section>

      {/* 使用步骤 */}
      <section className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{copy.howItWorksTitle}</h2>
          <ol className="mx-auto mt-8 grid gap-4 sm:grid-cols-3">
            <Step index={1} title={copy.steps[0].title} desc={copy.steps[0].desc} />
            <Step index={2} title={copy.steps[1].title} desc={copy.steps[1].desc} />
            <Step index={3} title={copy.steps[2].title} desc={copy.steps[2].desc} />
          </ol>
        </div>
      </section>

      {/* 说明与优势 */}
      <section className="container mx-auto max-w-5xl px-4 pb-6 text-muted-foreground">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-foreground">{copy.whatTitle}</h3>
            <p className="leading-relaxed">{copy.whatDesc}</p>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-semibold text-foreground">{copy.whyTitle}</h3>
            <ul className="list-disc pl-5 leading-relaxed">
              <li>{copy.whyItems[0]}</li>
              <li>{copy.whyItems[1]}</li>
              <li>
                {copy.whyCtaPrefix}
                <Link className="underline" href={`${base}/tools/image-to-prompt`}>
                  {lang === "en" ? ` ${copy.whyCtaLinkText}` : copy.whyCtaLinkText}
                </Link>
                {copy.whyCtaSuffix}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-6 text-center shadow-sm dark:border-violet-900/40 dark:from-violet-950/40 dark:to-indigo-950/30 md:flex-row md:text-left">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{copy.ctaTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{copy.ctaDesc}</p>
          </div>
          <Link href={`${base}/tools/image-to-prompt`}>
            <Button size="lg" className="px-7 bg-violet-600 text-white hover:bg-violet-700">{copy.ctaStart}</Button>
          </Link>
        </div>
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
    <Card className="group relative flex h-full cursor-pointer flex-col items-center gap-3 rounded-xl border border-border/60 bg-white p-7 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-background/40 dark:shadow-none">
      <div className="flex items-center justify-center rounded-lg bg-violet-50 p-3 ring-1 ring-violet-100 transition-colors group-hover:bg-violet-100 dark:bg-muted/30">
        {icon}
      </div>
      <h3 className="mt-1 text-base font-semibold leading-tight tracking-tight text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
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

function Step({ index, title, desc }: { index: number; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
      <div className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
        {index}
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}
