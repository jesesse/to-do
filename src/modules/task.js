
import toDate from "date-fns/toDate";
import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";
import parseISO from "date-fns/parseISO";

const Task = (title, priority, dueDate, projectName) => {

    if (projectName == "Today" || projectName == "This Week" || projectName == "Show All") {
        if (isToday((parseISO(dueDate)))) projectName = "Today";
        else if (isThisWeek((parseISO(dueDate)))) projectName = "This Week";
        else projectName = "Show All";
    }


    return { title, priority, dueDate, projectName };
}



export { Task };