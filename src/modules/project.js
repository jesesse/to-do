const Project = (id, name, tasks) => {


    function getTaskById(id) {
        let task = tasks.find(task => task.id === id);
        return task;
    }

    function addTask(task) {
        tasks.push(task);
   
    }

    function deleteTask(task) {
        tasks.splice(tasks.indexOf(task), 1);
    }

    return { id, name, tasks, addTask, getTaskById, deleteTask };

}

export { Project };