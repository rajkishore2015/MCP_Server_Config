/**
 * mcp-tools-server.js
 * MCP stdio server — exposes Jira, Git, MySQL, MSSQL as GitHub Copilot tools.
 * Registered in .vscode/mcp.json so GitHub Copilot Chat can call these tools.
 *
 * All HTTP calls are delegated to the REST MCP server via mcpClient.js.
 */

require('dotenv').config();
const { McpServer }          = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z }                  = require('zod');
const {
  getGitStatus,
  getJiraIssues,
  createJiraStory,
  createJiraEpic,
  createJiraSubtask,
  getMySQLUsers,
  addMySQLUser,
  createMySQLDatabase,
  runMySQLQuery,
  getMSSQLUsers,
  addMSSQLUser,
  createMSSQLDatabase,
} = require('./mcpClient');

const server = new McpServer({
  name   : 'spring-boot-3-mcp',
  version: '1.0.0',
});

// ─── Git ─────────────────────────────────────────────────────────────────────

server.tool(
  'git_get_status',
  'Get the current Git repository status: branch, modified files, ahead/behind',
  {},
  async () => {
    const data = await getGitStatus();
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

// ─── Jira ─────────────────────────────────────────────────────────────────────

server.tool(
  'jira_get_issues',
  'Get Jira issues for a project ordered by creation date',
  { projectKey: z.string().optional().describe('Jira project key, e.g. US') },
  async ({ projectKey }) => {
    const data = await getJiraIssues(projectKey);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

server.tool(
  'jira_create_story',
  'Create a new Jira Story from a user record',
  {
    firstName  : z.string().describe('User first name'),
    lastName   : z.string().describe('User last name'),
    email      : z.string().describe('User email'),
    phone      : z.string().optional().describe('User phone'),
    active     : z.boolean().optional().describe('User active status'),
  },
  async (user) => {
    const data = await createJiraStory({ ...user, phone: user.phone || '', active: user.active ?? true });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

server.tool(
  'jira_create_epic',
  'Create a new Jira Epic in the project',
  {
    summary    : z.string().describe('Epic summary / title'),
    epicName   : z.string().optional().describe('Epic Name label (defaults to summary)'),
    description: z.string().optional().describe('Detailed description'),
  },
  async ({ summary, epicName, description }) => {
    const data = await createJiraEpic(summary, epicName || summary, description || '');
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

server.tool(
  'jira_create_subtask',
  'Create a Sub-task under an existing Jira issue',
  {
    parentKey  : z.string().describe('Parent issue key, e.g. US-1'),
    summary    : z.string().describe('Sub-task summary'),
    description: z.string().optional().describe('Detailed description'),
  },
  async ({ parentKey, summary, description }) => {
    const data = await createJiraSubtask(parentKey, summary, description || '');
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

// ─── MySQL ────────────────────────────────────────────────────────────────────

server.tool(
  'mysql_get_users',
  'Get all rows from a MySQL table',
  {
    db   : z.string().describe('MySQL database name'),
    table: z.string().describe('Table name'),
  },
  async ({ db, table }) => {
    const data = await getMySQLUsers(db, table);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

server.tool(
  'mysql_add_user',
  'Insert a row into a MySQL table',
  {
    db   : z.string().describe('MySQL database name'),
    table: z.string().describe('Table name'),
    name : z.string().describe('User name'),
    email: z.string().describe('User email'),
  },
  async ({ db, table, name, email }) => {
    const data = await addMySQLUser(db, table, name, email);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

server.tool(
  'mysql_create_database',
  'Create a new MySQL database',
  { dbName: z.string().describe('Name for the new database') },
  async ({ dbName }) => {
    const data = await createMySQLDatabase(dbName);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

server.tool(
  'mysql_query',
  'Execute a raw SQL query on a MySQL database (e.g. SELECT, SHOW TABLES, DESCRIBE)',
  {
    db : z.string().describe('MySQL database name'),
    sql: z.string().describe('SQL query to execute'),
  },
  async ({ db, sql }) => {
    const data = await runMySQLQuery(db, sql);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

// ─── MSSQL ────────────────────────────────────────────────────────────────────

server.tool(
  'mssql_get_users',
  'Get all rows from an MSSQL table',
  {
    db   : z.string().describe('MSSQL database name'),
    table: z.string().describe('Table name'),
  },
  async ({ db, table }) => {
    const data = await getMSSQLUsers(db, table);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

server.tool(
  'mssql_add_user',
  'Insert a row into an MSSQL table',
  {
    db   : z.string().describe('MSSQL database name'),
    table: z.string().describe('Table name'),
    name : z.string().describe('User name'),
    email: z.string().describe('User email'),
  },
  async ({ db, table, name, email }) => {
    const data = await addMSSQLUser(db, table, name, email);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

server.tool(
  'mssql_create_database',
  'Create a new MSSQL database',
  { dbName: z.string().describe('Name for the new database') },
  async ({ dbName }) => {
    const data = await createMSSQLDatabase(dbName);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

// ─── Start ────────────────────────────────────────────────────────────────────

(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
