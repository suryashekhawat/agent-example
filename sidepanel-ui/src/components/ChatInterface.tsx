import { useState } from "react";
import { themeClasses, getThemeVariant } from "@/utils/theme";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const variant = getThemeVariant();

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
    }

    setLoading(false);
  };

  return (
    <div className={`flex flex-col h-full p-4 ${themeClasses.container[variant]}`}>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.slice(1).map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs whitespace-pre-wrap ${
              themeClasses.bubble[msg.role === "user" ? "user" : "assistant"][variant]
            } ${msg.role === "user" ? "self-end" : "self-start"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          className={`flex-1 p-2 rounded-lg ${themeClasses.input[variant]}`}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`${themeClasses.button.base} ${themeClasses.button[variant]} ml-2`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
