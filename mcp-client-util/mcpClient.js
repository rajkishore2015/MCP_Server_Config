const axios = require('axios');

const MCP_BASE_URL = process.env.MCP_BASE_URL || 'http://localhost:3000';

// Get Jira issues
async function getJiraIssues(projectKey = 'US') {
  const url = `${MCP_BASE_URL}/api/jira/issues`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// Get MySQL users
async function getMySQLUsers() {
  const url = `${MCP_BASE_URL}/api/mysql/users`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// Get MSSQL users
async function getMSSQLUsers() {
  const url = `${MCP_BASE_URL}/api/mssql/users`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

// Get Git status
async function getGitStatus() {
  const url = `${MCP_BASE_URL}/api/git/status`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
}

module.exports = {
  getJiraIssues,
  getMySQLUsers,
  getMSSQLUsers,
  getGitStatus,
};
