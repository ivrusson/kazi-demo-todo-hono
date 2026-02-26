import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { getTodos, createTodo } from './store'
import { createTodoSchema } from './schemas'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'Welcome to To-Do Hono API' })
})

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/todos', (c) => {
  const todos = getTodos()
  return c.json({ data: todos })
})

app.post('/todos', zValidator('json', createTodoSchema), (c) => {
  const validated = c.req.valid('json')
  const newTodo = createTodo(validated.title)
  return c.json({ data: newTodo }, 201)
})

export { app }