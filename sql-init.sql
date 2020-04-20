CREATE USER 'ci-dev'@'%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON *.* TO 'ci-dev'@'%';
ALTER USER 'ci-dev' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;

DROP DATABASE CIEmployeeRecognitionSystem;
CREATE DATABASE CIEmployeeRecognitionSystem;
USE CIEmployeeRecognitionSystem;

CREATE TABLE tblEmployee(
  id int NOT NULL,
  employeeId int NOT NULL,
  firstName varchar(255) NOT NULL,
  lastName varchar(255) NOT NULL,
  emailCompany varchar(255) NULL,
  departmentName varchar(255) NULL,
  supervisorName varchar(255) NULL,
  supervisorEmployeeId int NULL,
  isMostRecent boolean NOT NULL,
  CONSTRAINT tblEmployee_pk PRIMARY KEY (id)
);

CREATE TABLE Employee_Recognition (
    id int NOT NULL,
    ci_bucks int NOT NULL,
    admin_level varchar(255) NOT NULL,
    CONSTRAINT Employee_Recognition_pk PRIMARY KEY (id)
);

-- Table: Nomination
CREATE TABLE Nomination (
    id int NOT NULL AUTO_INCREMENT,
    reason varchar(255) NULL,
    status varchar(255) NOT NULL,
    date date NOT NULL,
    nominator int NOT NULL,
    nominee int NOT NULL,
    award int NOT NULL,
    CONSTRAINT Nomination_pk PRIMARY KEY (id)
);

-- Table: Nomination_Award
CREATE TABLE Nomination_Award (
    id int NOT NULL,
    name varchar(255) NOT NULL,
    award_amount int NOT NULL,
    CONSTRAINT Nomination_Award_pk PRIMARY KEY (id)
);

-- Reference: Nomination_Employee_Nominator (table: Nomination)
ALTER TABLE Nomination ADD CONSTRAINT Nomination_Employee_Nominator FOREIGN KEY Nomination_Employee_Nominator (nominee)
    REFERENCES Employee_Recognition (id);

-- Reference: Nomination_Employee_Nominee (table: Nomination)
ALTER TABLE Nomination ADD CONSTRAINT Nomination_Employee_Nominee FOREIGN KEY Nomination_Employee_Nominee (nominator)
    REFERENCES Employee_Recognition (id);

-- Reference: Nomination_Nomination_Award (table: Nomination)
ALTER TABLE Nomination ADD CONSTRAINT Nomination_Nomination_Award FOREIGN KEY Nomination_Nomination_Award (award)
    REFERENCES Nomination_Award (id);

INSERT INTO Nomination_Award
  VALUES(1, "Exceptional Teaching", 10);

INSERT INTO Nomination_Award
  VALUES(2, "Kindness", 10);

INSERT INTO Nomination_Award
  VALUES(3, "Perfect Attendence (Monthly)", 10);

INSERT INTO Nomination_Award
  VALUES(4, "Other", 10);

INSERT INTO tblEmployee
  VALUES(1, 11, "Jarrek", "Holmes", "Jarrek@tciop.org","IS", "Vivian", 55, true);

INSERT INTO tblEmployee
  VALUES(2, 22, "Michelle", "Lim", "Michelle@tciop.org","IS", "Jarrek", 11, true);

INSERT INTO tblEmployee
  VALUES(3, 33, "Chris", "Mader", "chris@devtciop.onmicrosoft.com", "CI", "Vivian", 55, true);

INSERT INTO tblEmployee
  VALUES(4, 44, "Brian", "Furfari", "brf@devtciop.onmicrosoft.com", "CI", "Vivian", 55, true);

INSERT INTO tblEmployee
  VALUES(5, 55, "Vivian", "Huang", "Vivian@tciop.org","IS", "Jarrek", 11, false);

INSERT INTO tblEmployee
  VALUES(6, 55, "Viv", "Huang", "Vivian@tciop.org","IS", "Jarrek", 11, true);

INSERT INTO Employee_Recognition
  VALUES(11, 10, "user");

INSERT INTO Employee_Recognition
  VALUES(22, 23, "user");

INSERT INTO Employee_Recognition
  VALUES(33, 12, "user");

INSERT INTO Employee_Recognition
  VALUES(44, 10, "user");

INSERT INTO Employee_Recognition
  VALUES(55, 23, "admin");

INSERT INTO Nomination
  VALUES(1, "You're so great", "approved", '2020-03-21', 11, 22, 1);

  INSERT INTO Nomination
  VALUES(2, "You're so great", "denied", '2020-03-21', 11, 22, 3);

  INSERT INTO Nomination
  VALUES(3, "You're so great", "pending", '2020-03-20', 11, 33, 1);

  INSERT INTO Nomination
  VALUES(4, "You're so great", "approved", '2020-03-19', 22, 11, 2);

  INSERT INTO Nomination
  VALUES(5, "You're so great", "pending", '2020-03-02', 33, 11, 3);

  INSERT INTO Nomination
  VALUES(6, "You're so great", "pending", '2020-01-21', 33, 22, 1);
