require('dotenv').config();
const axios = require('axios');

const MCP_SERVER_URL    = process.env.MCP_SERVER_URL    || 'http://localhost:3000';
const JIRA_PROJECT_KEY  = process.env.JIRA_PROJECT_KEY  || 'US';

/**
 * All credentials are loaded from .env (see .env.example).
 *
 * Required env vars:
 *   MCP_SERVER_URL   — URL of the MCP server
 *   JIRA_PROJECT_KEY — Jira project key (default: US)
 *
 * MCP Server routes:
 *   GET  /api/git/status
 *   GET  /api/jira/issues
 *   POST /api/jira/issues
 *   GET  /api/mysql/users?db=&table=
 *   POST /api/mysql/users          { db, table, name, email }
 *   POST /api/mysql/create-db      { dbName }
 *   GET  /api/mssql/users?db=&table=
 *   POST /api/mssql/users          { db, table, name, email }
 *   POST /api/mssql/create-db      { dbName }
 */

// ─── Git ─────────────────────────────────────────────────────────

// GET /api/git/status
async function getGitStatus() {
  try {
    const response = await axios.get(`${MCP_SERVER_URL}/api/git/status`, { timeout: 10000 });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// ─── Jira ─────────────────────────────────────────────────────────

// GET /api/jira/issues?jql=...
async function getJiraIssues(projectKey = JIRA_PROJECT_KEY) {
  try {
    const response = await axios.get(`${MCP_SERVER_URL}/api/jira/issues`, {
      params: { jql: `project=${projectKey} ORDER BY created DESC` },
      timeout: 10000,
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// POST /api/jira/issues — create a Story based on UserAppFE User model
async function createJiraStory(user) {
  const payload = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary: `User Story: ${user.firstName} ${user.lastName}`,
      description: `Create and manage user:\n\nFirst Name: ${user.firstName}\nLast Name: ${user.lastName}\nEmail: ${user.email}\nPhone: ${user.phone}\nActive: ${user.active}`,
      issuetype: { name: 'Story' },
    },
  };
  try {
    const response = await axios.post(`${MCP_SERVER_URL}/api/jira/issues`, payload, { timeout: 10000 });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// ─── MySQL (via MCP server) ───────────────────────────────────────

// GET /api/mysql/users?db=&table=
async function getMySQLUsers(db, table) {
  try {
    const response = await axios.get(`${MCP_SERVER_URL}/api/mysql/users`, {
      params: { db, table },
      timeout: 10000,
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// POST /api/mysql/users  { db, table, name, email }
async function addMySQLUser(db, table, name, email) {
  try {
    const response = await axios.post(`${MCP_SERVER_URL}/api/mysql/users`,
      { db, table, name, email }, { timeout: 10000 });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// POST /api/mysql/query  { db, sql }
async function runMySQLQuery(db, sql) {
  try {
    const response = await axios.post(`${MCP_SERVER_URL}/api/mysql/query`,
      { db, sql }, { timeout: 10000 });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// POST /api/mysql/create-db  { dbName }
async function createMySQLDatabase(dbName) {
  try {
    const response = await axios.post(`${MCP_SERVER_URL}/api/mysql/create-db`,
      { dbName }, { timeout: 10000 });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// ─── MSSQL (via MCP server) ───────────────────────────────────────

// GET /api/mssql/users?db=&table=
async function getMSSQLUsers(db, table) {
  try {
    const response = await axios.get(`${MCP_SERVER_URL}/api/mssql/users`, {
      params: { db, table },
      timeout: 10000,
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// POST /api/mssql/users  { db, table, name, email }
async function addMSSQLUser(db, table, name, email) {
  try {
    const response = await axios.post(`${MCP_SERVER_URL}/api/mssql/users`,
      { db, table, name, email }, { timeout: 10000 });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// POST /api/mssql/create-db  { dbName }
async function createMSSQLDatabase(dbName) {
  try {
    const response = await axios.post(`${MCP_SERVER_URL}/api/mssql/create-db`,
      { dbName }, { timeout: 10000 });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// POST /api/jira/issues — create an Epic
async function createJiraEpic(summary, epicName, description = '') {
  const payload = {
    fields: {
      project    : { key: JIRA_PROJECT_KEY },
      summary,
      description,
      issuetype  : { name: 'Epic' },
      customfield_10102: epicName || summary, // Epic Name field (Jira Server)
    },
  };
  try {
    const response = await axios.post(`${MCP_SERVER_URL}/api/jira/issues`, payload, { timeout: 10000 });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// POST /api/jira/issues — create a Sub-task under a parent issue
async function createJiraSubtask(parentKey, summary, description = '') {
  const payload = {
    fields: {
      project    : { key: JIRA_PROJECT_KEY },
      summary,
      description,
      issuetype  : { name: 'Sub-task' },
      parent     : { key: parentKey },
    },
  };
  try {
    const response = await axios.post(`${MCP_SERVER_URL}/api/jira/issues`, payload, { timeout: 10000 });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

/**
 * Transition a Jira issue to a new status (e.g., 'Done')
 * @param {string} issueKey - The Jira issue key (e.g., US-1)
 * @param {string} statusName - The target status name (e.g., 'Done')
 */
// Direct Jira REST API details
const JIRA_BASE  = process.env.JIRA_BASE  || 'http://localhost:8080';
const JIRA_USER  = process.env.JIRA_USER  || 'Raj2026';
const JIRA_PASS  = process.env.JIRA_PASS  || 'Dinesh1@';
const AUTH       = Buffer.from(`${JIRA_USER}:${JIRA_PASS}`).toString('base64');
const HEADERS    = { Authorization: `Basic ${AUTH}`, 'Content-Type': 'application/json' };

async function transitionJiraIssue(issueKey, statusName = 'Done') {
  try {
    // Get available transitions for the issue (direct Jira API)
    const transitionsRes = await axios.get(`${JIRA_BASE}/rest/api/2/issue/${issueKey}/transitions`, { headers: HEADERS, timeout: 10000 });
    const transitions = transitionsRes.data.transitions || [];
    const target = transitions.find(t => t.name.toLowerCase() === statusName.toLowerCase());
    if (!target) throw new Error(`No transition named '${statusName}' for issue ${issueKey}`);
    // Perform the transition
    await axios.post(
      `${JIRA_BASE}/rest/api/2/issue/${issueKey}/transitions`,
      { transition: { id: target.id } },
      { headers: HEADERS, timeout: 10000 }
    );
    return { issueKey, status: statusName, success: true };
  } catch (err) {
    return { issueKey, status: statusName, success: false, error: err.response ? err.response.data : err };
  }
}

module.exports = {
  // ...existing code...
  getJiraIssues,
  createJiraStory,
  createJiraEpic,
  createJiraSubtask,
  transitionJiraIssue,
  // ...existing code...
  getGitStatus,
  // Jira
  getJiraIssues,
  createJiraStory,
  createJiraEpic,
  createJiraSubtask,
  // MySQL (via MCP server)
  getMySQLUsers,
  addMySQLUser,
  createMySQLDatabase,
  runMySQLQuery,
  // MSSQL (via MCP server)
  getMSSQLUsers,
  addMSSQLUser,
  createMSSQLDatabase,
};
