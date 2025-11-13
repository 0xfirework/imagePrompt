"use client";

import * as React from "react";
import { useMemo, useRef, useState } from "react";

import { Button } from "@saasfly/ui/button";
import { Card } from "@saasfly/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@saasfly/ui/dialog";
import { toast } from "@saasfly/ui/use-toast";
import * as Icons from "@saasfly/ui/icons";

type Dict = {
  title: string;
  subtitle: string;
  tabImageToPrompt: string;
  tabUpload: string;
  tabUrl: string;
  uploaderHint: string;
  uploaderNote: string;
  preview: string;
  previewButton: string;
  previewEmpty: string;
  models: { key: string; title: string; desc: string }[];
  viewHistory: (count: number) => string;
  promptLanguage: string;
  generating: string;
  generate: string;
  textareaPlaceholder: string;
  copy: string;
  copied: string;
  historyTitle: string;
  historyEmpty: string;
  clearAll: string;
  use: string;
  delete: string;
  secondsAgo: (n: number) => string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;
};

const DICTS: Record<string, Dict> = {
  zh: {
    title: "图片转提示词工具",
    subtitle: "将图片转换为可复用的结构化提示词，支持多模型。",
    tabImageToPrompt: "图片转提示词",
    tabUpload: "上传图片",
    tabUrl: "输入图片链接",
    uploaderHint: "上传图片或拖拽到此处",
    uploaderNote: "PNG、JPG 或 WEBP，最大 4MB",
    preview: "图片预览",
    previewButton: "预览",
    previewEmpty: "你的图片预览将展示在这里",
    models: [
      { key: "general", title: "通用图像提示词", desc: "自然语言描述图像内容" },
      { key: "flux", title: "Flux", desc: "针对 Flux 模型优化" },
      { key: "midjourney", title: "Midjourney", desc: "适配 Midjourney 参数风格" },
      { key: "sd", title: "Stable Diffusion", desc: "适配 SD 模型格式" },
    ],
    viewHistory: (c) => (c ? `查看历史记录 (${c})` : "查看历史记录"),
    promptLanguage: "提示词语言",
    generating: "正在生成",
    generate: "生成提示词",
    textareaPlaceholder: "生成的提示词会显示在这里",
    copy: "复制",
    copied: "已复制",
    historyTitle: "历史记录",
    historyEmpty: "暂无历史。先生成一个提示词试试吧。",
    clearAll: "清空全部",
    use: "使用",
    delete: "删除",
    secondsAgo: (n) => `${n}秒前`,
    minutesAgo: (n) => `${n}分钟前`,
    hoursAgo: (n) => `${n}小时前`,
    daysAgo: (n) => `${n}天前`,
  },
  ko: {
    title: "이미지 프롬프트 도구",
    subtitle: "이미지를 구조화된 프롬프트로 변환하고 여러 모델에 활용하세요.",
    tabImageToPrompt: "이미지→프롬프트",
    tabUpload: "이미지 업로드",
    tabUrl: "이미지 URL 입력",
    uploaderHint: "이미지를 업로드하거나 이곳에 끌어다 놓기",
    uploaderNote: "PNG, JPG 또는 WEBP, 최대 4MB",
    preview: "이미지 미리보기",
    previewButton: "미리보기",
    previewEmpty: "여기에 이미지 미리보기가 표시됩니다",
    models: [
      { key: "general", title: "일반 이미지 프롬프트", desc: "이미지를 자연어로 설명" },
      { key: "flux", title: "Flux", desc: "Flux 모델에 최적화" },
      { key: "midjourney", title: "Midjourney", desc: "Midjourney 스타일에 맞춤" },
      { key: "sd", title: "Stable Diffusion", desc: "SD 모델 형식에 맞춤" },
    ],
    viewHistory: (c) => (c ? `히스토리 보기 (${c})` : "히스토리 보기"),
    promptLanguage: "프롬프트 언어",
    generating: "생성 중",
    generate: "프롬프트 생성",
    textareaPlaceholder: "생성된 프롬프트가 여기에 표시됩니다",
    copy: "복사",
    copied: "복사됨",
    historyTitle: "프롬프트 히스토리",
    historyEmpty: "히스토리가 없습니다. 먼저 프롬프트를 생성해 보세요.",
    clearAll: "모두 지우기",
    use: "사용",
    delete: "삭제",
    secondsAgo: (n) => `${n}초 전`,
    minutesAgo: (n) => `${n}분 전`,
    hoursAgo: (n) => `${n}시간 전`,
    daysAgo: (n) => `${n}일 전`,
  },
  en: {
    title: "Image to Prompt Tool",
    subtitle: "Convert images into structured prompts for popular models.",
    tabImageToPrompt: "Image to Prompt",
    tabUpload: "Upload Image",
    tabUrl: "Input Image URL",
    uploaderHint: "Upload a photo or drag and drop",
    uploaderNote: "PNG, JPG, or WEBP up to 4MB",
    preview: "Image Preview",
    previewButton: "Preview",
    previewEmpty: "Your image will show here",
    models: [
      { key: "general", title: "General Image Prompt", desc: "Natural language description of the image" },
      { key: "flux", title: "Flux", desc: "Optimized for state-of-the-art Flux models" },
      { key: "midjourney", title: "Midjourney", desc: "Tailored for Midjourney parameters" },
      { key: "sd", title: "Stable Diffusion", desc: "Formatted for SD models" },
    ],
    viewHistory: (c) => (c ? `View History (${c})` : "View History"),
    promptLanguage: "Prompt Language",
    generating: "Generating",
    generate: "Generate Prompt",
    textareaPlaceholder: "Generated prompt will appear here",
    copy: "Copy",
    copied: "Copied",
    historyTitle: "Prompt History",
    historyEmpty: "No history yet. Generate a prompt to populate history.",
    clearAll: "Clear All",
    use: "Use",
    delete: "Delete",
    secondsAgo: (n) => `${n}s ago`,
    minutesAgo: (n) => `${n}m ago`,
    hoursAgo: (n) => `${n}h ago`,
    daysAgo: (n) => `${n}d ago`,
  },
};

