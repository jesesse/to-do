const storage = (function () {

    let taskList = [];

    function addTask(task) {
        taskList.push(task);
    }

    function getTasks() {
        return taskList;
    }

    return { addTask, getTasks }

})();

export { storage }
