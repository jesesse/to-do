const Task = (id, projectId, title, description, priority, dueDate, projectName) => {

    function markComplete(){
        //is completed
    }

    function editTitle(newTitle) {
        title = newTitle;
    }

    function editDescription(newDescription) {
        description = newDescription;
    }

    function editPriority(newPriority) {
        priority = newPriority;
    }

    function editDueDate(newDueDate) {
        dueDate = newDueDate;
    }

    return {
        id,
        projectId,
        title,
        description,
        priority,
        dueDate,
        projectName,
        markComplete,
        editTitle,
        editDescription,
        editPriority,
        editDueDate
    };
}



export { Task };