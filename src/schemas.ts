import { z } from 'zod'

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),
  completed: z.boolean().optional(),
})

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>