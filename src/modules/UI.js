import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";
import {
    getProjectById,
    getProjectByName,
    getProjects,
    deleteProject,
    getTodayTasks,
    getThisWeekTasks,
    getAllTasks,
    createProject,
    createTask,
    deleteTask,
    editTask
} from "./app";





let mainView = document.querySelector('.main');
let currentViewHeader = document.querySelector('.current-view');
let navBar = document.querySelector('.nav-bar');
let projectPanel = document.querySelector('.nav-project-panel');



navBar.addEventListener("click", (e) => {
    if (e.target.className == "tab") displayTasksByDueDate(e.target.textContent);
    if (e.target.className == "project") displayProject(getProjectById(e.target.id));
    if (e.target.className == "delete-project") UIdeleteProject(e.target.parentNode.id);
    if (e.target.className == "create-project") UIcreateProject();
    if (e.target.className == "add-project") toggleProjectCreationModal();    
});


mainView.addEventListener("click", (e) => {
    if (e.target.className == "add-task-btn") toggleTaskCreationModal();
    if (e.target.className == "create-task") gatherDataToCreateTask();
    if (e.target.className == "task-card") expandTask(e.target);
    else if (e.target.className == "task-card task-card-expanded") gatherDataToEditTask(e.target);
    if (e.target.className == "delete-task") UIdeleteTask(e)
});













function UIcreateProject() {
    let projectName = document.getElementById('project-name-input').value;
    createProject(projectName);
    let project = getProjectByName(projectName);
    renderProjectPanel();
    displayProject(project);
    toggleProjectCreationModal();
}


function UIdeleteProject(id) {
    let project = getProjectById(id);
    deleteProject(project);
    renderProjectPanel();
    displayTasksByDueDate('Today');
}











function gatherDataToCreateTask() {
    let title = document.getElementById('title').value;
    let priority = document.getElementById('priority').value;
    let description = "";
    let dueDate = document.getElementById('dueDate').value;
    let currentView = document.querySelector('.current-view').textContent;
    let projectName;
    if (currentView == "Today" ||
        currentView == "This Week" ||
        currentView == "Show All") {
        projectName = "Default";
    } else projectName = currentView.slice(9);

    createTask(title, priority, description, dueDate, projectName);

    if (projectName == "Default") {
        if (isToday((parseISO(dueDate)))) displayTasksByDueDate("Today");
        else if (isThisWeek((parseISO(dueDate)))) displayTasksByDueDate("This Week");
        else displayTasksByDueDate("Show All");
    } else displayProject(getProjectByName(projectName))

    toggleTaskCreationModal();
}


function UIdeleteTask(e) {
    let taskId = e.target.parentNode.querySelector('.task-id').textContent;
    let projectId = e.target.parentNode.querySelector('.project-id').textContent;
    let currentView = currentViewHeader.textContent;
    deleteTask(taskId, projectId, currentView);
    if (currentView != "Today" &&
        currentView != "This Week" &&
        currentView != "Show All") {
        currentView = currentView.slice(9);
    }

    if (currentView != getProjectById(projectId).name) {
        displayTasksByDueDate(currentView);
    } else displayProject(getProjectById(projectId));

}


function gatherDataToEditTask(taskCard) {
    let taskId = taskCard.querySelector(".task-id").textContent;
    let projectId = taskCard.querySelector(".project-id").textContent;
    let editedTitle = taskCard.querySelector(".edit-title").value;
    let editedDescription = taskCard.querySelector(".edit-description").value;
    let editedPriority = taskCard.querySelector(".edit-priority").value;
    let editedDueDate = taskCard.querySelector(".edit-due-date").value;
    let editedProjectName = taskCard.querySelector(".edit-project").value;
    if (editedProjectName === '(empty)') editedProjectName = 'Default'

    editTask(taskId, projectId, editedTitle, editedDescription, editedPriority, editedDueDate, editedProjectName);

    let currentView = currentViewHeader.textContent;
    if (currentView != "Today" &&
        currentView != "This Week" &&
        currentView != "Show All") {
        currentView = currentView.slice(9);
    }

    if (currentView != getProjectById(projectId).name) {
        displayTasksByDueDate(currentView);

    } else displayProject(getProjectById(projectId));
}













function displayProject(project) {
    while (mainView.lastChild) {
        mainView.removeChild(mainView.lastChild);
    }

    let projectContainer = document.createElement('div');
    let projectHeader = document.createElement('h1');
    let addTaskBtn = document.createElement('div');

    projectContainer.classList.add('project-container');
    projectHeader.classList.add('project-header');
    addTaskBtn.classList.add('add-task-btn')

    projectHeader.textContent = `Project: ${project.name}`;
    addTaskBtn.textContent = '+';
    projectContainer.appendChild(projectHeader);
    projectContainer.appendChild(addTaskBtn)
    mainView.appendChild(projectContainer);

    displayTasks(project.tasks, projectContainer);
}


