
import { Project } from "./project";
import { Task } from "./task";
import { v4 as uuidv4 } from 'uuid';
import {
    displayTasksByDueDate,
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


function deleteProject(project) {
    deleteProjectFromStorage(project);
}








function createTask(title, priority, description, dueDate, projectName) {
    if (!validateTaskTitle(projectName, title)) return;
    let taskId = uuidv4();
    let projectId = getProjectByName(projectName).id;
    let newTask = Task(taskId, projectId, title, description, priority, dueDate, projectName);

    let projectToAddTaskTo = getProjectFromStorageByName(projectName);
    projectToAddTaskTo.tasks.push(newTask);
    saveProject(projectToAddTaskTo);
}



function deleteTask(taskId, projectId) {
    let project = getProjectById(projectId);
    let task = project.tasks.find(task => task.id === taskId);
    project.tasks.splice(project.tasks.indexOf(task), 1);
    saveProject(project);
}


function editTask(taskId, projectId, newTitle, newDescription, newPriority, newDueDate, newProjectName) {
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

