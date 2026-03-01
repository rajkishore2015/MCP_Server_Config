# MCP Server Config

This repository contains a Node.js server that integrates with Jira, MySQL, MSSQL, and GitHub. It provides REST API endpoints for managing Jira issues, interacting with MySQL/MSSQL databases, and performing Git operations. The server is designed for automation, integration, and centralized management of these services.

## Purpose
- Centralize access to Jira, MySQL, MSSQL, and GitHub APIs
- Provide reusable endpoints for CRUD operations and automation
- Enable integration with custom clients and scripts
- Support modular, maintainable code for enterprise workflows

## How to Run
1. Clone the repository:
   ```
   git clone https://github.com/rajkishore2015/MCP_Server_Config.git
   cd MCP_Server_Config
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file using ENVIRONMENT.md as a template. Fill in your credentials and config values.
4. Start the server:
   ```
   node index.js
   ```
5. The server will run on port 3000 by default. Access endpoints via `http://localhost:3000/api/...`

---

# MCP Server Environment Variables

This file documents the required environment variables for Jira, MSSQL, MySQL, and GitHub integration in the MCP server. Copy these to your `.env` file and update the values as needed.

---

## Jira
- `JIRA_BASE_URL` — Base URL of your Jira instance (e.g., http://localhost:8080)
- `JIRA_USERNAME` — Jira username
- `JIRA_API_TOKEN` — Jira API token (or password if using basic auth)
- `JIRA_PASSWORD` — Jira password (if not using API token)

## GitHub
- `GITHUB_PERSONAL_ACCESS_TOKEN` — GitHub personal access token for API access and repo push

## MySQL
- `MYSQL_HOST` — MySQL server host (e.g., localhost)
- `MYSQL_PORT` — MySQL server port (e.g., 3306)
- `MYSQL_USER` — MySQL username
- `MYSQL_PASSWORD` — MySQL password
- `MYSQL_DATABASE` — Default MySQL database name
- `MYSQL_SSL` — Use SSL (true/false)

## MSSQL
- `MSSQL_HOST` — MSSQL server host (e.g., localhost)
- `MSSQL_PORT` — MSSQL server port (e.g., 1433)
- `MSSQL_USER` — MSSQL username
- `MSSQL_PASSWORD` — MSSQL password
- `MSSQL_DATABASE` — Default MSSQL database name
- `MSSQL_ENCRYPT` — Use encrypted connection (true/false)

---

**Note:** Never commit your actual `.env` file with secrets to GitHub. Use this template for documentation and onboarding.