import { useState } from "react";

const API_URL = "https://dietbite-pro-backend-1.onrender.com/api/chat";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage("");

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          mode: "chat",
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "No response received." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "⚠️ Unable to reach DietBite Pro servers. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="appWrap">
      <div className="card">
        <div className="header">
          <div>
            <h1 className="title">🥗 DietBite Pro</h1>
            <p className="subtitle">
              Therapeutic diet guidance • Hospital-ready • Not medical advice
            </p>
          </div>
          <p className="subtitle">Powered by DietBite Pro AI</p>
        </div>

        <div className="chatBox">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`bubble ${m.role === "user" ? "user" : "bot"}`}
            >
              {m.text}
            </div>
          ))}
          {loading && <div className="loading">Thinking…</div>}
        </div>

        <div className="inputRow">
          <input
            className="input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about renal, diabetic, cardiac, texture-modified diets…"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="button"
            onClick={sendMessage}
            disabled={loading || !message.trim()}
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
