// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

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
    startPrompt();
});

function startPrompt() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    productsForSale();
                    break;
                case "View Low Inventory":
                    lowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    addProduct();
                    break;  
            }
        });
}

function productsForSale() {
    console.log("View all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + 'Item: ' + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + 'Price: ' + "$" + res[i].price + " | " + "Quantity: " + res[i].stock_quantity + " | ");
        }
        if (err) throw err;
        connection.end();
    });
}
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function lowInventory() {
    console.log("View all Low Inventory...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {

            if (res[i].stock_quantity < 7) {
                console.log(res[i].id + " | " + 'Item: ' + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + 'Price: ' + "$" + res[i].price + " | " + "Quantity: " + res[i].stock_quantity + " | ");

            } //else{
            // 	console.log('No Low Inventory!');
            // }     
        }
        if (err) throw err;
        connection.end();
        // startPrompt();
    });
}
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" 
//of any item currently in the store.
function addInventory() {
    inquirer
        .prompt([{
                name: "item",
                type: "input",
                message: "What is the ID of the product you would like to add more to?"
            },
            {
                name: "units",
                type: "input",
                message: "How mant units would you like to add to inventory?"
            },
        ])
        .then(function(answer) {
            var userID = parseInt(answer.item);
            var units = parseInt(answer.units);
            addOrder(userID, units);

        });

    function addOrder(userID, units) {
        connection.query("SELECT * FROM products WHERE id = ?", userID, function(err, results) {
            if (err) throw err;
            if (units) {
                console.log('user ID : ' + userID);
                console.log('units : ' + units);
                console.log('STOCK QUANTITY: ' + results[0].stock_quantity);

                var updateQuantity = results[0].stock_quantity + units;
                connection.query(
                    "UPDATE products SET ? WHERE ?", [{
                            stock_quantity: updateQuantity
                        },
                        {
                            id: userID
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log("Order placed successfully!");
                        console.log('UPDATE stock_quantity: ' + updateQuantity);
                        connection.end();

                    }
                );
            }
        });
    }

}
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

function addProduct() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "What is the product name?"
      },
      {
        name: "department",
        type: "input",
        message: "What is the department name?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "What is the quantity?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },

    ])
    .then(function(answer) {
      // when finished prompting, insert a new product into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("Your successfully added a product!");
          // re-prompt the user for if they want to bid or post
        }
      );
    });
}
