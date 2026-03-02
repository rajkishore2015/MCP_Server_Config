const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3305,
      user: 'sa',
      password: 'MyStrongPassw0rd!',
      database: 'jira_db'
    });
    console.log('✅ Connected to jira_db successfully');

    const [tables] = await conn.query('SHOW TABLES');
    if (tables.length === 0) {
      console.log('⚠️  No tables found in jira_db');
    } else {
      console.log('Tables in jira_db:');
      tables.forEach(t => console.log(' -', Object.values(t)[0]));
    }

    const [grants] = await conn.query("SHOW GRANTS FOR 'sa'@'%'");
    console.log('\nGrants for sa@%:');
    grants.forEach(g => console.log(' -', Object.values(g)[0]));

    await conn.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
