# Investment & Contribution Tracker

A sophisticated web application for tracking KWD contributions from multiple people and calculating fair investment returns based on ownership percentages.

## Features

✅ **Multi-person Contribution Tracking** - Add multiple contributors with their investment amounts  
✅ **Automatic Percentage Calculations** - Real-time calculation of ownership percentages  
✅ **Manual Profit Distribution** - Enter total returns and distribute fairly based on contributions  
✅ **Transaction History** - Complete log of all contributions and profit distributions  
✅ **Data Export** - Export all data as JSON for backup or analysis  
✅ **PWA Support** - Install on iPhone for offline use  
✅ **Responsive Design** - Works perfectly on mobile and desktop  
✅ **Classical Design** - Sophisticated color scheme without emojis  
✅ **Name Dropdown** - Select from existing contributors when adding transactions  
✅ **Withdrawals & Deposits** - Enter negative amounts for withdrawals, positive for deposits  

## Color Scheme

- **Graphite**: #353535 (primary text and headers)
- **Pale Slate**: #D2D7DF (backgrounds and cards)
- **Ocean Blue**: #1D84B5 (buttons and accents)  

## Installation

### Web Version
1. Open `index.html` in any modern web browser
2. Start tracking contributions immediately

### PWA Installation (iPhone)
1. Open the app in Safari on your iPhone
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to install

The app will then appear on your home screen like a native app and work offline.

### 2. Create a New Investment Group
1. Click **"+ New Investment Group"**
2. Enter group name (e.g., "Business Venture", "Property Investment")
3. Click **Create**

### 3. Add Contributions
In the **📊 Contributions** tab:
1. **Select Person**: Click the name field to see a dropdown of existing contributors, or type a new name
2. **Enter Amount**: 
   - **Positive amount** (e.g., 150) for deposits/contributions
   - **Negative amount** (e.g., -50) for withdrawals
3. Click **"Add Contribution"**
4. Repeat for more transactions from same or different people

**Examples:**
```
Alex: +150 KWD (deposit)
Dan: +100 KWD (deposit)  
Alex: -25 KWD (withdrawal)
Dan: +75 KWD (additional deposit)
```

**Result:**
- Alex total: 125 KWD (57.1%)
- Dan total: 175 KWD (42.9%)
- **Total: 300 KWD**

### 4. Calculate Investment Returns
In the **💰 Calculate Returns** tab:
1. Enter the total amount you have now
2. Click **"🧮 Calculate Distribution"**

**Example:**
- You invested: 350 KWD (Alex 200 + Dan 150)
- You have now: 450 KWD
- Gained: 100 KWD

**Fair Distribution:**
- Alex gets: 57.14% × 450 KWD = 257.14 KWD ✅
- Dan gets: 42.86% × 450 KWD = 192.86 KWD ✅
- Total: 450 KWD distributed

### 5. View Transaction History
In the **📜 History** tab:
- See all contributions with dates
- Shows contribution amount for each payment

### 6. Export Data
- **Export JSON** - Full data with all details
- **Export CSV** - Spreadsheet format

## How the Math Works

### Contribution Percentage
```
Alex: 200 KWD / 350 KWD total = 57.14%
Dan: 150 KWD / 350 KWD total = 42.86%
```

### Return Distribution
When you have 450 KWD from 350 KWD invested:
```
Alex: 57.14% × 450 KWD = 257.14 KWD
Dan: 42.86% × 450 KWD = 192.86 KWD
```

**Important:** Distribution is based on **initial contribution percentage**, not equal split!

## File Locations

- `index.html` - Main app interface with PWA meta tags
- `styles.css` - Beautiful responsive design with custom color variables
- `app.js` - All tracking logic with service worker registration
- `manifest.json` - PWA manifest for iPhone installation
- `sw.js` - Service worker for offline functionality
- `README.md` - This documentation file

## Data Storage

- All data is stored **locally** in your browser
- Data persists between browser sessions
- No internet required
- No data sent to any server
- Clear browser cache to delete data

## Example Use Case

**Your Investment Fund with Friends:**

**Month 1 Contributions:**
- Alex: 150 KWD
- Dan: 50 KWD
- Total: 200 KWD

**Month 2 More Contributions:**
- Alex: 50 KWD
- Dan: 100 KWD
- New totals: Alex 200 KWD, Dan 150 KWD
- Total invested: 350 KWD

**After 6 Months:**
- Your investment grew to 450 KWD
- Calculate fair returns using the app
- Alex gets 257.14 KWD (including his profit share)
- Dan gets 192.86 KWD (including his profit share)

## Tips

💡 Add contributions as they happen each month  
💡 Create separate groups for different investments  
💡 Export data before major changes  
💡 Use percentages to verify fairness  
💡 Works best with 2-5 people per investment

## Browser Support

- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile browsers ✅

---

**Made for transparent and fair investment tracking** 💼
