import { describe, it, expect } from 'vitest'
import { app } from '../index'
import { testClient } from 'hono/testing'

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