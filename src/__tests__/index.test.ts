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