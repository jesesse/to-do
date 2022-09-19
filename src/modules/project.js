const Project = (name) => {

    let _tasks = [];

    function getTasks(){
        return _tasks;
    }

    function addTask(task){
        _tasks.push(task);
    }

    function deleteTask(taskName){
        let task = _tasks.find(task => task.name === taskName);
        _tasks.splice(_tasks.indexOf(task), 1);
    }

    return { name, addTask, getTasks, deleteTask };

}

export { Project };