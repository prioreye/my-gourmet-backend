// db.js
const mysql = require('mysql2/promise');

// コネクションプールを作成
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Happyjamjam3150!',
  database: 'gourmet_db',  // 先程作成したデータベース名
  waitForConnections: true,
  connectionLimit: 10,      // 同時接続数の上限
  queueLimit: 0
});

// このプールを他のファイルで使えるようにexport
module.exports = pool;
