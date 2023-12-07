import { checkSubcription } from '@/lib/subcription'
import { Info } from '../_component/info'
import { Separator } from '@/components/ui/separator'
import { SubcriptionButton } from './_component/subcription-butto'

const BillingPage = async () => {
  const isPro = await checkSubcription()
  return (
    <div className='w-full'>
      <Info isPro={isPro} />
      <Separator className='my-2' />
      <SubcriptionButton isPro={isPro} />
    </div>
  )
}

export default BillingPage
