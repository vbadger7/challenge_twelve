**Employee Tracker**
-
A command-line application built with Node.js and PostgreSQL to manage a company's employee database. Users can view departments, roles, and employees, add new departments, roles, and employees, and update employee roles.


**Table of Contents**
-
Installation

Usage

Walkthrough Video

Technologies Used

Contributing

License


**Installation**
-
To run this application locally, you'll need Node.js and PostgreSQL installed on your machine. Then:
1. Clone the repository:
   
        git clone https://github.com/your-username/employee-tracker.git
  
        cd employee-tracker


2. Install dependencies:
   
        npm install


3. Set up the database:

    Ensure PostgreSQL is running.

    Create a new database and execute the schema.sql and seeds.sql files provided in the repository to set up the database schema and seed data.

       psql -U yourusername -d yourdatabase -f schema.sql
   
       psql -U yourusername -d yourdatabase -f seeds.sql
   
       Update the database connection details (db.js) if necessary.
   

4. Start the application:
   
       npm start


**Usage**
-
Follow the prompts in the command line interface to manage the employee database:

View all departments, roles, and employees.

Add new departments, roles, and employees.

Update an employee's role.


**Walkthrough Video**
-
Watch a walkthrough video demonstrating the functionality of the Employee Tracker:

Link to Walkthrough Video (Insert your video link here)


**Technologies Used**
-
Node.js

PostgreSQL

Inquirer.js

Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or a pull request in the repository.

