CREATE USER '<username>'@'%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON *.* TO '<username>'@'%';
FLUSH PRIVILEGES;

DROP DATABASE CIEmployeeRecognitionSystem;
CREATE DATABASE CIEmployeeRecognitionSystem;
USE CIEmployeeRecognitionSystem;

CREATE TABLE tblEmployee(
  id int NOT NULL,
  employeeId int NOT NULL,
  emailCompany varchar(255) NULL,
  departmentName varchar(255) NULL,
  supervisorName varchar(255) NULL,
  supervisorEmployeeId int NULL,
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
    id int NOT NULL,
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

ALTER TABLE Employee_Recognition ADD CONSTRAINT Employee_Recognition_tblEmployee FOREIGN KEY Employee_Recognition_tblEmployee (id)
    REFERENCES tblEmployee (id);

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

INSERT INTO tblEmployee
  VALUES(1, 1, "jrholmes@andrew.cmu.edu","IS", "Michelle", 2);

  INSERT INTO tblEmployee
  VALUES(2, 2, "michelle@andrew.cmu.edu","IS", "Vivian", 3);

  INSERT INTO tblEmployee
  VALUES(3, 3, "Vivian@andrew.cmu.edu","IS", "Jarrek", 1);
    
INSERT INTO Employee_Recognition
  VALUES(1, 10, "admin");

INSERT INTO Employee_Recognition
  VALUES(2, 23, "user");

INSERT INTO Employee_Recognition
  VALUES(3, 12, "admin");

INSERT INTO Nomination
  VALUES(1, "You're so great", "approved", '2020-03-21', 1, 2, 1);

  INSERT INTO Nomination
  VALUES(2, "You're so great", "denied", '2020-03-21', 1, 2, 3);

  INSERT INTO Nomination
  VALUES(3, "You're so great", "pending", '2020-03-20', 1, 3, 1);

  INSERT INTO Nomination
  VALUES(4, "You're so great", "approved", '2020-03-19', 2, 1, 2);

  INSERT INTO Nomination
  VALUES(5, "You're so great", "pending", '2020-03-02', 3, 1, 3);

  INSERT INTO Nomination
  VALUES(6, "You're so great", "pending", '2020-01-21', 3, 2, 1);