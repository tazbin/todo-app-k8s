<template>
  <div class="app">
    <h1>Todo App</h1>

    <form @submit.prevent="addTodo" class="todo-form">
      <input
        type="text"
        v-model="newTodo"
        placeholder="Enter a new todo..."
        required
      />
      <button type="submit">Add</button>
    </form>

    <pre>{{ todos }}</pre>

    <ul class="todo-list">
      <li v-for="todo in todosData.todos" :key="todo.id" class="todo-item">
        <span>{{ todo.title }}</span>
        <button @click="deleteTodo(todo.id)">❌</button>
      </li>
    </ul>

    <p v-if="loading">Loading todos...</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todosData: {},
      newTodo: '',
      loading: false,
      error: null
    };
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
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
    async deleteTodo(id) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}/todos/${id}`, {
          method: 'DELETE'
        });
        this.todosData.todos = this.todosData.todos.filter(todo => todo.id !== id);
      } catch (err) {
        this.error = 'Failed to delete todo';
        console.error(err);
      }
    }
  }
};
</script>

<style>
.app {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-family: sans-serif;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  color: #333;
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-form input {
  flex: 1;
  padding: 8px;
  font-size: 16px;
}

.todo-form button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-form button:hover {
  background-color: #45a049;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: white;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.todo-item button {
  background-color: #f44336;
  border: none;
  color: white;
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 4px;
}

.todo-item button:hover {
  background-color: #d32f2f;
}

.error {
  color: red;
  text-align: center;
}
</style>
