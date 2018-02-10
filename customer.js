// Then create a Node application called bamazonCustomer.js. 

// Running this application will first display all of the items available for sale. 
// Include the ids, names, and prices of products for sale.

// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.

// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.

// Once the update goes through, show the customer the total cost of their purchase.
var mysql = require("mysql");
var inquirer = require("inquirer");


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readProducts();
});

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
  	for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].product_name + " | " +"$"+ res[i].price);
    }
    if (err) throw err;
    startPrompt();
  });
}

function startPrompt() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the ID of the product you would like to buy?"
      },
      {
        name: "units",
        type: "input",
        message: "How mant units would you like to buy?"
      },
    ])
    .then(function(answer) {
    	var userID = parseInt(answer.item);
    	var units = parseInt(answer.units);
    	checkOrder(userID, units);

    });

}

function checkOrder(userID, units){
	    connection.query("SELECT * FROM products WHERE id = ?",userID, function(err, results) {
  	    if (err) throw err;
  	    if(units < results[0].stock_quantity) {
  	    	console.log('user ID : ' + userID);
  	    	console.log('units : '+ units );
  	    	console.log('STOCK QUANTITY: '+ results[0].stock_quantity);

  	    	var updateQuantity = results[0].stock_quantity - units;
  	    	var price = results[0].price;  	  
  	    	var productSales = units * price;
  	    	var updateProductSales = parseInt(results[0].product_sales) + parseInt(productSales);

  	    	connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: updateQuantity
              },
              {
                id: userID
              },
            ],
            function(error) {
            if (error) throw err;
            }
          );

  	    	connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                product_sales: updateProductSales
              },
              {
                id: userID
              },
            ],
            function(error) {
            if (error) throw err;
            	console.log("Order placed successfully!");
            	console.log('UPDATE product_sales: '+ updateProductSales);
              	console.log('UPDATE stock_quantity: '+ updateQuantity);
              	connection.end();

            }
          );
  	    } else {
          console.log("We are out of stock!");
          startPrompt();

        }

	});
}

