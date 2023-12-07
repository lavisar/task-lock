import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface HintProps {
  children: React.ReactNode
  description: string
  side?: 'left' | 'right' | 'top' | 'bottom'
  sideOffSet?: number
}

export const Hint = ({ children, description, side = 'bottom', sideOffSet = 0 }: HintProps) => {
  return (
    <div>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent
            sideOffset={sideOffSet}
            side={side}
            className='text-xs max-w-[220px] break-words'
          >
            {description}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
