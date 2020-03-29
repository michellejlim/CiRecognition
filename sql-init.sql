DROP DATABASE CIEmployeeRecognitionSystem;
CREATE DATABASE CIEmployeeRecognitionSystem;
USE CIEmployeeRecognitionSystem;
CREATE TABLE tblEmployee(
  id int NOT NULL,
  employeeId int NOT NULL,
  createdOn datetime NOT NULL,
  updatedOn datetime NOT NULL,
  deletedOn datetime NULL,
  firstName varchar(255) NOT NULL,
  middleName varchar(255) NULL,
  lastName varchar(255) NOT NULL,
  fullName varchar(255) NOT NULL,
  emailCompany varchar(255) NULL,
  departmentName varchar(255) NULL,
  category varchar(255) NOT NULL,
  job varchar(255) NULL,
  location varchar(255) NULL,
  status varchar(255) NOT NULL,
  supervisorName varchar(255) NULL,
  supervisorEmployeeId int NULL,
  workPhone varchar(50) NULL,
  adjHireDate date NOT NULL,
  termDate date NULL,
  isMostRecent bit NULL,
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
    reason varchar(255) NOT NULL,
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
    