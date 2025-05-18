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

// Disable SSL certificate validation in development mode
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'


app.use(helpers.rewriteSlash);
app.use(metrics);

// Configure body parser middleware before route handlers
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helpers.sessionMiddleware);

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

// Định nghĩa dữ liệu sản phẩm mẫu
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

// Mock API handlers for development mode
app.get('/api/catalogue', function(req, res) {
    const category = req.query.category;
    let filteredProducts = [...mockProducts];

    // Nếu có tham số category, lọc sản phẩm theo category
    if (category && category !== "all") {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    res.json(filteredProducts);
});

// Mock API handler cho chi tiết sản phẩm
app.get('/api/catalogue/:id', function(req, res) {
    const productId = req.params.id;
    const product = mockProducts.find(p => p.id === productId);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({error: "Product not found"});
    }
});

// Mock API handler cho catalogue/:id
app.get('/catalogue/:id', function(req, res) {
    const productId = req.params.id;
    console.log("Looking for product with id: " + productId);
    
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
    
    // Nếu mockCart trống hoặc không có dữ liệu hợp lệ, trả về mảng trống
    if (!mockCart || mockCart.length === 0) {
        return res.json([]);
    }
    
    // Kiểm tra và đảm bảo mỗi item trong mockCart có itemId hợp lệ
    const validCart = mockCart.filter(item => item && item.itemId && typeof item.itemId === 'string');
    
    // Log để debug
    console.log("Sending cart data:", validCart);
    
    res.json(validCart);
});

// Endpoint cho /cart/items của giao diện NavBar
app.get('/cart/items', function(req, res) {
    console.log("Request to /cart/items");
    const validCart = mockCart.filter(item => item && item.itemId && typeof item.itemId === 'string');
    res.json(validCart);
});

// Endpoint cho /{userId}/items được sử dụng trong api/cart/index.js
app.get('/carts/:userId/items', function(req, res) {
    console.log("Request to /carts/" + req.params.userId + "/items");
    const validCart = mockCart.filter(item => item && item.itemId && typeof item.itemId === 'string');
    res.json(validCart);
});

app.get('/api/cart', function(req, res) {
    const validCart = mockCart.filter(item => item && item.itemId && typeof item.itemId === 'string');
    res.json(validCart);
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
    try {
        console.log("Cart request body:", req.body);
        const item = req.body;
        let productId;
        let quantity = 1;
        
        // Xử lý cả hai định dạng: {id: productId} hoặc {id: productId, quantity: quantity}
        if (item.id !== undefined && item.id !== null) {
            // In ra kiểu dữ liệu của item.id để debug
            console.log("Type of item.id:", typeof item.id);
            console.log("Value of item.id:", item.id);
            
            // Đảm bảo productId là chuỗi
            if (typeof item.id === 'object') {
                // Nếu là object, chuyển đổi sang chuỗi JSON
                productId = JSON.stringify(item.id);
                console.log("Converted object to string:", productId);
            } else {
                productId = String(item.id);
            }
            
            // Nếu có quantity, sử dụng nó
            if (item.quantity && !isNaN(item.quantity)) {
                quantity = parseInt(item.quantity);
            }
        } else {
            return res.status(400).json({
                message: "Invalid request format. Expected {id: productId} or {id: productId, quantity: quantity}"
            });
        }
        
        console.log("Looking for product with ID:", productId);
        
        // Kiểm tra xem sản phẩm có tồn tại không
        // In ra danh sách ID sản phẩm để debug
        console.log("Available product IDs:", mockProducts.map(p => p.id));
        
        // Tìm kiếm sản phẩm
        const product = mockProducts.find(p => String(p.id) === String(productId));
        
        if (!product) {
            return res.status(404).json({
                message: "Product not found with ID: " + productId
            });
        }
        
        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItem = mockCart.find(i => i.itemId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            console.log("Updated existing item in cart:", existingItem);
        } else {
            const newItem = {
                itemId: productId,
                quantity: quantity
            };
            mockCart.push(newItem);
            console.log("Added new item to cart:", newItem);
        }
        
        // Lọc giỏ hàng để chỉ giữ lại các mục hợp lệ
        mockCart = mockCart.filter(item => item && item.itemId && typeof item.itemId === 'string');
        
        console.log("Updated cart:", mockCart);
        res.status(201).json(mockCart);
    } catch (err) {
        console.error("Error in /cart endpoint:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
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

// Endpoint xóa một sản phẩm cụ thể khỏi giỏ hàng
app.delete('/cart/:id', function(req, res) {
    const productId = req.params.id;
    console.log("Removing product from cart:", productId);
    
    // Tìm vị trí của sản phẩm trong giỏ hàng
    const index = mockCart.findIndex(item => item.itemId === productId);
    
    if (index !== -1) {
        // Xóa sản phẩm khỏi giỏ hàng
        mockCart.splice(index, 1);
        res.status(200).json({status: "Item removed", cart: mockCart});
    } else {
        res.status(404).json({status: "Item not found in cart"});
    }
});

// Mock API endpoint cho đăng ký
app.post('/register', function(req, res) {
    console.log("Processing registration request:", req.body);
    // Giả lập xử lý đăng ký thành công
    const userId = "user-" + Math.floor(Math.random() * 10000);
    // Thiết lập cookie đăng nhập
    res.cookie('logged_in', req.body.username || 'user', {
        maxAge: 3600000
    });
    res.status(200).json({id: userId});
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
            date: "2025-05-08T10:15:00",
            _links: {
                self: {
                    href: "/orders/2"
                }
            }
        }
    ];
    
    res.json(mockOrders);
});

// Phục vụ các file tĩnh từ thư mục public
app.use(express.static("public"));

// Xử lý lỗi 404
app.use(function(req, res, next) {
    res.status(404);
    res.sendFile(path.join(__dirname, 'public', '404.html'));
});

// Xử lý lỗi 500
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.sendFile(path.join(__dirname, 'public', '500.html'));
});

var server = app.listen(process.env.PORT || 8079, function() {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});
