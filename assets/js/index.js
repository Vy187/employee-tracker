const inquier = require(`inquirer`);
const fetch = require(`node-fetch`)
const cTable = require(`console.table`);

const getData = (selection) =>
    fetch(`http://localhost:3001/api/${selection}/`, {
        method: `GET`,
        headers: {
            'Content-Type': 'application/json'
        }
    })

const renderData = async (results) => {
    const data = await results.json();
    console.table(data.data)    
}

const getAndRenderData = (selection) => getData(selection).then(renderData).then(app);

const app = async () => {
    await inquier.prompt({
        type: `list`,
        name: `choice`,
        message: `What would you like to do?`,
        choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Departments`, `Quit`]
    }).then((answer) => {
        switch (answer.choice) {
            case `View All Employees`:
                getAndRenderData(`employee`);
                break;
            case `Add Employee`:

                break;
            case `Update Employee Role`:

                break;
            case `View All Roles`:
                getAndRenderData(`role`);
                break;
            case `Add Role`:

                break;
            case `View All Departments`:
                getAndRenderData(`department`);
                break;
            case `Add Departments`:

                break;
            default:

                break;
        }
    })
}

app();