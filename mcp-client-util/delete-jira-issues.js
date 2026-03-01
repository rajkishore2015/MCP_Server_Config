const axios = require('axios');

// Jira config should be set via environment variables for security
const JIRA_BASE  = process.env.JIRA_BASE;
const JIRA_USER  = process.env.JIRA_USER;
const JIRA_PASS  = process.env.JIRA_PASS;
if (!JIRA_BASE || !JIRA_USER || !JIRA_PASS) {
  throw new Error('JIRA_BASE, JIRA_USER, and JIRA_PASS must be set in environment variables');
}
const AUTH       = Buffer.from(`${JIRA_USER}:${JIRA_PASS}`).toString('base64');
const HEADERS    = { Authorization: `Basic ${AUTH}`, 'Content-Type': 'application/json' };

async function deleteJiraIssue(issueKey) {
  try {
    await axios.delete(`${JIRA_BASE}/rest/api/2/issue/${issueKey}`, { headers: HEADERS, timeout: 10000 });
    console.log(`Issue ${issueKey}: Deleted successfully.`);
  } catch (err) {
    console.error(`Issue ${issueKey}: Delete failed -`, err.response ? err.response.data : err);
  }
}

async function main() {
  await deleteJiraIssue('US-9');
  await deleteJiraIssue('US-10');
}

if (require.main === module) {
  main();
}
