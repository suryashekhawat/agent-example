import { useEffect } from "react";

import SidePanel from "@/components/SidePanel";
import { useThemeStore } from '@/store/themeStore';
import Layout from "@/components/Layout";
import { WebSocketProvider } from "@/websocket/provider";
function App() {
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
    <WebSocketProvider>
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-4 relative">
        <Layout>
          <SidePanel />
        </Layout>
      </div>
    </WebSocketProvider>
  );
}

export default App;
