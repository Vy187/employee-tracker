# employee-tracker

## Description
A simple command line application that helps to handle the basic essential function of creating and managing an employee database. Using a menu based interface, the user is able to view departments, roles and employee information as well as add departments, roles or employess and updating employee information. It makes use of node, inquirer for getting user information and MySQL for handling data.

## Table of Contents
* [Preview](#Preview)
* [Installation](#Installation)
* [Server Startup](#Server-Startup)
* [Packages](#Packages)
* [License](#License)
* [Contributing](#Contributing)
* [Questions](#Questions)

## Preview
![Render](./assets/demo/demo1.gif)

## Installation
* npm i
* Change .env.Example file to .env and insert your db user and password
* mysql -u (db username) -p < db/schema.sql
* mysql -u (db username) -p employee_tracker_db < db/seeds.sql

## Server Startup
* npm start
![Render](./assets/demo/demo.gif)

## Packages
* console.table
* dotenv
* express
* inquirer
* mysql2
* node-fetch

## License
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

Copyright (c) [2022] [Vy Nguyen]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

For more information, please visit: https://opensource.org/licenses/MIT

## Contributing
[Vy Nguyen](https://github.com/Vy187)

## Questions
If you have any questions about the repo, open an issue or contact me directly at vy1872@gmail.com