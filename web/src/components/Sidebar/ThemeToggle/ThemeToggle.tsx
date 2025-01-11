import { Moon, Sun } from 'lucide-react'

import { Button } from 'src/components/ui/Button'
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/ui/Tooltip'
import { useTheme } from 'src/context/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <Tooltip>
        <TooltipTrigger asChild>
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={20}>
        {theme === 'dark' ? 'Toggle Light Mode On' : 'Toggle Dark Mode On'}
      </TooltipContent>
      </Tooltip>
    </Button>
  )
}
