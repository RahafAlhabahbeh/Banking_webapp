// For development, use SQLite instead of MySQL
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in the backend directory
const dbPath = path.join(__dirname, 'banking_dev.db');
const db = new sqlite3.Database(dbPath);

// Create a pool-like interface for compatibility
const pool = {
  query: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    db.all(sql, params, (err, rows) => {
      if (err) {
        callback(err, null);
      } else {
        // Convert result to MySQL-like format
        const result = {
          length: rows ? rows.length : 0,
          0: rows || []
        };
        if (sql.toLowerCase().includes('insert')) {
          result.insertId = this.lastID;
        }
        callback(null, rows || []);
      }
    });
  },
  getConnection: (callback) => {
    callback(null, {
      query: (sql, params, cb) => pool.query(sql, params, cb),
      release: () => {}
    });
  }
};

// Initialize database tables
db.serialize(() => {
  // Create account_types table
  db.run(`
    CREATE TABLE IF NOT EXISTS account_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      national_number TEXT UNIQUE NOT NULL,
      nationality TEXT NOT NULL,
      birth_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create accounts table
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      account_number TEXT UNIQUE NOT NULL,
      account_type_id INTEGER NOT NULL,
      balance DECIMAL(15,2) DEFAULT 0.00,
      currency TEXT DEFAULT 'USD',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (account_type_id) REFERENCES account_types(id)
    )
  `);

  // Create transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
      transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    )
  `);

  // Insert default account types
  db.run(`
    INSERT OR IGNORE INTO account_types (id, type_name) VALUES
    (1, 'Checking'),
    (2, 'Savings'),
    (3, 'Business')
  `);

  console.log('Database tables initialized');
});

// #region agent log
const serverEndpoint = 'http://127.0.0.1:7243/ingest/5985eeb0-46aa-4174-91f0-d1305ae1baab';
const logToServer = (location, message, data = {}) => {
  fetch(serverEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      message,
      data: { ...data, sessionId: 'debug-session', runId: 'initial-run', hypothesisId: 'hypothesis_1,hypothesis_3' },
      timestamp: Date.now()
    })
  }).catch(() => {});
};
// #endregion

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    logToServer('db.js:connection-test', 'Database connection FAILED', {
      error: err.message,
      code: err.code,
      errno: err.errno,
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'banking_db'
    });
  } else {
    console.log('Database connected successfully');
    logToServer('db.js:connection-test', 'Database connection SUCCESSFUL', {
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'banking_db'
    });
    connection.release();
  }
});

module.exports = pool;
