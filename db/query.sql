-- department queries used
SELECT 
    id, 
    department_name AS data 
FROM departments;

SELECT 
    id,
    department_name
FROM departments
ORDER BY id;

INSERT INTO departments (department_name) VALUES (?);

DELETE FROM departments WHERE id = ?;
-- department queries used

-- role queries used
SELECT 
    id, 
    title AS data 
FROM roles;

SELECT 
    r.id,
    r.title,
    r.salary,
    d.department_name
FROM roles r
JOIN departments d ON r.department_id = d.id
ORDER BY id;

INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);

DELETE FROM roles WHERE id = ?;
-- role queries used

-- employee queries used
SELECT 
    id, CONCAT(first_name, ' ', last_name) AS data 
FROM employees;

SELECT 
    role_id, 
    manager_id 
FROM employees WHERE id = ?;

SELECT 
    e.id, 
    CONCAT(e.first_name, ' ', e.last_name) AS full_name,
    r.title,
    d.department_name,
    r.salary,
    CASE WHEN e.manager_id IS NULL THEN 'No Manager'
         ELSE CONCAT(m.first_name, ' ', m.last_name)
         END AS manager
FROM employees e
LEFT JOIN employees m ON (e.manager_id = m.id)
JOIN roles r ON e.role_id = r.id 
JOIN departments d ON r.department_id = d.id
ORDER BY id;

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);

UPDATE employees SET role_id = ? WHERE id = ?;

UPDATE employees SET manager_id = ? WHERE id = ?;

DELETE FROM employees WHERE id = ?;
-- employee queries used