'use server'

import { auth, currentUser } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { CreateAuditLog } from '@/lib/create-audit-log'
import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/db'
import { StripeRedirect } from './schema'
import { InputType, ReturnType } from './type'
import { absoluteUrl } from '@/lib/utils'
import { stripe } from '@/lib/stripe'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  const user = await currentUser()

  if (!userId || !orgId || !user) {
    return {
      error: 'Unauthorized'
    }
  }

  const settingUrl = absoluteUrl(`/organization/${orgId}`)

  let url = ''

  try {
    const orgSubcription = await db.orgSubscription.findUnique({
      where: {
        orgId
      }
    })

    if (orgSubcription && orgSubcription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubcription.stripeCustomerId,
        return_url: settingUrl
      })
      url = stripeSession.url
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingUrl,
        cancel_url: settingUrl,
        payment_method_types: ['card'],
        mode: 'subscription',
        billing_address_collection: 'auto',
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: 'USD',
              product_data: {
                name: 'TaskLock Pro',
                description: 'Unlimited boards for your organisation'
              },
              unit_amount: 2000,
              recurring: {
                interval: 'month'
              }
            },
            quantity: 1
          }
        ],
        metadata: {
          orgId
        }
      })

      url = stripeSession.url || ''
    }
  } catch (error) {
    return {
      error: 'Something went wrong! Please try again.'
    }
  }
  revalidatePath(`/organization/${orgId}`)
  return { data: url }
}

export const stripeRedirect = createSafeAction(StripeRedirect, handler)
