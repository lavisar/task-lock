import { Suspense } from 'react'

import { Separator } from '@/components/ui/separator'
import { Info } from './_component/info'
import { BoardList } from './_component/board-list'
import { checkSubcription } from '@/lib/subcription'

const organizationIdPage = async () => {
  const isPro = await checkSubcription()
  return (
    <div className='w-full mb-20'>
      <Info isPro={isPro} />
      <Separator className='my-4' />
      <div className='px-2 md:px-4'>
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  )
}

export default organizationIdPage
