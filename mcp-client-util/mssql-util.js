#!/usr/bin/env node

/**
 * MSSQL Database Utility CLI
 * Provides common database operations for MSSQL
 * 
 * Usage:
 *   node mssql-util.js schema [tableName]
 *   node mssql-util.js insert-sample [tableName]
 *   node mssql-util.js query [tableName] [limit]
 *   node mssql-util.js test-connection
 */

const MSSQLClient = require('./utils/mssqlClient');
const { getSchema } = require('./get-schema');
const { insertSampleData } = require('./insert-sample-data');

const COMMANDS = {
  schema: 'Get table schema',
  'insert-sample': 'Insert sample user data',
  query: 'Query table data',
  'test-connection': 'Test database connection',
  help: 'Show this help message'
};

/**
 * Test database connection
 */
async function testConnection() {
  const client = new MSSQLClient();
  
  try {
    console.log('\nTesting MSSQL connection...\n');
    await client.connect();
    console.log('\u2713 Successfully connected to MSSQL');
    
    const result = await client.query('SELECT @@VERSION AS version');
    console.log('\nServer version:');
    console.log(result[0].version);
    
    console.log('\n\u2713 Connection test passed');
  } catch (err) {
    console.error('\u2717 Connection failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

/**
 * Query table data
 */
async function queryTable(tableName = 'users', limit = null) {
  const client = new MSSQLClient();
  
  try {
    await client.connect();
    console.log(`\nQuerying ${tableName}${limit ? ` (limit: ${limit})` : ''}...\n`);
    
    const data = await client.getAll(tableName, limit);
    console.log(JSON.stringify(data, null, 2));
    
    console.log(`\n\u2713 Found ${data.length} record(s)`);
  } catch (err) {
    console.error('\u2717 Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

/**
 * Show help message
 */
function showHelp() {
  console.log('\nMSSQL Database Utility CLI\n');
  console.log('Available commands:\n');
  
  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(20)} ${desc}`);
  });
  
  console.log('\nExamples:');
  console.log('  node mssql-util.js schema users');
  console.log('  node mssql-util.js insert-sample users');
  console.log('  node mssql-util.js query users 10');
  console.log('  node mssql-util.js test-connection\n');
}

/**
 * Main CLI handler
 */
async function main() {
  const [,, command, ...args] = process.argv;
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }
  
  try {
    switch (command) {
      case 'schema':
        await getSchema(args[0]);
        break;
        
      case 'insert-sample':
        await insertSampleData(args[0]);
        break;
        
      case 'query':
        await queryTable(args[0], args[1] ? parseInt(args[1]) : null);
        break;
        
      case 'test-connection':
        await testConnection();
        break;
        
      default:
        console.error(`\u2717 Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (err) {
    console.error('\u2717 Fatal error:', err.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  testConnection,
  queryTable,
  showHelp
};
