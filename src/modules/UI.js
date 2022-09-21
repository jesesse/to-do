import { areIntervalsOverlappingWithOptions } from "date-fns/fp";
import { app } from "./app";

const UI = (function () {

    let taskView = document.querySelector('.task-view');
    let header = document.querySelector('.project-header');
    let addTaskBtn = document.querySelector('.add-task');
    let createTaskBtn = document.querySelector('.create-task');
    let navBar = document.querySelector('.nav-bar');
    let addProjectBtn = document.querySelector('.add-project');
    let createProjectBtn = document.querySelector('.create-project');
    let projectPanel = document.querySelector('.nav-project-panel');


    navBar.addEventListener("click", (e) => {
        if (e.target.className == "tab") displayTasksByDueDate(e.target.textContent);
        if (e.target.className == "project") displayProject(app.getProject(e.target.textContent));
        if (e.target.className == "add-project") toggleProjectCreationModal();
        if (e.target.className == "create-project") createProject();
        if (e.target.className == "delete-project") app.deleteProject(e.target.previousSibling.textContent);
    });



    taskView.addEventListener("click", (e) => {
        if (e.target.className == "task-card" ||
            e.target.className == "task-card task-card-expanded") toggleExpandTask(e.target);
        if (e.target.className == "delete-task") {
            let taskName = e.target.parentNode.querySelector('.title').textContent;
            let projectName = e.target.parentNode.querySelector('.project-name').textContent;
            let currentView = header.textContent;
            app.deleteTask(taskName, projectName, currentView);
        }
    });


    addTaskBtn.addEventListener("click", toggleTaskCreationModal);
    createTaskBtn.addEventListener("click", createTask);


    function createTask() {
        let title = document.getElementById('title').value;
        let priority = document.getElementById('priority').value;
        let dueDate = document.getElementById('dueDate').value;
        let projectName = document.querySelector('.project-header').textContent;
        app.createTask(title, priority, dueDate, projectName);
        toggleTaskCreationModal();
    }



    function createProject() {
        let projectName = document.getElementById('project-name-input').value;
        app.createProject(projectName);
        toggleProjectCreationModal();
    }


    function toggleTaskCreationModal() {
        let addTaskBtn = document.querySelector('.add-task');
        let taskModal = document.querySelector('.task-modal');
        addTaskBtn.classList.toggle('hidden');
        taskModal.classList.toggle('hidden')
        document.getElementById("title").value = "";
        document.getElementById("dueDate").value = "";
    }

    function toggleProjectCreationModal() {
        let addProjectBtn = document.querySelector('.add-project');
        let projectModal = document.querySelector('.project-modal');
        addProjectBtn.classList.toggle('hidden');
        projectModal.classList.toggle('hidden');
        document.getElementById("project-name-input").value = "";
    }

    function displayProject(project) {
        if (project.name === "Default") {
            header.textContent = "Show All";
            displayTasksByDueDate("Show All");
        }
        else header.textContent = project.name;
        displayTasks(app.getProjectTasks(project));
    }


    function displayTasksByDueDate(dueDate) {
        let tasks;
        if (dueDate == "Today") tasks = app.getTodayTasks();
        if (dueDate == "This Week") tasks = app.getThisWeekTasks();
        if (dueDate == "Show All") tasks = app.getAllTasks();
        header.textContent = dueDate;
        displayTasks(tasks);
    }


    function displayTasks(tasks) {

        while (taskView.lastChild) {
            taskView.removeChild(taskView.lastChild);
        }

        if (tasks.length == 0) taskView.textContent = "No tasks... ";

        for (let i = 0; i < tasks.length; i++) {

            let newTaskCard = document.createElement('div');
            newTaskCard.innerHTML = `<div class="task-card">
            <div class="title">
                <label class "title-label"></label>
                <p class "title p"></p>
            </div>
            <div class="description">
                <label class "title-label"></label>
                <p class "title p"></p>
            </div>
            <div class="priority">
                <label class "title-label"></label>
                <p class "title p"></p>
            </div>    
            <div class="due-date">
                <label class "title-label"></label>
                <p class "title p"></p>
            </div>
            <div class="project-name">
                <label class "title-label"></label>
                <p class "title p"></p>
            </div>
            <div class="delete-task">
                <label class "title-label"></label>
                <p class "title p"></p>
            </div>
            </div>`

            taskView.appendChild(newTaskCard);
        }


    }


    function renderProjectPanel() {
        while (projectPanel.lastChild) projectPanel.removeChild(projectPanel.lastChild)
        for (let i = 0; i < app.getProjects().length; i++) {
            if (app.getProjects()[i].name === "Default") continue;
            let projectTab = document.createElement('div')
            let deleteProjectBtn = document.createElement('div');
            projectTab.classList.add('project');
            deleteProjectBtn.classList.add('delete-project');
            projectTab.textContent = app.getProjects()[i].name;
            projectTab.appendChild(deleteProjectBtn);
            projectPanel.appendChild(projectTab);
        }
    }

    function toggleExpandTask(taskCard) {
        taskCard.classList.toggle('task-card-expanded');

        taskCard.contentEditable = "true";

    }




    return {
        displayTasksByDueDate,
        displayProject,
        renderProjectPanel
    }

})();


export { UI }