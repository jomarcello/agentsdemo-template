#!/usr/bin/env node

/**
 * Script to create a new practice lead repository and Railway deployment
 * Usage: node scripts/create-new-lead.js <practice-id> <practice-name> [doctor-name] [location]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration  
const GITHUB_USER = 'jomarcello';
const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Usage: node create-new-lead.js <practice-id> <practice-name> [doctor-name] [location]');
    console.error('📝 Example: node create-new-lead.js "lisbon-wellness" "Lisbon Wellness Center" "Dr. Maria Santos" "Lisbon, Portugal"');
    process.exit(1);
  }

  const practiceId = args[0];
  const practiceName = args[1];
  const doctorName = args[2] || `Dr. ${practiceName.split(' ')[0]} Professional`;
  const location = args[3] || 'Location TBD';
  
  const repoName = `${practiceId}-demo`;
  
  console.log('🚀 Creating new practice lead...');
  console.log(`📋 Practice ID: ${practiceId}`);
  console.log(`🏥 Practice Name: ${practiceName}`);
  console.log(`👨‍⚕️ Doctor: ${doctorName}`);
  console.log(`📍 Location: ${location}`);
  console.log(`📦 Repository: ${repoName}`);
  console.log('');

  try {
    // Step 1: Create GitHub repository
    console.log('📁 Creating GitHub repository...');
    createGitHubRepo(repoName, practiceName);
    
    // Step 2: Clone template and setup practice repo
    console.log('📋 Setting up practice repository...');
    setupPracticeRepo(repoName, practiceId, practiceName, doctorName, location);
    
    // Step 3: Create Railway project
    console.log('🚂 Creating Railway project...');
    const railwayProjectId = createRailwayProject(practiceId, practiceName);
    
    // Step 4: Push to GitHub (triggers Railway deployment)
    console.log('📤 Pushing to GitHub...');
    pushToGitHub(repoName);
    
    console.log('');
    console.log('✅ SUCCESS! New practice lead created:');
    console.log(`🔗 GitHub: https://github.com/${GITHUB_USER}/${repoName}`);
    console.log(`🚂 Railway: https://railway.app/project/${railwayProjectId}`);
    console.log(`🌐 Expected URL: https://${practiceId}-demo-production.up.railway.app`);
    console.log('');
    console.log('⏳ Deployment will be ready in ~2-3 minutes');
    
  } catch (error) {
    console.error('❌ Error creating new lead:', error.message);
    process.exit(1);
  }
}

function createGitHubRepo(repoName, practiceName) {
  const repoData = {
    name: repoName,
    description: `${practiceName} - Individual practice demo repository`,
    private: false,
    auto_init: false
  };

  try {
    const response = execSync(`curl -s -H "Authorization: token ${GITHUB_TOKEN}" \\
      -H "Accept: application/vnd.github.v3+json" \\
      -d '${JSON.stringify(repoData)}' \\
      https://api.github.com/user/repos`, 
      { encoding: 'utf8' }
    );
    
    const responseData = JSON.parse(response);
    if (responseData.message && responseData.message.includes('Not Found')) {
      throw new Error('GitHub API error: ' + response);
    }
    
    console.log(`✅ Created repository: ${repoName}`);
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('name already exists')) {
      console.log(`⚠️  Repository ${repoName} already exists, continuing...`);
    } else {
      throw error;
    }
  }
}

function setupPracticeRepo(repoName, practiceId, practiceName, doctorName, location) {
  const tempDir = `/tmp/${repoName}`;
  
  // Clean up any existing temp directory
  if (fs.existsSync(tempDir)) {
    execSync(`rm -rf ${tempDir}`);
  }
  
  // Copy template files
  execSync(`cp -r . ${tempDir}`, { cwd: __dirname + '/..' });
  
  // Change to temp directory
  process.chdir(tempDir);
  
  // Remove git history and scripts
  execSync('rm -rf .git scripts');
  
  // Initialize new git repo
  execSync('git init');
  execSync('git config user.name "Lead Generator"');
  execSync('git config user.email "generator@agentsdemo.com"');
  
  // Create practice-specific .env
  const envContent = `# ${practiceName} Configuration
PRACTICE_ID=${practiceId}
NODE_ENV=production

# API Keys (set in Railway dashboard)
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
`;
  fs.writeFileSync('.env.example', envContent);
  
  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.name = repoName;
  packageJson.description = `${practiceName} - Individual practice demo`;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  // Create practice-specific railway.toml
  const railwayConfig = `[build]
builder = "nixpacks"
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"
restartPolicyType = "never"

[env]
PRACTICE_ID = "${practiceId}"
NODE_ENV = "production"
PORT = "3000"

# API Keys - set these in Railway dashboard
OPENAI_API_KEY = ""
ELEVENLABS_API_KEY = ""

[experimental]
configPaths = ["railway.toml"]`;
  
  fs.writeFileSync('railway.toml', railwayConfig);
  
  // Create README
  const readmeContent = `# ${practiceName}

Individual practice demo repository for ${practiceName}.

## Configuration

- **Practice ID**: \`${practiceId}\`
- **Doctor**: ${doctorName}
- **Location**: ${location}

## Deployment

This repository is automatically deployed to Railway when pushed to main branch.

**Live URL**: https://${practiceId}-demo-production.up.railway.app

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Environment Variables

Set these in Railway dashboard:
- \`OPENAI_API_KEY\`
- \`ELEVENLABS_API_KEY\`
`;
  
  fs.writeFileSync('README.md', readmeContent);
  
  // Stage all files
  execSync('git add .');
  execSync(`git commit -m "🎉 Initial commit: ${practiceName} practice demo

- Practice ID: ${practiceId}
- Doctor: ${doctorName}
- Location: ${location}
- Auto-generated from template

🤖 Generated with Lead Creator Script"`);
}

function createRailwayProject(practiceId, practiceName) {
  const projectName = `${practiceId}-demo`;
  
  // Create Railway project
  const projectQuery = `
    mutation {
      projectCreate(input: { name: "${projectName}" }) {
        id
        name
      }
    }
  `;
  
  const projectResponse = execSync(`curl -s -X POST \\
    -H "Authorization: Bearer ${RAILWAY_TOKEN}" \\
    -H "Content-Type: application/json" \\
    -d '{\"query\":\"${projectQuery.replace(/\n/g, ' ').replace(/"/g, '\\"')}\"}' \\
    https://backboard.railway.app/graphql/v2`, 
    { encoding: 'utf8' }
  );
  
  const projectData = JSON.parse(projectResponse);
  if (!projectData.data?.projectCreate?.id) {
    throw new Error('Failed to create Railway project: ' + projectResponse);
  }
  
  const projectId = projectData.data.projectCreate.id;
  console.log(`✅ Created Railway project: ${projectId}`);
  
  // Create service
  const serviceQuery = `
    mutation {
      serviceCreate(input: { projectId: "${projectId}", name: "${projectName}" }) {
        id
        name
      }
    }
  `;
  
  const serviceResponse = execSync(`curl -s -X POST \\
    -H "Authorization: Bearer ${RAILWAY_TOKEN}" \\
    -H "Content-Type: application/json" \\
    -d '{\"query\":\"${serviceQuery.replace(/\n/g, ' ').replace(/"/g, '\\"')}\"}' \\
    https://backboard.railway.app/graphql/v2`, 
    { encoding: 'utf8' }
  );
  
  const serviceData = JSON.parse(serviceResponse);  
  if (!serviceData.data?.serviceCreate?.id) {
    throw new Error('Failed to create Railway service: ' + serviceResponse);
  }
  
  const serviceId = serviceData.data.serviceCreate.id;
  console.log(`✅ Created Railway service: ${serviceId}`);
  
  // Set environment variables
  setRailwayEnvVar(serviceId, 'PRACTICE_ID', practiceId);
  setRailwayEnvVar(serviceId, 'NODE_ENV', 'production');
  
  return projectId;
}

function setRailwayEnvVar(serviceId, name, value) {
  const varQuery = `
    mutation {
      variableUpsert(input: { serviceId: "${serviceId}", name: "${name}", value: "${value}" }) {
        id
        name
        value
      }
    }
  `;
  
  execSync(`curl -s -X POST \\
    -H "Authorization: Bearer ${RAILWAY_TOKEN}" \\
    -H "Content-Type: application/json" \\
    -d '{\"query\":\"${varQuery.replace(/\n/g, ' ').replace(/"/g, '\\"')}\"}' \\
    https://backboard.railway.app/graphql/v2`, 
    { stdio: 'inherit' }
  );
}

function pushToGitHub(repoName) {
  execSync(`git remote add origin https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${repoName}.git`);
  execSync('git branch -M main');
  execSync(`git push -u origin main`);
  console.log('✅ Pushed to GitHub');
  
  // Trigger Railway deployment with a dummy commit
  setTimeout(() => {
    try {
      fs.writeFileSync('.railway-deploy', `# Railway deployment trigger\n# Generated: ${new Date().toISOString()}\n`);
      execSync('git add .railway-deploy');
      execSync('git commit -m "🚀 Trigger Railway deployment"');
      execSync('git push');
      console.log('✅ Triggered Railway deployment');
    } catch (error) {
      console.log('⚠️  Could not trigger automatic deployment - manual setup required');
    }
  }, 2000);
}

// Check required environment variables
if (!RAILWAY_TOKEN) {
  console.error('❌ RAILWAY_TOKEN environment variable is required');
  process.exit(1);
}

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

main();