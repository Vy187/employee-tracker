const inquier = require(`inquirer`);
const cTable = require(`console.table`);

const app = () => {
    inquier.prompt({
        type: `list`,
        name: `choice`,
        message: `What would you like to do?`,
        choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Departments`, `Quit`]
    }).then((answer) => {
        switch (answer.choice) {
            case `View All Employees`:

                break;
            case `Add Employee`:

                break;
            case `Update Employee Role`:

                break;
            case `View All Roles`:

                break;
            case `Add Role`:

                break;
            case `View All Departments`:

                break;
            case `Add Departments`:

                break;
            default:

                break;
        }
    })
}

app();