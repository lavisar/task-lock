'use server'

import { auth } from '@clerk/nextjs'
import { InputType, ReturnType } from './type'
import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'
import { revalidatePath } from 'next/cache'
import { CreateBoard } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title, image } = data

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] = image.split('|')

  console.log({ imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName })

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
  } catch (error) {
    return {
      error: 'Failed to create board'
    }
  }
  revalidatePath('/board/${board.id}')
  return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)
