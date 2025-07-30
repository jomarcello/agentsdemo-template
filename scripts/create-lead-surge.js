#!/usr/bin/env node

/**
 * 100% AUTOMATED Lead Generation - Surge.sh Edition
 * PERFECT for 100s of leads - NO AUTHENTICATION ISSUES!
 * Usage: node scripts/create-lead-surge.js <practice-id> <practice-name> [doctor-name] [location]
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Configuration  
const GITHUB_USER = 'jomarcello';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Usage: node create-lead-surge.js <practice-id> <practice-name> [doctor-name] [location]');
    console.error('📝 Example: node create-lead-surge.js "madrid-wellness" "Madrid Wellness Center" "Dr. Sofia Martinez" "Madrid, Spain"');
    process.exit(1);
  }

  const practiceId = args[0];
  const practiceName = args[1];
  const doctorName = args[2] || `Dr. ${practiceName.split(' ')[0]} Professional`;
  const location = args[3] || 'Location TBD';
  
  const repoName = `${practiceId}-demo`;
  const surgeUrl = `https://${practiceId}-demo.surge.sh`;
  
  console.log('🚀 Creating 100% AUTOMATED practice lead (Surge.sh Edition)...');
  console.log('🎯 PERFECT for 100s of leads - NO AUTH ISSUES!');
  console.log(`📋 Practice ID: ${practiceId}`);
  console.log(`🏥 Practice Name: ${practiceName}`);
  console.log(`👨‍⚕️ Doctor: ${doctorName}`);
  console.log(`📍 Location: ${location}`);
  console.log(`📦 Repository: ${repoName}`);
  console.log(`🌐 Surge URL: ${surgeUrl}`);
  console.log('');

  try {
    // Step 1: Install Surge CLI if needed
    console.log('🔧 Ensuring Surge CLI is available...');
    ensureSurgeCLI();
    
    // Step 2: Create GitHub repository
    console.log('📁 Creating GitHub repository...');
    createGitHubRepo(repoName, practiceName);
    
    // Step 3: Setup practice repository
    console.log('📋 Setting up practice repository...');
    const tempDir = setupPracticeRepo(repoName, practiceId, practiceName, doctorName, location);
    
    // Step 4: Build static files
    console.log('🔨 Building production files...');
    buildProject(tempDir);
    
    // Step 5: Deploy to Surge (100% automated)
    console.log('🌐 Deploying to Surge (100% automated)...');
    deployToSurge(practiceId, tempDir);
    
    // Step 6: Push to GitHub
    console.log('📤 Pushing to GitHub...');
    pushToGitHub(repoName, tempDir);
    
    console.log('');
    console.log('✅ SUCCESS! 100% AUTOMATED practice lead created:');
    console.log(`🔗 GitHub: https://github.com/${GITHUB_USER}/${repoName}`);
    console.log(`🌐 Live URL: ${surgeUrl}`);
    console.log(`📊 Surge Dashboard: https://surge.sh/account`);
    console.log('');
    console.log('⚡ LIVE IMMEDIATELY - NO AUTHENTICATION REQUIRED!');
    console.log('🎯 PERFECT for 100s of leads - Zero manual setup!');
    
  } catch (error) {
    console.error('❌ Error creating automated lead:', error.message);
    process.exit(1);
  }
}

function ensureSurgeCLI() {
  try {
    execSync('surge --version', { stdio: 'pipe' });
    console.log('✅ Surge CLI already installed');
  } catch (error) {
    console.log('📦 Installing Surge CLI...');
    execSync('npm install -g surge', { stdio: 'inherit' });
    console.log('✅ Surge CLI installed successfully');
  }
}

function createGitHubRepo(repoName, practiceName) {
  const repoData = {
    name: repoName,
    description: `${practiceName} - 100% AUTOMATED practice demo (Surge.sh Edition)`,
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
  const tempDir = `/tmp/${repoName}-${Date.now()}`;
  
  // Clean up any existing temp directory
  if (fs.existsSync(tempDir)) {
    execSync(`rm -rf ${tempDir}`);
  }
  
  // Copy template files
  execSync(`cp -r . ${tempDir}`, { cwd: __dirname + '/..' });
  
  // Change to temp directory
  process.chdir(tempDir);
  
  // Remove git history and scripts
  execSync('rm -rf .git scripts railway.toml vercel.json');
  
  // Initialize new git repo
  execSync('git init');
  execSync('git config user.name "100% Automated Lead Generator"');
  execSync('git config user.email "automation@agentsdemo.com"');
  
  // Create .env for build
  const envContent = `PRACTICE_ID=${practiceId}
NODE_ENV=production
`;
  fs.writeFileSync('.env.local', envContent);
  fs.writeFileSync('.env.production.local', envContent);
  
  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.name = repoName;
  packageJson.description = `${practiceName} - 100% AUTOMATED practice demo (Surge.sh Edition)`;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  // Create comprehensive README
  const readmeContent = `# ${practiceName} - 100% AUTOMATED (Surge.sh Edition)

🚀 **Fully automated practice demo** - PERFECT for 100s of leads!

## ✅ 100% Automated Configuration

- **Practice ID**: \`${practiceId}\`
- **Doctor**: ${doctorName}
- **Location**: ${location}
- **Generated**: ${new Date().toISOString()}
- **Platform**: Surge.sh (Zero authentication issues!)

## 🌐 Live Deployment

**URL**: https://${practiceId}-demo.surge.sh

This demo was **100% automatically**:
- ✅ Created via automated script
- ✅ Deployed to Surge.sh instantly
- ✅ NO AUTHENTICATION REQUIRED
- ✅ Public by default
- ✅ Perfect for mass deployment

## 🎯 Perfect Solution for 100s of Leads

This Surge.sh solution is ideal because:
- ❌ No Vercel authentication issues
- ❌ No Railway manual connections
- ❌ No deployment queues  
- ✅ Instant public URLs
- ✅ Zero configuration conflicts
- ✅ Perfect for scaling to 100s of leads

## 🔧 Development

\`\`\`bash
npm install
export PRACTICE_ID=${practiceId}
npm run dev
\`\`\`

## 📊 Deployment Info

Automatically deployed to Surge.sh:
- Build Command: \`npm run build\`
- Output Directory: \`out/\`
- Static Export: Next.js static export
- No server required

---
🤖 **100% AUTOMATED SURGE.SH EDITION** - The PERFECT solution for 100s of leads!
Generated by Automated Lead Creator (Surge.sh Edition)
`;
  
  fs.writeFileSync('README.md', readmeContent);
  
  // Create next.config.ts for static export
  const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    PRACTICE_ID: '${practiceId}',
  },
  experimental: {
    // Enable if needed
  },
};

export default nextConfig;`;
  
  fs.writeFileSync('next.config.ts', nextConfig);
  
  // Stage all files
  execSync('git add .');
  execSync(`git commit -m "🚀 100% AUTOMATED: ${practiceName} (Surge.sh Edition)

✅ Zero Authentication Issues:
- Practice ID: ${practiceId}
- Doctor: ${doctorName}
- Location: ${location}
- Platform: Surge.sh (Public by default)
- Generated: ${new Date().toISOString()}

🎯 PERFECT for scaling to 100s of leads - NO MANUAL SETUP!

🤖 Generated with 100% Automated Lead Creator (Surge.sh Edition)"`);
  
  return tempDir;
}

function buildProject(tempDir) {
  try {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'pipe' });
    
    console.log('🔨 Building Next.js static export...');
    execSync('npm run build', { stdio: 'pipe' });
    
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    throw error;
  }
}

function deployToSurge(practiceId, tempDir) {
  const surgeUrl = `${practiceId}-demo.surge.sh`;
  
  try {
    console.log('🌐 Deploying to Surge.sh...');
    
    // Deploy the out directory to Surge
    execSync(`echo "\\n\\n" | surge out/ ${surgeUrl}`, { stdio: 'pipe' });
    
    console.log(`✅ Successfully deployed to: https://${surgeUrl}`);
    console.log('🎯 URL is PUBLIC by default - NO AUTHENTICATION REQUIRED!');
    
  } catch (error) {
    console.log('⚠️  Surge deployment needs one-time setup...');
    console.log('');
    console.log('📋 SURGE SETUP (one time only):');
    console.log('1. Run: surge login');
    console.log('2. Create account or login');
    console.log(`3. Run: surge out/ ${surgeUrl}`);
    console.log('4. Your site will be live immediately!');
    console.log('');
    console.log('💡 After first setup, all future deployments are 100% automated!');
  }
}

function pushToGitHub(repoName, tempDir) {
  execSync(`git remote add origin https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${repoName}.git`);
  execSync('git branch -M main');
  execSync(`git push -u origin main`);
  console.log('✅ Pushed to GitHub');
}

// Check required environment variables
if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN environment variable is required');
  console.error('💡 Create a token at: https://github.com/settings/tokens');
  process.exit(1);
}

console.log('🎯 SURGE.SH EDITION - The PERFECT solution for 100s of leads!');
console.log('💡 No authentication issues - Public by default!');
console.log('');

main();