const express = require('express');
const axios = require('axios');
const Buffer = require('buffer').Buffer;
const router = express.Router();

router.get('/issues', async (req, res) => {
  try {
    const jiraUrl = `${process.env.JIRA_BASE_URL}/rest/api/2/search?jql=project=US`;
    const authString = `${process.env.JIRA_USERNAME}:${process.env.JIRA_PASSWORD || process.env.JIRA_API_TOKEN}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    const response = await axios.get(jiraUrl, {
      headers: {
        Authorization: `Basic ${encodedAuth}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/issues', async (req, res) => {
  try {
    const jiraUrl = `${process.env.JIRA_BASE_URL}/rest/api/2/issue`;
    const authString = `${process.env.JIRA_USERNAME}:${process.env.JIRA_PASSWORD || process.env.JIRA_API_TOKEN}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    const response = await axios.post(jiraUrl, req.body, {
      headers: {
        Authorization: `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete a Jira issue by issueId
router.delete('/issues/:issueId', async (req, res) => {
  try {
    const { issueId } = req.params;
    const jiraUrl = `${process.env.JIRA_BASE_URL}/rest/api/2/issue/${issueId}`;
    const authString = `${process.env.JIRA_USERNAME}:${process.env.JIRA_PASSWORD || process.env.JIRA_API_TOKEN}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    const response = await axios.delete(jiraUrl, {
      headers: {
        Authorization: `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      }
    });
    res.json({ message: `Issue ${issueId} deleted successfully.`, status: response.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
