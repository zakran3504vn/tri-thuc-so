/**
 * Migration: Create banners table
 * Created: 2024-04-16
 */

async function up(pool) {
  console.log('Running migration 001: Create banners table...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      link_url VARCHAR(255) DEFAULT '/mon-hoc',
      order_index INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  
  console.log('✅ Banners table created');
}

async function down(pool) {
  console.log('Reverting migration 001: Drop banners table...');
  await pool.query(`DROP TABLE IF EXISTS banners`);
  console.log('✅ Banners table dropped');
}

module.exports = { up, down };
