import { Project } from "./project";
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

    //Updates EventHandlers on load page and every time new project is created
    function updateEventHandlers(){
        let projects = document.querySelectorAll('.project');
        projects.forEach(project => project.addEventListener("click", getProject));
    }
    
    function loadProjects() {
        //createDefaultProjects if not in memory: eg. if local storageis empty
        loadDefaultProjects();
        updateEventHandlers();
    }

    function loadDefaultProjects() {
        let today = Project("Today"); 
        let week = Project("This Week"); 
        let all = Project("Show All"); 
        _projectList.push(today);
        _projectList.push(week);
        _projectList.push(all);
    }

    function getProjects() {
        return _projectList;
    }

    function getProject(e){
        let projectName = e.target.textContent;
        let clickedProject = app.getProjects().find(project => project.name === projectName);
    }

    function getTasks() {
        return _taskList;
    }

    function createTask() {
        let title = document.getElementById("title").value;
        let priority = document.getElementById("priority").value;
        let dueDate = document.getElementById("dueDate").value;
        let project = document.querySelector('.project-header').textContent;

        let newTask = Task(title, priority, dueDate, project);
        _taskList.push(newTask);

        UI.toggleTaskCreationModal();
        UI.viewProject(newTask.project);
    }

    function createProject() {

        let projectNameInput = document.getElementById("project-name").value;
        if (projectNameInput == "" || projectNameInput == null) return;
        let newProject = Project(projectNameInput); 
        _projectList.push(newProject);

        UI.toggleProjectCreationModal();
        UI.renderProjectPanel();
        UI.viewProject(newProject);
    }


    return { loadProjects, createTask, getProjects, getProject, getTasks, updateEventHandlers }


})();

export { app }
