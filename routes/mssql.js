
const express = require('express');
const mssql = require('mssql');
const { getMSSQLConfig } = require('../helpers/db');
const router = express.Router();

// Generic MSSQL insert endpoint
router.post('/insert', async (req, res) => {
  const dbName = req.body.db || process.env.MSSQL_DATABASE;
  const tableName = req.body.table;
  let columns = req.body.columns;
  let values = req.body.values;

  // If columns/values not provided, extract from other fields
  if (!columns || !values) {
    columns = [];
    values = [];
    for (const key in req.body) {
      if (key !== 'db' && key !== 'table') {
        columns.push(key);
        values.push(req.body[key]);
      }
    }
  }

  if (!tableName || !columns || !values || columns.length !== values.length) {
    return res.status(400).json({ error: 'Missing or invalid table, columns, or values.' });
  }
  const config = getMSSQLConfig(dbName);
  const columnsStr = columns.map(col => `[${col}]`).join(', ');
  const valuesStr = values.map(val => typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : val).join(', ');

  try {
    await mssql.connect(config);
    // Check if table exists
    const checkTableSql = `SELECT OBJECT_ID(N'[dbo].[${tableName}]', N'U') AS TableId`;
    const checkResult = await mssql.query(checkTableSql);
    if (!checkResult.recordset[0].TableId) {
      return res.status(400).json({ error: `Table '${tableName}' does not exist in database '${dbName}'.` });
    }
    // Table exists, proceed with insert
    const sql = `INSERT INTO [${tableName}] (${columnsStr}) VALUES (${valuesStr});`;
    const result = await mssql.query(sql);
    res.json({ message: 'Insert successful', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    mssql.close();
  }
});

router.get('/users', async (req, res) => {
  const dbName = req.query.db || process.env.MSSQL_DATABASE;
  const tableName = req.query.table || 'users';
  const config = getMSSQLConfig(dbName);
  try {
    await mssql.connect(config);
    const result = await mssql.query(`SELECT * FROM [${tableName}]`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    mssql.close();
  }
});

router.post('/users', async (req, res) => {
  const dbName = req.body.db || process.env.MSSQL_DATABASE;
  const tableName = req.body.table || 'users';
  const { name, email } = req.body;
  const config = getMSSQLConfig(dbName);
  try {
    await mssql.connect(config);
    const result = await mssql.query(`INSERT INTO [${tableName}] (name, email) VALUES ('${name}', '${email}'); SELECT SCOPE_IDENTITY() AS id;`);
    res.json({ id: result.recordset[0].id, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    mssql.close();
  }
});

router.post('/create-db', async (req, res) => {
  const { dbName } = req.body;
  const config = getMSSQLConfig('master');
  try {
    await mssql.connect(config);
    await mssql.query(`CREATE DATABASE [${dbName}]`);
    res.json({ message: `Database ${dbName} created successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    mssql.close();
  }
});

module.exports = router;
