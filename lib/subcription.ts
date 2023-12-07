import { auth } from '@clerk/nextjs'

import { db } from '@/lib/db'

const DAY_IN_MS = 84_400_000

export const checkSubcription = async () => {
  const { orgId } = auth()

  if (!orgId) {
    return false
  }

  const orgSubcription = await db.orgSubscription.findUnique({
    where: {
      orgId
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true
    }
  })

  if (!orgSubcription) {
    return false
  }

  const idValid =
    orgSubcription.stripePriceId &&
    orgSubcription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

  return !!idValid
}
