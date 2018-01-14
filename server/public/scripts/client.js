console.log('js');

$(document).ready(onReady);
        
function onReady () {
console.log('jq');
$('#addTask').on('click', createTask);
getTasks();
} //end onReady


// Packages user input into a new task object
function createTask (event) {
    event.preventDefault();
    console.log('new task added');
    let newTask = {
        taskName: $('#taskNameIn').val(),
    };
    console.log('new task: ', newTask);
    sendTask(newTask);
} //end createTask

// Sends new task object to server w/ ajax POST
function sendTask (newTask) {
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: newTask,
        success: function(response) {
            console.log('back from server with: ', response);
        } //end success
    }); //end ajax POST
} //end sendTask

// Get all tasks from server
function getTasks () {
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: function(response) {
            console.log('back from get to server with: ', response); 
        } //end success
    }); //end ajax GET
} //end getTasks