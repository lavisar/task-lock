import { auth } from '@clerk/nextjs'

import { db } from '@/lib/db'
import { MAX_FREE_BOARDS } from '@/constant/boards'
import { redirect } from 'next/navigation'

export const incrementAvailableCount = async () => {
  const { orgId } = auth()

  if (!orgId) {
    throw new Error('Unauthorized')
  }
  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId
    }
  })

  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count + 1 }
    })
  } else {
    await db.orgLimit.create({
      data: { orgId, count: 1 }
    })
  }
}

export const decreaseAvailableCount = async () => {
  const { orgId } = auth()

  if (!orgId) {
    throw new Error('Unauthorized')
  }
  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId
    }
  })

  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 }
    })
  } else {
    await db.orgLimit.create({
      data: { orgId, count: 1 }
    })
  }
}

export const hasAvailabeCount = async () => {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error('unauthorized')
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId }
  })

  if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
    return true
  } else {
    return false
  }
}

export const getAvailabeCount = async () => {
  const { orgId } = auth()

  if (!orgId) {
    return 0
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId }
  })

  if (!orgLimit) {
    return 0
  }

  return orgLimit.count
}