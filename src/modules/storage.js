import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";

function getProjectByName(projectName) {
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

function getTodayTasksFromStorage() {
    let todayTasks = [];
    for (let i = 0; i < localStorage.length; i++) {
        let project = JSON.parse(localStorage.getItem(localStorage.key(i)));
        for (let i = 0; i < project.tasks.length; i++) {
            if (isToday((parseISO(project.tasks[i].dueDate)))) todayTasks.push(project.tasks[i])
        }
    }
    return todayTasks;
}

function getThisWeekTasksFromStorage() {
    let thisWeekTasks = [];
    for (let i = 0; i < localStorage.length; i++) {
        let project = JSON.parse(localStorage.getItem(localStorage.key(i)));
        for (let i = 0; i < project.tasks.length; i++) {
            if (isThisWeek((parseISO(project.tasks[i].dueDate)))) thisWeekTasks.push(project.tasks[i])
        }
    }

    return thisWeekTasks;
}

function getAllTasksFromStorage() {
    let allTasks = [];
    for (let i = 0; i < localStorage.length; i++) {
        let project = JSON.parse(localStorage.getItem(localStorage.key(i)));
        for (let i = 0; i < project.tasks.length; i++) {
            allTasks.push(project.tasks[i])
        }
    }
    return allTasks;
}

function saveProject(project) {
    localStorage.setItem(project.id, JSON.stringify(project));
}

function deleteProjectFromStorage(projectId) {
    localStorage.removeItem(projectId);
}




export {
    getProjectByName,
    getProjectById,
    getProjects,
    getTodayTasksFromStorage,
    getThisWeekTasksFromStorage,
    getAllTasksFromStorage,
    saveProject,
    deleteProjectFromStorage
}