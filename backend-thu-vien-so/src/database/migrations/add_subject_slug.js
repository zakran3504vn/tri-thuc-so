const pool = require('../../config/database');

async function migrate() {
  try {
    console.log('Đang chạy migration: Thêm cột slug vào bảng subjects...');

    // Check if slug column already exists
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM subjects LIKE 'slug'
    `);

    if (columns.length === 0) {
      // Add slug column as nullable first
      await pool.query(`
        ALTER TABLE subjects
        ADD COLUMN slug VARCHAR(255) NULL AFTER title
      `);
      console.log('Đã thêm cột slug vào bảng subjects');
    } else {
      console.log('Cột slug đã tồn tại trong bảng subjects');
    }

    // Generate slugs for existing subjects that don't have one
    const [subjects] = await pool.query('SELECT id, title, slug FROM subjects WHERE slug IS NULL OR slug = ""');
    if (subjects.length > 0) {
      for (const subject of subjects) {
        const slug = generateSlug(subject.title);
        await pool.query('UPDATE subjects SET slug = ? WHERE id = ?', [slug, subject.id]);
      }
      console.log(`Đã tạo slug cho ${subjects.length} môn học hiện có`);
    } else {
      console.log('Tất cả môn học đã có slug');
    }

    // Now make slug column unique and NOT NULL if all rows have slugs
    const [emptySlugs] = await pool.query('SELECT COUNT(*) as count FROM subjects WHERE slug IS NULL OR slug = ""');
    if (emptySlugs[0].count === 0) {
      try {
        await pool.query(`
          ALTER TABLE subjects
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
