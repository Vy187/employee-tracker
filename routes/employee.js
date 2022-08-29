const employee = require(`express`).Router();
const db = require(`../config/connection`);

employee.get(`/`, (req, res) => {
    db.query(`SELECT CONCAT(e.first_name, ' ', e.last_name) AS full_name FROM employees e;`, (err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `success`, data: rows});
    })
})

employee.get(`/table`, (req, res) => {
    db.query(`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS full_name, r.title, d.department_name, r.salary, CASE WHEN e.manager_id IS NULL THEN 'No Manager' ELSE CONCAT(m.first_name, ' ', m.last_name) END AS manager FROM employees e LEFT JOIN employees m ON (e.manager_id = m.id) JOIN roles r ON e.role_id = r.id  JOIN departments d ON r.department_id = d.id;`, (err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `success`, data: rows});
    })
})

employee.post(`/new-employee`, ( { body }, res) => {
    console.log(body.first_name)
    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [body.first_name, body.last_name, body.role_id, body.manager_id], (err, result) => {
        (err) ? res.status(400).json({ error: err.message}) : res.json({ message: `success`, data: body});
    })
})

employee.delete(`/:id`, (req, res) => {
    db.query(`DELETE FROM employees WHERE id = ?`, [req.params.id], (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: `Employee not found`});
        } else {
            res.json({ message: `deleted`, changes: result.affectedRows, id: req.params.id});
        }
    })
})

module.exports = employee;