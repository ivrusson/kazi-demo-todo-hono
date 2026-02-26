import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../index'
import { testClient } from 'hono/testing'
import { resetTodos } from '../store'

describe('Root endpoint', () => {
  it('should return welcome message on GET /', async () => {
    const res = await app.request('/')
    
    expect(res.status).toBe(200)
    
    const body = await res.json()
    expect(body).toHaveProperty('message')
    expect(body.message).toBe('Welcome to To-Do Hono API')
  })
})

describe('Health endpoint', () => {
  it('should return status ok on GET /health', async () => {
    const res = await app.request('/health')
    
    expect(res.status).toBe(200)
    
    const body = await res.json()
    expect(body).toHaveProperty('status')
    expect(body.status).toBe('ok')
  })

  it('should return timestamp on GET /health', async () => {
    const res = await app.request('/health')
    
    const body = await res.json()
    expect(body).toHaveProperty('timestamp')
    expect(typeof body.timestamp).toBe('string')
    
    const timestamp = new Date(body.timestamp)
    expect(timestamp).toBeInstanceOf(Date)
  })
})

describe('Todos endpoint', () => {
  it('should return todos list on GET /todos', async () => {
    const res = await app.request('/todos')
    
    expect(res.status).toBe(200)
    
    const body = await res.json()
    expect(body).toHaveProperty('data')
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('should return todos with correct structure', async () => {
    const res = await app.request('/todos')
    
    const body = await res.json()
    expect(body.data.length).toBeGreaterThan(0)
    
    const todo = body.data[0]
    expect(todo).toHaveProperty('id')
    expect(todo).toHaveProperty('title')
    expect(todo).toHaveProperty('completed')
    expect(todo).toHaveProperty('createdAt')
    expect(typeof todo.id).toBe('string')
    expect(typeof todo.title).toBe('string')
    expect(typeof todo.completed).toBe('boolean')
    expect(typeof todo.createdAt).toBe('string')
  })
})

describe('POST /todos endpoint', () => {
  beforeEach(() => {
    resetTodos()
  })

  it('should create a new todo with valid input', async () => {
    const res = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'New Todo' }),
    })
    
    expect(res.status).toBe(201)
    
    const body = await res.json()
    expect(body).toHaveProperty('data')
    expect(body.data.title).toBe('New Todo')
    expect(body.data.completed).toBe(false)
    expect(body.data.id).toBeDefined()
    expect(body.data.createdAt).toBeDefined()
  })

  it('should return 400 when title is missing', async () => {
    const res = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    
    expect(res.status).toBe(400)
    
    const body = await res.json()
    expect(body).toHaveProperty('success')
    expect(body.success).toBe(false)
  })

  it('should return 400 when title is empty', async () => {
    const res = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: '' }),
    })
    
    expect(res.status).toBe(400)
    
    const body = await res.json()
    expect(body).toHaveProperty('success')
    expect(body.success).toBe(false)
  })

  it('should return 400 when title is whitespace only', async () => {
    const res = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: '   ' }),
    })
    
    expect(res.status).toBe(400)
    
    const body = await res.json()
    expect(body).toHaveProperty('success')
    expect(body.success).toBe(false)
  })

  it('should trim whitespace from title', async () => {
    const res = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: '  Trimmed Todo  ' }),
    })
    
    expect(res.status).toBe(201)
    
    const body = await res.json()
    expect(body.data.title).toBe('Trimmed Todo')
  })
})