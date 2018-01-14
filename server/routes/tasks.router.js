const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

//Routes
//GET, sending data back to client
router.get('/', (req, res) => {
    const queryText = 'SELECT * FROM tasks'
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
    const queryText = 'INSERT INTO tasks (name) VALUES ($1)';
    pool.query(queryText, [req.body.taskName])
        .then((result) => {
            res.sendStatus(201);
        }) //end then
        .catch((err) => {
            res.sendStatus(500);
        }) //end catch
}); //end post

// DELETE, receiving task id from client to delete
router.delete('/:id', (req, res) => {
    const queryText = 'DELETE FROM tasks WHERE id = $1';
    pool.query(queryText, [req.params.id])
        .then((result) => {
            res.sendStatus(201);
        }) //end then
        .catch((err) => {
            res.sendStatus(500);
        }) //end catch
}); //end delete

module.exports = router;