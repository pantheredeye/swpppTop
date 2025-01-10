import { Search, Plus } from 'lucide-react'

import { Button } from 'src/components/ui/Button'
import { Input } from 'src/components/ui/Input'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from 'src/components/ui/Tooltip'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SearchInput = ({
  searchTerm,
  setSearchTerm,
  manualEmail,
  setManualEmail,
  handleAddEmail,
  handleKeyDown,
}) => (
  <div className="space-y-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search existing users..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <div className="flex gap-3">
      <Input
        placeholder="Or enter email address..."
        value={manualEmail}
        onChange={(e) => setManualEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleAddEmail}
            disabled={!manualEmail || !EMAIL_REGEX.test(manualEmail)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add email to invite queue</TooltipContent>
      </Tooltip>
    </div>
  </div>
)

export default SearchInput
