# MCP Server Config

A Node.js Express server that provides a centralized REST API for integrating with **Jira**, **MySQL**, **MSSQL**, and **Git**. Designed for automation, integration, and AI-assisted workflows with GitHub Copilot.

---

## Purpose

- Centralize access to Jira, MySQL, MSSQL, and GitHub APIs
- Provide reusable REST endpoints for CRUD operations and automation
- Enable integration with custom clients and scripts via `mcp-client-util`
- Support modular, maintainable code for enterprise workflows

---

## Project Structure

```
MCP_Server_Config/
├── index.js                  # Main server entry point
├── routes/
│   ├── jira.js               # Jira API endpoints
│   ├── mysql.js              # MySQL endpoints
│   ├── mssql.js              # MSSQL endpoints
│   └── git.js                # Git status endpoints
├── helpers/
│   └── db.js                 # Shared DB connection helpers
├── mcp-client-util/          # Reusable client utility
├── .vscode/
│   └── mcp.json              # VS Code MCP server config for GitHub Copilot
├── .env                      # Environment variables (not committed)
├── ENVIRONMENT.md            # Environment variable documentation
└── package.json
```

---

## API Endpoints

### Jira — `/api/jira`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jira/issues` | Get all Jira issues |
| POST | `/api/jira/issues` | Create a new Jira issue |
| DELETE | `/api/jira/issues/:issueId` | Delete a Jira issue |

### MySQL — `/api/mysql`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mysql/users` | Get all MySQL users |
| POST | `/api/mysql/users` | Create a MySQL user |
| POST | `/api/mysql/create-db` | Create a MySQL database |

### MSSQL — `/api/mssql`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mssql/users` | Get all MSSQL users |
| POST | `/api/mssql/users` | Create an MSSQL user |
| POST | `/api/mssql/insert` | Generic insert (any table/columns) |
| POST | `/api/mssql/create-db` | Create an MSSQL database |

### Git — `/api/git`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/git/status` | Get git repository status |

---

## How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajkishore2015/MCP_Server_Config.git
   cd MCP_Server_Config
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy the template from [ENVIRONMENT.md](ENVIRONMENT.md) and create a `.env` file with your credentials.

4. **Start the server:**
   ```bash
   node index.js
   ```

5. **Server runs at:** `http://localhost:3000`

---

## GitHub Copilot Integration

The `.vscode/mcp.json` file configures this server as an MCP (Model Context Protocol) server for GitHub Copilot in VS Code. Start the server and reload VS Code to enable AI-assisted access to all endpoints.

---

## Environment Variables

See [ENVIRONMENT.md](ENVIRONMENT.md) for a full list of required environment variables for Jira, MySQL, MSSQL, and GitHub.

---

## License
MIT
