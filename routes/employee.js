const employee = require(`express`).Router();
const db = require(`../config/connection`);

employee.get(`/`, (req, res) => {
    db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS data FROM employees;`, (err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `burner success`, data: rows});
    })
})

employee.get(`/employee:id`, (req, res) => {
    db.query(`SELECT role_id, manager_id FROM employees WHERE id = ?;`, req.params.id ,(err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `burner success`, data: rows});
    })
})

employee.get(`/table`, (req, res) => {
    db.query(`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS full_name, r.title, d.department_name, r.salary, CASE WHEN e.manager_id IS NULL THEN 'No Manager' ELSE CONCAT(m.first_name, ' ', m.last_name) END AS manager FROM employees e LEFT JOIN employees m ON (e.manager_id = m.id) JOIN roles r ON e.role_id = r.id  JOIN departments d ON r.department_id = d.id ORDER BY id;`, (err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `success`, data: rows});
    })
})

employee.post(`/`, ( { body }, res) => {
    console.log(body.first_name)
    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [body.first_name, body.last_name, body.role_id, body.manager_id], (err, result) => {
        (err) ? res.status(400).json({ error: err.message}) : res.json({ message: `success`, data: body});
    })
})

employee.put(`/role:id`, (req, res) => {
    db.query(`UPDATE employees SET role_id = ? WHERE id = ?;`, [req.body.role_id, req.params.id], (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: `Employee not found`});
        } else {
            res.json({ message: `updated`, data: req.body, changes: result.affectedRows});
        }
    })
})

employee.put(`/manager:id`, (req, res) => {
    db.query(`UPDATE employees SET manager_id = ? WHERE id = ?;`, [req.body.manager_id, req.params.id], (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: `Employee not found`});
        } else {
            res.json({ message: `updated`, data: req.body, changes: result.affectedRows});
        }
    })
})

employee.delete(`/:id`, (req, res) => {
    db.query(`DELETE FROM employees WHERE id = ?;`, [req.params.id], (err, result) => {
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