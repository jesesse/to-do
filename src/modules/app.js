import { Task } from "./task";
import { UI } from "./UI";

const app = (function () {

    let _taskList = [];
    let _projectList = [];
     
    //DECALRE ALL CLICKABLE UI ELEMENTS
    let addTaskBtn = document.querySelector('.add-task');
    let createTaskBtn = document.querySelector('.create-task');
    let addProjectBtn = document.querySelector('.add-project');
    let createProjectBtn = document.querySelector('.create-project');

    // SET ALL EVENT LISTENERS
    addProjectBtn.addEventListener("click", UI.toggleProjectCreationModal);
    addTaskBtn.addEventListener("click", UI.toggleTaskCreationModal);
    createProjectBtn.addEventListener("click", createProject);
    createTaskBtn.addEventListener("click", createTask);

    function loadProjects() {
        console.clear();
        for (let i = 0; i < _taskList.length; i++) {
            console.log(_taskList[i]);
        }
    }

    function getProjects(){
        return _projectList;
    }

    function getTasks(){
        return _taskList;
    }

    function createTask() {
        let title = document.getElementById("title").value;
        let priority = document.getElementById("priority").value;
        let dueDate = document.getElementById("dueDate").value;
        let project;

        let newTask = Task(title, priority, dueDate, project);
        _taskList.push(newTask);
        UI.toggleTaskCreationModal();
        document.getElementById("dueDate").value = "";
        UI.viewProjects();
        
    }

    function createProject(){
        let projectName = document.getElementById("project-name").value;
        _projectList.push(projectName);
        UI.toggleProjectCreationModal();
        UI.renderProjectPanel();
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


     return { loadProjects, createTask, getProjects, getTasks }

    
})();

export { app }
