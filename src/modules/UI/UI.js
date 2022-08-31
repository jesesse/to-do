function initialize() {
    let header = document.createElement('div');
    let headerH1 = document.createElement('h1');
    let navBar = document.createElement('div');
    let navTaskContainer = document.createElement('div');
    let navProjectContainer = document.createElement('div');
    let addTaskBtn = document.createElement('div');
    let addProjectBtn = document.createElement('div');
    let today = document.createElement('div');
    let thisWeek = document.createElement('div');
    let thisMonth = document.createElement('div');
    let main = document.createElement('div');

    header.classList.add('header');
    headerH1.classList.add("header-h1");
    navBar.classList.add('nav-bar');
    navTaskContainer.classList.add('nav-task-container');
    addTaskBtn.classList.add('add-task');
    navProjectContainer.classList.add('nav-project-container');
    addProjectBtn.classList.add('add-project');
    today.classList.add('today');
    thisWeek.classList.add('this-week');
    thisMonth.classList.add('this-month');
    main.classList.add('main');

    headerH1.textContent = "TO-DO";
    addTaskBtn.textContent = "+ Add a task";
    addProjectBtn.textContent = "+ Add a project";
    today.textContent = "Today";
    thisWeek.textContent = "This week";
    thisMonth.textContent = "This month";

    header.appendChild(headerH1);
    navTaskContainer.appendChild(addTaskBtn);
    navTaskContainer.appendChild(today);
    navTaskContainer.appendChild(thisWeek);
    navTaskContainer.appendChild(thisMonth);
    navProjectContainer.appendChild(addProjectBtn);
    navBar.appendChild(navTaskContainer);
    navBar.appendChild(navProjectContainer);
    document.body.appendChild(header);
    document.body.appendChild(navBar);
    document.body.appendChild(main);
}

export {initialize}