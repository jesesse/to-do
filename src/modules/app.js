
import { Project } from "./project";
import { Task } from "./task";
import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";
import { v4 as uuidv4 } from 'uuid';
import {
    displayTasksByDueDate,
    displayProject,
    renderProjectPanel
} from "./UI";




function loadProjects() {

    if (localStorage.length > 0) {
        renderProjectPanel();
        displayTasksByDueDate('Today');
    } else {
        createProject("Default");
    }
}


function getProject(projectName) {
    let project; 
    for (let i = 0; i < localStorage.length; i++) {
        let possibleProject = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (possibleProject.name === projectName) {
            project = possibleProject;
            break;
        };
    }
    return project;

}

function getProjectById(projectId) {
    let project;
    for (let i = 0; i < localStorage.length; i++) {
        let possibleProject = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (possibleProject.id === projectId) {
            project = possibleProject;
            break;
        };
    }
    return project;
}

function getProjects() {
    let projectList = [];
    for (let i = 0; i < localStorage.length; i++) {
        let project = JSON.parse(localStorage.getItem(localStorage.key(i)));
        projectList.push(project);
    }
    return projectList;
}

function getTodayTasks() {
    let todayTasks = [];
    for (let i = 0; i < localStorage.length; i++) {
        let project = JSON.parse(localStorage.getItem(localStorage.key(i)));
        for (let i = 0; i < project.tasks.length; i++) {
            if (isToday((parseISO(project.tasks[i].dueDate)))) todayTasks.push(project.tasks[i])
        }
    }

    return todayTasks;
}


function getThisWeekTasks() {
    let thisWeekTasks = [];
    for (let i = 0; i < localStorage.length; i++) {
        let project = JSON.parse(localStorage.getItem(localStorage.key(i)));
        for (let i = 0; i < project.tasks.length; i++) {
            if (isThisWeek((parseISO(project.tasks[i].dueDate)))) thisWeekTasks.push(project.tasks[i])
        }
    }

    return thisWeekTasks;
}


function getAllTasks() {
    let allTasks = [];
    for (let i = 0; i < localStorage.length; i++) {
        let project = JSON.parse(localStorage.getItem(localStorage.key(i)));
        for (let i = 0; i < project.tasks.length; i++) {
            allTasks.push(project.tasks[i])
        }
    }
    return allTasks;
}









function createProject(projectName) {
    if (projectName == "") return;
    for (let i = 0; i < localStorage.length; i++) {
        if (JSON.parse(localStorage.getItem(localStorage.key(i))).name === projectName) return;
    }

    let id = uuidv4();
    let name = projectName;
    let tasks = [];
    let newProject = Project(id, name, tasks);

    localStorage.setItem(id, JSON.stringify(newProject));

    renderProjectPanel();

    if (projectName === 'Default') displayTasksByDueDate('Today');
    else displayProject(newProject);
}


function deleteProject(projectId) {
    for (let i = 0; i < localStorage.length; i++) {
        let project = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (project.id === projectId) {
            localStorage.removeItem(project.id);
            break;
        }
    }
}











function createTask(title, priority, description, dueDate, currentView) {
    let projectName;
    if (currentView == "Today" ||
        currentView == "This Week" ||
        currentView == "Show All") {
        projectName = "Default";
    } else projectName = currentView.slice(9);

    if (!checkTitleValidity(projectName, title)) return;

    let projectToAddTaskTo = getProject(projectName);
    deleteProject(projectToAddTaskTo.id)

    let taskId = uuidv4();
    let projectId = projectToAddTaskTo.id;
    let newTask = Task(taskId, projectId, title, description, priority, dueDate, projectName);
    projectToAddTaskTo.tasks.push(newTask);

    localStorage.setItem(projectToAddTaskTo.id, JSON.stringify(projectToAddTaskTo));


    if (projectToAddTaskTo.name == "Default") {
        if (isToday((parseISO(newTask.dueDate)))) displayTasksByDueDate("Today");
        else if (isThisWeek((parseISO(newTask.dueDate)))) displayTasksByDueDate("This Week");
        else displayTasksByDueDate("Show All");
    } else displayProject(projectToAddTaskTo)

}



function deleteTask(taskId, projectId, currentView) {
    let projectToDeleteTaskFrom = getProjectById(projectId);
    deleteProject(projectId);

    let taskToBeDeleted = projectToDeleteTaskFrom.tasks.find(task => task.id === taskId);
    projectToDeleteTaskFrom.tasks.splice(projectToDeleteTaskFrom.tasks.indexOf(taskToBeDeleted), 1);


    localStorage.setItem(projectToDeleteTaskFrom.id, JSON.stringify(projectToDeleteTaskFrom));

    if (currentView != "Today" &&
        currentView != "This Week" &&
        currentView != "Show All") {
        currentView = currentView.slice(9);
    }

    if (currentView != getProjectById(projectId).name) {
        displayTasksByDueDate(currentView);

    } else displayProject(getProjectById(projectId));

}


function editTask(taskId, projectId, newTitle, newDescription, newPriority, newDueDate, newProjectName, currentView) {
    let project = getProjectById(projectId);
    deleteProject(projectId);

    let tasktoBeEdited = project.tasks.find(task => task.id === taskId);

    // IF THE USER WANTS TO MOVE THE TASK TO A ANOTHER PROJECT; CHANGE THE PROJECTNAME AND PROJECTID OF THE TASK:
    // RETURN IF THE PROJECT USER WANTS TO MOVE THE TASK ALREADY HAS A TASK OF THE SAME TITLE
    if ((project.name != newProjectName)) {
        let newProject = getProject(newProjectName);
        if (!checkTitleValidity(newProjectName, newTitle)) {
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







function checkTitleValidity(projectName, title) {
    if (title == "") return false;
    for (let i = 0; i < getProject(projectName).tasks.length; i++) {
        if (getProject(projectName).tasks[i].title === title) {
            return false;
        }
    }

    return true;
}




export {
    loadProjects,
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

