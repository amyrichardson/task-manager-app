console.log('js');
let today = new Date();

$(document).ready(onReady);
        
function onReady () {
    console.log('jq');
    taskFormListeners(); 
    getTasks();
    manageTasks();
    
    manageCategories();
    getCategories();   
} //end onReady

// TASK listeners
function taskFormListeners() {
    $('.newTaskForm').hide();
    $('#addTask').on('click', function(){
        $('.newTaskForm').show();
    }) //end show form
    $('#exitForm').on('click', function(){
        event.preventDefault();
        $('.newTaskForm').hide();
    })
    $('#submitTask').on('click', createTask);
}

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

//TODO: split date work into different function/simplify it
//Append tasks to DOM 
function displayTasks (taskList) {
    //Empty table to prep for append
    $('#incompleteTasks').empty();
    $('#completeTasks').empty();

    //Loop through taskList array
    for (let i = 0; i < taskList.length; i++) {
        let currentTask = taskList[i];
        let $row = $(`<tr data-id="${currentTask.id}" data-status="${currentTask.status}">`); //add task id to tr to access later 
        let date = currentTask.due_date;
        
        //SPLIT THIS INTO NEW FUNCTION
        if(date != null){
            date = date.split('T')[0];
            date = date.split('-');
            date = date[1] + '/' + date[2] + '/' + date[0];
        } //end if date is not null 
        else {
            date = 'Unknown';
        } //end date is null

        //Append task info to row
        $row.append(`
            <td class="toggleStatus">${currentTask.name}</td>
            <td class="toggleStatus">${currentTask.category_name}</td>
            <td class="toggleStatus">${date}</td>
            <td><button class="editTask taskButton"><i class="fa fa-pencil"</i></button></td>
            <td><button class="deleteTask taskButton"><i class="fa fa-trash" aria-hidden="true"></i></button></td>`);

        if(currentTask.status == 'Complete') {
            $row.addClass('completeTask');
            $('#completeTasks').append($row);
        } //end append complete tasks
        if(currentTask.status == 'Incomplete'){
            if(isDeadlinePassed(date) == true){
                $row.addClass('overdueTask');
            } //end check deadline
            $('#incompleteTasks').append($row);
        } //end append incomplete tasks
    } //end for loop
} // end displayTasks

//Event listeners to handle elements on task table
function manageTasks() {
    //Event listener to delete tasks
    $('#taskTable').on('click', '.deleteTask', deleteTask);

    //Event listener to toggle status of tasks
    $('#taskTable').on('click', '.toggleStatus', function() {
        let id = $(this).closest('tr').data('id');
        if($(this).closest('tr').data('status') == 'Complete'){
            let incompleteStatus = 'Incomplete';
            toggleStatus(id, incompleteStatus);    
        } else{
            let completeStatus = 'Complete';
            toggleStatus(id, completeStatus);    
        } //end if else
    }); //end toggle status listener

    //Event listener to filter to only tasks with certain category
    $('#filterCategory').change(getTasksByCategory);
} //end manageTasks

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

// Delete task
function deleteTask() {    
    let id = $(this).closest('tr').data('id');    
    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + id,
        success: getTasks     
    }) //end delete
} //end deleteTask

//Toggle status of task
function toggleStatus (id, newStatus) {
    //ajax put to update status
    $.ajax({
        method: 'PUT',
        url: '/tasks/' + id,
        data: {newStatus: newStatus},
        success: getTasks
    }); //end PUT
} // end toggleStatus


// CATEGORY functions
function manageCategories () {
    $('.manageCategories').hide();

    //Shows manage categories options
    $('#manageCategoriesButton').on('click', function(){
        $('.manageCategories').show();
    })

    //Exits manage categories options
    $('#exitCategoryManager').on('click', function(){
        $('.manageCategories').hide();
    })

    //Adds new category
    $('#addCategory').on('click', newCategory);
} //end manageCategories

//gets all categories from database
function getCategories () {
    $.ajax({
        method: 'GET',
        url: '/tasks/categories',
        success: displayCategories
    }); //end ajax GET
}

//adds categories to select boxes w/ their id's 
function displayCategories (categories) {

    $('.categoryList').empty();
    $('#categoryIn').empty();
    $('#filterCategory').empty();    
    $('#categoryIn').html('<option value="None">(Select)</option>');
    $('#filterCategory').html('<option value="All">All tasks</option>');

    for (let i = 0; i < categories.length; i++) {
        let category = categories[i]; 
        $('#categoryIn').append(`<option data-id="${category.id}" value="${category.category_name}">${category.category_name}</option>`);
        $('#filterCategory').append(`<option data-id="${category.id}" value="${category.category_name}">${category.category_name}</option>`);
    let $row = $('<tr>')
        $($row).append(`<td>${category.category_name}</td>`)
        $($row).append(`<td><button class="categoryButton"><i class="fa fa-pencil"</i></button></td>`)
        $($row).append(`<td><button class="categoryButton"><i class="fa fa-trash" aria-hidden="true"></i></button></td>`)
        $('.categoryList').append($row);
    } //end for loop
} // end displayCategories

function newCategory (){
    event.preventDefault();
        let categoryToAdd = $('#newCategoryIn').val();
        console.log('category to add: ', categoryToAdd);
    $.ajax({
        method: 'POST',
        url: '/tasks/categories',
        data: {categoryName: categoryToAdd},
        success: function(response){
            getCategories(response);
            $('#newCategoryIn').val('');
            $('.newCategoryForm').hide();
            $('.selectCategory').show();
        } //end success
    }); //end post
} //end newCategory

function getTasksByCategory () {
    if($('#filterCategory option:selected').val() == 'All'){
        getTasks();
    } else{
        let categoryId = $('#filterCategory option:selected').data('id');
        $.ajax({
                method: 'GET',
                url: '/tasks/' + categoryId,
                success: displayTasks
        }); //end ajax GET
    } //end if else    
} //end getTasks


function isDeadlinePassed (date) {
    date = date.split('/');
    let year = date[2];
    let month = date[0] - 1;
    let day = date[1];    
    date = new Date(year, month, day);
    // let a = new Date(2018, 01, 16);
    // console.log(a.toISOString());
    
    if(today > date) {
        return true;        
    } else {
        return false;
    } //end if else
} //end isDeadlinePassed
