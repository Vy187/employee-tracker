const fetch = require(`node-fetch`);
const cTable = require(`console.table`);
const inquirer = require("inquirer");
const addDepartmentQuestion = {
    type: `input`,
    name: `department_name`,
    message: `What is the name of this new deparment?`,
    validate(answer) { return ((!/^[a-zA-Z\s]+$/.test(answer) || answer.trim().length < 3) ? `Department names contain letters or longer than 2 letters` : true) }
}

const getOrDeleteData = (method, selection, route) =>
    fetch(`http://localhost:3001/api/${selection}/${route}`, {
        method: `${method}`,
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

const getAndRenderData = (selection, route) => getOrDeleteData(`GET`, selection, route).then(renderData);

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
    parsedIdData = [];

    for (i = 0; i < unparsedData.length; i++) {
        parsedDataData.push(unparsedData[i].data);
        parsedIdData.push(unparsedData[i].id);
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
            message: `What is the name of this new role?`,
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
    employeesData[1].push(`No Manager`);

    body = await inquirer.prompt([
        {
            type: `input`,
            name: `first_name`,
            message: `What is the first name of this new employee?`,
            validate(answer) { return ((!/^[a-zA-Z]+$/.test(answer) || answer.trim().length < 3) ? `Names contain letters or longer than 2 letters` : true) }
        },
        {
            type: `input`,
            name: `last_name`,
            message: `What is the last name of this new employee?`,
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
            message: `Select one from the following ${selection}s?`,
            choices: idData[1]
        }
    ).then((answer) => { return answer = idData[0][idData[1].indexOf(answer.id)] })

    return id;
}

const updateData = async (change) => {
    selectedId = await getId(`employee`);
    currentIds = await getAndRenderData(`employee`, `employee${selectedId}`);
    changeData = await fetchBurnerData(change);

    if (change === `role`) {
        if (currentIds[0].role_id === 1) {
            changeData[0].shift();
            changeData[1].shift();
        } else if (currentIds[0].role_id < changeData[0].length) {
            spliceIndex = currentIds[0].role_id - 1;
            changeData[0].splice(spliceIndex, spliceIndex);
            changeData[1].splice(spliceIndex, spliceIndex);
        } else {
            changeData[0].pop();
            changeData[1].pop();
        }
    } else {
        if (selectedId === 1) {
            changeData[0].shift();
            changeData[1].shift();
        } else if (selectedId < changeData[0].length) {
            spliceIndex = selectedId - 1;
            changeData[0].splice(spliceIndex, spliceIndex);
            changeData[1].splice(spliceIndex, spliceIndex);
        } else {
            changeData[0].pop();
            changeData[1].pop();
        }

        if (currentIds[0].manager_id !== null) {
            if (currentIds[0].manager_id === 1) {
                changeData[0].shift();
                changeData[1].shift();
            } else if (currentIds[0].manager_id < changeData[0].length) {
                spliceIndex = currentIds[0].manager_id - 1;
                changeData[0].splice(spliceIndex, spliceIndex);
                changeData[1].splice(spliceIndex, spliceIndex);
            } else {
                changeData[0].pop();
                changeData[1].pop();
            }
        }

        changeData[1].push(`No manager`);
    }

    changeId = await inquirer.prompt(
        {
            type: `list`,
            name: `id`,
            message: `Select one from the following ${change}s?`,
            choices: changeData[1]
        }
    ).then((answer) => { return answer = changeData[0][changeData[1].indexOf(answer.id)] })

    if (changeId === `No manager`) { changeId = null }
    await (change === `role`) ? fetchData(`PUT`, `employee`, { role_id: changeId }, `role${selectedId}`) : fetchData(`PUT`, `employee`, { manager_id: changeId }, `manager${selectedId}`);
}

const app = async () => {
    await inquirer.prompt({
        type: `list`,
        name: `choice`,
        message: `What would you like to do?`,
        choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `Update Employee Manager`, `Delete Employee`, `View All Roles`, `Add Role`, `Delete Role`, `View All Departments`, `Add Department`, `Delete Department`, `Quit`]
    }).then((answer) => {
        switch (answer.choice) {
            case `View All Employees`:
                getAndRenderData(`employee`, `table`).then(app);
                break;
            case `Add Employee`:
                postEmployeeBody().then((body) => fetchData(`POST`, `employee`, body, ``)).then(app);
                break;
            case `Update Employee Role`:
                updateData(`role`).then(app);
                break;
            case `Update Employee Manager`:
                updateData(`employee`).then(app);
                break;
            case `Delete Employee`:
                getId(`employee`).then((id) => getOrDeleteData(`DELETE`, `employee`, id)).then(app);
                break;
            case `View All Roles`:
                getAndRenderData(`role`, `table`).then(app);
                break;
            case `Add Role`:
                postRoleBody().then((body) => fetchData(`POST`, `role`, body, ``)).then(app);
                break;
            case `Delete Role`:
                getId(`role`).then((id) => getOrDeleteData(`DELETE`, `role`, id)).then(app);
                break;
            case `View All Departments`:
                getAndRenderData(`department`, `table`).then(app);
                break;
            case `Add Department`:
                inquirer.prompt(addDepartmentQuestion).then((body) => fetchData(`POST`, `department`, body, ``)).then(app);
                break;
            case `Delete Department`:
                getId(`department`).then((id) => getOrDeleteData(`DELETE`, `department`, id)).then(app);
                break;
            default:
        }
    })
}

app();