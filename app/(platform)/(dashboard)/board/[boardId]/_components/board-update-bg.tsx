'use client'
import { Button } from '@/components/ui/button'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAction } from '@/hooks/use-action'
import { AlertCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ElementRef, useRef } from 'react'
import { toast } from 'sonner'

import { updateBoard } from '@/actions/update-board'
import { FromPicker } from '@/components/form/form-picker'
import { FormSubmit } from '@/components/form/form-submit'
import { useProModal } from '@/hooks/use-pro-modal'

interface BoardUpdateBackgoundProps {
  children: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  id: string
}

export const BoardUpdateBackgound = ({
  children,
  side = 'left',
  align,
  sideOffset = 0,
  id
}: BoardUpdateBackgoundProps) => {
  const router = useRouter()
  const proModal = useProModal()
  const closeRef = useRef<ElementRef<'button'>>(null)

  const { execute, fieldErrors } = useAction(updateBoard, {
    onSuccess: data => {
      toast.success(`Board's background updated!`)
      closeRef.current?.click()
    },
    onError: error => {
      toast.error(error)
    }
  })
  const onSubmit = (formData: FormData) => {
    const image = formData.get('image') as string
    execute({ image, id })
  }
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align={align} className='w-80 pt-3' side={side} sideOffset={sideOffset}>
        <div className='text-sm font-medium text-center text-neutral-600 pb-4'>Choose an image</div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            variant='ghost'
            className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
          >
            <X className='h-4 w-4' />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <FromPicker id='image' errors={fieldErrors} />
          </div>
          <p className='flex text-red-500 text-muted-foreground'>
            <AlertCircle className='h-6 w-6' />
            <span className='text-xs pl-2'>
              This action will change your board background and cannot be undo.
            </span>
          </p>
          <FormSubmit className='w-full dark:bg-slate-500'>Save</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}
