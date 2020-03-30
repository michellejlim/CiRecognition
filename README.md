# CI Employee Recognition Service

### Installation:
1. First, install NodeJS [here](https://nodejs.org/en/download/)

#### Windows:
2. Get the MySQl 8.0.19 installer [here](https://dev.mysql.com/downloads/installer/)
3. Using the MySQL installer, get the latest version of MySQL workbench and the MySQL server version 8.0.19. Make sure to create a root user and remember the password.

#### MacOS:
2. Install the MySQl 8.0.19 server [here](https://dev.mysql.com/downloads/mysql/). If you are unsure, choose the DMG Archive option and follow the instructions [here](https://dev.mysql.com/doc/mysql-osx-excerpt/5.7/en/osx-installation-pkg.html).
3. Install the latest MySQL Workbench [here](https://dev.mysql.com/downloads/workbench/)

#### Windows & MacOS
4. Open the MySQLWorkbench and create a new schema called 'ci_employee_recognition_schema'
5. Under the 'Database' navigation item click 'Manage Connections' -> 'New'
6. Name the new connection CI Server, you'll need to input your root credentials
7. Copy the contents of the file sql-init.sql (found in project directory root) into the Workbench. On lines 1 and 2, change `username` to whatever you want and run the results. Leave the password blank
8. Clone the api [https://github.com/JarrekRHolmes/CIRecognitionAPI](https://github.com/JarrekRHolmes/CIRecognitionAPI) into a seperate folder.
9. In CIRecognitionAPI/server/datasources.json change line 9 "user": "jrholmes" the the `username` you used above


### To run
First, in the CIRecognitionAPI root directory run: `npm start` <br>
Then in the project directory, you can run: `npm start` <br>
When prompted, change the port to 3001 <br>
Open [http://localhost:3000](http://localhost:3001) to view it in the browser. <br>
The page will reload if you make edits.



