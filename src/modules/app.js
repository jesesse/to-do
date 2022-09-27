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
       createProject("Default");
    }


    function getProject(projectName) {
        return _projectList.find(project => project.name == projectName);
    }

    function getProjectById(projectId) {
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
        let name = projectName;
        let newProject = Project(id, name);
        _projectList.push(newProject);
        
        UI.renderProjectPanel();
        if (projectName === 'Default') UI.displayTasksByDueDate('Today');
        else UI.displayProject(newProject);
    }




    function deleteProject(projectName) {
        let project = getProject(projectName);
        _projectList.splice(_projectList.indexOf(project), 1);
        console.log(_projectList)
        UI.renderProjectPanel();
        UI.displayTasksByDueDate("Today");
    }








    function createTask(title, priority, description, dueDate, currentView) {
        let projectName;
        if (currentView == "Today" ||
            currentView == "This Week" ||
            currentView == "Show All") {
                projectName = "Default";
            } else projectName = currentView;
            

        if (!checkTitleValidity(projectName, title)) return;

        let id = uuidv4();
        let projectId = getProject(projectName).id;
        let newTask = Task(id, projectId, title, description, priority, dueDate, projectName);
        getProject(projectName).addTask(newTask);

        if (projectName == "Default") {
            if (isToday((parseISO(newTask.dueDate)))) UI.displayTasksByDueDate("Today");
            else if (isThisWeek((parseISO(newTask.dueDate)))) UI.displayTasksByDueDate("This Week");
            else UI.displayTasksByDueDate("Show All");
        } else UI.displayProject(getProject(projectName))
    }


    function deleteTask(taskId, projectId, currentView) {
        let taskToBeDeleted = getProjectById(projectId).getTasks().find(task => task.id === taskId);
        getProjectById(projectId).deleteTask(taskToBeDeleted);
       
        if (currentView != getProjectById(projectId).name) {
            UI.displayTasksByDueDate(currentView);

        } else UI.displayProject(getProjectById(projectId));

    }

    function editTask(taskId, projectId, newTitle, newDescription, newPriority, newDueDate, newProjectName, currentView) {
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

        if (currentView != getProjectById(projectId).name) {
            UI.displayTasksByDueDate(currentView);

        } else UI.displayProject(getProjectById(projectId));

        // TARVITAAN CURRENT VIEW; ELI MISSÄ VIEWISSA TARKASTELEN PROJEKTIA / TASKEJA; JOTTA JOS VAIHDATA VIIKONPÄIVÄ VIEWISSÄ TASKIN TOISEEN PROJEKTIIN NIIN VIEWI SÄILYY SILTI VIIKONPÄIVÄSSÄ; EIKÄ SIIRRY VANHAN PROJEKTIN NÄKYMÄÄN JOSSA TASKI OLI. KIMURANTTIA!
        // if (getProjectById(projectId).name == "Default") {
        //     if (isToday((parseISO(task.dueDate)))) UI.displayTasksByDueDate("Today");
        //     else if (isThisWeek((parseISO(task.dueDate)))) UI.displayTasksByDueDate("This Week");
        //     else UI.displayTasksByDueDate("Show All");
        // } else UI.displayProject(getProjectById(projectId));
        


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
