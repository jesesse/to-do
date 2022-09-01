const storage = (function () {

    let taskList = [];

    function addTask(task) {
        taskList.push(task);
    }

    function getTasks() {
        return taskList;
    }

    //"this" refers to the button on the task container.
    function removeTask(id) {
        taskList.splice(id, 1)
    }

    return { addTask, getTasks, removeTask }

})();

export { storage }
