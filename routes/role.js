const role = require(`express`).Router();
const db = require(`../config/connection`);

role.get(`/`, (req, res) => {
    db.query(`SELECT id, title AS data FROM roles;`, (err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `burner success`, data: rows});
    })
})

role.get(`/table`, (req, res) => {
    db.query(`SELECT r.id, r.title, r.salary, d.department_name FROM roles r JOIN departments d ON r.department_id = d.id ORDER BY id;`, (err, rows) => {
        (err) ? res.status(500).json({ error: err.message }) : res.json({ message: `success`, data: rows});
    })
})

role.post(`/`, ( { body }, res) => {
    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`, [body.title, body.salary, body.department_id], (err, result) => {
        (err) ? res.status(400).json({ error: err.message}) : res.json({ message: `success`, data: body});
    })
})

role.delete(`/:id`, (req, res) => {
    db.query(`DELETE FROM roles WHERE id = ?;`, [req.params.id], (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: `Role not found`});
        } else {
            res.json({ message: `deleted`, changes: result.affectedRows, id: req.params.id});
        }
    })
})

module.exports = role;