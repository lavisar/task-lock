import { z } from 'zod'

export const UpdateBoard = z.object({
  title: z.optional(
    z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title is required'
      })
      .min(3, {
        message: 'Title is too short'
      })
  ),
  image: z.optional(
    z.string({
      required_error: 'Image is required',
      invalid_type_error: 'Image is required'
    })
  ),
  id: z.string()
})
