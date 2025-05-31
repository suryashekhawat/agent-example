import { useEffect, useState } from "react";

import SidePanel from "@/components/SidePanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useThemeStore } from '@/store/themeStore';
import { StreamProvider } from "@/StreamProvider";
import { EventList } from "@/components/EventList";
function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-4 relative">
      {/* Header */}
      <StreamProvider />
      <EventList />
      <header className="flex justify-between items-center mb-4">
        <ThemeToggle />
      </header>


      {/* Floating Chat Button */}
      <button
        onClick={() => setIsPanelOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg z-50"
      >
        Open Chat
      </button>

      {/* Side Panel */}
      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}

export default App;
