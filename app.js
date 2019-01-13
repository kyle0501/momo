var express = require('express');
var firebase = require("firebase");
var app = express();
const puppeteer = require('puppeteer');
var config = {
    apiKey: "AIzaSyCBzq2c88vfanIWRBw73hLfhPkJ7aTDJmI",
    authDomain: "h-599f1.firebaseapp.com",
    databaseURL: "https://h-599f1.firebaseio.com",
    projectId: "h-599f1",
    storageBucket: "h-599f1.appspot.com",
    messagingSenderId: "723873673565"
  };
  firebase.initializeApp(config);
  firebase.initializeApp(config);
var db = firebase.database();
app.get('/', function (req, res) {


let scrape = async () => {
     const browser = await puppeteer.launch({headless: false});
    // const browser = await puppeteer.launch({headless:true, args: ['--no-sandbox', '--disable-setuid-sandbox']}); 
    const page = await browser.newPage();
    
    await page.goto('https://www.momoshop.com.tw/search/searchShop.jsp?keyword=ps4%20%E4%B8%BB%E6%A9%9F%20pro&searchType=1&curPage=1&_isFuzzy=0&showType=chessboardType');
    
    const result = await page.evaluate(() => {
        let title_data = [];
        let price_data = [];
        let titles  = document.querySelectorAll('.searchPrdListArea .listArea ul li .prdName'); 
            
            for (var element of titles){ 
                let title = element.innerText; 
                title_data.push({title}); 
        }
        let prices = document.querySelectorAll(".searchPrdListArea .listArea ul li .money .price");

            for (var element of prices) {
                let price = element.innerText;
                price = price.replace('$', '');
                price_data.push({ price });
            }
        return {title_data,price_data}; 
    });

    var products = new Array();
    for (r in result.title_data) {
    products.push({ title: result.title_data[r].title, price: result.price_data[r].price, website: "Momo" });
        }
      return products;
  }
  scrape().then((value) => {
    var ref = db.ref("/");
    ref.set(value);
    ref.once("value", function(snapshot) {
    console.log(snapshot.val());
});
     res.send(value);
 });
})
var server = app.listen(8081, function () {
})