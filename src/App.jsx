import { useState } from "react";
import "./index.css";

const API_URL = "https://dietbite-pro-mobile-1.onrender.com/chat";

export default function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      setReply(data.reply ?? "(no reply)");
    } catch (e) {
      setReply("Can't reach backend. (Check CORS / URL / Render status)");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h2>DietBite Chat</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "100%", minHeight: 120 }}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={send} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Reply</h3>
        <div style={{ whiteSpace: "pre-wrap", padding: 10, border: "1px solid #ccc" }}>
          {reply}
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 12, opacity: 0.7 }}>
        Tip: test with <code>Say only: OK</code>
      </div>
    </div>
  );
}
