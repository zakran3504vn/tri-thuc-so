const pool = require('../../config/database');

async function migrate() {
  try {
    console.log('Đang chạy migration: Thêm cột slug vào bảng tests...');

    // Check if slug column already exists
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM tests LIKE 'slug'
    `);

    if (columns.length === 0) {
      // Add slug column as nullable first
      await pool.query(`
        ALTER TABLE tests
        ADD COLUMN slug VARCHAR(255) NULL AFTER title
      `);
      console.log('Đã thêm cột slug vào bảng tests');
    } else {
      console.log('Cột slug đã tồn tại trong bảng tests');
    }

    // Generate slugs for existing tests that don't have one
    const [tests] = await pool.query('SELECT id, title, slug FROM tests WHERE slug IS NULL OR slug = ""');
    if (tests.length > 0) {
      for (const test of tests) {
        const slug = generateSlug(test.title);
        await pool.query('UPDATE tests SET slug = ? WHERE id = ?', [slug, test.id]);
      }
      console.log(`Đã tạo slug cho ${tests.length} đề kiểm tra hiện có`);
    } else {
      console.log('Tất cả đề kiểm tra đã có slug');
    }

    // Now make slug column unique and NOT NULL if all rows have slugs
    const [emptySlugs] = await pool.query('SELECT COUNT(*) as count FROM tests WHERE slug IS NULL OR slug = ""');
    if (emptySlugs[0].count === 0) {
      try {
        await pool.query(`
          ALTER TABLE tests
          MODIFY COLUMN slug VARCHAR(255) NOT NULL UNIQUE
        `);
        console.log('Đã set cột slug là NOT NULL UNIQUE');
      } catch (error) {
        console.log('Cột slug đã là UNIQUE hoặc có lỗi khi set UNIQUE:', error.message);
      }
    }

    console.log('Migration hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi chạy migration:', error);
    process.exit(1);
  }
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

migrate();
