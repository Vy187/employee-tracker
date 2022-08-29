const fetch = require(`node-fetch`)
const cTable = require(`console.table`);
const inquirer = require("inquirer");
const addDepartmentQuestion = {
    type: `input`,
    name: `department_name`,
    message: `What is the name of this new deparment?`,
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
    if (data.message === `success`) {
        console.table(data.data);
    } else {
        return data.data;
    }
}

const getAndRenderData = (selection, route) => getData(selection, route).then(renderData);

const fetchData = (method, selection, userInput, id) => {
    fetch(`http://localhost:3001/api/${selection}/${id}`, {
        method: `${method}`,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput)
    })
}

const fetchBurnerData = async (selection) => {
    unparsedData = await getAndRenderData(selection, ``);
    parsedData = [];
    parsedDataData = [];
    parsedIdData =[];

    for (i = 0; i < unparsedData.length; i++) {
        parsedDataData.push(unparsedData[i].data)
        parsedIdData.push(unparsedData[i].id)
    }

    parsedData.push(parsedIdData);
    parsedData.push(parsedDataData);

    return parsedData;
}

const postRoleBody = async () => {
    departmentsData = await fetchBurnerData(`department`);

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
            validate(answer) { return ((!/^[0-9]+$/.test(answer)) ? `Numbers should only contain numbers` : true) }
        },
        {
            type: `list`,
            name: `department_id`,
            message: `Which department does this role belong to?`,
            choices: departmentsData[1]
        }
    ]).then((answer) => {
        answer.department_id = departmentsData[0][departmentsData[1].indexOf(answer.department_id)];

        return answer;
    })

    return body;
}

const postEmployeeBody = async () => {
    rolesData = await fetchBurnerData(`role`);
    employeesData = await fetchBurnerData(`employee`);
    employeesData[1].push(`No Manager`) 

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
            choices: rolesData[1]
        },
        {
            type: `list`,
            name: `manager_id`,
            message: `Who manages this employee?`,
            choices: employeesData[1]
        }
    ]).then((answer) => {
        (answer.manager_id === `No Manager`) ? answer.manager_id = null : answer.manager_id = employeesData[0][employeesData[1].indexOf(answer.manager_id)];
        answer.role_id = rolesData[0][rolesData[1].indexOf(answer.role_id)];

        return answer;
    })

    return body;
}

const getId = async (selection) => {
    idData = await fetchBurnerData(selection);

    id = await inquirer.prompt(
        {
            type: `list`,
            name: `id`,
            message: `Select one from the following?`,
            choices: idData[1]
        }
    ).then((answer) => { return answer = idData[0][idData[1].indexOf(answer.id)]})
    
    return id;
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
                postEmployeeBody().then((body) => fetchData(`POST`, `employee`, body, ``)).then(app)
                break;
            case `Update Employee Role`:
                getId(`employee`);
                break;
            case `View All Roles`:
                getAndRenderData(`role`, `table`).then(app);
                break;
            case `Add Role`:
                postRoleBody().then((body) => fetchData(`POST`, `role`, body, ``)).then(app)
                break;
            case `View All Departments`:
                getAndRenderData(`department`, `table`).then(app);
                break;
            case `Add Department`:
                inquirer.prompt(addDepartmentQuestion).then((body) => fetchData(`POST`, `department`, body, ``)).then(app);
                break;
            default:
        }
    })
}

app();