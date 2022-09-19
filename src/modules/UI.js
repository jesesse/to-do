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
        if (e.target.className == "project") displayProject(e.target.textContent);
        if (e.target.className == "remove-project") deleteProject(e.target.textContent);
    });

    tabs.addEventListener("click", (e) => {
        if (e.target.className == "tab") displayTasksByDueDate(e.target.textContent);
    });

    addProjectBtn.addEventListener("click", toggleProjectCreationModal);
    addTaskBtn.addEventListener("click", toggleTaskCreationModal);
    createTaskBtn.addEventListener("click", createTask);
    createProjectBtn.addEventListener("click", createProject);


    function createTask(){
        let title = document.getElementById('title').value;
        let priority = document.getElementById('priority').value;
        let dueDate = document.getElementById('dueDate').value;
        let projectName = header.textContent;
        app.createTask(title, priority, dueDate, projectName);
        toggleTaskCreationModal();

    }

    function createProject(){
        return;
    }

    function toggleTaskCreationModal() {
        let addTaskBtn = document.querySelector('.add-task');
        let taskModal = document.querySelector('.task-modal');
        addTaskBtn.classList.toggle('hidden');
        taskModal.classList.toggle('hidden')
        document.getElementById("title").value = "";
        document.getElementById("priority").value = "";
        document.getElementById("dueDate").value = "";
    }

    function toggleProjectCreationModal() {
        let addProjectBtn = document.querySelector('.add-project');
        let projectModal = document.querySelector('.project-modal');
        addProjectBtn.classList.toggle('hidden');
        projectModal.classList.toggle('hidden');
        document.getElementById("project-name-input").value = "";
    }

    function viewProject(project){
        header.textContent = project.name
    }

    function displayTasks(tasks) {
        console.log(tasks);
    }


    function displayTasksByDueDate(dueDate){
        let tasks;
        if (dueDate == "Today") tasks = app.getTodayTasks();
        if (dueDate == "This Week") tasks = app.getThisWeekTasks();
        if (dueDate == "Show All") tasks = app.getAllTasks();

        header.textContent = dueDate;
        displayTasks(tasks);
    }


    return {
        displayTasksByDueDate,
        viewProject
    }

})();


export { UI }