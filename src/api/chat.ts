import Constants from "expo-constants";

/**
 * Pulls values from app.json -> expo.extra
 */
type ExtraConfig = {
  CHAT_API_URL_DEV?: string;
  CHAT_API_URL_PROD?: string;
};

function getChatUrl(): string {
  const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

  const devUrl = extra.CHAT_API_URL_DEV;
  const prodUrl = extra.CHAT_API_URL_PROD;

  // Prefer DEV during development, PROD in release
  const url = __DEV__ ? devUrl : prodUrl;

  if (!url) {
    throw new Error(
      `CHAT API URL not configured. Check app.json expo.extra (DEV/PROD). __DEV__=${String(
        __DEV__
      )}`
    );
  }

  return url;
}

/**
 * Simple timeout wrapper for fetch
 */
async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs = 45000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export type ChatRequest = {
  message: string;
  // add other fields if your server expects them (e.g., userId, history, etc.)
};

export type ChatResponse = any; // tighten once you know the server response shape

/**
 * POST /chat
 */
export async function sendChat(payload: ChatRequest): Promise<ChatResponse> {
  const url = getChatUrl();

  let res: Response;
  try {
    res = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      45000
    );
  } catch (err: any) {
    // AbortError / network error
    const msg =
      err?.name === "AbortError"
        ? "Request timed out. Server taking too long."
        : `Network error: ${err?.message ?? String(err)}`;
    throw new Error(msg);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Chat request failed (${res.status}). ${text || "No response body."}`
    );
  }

  // Most chat endpoints return JSON
  return res.json();
}
