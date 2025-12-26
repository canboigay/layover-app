# Flight-Based Layover Duration - Deployment Guide

## Overview
Added smart flight-based layover duration calculation using AviationStack API. Users can now enter flight numbers to automatically calculate accurate layover times.

## Features
- Optional flight number inputs (arrival & departure)
- Auto-calculates layover duration based on real flight times
- Session auto-expires 30 minutes before departure
- Fallback to manual duration if flights not found
- Displays flight info: flight numbers, airports, calculated duration

## Prerequisites
1. **Get AviationStack API Key** (FREE - 100 requests/month)
   - Go to https://aviationstack.com/signup
   - Sign up for free account
   - Get API key from dashboard

## Deployment Steps

### 1. Add Environment Variable to Render Backend
1. Go to Render.com dashboard
2. Select your backend service
3. Navigate to "Environment" tab
4. Add new environment variable:
   - **Key**: `AVIATIONSTACK_API_KEY`
   - **Value**: Your API key from AviationStack

### 2. Push Changes to Production
```bash
git push origin main
```

This will automatically trigger deployment on both Render (backend) and Cloudflare Pages (frontend).

### 3. Verify Deployment
1. Go to https://layover-app.pages.dev
2. Create new session
3. Toggle "Calculate duration from flight numbers"
4. Test with real flight numbers (e.g., AA1234)
5. Verify calculated duration displays correctly

## API Usage Notes
- Free tier: 100 requests/month
- Each session creation with flights = 2 API calls (arrival + departure)
- ~50 flight-based sessions per month on free tier
- Manual duration remains as fallback (no API call)
- If API key not set or quota exceeded, users can still use manual duration

## Testing Flight Numbers
To test locally, use real flight numbers:
- American Airlines: AA1234, AA5678
- United: UA123, UA456
- Delta: DL100, DL200

Check https://www.flightradar24.com for current active flights.

## Rollback
If issues occur, the app gracefully falls back to manual duration entry. No breaking changes.

## Future Enhancements
- Cache flight data to reduce API calls
- Add flight validation before form submission
- Show estimated arrival/departure times in UI
- Upgrade to paid tier for higher volume