function displayTasks(tasks, view) {
  
    let taskView = document.createElement('div');
    view.appendChild(taskView);

    while (taskView.lastChild) {
        taskView.removeChild(taskView.lastChild);
    }

    if (tasks.length == 0) taskView.textContent = "No tasks... ";

    for (let i = 0; i < tasks.length; i++) {
        let newTaskCard = document.createElement('div');
        newTaskCard.classList.add('task-card')

        let projectName;
        if (tasks[i].projectName == "Default") projectName = "";
        else projectName = tasks[i].projectName;

        newTaskCard.innerHTML =
            `<div class="task-id">${tasks[i].id}</div>
                <div class="project-id">${tasks[i].projectId}</div>
                <div class="title">
                    <label class="title-label"></label>
                    <p class="title-p">${tasks[i].title}</p>
                </div>
                <div class="priority">
                    <label class="priority-label">Priority:</label>
                    <p class="priority-p">${tasks[i].priority}</p>
                </div>    
                <div class="due-date">
                    <label class="due-date-label">Due Date:</label>
                    <p class="due-date-p">${tasks[i].dueDate}</p>
                </div>
                <div class="project-name">
                    <label class="project-name-label">Project:</label>
                    <p class="project-name-p">${projectName}</p>
                </div>
                <div class="description">
                    <label class="description-label"></label>
                    <p class="description-p">${tasks[i].description}</p>
                </div>
                <div class="delete-task"></div>
            `
            taskView.appendChild(newTaskCard);

        if (tasks[i].priority === "low") newTaskCard.querySelector('.priority-p').style.color = "#85A72A";
        if (tasks[i].priority === "medium") newTaskCard.querySelector('.priority-p').style.color = "#A7912A";
        if (tasks[i].priority === "high") newTaskCard.querySelector('.priority-p').style.color = "#9C2222";
    }
}


function displayTasksByDueDate(dueDate) {
    let tasks;
    if (dueDate == "Today") tasks = getTodayTasks();
    if (dueDate == "This Week") tasks = getThisWeekTasks();
    if (dueDate == "Show All") tasks = getAllTasks();

    while (mainView.lastChild) {
        mainView.removeChild(mainView.lastChild);
    }

    let dueDateView = document.createElement('div');
    let dueDateViewHeader = document.createElement('h1');
    dueDateView.classList.add('due-date-view');
    dueDateViewHeader.classList.add('due-date-view-header');
    dueDateViewHeader.textContent = dueDate;
    dueDateView.appendChild(dueDateViewHeader);
    mainView.appendChild(dueDateView);

    displayTasks(tasks, dueDateView);
}





function renderProjectPanel() {
    while (projectPanel.lastChild) projectPanel.removeChild(projectPanel.lastChild)

    let projects = getProjects();
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].name === "Default") continue;
        let projectTab = document.createElement('div')
        let deleteProjectBtn = document.createElement('div');
        projectTab.classList.add('project');
        projectTab.setAttribute('id', getProjects()[i].id);
        projectTab.textContent = getProjects()[i].name;
        deleteProjectBtn.classList.add('delete-project');
        projectTab.appendChild(deleteProjectBtn);
        projectPanel.appendChild(projectTab);
    }
}



function expandTask(taskCard) {
    taskCard.classList.toggle('task-card-expanded');

    //EXPAND EDIT TITLE SECTION
    taskCard.querySelector(".title-label").textContent = "Title: "
    let editTitle = document.createElement('input');
    editTitle.type = "text";
    editTitle.classList.add('edit-title');
    editTitle.value = taskCard.querySelector(".title-p").textContent;
    taskCard.querySelector(".title").insertBefore(editTitle, taskCard.querySelector(".title-p"));
    taskCard.querySelector(".title-p").remove();

    //EXPAND EDIT DESCRIPTION SECTION
    taskCard.querySelector(".description-label").textContent = "Description: "
    let editDescription = document.createElement('input');
    editDescription.type = "text";
    editDescription.classList.add('edit-description');
    editDescription.value = taskCard.querySelector(".description-p").textContent;
    taskCard.querySelector(".description").insertBefore(editDescription, taskCard.querySelector(".description-p"));
    taskCard.querySelector(".description-p").remove();

    //EXPAND EDIT PRIORITY SECTION
    taskCard.querySelector(".priority-label").textContent = "Priority: ";
    let editPriority = document.createElement('select');
    editPriority.classList.add('edit-priority');

    for (let i = 0; i < 3; i++) {
        let newOption = document.createElement('option');
        if (i == 0) newOption.text = "low"
        else if (i == 1) newOption.text = "medium"
        else if (i == 2) newOption.text = "high"
        editPriority.add(newOption);
    }

    editPriority.value = taskCard.querySelector(".priority-p").textContent;
    taskCard.querySelector(".priority").insertBefore(editPriority, taskCard.querySelector(".priority-p"));
    taskCard.querySelector(".priority-p").remove();


    //EXPAND EDIT DUEDATE SECTION
    taskCard.querySelector(".due-date-label").textContent = "Due date: "
    let editDueDate = document.createElement('input');
    editDueDate.type = "date";
    editDueDate.classList.add('edit-due-date');
    editDueDate.value = taskCard.querySelector(".due-date-p").textContent;
    taskCard.querySelector(".due-date").insertBefore(editDueDate, taskCard.querySelector(".due-date-p"));
    taskCard.querySelector(".due-date-p").remove();


    //EXPAND EDIT PROJECT NAME SECTION
    taskCard.querySelector(".project-name-label").textContent = "Project: "
    let editProject = document.createElement('select');
    editProject.classList.add('edit-project');

    for (let i = 0; i < getProjects().length; i++) {
        let newOption = document.createElement('option');
        if (getProjects()[i].name == "Default") newOption.text = "(empty)"
        else newOption.text = getProjects()[i].name;
        editProject.add(newOption);
    }

    if (taskCard.querySelector(".project-name-p").textContent == "") editProject.value = '(empty)';
    else editProject.value = taskCard.querySelector(".project-name-p").textContent;
    taskCard.querySelector(".project-name").insertBefore(editProject, taskCard.querySelector(".project-name-p"));
    taskCard.querySelector(".project-name-p").remove();
}












function toggleTaskCreationModal() {
    let addTaskBtn = document.querySelector('.add-task-btn');
    let taskModal = document.querySelector('.task-modal hidden');
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




export {
    displayTasksByDueDate,
    displayProject,
    renderProjectPanel
}