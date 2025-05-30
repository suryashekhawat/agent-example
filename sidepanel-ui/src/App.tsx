import { useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

import SidePanel from "@/components/SidePanel"; // ✅ import your side panel
import { ThemeToggle } from "@/components/ThemeToggle"; // ✅ optional theme toggle

function App() {
  const [count, setCount] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // ✅ state for side panel

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-4">
      <div className="flex justify-between items-center">
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <ThemeToggle /> {/* Optional theme toggle */}
      </div>

      <h1 className="text-3xl font-bold my-4">Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs mt-4">
        Click on the Vite and React logos to learn more
      </p>

      <button
        onClick={() => setIsPanelOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg"
      >
        Open Chat
      </button>

      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}

export default App;
