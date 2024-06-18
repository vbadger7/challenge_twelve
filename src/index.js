const inquirer = require('inquirer');
const pool = require('./db');

async function viewAllDepartments() {
    try {
        const res = await pool.query('SELECT * FROM department');
        console.table(res.rows);
    } catch (err) {
        console.error('Error executing query', err);
    }
}

async function addDepartment(name) {
    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
        console.log('Department added successfully');
    } catch (err) {
        console.error('Error executing query', err);
    }
}

async function viewAllRoles() {
    try {
        const res = await pool.query(`
            SELECT role.id, role.title, role.salary, department.name AS department
            FROM role
            INNER JOIN department ON role.department_id = department.id
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error executing query', err);
    }
}

async function addRole(title, salary, departmentId) {
    try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
        console.log('Role added successfully');
    } catch (err) {
        console.error('Error executing query', err);
    }
}

async function viewAllEmployees() {
    try {
        const res = await pool.query(`
            SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee
            INNER JOIN role ON employee.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error executing query', err);
    }
}

async function addEmployee(firstName, lastName, roleId, managerId) {
    try {
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
        console.log('Employee added successfully');
    } catch (err) {
        console.error('Error executing query', err);
    }
}

async function updateEmployeeRole(employeeId, roleId) {
    try {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
        console.log('Employee role updated successfully');
    } catch (err) {
        console.error('Error executing query', err);
    }
}

async function promptAction() {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit',
        ],
    });

    switch (action) {
        case 'View all departments':
            await viewAllDepartments();
            break;
        case 'View all roles':
            await viewAllRoles();
            break;
        case 'View all employees':
            await viewAllEmployees();
            break;
        case 'Add a department':
            const { departmentName } = await inquirer.prompt({
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the department:',
            });
            await addDepartment(departmentName);
            break;
        case 'Add a role':
            const roleQuestions = [
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the role:',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary for this role:',
                    validate: (value) => {
                        if (isNaN(value)) {
                            return 'Please enter a valid number';
                        }
                        return true;
                    },
                },
                {
                    type: 'input',
                    name: 'departmentId',
                    message: 'Enter the department ID for this role:',
                    validate: (value) => {
                        if (isNaN(value)) {
                            return 'Please enter a valid number';
                        }
                        return true;
                    },
                },
            ];
            const roleAnswers = await inquirer.prompt(roleQuestions);
            await addRole(roleAnswers.title, parseFloat(roleAnswers.salary), parseInt(roleAnswers.departmentId));
            break;
        case 'Add an employee':
            const employeeQuestions = [
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the first name of the employee:',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the last name of the employee:',
                },
                {
                    type: 'input',
                    name: 'roleId',
                    message: 'Enter the role ID for this employee:',
                    validate: (value) => {
                        if (isNaN(value)) {
                            return 'Please enter a valid number';
                        }
                        return true;
                    },
                },
                {
                    type: 'input',
                    name: 'managerId',
                    message: 'Enter the manager ID for this employee (leave blank if none):',
                    default: null,
                    validate: (value) => {
                        if (value !== '' && isNaN(value)) {
                            return 'Please enter a valid number or leave blank';
                        }
                        return true;
                    },
                },
            ];
            const employeeAnswers = await inquirer.prompt(employeeQuestions);
            await addEmployee(employeeAnswers.firstName, employeeAnswers.lastName, parseInt(employeeAnswers.roleId), employeeAnswers.managerId !== '' ? parseInt(employeeAnswers.managerId) : null);
            break;
        case 'Update an employee role':
            const updateQuestions = [
                {
                    type: 'input',
                    name: 'employeeId',
                    message: 'Enter the ID of the employee you want to update:',
                    validate: (value) => {
                        if (isNaN(value)) {
                            return 'Please enter a valid number';
                        }
                        return true;
                    },
                },
                {
                    type: 'input',
                    name: 'roleId',
                    message: 'Enter the new role ID for this employee:',
                    validate: (value) => {
                        if (isNaN(value)) {
                            return 'Please enter a valid number';
                        }
                        return true;
                    },
                },
            ];
            const updateAnswers = await inquirer.prompt(updateQuestions);
            await updateEmployeeRole(parseInt(updateAnswers.employeeId), parseInt(updateAnswers.roleId));
            break;
        case 'Exit':
            console.log('Exiting Employee Tracker');
            process.exit();
            break;
        default:
            console.log('Invalid action');
    }
}

async function start() {
    console.log('Welcome to Employee Tracker');
    while (true) {
        await promptAction();
    }
}

start();
