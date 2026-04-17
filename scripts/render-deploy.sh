#!/bin/bash

# Render Deployment Helper Script
# This script helps you prepare for Render deployment

set -e

echo "🚀 Adryx Render Deployment Helper"
echo "=================================="
echo ""

# Check if git repo exists
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    echo "Please initialize git and push to GitHub/GitLab/Bitbucket first:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    echo "  git remote add origin <your-repo-url>"
    echo "  git push -u origin main"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check if render.yaml exists
if [ ! -f render.yaml ]; then
    echo "❌ Error: render.yaml not found"
    exit 1
fi

echo "✅ render.yaml found"
echo ""

# Generate JWT secret
echo "🔐 Generating JWT Secret..."
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET: $JWT_SECRET"
echo ""

# Check for Solana keypair
echo "🔑 Checking Solana Configuration..."
if [ -f ~/.config/solana/id.json ]; then
    echo "✅ Solana keypair found at ~/.config/solana/id.json"
    echo ""
    echo "To get your private key in base58 format, run:"
    echo "  solana-keygen pubkey ~/.config/solana/id.json"
    echo ""
else
    echo "⚠️  No Solana keypair found"
    echo "Generate one with:"
    echo "  solana-keygen new --outfile ~/.config/solana/id.json"
    echo ""
fi

# Check MongoDB
echo "💾 MongoDB Setup..."
echo "You need a MongoDB connection string. Options:"
echo ""
echo "1. MongoDB Atlas (Recommended):"
echo "   - Go to https://www.mongodb.com/cloud/atlas"
echo "   - Create a free cluster"
echo "   - Get connection string"
echo ""
echo "2. Render MongoDB:"
echo "   - Create in Render dashboard"
echo "   - Copy internal connection string"
echo ""

# Deployment checklist
echo "📋 Pre-Deployment Checklist:"
echo "=================================="
echo ""
echo "[ ] Code pushed to Git repository"
echo "[ ] MongoDB connection string ready"
echo "[ ] Solana private key ready (base58 format)"
echo "[ ] JWT secret generated (see above)"
echo "[ ] Render account created"
echo ""

# Next steps
echo "🎯 Next Steps:"
echo "=================================="
echo ""
echo "1. Push your code to Git:"
echo "   git push origin main"
echo ""
echo "2. Go to Render Dashboard:"
echo "   https://dashboard.render.com"
echo ""
echo "3. Click 'New +' → 'Blueprint'"
echo ""
echo "4. Connect your repository"
echo ""
echo "5. Render will detect render.yaml and create services"
echo ""
echo "6. Set these secrets in Render dashboard:"
echo "   - MONGODB_URI: <your-mongodb-connection-string>"
echo "   - SOLANA_PRIVATE_KEY: <your-solana-private-key-base58>"
echo "   - JWT_SECRET: $JWT_SECRET"
echo ""
echo "7. Deploy!"
echo ""

# Save secrets to file
echo "💾 Saving secrets to .render-secrets (DO NOT COMMIT THIS FILE)..."
cat > .render-secrets << EOF
# Render Deployment Secrets
# DO NOT COMMIT THIS FILE TO GIT

JWT_SECRET=$JWT_SECRET
MONGODB_URI=<paste-your-mongodb-connection-string-here>
SOLANA_PRIVATE_KEY=<paste-your-solana-private-key-here>

# Copy these values to Render dashboard environment variables
EOF

echo "✅ Secrets saved to .render-secrets"
echo ""

# Add to gitignore
if ! grep -q ".render-secrets" .gitignore 2>/dev/null; then
    echo ".render-secrets" >> .gitignore
    echo "✅ Added .render-secrets to .gitignore"
fi

echo ""
echo "🎉 Ready for deployment!"
echo ""
echo "Read RENDER_DEPLOYMENT.md for detailed instructions"
