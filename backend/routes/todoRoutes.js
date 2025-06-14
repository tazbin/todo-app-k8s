const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const { sequelize } = require('../db/connection');
const redis = require('../redis/client');

const TODO_LIST_CACHE_KEY = 'todos:all';

// Health check endpoint
router.get('/health', async (req, res) => {
    let isApiHealthy = true;
    let isDbHealthy = true;
    let isRedisHealthy = true;
    let message = 'All systems operational';

    // Check DB
    try {
        await sequelize.authenticate();
    } catch (error) {
        isDbHealthy = false;
        message = 'One or more systems have issues';
    }

    // Check Redis
    try {
        const redisPing = await redis.ping();
        if (redisPing !== 'PONG') {
            isRedisHealthy = false;
            message = 'One or more systems have issues';
        }
    } catch (error) {
        isRedisHealthy = false;
        message = 'One or more systems have issues';
    }

    const overallStatus = isApiHealthy && isDbHealthy && isRedisHealthy ? 'ok' : 'error';

    res.status(overallStatus === 'ok' ? 200 : 500).json({
        message,
        api_status: isApiHealthy ? 'ok' : 'error',
        db_status: isDbHealthy ? 'ok' : 'error',
        redis_status: isRedisHealthy ? 'ok' : 'error',
        environment: process.env.APP_ENVIRONMENT || 'unknown'
    });
});

// Create a new todo
router.post('/todos', async (req, res) => {
    const { title } = req.body;
    try {
        const newTodo = await Todo.create({ title, completed: false });
        await redis.del(TODO_LIST_CACHE_KEY); // Invalidate cache
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// List all todos with Redis cache
router.get('/todos', async (req, res) => {
    try {
        let todos = [];
        const cachedTodos = await redis.get(TODO_LIST_CACHE_KEY);
        if (cachedTodos) {
            todos = JSON.parse(cachedTodos)
        } else {
            todos = await Todo.findAll();
            await redis.set(TODO_LIST_CACHE_KEY, JSON.stringify(todos), 'EX', 60); // Cache for 60 seconds
        }
        res.status(200).json({
            cache: cachedTodos ? 'hit' : 'miss',
            todos
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve todos' });
    }
});

// Delete a todo by id
router.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Todo.destroy({ where: { id } });
        if (deleted) {
            await redis.del(TODO_LIST_CACHE_KEY); // Invalidate cache
            res.status(200).json({ message: `Todo with id ${id} deleted successfully.` });
        } else {
            res.status(404).json({ error: `Todo with id ${id} not found.` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

module.exports = router;