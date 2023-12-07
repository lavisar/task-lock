import { Separator } from '@/components/ui/separator'
import { ActivityList } from './_component/activity-list'
import { Suspense } from 'react'
import { Info } from '../_component/info'
import { checkSubcription } from '@/lib/subcription'

const ActivityPage = async () => {
  const isPro = await checkSubcription()
  return (
    <div className='w-full'>
      <Info isPro={isPro} />
      <Separator className='my-2' />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  )
}
export default ActivityPage
