(function (){
  'use strict';

  var util = require('util');

  var domain = "";
  var devMode = process.env.NODE_ENV !== 'production';
  
  process.argv.forEach(function (val, index, array) {
    var arg = val.split("=");
    if (arg.length > 1) {
      if (arg[0] == "--domain") {
        domain = "." + arg[1];
        console.log("Setting domain to:", domain);
      }
    }
  });

  // Kiểm tra xem chúng ta có đang chạy trong môi trường phát triển không
  if (devMode) {
    console.log("Running in development mode with mock endpoints");
    // Trong môi trường phát triển, sử dụng các endpoint localhost
    module.exports = {
      catalogueUrl:  "http://localhost:8080/api/catalogue",
      tagsUrl:       "http://localhost:8080/api/catalogue/tags",
      cartsUrl:      "http://localhost:8080/api/cart",
      ordersUrl:     "http://localhost:8080/api/orders", 
      customersUrl:  "http://localhost:8080/api/customers",
      addressUrl:    "http://localhost:8080/api/addresses",
      cardsUrl:      "http://localhost:8080/api/cards",
      loginUrl:      "http://localhost:8080/api/login",
      registerUrl:   "http://localhost:8080/api/register"
    };
  } else {
    // Trong môi trường sản xuất, sử dụng các endpoint microservice thực
    module.exports = {
      catalogueUrl:  util.format("http://catalogue%s", domain),
      tagsUrl:       util.format("http://catalogue%s/tags", domain),
      cartsUrl:      util.format("http://carts%s/carts", domain),
      ordersUrl:     util.format("http://orders%s", domain),
      customersUrl:  util.format("http://user%s/customers", domain),
      addressUrl:    util.format("http://user%s/addresses", domain),
      cardsUrl:      util.format("http://user%s/cards", domain),
      loginUrl:      util.format("http://user%s/login", domain),
      registerUrl:   util.format("http://user%s/register", domain),
    };
  }
}());
