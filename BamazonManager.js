// Insert
// * Create a new Node application called `BamazonManager.js`. Running this application will:

// 	* List a set of menu options: 
// 		* View Products for Sale 
// 		* View Low Inventory
// 		* Add to Inventory
// 		* Add New Product

// 	* If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

// 	* If a manager selects `View Low Inventory`, then it should list all items with a inventory count lower than five. query DB and  only display items that are less then five

// 	* If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.  
// 	select the ID in which you want to UPDATE, type in the quantity you want to add

// 	* If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store. INSERT INTO  products
// 	
// 	var fs = require('fs');

// ======= NPM MODULES ==========
var bluebird = require('bluebird');
var Table = require('cli-table');
var db = require('mysql2-promise')();
var inquirer = require('inquirer');
var colors = require('colors');
var prodIdArray =[];
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
        choices: ['View Products For Sale', 'View Low Inventory', 'Add To Inventory', 'Add Product', 'Exit']
    }])      // To catch any errors that might happen in this section
    .catch(function(err) {
        console.log(err);
    });
}

// This function handles the users response to the list of questions
   function handleListResponse(answers){
		switch (answers.home){
			case 'View Products For Sale':
			    console.log("\nProducts for sale!\n".bold.magenta);
				// This calls the function that queries the database
		        return getProducts()
		          // this is a promise that is called once the function get products is finshed and displayes the products in the screen
		          	.then(showProducts);
				break;
			case 'View Low Inventory':
		        console.log("\nLow Inventory\n".bold.magenta);
				// This calls the function that queries the database
		        return getLowInventory()
		          // this is a promise that is called once the function getLowInventory is finshed and displayes the products in the screen
		          	.then(showProducts);
				break;
			case 'Add To Inventory':
		        console.log("\nADD\n".bold.magenta);
				// getProducts()

				addInventory()	
					.then(updateDBInventory)
		          	.then(getProducts)
		          	.then(showProducts);
			// 	select the ID in which you want to UPDATE, type in the quantity you want to add
			// run inquirer ask for the id and quantity
			// then create a separate functoin to handle add quantity to query the DB - update function 
			// then run show products with note that it successfully displayed

				break;
			case 'Add Product':
			// run inquirer to have the user input the name, the price, the department and quantity
				userAddProduct()
					.then(addNewProduct);
				break;
			case 'Exit':
            	console.log("THANKS FOR DROPPING BY. GOOD BYE!".magenta);
            	process.exit();
				break;
			default:
				console.log("NOPE");
		}

   }
// function that queries the db and gets the product data
function getProducts() {
	return db.query("SELECT * FROM products")
	    .catch(function(err) {
	        console.log(err);
	    });
}

// function that shows all of the products in inventory
function showProducts(rows) {

            var table = new Table({
                head: ['ID', 'Product Name', 'Price', 'Quantity'],
                colWidths: [7, 25, 10, 10]
            });
            rows[0].forEach(function(value, index) {
                table.push([value.itemID, value.productName, value.price, value.stockQuantity]);
                prodIdArray.push(value.itemID.toString());

                // console.log(row.itemID, row.productName, row.price);
            });
            console.log(table.toString());
            // console.log("ID ARRAY: "  + prodIdArray);
}
// This function queries the database and pulls only data with quantity less than 50
function getLowInventory(){
	return db.query("SELECT * FROM products WHERE stockQuantity < 50")
	    .catch(function(err) {
	        console.log(err);
	    });
}

// this function will ask 
function addInventory(){
	console.log(prodIdArray);
	return inquirer.prompt([{
        name: "id",
        message: "Please enter the ID of the product you would like to replenish",
        type: "list",
        choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',]
    },{
        name: "units",
        message: "How many units would you like to add to the current quantity?",
        type: "input",
        validate: isNumber

    }])      // To catch any errors that might happen in this section
    .catch(function(err) {
        console.log(err);
    });

}

function userAddProduct(){
	return inquirer.prompt([{
        name: "name",
        message: "Please enter the name of your new product",
        type: "input",
    },{
    	name: "dept",
        message: "Please enter the department of your new product",
        type: "list",
        choices: ['Instruments', 'Books', 'Accessories']
    },{
        name: "price",
        message: "How much will this product cost? (Enter format: 300)",
        type: "input",
        validate: isNumber

    },{
        name: "quantity",
        message: "How many units will you be selling?",
        type: "input",
        validate: isNumber

    }])      // To catch any errors that might happen in this section
    .catch(function(err) {
        console.log(err);
    });

}
// this function adds a new product into the database
function addNewProduct(answers){
	var name = answers.name.trim();
	var dept = answers.dept.trim();
	var price = parseFloat(answers.price);
	var quantity = parseInt(answers.quantity);
	console.log(typeof price);
	console.log(name, dept, price, quantity);
	return db.query("INSERT INTO products SET ?", {
		productName: name,
		departmentName: dept,
		price: price, 
		stockQuantity: quantity
	})
	    .catch(function(err) {
	        console.log(err);
	    });

}
 // connection.query("INSERT INTO artists SET ?", {
 // 	artist: 'katy perry',
 // 	title: 'firework',
 // 	genre: 'pop' 

// this function will use the inventory quantity and then update the database
function updateDBInventory(answers){
	var id = answers.id;
	// NEED TO GET THE current quantity of the ID sselected, not sure how to pull this information in. 
	
	var quantity = answers.units
	
	return db.query("UPDATE products SET ? WHERE ?", [{stockQuantity: quantity}, {itemID: id}])
		// .then(function(rows){
			
		// 	return getProducts(showProducts);
		// })
	    .catch(function(err) {
	        console.log(err);
	    });

}

// This function checks to see if the user input is a number or not
function isNumber(input){
	if (input.match(/[0-9]+/)) {
                return true;
            } else {
                return false;
            }
}

// ========== RUN CODE ============
process.stdout.write('\033c');
console.log("\nWelcome to the Bamazon Manager Portal!\n".green);
showList()
    .then(handleListResponse)
    // .then(showList)
    // .then(userInput)