# Hướng dẫn cài đặt và chạy Backend Thư Viện Số

## Cài đặt Backend

### 1. Cài đặt dependencies
Mở terminal tại thư mục `backend-thu-vien-so`:

```bash
cd backend-thu-vien-so
npm install
```

### 2. Cấu hình Database
Sao chép file môi trường:
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin MySQL của bạn:
```
PORT=5931
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=thu_vien_so
```

### 3. Khởi tạo Database
Chạy lệnh để tạo database và các bảng:
```bash
npm run init-db
```

Lệnh này sẽ:
- Tạo database `thu_vien_so`
- Tạo các bảng: stories, pages, bookmarks, notes
- Insert dữ liệu mẫu (4 truyện với đầy đủ trang)

### 4. Chạy Backend Server

**Development mode (với auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Backend sẽ chạy tại: `http://localhost:5931`

## Chạy Frontend

### 1. Cài đặt dependencies
Mở terminal tại thư mục `thu-vien-so`:

```bash
cd thu-vien-so
npm install
```

### 2. Chạy Frontend Server
```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5930`

## Kiểm tra API

### Health Check
```bash
curl http://localhost:5931/api/health
```

### Lấy danh sách truyện
```bash
curl http://localhost:5931/api/stories
```

### Lấy chi tiết truyện
```bash
curl http://localhost:5931/api/stories/1
```

### Lấy trang của truyện
```bash
curl http://localhost:5931/api/pages/story/1
```

## Cấu trúc Backend

```
backend-thu-vien-so/
├── src/
│   ├── config/
│   │   └── database.js       # Cấu hình kết nối MySQL
│   ├── database/
│   │   └── init.js           # Script khởi tạo database
│   ├── routes/
│   │   ├── stories.js        # API cho truyện
│   │   ├── pages.js          # API cho trang
│   │   ├── bookmarks.js      # API cho bookmark
│   │   └── notes.js          # API cho ghi chú
│   └── server.js             # Main server file
├── .env.example              # Mẫu file cấu hình
├── .gitignore
├── package.json
└── README.md
```

## Database Schema

### stories
- id (INT, PK)
- title (VARCHAR)
- author (VARCHAR)
- category (VARCHAR)
- total_pages (INT)
- cover_image (TEXT)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### pages
- id (INT, PK)
- story_id (INT, FK)
- page_number (INT)
- content (TEXT)
- image_url (TEXT)
- created_at (TIMESTAMP)

### bookmarks
- id (INT, PK)
- user_id (VARCHAR)
- story_id (INT, FK)
- page_number (INT)
- created_at (TIMESTAMP)

### notes
- id (INT, PK)
- user_id (VARCHAR)
- story_id (INT, FK)
- page_number (INT)
- note_content (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Lưu ý

- Đảm bảo MySQL đang chạy trước khi khởi tạo database
- Mật khẩu MySQL để trống trong file `.env` nếu không có password
- Backend sử dụng CORS để cho phép frontend gọi API từ domain khác
- Dữ liệu bookmark và notes hiện tại sử dụng `user_id` dạng string (có thể thay bằng JWT authentication sau này)
