# 🎨 Theme System Documentation

## Overview
This app features a beautiful and comprehensive light/dark mode system built with React Context, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

The theme system is already integrated throughout your app. The toggle button appears in:
- **Header**: Top-right corner (all authenticated pages)
- **Login Page**: Top-right corner

## 📦 Components

### ThemeProvider
Wraps your entire app and manages theme state with localStorage persistence.

```tsx
// Already set up in src/main.tsx
<ThemeProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

### useTheme Hook
Access theme state and controls from any component:

```tsx
import { useTheme } from '@/contexts';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
    </div>
  );
}
```

### Theme Toggle Variants

#### 1. ThemeToggle (Default)
Simple icon button with smooth transitions - **Currently used in header**

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle />
```

#### 2. ThemeToggleCompact
Sliding toggle with text label - Great for mobile

```tsx
import { ThemeToggleCompact } from '@/components/ui/theme-toggle';

<ThemeToggleCompact />
```

#### 3. ThemeToggleDropdown
Segmented button group - Perfect for settings pages

```tsx
import { ThemeToggleDropdown } from '@/components/ui/theme-toggle';

<ThemeToggleDropdown />
```

## 🎨 Color System

### Using Tailwind Classes
All components automatically support dark mode using Tailwind's semantic color tokens:

```tsx
// Background colors
<div className="bg-background">
<div className="bg-card">
<div className="bg-popover">

// Text colors
<p className="text-foreground">
<p className="text-muted-foreground">

// Borders
<div className="border border-border">

// Interactive elements
<button className="bg-primary text-primary-foreground">
<button className="bg-secondary text-secondary-foreground">
```

### Using CSS Variables
For custom styles in CSS modules:

```css
/* Automatically adapts to theme */
.myElement {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border-color: hsl(var(--border));
}

/* Dark mode specific styles */
:global(.dark) .myElement {
  /* Custom dark mode overrides */
}
```

## 🎯 Theme Colors

### Light Mode
- **Primary**: Vibrant blue (`#5B8DEF`)
- **Background**: Pure white
- **Card**: White with subtle shadows
- **Text**: Dark gray/black

### Dark Mode
- **Primary**: Light blue (`#91BAFF`)
- **Background**: Deep navy blue (`#1A2332`)
- **Card**: Slightly lighter navy
- **Text**: Near white with good contrast

## 📝 Adding Dark Mode to New Components

### For Tailwind Components
```tsx
export function MyComponent() {
  return (
    <div className="bg-background text-foreground">
      <h1 className="text-2xl font-bold">Title</h1>
      <p className="text-muted-foreground">Description</p>
      <button className="bg-primary text-primary-foreground hover:bg-primary/90">
        Click me
      </button>
    </div>
  );
}
```

### For CSS Module Components
```css
/* MyComponent.module.css */
.container {
  background-color: white;
  color: #1f2937;
}

:global(.dark) .container {
  background-color: hsl(var(--card));
  color: hsl(var(--foreground));
}

.button {
  background-color: #3b82f6;
}

:global(.dark) .button {
  background-color: hsl(var(--primary));
}
```

## 🔧 Customization

### Changing Colors
Edit [src/index.css](../src/index.css) to customize the color scheme:

```css
@layer base {
  :root {
    /* Light mode colors */
    --primary: 221 83% 53%;
    --background: 0 0% 100%;
    /* ... more colors */
  }
  
  .dark {
    /* Dark mode colors */
    --primary: 217 92% 76%;
    --background: 222 47% 11%;
    /* ... more colors */
  }
}
```

### Adding System Preference Detection
Uncomment this in [src/contexts/ThemeContext.tsx](../src/contexts/ThemeContext.tsx):

```tsx
const [theme, setThemeState] = useState<Theme>(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  // Detect system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
});
```

## ✅ What's Already Themed

- ✅ Sidebar and navigation
- ✅ Calendar components (grid, day cells, legend)
- ✅ P&L components (stats, goals, modals)
- ✅ All UI components (buttons, inputs, cards)
- ✅ Header and site navigation
- ✅ Login page
- ✅ Charts and data visualizations

## 🎭 Features

- **Smooth Transitions**: All theme changes animate smoothly
- **Persistence**: Theme choice saved to localStorage
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Zero layout shift, instant theme application
- **Beautiful Colors**: Carefully chosen color palettes for both modes
- **Consistent**: All components use the same color system

## 🚀 Best Practices

1. **Always use semantic tokens** instead of hardcoded colors
2. **Test in both themes** when creating new components
3. **Use `:global(.dark)` prefix** in CSS modules for dark mode styles
4. **Prefer Tailwind classes** for new components
5. **Check contrast ratios** for accessibility

## 📚 Files Modified

- `src/contexts/ThemeContext.tsx` - Theme state management
- `src/components/ui/theme-toggle.tsx` - Toggle components
- `src/index.css` - Color variable definitions
- `src/main.tsx` - ThemeProvider integration
- `src/components/dashboard/site-header.tsx` - Header toggle
- `src/pages/LoginPage.tsx` - Login page toggle
- All CSS modules - Dark mode styles added

Enjoy your beautiful light/dark mode! 🌙☀️
