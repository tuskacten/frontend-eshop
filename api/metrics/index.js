(function (){
  'use strict';
  const apiRoutes = ['cart', 'catalogue', 'orders', 'user'];
  var express = require("express")
    , app     = express()
  
  // Kiểm tra nếu đang chạy trong môi trường phát triển
  const isDev = process.env.NODE_ENV !== 'production';
  
  let client, metric;
  
  try {
    client = require('prom-client');
    // Tạo registry cho prom-client v13+
    const register = new client.Registry();
    client.collectDefaultMetrics({ register });
    
    // Cấu hình metrics đúng cách cho phiên bản mới
    metric = {
      http: {
        requests: {
          duration: new client.Histogram({
            name: 'http_request_duration_seconds', 
            help: 'request duration in seconds', 
            labelNames: ['service', 'method', 'path', 'status_code'],
            registers: [register]
          }),
        }
      }
    };
  } catch (e) {
    console.warn('Metrics disabled: ', e.message);
    // Tạo mock object nếu không thể tải prom-client
    metric = {
      http: {
        requests: {
          duration: {
            labels: function() { 
              return { observe: function() {} }; 
            }
          }
        }
      }
    };
  }

  function s(start) {
    var diff = process.hrtime(start);
    return (diff[0] * 1e9 + diff[1]) / 1000000000;
  }

  function observe(method, path, statusCode, start) {
    var route = path.toLowerCase();
    if (route !== '/metrics' && route !== '/metrics/') {
        var duration = s(start);
        var method = method.toLowerCase();
        metric.http.requests.duration.labels('front-end', method, route, statusCode).observe(duration);
    }
  };

  function middleware(request, response, done) {
    var start = process.hrtime();

    response.on('finish', function() {
      // Only log API routes, and only record the backend service name (no unique identifiers)
      var model = request.path.split('/')[1];
      if (apiRoutes.indexOf(model) !== -1) {
        observe(request.method, model, response.statusCode, start);
      }

    });

    return done();
  };


  app.use(middleware);
  
  if (client && client.register) {
    app.get("/metrics", function(req, res) {
      res.header("content-type", "text/plain");
      return res.end(client.register.metrics());
    });
  } else {
    app.get("/metrics", function(req, res) {
      res.header("content-type", "text/plain");
      return res.end("# Metrics are disabled in development mode");
    });
  }

  module.exports = app;
}());
