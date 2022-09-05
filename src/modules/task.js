
const Task = (title, priority, dueDate, project) => {
   
    let projectName;
    
    if (!project == null || !project == "") projectName = project;
    else projectName = ""

    return { title, priority, dueDate, projectName };

}

export { Task };