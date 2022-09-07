import { Task } from "./task";
import { Project } from "./project";
import { app } from "./app";

const UI = (function () {

    function toggleTaskCreationModal() {
        if (!document.getElementById("dueDate").value == "") document.getElementById("dueDate").value = "";
        let addTaskBtn = document.querySelector('.add-task');
        let taskModal = document.querySelector('.task-modal');
        addTaskBtn.classList.toggle('hidden');
        taskModal.classList.toggle('hidden')
    }


    function toggleProjectCreationModal() {
        let addProjectBtn = document.querySelector('.add-project');
        let projectModal = document.querySelector('.project-modal');
        addProjectBtn.classList.toggle('hidden');
        projectModal.classList.toggle('hidden')
    }

    function renderProjectPanel() {
        let projectPanel = document.querySelector('.nav-project-panel');

        while (projectPanel.lastChild) projectPanel.removeChild(projectPanel.lastChild);

        for (let i = 0; i < app.getProjects().length; i++) {
            if (app.getProjects()[i].name == "Today" ||
                app.getProjects()[i].name == "This Week" ||
                app.getProjects()[i].name == "Show All") continue;

            let newProjectContainer = document.createElement('div');
            newProjectContainer.classList.add('project');
            newProjectContainer.setAttribute('id', newProjectContainer.textContent);
            newProjectContainer.textContent = app.getProjects()[i].name;
            projectPanel.appendChild(newProjectContainer);
            app.updateProjectEventHandlers()
        }
    }

    function viewProject(project) {

        let projectHeader = document.querySelector('.project-header');
        projectHeader.textContent = project.name;

        let mainView = document.querySelector('.main-view');
        while (mainView.lastChild) mainView.removeChild(mainView.lastChild);

        let projectTasks = app.getTasks(project);
        if (projectTasks.length == 0) return;

        for (let i = 0; i < projectTasks.length; i++) {
            let title = document.createElement('div');
            let priority = document.createElement('div')
            let dueDate = document.createElement('div');
            let projectName = document.createElement('div');

            title.textContent = projectTasks[i].title;
            priority.textContent = projectTasks[i].priority;
            dueDate.textContent = projectTasks[i].dueDate;
            projectName.textContent = projectTasks[i].projectName;

            console.log(projectTasks[i])

            let taskCard = document.createElement('div');
            taskCard.classList.add('task');

            taskCard.appendChild(title);
            taskCard.appendChild(priority);
            taskCard.appendChild(dueDate);
            taskCard.appendChild(projectName);;

            mainView.appendChild(taskCard);
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