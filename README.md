# To-Do Hono

A lightweight, fast, and type-safe To-Do REST API built with [Hono](https://hono.dev/) - a modern web framework for Cloudflare Workers, Deno, Bun, and Node.js.

## Features

- **Fast & Lightweight**: Built on Hono, optimized for performance
- **Type-Safe**: Full TypeScript support with strict mode enabled
- **Validation**: Request validation using Zod schemas
- **In-Memory Storage**: Simple data persistence without database dependencies
- **Well-Tested**: Comprehensive test coverage with Vitest
- **RESTful API**: Clean, conventional REST endpoints

## Prerequisites

- Node.js v18.0.0 or higher
- npm, yarn, or pnpm

## Installation

Clone the repository and install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run start` | Start production server |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run typecheck` | Run TypeScript type checking |

## Quick Start

Start the development server:

```bash
npm run dev
```

The server will start at `http://localhost:3000` (default Hono port).

## API Documentation

### Endpoints Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Health check endpoint |
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create a new todo |
| PATCH | `/todos/:id` | Update a todo |
| DELETE | `/todos/:id` | Delete a todo |

---

### GET /

Returns a welcome message.

**Response:**
```json
{
  "message": "Welcome to To-Do Hono API"
}
```

**Example:**
```bash
curl http://localhost:3000/
```

---

### GET /health

Returns the API health status with a timestamp.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Example:**
```bash
curl http://localhost:3000/health
```

---

### GET /todos

Returns a list of all todos.

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "title": "Learn Hono",
      "completed": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "2",
      "title": "Build a REST API",
      "completed": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3000/todos
```

---

### POST /todos

Creates a new todo item.

**Request Body:**
```json
{
  "title": "My new task"
}
```

**Validation Rules:**
- `title`: Required, non-empty string (whitespace is trimmed)

**Response (201 Created):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My new task",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "issues": [
      {
        "message": "Title is required"
      }
    ]
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "My new task"}'
```

---

### PATCH /todos/:id

Updates an existing todo item.

**Request Body:**
```json
{
  "title": "Updated task title",
  "completed": true
}
```

**Validation Rules:**
- `title`: Optional, non-empty string (whitespace is trimmed)
- `completed`: Optional, boolean

**Response (200 OK):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Updated task title",
    "completed": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Todo not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "issues": [
      {
        "message": "Title is required"
      }
    ]
  }
}
```

**Examples:**
```bash
# Update title only
curl -X PATCH http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated task"}'

# Mark as completed
curl -X PATCH http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Update both fields
curl -X PATCH http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"title": "Completed task", "completed": true}'
```

---

### DELETE /todos/:id

Deletes a todo item.

**Response (204 No Content):**
No response body.

**Error Response (404 Not Found):**
```json
{
  "error": "Todo not found"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000
```

## TypeScript Types

### Todo

```typescript
interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}
```

### CreateTodoDto

```typescript
interface CreateTodoDto {
  title: string
}
```

### UpdateTodoDto

```typescript
interface UpdateTodoDto {
  title?: string
  completed?: boolean
}
```

## Validation Schemas

The API uses Zod for request validation:

### CreateTodoInput

```typescript
const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
})
```

### UpdateTodoInput

```typescript
const updateTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),
  completed: z.boolean().optional(),
})
```

## Error Handling

The API returns consistent error responses:

### 400 Bad Request

Returned when request validation fails. The response includes details about validation errors.

```json
{
  "success": false,
  "error": {
    "issues": [
      {
        "path": ["title"],
        "message": "Title is required"
      }
    ]
  }
}
```

### 404 Not Found

Returned when a requested resource does not exist.

```json
{
  "error": "Todo not found"
}
```

## Project Structure

```
todo-hono/
├── src/
│   ├── __tests__/
│   │   ├── index.test.ts    # API endpoint tests
│   │   └── store.test.ts    # Store function tests
│   ├── index.ts             # Application entry point & routes
│   ├── schemas.ts           # Zod validation schemas
│   ├── store.ts             # In-memory data store
│   └── types.ts             # TypeScript interfaces
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

| File | Purpose |
|------|---------|
| `src/index.ts` | Main application with route definitions and handlers |
| `src/types.ts` | TypeScript interfaces for Todo and DTOs |
| `src/schemas.ts` | Zod validation schemas for request validation |
| `src/store.ts` | In-memory storage with CRUD operations |
| `src/__tests__/index.test.ts` | Comprehensive API tests |
| `src/__tests__/store.test.ts` | Unit tests for store functions |

## Development

### Running Locally

```bash
# Start development server with hot reload
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Dependencies

### Production

- **hono** (^4.6.0) - Fast web framework
- **@hono/zod-validator** (^0.7.6) - Zod middleware for Hono
- **zod** (^4.3.6) - TypeScript-first schema validation

### Development

- **typescript** (^5.6.0) - TypeScript compiler
- **tsx** (^4.19.0) - TypeScript execution engine
- **vitest** (^2.1.0) - Testing framework
- **@vitest/coverage-v8** (^2.1.0) - Code coverage
- **@types/node** (^22.0.0) - Node.js type definitions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and ensure tests pass: `npm run test`
4. Run type checking: `npm run typecheck`
5. Commit your changes: `git commit -m 'Add my feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Open a Pull Request

## License

MIT
