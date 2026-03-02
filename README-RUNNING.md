# Adermis - AI Skin Disease Diagnosis Platform

## Quick Start Commands

### Option 1: Single Command (Batch File)
```bash
# Double-click or run in terminal:
start-adermis.bat
```

### Option 2: Single Command (PowerShell)
```powershell
# Right-click "Run with PowerShell" or run:
.\start-adermis.ps1
```

## Individual Commands

### Backend Only (Flask API)
```bash
cd Adermis-main\backend
python gateway.py
```
**Runs on:** http://localhost:5000

### Frontend Only (Next.js)
```bash
cd Adermis-main\adermis  
npm run dev
```
**Runs on:** http://localhost:3000

## Manual Setup (First Time)

### 1. Install Backend Dependencies
```bash
cd Adermis-main\backend
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies  
```bash
cd Adermis-main\adermis
npm install
```

### 3. Set Environment Variables
Create `.env` in backend folder:
```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_maps_api_key
```

Create `.env.local` in frontend folder:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Access URLs
- **Main App:** http://localhost:3000
- **API Gateway:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Stopping Servers
- Press `Ctrl+C` in each terminal window
- Or close the terminal windows