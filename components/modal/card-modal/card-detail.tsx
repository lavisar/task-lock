'use client'

import { Calendar } from '@/components/ui/calendar'
import { AlignLeft, CalendarCheck2, MoreHorizontal, RefreshCw } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ElementRef, useRef, useState } from 'react'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

import { updateCard } from '@/actions/update-card'
import { FormSubmit } from '@/components/form/form-submit'
import { FormTextarea } from '@/components/form/form-textarea'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { useAction } from '@/hooks/use-action'
import { cn } from '@/lib/utils'
import { CardWithList } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface DescriptionProps {
  data: CardWithList
}

export const CardDetail = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient()
  const params = useParams()
  const { execute, fieldErrors, isLoading } = useAction(updateCard, {
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id]
      })
      queryClient.invalidateQueries({
        queryKey: ['card-logs', data.id]
      })
      toast.success(`Card "${data.title}" updated`)
      disableEditing()
    },
    onError: error => {
      toast.error(error)
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [date, setDate] = useState<Date>()
  const textareaRef = useRef<ElementRef<'textarea'>>(null)
  const formRef = useRef<ElementRef<'form'>>(null)
  const popoverRef = useRef<ElementRef<'div'>>(null)

  const enableEdting = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing()
    }
  }

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  const onUpdateDesc = (formData: FormData) => {
    const description = formData.get('description') as string
    const boardId = params.boardId as string

    execute({ description, boardId, id: data.id })
  }
  const onUpdateDueDay = () => {
    if (date) {
      const boardId = params.boardId as string
      const dueDay = date
      execute({ dueDay, boardId, id: data.id })
    }
  }
  useOnClickOutside(popoverRef, onUpdateDueDay)

  return (
    <div className='w-full'>
      <div className='w-full'>
        <div className='flex items-start gap-x-2'>
          <AlignLeft className='h-5 w-5 mt-0.5 text-neutral-700' />
          <p className='font-semibold text-neutral-700 mb-2'>Description</p>
        </div>
        {isEditing ? (
          <form ref={formRef} className='space-y-2' action={onUpdateDesc}>
            <FormTextarea
              id='description'
              className='w-full mt-2'
              placeholder='Add a more detailed description...'
              defaultValue={data.description || undefined}
              errors={fieldErrors}
              ref={textareaRef}
            />
            <div className='flex items-center gap-x-2'>
              <FormSubmit>Save</FormSubmit>
              <Button type='button' onClick={disableEditing} size='sm' variant='ghost'>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEdting}
            role='button'
            className={cn(
              'min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md',
              !data.description && 'text-muted-foreground'
            )}
          >
            {data.description || 'Add a more detailed description...'}
          </div>
        )}
      </div>
      <div className='flex items-start gap-x-2 mt-5'>
        <CalendarCheck2 className='h-5 w-5 mt-0.5 text-neutral-700' />
        <p className='font-semibold text-neutral-700 mb-2'>Due day</p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !date && !data.dueDay && 'text-muted-foreground'
            )}
          >
            {date ? (
              format(date, 'PPP')
            ) : (
              <span>{(data.dueDay && format(new Date(data.dueDay), 'PPP')) || 'Pick a date'}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent ref={popoverRef} className='w-auto p-0'>
          <Calendar
            disabled={isLoading}
            mode='single'
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

CardDetail.Skeleton = function DescriptionSkeleton() {
  return (
    <>
      <div className='flex items-start gap-x-3 w-full'>
        <Skeleton className='h-6 w-6 bg-neutral-200' />
        <div className='w-full'>
          <Skeleton className='w-24 h-6 mb-2 bg-neutral-200' />
          <Skeleton className='w-full h-[78px] mb-2 bg-neutral-200' />
        </div>
      </div>
      <div className='flex items-start gap-x-3 w-full'>
        <Skeleton className='h-6 w-6 bg-neutral-200' />
        <div className='w-1/2'>
          <Skeleton className='w-24 h-6 mb-2 bg-neutral-200' />
          <Skeleton className='w-full h-5 mb-2 bg-neutral-200' />
        </div>
      </div>
    </>
  )
}
