const department = require(`express`).Router();
const db = require(`../config/connection`);

department.get(`/`, (req, res) => {
    db.query(`SELECT department_name FROM departments`, (err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `success`, data: rows});
    })
})

department.get(`/table`, (req, res) => {
    db.query(`SELECT id, department_name FROM departments`, (err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `success`, data: rows});
    })
})

department.post(`/new-department`, ( { body }, res) => {
    db.query(`INSERT INTO departments (department_name) VALUES (?)`, [body.department_name], (err, result) => {
        (err) ? res.status(400).json({ error: err.message}) : res.json({ message: `success`, data: body});
    })
})

department.delete(`/:id`, (req, res) => {
    db.query(`DELETE FROM departments WHERE id = ?`, [req.params.id], (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: `Department not found`});
        } else {
            res.json({ message: `deleted`, changes: result.affectedRows, id: req.params.id});
        }
    })
})

module.exports = department;