require('dotenv').config();
const axios = require('axios');

const jiraUrl = `${process.env.JIRA_BASE_URL}/rest/api/2/search?jql=project=US`;
axios.get(jiraUrl, {
  auth: {
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_PASSWORD || process.env.JIRA_API_TOKEN
  }
}).then(r => {
  console.log('Success:', r.data);
}).catch(e => {
  if (e.response) {
    console.error('Error:', e.response.status, e.response.data);
  } else {
    console.error('Error:', e.message);
  }
});
