import { Hono } from 'hono'
import { getTodos } from './store'

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

export { app }