SELECT 
    id,
    department_name
FROM departments;

SELECT 
    r.id,
    r.title,
    r.salary,
    d.department_name
FROM roles r
JOIN departments d ON r.department_id = d.id;

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
JOIN departments d ON r.department_id = d.id;