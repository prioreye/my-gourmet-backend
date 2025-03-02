// routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // db.js (コネクションプール) を読み込む
const bcrypt = require('bcrypt'); // パスワードハッシュ用 (後述)

router.post('/signup', async (req, res) => {
  try {
    const { nickname, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // TODO: 重複チェック(既に同じemailのユーザーがいるか)

    // パスワードハッシュ
    const hashed = await bcrypt.hash(password, 10);

    // DBにINSERT
    const sql = 'INSERT INTO users (email, password_hash, nickname) VALUES (?, ?, ?)';
    await pool.query(sql, [email, hashed, nickname || '']);

    // 成功レスポンス
    // 将来的にはJWTやセッションIDを返すことを想定
    return res.json({ message: 'Signup successful', token: 'dummy_token_12345' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // ユーザーを検索
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];

    // パスワード照合
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 成功 (仮トークン)
    return res.json({ message: 'Login successful', token: 'dummy_token_12345' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
