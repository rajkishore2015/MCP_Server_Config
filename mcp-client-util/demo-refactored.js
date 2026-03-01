/**
 * Demonstration of Refactored MSSQL Utilities
 * 
 * This script demonstrates the improvements and reusability
 * of the refactored MSSQL utilities without environment variables.
 */

const MSSQLClient = require('./utils/mssqlClient');
const { getSchema } = require('./get-schema');
const { insertSampleData, sampleUsers } = require('./insert-sample-data');

/**
 * Comprehensive demonstration
 */
async function runDemo() {
  console.log('='.repeat(60));
  console.log('MSSQL Utilities - Refactored & Optimized Demo');
  console.log('='.repeat(60));
  console.log();

  // 1. Test Connection
  console.log('1️⃣  Testing Database Connection...\n');
  const client = new MSSQLClient();
  try {
    await client.connect();
    console.log('   ✓ Connected to MSSQL successfully');
    await client.close();
  } catch (err) {
    console.error('   ✗ Connection failed:', err.message);
    return;
  }
  
  console.log();
  console.log('-'.repeat(60));
  console.log();

  // 2. Get Schema
  console.log('2️⃣  Retrieving Table Schema...\n');
  await getSchema('users');
  
  console.log();
  console.log('-'.repeat(60));
  console.log();

  // 3. Query Existing Data
  console.log('3️⃣  Querying Existing Data...\n');
  const client2 = new MSSQLClient();
  try {
    await client2.connect();
    const users = await client2.getAll('users');
    console.log(`   Found ${users.length} existing user(s)`);
    
    if (users.length > 0) {
      console.log('\n   Sample record:');
      console.log('   ', JSON.stringify(users[0], null, 2).split('\n').join('\n   '));
    }
  } finally {
    await client2.close();
  }
  
  console.log();
  console.log('-'.repeat(60));
  console.log();

  // 4. Demonstrate Reusability
  console.log('4️⃣  Demonstrating Code Reusability...\n');
  console.log('   Sample users ready to insert:');
  sampleUsers.forEach((user, i) => {
    console.log(`   ${i + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
  });
  
  console.log();
  console.log('-'.repeat(60));
  console.log();

  // 5. Summary
  console.log('5️⃣  Refactoring Benefits Summary:\n');
  console.log('   ✓ Simplified Configuration - Works out of the box');
  console.log('   ✓ Reusable MSSQL Client - DRY principle applied');
  console.log('   ✓ Modular Design - Easy to import and use');
  console.log('   ✓ CLI Support - Quick operations without coding');
  console.log('   ✓ Error Handling - Consistent and informative');
  console.log('   ✓ Parameterized Queries - SQL injection prevention');
  console.log('   ✓ Flexibility - Override config when needed');
  console.log('   ✓ Documentation - JSDoc and README included');
  
  console.log();
  console.log('='.repeat(60));
  console.log('Demo completed successfully! 🎉');
  console.log('='.repeat(60));
  console.log();
}

// Run demo
if (require.main === module) {
  runDemo().catch(err => {
    console.error('Demo failed:', err);
    process.exit(1);
  });
}

module.exports = { runDemo };
