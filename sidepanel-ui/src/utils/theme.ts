// utils/theme.ts

type ThemeVariant = "light" | "dark";

export const themeClasses = {
  container: {
    light: "bg-white text-black",
    dark: "bg-zinc-900 text-white",
  },
  panel: {
    light: "bg-white border-zinc-200 text-black",
    dark: "bg-zinc-900 border-zinc-700 text-white",
  },
  bubble: {
    user: {
      light: "bg-blue-100 text-black",
      dark: "bg-blue-700 text-white",
    },
    assistant: {
      light: "bg-zinc-200 text-black",
      dark: "bg-zinc-800 text-white",
    },
  },
  input: {
    light: "bg-white border text-black border-zinc-300",
    dark: "bg-zinc-800 border-zinc-700 text-white",
  },
  button: {
    base: "px-4 py-2 rounded-lg text-white",
    light: "bg-blue-500 hover:bg-blue-600",
    dark: "bg-blue-600 hover:bg-blue-700",
  },
} satisfies Record<string, any>;

export function getThemeVariant(): ThemeVariant {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
