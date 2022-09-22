import { Project } from "./project";
import { Task } from "./task";
import { UI } from "./UI";

import toDate from "date-fns/toDate";
import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";
import { v4 as uuidv4 } from 'uuid';


const app = (function () {

    let _projectList = [];
    

    function loadProjects() {
        //This is where there should be loading all the projects from localStorage, and if there is none, then create default Project:
        let id = uuidv4();
        let defaultProject = Project(id, "Default");
        _projectList.push(defaultProject);
        UI.renderProjectPanel();
        UI.displayTasksByDueDate("Today");
    }


    function getProject(projectName) {
        return _projectList.find(project => project.name == projectName);
    }

    function getProjectById(projectId){
        return _projectList.find(project => project.id == projectId);
    }
    

    function getProjects() {
        return _projectList;
    }

    function getProjectTasks(project) {
        return project.getTasks();
    }


    function getTodayTasks() {
        let todayTasks = [];
        _projectList.forEach(project => {
            for (let i = 0; i < project.getTasks().length; i++) {
                if (isToday((parseISO(project.getTasks()[i].dueDate)))) todayTasks.push(project.getTasks()[i])
            }
        });
        return todayTasks;
    }


    function getThisWeekTasks() {
        let thisWeekTasks = [];
        _projectList.forEach(project => {
            for (let i = 0; i < project.getTasks().length; i++) {
                if (isThisWeek((parseISO(project.getTasks()[i].dueDate)))) thisWeekTasks.push(project.getTasks()[i])
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







    function createProject(projectName) {
        if (projectName == "") return;
        for (let i = 0; i < _projectList.length; i++) {
            if (_projectList[i].name === projectName) {
                alert("cannot be same name");
                return;
            }
        }

        let id = uuidv4();
        let newProject = Project(id, projectName);
        _projectList.push(newProject);
        UI.renderProjectPanel();
        UI.displayProject(newProject);
    }


    function deleteProject(projectName) {
        let project = getProject(projectName);
        _projectList.splice(_projectList.indexOf(project), 1);
        console.log(_projectList)
        UI.renderProjectPanel();
        UI.displayTasksByDueDate("Today");
    }








    function createTask(title, priority, description, dueDate, projectName) {
        if (projectName == "Today" ||
            projectName == "This Week" ||
            projectName == "Show All") projectName = "Default";

        if(!checkTitleValidity(projectName, title)) return;
    
        let id = uuidv4();
        let projectId = getProject(projectName).id;

        let newTask = Task(id, projectId, title, description, priority, dueDate, projectName);
        
        getProject(projectName).addTask(newTask);

        UI.displayProject(getProject(projectName))
    }


    function deleteTask(taskTitle, projectName, currentView) {
        if (!(projectName == currentView) && projectName == "") {
            getProject("Default").deleteTask(taskTitle);
            UI.displayTasksByDueDate(currentView);
        } else if (!(projectName == currentView) && !(projectName == "")) {
            getProject(projectName).deleteTask(taskTitle);
            UI.displayTasksByDueDate(currentView);
        } else {
            getProject(projectName).deleteTask(taskTitle);
            UI.displayProject(getProject(projectName));
        }
    }

    function editTask(taskId, projectId, newTitle, newDescription, newPriority, newDueDate, newProjectName){
        let task = getProjectById(projectId).getTasks().find(task => task.id === taskId);

        if (!(getProjectById(projectId).name == newProjectName)) {
            if (newProjectName == "") newProjectName = "Default";
            task.projectName = newProjectName;
            task.projectId = getProject(newProjectName).id;
            getProject(newProjectName).addTask(task);
            getProjectById(projectId).deleteTask(task.name);  
        }
        task.title = newTitle;
        task.description = newDescription;
        task.priority = newPriority;
        task.dueDate = newDueDate;

        UI.displayProject(getProjectById(projectId));
    }




    function checkTitleValidity(projectName, title) {
        if (title == "") return false;
        for (let i = 0; i < getProject(projectName).getTasks().length; i++) {
            if (getProject(projectName).getTasks()[i].title === title) {
                return false;
            }
        }

        return true;
    }




    return {
        loadProjects,
        getProject,
        getProjects,
        getProjectTasks,
        deleteProject,
        getTodayTasks,
        getThisWeekTasks,
        getAllTasks,
        createProject,
        createTask,
        deleteTask,
        editTask
    }

})();

export { app }
