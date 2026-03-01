const axios = require('axios');
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';

async function deleteJiraIssueViaMCP(issueKey) {
  try {
    await axios.delete(`${MCP_SERVER_URL}/api/jira/issues/${issueKey}`, { timeout: 10000 });
    console.log(`Issue ${issueKey}: Deleted successfully via MCP server.`);
  } catch (err) {
    console.error(`Issue ${issueKey}: Delete failed via MCP server -`, err.response ? err.response.data : err);
  }
}

async function main() {
  await deleteJiraIssueViaMCP('US-8');
}

if (require.main === module) {
  main();
}
