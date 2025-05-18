# Modern E-shop Frontend

Modern frontend application for an e-commerce microservices demo, written in Node.js with Express. This is a modernized version of the original [microservices-demo](https://github.com/microservices-demo/microservices-demo) frontend.

## Tính năng

- UI hiện đại với Bootstrap 5
- Giao diện responsive cho mọi thiết bị
- Tích hợp Mock API cho phát triển độc lập
- Hiệu ứng và animation đẹp mắt
- Typography cải tiến với font Inter
- Tương thích với microservices gốc

## UI Hiện đại vs UI Gốc

Ứng dụng này bao gồm cả phiên bản UI gốc và phiên bản hiện đại mới. Mặc định, ứng dụng sẽ phục vụ phiên bản hiện đại, nhưng phiên bản gốc vẫn có thể truy cập qua đường dẫn `/legacy`.

## Cài đặt và Chạy

### Yêu cầu

- Node.js (>= 14.x)
- npm (>= 6.x)

### Clone repository

```bash
git clone https://github.com/tuskacten/frontend-eshop.git
cd frontend-eshop
```

### Cài đặt dependencies

```bash
npm install
```

### Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại http://localhost:8079 theo mặc định.

## Chế độ Phát triển

Ứng dụng này có thể chạy ở chế độ phát triển độc lập mà không cần kết nối đến các microservice khác nhờ các API giả lập được tích hợp sẵn.

### Mock APIs

Các API giả lập được cài đặt trong `server.js` bao gồm:

- `/api/catalogue` - Danh sách sản phẩm
- `/api/cart` - Giỏ hàng
- `/orders` - Đơn hàng
- `/login` - Đăng nhập

## Cấu trúc dự án

```
├── api/                 # API clients và endpoints
├── public/              # Static assets và HTML templates
│   ├── css/             # CSS files
│   ├── img/             # Images
│   ├── js/              # JavaScript files
│   ├── *.html           # Legacy HTML templates
│   └── *-modern.html    # Modern HTML templates
├── server.js            # Express server và routes
├── config.js            # Application config
└── package.json         # Dependencies và scripts
```

## Sử dụng Docker

### Build Docker image

```bash
docker build -t frontend-eshop .
```

### Chạy với Docker

```bash
docker run -p 8079:8079 frontend-eshop
```

## Môi trường Production

Khi triển khai trong môi trường production, bạn cần:

1. Cập nhật `config.js` với các endpoint đúng cho các microservice khác
2. Đảm bảo Redis có sẵn cho session management hoặc cập nhật config để sử dụng giải pháp thay thế

## Đóng góp

Nếu bạn muốn đóng góp vào dự án này, vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi của bạn (`git commit -m 'Add amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request
