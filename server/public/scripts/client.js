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
    let newTask = {
        taskName: $('#taskNameIn').val(),
        category: $('#categoryIn').val(),
        dueDate: $('#dueDateIn').val()
    };
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
    $('#taskNameIn').val('');
    $('.newTaskForm').hide();
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: displayTasks
    }); //end ajax GET
} //end getTasks

//Append tasks to DOM 
function displayTasks (taskList) {
    $('#incompleteTasks').empty();
    $('#completeTasks').empty();
    for (let i = 0; i < taskList.length; i++) {
        let currentTask = taskList[i];
        let $row = $(`<tr data-id="${currentTask.id}" data-status="${currentTask.status}">`);
        if(currentTask.status == 'Incomplete'){
            $row.append(`<td><input type="checkbox" id="markComplete"</input></td>`);
        } else {
            $row.append(`<td></td>`);
        } //adds checkbox to incomplete tasks
        let date = currentTask.due_date;
        if(date != null){
            date = date.split('T')[0];
            date = date.split('-');
            date = date[1] + '/' + date[2] + '/' + date[0];
        } //end if date is not null 
        else {
            date = 'Unknown';
        } //end date is null
        $row.append(`<td>${currentTask.name}</td>`);
        $row.append(`<td>${currentTask.category_name}</td>`)
        $row.append(`<td>${currentTask.status}</td>`);
        $row.append(`<td>${date}</td>`);
        $row.append(`<td><button id="deleteTask"><i class="far fa-trash-alt"></i></button></td>`);
        if(currentTask.status == 'Complete') {
            $row.addClass('completeTask');
            $('#completeTasks').append($row);
        }
        if(currentTask.status == 'Incomplete'){
            if(isDeadlinePassed(date) == true){
                $row.addClass('overdueTask');
            }
            $('#incompleteTasks').append($row);
        }

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

function isDeadlinePassed (date) {
    let today = new Date();
    date = date.split('/');
    let year = date[2];
    let month = date[0] - 1;
    let day = date[1];    
    date = new Date(year, month, day);
    if(today > date) {
        return true;        
    } else {
        return false;
    }
}