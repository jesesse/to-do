import { Task } from "./task";
import { Project } from "./project";
import { app } from "./app";

const UI = (function () {

    function toggleTaskCreationModal() {
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
            let newProjectContainer = document.createElement('div');
            newProjectContainer.classList.add('project');
            newProjectContainer.textContent = app.getProjects()[i];
            projectPanel.appendChild(newProjectContainer);
        }
    }

    function viewProjects() {
        let mainView = document.querySelector('.main-view');
        while (mainView.lastChild) mainView.removeChild(mainView.lastChild);

        for (let i = 0; i < app.getTasks().length; i++) {
            let title = document.createElement('div');
            let priority = document.createElement('div')
            let dueDate = document.createElement('div');

            title.textContent = app.getTasks()[i].title;
            priority.textContent = app.getTasks()[i].priority;
            dueDate.textContent = app.getTasks()[i].dueDate;

            let taskCard = document.createElement('div');
            taskCard.classList.add('task');

            taskCard.appendChild(title);
            taskCard.appendChild(priority);
            taskCard.appendChild(dueDate);

            mainView.appendChild(taskCard);
        }
    }

    return {
        toggleTaskCreationModal,
        toggleProjectCreationModal,
        renderProjectPanel,
        viewProjects
    }

})();


export { UI }