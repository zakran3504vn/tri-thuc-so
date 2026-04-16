const pool = require('../../config/database');

async function migrate() {
  try {
    console.log('Đang chạy migration: Thêm danh mục và slug cho thông báo...');

    // 1. Create categories_announcements table if not exists
    const [tables] = await pool.query(`
      SHOW TABLES LIKE 'categories_announcements'
    `);

    if (tables.length === 0) {
      await pool.query(`
        CREATE TABLE categories_announcements (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) NOT NULL UNIQUE,
          color ENUM('blue', 'red', 'green', 'purple', 'orange', 'gray') DEFAULT 'blue',
          description TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Đã tạo bảng categories_announcements');

      // Insert default categories
      const defaultCategories = [
        { name: 'Thông báo chung', slug: 'thong-bao-chung', color: 'blue', description: 'Thông báo chung của trường' },
        { name: 'Khẩn cấp', slug: 'khan-cap', color: 'red', description: 'Thông báo khẩn cấp, cần chú ý ngay' },
        { name: 'Sự kiện', slug: 'su-kien', color: 'green', description: 'Sự kiện sắp diễn ra' },
        { name: 'Học tập', slug: 'hoc-tap', color: 'purple', description: 'Thông báo liên quan đến học tập' },
        { name: 'Hoạt động', slug: 'hoat-dong', color: 'orange', description: 'Hoạt động ngoại khóa' }
      ];

      for (const cat of defaultCategories) {
        await pool.query(`
          INSERT INTO categories_announcements (name, slug, color, description)
          VALUES (?, ?, ?, ?)
        `, [cat.name, cat.slug, cat.color, cat.description]);
      }
      console.log('Đã thêm 5 danh mục mặc định');
    } else {
      console.log('Bảng categories_announcements đã tồn tại');
    }

    // 2. Check if slug column exists in announcements
    const [slugColumns] = await pool.query(`
      SHOW COLUMNS FROM announcements LIKE 'slug'
    `);

    if (slugColumns.length === 0) {
      await pool.query(`
        ALTER TABLE announcements
        ADD COLUMN slug VARCHAR(255) NULL AFTER title
      `);
      console.log('Đã thêm cột slug vào bảng announcements');
    } else {
      console.log('Cột slug đã tồn tại trong bảng announcements');
    }

    // 3. Check if category_id column exists in announcements
    const [categoryColumns] = await pool.query(`
      SHOW COLUMNS FROM announcements LIKE 'category_id'
    `);

    if (categoryColumns.length === 0) {
      await pool.query(`
        ALTER TABLE announcements
        ADD COLUMN category_id INT NULL AFTER slug
      `);
      console.log('Đã thêm cột category_id vào bảng announcements');

      // Add foreign key constraint
      try {
        await pool.query(`
          ALTER TABLE announcements
          ADD CONSTRAINT fk_announcement_category
          FOREIGN KEY (category_id) REFERENCES categories_announcements(id)
          ON DELETE SET NULL ON UPDATE CASCADE
        `);
        console.log('Đã thêm khóa ngoại cho category_id');
      } catch (fkError) {
        console.log('Khóa ngoại đã tồn tại hoặc có lỗi:', fkError.message);
      }
    } else {
      console.log('Cột category_id đã tồn tại trong bảng announcements');
    }

    // 4. Generate slugs for existing announcements that don't have one
    const [announcements] = await pool.query(`
      SELECT id, title, slug FROM announcements WHERE slug IS NULL OR slug = ''
    `);

    if (announcements.length > 0) {
      for (const ann of announcements) {
        let slug = generateSlug(ann.title);
        
        // Check if slug already exists
        const [existing] = await pool.query(`
          SELECT id FROM announcements WHERE slug = ? AND id != ?
        `, [slug, ann.id]);
        
        if (existing.length > 0) {
          // Append timestamp to make slug unique
          slug = `${slug}-${Date.now()}`;
        }
        
        await pool.query('UPDATE announcements SET slug = ? WHERE id = ?', [slug, ann.id]);
      }
      console.log(`Đã tạo slug cho ${announcements.length} thông báo hiện có`);
    } else {
      console.log('Tất cả thông báo đã có slug');
    }

    // 5. Map existing announcement_type to category_id
    const [announcementsWithoutCategory] = await pool.query(`
      SELECT a.id, a.announcement_type 
      FROM announcements a 
      WHERE a.category_id IS NULL
    `);

    if (announcementsWithoutCategory.length > 0) {
      // Get category mappings
      const [categories] = await pool.query(`SELECT id, slug FROM categories_announcements`);
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.slug] = cat.id;
      });

      for (const ann of announcementsWithoutCategory) {
        let categoryId = null;
        
        // Map announcement_type to category
        if (ann.announcement_type === 'urgent') {
          categoryId = categoryMap['khan-cap'];
        } else if (ann.announcement_type === 'event') {
          categoryId = categoryMap['su-kien'];
        } else {
          // Default to 'thong-bao-chung' for general type
          categoryId = categoryMap['thong-bao-chung'];
        }

        if (categoryId) {
          await pool.query('UPDATE announcements SET category_id = ? WHERE id = ?', [categoryId, ann.id]);
        }
      }
      console.log(`Đã gán danh mục cho ${announcementsWithoutCategory.length} thông báo`);
    } else {
      console.log('Tất cả thông báo đã có danh mục');
    }

    // 6. Now make slug column unique and NOT NULL if all rows have slugs
    const [emptySlugs] = await pool.query(`
      SELECT COUNT(*) as count FROM announcements WHERE slug IS NULL OR slug = ''
    `);

    if (emptySlugs[0].count === 0) {
      try {
        await pool.query(`
          ALTER TABLE announcements
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
