/**
 * Migration: Create stats table
 * Created: 2024-04-16
 */

async function up(pool) {
  console.log('Running migration 002: Create stats table...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(100) NOT NULL,
      value VARCHAR(50) NOT NULL,
      icon VARCHAR(50) DEFAULT 'ri-star-line',
      order_index INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  
  console.log('✅ Stats table created');
}

async function down(pool) {
  console.log('Reverting migration 002: Drop stats table...');
  await pool.query(`DROP TABLE IF EXISTS stats`);
  console.log('✅ Stats table dropped');
}

module.exports = { up, down };
