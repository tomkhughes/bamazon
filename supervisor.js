var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');



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
                "View Product Sales by Department",
                "Create New Department",
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                     viewProductSales();
                    break;
                case "Create New Department":
                    newDepartment();
                    break;
            }
        });
}

function newDepartment() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is the department name?"
      },
      {
        name: "over_head_costs",
        type: "input",
        message: "What is the overhead?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "product_sales",
        type: "input",
        message: "What is the product_sales?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },

    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.department,
          over_head_costs: answer.over_head_costs,
          product_sales: answer.product_sales,
        },
        function(err) {
          if (err) throw err;
          console.log("Your successfully added a department!");
        }
      );
    });
}

//view all departments overhead, sales and total profit
function viewProductSales() {
    //join products and departments tables by department name, combine product sales by department
    var query = "SELECT departments.id, departments.department_name, departments.over_head_costs, SUM(products.product_sales)";
    query += "FROM products RIGHT JOIN departments ON products.department_name = departments.department_name ";
    query += "GROUP BY departments.id, products.department_name";
    connection.query(query, function(err, res){
        //create table to display product sales
        var table = new Table({
            head: ['id', 'department name', 'overhead', 'product sales', 'total profit'], 
            colWidths: [10, 30, 20, 20, 20]
        });
        res.forEach(function(row) {
            //if there haven't been any sales yet, change null to 0 so table creation doesn't throw error
            if (row['SUM(products.product_sales)'] === null) {
                row['SUM(products.product_sales)'] = 0;
            }
            //calculate total profit - difference bt sales and overhead
            var totalProfit = (row['SUM(products.product_sales)'] - row.over_head_costs);
            //push results and profit calc to table
            console.log(row.id, row.department_name, row.over_head_costs, row['SUM(products.product_sales)'], totalProfit);
            table.push(
                [row.id, row.department_name, row.over_head_costs, row['SUM(products.product_sales)'], totalProfit]
            );  
            
        });
        //display table and main menu
        console.log(table.toString());
        // exports.supervisorMainMenu();
    });
}
