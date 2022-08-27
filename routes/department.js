const department = require(`express`).Router();
const db = require(`../config/connection`);

department.get(`/`, (req, res) => {
    db.query(`SELECT id, department_name AS title FROM departments`, (err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `success`, data: rows});
    })
})

department.post(`/new-department`, ( { body }, res) => {
    db.query(`INSERT INTO departments (department_name) VALUES (?)`, [body.department_name], (err, result) => {
        (err) ? res.status(400).json({ error: err.message}) : res.json({ message: `success`, data: body});
    })
})

department.put(`/:id`, (req, res) => {
    db.query(`UPDATE departments SET department_name = ? WHERE id = ?`, [req.body.department_name, req.params.id], (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: `Department not found`});
        } else {
            res.json({ message: `updated`, data: req.body, changes: result.affectedRows});
        }
    })
})

department.delete(`/:id`, (req, res) => {
    db.query(`DELETE FROM departments WHERE id = ?`, [req.params.id], (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: `Department not found`});
        } else {
            res.json({ message: `deleted`, changes: result.affectedRows, id: req.params.id});
        }
    })
})

module.exports = department;