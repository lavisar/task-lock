'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryCLient] = useState(() => new QueryClient())

  return <QueryClientProvider client={queryCLient}>{children}</QueryClientProvider>
}
