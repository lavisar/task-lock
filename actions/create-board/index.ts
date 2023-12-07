'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { db } from '@/lib/db'
import { CreateAuditLog } from '@/lib/create-audit-log'
import { createSafeAction } from '@/lib/create-safe-action'

import { CreateBoard } from './schema'
import { InputType, ReturnType } from './type'
import { hasAvailabeCount, incrementAvailableCount } from '@/lib/org-limit'
import { checkSubcription } from '@/lib/subcription'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const canCreate = await hasAvailabeCount()
  const isPro = await checkSubcription()

  if (!canCreate && !isPro) {
    return {
      error: 'You have reached your limit of free boards. Please upgrade to create more'
    }
  }

  const { title, image } = data

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] = image.split('|')

  // console.log({ imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName })

  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
    return {
      error: 'Missing field. Failed to create board.'
    }
  }

  let board
  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML
      }
    })

    if (!isPro) {
      await incrementAvailableCount()
    }

    await CreateAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE
    })
  } catch (error) {
    return {
      error: 'Failed to create board'
    }
  }
  revalidatePath('/board/${board.id}')
  return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)
