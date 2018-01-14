console.log('js');

$(document).ready(onReady);
        
function onReady () {
console.log('jq');
$('#addTask').on('click', createTask);
$('#taskTable').on('click', '#deleteTask', deleteTask);
$('#taskTable').on('change', '#markComplete', function(){
    if(this.checked) {
        let id = $(this).closest('tr').data('id');
        markComplete(id);
    }
})
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
        success: getTasks
    }); //end ajax POST
} //end sendTask

// Get all tasks from server
function getTasks () {
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: displayTasks
    }); //end ajax GET
} //end getTasks

//Append tasks to DOM 
function displayTasks (taskList) {
    $('#taskTable').empty();
    for (let i = 0; i < taskList.length; i++) {
        let currentTask = taskList[i];
        let $row = $(`<tr data-id="${currentTask.id}">`);
        if(currentTask.status == 'Incomplete'){
            $row.append(`<td><input type="checkbox" id="markComplete"</input></td>`);
        } else {
            $row.append(`<td></td>`);
        }
        $row.append(`<td>${currentTask.name}</td>`);
        $row.append(`<td>${currentTask.status}</td>`);
        $row.append(`<td><button id="deleteTask">Delete</button></td>`);
        $('#taskTable').append($row);
    } //end for loop
} // end displayTasks

// Delete task
function deleteTask() {
    let id = $(this).closest('tr').data('id');
    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + id,
        success: getTasks     
    }) //end delete
} //end deleteTask

//Mark task complete
function markComplete (id) {
    //ajax put to update status
    let newStatus = 'Complete';
    console.log('id to complete: ', id);
    $.ajax({
        method: 'PUT',
        url: '/tasks/' + id,
        data: {newStatus: newStatus},
        success: getTasks
    }); //end PUT
} // end markComplete