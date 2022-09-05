import { Task } from "./task";
import { UI } from "./UI";
import { format } from "date-fns";

const app = (function () {

    let _taskList = [];
     
    let addTaskBtn = document.querySelector('.add-task');
    let createTaskBtn = document.querySelector('.create-task');

    addTaskBtn.addEventListener("click", UI.toggleTaskCreationModal);
    createTaskBtn.addEventListener("click", createTask);

    function loadProjects() {
        console.clear();
        for (let i = 0; i < _taskList.length; i++) {
            console.log(_taskList[i]);
        }
    }

    function createTask() {
        let title = document.getElementById("title").value;
        let priority = document.getElementById("priority").value;
        let dueDate = getDate();

        let newTask = Task(title, priority, dueDate, "");
        _taskList.push(newTask);
        loadProjects();
        UI.toggleTaskCreationModal();
    }

    function getDate() {
        if (!document.getElementById("dueDate").value) return "";
        else return format(new Date(document.getElementById("dueDate").value), 'dd/MM/yyyy')
    }


    // //"this" refers to the button on the task container.
    // function removeTask(id) {
    //     _taskList.splice(id, 1)
    // }

    // function addProject(project) {
    //     _projectList.push(project);
    // }

    // function getProjects() {
    //     return _projectList;
    // }


     return { loadProjects, createTask }

    
})();

export { app }
