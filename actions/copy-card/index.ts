'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { CreateAuditLog } from '@/lib/create-audit-log'
import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/db'
import { CopyCard } from './schema'
import { InputType, ReturnType } from './type'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }
  const { id, boardId } = data
  let card
  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      }
    })
    if (!cardToCopy) {
      return { error: 'Card not found' }
    }
    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: 'desc' },
      select: { order: true }
    })
    const newOrder = lastCard ? lastCard.order + 1 : 1
    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - copy`,
        description: cardToCopy.description,
        dueDay: cardToCopy.dueDay,
        order: newOrder,
        listId: cardToCopy.listId
      }
    })
    await CreateAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE
    })
  } catch (error) {
    return {
      error: 'Failed to copy. Please try again'
    }
  }
  revalidatePath(`/board/${boardId}`)
  return { data: card }
}

export const copyCard = createSafeAction(CopyCard, handler)
