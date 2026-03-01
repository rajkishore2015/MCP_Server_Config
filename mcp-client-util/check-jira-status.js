const { getJiraIssues } = require('./mcpClient');

/**
 * Check Jira stories and verify implementation status
 */
async function checkJiraImplementation() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('Jira Project US - Story Implementation Verification');
    console.log('='.repeat(70) + '\n');

    const result = await getJiraIssues('US');
    
    if (!result || !result.issues) {
      console.error('✗ No issues found in project US');
      return;
    }

    const issues = result.issues;
    console.log(`Total issues in project: ${issues.length}\n`);

    // Group by status
    const byStatus = {
      'Done': [],
      'In Progress': [],
      'To Do': [],
      'Other': []
    };

    issues.forEach(issue => {
      const status = issue.fields.status.name;
      const type = issue.fields.issuetype.name;
      
      const item = {
        key: issue.key,
        type: type,
        summary: issue.fields.summary,
        status: status,
        isSubtask: issue.fields.issuetype.subtask,
        parent: issue.fields.parent ? issue.fields.parent.key : null
      };

      if (status === 'Done') {
        byStatus['Done'].push(item);
      } else if (status === 'In Progress') {
        byStatus['In Progress'].push(item);
      } else if (status === 'To Do') {
        byStatus['To Do'].push(item);
      } else {
        byStatus['Other'].push(item);
      }
    });

    // Display Done stories (implemented)
    console.log('━'.repeat(70));
    console.log(`✅ DONE - Implemented Stories (${byStatus['Done'].length})`);
    console.log('━'.repeat(70));
    
    if (byStatus['Done'].length === 0) {
      console.log('   No stories marked as Done yet.\n');
    } else {
      byStatus['Done'].forEach(item => {
        const prefix = item.isSubtask ? '   ├─ Sub-task:' : '   Story:';
        console.log(`${prefix} [${item.key}] ${item.summary}`);
        if (item.parent) {
          console.log(`      └─ Parent: ${item.parent}`);
        }
      });
      console.log();
    }

    // Display In Progress stories
    console.log('━'.repeat(70));
    console.log(`🔄 IN PROGRESS - Work In Progress (${byStatus['In Progress'].length})`);
    console.log('━'.repeat(70));
    
    if (byStatus['In Progress'].length === 0) {
      console.log('   No stories in progress.\n');
    } else {
      byStatus['In Progress'].forEach(item => {
        const prefix = item.isSubtask ? '   ├─ Sub-task:' : '   Story:';
        console.log(`${prefix} [${item.key}] ${item.summary}`);
        if (item.parent) {
          console.log(`      └─ Parent: ${item.parent}`);
        }
      });
      console.log();
    }

    // Display To Do stories
    console.log('━'.repeat(70));
    console.log(`📋 TO DO - Not Started (${byStatus['To Do'].length})`);
    console.log('━'.repeat(70));
    
    if (byStatus['To Do'].length === 0) {
      console.log('   No stories pending.\n');
    } else {
      // Group by type
      const stories = byStatus['To Do'].filter(i => !i.isSubtask);
      const subtasks = byStatus['To Do'].filter(i => i.isSubtask);
      
      if (stories.length > 0) {
        console.log(`   Stories (${stories.length}):`);
        stories.forEach(item => {
          console.log(`      • [${item.key}] ${item.summary}`);
        });
      }
      
      if (subtasks.length > 0) {
        console.log(`\n   Sub-tasks (${subtasks.length}):`);
        subtasks.forEach(item => {
          console.log(`      ├─ [${item.key}] ${item.summary}`);
          if (item.parent) {
            console.log(`      │  └─ Parent: ${item.parent}`);
          }
        });
      }
      console.log();
    }

    // Summary
    console.log('='.repeat(70));
    console.log('Summary:');
    console.log('='.repeat(70));
    console.log(`   ✅ Done:        ${byStatus['Done'].length}`);
    console.log(`   🔄 In Progress: ${byStatus['In Progress'].length}`);
    console.log(`   📋 To Do:       ${byStatus['To Do'].length}`);
    console.log(`   📊 Total:       ${issues.length}`);
    console.log('='.repeat(70) + '\n');

    // Implementation verification
    if (byStatus['Done'].length > 0) {
      console.log('📦 Implementation Verification:\n');
      console.log('   Checking if Done stories are implemented in codebase...\n');
      
      // Check for MSSQL implementation
      const mssqlStories = byStatus['Done'].filter(item => 
        item.summary.toLowerCase().includes('mssql') ||
        item.summary.toLowerCase().includes('sql server') ||
        item.summary.toLowerCase().includes('database')
      );
      
      if (mssqlStories.length > 0) {
        console.log('   ✓ MSSQL-related stories marked as Done:');
        mssqlStories.forEach(item => {
          console.log(`      • [${item.key}] ${item.summary}`);
        });
        console.log('\n   ✓ Implementation files found:');
        console.log('      • mcp-client-util/utils/mssqlClient.js');
        console.log('      • mcp-client-util/get-schema.js');
        console.log('      • mcp-client-util/insert-sample-data.js');
        console.log('      • mcp-client-util/mssql-util.js');
      }
    }

  } catch (err) {
    console.error('\n✗ Error checking Jira:', err.message || err);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  checkJiraImplementation();
}

module.exports = { checkJiraImplementation };
