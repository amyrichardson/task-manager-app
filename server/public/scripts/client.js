console.log('js');
let today = new Date();

$(document).ready(onReady);
        
function onReady () {
console.log('jq');
$('.newTaskForm').hide();
$('.manageCategories').hide();
$('#addTask').on('click', function(){
    $('.newTaskForm').show();
}) //end show form
$('#manageCategoriesButton').on('click', function(){
    $('.manageCategories').show();
})
$('#exitForm').on('click', function(){
    $('.newTaskForm').hide();
})
$('#submitTask').on('click', createTask);
$('#taskTable').on('click', '.deleteTask', deleteTask);
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
$('#taskTable').on('click', '.toggleStatus', function() {
    let id = $(this).closest('tr').data('id');
    if($(this).closest('tr').data('status') == 'Complete'){
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
    $('#addCategory').on('click', newCategory);
});
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
 }
}

//Append tasks to DOM 
function displayTasks (taskList) {
    $('#incompleteTasks').empty();
    $('#completeTasks').empty();
    for (let i = 0; i < taskList.length; i++) {
        let currentTask = taskList[i];
        let $row = $(`<tr data-id="${currentTask.id}" data-status="${currentTask.status}">`);
        let date = currentTask.due_date;
        if(date != null){
            date = date.split('T')[0];
            date = date.split('-');
            date = date[1] + '/' + date[2] + '/' + date[0];
        } //end if date is not null 
        else {
            date = 'Unknown';
        } //end date is null
        $row.append(`<td class="toggleStatus">${currentTask.name}</td>`);
        $row.append(`<td class="toggleStatus">${currentTask.category_name}</td>`)
        $row.append(`<td class="toggleStatus">${date}</td></tr>`);
        $row.append(`<td><button class="editTask taskButton"><i class="fa fa-pencil"</i></button></td>`)
        $row.append(`<td><button class="deleteTask taskButton"><i class="fa fa-trash" aria-hidden="true"></i>
        </button></td>`);
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
    if($('#filterCategory option:selected').val() == 'All'){
        getTasks();
    } else{
        let categoryId = $('#filterCategory option:selected').data('id');
        $.ajax({
                method: 'GET',
                url: '/tasks/' + categoryId,
                success: displayTasks
        }); //end ajax GET
    }    
} //end getTasks

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
        }
    });
}