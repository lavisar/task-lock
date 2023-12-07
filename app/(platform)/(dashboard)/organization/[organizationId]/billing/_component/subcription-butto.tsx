'use client'

import { stripeRedirect } from '@/actions/stripe-redirect'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { useProModal } from '@/hooks/use-pro-modal'
import { toast } from 'sonner'

interface SubcriptionButtonProps {
  isPro: boolean
}

export const SubcriptionButton = ({ isPro }: SubcriptionButtonProps) => {
  const proModal = useProModal()
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: data => {
      window.location.href = data
    },
    onError: error => {
      toast.error(error)
    }
  })
  const onClick = () => {
    if (isPro) {
      execute({})
    } else {
      proModal.onOpen
    }
  }

  return (
    <Button onClick={onClick} disabled={isLoading} variant='primary'>
      {isPro ? 'Manage subcription' : 'Upgrade to pro'}
    </Button>
  )
}
