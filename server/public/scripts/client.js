console.log('js');
let today = new Date();

$(document).ready(onReady);
        
function onReady () {
console.log('jq');
$('.newTaskForm').hide();
$('.newCategoryForm').hide();
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
$('#filterCategory').change(getTasksByCategory);
$('#newCategory').on('click', function(){
    event.preventDefault();
    $('.selectCategory').hide();
    $('.newCategoryForm').show();
    $('#addCategory').on('click', function(){
        event.preventDefault();
        let categoryToAdd = $('#newCategoryIn').val();
        console.log('category to add: ', categoryToAdd);
        newCategory(categoryToAdd);
    })
})
getCategories();
getTasks();
} //end onReady


// Packages user input into a new task object
function createTask (event) {
    event.preventDefault();
    let newTask = {
        taskName: $('#taskNameIn').val(),
        dueDate: $('#dueDateIn').val(),
        category: $('#categoryIn').val()
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

//gets all categories from database
function getCategories () {
    $.ajax({
        method: 'GET',
        url: '/tasks/categories',
        success: addCategories
    }); //end ajax GET
}

//adds categories to select boxes w/ their id's 
function addCategories (categories) {
 console.log('adding categories', categories );
 $('#categoryIn').empty();
 $('#filterCategory').empty();    
 $('#categoryIn').html('<option value="None">(Select)</option>');
 $('#filterCategory').html('<option value="None">(Select)</option>');

 for (let i = 0; i < categories.length; i++) {
    let category = categories[i]; 
    $('#categoryIn').append(`<option data-id="${category.id}" value="${category.category_name}">${category.category_name}</option>`);
    $('#filterCategory').append(`<option data-id="${category.id}" value="${category.category_name}">${category.category_name}</option>`);
 }
}

//Append tasks to DOM 
function displayTasks (taskList) {
    $('#incompleteTasks').empty();
    $('#completeTasks').empty();
    console.log('Task list: ', taskList);
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
    date = date.split('/');
    let year = date[2];
    let month = date[0] - 1;
    let day = date[1];    
    date = new Date(year, month, day);
    // let a = new Date(2018, 01, 16);
    // console.log(a.toISOString());
    
 
    console.log('today', today);
    console.log('date: ', date);
    
    
    if(today > date) {
        return true;        
    } else {
        return false;
    }
}

function getTasksByCategory () {
    let categoryId = $('#filterCategory option:selected').data('id');
    console.log('category to filter to: ', categoryId);
    
    $.ajax({
        method: 'GET',
        url: '/tasks/' + categoryId,
        success: displayTasks
    }); //end ajax GET
} //end getTasks

function newCategory (categoryName){
    $.ajax({
        method: 'POST',
        url: '/tasks/categories',
        data: {categoryName: categoryName},
        success: function(response){
            getCategories(response);
            $('.newCategoryForm').hide();
            $('.selectCategory').show();
        }
    });
}