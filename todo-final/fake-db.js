// ============================================================
// MODEL (The M in MVC)
// Responsible for: data storage and data access logic
// The rest of the app never touches `todos` directly —
// it always goes through these exported functions.
// ============================================================

let todos = [];
let nextId = 1;

// --- READ ---

export function getAllTodos() {
  return todos;
}

export function getTodoById(id) {
  return todos.find((todo) => todo.id === id);
}

// BONUS: search by title (case-insensitive)
export function searchTodos(query) {
  return todos.filter((todo) =>
    todo.title.toLowerCase().includes(query.toLowerCase())
  );
}

// --- WRITE ---

export function createTodo(title) {
  const newTodo = {
    id: String(nextId++),
    title,
    isCompleted: false,
  };
  todos.push(newTodo);
  return newTodo;
}

// Partial update — only change fields that were provided
export function updateTodo(id, fields) {
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) return null;

  if (fields.title !== undefined) todo.title = fields.title;
  if (fields.isCompleted !== undefined) todo.isCompleted = fields.isCompleted;

  return todo;
}

export function deleteTodo(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}
