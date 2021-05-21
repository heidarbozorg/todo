const express = require('express');
const router = express.Router();
const subtasks = require('../logic/subtasks');

/**
 * Insert a new subtask
 */
router.post('/', async (req, res) =>{
    const result = await subtasks.insert(req.body);
    res.status(result.status).send(result.body);
});

/**
 * Update a subtask and it's parent
 */
router.put('/:todo_id', async (req, res) =>{
    const result = await subtasks.update(req.params.todo_id, req.body);
    res.status(result.status).send(result.body);    
});

module.exports = router;