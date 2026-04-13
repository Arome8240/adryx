#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests PostgreSQL connection before Docker rebuild
 * Run from apps/backend directory
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found at apps/backend/.env', 'red');
    log('💡 Please create .env file from .env.example', 'yellow');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return env;
}

async function testConnection(config) {
  const client = new Client(config);
  
  try {
    log('\n🔌 Attempting to connect to PostgreSQL...', 'cyan');
    await client.connect();
    log('✅ Successfully connected to PostgreSQL!', 'green');
    
    // Test query
    log('\n📊 Running test query...', 'cyan');
    const result = await client.query('SELECT version()');
    log(`✅ PostgreSQL Version: ${result.rows[0].version}`, 'green');
    
    // Check if database exists
    log('\n🗄️  Checking database...', 'cyan');
    const dbCheck = await client.query(
      `SELECT datname FROM pg_database WHERE datname = $1`,
      [config.database]
    );
    
    if (dbCheck.rows.length > 0) {
      log(`✅ Database '${config.database}' exists`, 'green');
    } else {
      log(`⚠️  Database '${config.database}' does not exist`, 'yellow');
      log(`💡 It will be created automatically by TypeORM`, 'blue');
    }
    
    // List existing tables
    log('\n📋 Checking for existing tables...', 'cyan');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    if (tablesResult.rows.length > 0) {
      log(`✅ Found ${tablesResult.rows.length} existing tables:`, 'green');
      tablesResult.rows.forEach(row => {
        log(`   - ${row.table_name}`, 'blue');
      });
    } else {
      log('ℹ️  No tables found (will be created by TypeORM migrations)', 'blue');
    }
    
    await client.end();
    return true;
  } catch (error) {
    log('\n❌ Connection failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    
    if (error.code === 'ECONNREFUSED') {
      log('\n💡 Troubleshooting:', 'yellow');
      log('   1. Make sure PostgreSQL is running', 'yellow');
      log('   2. Check if the host and port are correct', 'yellow');
      log('   3. Verify firewall settings', 'yellow');
    } else if (error.code === '28P01') {
      log('\n💡 Authentication failed:', 'yellow');
      log('   1. Check your username and password', 'yellow');
      log('   2. Verify pg_hba.conf settings', 'yellow');
    } else if (error.code === '3D000') {
      log('\n💡 Database does not exist:', 'yellow');
      log('   1. Create the database manually, or', 'yellow');
      log('   2. TypeORM will create it with synchronize: true', 'yellow');
    }
    
    await client.end().catch(() => {});
    return false;
  }
}

async function testDockerConnection() {
  log('\n🐳 Testing Docker PostgreSQL connection...', 'cyan');
  
  const dockerConfig = {
    host: 'localhost',
    port: 5433,
    database: 'adryx',
    user: 'adryx',
    password: 'adryx_password',
  };
  
  const client = new Client(dockerConfig);
  
  try {
    await client.connect();
    log('✅ Docker PostgreSQL is running and accessible', 'green');
    await client.end();
    return true;
  } catch (error) {
    log('ℹ️  Docker PostgreSQL not running (this is OK if testing local DB)', 'blue');
    await client.end().catch(() => {});
    return false;
  }
}

async function main() {
  log('═══════════════════════════════════════════════', 'cyan');
  log('  PostgreSQL Connection Test', 'cyan');
  log('═══════════════════════════════════════════════', 'cyan');
  
  // Load environment variables
  log('\n📁 Loading environment variables...', 'cyan');
  const env = loadEnv();
  
  const config = {
    host: env.DB_HOST || 'localhost',
    port: parseInt(env.DB_PORT || '5432', 10),
    database: env.DB_DATABASE || 'adryx',
    user: env.DB_USERNAME || 'postgres',
    password: env.DB_PASSWORD || 'password',
  };
  
  log('✅ Environment variables loaded', 'green');
  log('\n📝 Connection Configuration:', 'cyan');
  log(`   Host:     ${config.host}`, 'blue');
  log(`   Port:     ${config.port}`, 'blue');
  log(`   Database: ${config.database}`, 'blue');
  log(`   User:     ${config.user}`, 'blue');
  log(`   Password: ${'*'.repeat(config.password.length)}`, 'blue');
  
  // Test main connection
  const mainSuccess = await testConnection(config);
  
  // Test Docker connection
  await testDockerConnection();
  
  // Summary
  log('\n═══════════════════════════════════════════════', 'cyan');
  log('  Test Summary', 'cyan');
  log('═══════════════════════════════════════════════', 'cyan');
  
  if (mainSuccess) {
    log('\n✅ All tests passed!', 'green');
    log('✅ Database connection is working correctly', 'green');
    log('✅ Ready to rebuild Docker containers', 'green');
    log('\n💡 Next steps:', 'blue');
    log('   1. Run: make docker-rebuild', 'blue');
    log('   2. Or: docker compose up -d --build', 'blue');
    process.exit(0);
  } else {
    log('\n❌ Tests failed!', 'red');
    log('⚠️  Please fix the database connection before rebuilding Docker', 'yellow');
    log('\n💡 Common fixes:', 'yellow');
    log('   1. Update apps/backend/.env with correct credentials', 'yellow');
    log('   2. Ensure PostgreSQL is running', 'yellow');
    log('   3. Create the database if it doesn\'t exist', 'yellow');
    process.exit(1);
  }
}

// Run the test
main().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
