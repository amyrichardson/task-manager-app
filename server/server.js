//Bring in Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5400;

//Bring in static files/body parser
app.use(express.static('./server/public'));
app.use(bodyParser.urlencoded({extended: true}));

//Routes
const tasksRouter = require('./routes/tasks.router');
app.use('/tasks', tasksRouter)

//Setup Port
app.listen(PORT, ()=> {
    console.log('Server up and running on port: ', PORT); 
});