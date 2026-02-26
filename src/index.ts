import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { getTodos, createTodo, updateTodo, deleteTodo } from './store'
import { createTodoSchema, updateTodoSchema } from './schemas'

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

app.patch('/todos/:id', zValidator('json', updateTodoSchema), (c) => {
  const id = c.req.param('id')
  const validated = c.req.valid('json')
  const updatedTodo = updateTodo(id, validated)
  
  if (!updatedTodo) {
    return c.json({ error: 'Todo not found' }, 404)
  }
  
  return c.json({ data: updatedTodo }, 200)
})

app.delete('/todos/:id', (c) => {
  const id = c.req.param('id')
  const deleted = deleteTodo(id)
  
  if (!deleted) {
    return c.json({ error: 'Todo not found' }, 404)
  }
  
  return c.body(null, 204)
})

export { app }