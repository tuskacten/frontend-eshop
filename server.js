var request      = require("request")
  , express      = require("express")
  , morgan       = require("morgan")
  , path         = require("path")
  , bodyParser   = require("body-parser")
  , async        = require("async")
  , cookieParser = require("cookie-parser")
  , session      = require("express-session")
  , config       = require("./config")
  , helpers      = require("./helpers")
  , cart         = require("./api/cart")
  , catalogue    = require("./api/catalogue")
  , orders       = require("./api/orders")
  , user         = require("./api/user")
  , metrics      = require("./api/metrics")
  , app          = express()


app.use(helpers.rewriteSlash);
app.use(metrics);

// Modern UI as default
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index-modern.html'));
});

// Modern category page
app.get('/category.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'category-modern.html'));
});

// Modern detail page
app.get('/detail.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'detail-modern.html'));
});

// Modern basket page
app.get('/basket.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'basket-modern.html'));
});

// Modern login page
app.get('/login.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'login-modern.html'));
});

// Modern register page
app.get('/register.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'register-modern.html'));
});

// Modern checkout pages
app.get('/checkout1.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'checkout1-modern.html'));
});

app.get('/checkout2.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'checkout2-modern.html'));
});

app.get('/checkout3.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'checkout3-modern.html'));
});

app.get('/checkout4.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'checkout4-modern.html'));
});

// Modern account pages
app.get('/customer-orders.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'customer-orders-modern.html'));
});

// Legacy UI routing - original UI accessible at /legacy
app.get('/legacy', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mock API handlers for development mode
app.get('/api/catalogue', function(req, res) {
    const category = req.query.category;
    let mockProducts = [
        {
            id: "03fef6ac-1896-4ce8-bd69-b798f85c6e0b",
            name: "Holy",
            description: "Socks fit for a Messiah",
            price: 99.99,
            count: 1,
            imageUrl: ["/img/holy_socks.jpg", "/img/holy_socks_banner.jpg"],
            tag: ["blue", "teal"],
            category: "formal"
        },
        {
            id: "3395a43e-2d88-40de-b95f-e00e1502085b",
            name: "Colourful",
            description: "Socks that will brighten up your day",
            price: 18,
            count: 438,
            imageUrl: ["/img/colourful_socks.jpg", "/img/colourful_socks_banner.jpg"],
            tag: ["brown", "blue"],
            category: "casual"
        },
        {
            id: "510a0d7e-8e83-4193-b483-e27e09ddc34d",
            name: "SuperSport XL",
            description: "Ready for action",
            price: 15,
            count: 820,
            imageUrl: ["/img/rugby_socks.jpg", "/img/rugby_socks_banner.jpg"],
            tag: ["sport", "black"],
            category: "sport"
        },
        {
            id: "808a2de1-1aaa-4c25-a9b9-6612e8f29a38",
            name: "Crossed",
            description: "Cross your crossing",
            price: 17.32,
            count: 738,
            imageUrl: ["/img/product1.jpg", "/img/product1_2.jpg"],
            tag: ["formal", "blue", "red"],
            category: "formal"
        },
        {
            id: "819e1fbf-8b7e-4f6d-811f-693534916a8b",
            name: "Figueroa",
            description: "Waterproof and comfortable",
            price: 14,
            count: 808,
            imageUrl: ["/img/product2.jpg", "/img/product2_2.jpg"],
            tag: ["formal", "green"],
            category: "formal"
        },
        {
            id: "d3588630-ad8e-49df-bbd7-3167f7efb246",
            name: "YouTube.sock",
            description: "Show it off",
            price: 10.99,
            count: 801,
            imageUrl: ["/img/youtube_socks.jpg", "/img/product3.jpg"],
            tag: ["formal", "red"],
            category: "casual"
        }
    ];

    // Nếu có tham số category, lọc sản phẩm theo category
    if (category && category !== "all") {
        mockProducts = mockProducts.filter(product => product.category === category);
    }

    res.json(mockProducts);
});

// Mock API handler cho chi tiết sản phẩm
app.get('/api/catalogue/:id', function(req, res) {
    const productId = req.params.id;
    const mockProducts = [
        {
            id: "03fef6ac-1896-4ce8-bd69-b798f85c6e0b",
            name: "Holy",
            description: "Socks fit for a Messiah",
            price: 99.99,
            count: 1,
            imageUrl: ["/img/holy_socks.jpg", "/img/holy_socks_banner.jpg"],
            tag: ["blue", "teal"],
            category: "formal"
        },
        {
            id: "3395a43e-2d88-40de-b95f-e00e1502085b",
            name: "Colourful",
            description: "Socks that will brighten up your day",
            price: 18,
            count: 438,
            imageUrl: ["/img/colourful_socks.jpg", "/img/colourful_socks_banner.jpg"],
            tag: ["brown", "blue"],
            category: "casual"
        },
        {
            id: "510a0d7e-8e83-4193-b483-e27e09ddc34d",
            name: "SuperSport XL",
            description: "Ready for action",
            price: 15,
            count: 820,
            imageUrl: ["/img/rugby_socks.jpg", "/img/rugby_socks_banner.jpg"],
            tag: ["sport", "black"],
            category: "sport"
        },
        {
            id: "808a2de1-1aaa-4c25-a9b9-6612e8f29a38",
            name: "Crossed",
            description: "Cross your crossing",
            price: 17.32,
            count: 738,
            imageUrl: ["/img/product1.jpg", "/img/product1_2.jpg"],
            tag: ["formal", "blue", "red"],
            category: "formal"
        },
        {
            id: "819e1fbf-8b7e-4f6d-811f-693534916a8b",
            name: "Figueroa",
            description: "Waterproof and comfortable",
            price: 14,
            count: 808,
            imageUrl: ["/img/product2.jpg", "/img/product2_2.jpg"],
            tag: ["formal", "green"],
            category: "formal"
        },
        {
            id: "d3588630-ad8e-49df-bbd7-3167f7efb246",
            name: "YouTube.sock",
            description: "Show it off",
            price: 10.99,
            count: 801,
            imageUrl: ["/img/youtube_socks.jpg", "/img/product3.jpg"],
            tag: ["formal", "red"],
            category: "casual"
        }
    ];

    const product = mockProducts.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({error: "Product not found"});
    }
});

