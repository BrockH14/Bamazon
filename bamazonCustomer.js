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
    search();
});
var select;
var idSel;
var amount;
var totalPrice;
var data = [];
function search(){
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
        data = res;
    for (var i =0; i < data.length; i++){
        console.log("ID:" + data[i].item_id + ", Product:" + data[i].product_name + ", Price:" + data[i].price + "$");
    }
    start()
});
}
function start(){
    inquirer.prompt([
        {
        name: "selection",
        type: "number",
        message: "What is the ID of the product you would like to buy?",
        },
        {
        name: "amount",
        type: "number",
        message: "How many would you like?",
        },
    ]).then(function(inRes) {
        select = inRes.selection;
        idSel = inRes.selection
        amount = inRes.amount;
        check();
    });
}
function check(){
    select--
    if (amount <= data[select].stock_quantity){
        data[select].stock_quantity -= amount;
        totalPrice = data[select].price * amount;
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [{stock_quantity: data[select].stock_quantity},{item_id: idSel}],
            function(error) {
              if (error) throw err;
              final();
            }
          );
    }else if (amount >= data[select].stock_quantity){
        console.log("insufficient quantity.")
    }
}
function final(){
    console.log("Your total is " + totalPrice);
    connection.end();
}