var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Kaydoe1414",
    database: "bamazon_db",
    insecureAuth: true
});
connection.connect(function(err){
    if(err) throw err;
    menu();
});
var select;
var idSel;
var amount;
var data = [];
function menu(){
    inquirer.prompt([
        {
        name: "selection",
        type: "list",
        message: "what would you like to do?",
        choices: ["View Products for sale", "View Low Inventory", "Add to inventory", "Add new product", "Exit"]
        },
    ]).then(function(inRes) {
    if (inRes.selection === "View Products for sale"){
        viewPro();
    }else if (inRes.selection === "View Low Inventory"){
        viewLow();
    }else if (inRes.selection === "Add to inventory"){
        addToInv();
    }else if (inRes.selection === "Add new product"){
        addToPro();
    }else if (inRes.selection === "Exit"){
        exit();
    }
})
}
function viewPro(){
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
        data = res;
    for (var i =0; i < data.length; i++){
        console.log("ID:" + data[i].item_id + ", Product:" + data[i].product_name + ", Price:" + data[i].price + "$," + ", Quantity: " + data[i].stock_quantity);
    }
    console.log("\n");
    menu();
});
}
function viewLow(){
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
        data = res;
        for (var i =0; i < data.length; i++){
            if (data[i].stock_quantity <= 5){
                console.log("ID:" + data[i].item_id + ", Product:" + data[i].product_name + ", Quantity: " + data[i].stock_quantity);
            }
        }
        console.log("\n");
        menu();
    })
    
}
function addToInv(){
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
        data = res;
    });
    inquirer.prompt([
        {
        name: "selection",
        type: "number",
        message: "What is the ID of the product you would like to add inventory too?",
        },
        {
        name: "amount",
        type: "number",
        message: "How many would you like to add?",
        },
    ]).then(function(inRes) {
        select = inRes.selection;
        idSel = inRes.selection
        amount = inRes.amount;
        select--
        data[select].stock_quantity += amount;
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [{stock_quantity: data[select].stock_quantity},{item_id: idSel}],
            function(error) {
              if (error) throw err;
            });
    menu();
})
}

function addToPro(){
    inquirer.prompt([
        {
        name: "proN",
        type: "input",
        message: "What is the product name you would like to add?",
        },
        {
        name: "depN",
        type: "input",
        message: "What is the department?",
        },
        {
        name: "price",
        type: "number",
        message: "What is the price?",
        },
        {
        name: "stock",
        type: "number",
        message: "How many are you adding?",
        },
    ]).then(function(inRes) {
        connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: inRes.proN,
              department_name: inRes.depN,
              price: inRes.price,
              stock_quantity: inRes.stock 
            },
            function(error) {
              if (error) throw err;
            });
        menu();
    });
}
function exit(){
    connection.end();
}