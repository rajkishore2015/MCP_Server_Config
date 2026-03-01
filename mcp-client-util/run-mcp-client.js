// run-mcp-client.js
// Exercises all MCP server endpoints: Git, Jira, MySQL, MSSQL

const {
  getGitStatus,
  getJiraIssues,
  createJiraStory,
  getMySQLUsers,
  addMySQLUser,
  createMySQLDatabase,
  getMSSQLUsers,
  addMSSQLUser,
  createMSSQLDatabase,
} = require('./mcpClient');

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';

// Config for DB tests — matches docker containers
const MYSQL_DB    = 'UserDB';
const MYSQL_TABLE = 'users';
const MSSQL_DB    = 'UserDB';
const MSSQL_TABLE = 'users';

// Sample user
const sampleUser = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', active: true };

function divider(title) {
  console.log('\n' + '='.repeat(57));
  console.log(` ${title}`);
  console.log('='.repeat(57));
}

(async () => {
  console.log(`\nMCP Client  →  ${MCP_SERVER_URL}\n`);

  // ─── 1. Git ─────────────────────────────────────────────────────
  divider('1. Git  →  GET /api/git/status');
  try {
    const s = await getGitStatus();
    console.log('  Branch      :', s.current);
    console.log('  Tracking    :', s.tracking || 'N/A');
    console.log('  Modified    :', s.modified.length ? s.modified.join(', ') : 'none');
    console.log('  Ahead/Behind:', `+${s.ahead} / -${s.behind}`);
    console.log('  STATUS      : OK ✔');
  } catch (err) { console.error('  STATUS      : FAIL -', JSON.stringify(err).substring(0, 150)); }

  // ─── 2. Jira – Get Issues ───────────────────────────────────────
  divider('2. Jira  →  GET /api/jira/issues');
  try {
    const data = await getJiraIssues();
    console.log('  Total issues:', data.total || 0);
    (data.issues || []).slice(0, 3).forEach(i =>
      console.log(`  [${i.key}] ${i.fields.summary} (${i.fields.status.name})`));
    console.log('  STATUS      : OK ✔');
  } catch (err) { console.error('  STATUS      : FAIL -', JSON.stringify(err).substring(0, 150)); }

  // ─── 3. Jira – Create Story ─────────────────────────────────────
  divider('3. Jira  →  POST /api/jira/issues');
  try {
    const r = await createJiraStory(sampleUser);
    console.log('  Story Key   :', r.key);
    console.log('  URL         :', r.self);
    console.log('  STATUS      : OK ✔');
  } catch (err) { console.error('  STATUS      : FAIL -', JSON.stringify(err).substring(0, 150)); }

  // ─── 4. MySQL – Get Users ───────────────────────────────────────
  divider(`4. MySQL  →  GET /api/mysql/users?db=${MYSQL_DB}&table=${MYSQL_TABLE}`);
  try {
    const rows = await getMySQLUsers(MYSQL_DB, MYSQL_TABLE);
    console.log('  Row count   :', Array.isArray(rows) ? rows.length : JSON.stringify(rows));
    console.log('  STATUS      : OK ✔');
  } catch (err) { console.error('  STATUS      : FAIL -', JSON.stringify(err).substring(0, 150)); }

  // ─── 5. MySQL – Add User ────────────────────────────────────────
  divider(`5. MySQL  →  POST /api/mysql/users`);
  try {
    const r = await addMySQLUser(MYSQL_DB, MYSQL_TABLE, 'Test User', `test${Date.now()}@example.com`);
    console.log('  Response    :', JSON.stringify(r).substring(0, 100));
    console.log('  STATUS      : OK ✔');
  } catch (err) { console.error('  STATUS      : FAIL -', JSON.stringify(err).substring(0, 150)); }

  // ─── 6. MySQL – Create DB ───────────────────────────────────────
  divider('6. MySQL  →  POST /api/mysql/create-db');
  try {
    const r = await createMySQLDatabase('mcp_test_db');
    console.log('  Response    :', JSON.stringify(r).substring(0, 100));
    console.log('  STATUS      : OK ✔');
  } catch (err) { console.error('  STATUS      : FAIL -', JSON.stringify(err).substring(0, 150)); }

  // ─── 7. MSSQL – Get Users ───────────────────────────────────────
  divider(`7. MSSQL  →  GET /api/mssql/users?db=${MSSQL_DB}&table=${MSSQL_TABLE}`);
  try {
    const rows = await getMSSQLUsers(MSSQL_DB, MSSQL_TABLE);
    console.log('  Row count   :', Array.isArray(rows) ? rows.length : JSON.stringify(rows));
    console.log('  STATUS      : OK ✔');
  } catch (err) { console.error('  STATUS      : FAIL -', JSON.stringify(err).substring(0, 150)); }

  // ─── 8. MSSQL – Add User ────────────────────────────────────────
  divider('8. MSSQL  →  POST /api/mssql/users');
  try {
    const r = await addMSSQLUser(MSSQL_DB, MSSQL_TABLE, 'Test User', `test${Date.now()}@example.com`);
    console.log('  Response    :', JSON.stringify(r).substring(0, 100));
    console.log('  STATUS      : OK ✔');
  } catch (err) { console.error('  STATUS      : FAIL -', JSON.stringify(err).substring(0, 150)); }

  // ─── 9. MSSQL – Create DB ───────────────────────────────────────
  divider('9. MSSQL  →  POST /api/mssql/create-db');
  try {
    const r = await createMSSQLDatabase('mcp_test_db');
    console.log('  Response    :', JSON.stringify(r).substring(0, 100));
    console.log('  STATUS      : OK ✔');
  } catch (err) { console.error('  STATUS      : FAIL -', JSON.stringify(err).substring(0, 150)); }

  console.log('\n' + '='.repeat(57));
  console.log(' Done.');
  console.log('='.repeat(57) + '\n');
})();
