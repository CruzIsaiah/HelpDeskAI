# HelpDesk AI - Deployment Guide

## Overview

This guide will help you deploy the HelpDesk AI system to Railway.app and Vercel for production use.

## Architecture

```
Frontend (Vercel) → Backend (Railway) → External Services
                    ↓
               PostgreSQL (Railway)
               Pinecone (Vector DB)
               OpenAI (Whisper & GPT)
```

## Prerequisites

1. **Accounts needed:**
   - Railway.app account
   - Vercel account
   - OpenAI API key
   - Pinecone API key
   - GitHub account (for deployment)

2. **Repository:**
   - GitHub repository: https://github.com/CruzIsaiah/HelpDeskAI

## Backend Deployment on Railway

### Step 1: Prepare Environment Variables

Create a `.env` file in the `backend/` directory with these variables:

```bash
# Database (PostgreSQL - provided by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
EMBED_MODEL=text-embedding-3-small

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=helpdesk-ai

# CORS
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000

# AWS S3 (Optional - for audio/manual storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=helpdesk-ai-storage
AWS_REGION=us-east-1
```

**Important:** Don't commit the `.env` file to git - add it to `.gitignore`.

### Step 2: Pinecone Setup

1. Go to [Pinecone.io](https://www.pinecone.io)
2. Create an account and get your API key
3. Create a new index:
   - Name: `helpdesk-ai`
   - Dimension: 1536 (for OpenAI embeddings)
   - Metric: cosine
   - Pod type: p1.x1 (or appropriate for your scale)

### Step 3: Knowledge Base Setup

Your knowledge base documents are in `backend/docs/manuals/`. To ingest them:

```bash
# (Run this locally to populate Pinecone)
cd backend
python -m app.rag.ingest
```

### Step 4: Deploy to Railway

**Option A: Using Railway CLI**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd HelpDeskAI/backend
railway init

# Create PostgreSQL database
railway add
# Select PostgreSQL

# Deploy
railway up
```

**Option B: Using Railway Dashboard**

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository (CruzIsaiah/HelpDeskAI)
5. Select the backend directory as the root
6. Add PostgreSQL service
7. Configure environment variables in Railway dashboard
8. Deploy

### Step 5: Get Backend URL

After deployment, Railway will provide a URL like:
`https://helpdesk-backend-production.up.railway.app`

Save this URL for frontend configuration.

## Frontend Deployment on Vercel

### Step 1: Configure Environment Variables

Create `frontend/.env.production`:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_ENVIRONMENT=production
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Import Git repository
3. Select the frontend directory as root
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables
6. Deploy

### Step 3: Update CORS

After getting your Vercel URL (e.g., `https://helpdesk-ai.vercel.app`), update the `CORS_ORIGINS` variable in Railway to include it.

## API Endpoints

### Backend API (FastAPI)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/transcribe/` | POST | Upload audio file, returns transcript |
| `/api/troubleshoot/` | POST | Get troubleshooting steps |
| `/api/manual/generate` | POST | Generate PDF/Markdown manual |
| `/api/rag/ingest` | POST | Ingest documents to vector DB |
| `/api/rag/search` | POST | Search knowledge base |
| `/` | GET | Health check |
| `/health` | GET | Health check |

### Frontend Components

- `VoiceRecorder.tsx` - Records and transcribes audio
- `TroubleshootingPanel.tsx` - Displays solutions and generates manuals

## Testing

### Test Backend Locally

```bash
cd backend
# Set up virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run tests
python -m pytest tests/

# Start server
python run.py
```

### Test Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Check DATABASE_URL in Railway
2. Ensure PostgreSQL service is running
3. Try restarting the backend service

### Pinecone Errors

If Pinecone returns errors:
1. Verify PINECONE_API_KEY is set
2. Check PINECONE_INDEX_NAME matches your index
3. Ensure index exists and is active

### OpenAI API Errors

If OpenAI API fails:
1. Verify OPENAI_API_KEY is set
2. Check API key has sufficient credits
3. Try a different model (gpt-3.5-turbo is cheaper)

### CORS Issues

If you see CORS errors:
1. Update CORS_ORIGINS with frontend URL
2. Restart backend service
3. Clear browser cache

## Security Considerations

1. **Never commit `.env` files**
2. **Use Railway/Vercel environment variables**
3. **Restrict API keys to specific services**
4. **Enable 2FA on all accounts**
5. **Regularly rotate API keys**

## Scaling

### Increasing Capacity

**Backend (Railway):**
- Increase CPU/Memory in service settings
- Enable auto-scaling
- Consider upgrading to Pro plan

**Frontend (Vercel):**
- Use Vercel Pro for higher limits
- Enable auto-scaling
- Consider edge functions for global distribution

**Pinecone:**
- Monitor index size
- Upgrade pod type as needed
- Consider multiple indexes for different environments

**OpenAI:**
- Monitor API usage
- Set up usage alerts
- Consider rate limiting in your app

## Monitoring

### Backend Logs

View logs in Railway dashboard or:
```bash
railway logs
```

### Frontend Analytics

Use Vercel analytics or add:
- Google Analytics
- Sentry for error tracking
- LogRocket for session replay

## Cost Estimates

Per session (approximate):
- OpenAI Whisper: $0.006 / minute of audio
- OpenAI GPT: $0.0015 / 1K tokens
- OpenAI Embeddings: $0.0001 / 1K tokens
- Pinecone: Free tier up to 100K vectors
- Railway: $5-20 / month
- Vercel: Free tier available

### Monthly Costs (Estimates)

**Low traffic (100 sessions/month):**
- OpenAI: ~$5
- Railway Hobby: $5
- Vercel Hobby: $0
- Total: ~$10/month

**Medium traffic (1000 sessions/month):**
- OpenAI: ~$40
- Railway Pro: $20
- Vercel Pro: $20
- Total: ~$80/month

## Support

If you encounter issues:
1. Check logs in Railway/Vercel dashboards
2. Review this deployment guide
3. Test with local development
4. Contact team members for help

## Next Steps

After deployment:
1. Test full user flow: record → transcribe → solution → download
2. Monitor initial usage
3. Gather user feedback
4. Iterate on prompts and knowledge base
5. Add analytics and error tracking
6. Consider adding authentication for save features

## Updates

To deploy updates:

**Backend:**
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys on push
```

**Frontend:**
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys on push
```

---

**Good luck with your HelpDesk AI deployment! 🚀**
