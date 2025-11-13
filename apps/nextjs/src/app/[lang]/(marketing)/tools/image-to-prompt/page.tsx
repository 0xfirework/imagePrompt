import type { Locale } from "~/config/i18n-config";
import type { Metadata } from "next";
import Client from "./client";

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  const t = (lang: Locale) => {
    if (lang === "zh") {
      return {
        title: "图片转提示词工具 | Image to Prompt",
        description: "将图片转换为详细的提示词，用于复现或生成图像。",
      };
    }
    if (lang === "ko") {
      return {
        title: "이미지 프롬프트 생성기 | Image to Prompt",
        description: "이미지를 구조화된 프롬프트로 변환하여 손쉽게 활용하세요.",
      };
    }
    return {
      title: "Image to Prompt Generator",
      description: "Convert images into detailed prompts you can reuse.",
    };
  };
  const { title, description } = t(params.lang);
  return { title, description };
}

export default function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <Client lang={lang} />;
}
