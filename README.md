# Task Manager App
- Full stack application that allows users to create and manage tasks.

## To-Do

### HTML/CSS
- [x] Create basic layout of app w/ header, div for add task form, and div for tasks to append to
- [x] Center everything in CSS (flexbox)
- [x] Add input field and button to allow user to add new task

### Client
- [x] Set up getTasks function w/ ajax get request to server (url: /tasks)
- [x] Append all tasks to DOM -- use backticks to avoid concatenating
- [x] Create event listener for add task button
- [x] Store new task in an object to send to server
- [x] AJAX post new task to server (url: /tasks)
- [x] call getTasks in post success function to update tasks on DOM

### Server
- [x] Set up node, install express, jquery, body-parser, pg
- [x] Set up server w/ task-router.js
- [x] Set up pool.js for link to database
- [x] Set up get route: (url: /tasks) that makes query to DB for all tasks 'SELECT * FROM tasks' and send back to client
- [x] Set up post route: (url: /tasks) that makes query to DB to insert new task 'INSERT INTO tasks (name) VALUES ($1)'

### Database
- [x] Create database task-manager
- [x] Create table tasks w/ columns: id, name, status (DEFAULT = incomplete)

### More...
- [x] Users can mark tasks complete (UPDATE task status to complete)
- [x] Users can delete tasks (DELETE task from database)
- [x] Completed tasks have different CSS
- [x] Clear input value once task is added
- [x] Additional styling (make it look awesome, add an icon, better fonts)
- [x] Add category table and allow users to select a category when adding a task (will require joins)
- [x] Add a due date
- [ ] Allow user to edit task name
- [x] Allow users to sort list by category
- [x] Allow users to add a category
- [ ] Tasks due today styled differently
- [ ] Display today's date on DOM
- [ ] Add "N/A" category to database and link to the Select option on DOM
- [ ] Style buttons, inputs, and dropdowns
- [x] Add separate category div
- [ ] Add separate categories router
- [ ] Get add category working
- [ ] Get edit category working
- [ ] Add date completed
