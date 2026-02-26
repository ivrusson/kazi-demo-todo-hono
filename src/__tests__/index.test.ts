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

describe('DELETE /todos/:id endpoint', () => {
  beforeEach(() => {
    resetTodos()
  })

  it('should delete a todo and return 204', async () => {
    const createRes = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Todo to delete' }),
    })
    
    const createBody = await createRes.json()
    const todoId = createBody.data.id
    
    const deleteRes = await app.request(`/todos/${todoId}`, {
      method: 'DELETE',
    })
    
    expect(deleteRes.status).toBe(204)
  })

  it('should return 404 when deleting non-existent todo', async () => {
    const res = await app.request('/todos/non-existent-id', {
      method: 'DELETE',
    })
    
    expect(res.status).toBe(404)
    
    const body = await res.json()
    expect(body).toHaveProperty('error')
    expect(body.error).toBe('Todo not found')
  })

  it('should actually remove the todo from the list', async () => {
    const createRes = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Todo to delete' }),
    })
    
    const createBody = await createRes.json()
    const todoId = createBody.data.id
    
    await app.request(`/todos/${todoId}`, {
      method: 'DELETE',
    })
    
    const getRes = await app.request('/todos')
    const getBody = await getRes.json()
    
    const deletedTodo = getBody.data.find((todo: { id: string }) => todo.id === todoId)
    expect(deletedTodo).toBeUndefined()
  })
})

describe('PATCH /todos/:id endpoint', () => {
  beforeEach(() => {
    resetTodos()
  })

  it('should update todo title successfully', async () => {
    const createRes = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Original Title' }),
    })
    
    const createBody = await createRes.json()
    const todoId = createBody.data.id
    
    const patchRes = await app.request(`/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Updated Title' }),
    })
    
    expect(patchRes.status).toBe(200)
    
    const body = await patchRes.json()
    expect(body.data.title).toBe('Updated Title')
    expect(body.data.completed).toBe(false)
  })

  it('should update todo completed status successfully', async () => {
    const createRes = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Todo to complete' }),
    })
    
    const createBody = await createRes.json()
    const todoId = createBody.data.id
    
    const patchRes = await app.request(`/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true }),
    })
    
    expect(patchRes.status).toBe(200)
    
    const body = await patchRes.json()
    expect(body.data.completed).toBe(true)
  })

  it('should update both title and completed simultaneously', async () => {
    const createRes = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Original' }),
    })
    
    const createBody = await createRes.json()
    const todoId = createBody.data.id
    
    const patchRes = await app.request(`/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Updated', completed: true }),
    })
    
    expect(patchRes.status).toBe(200)
    
    const body = await patchRes.json()
    expect(body.data.title).toBe('Updated')
    expect(body.data.completed).toBe(true)
  })

  it('should return 404 for non-existent todo', async () => {
    const res = await app.request('/todos/non-existent-id', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Updated' }),
    })
    
    expect(res.status).toBe(404)
    
    const body = await res.json()
    expect(body).toHaveProperty('error')
    expect(body.error).toBe('Todo not found')
  })

  it('should return 400 for invalid input (empty title)', async () => {
    const createRes = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Todo' }),
    })
    
    const createBody = await createRes.json()
    const todoId = createBody.data.id
    
    const patchRes = await app.request(`/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: '' }),
    })
    
    expect(patchRes.status).toBe(400)
    
    const body = await patchRes.json()
    expect(body).toHaveProperty('success')
    expect(body.success).toBe(false)
  })

  it('should return 400 for invalid input (whitespace title)', async () => {
    const createRes = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Todo' }),
    })
    
    const createBody = await createRes.json()
    const todoId = createBody.data.id
    
    const patchRes = await app.request(`/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: '   ' }),
    })
    
    expect(patchRes.status).toBe(400)
  })

  it('should trim whitespace from title on update', async () => {
    const createRes = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Todo' }),
    })
    
    const createBody = await createRes.json()
    const todoId = createBody.data.id
    
    const patchRes = await app.request(`/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: '  Trimmed Title  ' }),
    })
    
    expect(patchRes.status).toBe(200)
    
    const body = await patchRes.json()
    expect(body.data.title).toBe('Trimmed Title')
  })

  it('should return 400 for invalid completed type', async () => {
    const createRes = await app.request('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Todo' }),
    })
    
    const createBody = await createRes.json()
    const todoId = createBody.data.id
    
    const patchRes = await app.request(`/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: 'yes' }),
    })
    
    expect(patchRes.status).toBe(400)
  })
})