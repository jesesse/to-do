import { Task } from "./task";
import { Project } from "./project";
import { app } from "./app";

const UI = (function () {

    function toggleTaskCreationModal() {
        let addTaskBtn = document.querySelector('.add-task');
        let taskModal = document.querySelector('.task-modal');
        addTaskBtn.classList.toggle('hidden');
        taskModal.classList.toggle('hidden')
        document.getElementById("title").value = "";
        document.getElementById("priority").value = "";
        document.getElementById("dueDate").value = "";
    }


    function toggleProjectCreationModal() {
        let addProjectBtn = document.querySelector('.add-project');
        let projectModal = document.querySelector('.project-modal');
        addProjectBtn.classList.toggle('hidden');
        projectModal.classList.toggle('hidden');
        document.getElementById("project-name").value = "";
    }


    //RENDERS PROJECT PANEL EVERYTIME A NEW PROJECT IS CREATED, OR EXISTING PROJECT DELETED
    function renderProjectPanel() {
        let projectPanel = document.querySelector('.nav-project-panel');

        while (projectPanel.lastChild) projectPanel.removeChild(projectPanel.lastChild);

        for (let i = 0; i < app.getProjects().length; i++) {
            if (app.getProjects()[i].name == "Today" ||
                app.getProjects()[i].name == "This Week" ||
                app.getProjects()[i].name == "Show All") continue;

            let newProjectContainer = document.createElement('div');
            let removeButton = document.createElement('div');

            newProjectContainer.classList.add('project');
            removeButton.classList.add('remove-project');
            
            newProjectContainer.textContent = app.getProjects()[i].name;
            
            newProjectContainer.appendChild(removeButton);
            projectPanel.appendChild(newProjectContainer);
            
            app.updateProjectEventHandlers()
        }
    }


    function viewProject(project) {
        if (project == undefined) project = app.getProjects().find(project => project.name === "Today"); 

        let projectHeader = document.querySelector('.project-header');
        projectHeader.textContent = project.name;

        viewTasks(project);
    }


    function viewTasks(project){

        let mainView = document.querySelector('.main-view');
        while (mainView.lastChild) mainView.removeChild(mainView.lastChild);
        if (project.getTasks().length == 0) return;

        for (let i = 0; i < project.getTasks().length; i++) {
            let taskCard = document.createElement('div');
            let title = document.createElement('div');
            let priority = document.createElement('div');
            let projectName = document.createElement('div');
            let dueDate = document.createElement('div');
            let removeTask = document.createElement('div');

            taskCard.classList.add('task-card');
            removeTask.classList.add('remove-task');
            
            title.textContent = project.getTasks()[i].title;
            priority.textContent = `PRIORITY: ${project.getTasks()[i].priority}`;
            projectName.textContent = `PROJECT: ${project.getTasks()[i].projectName}`;
            dueDate.textContent = `DUE DATE: ${project.getTasks()[i].dueDate}`;

            taskCard.appendChild(title);
            taskCard.appendChild(priority);
            taskCard.appendChild(projectName);;
            taskCard.appendChild(dueDate);
            taskCard.appendChild(removeTask);
            mainView.appendChild(taskCard);

            app.updateTaskEventHandlers();
        }
    }

    return {
        toggleTaskCreationModal,
        toggleProjectCreationModal,
        renderProjectPanel,
        viewProject
    }

})();


export { UI }