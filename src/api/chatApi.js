const API_BASE = "https://dietbite-pro-mobile-1.onrender.com";

export async function sendChatMessage(message: string) {
  const url = `${API_BASE}/chat`;
  console.log("CHAT URL:", url);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ message }),
    });

    const raw = await res.text();
    console.log("CHAT STATUS:", res.status);
    console.log("CHAT RAW:", raw);

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw}`);

    const data = JSON.parse(raw);
    if (!data?.reply) throw new Error("No reply in response JSON");

    return data.reply;
  } catch (e: any) {
    const msg = e?.message ?? String(e);
    console.log("CHAT FAILED:", msg);
    // IMPORTANT: throw the real message up to the UI
    throw new Error(msg);
  }
}
