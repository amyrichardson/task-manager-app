const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

//Routes
//GET, sending data back to client
router.get('/', (req, res) => {
    const queryText = `SELECT tasks.id, tasks.name, tasks.status, tasks.due_date, categories.category_name FROM tasks
    JOIN tasks_categories ON tasks_categories.task_id = tasks.id
    JOIN categories ON tasks_categories.category_id = categories.id
    ORDER BY tasks.due_date`
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        }) //end then
        .catch((err) => {
            res.sendStatus(500);
        }) //end catch
}) //end get

//POST, receiving new task from client
router.post('/', (req, res) => {
    const taskQuery = 'INSERT INTO tasks (name, due_date) VALUES ($1, $2) RETURNING id';
    pool.query(taskQuery, [req.body.taskName, req.body.dueDate])
        .then((result) => {
            const taskId = result.rows[0].id;
            const categoryQuery = 'SELECT id FROM categories WHERE category_name = $1';
            pool.query(categoryQuery, [req.body.category])
            .then((result) => {
                const categoryId = result.rows[0].id;
                const junctionQuery = `INSERT INTO tasks_categories (task_id, category_id) VALUES ($1, $2)`
                pool.query(junctionQuery, [taskId, categoryId])
                .then((result) => {
                    res.sendStatus(201);
                })
            })
        }) //end then
        .catch((err) => {
            res.sendStatus(500);
        }) //end catch
}); //end post

// DELETE, receiving task id from client to delete
router.delete('/:id', (req, res) => {
    const queryText = 'DELETE FROM tasks_categories WHERE task_id = $1';
    pool.query(queryText, [req.params.id])
        .then((result) => {
            const queryTwo = 'DELETE FROM tasks WHERE id = $1';
            pool.query(queryTwo, [req.params.id])
            .then((result) => {
                res.sendStatus(201);
            })
        }) //end then
        .catch((err) => {
            res.sendStatus(500);
        }) //end catch
}); //end delete

//PUT, updating task's status to complete
router.put('/:id', (req, res) => {
    const queryText = 'UPDATE tasks SET status = $1 WHERE id = $2';
    pool.query(queryText, [req.body.newStatus, req.params.id])
        .then((result) => {
            res.sendStatus(201);
        }) //end then
        .catch((err) => {
            res.sendStatus(500);
        }) //end catch
})//end put

module.exports = router;