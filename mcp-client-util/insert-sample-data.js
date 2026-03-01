const MSSQLClient = require('./utils/mssqlClient');

/**
 * Sample user data
 */
const sampleUsers = [
  {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    phone: '123-456-7890',
    active: 1
  },
  {
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob.jones@example.com',
    phone: '987-654-3210',
    active: 1
  }
];

/**
 * Insert sample user data and verify
 * @param {string} tableName - Name of the table (default: 'users')
 */
async function insertSampleData(tableName = 'users') {
  const client = new MSSQLClient();
  
  try {
    await client.connect();
    console.log(`\nInserting sample data into ${tableName}...\n`);

    // Insert each user with timestamps
    for (const user of sampleUsers) {
      const userWithTimestamps = {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await client.insert(tableName, userWithTimestamps);
      console.log(`✓ Inserted: ${user.firstName} ${user.lastName}`);
    }

    // Verify insertion
    console.log(`\nVerifying data in ${tableName}:\n`);
    const users = await client.getAll(tableName);
    console.log(JSON.stringify(users, null, 2));
    
    console.log(`\n✓ Successfully inserted ${sampleUsers.length} users`);
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
  insertSampleData(tableName);
}

module.exports = { insertSampleData, sampleUsers };
