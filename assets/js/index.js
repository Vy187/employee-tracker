const fetch = require(`node-fetch`)
const cTable = require(`console.table`);
const inquirer = require("inquirer");
const addDepartmentQuestion = {
    type: `input`,
    name: `department_name`,
    message: `What is the name of this new deparment`,
    validate(answer) { return ((!/^[a-zA-Z\s]+$/.test(answer) || answer.trim().length < 3) ? `Department names contain letters or longer than 2 letters` : true) }
}

const getData = (selection, route) =>
    fetch(`http://localhost:3001/api/${selection}/${route}`, {
        method: `GET`,
        headers: {
            'Content-Type': 'application/json'
        }
    })

const renderData = async (results) => {
    const data = await results.json();
    if (typeof data.data[0].id !== 'undefined') {
        console.table(data.data);
    } else {
        return data.data;
    }
}

const getAndRenderData = (selection, route) => getData(selection, route).then(renderData);

const addData = (selection, userInput) => {
    fetch(`http://localhost:3001/api/${selection}/`, {
        method: `POST`,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput)
    })
}

const postRoleBody = async () => {
    departmentsData = await getAndRenderData(`department`, ``);
    departments = []

    for (i = 0; i < departmentsData.length; i++) {
        departments.push(departmentsData[i].department_name)
    }

    body = await inquirer.prompt([
        {
            type: `input`,
            name: `title`,
            message: `What is the name of this new role`,
            validate(answer) { return ((!/^[a-zA-Z\s]+$/.test(answer) || answer.trim().length < 3) ? `Role names contain letters or longer than 2 letters` : true) }
        },
        {
            type: `input`,
            name: `salary`,
            message: `What the salary of this role?`,
            validate(answer) {return ((!/^[0-9]+$/.test(answer)) ? `Numbers should only contain numbers` : true)}
        },
        {
            type: `list`,
            name: `department_id`,
            message: `Which department does this role belong to?`,
            choices: departments
        }
    ]).then((answer) => {
        answer.department_id = departments.indexOf(answer.department_id) + 1;
        return answer;
    })

    return body;
}

const postEmployeeBody = async () => {
    rolesData = await getAndRenderData(`role`, ``);
    employeesData = await getAndRenderData(`employee`, ``);
    roles = []
    employees = [`No Manager`]

    for (i = 0; i < rolesData.length; i++) {
        roles.push(rolesData[i].title)
    }

    for (i = 0; i < employeesData.length; i++) {
        employees.push(employeesData[i].full_name)
    }

    body = await inquirer.prompt([
        {
            type: `input`,
            name: `first_name`,
            message: `What is the first name of this new employee`,
            validate(answer) { return ((!/^[a-zA-Z]+$/.test(answer) || answer.trim().length < 3) ? `Names contain letters or longer than 2 letters` : true) }
        },
        {
            type: `input`,
            name: `last_name`,
            message: `What is the last name of this new employee`,
            validate(answer) { return ((!/^[a-zA-Z]+$/.test(answer) || answer.trim().length < 3) ? `Names contain letters or longer than 2 letters` : true) }
        },
        {
            type: `list`,
            name: `role_id`,
            message: `What role does this employee take a part in?`,
            choices: roles
        },
        {
            type: `list`,
            name: `manager_id`,
            message: `Who manages this employee?`,
            choices: employees
        }
    ]).then((answer) => {
        (answer.manager_id === `No Manager`) ? answer.manager_id = null : answer.manager_id = employees.indexOf(answer.manager_id);
        answer.role_id = roles.indexOf(answer.role_id) + 1;
        return answer;
    })

    return body;
}

const app = async () => {
    await inquirer.prompt({
        type: `list`,
        name: `choice`,
        message: `What would you like to do?`,
        choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Department`, `Quit`]
    }).then((answer) => {
        switch (answer.choice) {
            case `View All Employees`:
                getAndRenderData(`employee`, `table`).then(app);
                break;
            case `Add Employee`:
                postEmployeeBody().then((body) => addData(`employee`, body)).then(app)
                break;
            case `Update Employee Role`:

                break;
            case `View All Roles`:
                getAndRenderData(`role`, `table`).then(app);
                break;
            case `Add Role`:
                postRoleBody().then((body) => addData(`role`, body)).then(app)
                break;
            case `View All Departments`:
                getAndRenderData(`department`, `table`).then(app);
                break;
            case `Add Department`:
                inquirer.prompt(addDepartmentQuestion).then((answer) => addData(`department`, answer)).then(app);
                break;
            default:

                break;
        }
    })
}

app();