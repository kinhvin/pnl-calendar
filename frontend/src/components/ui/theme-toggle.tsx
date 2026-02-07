/**
 * Theme Toggle Components
 * 
 * Three beautiful variations of theme toggles for switching between light and dark modes:
 * 
 * 1. ThemeToggle - Simple icon button (recommended for headers/navigation)
 * 2. ThemeToggleCompact - Sliding toggle with text (modern mobile-friendly design)
 * 3. ThemeToggleDropdown - Segmented button group (clear visual state)
 * 
 * Usage:
 * import { ThemeToggle } from '@/components/ui/theme-toggle'
 * <ThemeToggle />
 */

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './button';

/**
 * Simple icon toggle button - Great for headers and minimal UIs
 * Smoothly transitions between sun and moon icons
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 duration-500 ease-in-out" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

/**
 * Compact sliding toggle - Perfect for mobile and settings pages
 * Shows current theme with smooth sliding animation
 */
export function ThemeToggleCompact() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group relative inline-flex h-10 w-20 items-center rounded-full bg-secondary transition-colors hover:bg-accent"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-lg transition-transform duration-300 ease-in-out ${
          theme === 'dark' ? 'translate-x-11' : 'translate-x-1'
        }`}
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
        )}
      </span>
      <span className="ml-2 text-xs font-medium text-muted-foreground">
        {theme === 'light' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

/**
 * Segmented button group - Best for settings pages with clear visual state
 * Shows both options with active state highlighting
 */
export function ThemeToggleDropdown() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-1">
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          theme === 'light'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        <Sun className="h-4 w-4" />
        <span>Light</span>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          theme === 'dark'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        <Moon className="h-4 w-4" />
        <span>Dark</span>
      </button>
    </div>
  );
}

