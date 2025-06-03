import { useEffect, useState } from "react";

import SidePanel from "@/components/SidePanel";
import { useThemeStore } from '@/store/themeStore';
import { StreamProvider } from "@/StreamProvider";
import Layout from "@/components/Layout";
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
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-4 relative">
      <StreamProvider />
      <Layout>
        <SidePanel />
      </Layout>

    </div>
  );
}

export default App;
