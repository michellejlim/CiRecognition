# CI Employee Recognition Service

### Installation:
1. First, install NodeJS [here](https://nodejs.org/en/download/)
2. Get the MySQl 8.0.19 installer [here](https://dev.mysql.com/downloads/installer/)
3. Using the MySQL installer, get the latest version of MySQL workbench and the MySQL server version 8.0.19. Make sure to create a root user and remember the password.
4. Open the MySQLWorkbench and create a new schema called 'ci_employee_recognition_schema'
5. Under the 'Database' navigation item click 'Manage Connections' -> 'New'
6. Name the new connection CI Server, you'll need to input your root credentials
7. Copy the contents of the file sql-init.sql (found in project directory root) into the Workbench and run the results

### To run
In the project directory, you can run: `npm start`
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.



