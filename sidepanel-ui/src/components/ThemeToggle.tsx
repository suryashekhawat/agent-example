import { useThemeStore } from '@/store/themeStore';
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={theme + " p-2 text-sm rounded bg-gray-200 dark:bg-zinc-800"}
    >
      {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};
