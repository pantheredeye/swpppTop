import { ToastProvider } from 'src/components/ui/Toast'
import { TooltipProvider } from 'src/components/ui/Tooltip'

export function UIProviders({ children }) {
  return (
    <TooltipProvider>
      <ToastProvider>{children}</ToastProvider>
    </TooltipProvider>
  )
}
