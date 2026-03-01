# MCP Client Utility

A Node.js utility to interact with MCP server API endpoints. Use this as a module in any repo to access Jira, MySQL, MSSQL, and Git endpoints exposed by your MCP server.

## Installation

```
npm install ./mcp-client-util
```

Or copy the folder to your target repo and run:

```
npm install
```

## Usage

```js
const mcpClient = require('mcp-client-util/mcpClient');

(async () => {
  const jira = await mcpClient.getJiraIssues();
  console.log('Jira:', jira);

  const mysql = await mcpClient.getMySQLUsers();
  console.log('MySQL:', mysql);

  const mssql = await mcpClient.getMSSQLUsers();
  console.log('MSSQL:', mssql);

  const git = await mcpClient.getGitStatus();
  console.log('Git:', git);
})();
```

## Configuration

Set the MCP server URL with the environment variable:

```
MCP_BASE_URL=http://localhost:3000
```

## License
MIT
