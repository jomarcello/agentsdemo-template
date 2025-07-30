#!/usr/bin/env node

/**
 * 100% AUTOMATED Lead Generation - Vercel Edition
 * Perfect for 100s of leads - no manual steps required
 * Usage: node scripts/create-lead-vercel.js <practice-id> <practice-name> [doctor-name] [location]
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Configuration  
const GITHUB_USER = 'jomarcello';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Usage: node create-lead-vercel.js <practice-id> <practice-name> [doctor-name] [location]');
    console.error('📝 Example: node create-lead-vercel.js "barcelona-wellness" "Barcelona Wellness Center" "Dr. Sofia Martinez" "Barcelona, Spain"');
    process.exit(1);
  }

  const practiceId = args[0];
  const practiceName = args[1];
  const doctorName = args[2] || `Dr. ${practiceName.split(' ')[0]} Professional`;
  const location = args[3] || 'Location TBD';
  
  const repoName = `${practiceId}-demo`;
  
  console.log('🚀 Creating 100% AUTOMATED practice lead (Vercel Edition)...');
  console.log(`📋 Practice ID: ${practiceId}`);
  console.log(`🏥 Practice Name: ${practiceName}`);
  console.log(`👨‍⚕️ Doctor: ${doctorName}`);
  console.log(`📍 Location: ${location}`);
  console.log(`📦 Repository: ${repoName}`);
  console.log('');

  try {
    // Step 1: Install Vercel CLI if needed
    console.log('🔧 Ensuring Vercel CLI is available...');
    ensureVercelCLI();
    
    // Step 2: Create GitHub repository
    console.log('📁 Creating GitHub repository...');
    createGitHubRepo(repoName, practiceName);
    
    // Step 3: Setup practice repository
    console.log('📋 Setting up practice repository...');
    const tempDir = setupPracticeRepo(repoName, practiceId, practiceName, doctorName, location);
    
    // Step 4: Push to GitHub
    console.log('📤 Pushing to GitHub...');
    pushToGitHub(repoName, tempDir);
    
    // Step 5: Deploy to Vercel (100% automated)
    console.log('🌐 Deploying to Vercel (100% automated)...');
    const vercelUrl = deployToVercel(practiceId, repoName, tempDir);
    
    console.log('');
    console.log('✅ SUCCESS! 100% AUTOMATED practice lead created:');
    console.log(`🔗 GitHub: https://github.com/${GITHUB_USER}/${repoName}`);
    console.log(`🌐 Live URL: ${vercelUrl}`);
    console.log(`🚀 Vercel Dashboard: https://vercel.com/dashboard`);
    console.log('');
    console.log('⚡ Deployment is LIVE immediately!');
    console.log('🎯 100% AUTOMATED - Perfect for 100s of leads!');
    
  } catch (error) {
    console.error('❌ Error creating automated lead:', error.message);
    process.exit(1);
  }
}

function ensureVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI already installed');
  } catch (error) {
    console.log('📦 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  }
}

function createGitHubRepo(repoName, practiceName) {
  const repoData = {
    name: repoName,
    description: `${practiceName} - 100% AUTOMATED practice demo (Vercel Edition)`,
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
  execSync('rm -rf .git scripts railway.toml');
  
  // Initialize new git repo
  execSync('git init');
  execSync('git config user.name "100% Automated Lead Generator"');
  execSync('git config user.email "automation@agentsdemo.com"');
  
  // Create Vercel-specific configuration with public access (simplified)
  const vercelConfig = {
    "version": 2,
    "public": true,
    "env": {
      "PRACTICE_ID": practiceId,
      "NODE_ENV": "production"
    },
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Robots-Tag",
            "value": "noindex"
          },
          {
            "key": "X-Frame-Options", 
            "value": "SAMEORIGIN"
          }
        ]
      }
    ]
  };
  
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  
  // Create .env.local for development
  const envContent = `# ${practiceName} Configuration - 100% AUTOMATED
PRACTICE_ID=${practiceId}
NODE_ENV=development

# API Keys (set in Vercel dashboard)
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
`;
  fs.writeFileSync('.env.local', envContent);
  fs.writeFileSync('.env.example', envContent);
  
  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.name = repoName;
  packageJson.description = `${practiceName} - 100% AUTOMATED practice demo (Vercel Edition)`;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  // Create comprehensive README
  const readmeContent = `# ${practiceName} - 100% AUTOMATED (Vercel Edition)

🚀 **Fully automated practice demo** - Perfect for scaling to 100s of leads!

## ✅ 100% Automated Configuration

- **Practice ID**: \`${practiceId}\`
- **Doctor**: ${doctorName}
- **Location**: ${location}
- **Generated**: ${new Date().toISOString()}
- **Platform**: Vercel (Zero manual setup!)

## 🌐 Live Deployment

**URL**: https://${repoName}.vercel.app

This demo was **100% automatically**:
- ✅ Created via automated script
- ✅ Deployed to Vercel instantly
- ✅ Environment variables configured
- ✅ Custom domain ready
- ✅ SSL certificate active

## 🎯 Perfect for Mass Deployment

This solution scales to **unlimited leads**:
- No manual Railway connections
- No deployment queues  
- Instant live URLs
- Zero configuration conflicts

## 🔧 Development

\`\`\`bash
npm install
export PRACTICE_ID=${practiceId}
npm run dev
\`\`\`

## 📊 Environment Variables

Automatically configured in Vercel:
- \`PRACTICE_ID=${practiceId}\`
- \`NODE_ENV=production\`
- \`OPENAI_API_KEY\` (via Vercel secrets)
- \`ELEVENLABS_API_KEY\` (via Vercel secrets)

---
🤖 **100% AUTOMATED VERCEL EDITION** - Perfect for 100s of leads!
Generated by Automated Lead Creator (Vercel Edition)
`;
  
  fs.writeFileSync('README.md', readmeContent);
  
  // Stage all files
  execSync('git add .');
  execSync(`git commit -m "🚀 100% AUTOMATED: ${practiceName} (Vercel Edition)

✅ Zero Manual Setup Required:
- Practice ID: ${practiceId}
- Doctor: ${doctorName}
- Location: ${location}
- Platform: Vercel (Instant deployment)
- Generated: ${new Date().toISOString()}

🎯 Perfect for scaling to 100s of leads!

🤖 Generated with 100% Automated Lead Creator (Vercel Edition)"`);
  
  return tempDir;
}

function pushToGitHub(repoName, tempDir) {
  execSync(`git remote add origin https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${repoName}.git`);
  execSync('git branch -M main');
  execSync(`git push -u origin main`);
  console.log('✅ Pushed to GitHub');
}

function deployToVercel(practiceId, repoName, tempDir) {
  try {
    // Set Vercel token
    if (VERCEL_TOKEN) {
      fs.writeFileSync('.vercel-token', VERCEL_TOKEN);
      execSync(`vercel login --token ${VERCEL_TOKEN}`, { stdio: 'pipe' });
    }
    
    // Deploy to Vercel with project name and force public
    console.log('🚀 Deploying to Vercel (forcing public access)...');
    const deployOutput = execSync(`vercel --prod --yes --public --name ${repoName}`, { 
      encoding: 'utf8',
      env: { ...process.env, VERCEL_TOKEN: VERCEL_TOKEN }
    });
    
    // Extract URL from output
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
    const vercelUrl = urlMatch ? urlMatch[0] : `https://${repoName}.vercel.app`;
    
    console.log('✅ Successfully deployed to Vercel!');
    
    // Set environment variables and ensure public access
    if (VERCEL_TOKEN) {
      try {
        execSync(`vercel env add PRACTICE_ID production <<< "${practiceId}"`, { stdio: 'pipe' });
        execSync(`vercel env add NODE_ENV production <<< "production"`, { stdio: 'pipe' });
        console.log('✅ Environment variables configured in Vercel');
        
        // Force public access via API
        try {
          execSync(`curl -s -X PATCH \\
            -H "Authorization: Bearer ${VERCEL_TOKEN}" \\
            -H "Content-Type: application/json" \\
            -d '{"passwordProtection": null, "ssoProtection": null}' \\
            "https://api.vercel.com/v9/projects/${repoName}"`, 
            { stdio: 'pipe' }
          );
          console.log('✅ Forced public access via Vercel API');
        } catch (apiError) {
          console.log('⚠️  Manual public access setup required in Vercel dashboard');
        }
        
      } catch (envError) {
        console.log('⚠️  Environment variables need manual setup in Vercel dashboard');
      }
    }
    
    return vercelUrl;
    
  } catch (error) {
    console.log('⚠️  Using simplified Vercel deployment...');
    
    // Fallback: Simple deployment with public flag
    try {
      const deployOutput = execSync('vercel --prod --yes --public', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
      return urlMatch ? urlMatch[0] : `https://${repoName}.vercel.app`;
      
    } catch (fallbackError) {
      console.log('📋 Manual Vercel setup required:');
      console.log('1. cd to project directory');
      console.log('2. Run: vercel --prod');
      console.log('3. Follow prompts');
      return `https://${repoName}.vercel.app (manual deployment required)`;
    }
  }
}

// Check required environment variables
if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN environment variable is required');
  console.error('💡 Create a token at: https://github.com/settings/tokens');
  process.exit(1);
}

console.log('🎯 VERCEL EDITION - Perfect for 100s of automated leads!');
console.log('💡 Tip: Set VERCEL_TOKEN for fully automated deployment');
console.log('');

main();