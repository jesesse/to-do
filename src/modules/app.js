import { Project } from "./project";
import { Task } from "./task";
import { UI } from "./UI";


const app = (function () {

    let _projectList = [];

    //DECALRE ALL CLICKABLE UI ELEMENTS
    let addTaskBtn = document.querySelector('.add-task');
    let createTaskBtn = document.querySelector('.create-task');
    let addProjectBtn = document.querySelector('.add-project');
    let createProjectBtn = document.querySelector('.create-project');
   

    // SET ALL EVENT LISTENERS
    addProjectBtn.addEventListener("click", UI.toggleProjectCreationModal);
    addTaskBtn.addEventListener("click", UI.toggleTaskCreationModal);
    createProjectBtn.addEventListener("click", createProject);
    createTaskBtn.addEventListener("click", createTask);

    //Updates EventHandlers on load page and every time new project is created
    function updateProjectEventHandlers() {
        let projects = document.querySelectorAll('.project');
        projects.forEach(project => project.addEventListener("click", viewProject));

        let deleteProjectBtns = document.querySelectorAll('.remove-project');
        deleteProjectBtns.forEach(btn => btn.addEventListener("click", deleteProject));
    }

    //Updates EventHandlers on load page and every time new task is created
    function updateTaskEventHandlers() {
        let removeTaskBtns = document.querySelectorAll('.remove-task');
        removeTaskBtns.forEach(btn => btn.addEventListener("click", removeTask));
    }
        
    

    function loadProjects() {
        //createDefaultProjects if not in memory: eg. if local storageis empty
        loadDefaultProjects();
        updateProjectEventHandlers();
    }


    function loadDefaultProjects() {
        _projectList.push(Project("Today"));
        _projectList.push(Project("This Week"));
        _projectList.push(Project("Show All"));
    }


    function getProjects() {
        return _projectList;
    }


    function viewProject(e) {
        let projectName = e.target.textContent;
        let clickedProject = getProjects().find(project => project.name === projectName);
        UI.viewProject(clickedProject);
    }


    function createTask() {
        let title = document.getElementById("title").value;
        let priority = document.getElementById("priority").value;
        let dueDate = document.getElementById("dueDate").value;
        let projectName = document.querySelector('.project-header').textContent;

        let newTask = Task(title, priority, dueDate, projectName);

        let project = getProjects().find(project => project.name === projectName);

        project.setTask(newTask);

        UI.toggleTaskCreationModal();
        UI.viewProject(getProjects().find(project => project.name === projectName));
    }


    function createProject() {
        let projectNameInput = document.getElementById("project-name").value;
        if (projectNameInput == "" || projectNameInput == null) return;

        let newProject = Project(projectNameInput);
        _projectList.push(newProject);

        UI.toggleProjectCreationModal();
        UI.renderProjectPanel();
        UI.viewProject(newProject);
    }


    function deleteProject(e) {
        let projectName = e.target.textContent;
        let projectToDelete = getProjects().find(project => project.name === projectName);
        _projectList.splice(_projectList.indexOf(projectToDelete), 1);
        UI.renderProjectPanel();
    }

    function removeTask(e){
        let projectName = document.querySelector('.project-header').textContent;
        let project = getProjects().find(project => project.name === projectName);
        let taskName = e.target.parentNode.firstChild.textContent;
        project.deleteTask(taskName);
        UI.viewProject(project);
    }


    return {
        loadProjects,
        createTask,
        getProjects,
        updateProjectEventHandlers,
        updateTaskEventHandlers,
        deleteProject
    }

})();

export { app }
