import type { Locale } from "~/config/i18n-config";
import Client from "./client";

export const metadata = {
  title: "图片转提示词工具",
  description: "将图片转换为详细的提示词，用于复现或生成图像。",
};

export default function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <Client lang={lang} />;
}
