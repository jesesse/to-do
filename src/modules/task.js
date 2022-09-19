const Task = (title, priority, dueDate, projectName) => {

    function markComplete(){
        //is completed
    }

    function changeTitle(newTitle) {
        title = text;
    }

    function changePriority(newPriority) {
        priority = newPriority;
    }

    function changedueDate(newDueDate) {
        dueDate = newDueDate;
    }

    function deleteTask(title){
        //delete from storage?
    }


    return {
        title,
        priority,
        dueDate,
        projectName
    };
}



export { Task };