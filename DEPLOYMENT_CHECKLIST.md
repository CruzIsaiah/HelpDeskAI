# HelpDesk AI - Deployment Checklist

## Pre-Deployment ✅

- [x] Environment variables configured
- [x] GitHub repository synced
- [x] Backend code ready
- [x] Frontend code ready
- [x] API keys validated
- [x] Docker files ready

## Railway Backend Deployment

### Step 1: Deploy Backend Application
- [ ] Log in to Railway dashboard (https://railway.app/dashboard)
- [ ] Click "Create New" → "Specify existing GitHub repository"
- [ ] Select: `https://github.com/CruzIsaiah/HelpDeskAI.git` (or private repo)
- [ ] Select root directory, or create service from backend folder
- [ ] Verify build logs are successful
- [ ] Note the Railway app URL (e.g., `helpdesk-backend-xxxx.up.railway.app`)

### Step 2: Add PostgreSQL Database
- [ ] In Railway project, click "Create" → "Database" → "PostgreSQL"
- [ ] Wait for database to initialize
- [ ] Database will auto-set `DATABASE_URL` environment variable
- [ ] Configure other environment variables:

```
OPENAI_API_KEY = [from .env.deployment]
OPENAI_MODEL = gpt-4o-mini
EMBED_MODEL = text-embedding-3-small
PINECONE_API_KEY = [from .env.deployment]
PINECONE_INDEX_NAME = helpdesk-ai
CORS_ORIGINS = https://[your-vercel-frontend].vercel.app
```

- [ ] Trigger backend redeploy after environment variables are set

### Step 3: Test Backend
- [ ] Test health endpoint: `curl https://[backend-url]/health`
- [ ] Verify database connection works
- [ ] Check Railway logs for any errors

## Vercel Frontend Deployment

### Step 1: Deploy Frontend
- [ ] Log in to Vercel dashboard (https://vercel.com/dashboard)
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository: `https://github.com/CruzIsaiah/HelpDeskAI.git`
- [ ] Select "Next.js" as framework
- [ ] Set root directory to `./frontend`
- [ ] Verify build is successful
- [ ] Note the Vercel deployment URL

### Step 2: Configure Environment Variables
- [ ] Set `NEXT_PUBLIC_API_URL` = `https://[your-railway-backend].up.railway.app`
- [ ] Set `NEXT_PUBLIC_ENVIRONMENT` = `production`
- [ ] Trigger redeployment

### Step 3: Test Frontend
- [ ] Open `https://[your-vercel-frontend].vercel.app`
- [ ] Verify page loads
- [ ] Check browser console for errors
- [ ] Test microphone permission request

## Pinecone Vector Database Setup

- [ ] Log in to Pinecone console (https://app.pinecone.io)
- [ ] Verify index `helpdesk-ai` exists
- [ ] Confirm vectordimension: 1536 (for text-embedding-3-small)
- [ ] Check document ingestion (run setup_pinecone.py if needed)
- [ ] Verify knowledge base documents are indexed

## End-to-End Testing

### Backend API Tests
```bash
# Health check
curl https://[backend-url]/health

# Verify CORS
curl -H "Origin: https://[frontend-url]" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS https://[backend-url]/api/transcribe/
```

### Frontend Tests
- [ ] Load application in browser
- [ ] Request microphone permission
- [ ] Test audio recording functionality
- [ ] Submit audio for transcription
- [ ] Verify troubleshooting steps appear
- [ ] Test PDF download
- [ ] Test Markdown download
- [ ] Check database persistence

### Integration Tests
```bash
# Run the test suite
./test-integration.sh https://[backend-url] https://[frontend-url]
```

## Performance Verification

- [ ] Backend response time < 5 seconds (from PROJECT_REQUIREMENTS)
- [ ] Frontend load time < 3 seconds
- [ ] No console errors in browser
- [ ] Database queries responsive
- [ ] Pinecone search latency acceptable

## Security Verification

- [ ] All traffic uses HTTPS
- [ ] API keys are not exposed in logs
- [ ] CORS is properly configured
- [ ] No sensitive data in frontend code
- [ ] Database credentials are environment variables only
- [ ] Pinecone API key is not exposed

## Monitoring Setup

- [ ] Railway monitoring enabled
- [ ] Vercel analytics enabled
- [ ] Error tracking configured (if applicable)
- [ ] Log aggregation set up
- [ ] Alert notifications configured

## Post-Deployment

- [ ] Document final URLs
- [ ] Create deployment report
- [ ] Share with team members
- [ ] Update links in README.md
- [ ] Notify stakeholders of go-live

## Rollback Plan (if needed)

- [ ] Keep previous production URLs
- [ ] Have database backup available
- [ ] Document rollback steps
- [ ] Test rollback procedure

---

## Deployment Timestamps

- Preparation Started: [datetime]
- Backend Deployment: [datetime]
- Frontend Deployment: [datetime]
- Tests Completed: [datetime]
- Go-Live: [datetime]

## Deployment URLs

- Backend API: https://[backend-url].up.railway.app
- Frontend: https://[frontend-url].vercel.app
- GitHub Repo: https://github.com/CruzIsaiah/HelpDeskAI
- Pinecone Index: helpdesk-ai

