#!/bin/bash
# HelpDesk AI - Complete Deployment Script
# Run this script on your local machine to deploy everything

set -e

echo "🚀 HelpDesk AI - Full Deployment Script"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print colored output
info() {
    echo -e "${BLUE}INFO:${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if commands exist
check_command() {
    if command -v $1 &> /dev/null; then
        success "$1 is installed"
        return 0
    else
        error "$1 is not installed"
        return 1
    fi
}

# Step 1: Check prerequisites
echo ""
echo "Step 1: Checking prerequisites..."
echo "-----------------------------------"

REQUIRED_COMMANDS=("python3" "pip3" "npm" "railway" "vercel" "curl")
MISSING_COMMANDS=()

for cmd in "${REQUIRED_COMMANDS[@]}"; do
    if ! check_command $cmd; then
        MISSING_COMMANDS+=("$cmd")
    fi
done

if [ ${#MISSING_COMMANDS[@]} -ne 0 ]; then
    echo ""
    error "Missing required commands: ${MISSING_COMMANDS[*]}"
    echo ""
    info "Please install missing commands:"
    echo "  - Python 3: https://python.org/downloads"
    echo "  - pip3: Usually comes with Python"
    echo "  - npm: https://nodejs.org/"
    echo "  - Railway CLI: npm install -g @railway/cli"
    echo "  - Vercel CLI: npm install -g vercel"
    echo "  - curl: Usually pre-installed"
    exit 1
fi

success "All prerequisites met!"

# Step 2: Verify API keys are set
echo ""
echo "Step 2: Verifying API keys..."
echo "------------------------------"

if [ ! -f "backend/.env" ]; then
    error "backend/.env file not found!"
    warn "Make sure you have backend/.env with all API keys"
    exit 1
fi

source backend/.env

if [ -z "$OPENAI_API_KEY" ]; then
    error "OPENAI_API_KEY not set in backend/.env"
    exit 1
fi

if [ -z "$PINECONE_API_KEY" ]; then
    error "PINECONE_API_KEY not set in backend/.env"
    exit 1
fi

if [ -z "$RAILWAY_TOKEN" ]; then
    warn "RAILWAY_TOKEN not set. Set it with: export RAILWAY_TOKEN=your_token"
    exit 1
fi

if [ -z "$VERCEL_TOKEN" ]; then
    warn "VERCEL_TOKEN not set. Set it with: export VERCEL_TOKEN=your_token"
    exit 1
fi

success "✓ All API keys verified!"

# Step 3: Set up Pinecone
echo ""
echo "Step 3: Setting up Pinecone vector database..."
echo "----------------------------------------------"

cd backend
info "Running Pinecone setup script..."
python3 setup_pinecone.py

if [ $? -eq 0 ]; then
    success "Pinecone setup completed!"
else
    error "Pinecone setup failed"
    exit 1
fi

cd ..

# Step 4: Deploy backend to Railway
echo ""
echo "Step 4: Deploying backend to Railway..."
echo "----------------------------------------"

cd backend
info "Logging into Railway..."
railway login --token "$RAILWAY_TOKEN"

info "Initializing Railway project..."
railway init --name helpdesk-backend

info "Linking to GitHub repository..."
railway link

info "Adding PostgreSQL database..."
railway add --postgres

info "Deploying backend..."
railway up

if [ $? -eq 0 ]; then
    success "Backend deployed!"
    BACKEND_URL=$(railway status | grep -o 'https://[^"]*\.up\.railway\.app')
    success "Backend URL: $BACKEND_URL"
    
    # Update CORS
    info "Updating CORS_ORIGINS..."
    railway variables set CORS_ORIGINS="$BACKEND_URL,http://localhost:3000"
else
    error "Backend deployment failed"
    exit 1
fi

cd ..

# Step 5: Deploy frontend to Vercel
echo ""
echo "Step 5: Deploying frontend to Vercel..."
echo "----------------------------------------"

cd frontend
info "Logging into Vercel..."
vercel login --token "$VERCEL_TOKEN"

info "Deploying frontend..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    success "Frontend deployed!"
    
    info "Setting API URL environment variable..."
    vercel env add NEXT_PUBLIC_API_URL production --token "$VERCEL_TOKEN"
    # You'll need to enter the Railway backend URL when prompted
else
    error "Frontend deployment failed"
    exit 1
fi

cd ..

# Step 6: Show deployment summary
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================="

echo ""
echo "✅ Backend deployed to: https://<railway-app>.up.railway.app"
echo "✅ Frontend deployed to: https://<vercel-app>.vercel.app"
echo "✅ Pinecone index created: helpdesk-ai"
echo "✅ Knowledge base ingested"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Update CORS in Railway to allow your Vercel URL"
echo "2. Test the complete flow at your Vercel URL"
echo "3. Check Railway logs: railway logs"
echo "4. Check Vercel logs: vercel logs"
echo ""
echo "🧪 TEST THE SYSTEM:"
echo "1. Open your Vercel URL"
echo "2. Click 'Start Recording'"
echo "3. Describe a technical issue"
echo "4. Verify transcript appears"
echo "5. Download PDF/Markdown manual"

exit 0
