const express = require('express');
const router = express.Router();
const todo = require('../logic/todo');

/**
 * Get all todo records and it's child
 */
router.get('/', async (req, res) => {
    const result = await todo.getAll(req.query.startIndex, req.query.pageSize);
    res.status(result.status).send(result.body);
});

/**
 * Add a new todo
 */
router.post('/', async (req, res) => {
    const result = await todo.insert(req.body);
    res.status(result.status).send(result.body);
});

/**
 * Update a todo and it's child
 */
router.put('/:id', async (req, res) => {
    const result = await todo.update(req.params.id, req.body);
    res.status(result.status).send(result.body);
});


module.exports = router;