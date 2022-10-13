import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";
import { Project } from "./project";
import { Task } from "./task";
import { v4 as uuidv4 } from 'uuid';
import {
    displayTasksByDueDate,
    displayProject,
    toggleProjectCreationModal,
    toggleTaskCreationModal,
    expandTask,
    renderProjectPanel
} from "./UI";
import {
    getProjectByName,
    getProjectById,
    getProjects,
    getTodayTasksFromStorage,
    getThisWeekTasksFromStorage,
    getAllTasksFromStorage,
    saveProject,
    deleteProjectFromStorage
} from "./storage"


let mainView = document.querySelector('.main');
let currentViewHeader = document.querySelector('.current-view');
let navBar = document.querySelector('.nav-bar');

navBar.addEventListener("click", (e) => {
    if (e.target.className == "tab") displayTasksByDueDate(e.target.querySelector('.due-date').textContent);
    if (e.target.className == "due-date") displayTasksByDueDate(e.target.textContent);
    if (e.target.className == "project") displayProject(getProjectById(e.target.id));
    if (e.target.className == "delete-project") deleteProject(e.target.parentNode.id);
    if (e.target.className == "create-project") createProject();
    if (e.target.className == "add-project") toggleProjectCreationModal();
});

mainView.addEventListener("click", (e) => {
    if (e.target.className == "add-task") toggleTaskCreationModal();
    if (e.target.className == "create-task") createTask();
    if (e.target.className == "delete-task") deleteTask(e.target.parentNode.querySelector('.task-id').textContent,
        e.target.parentNode.querySelector('.project-id').textContent)
    if (e.target.className == "task-card") expandTask(e.target);
    else if (e.target.className == "task-card task-card-expanded") editTask(e.target);
});



function loadProjects() {

   
    if (localStorage.length > 0) {
        renderProjectPanel(getProjects());
        displayTasksByDueDate('Today');
    } else {
        createProject("Default");
        createProject("Project 1");
        renderProjectPanel(getProjects());
        displayTasksByDueDate('Today');
    }
}




function getTodayTasks() {
    let todayTasks = getTodayTasksFromStorage();
    return todayTasks;
}


function getThisWeekTasks() {
    let thisWeekTasks = getThisWeekTasksFromStorage();
    return thisWeekTasks;
}


function getAllTasks() {
    let allTasks = getAllTasksFromStorage();
    return allTasks;
}




function createProject() {
    let projectName = document.getElementById('project-name-input').value;
    if (!validateProjectName(projectName)) {
        alert("A project of that name already exists")
        return;
    }
    let id = uuidv4();
    let name = projectName;
    let tasks = [];
    let newProject = Project(id, name, tasks);
    saveProject(newProject);
    let project = getProjectByName(projectName);
    renderProjectPanel(getProjects());
    displayProject(project);
    toggleProjectCreationModal();
}



function deleteProject(projectId) {
    deleteProjectFromStorage(projectId);
    renderProjectPanel(getProjects());
    displayTasksByDueDate('Today');
}




function createTask() {
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

    if (!validateTaskTitle(projectName, title)) {
        alert("Project already has a task of the same name")
        return;
    }

    let taskId = uuidv4();
    let projectId = getProjectByName(projectName).id;
    
    let newTask = Task(taskId, projectId, title, description, priority, dueDate, projectName);

    let projectToAddTaskTo = getProjectByName(projectName);
    projectToAddTaskTo.tasks.push(newTask);
    saveProject(projectToAddTaskTo);

    if (projectName == "Default") {
        if (isToday((parseISO(dueDate)))) displayTasksByDueDate("Today");
        else if (isThisWeek((parseISO(dueDate)))) displayTasksByDueDate("This Week");
        else displayTasksByDueDate("Show All");
    } else displayProject(getProjectByName(projectName))

    toggleTaskCreationModal();
}



function deleteTask(taskId, projectId) {
    let project = getProjectById(projectId);
    let task = project.tasks.find(task => task.id === taskId);
    let currentView = currentViewHeader.textContent;

    project.tasks.splice(project.tasks.indexOf(task), 1);
    saveProject(project);

    if (currentView != "Today" &&
        currentView != "This Week" &&
        currentView != "Show All") {
        currentView = currentView.slice(9);
    }

    if (currentView != getProjectById(projectId).name) {
        displayTasksByDueDate(currentView);
    } else displayProject(getProjectById(projectId));
}




function editTask(taskCard) {
    let taskId = taskCard.querySelector(".task-id").textContent;
    let projectId = taskCard.querySelector(".project-id").textContent;
    let newTitle = taskCard.querySelector(".edit-title").value;
    let newDescription = taskCard.querySelector(".edit-description").value;
    let newPriority = taskCard.querySelector(".edit-priority").value;
    let newDueDate = taskCard.querySelector(".edit-due-date").value;
    let newProjectName = taskCard.querySelector(".edit-project").value;
    if (newProjectName === '(empty)') newProjectName = 'Default'

    let project = getProjectById(projectId);
    let tasktoBeEdited = project.tasks.find(task => task.id === taskId);

    tasktoBeEdited.title = newTitle;
    tasktoBeEdited.description = newDescription;
    tasktoBeEdited.priority = newPriority;
    tasktoBeEdited.dueDate = newDueDate;

    if ((project.name != newProjectName)) {
        let newProject = getProjectByName(newProjectName);
        if (!validateTaskTitle(newProjectName, newTitle)) {
            alert('the new project already has a task with that name');
            return;
        }
        tasktoBeEdited.projectName = newProjectName;
        tasktoBeEdited.projectId = newProject.id;
        newProject.tasks.push(tasktoBeEdited);
        deleteTask(tasktoBeEdited.id, projectId);
        project = newProject;
    }

    saveProject(project);

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





function validateProjectName(projectName) {
    if (projectName == "") return false;
    for (let i = 0; i < localStorage.length; i++) {
        if (JSON.parse(localStorage.getItem(localStorage.key(i))).name === projectName) {
            return false;
        }
    }
    return true;
}

function validateTaskTitle(projectName, title) {
    if (title == "") return false;
    for (let i = 0; i < getProjectByName(projectName).tasks.length; i++) {
        if (getProjectByName(projectName).tasks[i].title === title) {
            return false;
        }
    }

    return true;
}






export {
    loadProjects,
    getProjectByName,
    getProjectById,
    deleteProject,
    getTodayTasks,
    getThisWeekTasks,
    getAllTasks,
    createProject,
    createTask,
    deleteTask,
    editTask
}
