# Task Manager App
- Full stack application that allows users to create and manage tasks.

## To-Do

### HTML/CSS
- [ ] Create basic layout of app w/ header, div for add task form, and div for tasks to append to
- [ ] Center everything in CSS (flexbox)
- [ ] Add input field and button to allow user to add new task
- [ ] Add styles


### Client
- [ ] Set up getTasks function w/ ajax get request to server (url: /tasks)
- [ ] Append all tasks to DOM -- use backticks to avoid concatenating
- [ ] Create event listener for add task button
- [ ] Store new task in an object to send to server
- [ ] AJAX post new task to server (url: /tasks)
- [ ] call getTasks in post success function to update tasks on DOM

### Server
- [ ] Set up node, install express, jquery, body-parser, pg
- [ ] Set up server w/ task-router.js
- [ ] Set up pool.js for link to database
- [ ] Set up get route: (url: /tasks) that makes query to DB for all tasks 'SELECT * FROM tasks' and send back to client
- [ ] Set up post route: (url: /tasks) that makes query to DB to insert new task 'INSERT INTO tasks (name) VALUES ($1)'

### Database
- [ ] Create database task-manager
- [ ] Create table tasks w/ columns: id, name, status (DEFAULT = incomplete)
