import { describe, it, expect, beforeEach } from 'vitest'
import { createTodo, getTodos, resetTodos } from '../store'

describe('createTodo', () => {
  beforeEach(() => {
    resetTodos()
  })

  it('should create a new todo with the given title', () => {
    const title = 'Test Todo'
    const todo = createTodo(title)
    
    expect(todo.title).toBe(title)
    expect(todo.completed).toBe(false)
    expect(todo.id).toBeDefined()
    expect(todo.createdAt).toBeDefined()
  })

  it('should generate a valid UUID for id', () => {
    const todo = createTodo('Test Todo')
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(todo.id).toMatch(uuidRegex)
  })

  it('should set createdAt to a valid ISO date string', () => {
    const todo = createTodo('Test Todo')
    
    const date = new Date(todo.createdAt)
    expect(date).toBeInstanceOf(Date)
    expect(date.toISOString()).toBe(todo.createdAt)
  })

  it('should add the new todo to the todos list', () => {
    createTodo('First Todo')
    createTodo('Second Todo')
    
    const todos = getTodos()
    expect(todos).toHaveLength(2)
    expect(todos[0].title).toBe('First Todo')
    expect(todos[1].title).toBe('Second Todo')
  })

  it('should return the created todo', () => {
    const todo = createTodo('Test Todo')
    const todos = getTodos()
    
    expect(todos).toContainEqual(todo)
  })
})