import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'

// Check localStorage for saved theme preference, default to light mode
const savedTheme = localStorage.getItem('theme')
// Only apply dark mode if explicitly saved as 'dark'
// System preference is kept in logic but commented out for now
if (savedTheme === 'dark') { // || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
