console.log('js');

$(document).ready(onReady);
        
function onReady () {
console.log('jq');
$('.newTaskForm').hide();
$('#addTask').on('click', function(){
    $('.newTaskForm').show();
}) //end show form
$('#exitForm').on('click', function(){
    $('.newTaskForm').hide();
})
$('#submitTask').on('click', createTask);
$('#taskTable').on('click', '#deleteTask', deleteTask);
$('#taskTable').on('change', '#markComplete', function(){
    if(this.checked) {
        let id = $(this).closest('tr').data('id');
        if($(this).closest('tr').data('status') == 'Complete'){
            let incompleteStatus = 'Incomplete';
            toggleStatus(id, incompleteStatus)
        } else{
            let completeStatus = 'Complete';
            toggleStatus(id, completeStatus);
        }
    }
})
$('#taskTable').on('click', 'tr', function() {
    let id = $(this).data('id');
    if($(this).data('status') == 'Complete'){
        let incompleteStatus = 'Incomplete';
        toggleStatus(id, incompleteStatus);    
    } else{
        let completeStatus = 'Complete';
        toggleStatus(id, completeStatus);    
    }
});
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
        let $row = $(`<tr data-id="${currentTask.id}" data-status="${currentTask.status}">`);
        if(currentTask.status == 'Incomplete'){
            $row.append(`<td><input type="checkbox" id="markComplete"</input></td>`);
        } else {
            $row.append(`<td></td>`);
        } //adds checkbox to incomplete tasks
        $row.append(`<td>${currentTask.name}</td>`);
        $row.append(`<td>${currentTask.status}</td>`);
        $row.append(`<td><button id="deleteTask"><i class="far fa-trash-alt"></i></button></td>`);
        if(currentTask.status == 'Complete') {
            $row.addClass('completeTask');
        } //adds unique styles to complete tasks
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
function toggleStatus (id, newStatus) {
    //ajax put to update status
    $.ajax({
        method: 'PUT',
        url: '/tasks/' + id,
        data: {newStatus: newStatus},
        success: getTasks
    }); //end PUT
} // end markComplete