/* Author: Nigel Finley. Bamazon project for UT Austin Coding Boot Camp. October 2016.

*/  

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
itemID INT NOT NULL AUTO_INCREMENT,
productName VARCHAR(45), 
departmentName VARCHAR(45),
price DECIMAL(7,2), 
stockQuantity INTEGER (10),
PRIMARY KEY(itemID)
);

INSERT INTO products (productName, departmentName, price, stockQuantity) 
VALUES ('Trumpet', 'Instruments', 300.00, 500), 
('Saxophone', 'Instruments', 650.00, 350), 
('Grand Piano', 'Instruments', 1200.00, 200), 
('Synth', 'Instruments', 950.00, 1000), 
('Jazz Theory', 'Books', 25.95, 250), 
('Christmas Favorites', 'Books', 10.50, 425), 
('Song-writing 101', 'Books', 18.25, 150), 
('Mouthpiece', 'Accessories', 24.50, 20), 
('AC Adaptor', 'Accessories', 5.25, 200), 
('Sax Reeds', 'Accessories', 15.50,100); 


USE bamazon;
SELECT * FROM products;

set sql_safe_updates =0;
UPDATE products SET stockQuantity = 0 WHERE productName = 'Trumpet';