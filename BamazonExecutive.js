// Bamazon Executive JS File. Author: Nigel Finley. UT BOOTCAMP OCT 2016
// 
// This file is for 'excutives' to view the OverHeadCosts | ProductSales | TotalProfit | of their inventory
// 
// 
// 4. When an executive selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. 
// Use the table below as a guide. 

// 	| DepartmentID | DepartmentName | OverHeadCosts | ProductSales | TotalProfit |
// 	|--------------|----------------|---------------|--------------|-------------|
// 	| 01           | Electronics    | 10000         | 20000        | 10000       |
// 	| 02           | Clothing       | 60000         | 100000       | 40000       |


// 5. The `TotalProfit` should be calculated on the fly using the difference between `OverheadCosts` and `ProductSales`. `TotalProfit` 
// should not be stored in any database. You should use a custom alias. 

// ======= NPM MODULES ==========
var Table = require('cli-table');
var db = require('mysql2-promise')();
var inquirer = require('inquirer');
var colors = require('colors');
var currentQuant;

db.configure({
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "bamazon"

});

// this function will display the list of menu options the manager can view
function showList(){
	return inquirer.prompt([{
        name: "home",
        message: "Please select from below",
        type: "list",
        choices: ['View Product Sales by Department', 'Create New Department', 'Exit']
    }])      // To catch any errors that might happen in this section
    .catch(function(err) {
        console.log(err);
    });
}

// This function handles the users response to the list of questions
   function handleListResponse(answers){
		switch (answers.home){
			case 'View Product Sales by Department':
				process.stdout.write('\033c');
			    console.log("\nProduct Sales by Department!\n".bold.magenta);
				// This calls the function that queries the database
		        return getProducts()
		          // this is a promise that is called once the function get products is finshed and displayes the products in the screen
		          	.then(calculateProfit)
		          	.then(showProducts)
		          	.then(showList)
					.then(handleListResponse);
				break;
			case 'Create New Department':
			// run inquirer to have the user input the name, the price, the department and quantity
				userAddProduct()
					.then(addNewProduct)
					.then(showList)
					.then(handleListResponse);
				break;
			case 'Exit':
            	console.log("GOOD BYE!".magenta);
            	process.exit();
				break;
			default:
				console.log("NOPE");
		}

   }

// pulls all of the data from the DB
function getProducts() {
	return db.query("SELECT * FROM departments")
		.then(function(rows) {
			return rows[0];
		})
	    .catch(function(err) {
	        console.log(err);
	    });
}
function calculateProfit(rows){
	var totalProfitArray =[];
	var totalProfit = 0;
	rows.forEach(function(value, index) {
		totalProfit = parseInt(value.totalSales)- parseInt(value.overheadCosts);
		return totalProfitArray.push(totalProfit);
            });
	console.log(totalProfitArray);
	
}
// function that shows all of the products in inventory
function showProducts(rows, totalProfitArray) {
console.log(totalProfitArray);
            var table = new Table({
                head: ['Dept ID', 'Dept Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
                colWidths: [10, 18, 18, 15, 15]
            });
            rows.forEach(function(value, index) {
            	console.log("in for each of table")
                table.push([value.departmentID, value.departmentName, value.overheadCosts, value.totalSales, totalProfitArray]);

                // console.log(row.itemID, row.productName, row.price);
            });
            console.log(table.toString());
            // console.log("ID ARRAY: "  + prodIdArray);
            
}

   // ======= RUN THE SCRIPT =====
process.stdout.write('\033c');

console.log("\nWelcome to the Bamazon Executive Portal!\n".bold.red);
 
 showList()
     .then(handleListResponse);