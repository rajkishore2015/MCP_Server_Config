const sql = require('mssql');

/**
 * MSSQL Client Utility
 * Provides reusable functions for MSSQL operations
 */
class MSSQLClient {
  constructor(config = null) {
    this.config = config || {
      server: 'localhost',
      port: 1434,
      user: 'sa',
      password: 'MyStrongPassw0rd!',
      database: 'UserDB',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };
    this.pool = null;
  }

  /**
   * Connect to MSSQL database
   * @param {string} database - Optional database name to override config
   */
  async connect(database = null) {
    try {
      const config = database 
        ? { ...this.config, database }
        : this.config;
      
      this.pool = await sql.connect(config);
      return this.pool;
    } catch (err) {
      throw new Error(`Failed to connect to MSSQL: ${err.message}`);
    }
  }

  /**
   * Close the connection pool
   */
  async close() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }

  /**
   * Execute a raw SQL query
   * @param {string} query - SQL query to execute
   * @returns {Promise<any>} Query result
   */
  async query(query) {
    try {
      if (!this.pool) {
        await this.connect();
      }
      const result = await this.pool.request().query(query);
      return result.recordset;
    } catch (err) {
      throw new Error(`Query failed: ${err.message}`);
    }
  }

  /**
   * Get table schema (columns and data types)
   * @param {string} tableName - Name of the table
   * @returns {Promise<Array>} Array of column definitions
   */
  async getTableSchema(tableName) {
    const query = `
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = '${tableName}'
      ORDER BY ORDINAL_POSITION
    `;
    return this.query(query);
  }

  /**
   * Get all records from a table
   * @param {string} tableName - Name of the table
   * @param {number} limit - Optional limit
   * @returns {Promise<Array>} Array of records
   */
  async getAll(tableName, limit = null) {
    const limitClause = limit ? `TOP ${limit}` : '';
    const query = `SELECT ${limitClause} * FROM [${tableName}]`;
    return this.query(query);
  }

  /**
   * Insert a record into a table
   * @param {string} tableName - Name of the table
   * @param {Object} data - Object with column-value pairs
   * @returns {Promise<any>} Inserted record ID
   */
  async insert(tableName, data) {
    try {
      if (!this.pool) {
        await this.connect();
      }

      const columns = Object.keys(data);
      const values = Object.values(data);

      const columnNames = columns.map(col => `[${col}]`).join(', ');
      const placeholders = columns.map((_, i) => `@p${i}`).join(', ');

      const request = this.pool.request();
      values.forEach((val, i) => {
        request.input(`p${i}`, val);
      });

      const query = `
        INSERT INTO [${tableName}] (${columnNames}) 
        VALUES (${placeholders});
        SELECT SCOPE_IDENTITY() AS id;
      `;

      const result = await request.query(query);
      return result.recordset[0];
    } catch (err) {
      throw new Error(`Insert failed: ${err.message}`);
    }
  }

  /**
   * Insert multiple records into a table
   * @param {string} tableName - Name of the table
   * @param {Array<Object>} records - Array of objects with column-value pairs
   * @returns {Promise<number>} Number of rows inserted
   */
  async insertMany(tableName, records) {
    if (!records || records.length === 0) {
      return 0;
    }

    try {
      if (!this.pool) {
        await this.connect();
      }

      const columns = Object.keys(records[0]);
      const columnNames = columns.map(col => `[${col}]`).join(', ');

      let insertedCount = 0;
      for (const record of records) {
        const values = columns.map(col => record[col]);
        const request = this.pool.request();
        
        values.forEach((val, i) => {
          request.input(`p${i}`, val);
        });

        const placeholders = columns.map((_, i) => `@p${i}`).join(', ');
        const query = `INSERT INTO [${tableName}] (${columnNames}) VALUES (${placeholders})`;
        
        await request.query(query);
        insertedCount++;
      }

      return insertedCount;
    } catch (err) {
      throw new Error(`Bulk insert failed: ${err.message}`);
    }
  }

  /**
   * Execute a query and return results as JSON
   * @param {string} query - SQL query
   * @returns {Promise<string>} JSON string of results
   */
  async queryAsJSON(query) {
    const results = await this.query(query);
    return JSON.stringify(results, null, 2);
  }
}

module.exports = MSSQLClient;
