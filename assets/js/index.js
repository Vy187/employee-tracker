const inquier = require(`inquirer`);
const cTable = require(`console.table`);

const app = () => {
    inquier.prompt(
        {
            type: `list`,
            name: `choice`,
            message: `What would you like to do?`,
            choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Departments`, `Quit`]
        }
    )
}

app();