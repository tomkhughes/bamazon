-- Create a MySQL Database called bamazon.

-- Then create a Table inside of that database called products.

-- The products table should have each of the following columns:

-- item_id (unique id for each product)

-- product_name (Name of product)

-- department_name

-- price (cost to customer)

-- stock_quantity (how much of the product is available in stores)

-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100)NULL,
  price DECIMAL(10, 3) NULL,
  stock_quantity DECIMAL(10, 3) NULL,

  PRIMARY KEY (id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('soap', 'home', '5','100');
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('sandals', 'footware', '17.95','14');
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('hat', 'headwear', '10','50');
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('gloves', 'clothes', '9','20');
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('candle', 'home', '11','15');
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('pillow', 'home', '25','5');
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('t-shirt', 'clothes', '20','150');
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('lamp', 'home', '15','74');
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('bowl', 'home', '13','34');
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('socks', 'clothes', '2','200');
