// components/Layout.tsx
import { ReactNode } from "react";
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
