import type { Todo } from './types'

let todos: Todo[] = [
  {
    id: '1',
    title: 'Learn Hono',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Build a REST API',
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

export function getTodos(): Todo[] {
  return todos
}

export function getTodoById(id: string): Todo | undefined {
  return todos.find((todo) => todo.id === id)
}

export function createTodo(title: string): Todo {
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  }
  todos.push(newTodo)
  return newTodo
}

export function updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | undefined {
  const todo = todos.find((todo) => todo.id === id)
  if (!todo) return undefined
  
  if (updates.title !== undefined) todo.title = updates.title
  if (updates.completed !== undefined) todo.completed = updates.completed
  
  return todo
}

export function deleteTodo(id: string): boolean {
  const index = todos.findIndex((todo) => todo.id === id)
  if (index === -1) return false
  
  todos.splice(index, 1)
  return true
}

export function resetTodos(): void {
  todos = []
}