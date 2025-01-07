import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => null,
})

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  // Initialize state from localStorage if available, otherwise use defaultTheme
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're in the browser and have localStorage available
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('theme') as Theme
      return savedTheme || defaultTheme
    }
    return defaultTheme
  })

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    // If no theme is saved, use system preference
    if (!localStorage.getItem('theme')) {
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    // Update the HTML class and save to localStorage when theme changes
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