// Mock API handler cho giỏ hàng
let mockCart = [];

// Mock API endpoints cho cart theo cấu trúc của microservices
app.get('/cart', function(req, res) {
    console.log("Request to /cart");
    res.json(mockCart);
});

// Endpoint cho /cart/items của giao diện NavBar
app.get('/cart/items', function(req, res) {
    console.log("Request to /cart/items");
    res.json(mockCart);
});

// Endpoint cho /{userId}/items được sử dụng trong api/cart/index.js
app.get('/carts/:userId/items', function(req, res) {
    console.log("Request to /carts/" + req.params.userId + "/items");
    res.json(mockCart);
});

app.get('/api/cart', function(req, res) {
    res.json(mockCart);
});

app.post('/api/cart', function(req, res) {
    const item = req.body;
    const existingItem = mockCart.find(i => i.itemId === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        mockCart.push({
            itemId: item.id,
            quantity: 1
        });
    }
    
    res.status(201).json(mockCart);
});

// Thêm phương thức POST cho /cart
app.post('/cart', function(req, res) {
    const item = req.body;
    const existingItem = mockCart.find(i => i.itemId === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        mockCart.push({
            itemId: item.id,
            quantity: 1
        });
    }
    
    res.status(201).json(mockCart);
});

app.delete('/api/cart', function(req, res) {
    mockCart = [];
    res.status(200).json({status: "Cart cleared"});
});

// Thêm endpoint DELETE cho /cart
app.delete('/cart', function(req, res) {
    mockCart = [];
    res.status(200).json({status: "Cart cleared"});
});

// Mock API endpoint cho đơn hàng
app.get('/orders', function(req, res) {
    // Dữ liệu mẫu cho đơn hàng
    const mockOrders = [
        {
            id: "1",
            customerId: "1",
            customer: {
                firstName: "User",
                lastName: "Name",
                email: "user@example.com"
            },
            address: {
                street: "123 Main St",
                city: "Anytown",
                postcode: "12345",
                country: "USA"
            },
            items: [
                {
                    itemId: "03fef6ac-1896-4ce8-bd69-b798f85c6e0b",
                    quantity: 2,
                    unitPrice: 99.99
                },
                {
                    itemId: "3395a43e-2d88-40de-b95f-e00e1502085b",
                    quantity: 1,
                    unitPrice: 18.00
                }
            ],
            total: 217.98,
            date: "2025-05-10T14:30:00",
            _links: {
                self: {
                    href: "/orders/1"
                }
            }
        },
        {
            id: "2",
            customerId: "1",
            customer: {
                firstName: "User",
                lastName: "Name", 
                email: "user@example.com"
            },
            address: {
                street: "123 Main St",
                city: "Anytown",
                postcode: "12345",
                country: "USA"
            },
            items: [
                {
                    itemId: "510a0d7e-8e83-4193-b483-e27e09ddc34d",
                    quantity: 1,
                    unitPrice: 15.00
                }
            ],
            total: 15.00,
            date: "2025-05-15T09:45:00",
            _links: {
                self: {
                    href: "/orders/2"
                }
            }
        }
    ];
    
    res.json(mockOrders);
});

// Serve static files after route handlers
app.use(express.static("public"));

// Sử dụng cấu hình session mới với khả năng fallback nếu Redis không khả dụng
try {
    if(process.env.SESSION_REDIS) {
        console.log('Attempting to use Redis-based session manager');
        app.use(session(config.getSessionConfig(true)));
    } else {
        console.log('Using local memory session manager');
        app.use(session(config.getSessionConfig(false)));
    }
} catch (e) {
    console.error('Error setting up session, falling back to memory store:', e.message);
    app.use(session(config.session));
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helpers.sessionMiddleware);
app.use(morgan("dev", {}));

var domain = "";
process.argv.forEach(function (val, index, array) {
  var arg = val.split("=");
  if (arg.length > 1) {
    if (arg[0] == "--domain") {
      domain = arg[1];
      console.log("Setting domain to:", domain);
    }
  }
});

/* Mount API endpoints */
app.use(cart);
app.use(catalogue);
app.use(orders);
app.use(user);

app.use(helpers.errorHandler);

var server = app.listen(process.env.PORT || 8079, function () {
  var port = server.address().port;
  console.log("App now running in %s mode on port %d", app.get("env"), port);
});
