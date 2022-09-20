import { areIntervalsOverlappingWithOptions } from "date-fns/fp";
import { app } from "./app";

const UI = (function () {

    let taskView = document.querySelector('.task-view');
    let header = document.querySelector('.project-header');
    let addTaskBtn = document.querySelector('.add-task');
    let createTaskBtn = document.querySelector('.create-task');
    let addProjectBtn = document.querySelector('.add-project');
    let createProjectBtn = document.querySelector('.create-project');
    let projectPanel = document.querySelector('.nav-project-panel');
    let tabs = document.querySelector('.tabs');


    projectPanel.addEventListener("click", (e) => {
        if (e.target.className == "project") displayProject(app.getProject(e.target.textContent));
        if (e.target.className == "delete-project") app.deleteProject(e.target.previousSibling.textContent);
    });

    tabs.addEventListener("click", (e) => {
        if (e.target.className == "tab") displayTasksByDueDate(e.target.textContent);
    });

    taskView.addEventListener("click", (e) => {
        if (e.target.className == "task-card" || 
            e.target.className == "task-card task-card-expanded") toggleExpandTask(e.target); 
        if (e.target.className == "delete-task") {
            let taskName = e.target.parentNode.firstChild.textContent;
            let projectName = e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.textContent;
            let dueDate = header.textContent;
            app.deleteTask(taskName, projectName, dueDate);
        }
    });

    addProjectBtn.addEventListener("click", toggleProjectCreationModal);
    addTaskBtn.addEventListener("click", toggleTaskCreationModal);
    createTaskBtn.addEventListener("click", createTask);
    createProjectBtn.addEventListener("click", createProject);




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
        if (project.name === "Default") header.textContent = header.textContent;
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
            let title = document.createElement('div');
            let priority = document.createElement('div');
            let dueDate = document.createElement('div');
            let projectName = document.createElement('div');
            let deleteTaskBtn = document.createElement('div');
            
            title.textContent = tasks[i].title;
            priority.textContent = `Priority: ${tasks[i].priority}`;
            dueDate.textContent = `Due Date: ${tasks[i].dueDate}`;
            if (tasks[i].projectName == "Default") projectName.textContent = ``;
            else projectName.textContent = tasks[i].projectName;

            if (tasks[i].priority == "high") priority.style.color = "red";
            if (tasks[i].priority == "medium") priority.style.color = "yellow";
            if (tasks[i].priority == "low") priority.style.color = "green";

            deleteTaskBtn.classList.add('delete-task');
            newTaskCard.classList.add('task-card');

            newTaskCard.appendChild(title);
            newTaskCard.appendChild(priority);
            newTaskCard.appendChild(dueDate);
            newTaskCard.appendChild(projectName);
            newTaskCard.appendChild(deleteTaskBtn);
            
            taskView.appendChild(newTaskCard);
        }
    }


    function renderProjectPanel() {
        while (projectPanel.lastChild) projectPanel.removeChild(projectPanel.lastChild)
        for (let i = 0; i < app.getProjects().length; i++){
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
        let description = document.createElement('div');
        description.textContent = `Description:`
    }


    return {
        displayTasksByDueDate,
        displayProject,
        renderProjectPanel
    }

})();


export { UI }