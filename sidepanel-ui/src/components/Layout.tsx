// components/Layout.tsx

import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      <header className="flex justify-between items-center px-4 py-2 border-b dark:border-zinc-700">
        <h1 className="text-xl font-bold">My App</h1>
        <ThemeToggle />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
