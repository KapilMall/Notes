import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext"

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-800" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
    )
}