export default function Client({ lang }: { lang: string }) {
  const dict: Dict = useMemo(() => DICTS[lang] ?? DICTS.en, [lang]);
  // Default to URL mode to leverage server-side direct URL workflow
  const [activeTab, setActiveTab] = useState<"upload" | "url">("url");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [model, setModel] = useState("general");
  const [language, setLanguage] = useState(() => (lang === "zh" ? "中文" : lang === "ko" ? "한국어" : lang === "ja" ? "日本語" : "English"));
  const [prompt, setPrompt] = useState("");
  // history
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openHistory, setOpenHistory] = useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("img2prompt_history_v1");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  function addHistory(item: HistoryItem) {
    setHistory((prev) => {
      const next = [item, ...prev].slice(0, 50);
      if (prev.length >= 50) {
        toast({
          title: "History limit reached",
          description: "Keeping the latest 50 entries; the oldest was removed.",
        });
      }
      try {
        localStorage.setItem("img2prompt_history_v1", JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  function removeHistory(id: string) {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      try {
        localStorage.setItem("img2prompt_history_v1", JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  function clearHistory() {
    setHistory(() => {
      try {
        localStorage.removeItem("img2prompt_history_v1");
      } catch {}
      return [];
    });
  }
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
        source: activeTab,
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
      let data: any = null;
      try {
        data = await res.json();
      } catch {}
      if (!res.ok) {
        const msg = (data && (data.error || data.message)) ? String(data.error || data.message) : `HTTP ${res.status}`;
        throw new Error(msg);
      }
      const promptData = data as { prompt: string };
      setPrompt(promptData.prompt);
      addHistory({
        id: `${Date.now()}`,
        date: new Date().toISOString(),
        model,
        language,
        prompt: promptData.prompt,
      });
    } catch (err: any) {
      toast({ title: "Failed to generate", description: err?.message ?? "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="mx-auto max-w-4xl text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-6xl">{dict.title}</h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">{dict.subtitle}</p>
      </header>

      <div className="mx-auto mt-8 max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 rounded-t-xl border border-border/60 bg-background p-2 text-sm">
          <Tab active>{dict.tabImageToPrompt}</Tab>
        </div>
        <Card className="rounded-t-none border-t-0 p-4 md:p-6">
          {/* Upload + Preview */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 flex gap-4 text-sm">
                <button
                  className={`border-b-2 px-1 pb-1 ${
                    activeTab === "upload"
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("upload")}
                >
                  {dict.tabUpload}
                </button>
                <button
                  className={`border-b-2 px-1 pb-1 ${
                    activeTab === "url"
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("url")}
                >
                  {dict.tabUrl}
                </button>
              </div>

              {activeTab === "upload" ? (
                <div
                  className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 text-center transition-colors hover:border-violet-400 hover:bg-violet-50/40"
                  onClick={() => fileInput.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f) onSelectFile(f);
                  }}
                >
                  <Icons.Post className="mb-3 h-8 w-8 text-violet-600" />
                  <p className="text-sm text-muted-foreground">{dict.uploaderHint}</p>
                  <p className="text-xs text-muted-foreground">{dict.uploaderNote}</p>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={() => onSelectFile()}
                    onPaste={(e) => {
                      const item = e.clipboardData?.items?.[0];
                      if (item && item.kind === "file") {
                        const f = item.getAsFile();
                        if (f) onSelectFile(f);
                      }
                    }}
                  />
                </div>
              ) : activeTab === "url" ? (
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-md border border-border/60 bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="https://.../image.png"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button onClick={() => setPreview(url)} variant="outline">{dict.previewButton}</Button>
                </div>
              ) : null}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">{dict.preview}</p>
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
                    {dict.previewEmpty}
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Models */}
          <div className="grid gap-3 md:grid-cols-4">
            {dict.models.map((m) => (
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

          <div className="mt-4 grid grid-cols-1 items-center gap-3 md:grid-cols-[auto_1fr_auto]">
            <Button variant="ghost" className="justify-start px-2 text-sm text-violet-700 hover:text-violet-800" onClick={() => setOpenHistory(true)}>
              {dict.viewHistory(history.length)}
            </Button>
            <div className="flex items-center gap-3">
              <label className="text-sm">{dict.promptLanguage}</label>
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

            <Button
              onClick={generate}
              disabled={loading || !preview}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {loading ? (
                <>
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                  {dict.generating}
                </>
              ) : (
                dict.generate
              )}
            </Button>
          </div>

          <div className="mt-4 relative">
            <textarea
              className="min-h-[160px] w-full rounded-lg border border-border/60 bg-muted/20 p-3 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder={dict.textareaPlaceholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <CopyButton text={prompt} disabled={!prompt} copyLabel={dict.copy} copiedLabel={dict.copied} />
          </div>
        </Card>
        {/* History Dialog */}
        <HistoryDialog
          open={openHistory}
          onOpenChange={setOpenHistory}
          items={history}
          onUse={(p) => {
            setPrompt(p);
            setOpenHistory(false);
          }}
          onRemove={removeHistory}
          onClear={clearHistory}
          dict={dict}
        />
      </div>
    </div>
  );
}

function Tab({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <div className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-muted/40 font-medium" : "text-muted-foreground"}`}>
      {children}
      {active && (
        <span className="pointer-events-none absolute inset-x-2 -bottom-[6px] h-[2px] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400" />
      )}
    </div>
  );
}

function CopyButton({ text, disabled, copyLabel, copiedLabel }: { text: string; disabled?: boolean; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs shadow-sm backdrop-blur ${
        disabled ? "cursor-not-allowed opacity-40" : "hover:bg-muted/40"
      }`}
      aria-label={copyLabel}
    >
      {copied ? (
        <>
          <Icons.Check className="h-3.5 w-3.5 text-green-600" /> {copiedLabel}
        </>
      ) : (
        <>
          <Icons.Copy className="h-3.5 w-3.5" /> {copyLabel}
        </>
      )}
    </button>
  );
}

type HistoryItem = {
  id: string;
  date: string; // ISO
  model: string;
  language: string;
  prompt: string;
};

function HistoryDialog({
  open,
  onOpenChange,
  items,
  onUse,
  onRemove,
  onClear,
  dict,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: HistoryItem[];
  onUse: (prompt: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  dict: Dict;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{dict.historyTitle}</span>
            {items.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm(dict.clearAll + "?")) onClear();
                }}
              >
                {dict.clearAll}
              </Button>
            ) : null}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-3 overflow-auto pr-1">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{dict.historyEmpty}</p>
          ) : (
            items.map((it) => (
              <div key={it.id} className="rounded-lg border border-border/60 p-3">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {formatRelativeTime(it.date, dict)} • {it.model} • {it.language}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onUse(it.prompt)}>{dict.use}</Button>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(it.prompt)}>{dict.copy}</Button>
                    <Button variant="ghost" size="sm" onClick={() => onRemove(it.id)}>{dict.delete}</Button>
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {it.prompt}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatRelativeTime(iso: string, dict: Dict) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return dict.secondsAgo(sec);
  const min = Math.round(sec / 60);
  if (min < 60) return dict.minutesAgo(min);
  const hr = Math.round(min / 60);
  if (hr < 24) return dict.hoursAgo(hr);
  const day = Math.round(hr / 24);
  return dict.daysAgo(day);
}
