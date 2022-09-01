import { Task } from "./task";
import { storage } from "./storage";

function loadHomePage() {
    const addTaskBtn = document.querySelector('.add-task');
    const addProjectBtn = document.querySelector('.add-project');
    const addTodayBtn = document.querySelector('.today');

    addTaskBtn.addEventListener("click", taskCreationPopUp);
    addProjectBtn.addEventListener("click", createProject);
    addTodayBtn.addEventListener("click", viewProjects)

    viewProjects();
}


function taskCreationPopUp(){
    let title = prompt('anna title');
    let priority = prompt("priority");
    let newTask = Task(title, priority);
    storage.addTask(newTask);

    //jos newTask.data on tänään:
    viewProjects();
}

function viewProjects(projectName) {

    if (projectName == null ) {
    
        let taskContainer = document.querySelector('.task-container');

        while (taskContainer.lastChild) taskContainer.removeChild(taskContainer.lastChild);

        for (let i = 0; i < storage.getTasks().length; i++) {
            let newTaskCard = document.createElement('div');
            let title = document.createElement('p');
            let priority = document.createElement('p');
            let deleteBtn = document.createElement('div');
        
            newTaskCard.classList.add('task');
            newTaskCard.setAttribute('id', i);
            title.classList.add('title');
            priority.classList.add('priority');
            deleteBtn.classList.add('delete')

            title.textContent = "TITLE: " + storage.getTasks()[i].title;
            priority.textContent = "PRIORITY: " + storage.getTasks()[i].priority;

            deleteBtn.addEventListener("click", deleteTask);

            newTaskCard.appendChild(title);
            newTaskCard.appendChild(priority);
            newTaskCard.appendChild(deleteBtn);

            taskContainer.appendChild(newTaskCard);
        }
    }
}

function createProject(){
    alert("projekti");
}

function deleteTask() {
    storage.removeTask(this.parentNode.id);
    viewProjects();
}


export {loadHomePage}