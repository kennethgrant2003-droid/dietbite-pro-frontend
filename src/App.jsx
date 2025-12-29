import { useState } from "react";
import saladImg from "./assets/salad.png";
import "./index.css";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const res = await fetch(
        "https://dietbite-pro-backend-1.onrender.com/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            mode: "chat",
          }),
        }
      );

      const data = await res.json();
      setReply(data.reply || "No response received.");
    } catch (err) {
      setReply("⚠️ Unable to reach DietBite Pro service.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-fade-in">

        {/* HERO IMAGE (FOR MOBILE APPS) */}
        <div className="flex justify-center mb-4">
          <img
            src={saladImg}
            alt="Healthy salad"
            className="w-40 h-40 object-contain animate-float"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center text-green-700">
          DietBite Pro
        </h1>

        <p className="text-center text-gray-500 mb-4">
          Clinical nutrition guidance made simple
        </p>

        {/* INPUT */}
        <textarea
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          rows="3"
          placeholder="Ask about renal, diabetic, cardiac diets..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={sendMessage}
          disabled={loading}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Ask DietBite"}
        </button>

        {/* RESPONSE */}
        {reply && (
          <div className="mt-4 p-3 bg-green-50 rounded-xl text-sm text-gray-700 animate-slide-up">
            {reply}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
