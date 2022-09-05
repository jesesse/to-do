import { Task } from "./task";
import { Project } from "./project";
import { app } from "./app";

const UI = (function() {

    function loadHomePage() {
        const addTaskBtn = document.querySelector('.add-task');
        const addProjectBtn = document.querySelector('.add-project');
        const addTodayBtn = document.querySelector('.today');

    }

    function toggleTaskCreationModal() {
        
        let taskModal = document.querySelector('.task-modal');

        document.getElementById("dueDate").value = "";

        if (taskModal.style.display == "none") taskModal.style.display = "flex";
        else taskModal.style.display = "none"
    }

    return { toggleTaskCreationModal }
    
})();


export { UI }