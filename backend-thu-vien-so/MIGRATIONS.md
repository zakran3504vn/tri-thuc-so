# Database Migrations

Hệ thống migration giúp quản lý thay đổi database một cách có trật tự.

## Các lệnh có sẵn

```bash
# Chạy tất cả migrations đang chờ
npm run migrate

# Xem trạng thái migrations
npm run migrate:status

# Hoàn tác migration cuối cùng
npm run migrate:down

# Tạo migration mới
npm run migrate:create add_users_table
```

## Cấu trúc migration file

Mỗi migration file phải export 2 hàm `up` và `down`:

```javascript
/**
 * Migration: Tên migration
 * Created: YYYY-MM-DD
 */

async function up(pool) {
  // Code tạo bảng/sửa đổi
  await pool.query(`
    CREATE TABLE IF NOT EXISTS example (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255)
    )
  `);
}

async function down(pool) {
  // Code hoàn tác (xóa bảng/rollback)
  await pool.query(`DROP TABLE IF EXISTS example`);
}

module.exports = { up, down };
```

## Các migrations hiện có

| File | Mô tả |
|------|-------|
| `001_create_banners_table.js` | Tạo bảng banners cho HeroSection |
| `002_create_stats_table.js` | Tạo bảng stats cho StatsSection |
| `003_seed_banners.js` | Thêm dữ liệu mẫu banners |
| `004_seed_stats.js` | Thêm dữ liệu mẫu stats |

## Chạy migrations lần đầu

```bash
cd c:\Users\nguye\Documents\code-TA\backend-thu-vien-so
npm run migrate
```

## Lưu ý

- Migrations được lưu trong `src/database/migrations/`
- Bảng `migrations` tự động tạo để theo dõi migrations đã chạy
- Mỗi migration chỉ chạy 1 lần (dựa vào tên file)
- Không xóa/sửa file migration đã chạy
