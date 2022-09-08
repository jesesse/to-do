const Project = (name) => {

    let _tasks = [];

    function setTask(task){
        _tasks.push(task);
    }

    function getTasks(){
        return _tasks;
    }

    function deleteTask(taskName){
        let task = _tasks.find(task => task.name === taskName);
        _tasks.splice(_tasks.indexOf(task), 1);
    }

    return { name, setTask, getTasks, deleteTask };

}

export { Project };