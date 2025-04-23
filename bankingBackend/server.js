require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());

const saltRounds = 10;

app.get('/test-db', (req, res) => {
    pool.query('SELECT 1 + 1 AS result', (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'DB connection error', details: err.message });
      }
      res.json({ message: 'DB connected', result: results[0].result });
    });
  });  

  app.post('/users/register', async (req, res) => {
    const {
      username,
      password,
      full_name,
      email
    } = req.body;
  
    if (!username || !password || !full_name || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const password_hash = await bcrypt.hash(password, saltRounds);
  
      pool.query(
        'INSERT INTO users (username, password_hash, full_name, email) VALUES (?, ?, ?, ?)',
        [username, password_hash, full_name, email],
        (err, userResult) => {
          if (err) {
            console.error('Error inserting into users:', err);
            return res.status(500).json({ error: 'Failed to register user', details: err.message });
          }
  
          const user_id = userResult.insertId;
  
          res.status(201).json({
            message: 'User registered successfully',
            user_id: user_id
          });
        }
      );
    } catch (error) {
      console.error('Hashing error:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  });  

app.post('/accounts/create', (req, res) => {
  const {
    user_id,
    national_number,
    nationality,
    birth_date,
    account_type_id,
    initial_balance = 0
  } = req.body;

  if (!user_id || !account_type_id || !national_number || !nationality || !birth_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const checkCustomer = 'SELECT id FROM customers WHERE user_id = ?';

  pool.query(checkCustomer, [user_id], (err, customerRows) => {
    if (err) return res.status(500).json({ error: 'DB error', details: err.message });

    const createOrUseCustomer = (customer_id) => {

      const account_number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const insertAccount = `
        INSERT INTO accounts (customer_id, account_number, account_type_id, balance)
        VALUES (?, ?, ?, ?)
      `;

      pool.query(insertAccount, [customer_id, account_number, account_type_id, initial_balance], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to create account', details: err.message });

        res.status(201).json({
          message: 'Account created',
          account_id: result.insertId,
          account_number: account_number
        });
      });
    };

    if (customerRows.length > 0) {

      createOrUseCustomer(customerRows[0].id);
    } else {
      const insertCustomer = `
        INSERT INTO customers (user_id, national_number, nationality, birth_date)
        VALUES (?, ?, ?, ?)
      `;

      pool.query(insertCustomer, [user_id, national_number, nationality, birth_date], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to create customer profile', details: err.message });

        createOrUseCustomer(result.insertId);
      });
    }
  });
});


app.post('/transactions/deposit', (req, res) => {
  const { account_id, amount } = req.body;

  if (!account_id || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid account_id and amount are required' });
  }

  const insertTx = `
    INSERT INTO transactions (account_id, amount, type)
    VALUES (?, ?, 'deposit')
  `;

  pool.query(insertTx, [account_id, amount], (err, txResult) => {
    if (err) {
      console.error('Error inserting transaction:', err);
      return res.status(500).json({ error: 'Transaction failed', details: err.message });
    }

    const updateBalance = `
      UPDATE accounts
      SET balance = balance + ?
      WHERE id = ?
    `;

    pool.query(updateBalance, [amount, account_id], (err2) => {
      if (err2) {
        console.error('Error updating balance:', err2);
        return res.status(500).json({ error: 'Failed to update account balance', details: err2.message });
      }

      res.status(200).json({
        message: 'Deposit successful',
        transaction_id: txResult.insertId,
        amount: amount
      });
    });
  });
});

app.post('/transactions/withdraw', (req, res) => {
  const { account_id, amount } = req.body;

  if (!account_id || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid account_id and amount are required' });
  }

  pool.query('SELECT balance FROM accounts WHERE id = ?', [account_id], (err, results) => {
    if (err || results.length === 0) {
      console.error('Error fetching balance:', err);
      return res.status(500).json({ error: 'Account not found or DB error' });
    }

    const currentBalance = results[0].balance;

    if (currentBalance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    const insertTx = `
      INSERT INTO transactions (account_id, amount, type)
      VALUES (?, ?, 'withdrawal')
    `;

    pool.query(insertTx, [account_id, amount], (err2, txResult) => {
      if (err2) {
        console.error('Error inserting withdrawal:', err2);
        return res.status(500).json({ error: 'Transaction failed', details: err2.message });
      }

      const updateBalance = `
        UPDATE accounts
        SET balance = balance - ?
        WHERE id = ?
      `;

      pool.query(updateBalance, [amount, account_id], (err3) => {
        if (err3) {
          console.error('Error updating balance:', err3);
          return res.status(500).json({ error: 'Failed to update account balance', details: err3.message });
        }

        res.status(200).json({
          message: 'Withdrawal successful',
          transaction_id: txResult.insertId,
          amount: amount
        });
      });
    });
  });
});

app.get('/accounts/:id', (req, res) => {
  const accountId = req.params.id;

  const sql = `
    SELECT 
      a.id AS account_id,
      a.account_number,
      a.balance,
      a.currency,
      a.created_at,
      at.type_name AS account_type,
      c.id AS customer_id,
      u.full_name,
      u.email
    FROM accounts a
    JOIN account_types at ON a.account_type_id = at.id
    JOIN customers c ON a.customer_id = c.id
    JOIN users u ON c.user_id = u.id
    WHERE a.id = ?
  `;

  pool.query(sql, [accountId], (err, results) => {
    if (err || results.length === 0) {
      console.error('Error fetching account info:', err);
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(results[0]);
  });
});

app.get('/accounts/:id/transactions', (req, res) => {
  const accountId = req.params.id;

  const sql = `
    SELECT 
      id AS transaction_id,
      type,
      amount,
      transaction_date
    FROM transactions
    WHERE account_id = ?
    ORDER BY transaction_date DESC
  `;

  pool.query(sql, [accountId], (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ error: 'Failed to get transactions', details: err.message });
    }

    res.json({
      account_id: accountId,
      transactions: results
    });
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

app.post('/users/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';

  pool.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token
    });
  });
});
