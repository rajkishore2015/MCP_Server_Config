const MSSQLClient = require('./utils/mssqlClient');

/**
 * Get and display the schema for a table
 * @param {string} tableName - Name of the table (default: 'users')
 */
async function getSchema(tableName = 'users') {
  const client = new MSSQLClient();
  
  try {
    await client.connect();
    console.log(`\nSchema for table: ${tableName}\n`);
    
    const schema = await client.getTableSchema(tableName);
    console.log(JSON.stringify(schema, null, 2));
    
    console.log(`\n✓ Successfully retrieved schema for ${tableName}`);
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  const tableName = process.argv[2] || 'users';
  getSchema(tableName);
}

module.exports = { getSchema };
