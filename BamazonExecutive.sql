
USE bamazon;

CREATE TABLE departments (
departmentID INT NOT NULL AUTO_INCREMENT,
departmentName VARCHAR(45), 
overheadCosts INT(10),
totalSales DECIMAL(7,2), 
PRIMARY KEY(departmentID)
);

INSERT INTO departments (departmentName, overheadCosts) 
VALUES ('Instruments', 50000), 
('Books', 20000),
('Accessories', 15000); 



USE bamazon;
SELECT * FROM departments;

