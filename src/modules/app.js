import { Project } from "./project";
import { Task } from "./task";
import { UI } from "./UI";

import toDate from "date-fns/toDate";
import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";


const app = (function () {

    let _projectList = [];

    function loadProjects() {
        //This is where there should be loading all the projects from localStorage, and if there is none, then create default Project:
        let defaultProject = Project("Default");
        _projectList.push(defaultProject);
        UI.displayTasksByDueDate("Today");
    }


    function getTodayTasks() {
        let todayTasks = [];
        _projectList.forEach(project => {
            for (let i = 0; i < project.getTasks().length; i++) {
                if (isToday((parseISO(dueDate)))) todayTasks.push(project.getTasks()[i])
            }
        });
        return todayTasks;
    }


    function getThisWeekTasks() {
        let thisWeekTasks = [];
        _projectList.forEach(project => {
            for (let i = 0; i < project.getTasks().length; i++) {
                if (isThisWeek((parseISO(dueDate)))) thisWeekTasks.push(project.getTasks()[i])
            }
        });
        return thisWeekTasks;
    }


    function getAllTasks() {
        let allTasks = [];
        _projectList.forEach(project => {
            for (let i = 0; i < project.getTasks().length; i++) {
                allTasks.push(project.getTasks()[i])
            }
        });
        return allTasks;
    }

    function getProject(projectName) {
        return _projectList.find(project => project.name == projectName);
    }


    function createTask(title, priority, dueDate, projectName) {
        if (projectName == "Today" ||
            projectName == "This Week" ||
            projectName == "Show All") projectName = "Default";

        let newTask = Task(title, priority, dueDate, projectName);
        getProject(projectName).addTask(newTask);
    }


    return {
        loadProjects,
        getTodayTasks,
        getThisWeekTasks,
        getAllTasks,
        createTask
    }

})();

export { app }
