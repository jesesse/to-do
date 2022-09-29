
import { Project } from "./project";
import { Task } from "./task";
import { v4 as uuidv4 } from 'uuid';
import {
    displayTasksByDueDate,
    displayProject,
    renderProjectPanel
} from "./UI";
import {
    getProjectFromStorageByName,
    getProjectFromStorageById,
    getAllProjectsFromStorage,
    getTodayTasksFromStorage,
    getThisWeekTasksFromStorage,
    getAllTasksFromStorage,
    saveProject,
    deleteProjectFromStorage
} from "./storage"



function loadProjects() {
    if (localStorage.length > 0) {
        renderProjectPanel();
        displayTasksByDueDate('Today');
    } else {
        createProject("Default");
        renderProjectPanel();
        displayTasksByDueDate('Today');
    }
}



function getProjectByName(projectName) {
    let project = getProjectFromStorageByName(projectName) 
    return project;

}

function getProjectById(projectId) {
    let project = getProjectFromStorageById(projectId)
    return project;
}

function getProjects() {
    let projectList = getAllProjectsFromStorage();
    return projectList;
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






function createProject(projectName) {
    if (!validateProjectName(projectName)) {
        alert("A project of that name already exists")
        return;
    }
    let id = uuidv4();
    let name = projectName;
    let tasks = [];
    let newProject = Project(id, name, tasks);
    saveProject(newProject);
}


function deleteProject(projectId) {
    deleteProjectFromStorage(projectId);
}








function createTask(title, priority, description, dueDate, projectName) {
    if (!validateTaskTitle(projectName, title)) return;
    let taskId = uuidv4();
    let projectId = getProjectByName(projectName).id;
    let newTask = Task(taskId, projectId, title, description, priority, dueDate, projectName);

    let projectToAddTaskTo = getProjectFromStorageByName(projectName);
    deleteProjectFromStorage(projectToAddTaskTo.id);

    projectToAddTaskTo.tasks.push(newTask);
    saveProject(projectToAddTaskTo);
}



function deleteTask(taskId, projectId, currentView) {
    let projectToDeleteTaskFrom = getProjectById(projectId);
    deleteProjectFromStorage(projectId);

    let taskToBeDeleted = projectToDeleteTaskFrom.tasks.find(task => task.id === taskId);
    projectToDeleteTaskFrom.tasks.splice(projectToDeleteTaskFrom.tasks.indexOf(taskToBeDeleted), 1);

    saveProject(projectToDeleteTaskFrom);
}


function editTask(taskId, projectId, newTitle, newDescription, newPriority, newDueDate, newProjectName, currentView) {
    let project = getProjectById(projectId);
    deleteProject(projectId);

    let tasktoBeEdited = project.tasks.find(task => task.id === taskId);

    // IF THE USER WANTS TO MOVE THE TASK TO A ANOTHER PROJECT; CHANGE THE PROJECTNAME AND PROJECTID OF THE TASK:
    // RETURN IF THE PROJECT USER WANTS TO MOVE THE TASK ALREADY HAS A TASK OF THE SAME TITLE
    if ((project.name != newProjectName)) {
        let newProject = getProjectByName(newProjectName);
        if (!validateTaskTitle(newProjectName, newTitle)) {
            alert('the new project already has a task with that name');
            return;
        }
        deleteProject(newProject.id);

        tasktoBeEdited.projectName = newProjectName;
        tasktoBeEdited.projectId = newProject.id;
        tasktoBeEdited.title = newTitle;
        tasktoBeEdited.description = newDescription;
        tasktoBeEdited.priority = newPriority;
        tasktoBeEdited.dueDate = newDueDate;

        newProject.tasks.push(tasktoBeEdited);
        project.tasks.splice(project.tasks.indexOf(tasktoBeEdited), 1);
        localStorage.setItem(newProject.id, JSON.stringify(newProject));
    }

    tasktoBeEdited.title = newTitle;
    tasktoBeEdited.description = newDescription;
    tasktoBeEdited.priority = newPriority;
    tasktoBeEdited.dueDate = newDueDate;

    localStorage.setItem(project.id, JSON.stringify(project));

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
    getProjects,
    deleteProject,
    getTodayTasks,
    getThisWeekTasks,
    getAllTasks,
    createProject,
    createTask,
    deleteTask,
    editTask
}

