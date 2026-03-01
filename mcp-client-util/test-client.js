const mcpClient = require('./mcpClient');

(async () => {
  try {
    const jira = await mcpClient.getJiraIssues();
    console.log('Jira:', jira);

    const mysql = await mcpClient.getMySQLUsers();
    console.log('MySQL:', mysql);

    const mssql = await mcpClient.getMSSQLUsers();
    console.log('MSSQL:', mssql);

    const git = await mcpClient.getGitStatus();
    console.log('Git:', git);
  } catch (err) {
    console.error('Error:', err);
  }
})();
