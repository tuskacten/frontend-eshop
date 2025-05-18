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
    // Trong môi trường sản xuất, sử dụng đường dẫn tương đối thay vì tên dịch vụ
    module.exports = {
      catalogueUrl:  "/api/catalogue",
      tagsUrl:       "/api/catalogue/tags",
      cartsUrl:      "/api/cart",
      ordersUrl:     "/api/orders",
      customersUrl:  "/api/customers",
      addressUrl:    "/api/addresses",
      cardsUrl:      "/api/cards",
      loginUrl:      "/api/login",
      registerUrl:   "/api/register",
    };
  }
}());
