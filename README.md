# AgentsDemo Template

Universal template repository for creating individual practice demo instances. This solves the bulk deployment problem by giving each practice its own repository and Railway project.

## 🎯 Problem Solved

**Before**: All practices in one repo → every change triggers all deployments → bulk redeployment chaos

**After**: Template system → individual repos per practice → isolated deployments → no more bulk issues

## 🏗️ Architecture

```
agentsdemo-template/              # Master template (this repo)
├── src/lib/practice-config.ts    # Environment-based config
├── railway.toml                  # Railway deployment config
└── scripts/create-new-lead.js    # Lead generation script

barcelona-wellness-demo/          # Individual practice repo
├── .env (PRACTICE_ID=barcelona-wellness-clinic)
├── railway.toml (connected to own Railway project)
└── [identical template files]

smith-chiropractic-demo/          # Individual practice repo  
├── .env (PRACTICE_ID=smith)
└── [identical template files]
```

## 🚀 Creating New Leads

### Automated Way (Recommended)

```bash
# Set required tokens
export RAILWAY_TOKEN="your-railway-token"
export GITHUB_TOKEN="your-github-token"

# Create new practice
node scripts/create-new-lead.js "lisbon-wellness" "Lisbon Wellness Center" "Dr. Maria Santos" "Lisbon, Portugal"
```

This automatically:
- ✅ Creates GitHub repository
- ✅ Sets up practice-specific configuration  
- ✅ Creates Railway project and service
- ✅ Deploys to unique URL

### Manual Way

1. **Create GitHub repo**: `practice-id-demo`
2. **Copy template files**
3. **Set environment**: `PRACTICE_ID=practice-id`
4. **Create Railway project** and connect to repo
5. **Push to deploy**

## 📝 Adding New Practice Configurations

Edit `src/lib/practice-config.ts` and add your practice:

```typescript
'your-practice-id': {
  id: 'your-practice-id',
  name: 'Your Practice Name',
  doctor: 'Dr. Your Name',
  location: 'Your City, Country',
  agentId: 'agent_01jz5eh84heyzr7vsvdhycjzdd',
  type: 'wellness', // or 'chiropractic' or 'beauty'
  subdomain: 'your-practice-id',
  
  chat: {
    assistantName: 'Assistant Name',
    initialMessage: 'Welcome message...',
    systemPrompt: `Detailed system prompt...`
  },
  
  voice: {
    firstMessage: 'Voice greeting...'
  },
  
  services: [
    { name: 'Service 1', description: 'Description...' },
    { name: 'Service 2', description: 'Description...' }
  ],
  
  branding: {
    primaryColor: 'blue',
    tagline: 'Your tagline',
    focus: 'your focus area'
  }
}
```

## 🔄 Template Syncing

When you update the template, the sync workflow automatically updates all practice repositories:

```yaml
# .github/workflows/sync-to-instances.yml
# Runs on every push to main branch
# Syncs template changes to all practice repos
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Set practice for local development
export PRACTICE_ID=barcelona-wellness-clinic

# Start development server
npm run dev
```

## 🌐 Railway Deployment

Each practice gets its own Railway project:

- **Project Name**: `practice-id-demo`
- **Service Name**: `practice-id-demo`  
- **URL**: `https://practice-id-demo-production.up.railway.app`
- **Environment**: `PRACTICE_ID=practice-id`

## 📦 Environment Variables

Set in Railway dashboard for each practice:

```bash
# Required
PRACTICE_ID=your-practice-id
NODE_ENV=production

# API Keys
OPENAI_API_KEY=your-openai-key
ELEVENLABS_API_KEY=your-elevenlabs-key
```

## 🔧 Configuration

### Railway Configuration (`railway.toml`)
```toml
[build]
builder = "nixpacks"
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"

[env]
PRACTICE_ID = "practice-id"
NODE_ENV = "production"
```

### Environment-based Config (`src/lib/practice-config.ts`)
```typescript
export function getCurrentPractice(): PracticeConfig {
  const practiceId = process.env.PRACTICE_ID || 'advanced-spine-care';
  return practiceConfigs[practiceId];
}
```

## 🎉 Benefits

- ✅ **No bulk deployments** - each practice has isolated deployments
- ✅ **Easy scaling** - add new practices with one script
- ✅ **Template consistency** - all practices stay in sync
- ✅ **Individual URLs** - each practice gets unique Railway URL
- ✅ **Environment isolation** - no configuration conflicts
- ✅ **Railway efficiency** - individual projects, better resource management

## 📋 Example Practices

Current practice configurations:
- `advanced-spine-care` - Advanced Spine Care (Atlanta, GA)
- `barcelona-wellness-clinic` - Barcelona Wellness Clinic (Barcelona, España)  
- `smith` - Smith Chiropractic (Phoenix, AZ)

## 🚨 Important Notes

1. **Railway Token**: Keep your Railway token secure and updated
2. **GitHub Token**: Needs repo creation permissions  
3. **Practice IDs**: Use kebab-case (lowercase with hyphens)
4. **Unique Subdomains**: Each practice needs unique Railway subdomain
5. **Template Updates**: Auto-sync to all practice repos on template changes

## 📞 Support

For issues with:
- **Template updates**: Check sync workflow logs
- **New lead creation**: Verify tokens and practice ID format
- **Railway deployment**: Check Railway project logs
- **Configuration**: Ensure `PRACTICE_ID` matches config key

---

🤖 **Template System** - Solving bulk deployment chaos, one practice at a time!