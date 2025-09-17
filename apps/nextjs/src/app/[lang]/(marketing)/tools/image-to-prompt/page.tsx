import type { Locale } from "~/config/i18n-config";
import Client from "./client";

export const metadata = {
  title: "Image to Prompt",
  description: "Convert an image into a detailed text prompt.",
};

export default function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <Client lang={lang} />;
}

