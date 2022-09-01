import { Task } from "./task";
import { storage } from "./storage";

function loadHomePage() {
    const addTaskBtn = document.querySelector('.add-task');
    const addProjectBtn = document.querySelector('.add-project');
    const addTodayBtn = document.querySelector('.today');

    addTaskBtn.addEventListener("click", taskCreationPopUp);
    addProjectBtn.addEventListener("click", createProject);
    addTodayBtn.addEventListener("click", viewToday)
}

function taskCreationPopUp(){
    let title = prompt('anna title');
    let priority = prompt("priority");
    let newTask = Task(title, priority);
    storage.addTask(newTask);
}

function viewToday(){
    let view = document.querySelector('.container');
    while (view.lastChild) view.removeChild(view.lastChild);

    for (let i = 0; i < storage.getTasks().length; i++) {
        let newTaskContainer = document.createElement('div');
        newTaskContainer.textContent = storage.getTasks()[i].title + " " + storage.getTasks()[i].priority;
        view.appendChild(newTaskContainer);
    }
}

function createProject(){
    alert("projekti");
}


export {loadHomePage}