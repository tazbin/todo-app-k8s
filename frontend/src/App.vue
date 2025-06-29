<template>
  <div class="app">
    <h1>📝 Todo App</h1>
    <hr>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque eius cupiditate quibusdam, sit nobis delectus natus id, earum commodi illo sunt, fugit optio beatae. Dolor officia odio doloremque magnam incidunt?

    <div class="header-actions">
      <p v-if="todosData.cache">
        Cache: <span :class="`cache-${todosData.cache}`">{{ todosData.cache }}</span>
      </p>
      <button class="refresh-btn" @click="fetchTodos">🔄 Refresh</button>
    </div>

    <form @submit.prevent="addTodo" class="todo-form">
      <input
        type="text"
        v-model="newTodo"
        placeholder="Enter a new todo..."
        required
      />
      <button type="submit">Add</button>
    </form>

    <ul class="todo-list">
      <li v-for="todo in todosData.todos" :key="todo.id" class="todo-item">
        <div class="todo-details">
          <h3>{{ todo.title }}</h3>
          <p class="meta">
            Created: {{ formatDate(todo.createdAt) }} ·
            <span :class="['status', todo.completed ? 'completed' : 'pending']">
              {{ todo.completed ? 'Completed' : 'Pending' }}
            </span>
          </p>
        </div>
        <button @click="confirmDelete(todo)">🗑</button>
      </li>
    </ul>

    <p v-if="loading" class="info-msg">Loading todos...</p>
    <p v-if="error" class="error-msg">{{ error }}</p>

    <!-- Custom Delete Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-box">
        <h2>⚠️ Confirm Delete</h2>
        <p>Are you sure you want to delete <strong>{{ selectedTodo?.title }}</strong>?</p>
        <div class="modal-actions">
          <button @click="deleteTodo" class="btn-danger">Yes, Delete</button>
          <button @click="cancelDelete" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todosData: { todos: [] },
      newTodo: '',
      loading: false,
      error: null,
      showConfirmModal: false,
      selectedTodo: null
    };
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateStr).toLocaleString(undefined, options);
    },
    async fetchTodos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}/todos`);
        const data = await response.json();
        this.todosData = data;
      } catch (err) {
        this.error = 'Failed to load todos';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async addTodo() {
      if (!this.newTodo.trim()) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}/todos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: this.newTodo })
        });

        const createdTodo = await response.json();
        this.todosData.todos.push(createdTodo);
        this.newTodo = '';
      } catch (err) {
        this.error = 'Failed to add todo';
        console.error(err);
      }
    },
    confirmDelete(todo) {
      this.selectedTodo = todo;
      this.showConfirmModal = true;
    },
    async deleteTodo() {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}/todos/${this.selectedTodo.id}`, {
          method: 'DELETE'
        });
        this.todosData.todos = this.todosData.todos.filter(todo => todo.id !== this.selectedTodo.id);
      } catch (err) {
        this.error = 'Failed to delete todo';
        console.error(err);
      } finally {
        this.showConfirmModal = false;
        this.selectedTodo = null;
      }
    },
    cancelDelete() {
      this.showConfirmModal = false;
      this.selectedTodo = null;
    }
  }
};
</script>

<style>
:root {
  --bg-light: #f4f7f8;
  --bg-white: #ffffff;
  --border-color: #dcdcdc;
  --primary: #6366f1;
  --danger: #ef4444;
  --success: #10b981;
  --text-dark: #1f2937;
  --text-light: #6b7280;
}

body {
  background: var(--bg-light);
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
}

.app {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  background-color: var(--bg-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

h1 {
  text-align: center;
  color: var(--primary);
  margin-bottom: 10px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-light);
}

.cache-hit {
  color: var(--success);
  font-weight: bold;
}

.cache-miss {
  color: var(--danger);
  font-weight: bold;
}

.refresh-btn {
  background-color: transparent;
  border: 1px solid var(--primary);
  padding: 5px 10px;
  border-radius: 6px;
  color: var(--primary);
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn:hover {
  background-color: var(--primary);
  color: white;
}

.todo-form {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.todo-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 16px;
}

.todo-form button {
  padding: 10px 18px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.todo-form button:hover {
  background-color: #4f46e5;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-white);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 14px;
  transition: box-shadow 0.2s;
}

.todo-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.todo-details h3 {
  margin: 0 0 4px 0;
  font-size: 17px;
  color: var(--text-dark);
}

.meta {
  font-size: 13px;
  color: var(--text-light);
}

.status {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.completed {
  background-color: #e7f9ef;
  color: var(--success);
}

.pending {
  background-color: #fef2f2;
  color: var(--danger);
}

.todo-item button {
  background-color: transparent;
  border: none;
  font-size: 18px;
  color: var(--danger);
  cursor: pointer;
}

.todo-item button:hover {
  color: #b91c1c;
}

.error-msg {
  color: var(--danger);
  text-align: center;
  font-weight: bold;
}

.info-msg {
  text-align: center;
  color: var(--text-light);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-box {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.2);
}

.modal-box h2 {
  margin-bottom: 10px;
  color: var(--danger);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.btn-danger {
  background-color: var(--danger);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #c53030;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>
