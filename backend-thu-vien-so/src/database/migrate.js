/**
 * Database Migration Runner
 * Usage: node src/database/migrate.js [up|down|status|create]
 */

const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Ensure migrations table exists
async function initMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

// Get executed migrations
async function getExecutedMigrations() {
  const [rows] = await pool.query('SELECT name FROM migrations ORDER BY id ASC');
  return rows.map(r => r.name);
}

// Get all migration files
function getMigrationFiles() {
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.js'))
    .sort();
}

// Run single migration up
async function runMigration(name) {
  const migration = require(path.join(MIGRATIONS_DIR, name));
  await migration.up(pool);
  await pool.query('INSERT INTO migrations (name) VALUES (?)', [name]);
}

// Run single migration down
async function revertMigration(name) {
  const migration = require(path.join(MIGRATIONS_DIR, name));
  await migration.down(pool);
  await pool.query('DELETE FROM migrations WHERE name = ?', [name]);
}

// Run all pending migrations
async function migrateUp() {
  await initMigrationsTable();
  
  const executed = await getExecutedMigrations();
  const files = getMigrationFiles();
  const pending = files.filter(f => !executed.includes(f));
  
  if (pending.length === 0) {
    console.log('✅ No pending migrations');
    return;
  }
  
  console.log(`\n📦 Running ${pending.length} migration(s)...\n`);
  
  for (const file of pending) {
    try {
      await runMigration(file);
      console.log(`✅ ${file}`);
    } catch (err) {
      console.error(`❌ ${file} failed:`, err.message);
      process.exit(1);
    }
  }
  
  console.log('\n✅ All migrations completed!');
}

// Revert last migration
async function migrateDown() {
  await initMigrationsTable();
  
  const [rows] = await pool.query('SELECT name FROM migrations ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) {
    console.log('⚠️ No migrations to revert');
    return;
  }
  
  const lastMigration = rows[0].name;
  console.log(`\n⏮️  Reverting ${lastMigration}...\n`);
  
  try {
    await revertMigration(lastMigration);
    console.log(`✅ Reverted ${lastMigration}`);
  } catch (err) {
    console.error(`❌ Failed to revert:`, err.message);
    process.exit(1);
  }
}

// Show migration status
async function showStatus() {
  await initMigrationsTable();
  
  const executed = await getExecutedMigrations();
  const files = getMigrationFiles();
  
  console.log('\n📋 Migration Status\n');
  console.log('─'.repeat(50));
  
  for (const file of files) {
    const isExecuted = executed.includes(file);
    const status = isExecuted ? '✅ Executed' : '⏳ Pending';
    console.log(`${status}  ${file}`);
  }
  
  console.log('─'.repeat(50));
  console.log(`\nTotal: ${files.length}, Executed: ${executed.length}, Pending: ${files.length - executed.length}\n`);
}

// Create new migration
function createMigration(name) {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const filename = `${timestamp}_${name}.js`;
  const filepath = path.join(MIGRATIONS_DIR, filename);
  
  const template = `/**
 * Migration: ${name}
 * Created: ${new Date().toISOString().split('T')[0]}
 */

async function up(pool) {
  console.log('Running migration: ${name}...');
  
  // Your migration code here
  
  console.log('✅ ${name} completed');
}

async function down(pool) {
  console.log('Reverting migration: ${name}...');
  
  // Your revert code here
  
  console.log('✅ ${name} reverted');
}

module.exports = { up, down };
`;
  
  fs.writeFileSync(filepath, template);
  console.log(`✅ Created migration: ${filename}`);
}

// Main
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];
  
  try {
    switch (command) {
      case 'up':
        await migrateUp();
        break;
      case 'down':
        await migrateDown();
        break;
      case 'status':
        await showStatus();
        break;
      case 'create':
        if (!arg) {
          console.error('❌ Please provide a migration name: npm run migrate:create <name>');
          process.exit(1);
        }
        createMigration(arg);
        break;
      default:
        console.log(`
📦 Database Migration Tool

Usage:
  node src/database/migrate.js up           Run all pending migrations
  node src/database/migrate.js down         Revert last migration
  node src/database/migrate.js status       Show migration status
  node src/database/migrate.js create <name> Create new migration

Examples:
  npm run migrate
  npm run migrate:down
  npm run migrate:status
  npm run migrate:create add_users_table
        `);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
