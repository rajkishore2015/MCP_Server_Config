# MCP Client Utility

A reusable Node.js utility to interact with the MCP server REST API endpoints. Use this as a module in any repository to access **Jira**, **MySQL**, **MSSQL**, and **Git** endpoints exposed by your MCP server.

---

## Prerequisites

- MCP server running at `http://localhost:3000` (or custom URL)
- Node.js installed

---

## Installation

Copy the `mcp-client-util` folder to your target repo, then run:
```bash
npm install
```

Or install directly as a local package:
```bash
npm install ./mcp-client-util
```

---

## Configuration

Create a `.env` file in the `mcp-client-util` folder (or set the environment variable):
```
MCP_BASE_URL=http://localhost:3000
```

---

## Available Functions

| Function | Description |
|----------|-------------|
| `getJiraIssues(projectKey?)` | Get all Jira issues for a project |
| `getMySQLUsers()` | Get all MySQL users |
| `getMSSQLUsers()` | Get all MSSQL users |
| `getGitStatus()` | Get git repository status |

---

## Usage

```js
const mcpClient = require('./mcpClient');

(async () => {
  // Get Jira issues
  const jira = await mcpClient.getJiraIssues();
  console.log('Jira:', jira);

  // Get MySQL users
  const mysql = await mcpClient.getMySQLUsers();
  console.log('MySQL:', mysql);

  // Get MSSQL users
  const mssql = await mcpClient.getMSSQLUsers();
  console.log('MSSQL:', mssql);

  // Get Git status
  const git = await mcpClient.getGitStatus();
  console.log('Git:', git);
})();
```

---

## Run the Test Client

```bash
node test-client.js
```

---

## MSSQL Insert Example

Send a POST to `/api/mssql/insert` with your data:
```json
{
  "db": "UserDB",
  "table": "users",
  "firstName": "Alice",
  "lastName": "Smith",
  "email": "alice.smith@example.com",
  "phone": "123-456-7890",
  "active": true
}
```

---

## License
MIT
