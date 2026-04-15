# Backend Thư Viện Số

Backend API cho dự án thư viện số với Node.js + MySQL.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình môi trường:
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin database của bạn:
```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=thu_vien_so
```

3. Khởi tạo database:
```bash
npm run init-db
```

## Chạy server

### Development mode (với auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server sẽ chạy tại `http://localhost:3001`

## API Endpoints

### Stories (Truyện)

- `GET /api/stories` - Lấy danh sách tất cả truyện
- `GET /api/stories?category=Phiêu+Lưu` - Lọc theo thể loại
- `GET /api/stories/:id` - Lấy chi tiết một truyện
- `POST /api/stories` - Tạo truyện mới
- `PUT /api/stories/:id` - Cập nhật truyện
- `DELETE /api/stories/:id` - Xóa truyện

### Pages (Trang truyện)

- `GET /api/pages/story/:storyId` - Lấy tất cả trang của một truyện
- `GET /api/pages/:id` - Lấy chi tiết một trang
- `POST /api/pages` - Tạo trang mới
- `PUT /api/pages/:id` - Cập nhật trang
- `DELETE /api/pages/:id` - Xóa trang

### Bookmarks (Đánh dấu trang)

- `GET /api/bookmarks?user_id=xxx&story_id=1` - Lấy bookmark
- `POST /api/bookmarks` - Tạo/cập nhật bookmark
- `DELETE /api/bookmarks?user_id=xxx&story_id=1` - Xóa bookmark

### Notes (Ghi chú)

- `GET /api/notes?user_id=xxx&story_id=1` - Lấy tất cả notes
- `GET /api/notes/page?user_id=xxx&story_id=1&page_number=0` - Lấy note của một trang
- `POST /api/notes` - Tạo/cập nhật note
- `DELETE /api/notes?user_id=xxx&story_id=1&page_number=0` - Xóa note

### Users (Người dùng)

- `GET /api/users` - Lấy danh sách users
- `GET /api/users?role=admin` - Lọc theo role
- `GET /api/users/:id` - Lấy chi tiết user
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### Subjects (Môn học)

- `GET /api/subjects` - Lấy danh sách môn học
- `GET /api/subjects?grade_level=Lớp+1-3` - Lọc theo khối lớp
- `GET /api/subjects/:id` - Lấy chi tiết môn học
- `POST /api/subjects` - Tạo môn học mới
- `PUT /api/subjects/:id` - Cập nhật môn học
- `DELETE /api/subjects/:id` - Xóa môn học

### Lessons (Bài giảng)

- `GET /api/lessons` - Lấy danh sách bài giảng
- `GET /api/lessons?subject_id=1` - Lọc theo môn học
- `GET /api/lessons/:id` - Lấy chi tiết bài giảng
- `POST /api/lessons` - Tạo bài giảng mới
- `PUT /api/lessons/:id` - Cập nhật bài giảng
- `DELETE /api/lessons/:id` - Xóa bài giảng

### Activities (Hoạt động)

- `GET /api/activities` - Lấy danh sách hoạt động
- `GET /api/activities/:id` - Lấy chi tiết hoạt động (kèm hình ảnh)
- `POST /api/activities` - Tạo hoạt động mới
- `PUT /api/activities/:id` - Cập nhật hoạt động
- `DELETE /api/activities/:id` - Xóa hoạt động

### Activity Images (Hình ảnh hoạt động)

- `GET /api/activity-images?activity_id=1` - Lấy hình ảnh theo hoạt động
- `POST /api/activity-images` - Tải lên hình ảnh mới
- `PUT /api/activity-images/:id` - Cập nhật hình ảnh
- `DELETE /api/activity-images/:id` - Xóa hình ảnh

### Reference Books (Sách tham khảo)

- `GET /api/reference-books` - Lấy danh sách sách tham khảo
- `GET /api/reference-books?category=Giáo+khoa` - Lọc theo danh mục
- `GET /api/reference-books/:id` - Lấy chi tiết sách
- `POST /api/reference-books` - Thêm sách mới
- `PUT /api/reference-books/:id` - Cập nhật sách
- `DELETE /api/reference-books/:id` - Xóa sách

### Announcements (Thông báo)

- `GET /api/announcements` - Lấy danh sách thông báo
- `GET /api/announcements?type=urgent` - Lọc theo loại
- `GET /api/announcements/:id` - Lấy chi tiết thông báo
- `POST /api/announcements` - Tạo thông báo mới
- `PUT /api/announcements/:id` - Cập nhật thông báo
- `DELETE /api/announcements/:id` - Xóa thông báo

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

### users
- id (INT, PK)
- username (VARCHAR, UNIQUE)
- password (VARCHAR)
- full_name (VARCHAR)
- email (VARCHAR, UNIQUE)
- role (ENUM: admin, teacher, student)
- avatar (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### subjects
- id (INT, PK)
- title (VARCHAR)
- description (TEXT)
- grade_level (VARCHAR)
- teacher_id (INT, FK → users)
- thumbnail (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### lessons
- id (INT, PK)
- subject_id (INT, FK → subjects)
- title (VARCHAR)
- description (TEXT)
- video_url (TEXT)
- video_duration (INT)
- content (TEXT)
- order_index (INT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### activities
- id (INT, PK)
- title (VARCHAR)
- description (TEXT)
- activity_date (DATE)
- location (VARCHAR)
- thumbnail (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### activity_images
- id (INT, PK)
- activity_id (INT, FK → activities)
- image_url (TEXT)
- caption (VARCHAR)
- order_index (INT)
- created_at (TIMESTAMP)

### reference_books
- id (INT, PK)
- title (VARCHAR)
- author (VARCHAR)
- description (TEXT)
- category (VARCHAR)
- file_url (TEXT)
- file_type (VARCHAR)
- file_size (INT)
- cover_image (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### announcements
- id (INT, PK)
- title (VARCHAR)
- content (TEXT)
- announcement_type (ENUM: general, urgent, event)
- priority (INT)
- publish_date (DATETIME)
- expiry_date (DATETIME)
- is_active (BOOLEAN)
- created_by (INT, FK → users)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
