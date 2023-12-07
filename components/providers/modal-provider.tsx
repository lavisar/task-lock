'use client'

import { CardModal } from '@/components/modal/card-modal'
import { useEffect, useState } from 'react'
import { ProModal } from '@/components/modal/pro-modal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  return (
    <>
      <CardModal />
      <ProModal />
    </>
  )
}
