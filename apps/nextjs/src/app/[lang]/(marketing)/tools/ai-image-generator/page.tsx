import type { Locale } from "~/config/i18n-config";
import Client from "./client";

export const metadata = {
  title: "AI Image Generator",
  description: "Generate images from text prompts.",
};

export default function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <Client lang={lang} />;
}

