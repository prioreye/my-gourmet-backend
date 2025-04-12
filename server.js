// server.js
const express = require('express');
const app = express();

// ① db.jsを読み込む
const pool = require('./db');

// ② JSONボディを扱う
app.use(express.json());

// ③ テスト用
app.get('/api/testdb', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    // ★ エラーログを詳細に
    console.error("Detailed error:", err);
    // ★ レスポンスにエラー情報を含める
    res.status(500).json({ error: 'DB query error', details: err.message });
  }
});

// ④ 通常のルート
app.get('/', (req, res) => {
  res.send('Hello from My Gourmet Backend (Pool)!');
});

// (抜粋) 認証ルータ読み込み
const authRouter = require('./routes/auth');
app.use(express.json());
app.use('/api', authRouter);

// ⑤ サーバ起動
// RailwayがPORT変数を注入。なければ8080を使う。
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
