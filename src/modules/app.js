import { Project } from "./project";
import { Task } from "./task";
import {
    displayTasksByDueDate,
    displayProject,
    renderProjectPanel
} from "./UI";

import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";
import { v4 as uuidv4 } from 'uuid';




function loadProjects() {

    localStorage.clear();
    if (localStorage.length > 0) {
        renderProjectPanel();
        displayTasksByDueDate('Today');
    } else {
        let projectList = [];
        localStorage.setItem("projectList", JSON.stringify(projectList));
        createProject("Default");
    }
}


function getProject(projectName) {
    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    return currentProjectList.find(project => project.name == projectName);
}

function getProjectById(projectId) {
    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    return currentProjectList.find(project => project.id == projectId);
}

function getProjects() {
    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    return currentProjectList;
  
}

function getTodayTasks() {
    let todayTasks = [];
    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    currentProjectList.forEach(project => {
        for (let i = 0; i < project.tasks.length; i++) {
            if (isToday((parseISO(project.tasks[i].dueDate)))) todayTasks.push(project.tasks[i])
        }
    });
    return todayTasks;
}


function getThisWeekTasks() {
    let thisWeekTasks = [];
    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    currentProjectList.forEach(project => {
        for (let i = 0; i < project.tasks.length; i++) {
            if (isThisWeek((parseISO(project.tasks[i].dueDate)))) thisWeekTasks.push(project.tasks[i])
        }
    });
    return thisWeekTasks;
}


function getAllTasks() {
    let allTasks = [];
    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    currentProjectList.forEach(project => {
        for (let i = 0; i < project.tasks.length; i++) {
            allTasks.push(project.tasks[i])
        }
    });
    return allTasks;
}









function createProject(projectName) {
    if (projectName == "") return;
    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    for (let i = 0; i < currentProjectList.length; i++) {
        if (currentProjectList[i].name === projectName) {
            alert("cannot be same name");
            return;
        }
    }

    let id = uuidv4();
    let name = projectName;
    let tasks = [];
    let newProject = Project(id, name, tasks);

    currentProjectList.push(newProject);
    localStorage.setItem("projectList", JSON.stringify(currentProjectList));

    renderProjectPanel();

    if (projectName === 'Default') displayTasksByDueDate('Today');
    else displayProject(newProject);
}


function deleteProject(projectId) {
    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    let projectToDelete = currentProjectList.find(project => project.id === projectId);
    currentProjectList.splice(currentProjectList.indexOf(projectToDelete), 1);
    localStorage.removeItem("projectList");
    localStorage.setItem("projectList", JSON.stringify(currentProjectList));
    renderProjectPanel();
    displayTasksByDueDate('Today');
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
    let taskId = uuidv4();
    let projectId = projectToAddTaskTo.id;
    let newTask = Task(taskId, projectId, title, description, priority, dueDate, projectName);

    
    //UPDATE LOCAL STORAGE PROJECT LIST WITH ADDED TASK: REMOVE THE WHOLE OLD LIST; THEN ADD THE SAME LIST WITH UPDATED PROJECT WITH THE NEW TASK
    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    localStorage.removeItem("projectList");
    let index = currentProjectList.indexOf(projectToAddTaskTo);
    currentProjectList.splice(index, 1);
    projectToAddTaskTo.tasks.push(newTask);
    currentProjectList.push(projectToAddTaskTo);
    localStorage.setItem("projectList", JSON.stringify(currentProjectList));


    if (projectToAddTaskTo.name == "Default") {
        if (isToday((parseISO(newTask.dueDate)))) displayTasksByDueDate("Today");
        else if (isThisWeek((parseISO(newTask.dueDate)))) displayTasksByDueDate("This Week");
        else displayTasksByDueDate("Show All");
    } else displayProject(projectToAddTaskTo)

}


function deleteTask(taskId, projectId, currentView) {
    let taskToBeDeleted = getProjectById(projectId).tasks.find(task => task.id === taskId);
    let projectToDeleteTaskFrom = getProjectById(projectId);
    projectToDeleteTaskFrom.tasks.splice(projectToDeleteTaskFrom.tasks.indexOf(taskToBeDeleted), 1);

    let currentProjectList = JSON.parse(localStorage.getItem("projectList"));
    localStorage.removeItem("projectList");
    currentProjectList.splice(currentProjectList.indexOf(projectToDeleteTaskFrom), 1);
    currentProjectList.push(projectToDeleteTaskFrom);
    localStorage.setItem("projectList", JSON.stringify(currentProjectList));

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
    let task = project.getTaskById(taskId);

    // IF THE USER WANTS TO MOVE THE TASK TO A ANOTHER PROJECT; CHANGE THE PROJECTNAME AND PROJECTID OF THE TASK:
    // RETURN IF THE PROJECT USER WANTS TO MOVE THE TASK ALREADY HAS A TASK OF THE SAME TITLE
    if ((project.name != newProjectName)) {
        let newProject = getProject(newProjectName);
        if (!checkTitleValidity(newProjectName, newTitle)) {
            alert('the new project already has a task with that name');
            return;
        }

        task.projectName = newProjectName;
        task.projectId = newProject.id;

        newProject.addTask(task);
        project.deleteTask(task);
    }

    task.title = newTitle;
    task.description = newDescription;
    task.priority = newPriority;
    task.dueDate = newDueDate;


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

