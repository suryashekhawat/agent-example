import { useEffect, useRef, useState } from "react";
import { themeClasses, getThemeVariant } from "@/utils/theme";

interface ChatPayload {
  sender: "user" | "bot";
  message: string;
  messageId?: string;
  conversationId?: string;
}

interface BaseEvent {
  id: string;
  type: "chat" | "notification" | "system" | "user";
  timestamp: number;
  payload: any;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatPayload[]>([
    { sender: "bot", message: "Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const variant = getThemeVariant();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws"); // Use secure ws:// or wss:// in prod

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data: BaseEvent = JSON.parse(event.data);
      if (data.type === "chat") {
        const { message, sender } = data.payload;
        setMessages((prev) => [...prev, { sender, message }]);
      } else if (data.type === "system") {
        // Handle system events like typing...
        console.log("System event:", data.payload);
      }
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current = ws;

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;

    const chatPayload = {
      id: crypto.randomUUID(),
      type: "chat",
      timestamp: Date.now(),
      payload: {
        sender: "user",
        message: input,
      },
    };

    wsRef.current.send(JSON.stringify(chatPayload));
    setMessages((prev) => [...prev, { sender: "user", message: input }]);
    setInput("");
    setLoading(true);

    // Bot reply will come via socket
    setTimeout(() => setLoading(false), 200); // UX delay
  };

  return (
    <div className={`flex flex-col h-full p-4 ${themeClasses.container[variant]}`}>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs whitespace-pre-wrap ${
              themeClasses.bubble[msg.sender === "user" ? "user" : "assistant"][variant]
            } ${msg.sender === "user" ? "self-end" : "self-start"}`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-4 py-2 flex items-center border-t border-gray-300 dark:border-gray-700">
        <input
          className={`flex-1 p-2 rounded-lg ${themeClasses.input[variant]}`}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
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
