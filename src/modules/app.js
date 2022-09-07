import { Project } from "./project";
import { Task } from "./task";
import { UI } from "./UI";

import toDate from "date-fns/toDate";
import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";

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
    function updateProjectEventHandlers() {
        let projects = document.querySelectorAll('.project');
        projects.forEach(project => project.addEventListener("click", viewProject));
    }

    function loadProjects() {
        //createDefaultProjects if not in memory: eg. if local storageis empty
        loadDefaultProjects();
        updateProjectEventHandlers();
    }

    function loadDefaultProjects() {
        _projectList.push(Project("Today"));
        _projectList.push(Project("This Week"));
        _projectList.push(Project("Show All"));
    }

    function getProjects() {
        return _projectList;
    }

    function viewProject(e) {
        let projectName = e.target.textContent;
        let clickedProject = getProjects().find(project => project.name === projectName);
        UI.viewProject(clickedProject);

    }

    function getTasks(project) {
        let tasks = _taskList.filter(task => task.projectName === project.name);
        console.log(tasks);
        console.log(_taskList);
        return tasks;
    }

    function createTask() {
        let title = document.getElementById("title").value;
        let priority = document.getElementById("priority").value;
        let dueDate = document.getElementById("dueDate").value;
        let projectName = document.querySelector('.project-header').textContent;

        if (projectName == "Today" || projectName == "This Week" || projectName == "Show All") {
            if (isToday((parseISO(dueDate)))) projectName = "Today";
            else if (isThisWeek((parseISO(dueDate)))) projectName = "This Week";
            else projectName = "Show All";
        } 
        
        let newTask = Task(title, priority, dueDate, projectName);
        _taskList.push(newTask);

        UI.toggleTaskCreationModal(); 

        
        UI.viewProject(getProjects().find(project => project.name === projectName));
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


    return { loadProjects, createTask, getProjects, getTasks, updateProjectEventHandlers }


})();

export { app }
