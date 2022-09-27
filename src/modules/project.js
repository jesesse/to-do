const Project = (id, name) => {

    let _tasks = [];

    function getTask(taskName) {
        let task = _tasks.find(task => task.name === taskName);
        return task;
    }

    function getTaskById(id) {
        let task = _tasks.find(task => task.id === id);
        return task;
    }

    function getTasks() {
        return _tasks;
    }

    function addTask(task) {
        _tasks.push(task);
    }


    function deleteTask(task) {
        _tasks.splice(_tasks.indexOf(task), 1);
    }

    return { id, name, addTask, getTask, getTaskById, getTasks, deleteTask };

}

export { Project };