import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env.mjs";

// Ensure Node.js runtime (Buffer, etc.)
export const runtime = "nodejs" as const;

function cozeAuthHeader() {
  const scheme = (env as any).COZE_AUTH_SCHEME ?? "Bearer";
  let token = String(env.COZE_TOKEN ?? "");
  token = token.replace(/^Bearer\s+/i, "").trim();
  return `${scheme} ${token}`;
}

async function toBufferFromDataUrl(dataUrl: string) {
  const m = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!m) throw new Error("Invalid data URL");
  const mime = m[1];
  const buf = Buffer.from(m[2], "base64");
  const ext = mime.includes("png") ? "png" : mime.includes("jpeg") ? "jpg" : mime.includes("webp") ? "webp" : "bin";
  return { buf, mime, filename: `upload.${ext}` } as const;
}

async function downloadToBuffer(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch image failed: ${res.status}`);
  const mime = res.headers.get("content-type") ?? "application/octet-stream";
  const buf = Buffer.from(await res.arrayBuffer());
  const pathname = new URL(url).pathname.toLowerCase();
  let ext = "bin";
  if (pathname.endsWith(".png")) ext = "png";
  else if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) ext = "jpg";
  else if (pathname.endsWith(".webp")) ext = "webp";
  return { buf, mime, filename: `download.${ext}` } as const;
}

async function cozeUpload({ buf, mime, filename }: { buf: Buffer; mime: string; filename: string }) {
  if (!env.COZE_TOKEN) throw new Error("COZE_TOKEN not configured");
  // Coze upload files API
  const form = new FormData();
  const blob = new Blob([buf], { type: mime });
  // field name per docs is usually "file"
  form.append("file", blob, filename);
  // name is optional; keep server side derive
  const apiBase = ((env as any).COZE_API_BASE ?? "https://api.coze.cn").replace(/\/$/, "");
  const endpoint = (env as any).COZE_FILES_ENDPOINT;
  if (!endpoint) {
    throw new Error(
      "File upload endpoint not configured. Use URL mode or set COZE_FILES_ENDPOINT to your Coze upload path."
    );
  }
  const url = `${apiBase}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: cozeAuthHeader(),
    },
    body: form,
    // Next.js request init requires no extra configs
  });
  const json = await resp.json();
  if (!resp.ok) throw new Error(`Coze upload failed: ${resp.status} ${JSON.stringify(json)}`);
  // Assume response includes data.id or id
  const fileId = json?.data?.id ?? json?.id ?? json?.file_id;
  if (!fileId) throw new Error("Coze upload: missing file id in response");
  return String(fileId);
}

