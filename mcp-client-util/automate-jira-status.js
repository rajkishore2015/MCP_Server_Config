const { getJiraIssues, transitionJiraIssue } = require('./mcpClient');

/**
 * Automate Jira status updates for completed stories
 * Criteria: Stories with matching implementation (customize as needed)
 */
async function automateJiraStatusUpdates() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('Automating Jira Status Updates for Completed Stories');
    console.log('='.repeat(70) + '\n');

    // Fetch all stories in project US
    const result = await getJiraIssues('US');
    const issues = result.issues || [];
    // Example: Mark all stories as Done (customize filter as needed)
    const stories = issues.filter(issue => issue.fields.issuetype.name === 'Story');
    for (const story of stories) {
      // Only update if not already Done
      if (story.fields.status.name !== 'Done') {
        const res = await transitionJiraIssue(story.key, 'Done');
        console.log(`Issue ${story.key}: ${res.success ? 'Updated to Done' : 'Failed'}${res.error ? ' - ' + res.error : ''}`);
      } else {
        console.log(`Issue ${story.key}: Already Done`);
      }
    }
    console.log('\nAutomation complete.');
  } catch (err) {
    console.error('Automation failed:', err);
  }
}

if (require.main === module) {
  automateJiraStatusUpdates();
}
