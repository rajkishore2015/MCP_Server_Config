const express = require('express');
const mysql = require('mysql2');
const { getMySQLPool } = require('../helpers/db');
const router = express.Router();

router.get('/users', (req, res) => {
  const dbName = req.query.db || process.env.MYSQL_DATABASE;
  const tableName = req.query.table || 'users';
  const pool = getMySQLPool(dbName);
  pool.query(`SELECT * FROM \`${tableName}\``, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/users', (req, res) => {
  const dbName = req.body.db || process.env.MYSQL_DATABASE;
  const tableName = req.body.table || 'users';
  const { name, email } = req.body;
  const pool = getMySQLPool(dbName);
  pool.query(`INSERT INTO \`${tableName}\` (name, email) VALUES (?, ?)`, [name, email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId, name, email });
  });
});

router.post('/create-db', (req, res) => {
  const { dbName } = req.body;
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    ssl: process.env.MYSQL_SSL === 'true'
  });
  connection.query(`CREATE DATABASE \`${dbName}\``, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Database ${dbName} created successfully.` });
    connection.end();
  });
});

module.exports = router;