async function runWorkflow({ fileId, imageUrl, language, model, text }: { fileId?: string; imageUrl?: string; language?: string; model?: string; text?: string }) {
  if (!env.COZE_TOKEN || !env.COZE_WORKFLOW_ID) throw new Error("COZE credentials not configured");
  // Allow custom parameter keys expected by your Coze workflow
  const promptTypeKey = (env as any).COZE_PARAM_PROMPT_TYPE ?? "promptType";
  const userQueryKey = (env as any).COZE_PARAM_USER_QUERY ?? "userQuery";
  const imageIdKey = (env as any).COZE_PARAM_IMAGE_ID ?? "image_file_id";
  const imageUrlKey = (env as any).COZE_PARAM_IMAGE_URL ?? "image_url";
  const wrapIdAsJson = String((env as any).COZE_IMAGE_ID_AS_JSON ?? "false").toLowerCase() === "true" || String((env as any).COZE_IMAGE_ID_AS_JSON ?? "0") === "1";

  const mappedPromptType = (() => {
    const m = (model ?? "general").toLowerCase();
    if (["midjourney"].includes(m)) return "midjourney";
    if (["flux"].includes(m)) return "flux";
    if (["sd", "stable-diffusion", "stable_diffusion"].includes(m)) return "stable_diffusion";
    return "general";
  })();

  const userQuery =
    typeof text === "string" && text.trim().length > 0
      ? text.trim()
      : `Generate a ${mappedPromptType} style image prompt in ${language ?? "English"}.`;

  const payload = {
    workflow_id: env.COZE_WORKFLOW_ID,
    parameters: {
      // image reference (either id or url)
      ...(fileId
        ? { [imageIdKey]: wrapIdAsJson ? JSON.stringify({ file_id: fileId }) : fileId }
        : {}),
      ...(imageUrl ? { [imageUrlKey]: imageUrl } : {}),
      // explicit fields some Coze workflows require
      [promptTypeKey]: mappedPromptType,
      [userQueryKey]: userQuery,
      // keep original hints
      language: language ?? "English",
      model: model ?? "general",
    },
    // try sync run if supported
    stream: false,
  } as any;
  const apiBase = ((env as any).COZE_API_BASE ?? "https://api.coze.cn").replace(/\/$/, "");
  const endpoint = (env as any).COZE_WORKFLOW_ENDPOINT ?? "/v1/workflow/run";
  const url = `${apiBase}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: cozeAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json = await resp.json();
  if (!resp.ok) throw new Error(`Coze workflow failed: ${resp.status} ${JSON.stringify(json)}`);
  // Try extracting prompt from common shapes
  let prompt = json?.data?.output ?? json?.data?.result ?? json?.result ?? json?.output ?? json?.data?.prompt;
  if (typeof prompt === "string" && prompt.trim()) return prompt;

  // If data is a JSON string, try to parse and extract
  if (typeof json?.data === "string") {
    try {
      const inner = JSON.parse(json.data);
      const p = inner?.output ?? inner?.result ?? inner?.prompt ?? inner?.text ?? inner?.content;
      if (typeof p === "string" && p.trim()) return p as string;
      if (typeof inner === "string" && inner.trim()) return inner as string;
    } catch {}
  }

  // Heuristic 1: variables.prompt
  const vars = json?.data?.variables ?? json?.variables;
  if (vars && typeof vars?.prompt === "string" && vars.prompt.trim()) return vars.prompt as string;

  // Heuristic 2: messages array
  const messages = json?.data?.messages ?? json?.messages;
  if (Array.isArray(messages)) {
    const found = messages.find((m: any) => typeof m?.content === "string" && m.content.trim());
    if (found) return String(found.content);
    const foundText = messages.find((m: any) => typeof m?.text === "string" && m.text.trim());
    if (foundText) return String(foundText.text);
  }

  // Heuristic 3: outputs array
  const outputs = json?.data?.outputs ?? json?.outputs;
  if (Array.isArray(outputs)) {
    const t = outputs.find((o: any) => typeof o?.text === "string" && o.text.trim());
    if (t) return String(t.text);
    const c = outputs.find((o: any) => typeof o?.content === "string" && o.content.trim());
    if (c) return String(c.content);
    const p = outputs.find((o: any) => typeof o?.prompt === "string" && o.prompt.trim());
    if (p) return String(p.prompt);
  }

  // Heuristic 4: OpenAI-style
  const choice = json?.choices?.[0]?.message?.content;
  if (typeof choice === "string" && choice.trim()) return choice;

  // If still not found, include a short sample for debugging
  const sample = JSON.stringify(json).slice(0, 600);
  throw new Error(`Coze workflow: cannot locate prompt in response. sample=${sample}`);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      imageDataUrl?: string;
      imageUrl?: string;
      source: "upload" | "url" | "text";
      model: string;
      language?: string;
      text?: string;
    };

    let fileMeta: { buf: Buffer; mime: string; filename: string } | null = null;
    let imageUrlForWorkflow: string | undefined = undefined;
    if (body.imageDataUrl) {
      fileMeta = await toBufferFromDataUrl(body.imageDataUrl);
    } else if (body.imageUrl) {
      // Prefer passing URL directly to Coze instead of uploading
      imageUrlForWorkflow = body.imageUrl;
    } else if (body.source !== "text") {
      throw new Error("No image provided");
    }

    // Basic server-side validation (align with frontend)
    let fileId: string | undefined = undefined;
    if (fileMeta) {
      const mimeLc = fileMeta.mime.toLowerCase();
      const byMime = /image\/(png|jpe?g|webp)/.test(mimeLc);
      const nameLc = fileMeta.filename.toLowerCase();
      const byExt = nameLc.endsWith(".png") || nameLc.endsWith(".jpg") || nameLc.endsWith(".jpeg") || nameLc.endsWith(".webp");
      if (!(byMime || byExt)) {
        console.warn("[img2prompt] unsupported type", { mime: fileMeta.mime, filename: fileMeta.filename });
        return NextResponse.json({ error: "Unsupported image type. Use PNG/JPG/WEBP." }, { status: 400 });
      }
      const max = 4 * 1024 * 1024; // 4MB
      if (fileMeta.buf.byteLength > max) {
        return NextResponse.json({ error: "Image too large. Max 4MB." }, { status: 413 });
      }
      fileId = await cozeUpload(fileMeta);
    }

    const prompt = await runWorkflow({ fileId, imageUrl: imageUrlForWorkflow, language: body.language, model: body.model, text: body.text });
    return NextResponse.json({ prompt });
  } catch (err: any) {
    console.error("[img2prompt]", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}

export async function GET() {
  // Health + config snapshot for debugging (no secret leakage)
  const scheme = (env as any).COZE_AUTH_SCHEME ?? "Bearer";
  const raw = String(env.COZE_TOKEN ?? "");
  const token = raw.replace(/^Bearer\s+/i, "").trim();
  const masked = token ? `${token.slice(0, 4)}...${token.slice(-3)} (len=${token.length})` : "";
  const apiBase = ((env as any).COZE_API_BASE ?? "https://api.coze.cn").replace(/\/$/, "");
  const workflowEndpoint = (env as any).COZE_WORKFLOW_ENDPOINT ?? "/v1/workflow/run";
  const filesEndpoint = (env as any).COZE_FILES_ENDPOINT ?? null;
  const keys = {
    image_url: (env as any).COZE_PARAM_IMAGE_URL ?? "image_url",
    image_id: (env as any).COZE_PARAM_IMAGE_ID ?? "image_file_id",
    promptType: (env as any).COZE_PARAM_PROMPT_TYPE ?? "promptType",
    userQuery: (env as any).COZE_PARAM_USER_QUERY ?? "userQuery",
  };
  return NextResponse.json({
    hasToken: !!token,
    hasWorkflow: !!env.COZE_WORKFLOW_ID,
    apiBase,
    workflowEndpoint,
    filesEndpoint,
    paramKeys: keys,
    tokenSample: token ? `${scheme} ${masked}` : null,
  });
}
