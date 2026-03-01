

// --- Imports and Setup ---
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

// --- Modular Routes ---
app.use('/api/jira', require('./routes/jira'));
app.use('/api/git', require('./routes/git'));
app.use('/api/mysql', require('./routes/mysql'));
app.use('/api/mssql', require('./routes/mssql'));

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});
