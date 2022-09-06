import toDate from "date-fns/toDate";
import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";

const Task = (title, priority, dueDate, project) => {
   
    let projectName;
    
    if (!project == null || !project == "" || !project == undefined) projectName = project;
    else if (isToday((parseISO(dueDate))))projectName = "today";
    else if (isThisWeek((parseISO(dueDate)))) projectName = "week";
    else projectName = "all";

    return { title, priority, dueDate, projectName };

}

export { Task };