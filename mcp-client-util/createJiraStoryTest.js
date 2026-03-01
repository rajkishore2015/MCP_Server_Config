// Test script: Create a Jira Story in US project using UserAppFE User model fields
// Calls Jira REST API using session-based auth (works even when remote API calls restriction is active)
const axios = require('axios');

const JIRA_BASE_URL = 'http://localhost:8080';
const JIRA_USERNAME = 'Raj20261';
const JIRA_PASSWORD = 'Dinesh1@';

// Sample user matching UserAppFE User model
const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  active: true,
};

const storyPayload = {
  fields: {
    project: { key: 'US' },
    summary: `User Story: ${user.firstName} ${user.lastName}`,
    description: `Create and manage user:\n\nFirst Name: ${user.firstName}\nLast Name: ${user.lastName}\nEmail: ${user.email}\nPhone: ${user.phone}\nActive: ${user.active}`,
    issuetype: { name: 'Story' },
  },
};

(async () => {
  console.log(`Connecting to Jira at ${JIRA_BASE_URL} as ${JIRA_USERNAME}...`);
  try {
    // Step 1: Login to get a session cookie and XSRF token
    const loginResp = await axios.post(
      `${JIRA_BASE_URL}/rest/auth/1/session`,
      { username: JIRA_USERNAME, password: JIRA_PASSWORD },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const sessionCookie = `${loginResp.data.session.name}=${loginResp.data.session.value}`;
    console.log(`Logged in successfully. Session: ${loginResp.data.session.name}`);

    const sessionHeaders = {
      'Content-Type': 'application/json',
      Cookie: sessionCookie,
      'X-Atlassian-Token': 'no-check',
    };

    // Step 2: Verify auth by calling /myself
    const me = await axios.get(`${JIRA_BASE_URL}/rest/api/2/myself`, { headers: sessionHeaders });
    console.log(`Authenticated as: ${me.data.displayName} (${me.data.emailAddress})`);

    // Step 3: Create the Jira story
    const response = await axios.post(
      `${JIRA_BASE_URL}/rest/api/2/issue`,
      storyPayload,
      { headers: sessionHeaders }
    );
    console.log('Jira story created successfully!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    const errData = err.response ? err.response.data : err.message;
    if (typeof errData === 'string' && errData.includes('<html>')) {
      const match = errData.match(/AUTHENTICATION_DENIED|Forbidden|Unauthorized|<p>(.*?)<\/p>/g);
      console.error('Jira error:', match ? match.join(' | ') : 'HTML error - check Jira setup');
    } else {
      console.error('Failed:', JSON.stringify(errData, null, 2));
    }
  }
})();



