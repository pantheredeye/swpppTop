import { TooltipProvider } from 'src/components/ui/Tooltip'
import { ToastProvider } from 'src/components/ui/Toast'

export function UIProviders({ children }) {
  return (
    <TooltipProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </TooltipProvider>
  )
}
