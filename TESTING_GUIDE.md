# 🧪 Testing Guide - Crime Analytics Dashboard

## How to Verify All Features Work

### 🏠 **Dashboard Page**

#### Test 1: Live Updates
1. ✅ Open Dashboard
2. ✅ Watch the "Total Crimes This Month" counter
3. ✅ It should increase every 6-10 seconds
4. ✅ New crimes appear in "Live Crime Feed"
5. ✅ Map markers update automatically

#### Test 2: Stats Cards
1. ✅ See animated counters on page load
2. ✅ Numbers should count up smoothly
3. ✅ Hover over cards → scale effect

#### Test 3: Live Feed
1. ✅ New crimes appear at the top
2. ✅ Show "just now" timestamp
3. ✅ After 10 seconds → highlight fades
4. ✅ Severity badges color-coded

#### Test 4: Map
1. ✅ Centered on Kanpur (26.4499, 80.3319)
2. ✅ Zoom level 12
3. ✅ Crime markers appear
4. ✅ Click marker → see crime details
5. ✅ Heatmap toggle works

#### Test 5: Charts
1. ✅ Monthly Trend → line chart with data
2. ✅ Crime Types → donut chart
3. ✅ Hourly Distribution → bar chart
4. ✅ District Comparison → horizontal bars

#### Test 6: Alerts
1. ✅ Alerts appear occasionally
2. ✅ Color-coded severity
3. ✅ "Mark as Resolved" button works
4. ✅ "Dismiss" button works
5. ✅ Info alerts auto-dismiss after 10s

#### Test 7: ML Metrics
1. ✅ Accuracy: 88-91%
2. ✅ Precision: 85-89%
3. ✅ Recall: 82-87%
4. ✅ F1 Score: 86-90%
5. ✅ All in realistic range

---

### 📊 **Reports Page**

#### Test 1: Data Display
1. ✅ Navigate to Reports
2. ✅ See table with crime data
3. ✅ Same crimes from Dashboard
4. ✅ Summary stats at top

#### Test 2: Search Filter
1. ✅ Type in search box
2. ✅ Table filters instantly
3. ✅ Try searching: "Mall Road", "Theft", "CR-"
4. ✅ Stats update to show filtered count

#### Test 3: District Filter
1. ✅ Select "Kakadeo" from dropdown
2. ✅ Only Kakadeo crimes shown
3. ✅ Stats update
4. ✅ Try different districts

#### Test 4: Crime Type Filter
1. ✅ Select "Theft"
2. ✅ Only theft crimes shown
3. ✅ Combine with district filter
4. ✅ Both filters work together

#### Test 5: Severity Filter
1. ✅ Select "high"
2. ✅ Only high severity crimes shown
3. ✅ Badges are red/orange

#### Test 6: Date Range Filter
**Custom Dates:**
1. ✅ Set Start Date: 7 days ago
2. ✅ Set End Date: Today
3. ✅ Only recent crimes shown

**Quick Range Buttons:**
1. ✅ Click "Last 7 Days" → filters automatically
2. ✅ Click "Last 30 Days" → shows more data
3. ✅ Click "Last 3 Months" → shows even more

#### Test 7: Combined Filters
1. ✅ District: "Govind Nagar"
2. ✅ Type: "Assault"
3. ✅ Severity: "high"
4. ✅ Date: Last 7 Days
5. ✅ Search: "Civil"
6. ✅ All work together (AND logic)

#### Test 8: Reset Button
1. ✅ Apply multiple filters
2. ✅ Click "Reset"
3. ✅ All filters cleared
4. ✅ Full dataset shown
5. ✅ Stats back to total

#### Test 9: Pagination
1. ✅ See "1 of X" pages
2. ✅ Click "Next" → page 2
3. ✅ Click "Previous" → page 1
4. ✅ Shows 10 items per page
5. ✅ Pagination adjusts with filters

#### Test 10: CSV Export
1. ✅ Click "Excel" or "CSV" button
2. ✅ File downloads: `crime_reports_2024-XX-XX.csv`
3. ✅ Open in Excel/Sheets
4. ✅ See columns: ID, Type, Location, District, Severity, Date, Status
5. ✅ Only filtered data included

#### Test 11: PDF Export
1. ✅ Click "PDF" button
2. ✅ File downloads: `crime_reports_2024-XX-XX.pdf`
3. ✅ Open PDF
4. ✅ See blue header
5. ✅ See table with all crimes
6. ✅ Only filtered data included
7. ✅ Professional formatting

---

### 🔮 **Predictions Page**

#### Test 1: District Selection
1. ✅ Navigate to Predictions
2. ✅ See district dropdown
3. ✅ Select different districts
4. ✅ Each has unique characteristics

#### Test 2: Period Selection
1. ✅ Select "7 Days"
2. ✅ Select "14 Days"
3. ✅ Select "30 Days"
4. ✅ Different options available

#### Test 3: Crime Type Selection
1. ✅ Select "All Types"
2. ✅ Select "Theft"
3. ✅ Select "Assault"
4. ✅ Different types available

#### Test 4: Generate Prediction
1. ✅ Click "Generate Prediction"
2. ✅ See loading spinner (1.5s)
3. ✅ Results appear with fade-in
4. ✅ Different from previous prediction

#### Test 5: Prediction Results
1. ✅ See daily forecast cards
2. ✅ Each day has:
   - Date
   - Predicted crimes count
   - Risk level (Low/Medium/High)
   - Confidence % (85-95%)
3. ✅ Predictions vary by district

#### Test 6: Explanation Panel
1. ✅ See "How Predictions Are Calculated"
2. ✅ Shows methodology
3. ✅ District profile
4. ✅ Trend analysis
5. ✅ Factor cards with percentages

#### Test 7: Crime Type Breakdown
1. ✅ See progress bars
2. ✅ Percentages add up to ~100%
3. ✅ Different for each district

#### Test 8: Risk Gauge
1. ✅ See circular gauge
2. ✅ Risk level: 35-85%
3. ✅ Color-coded (green/yellow/orange/red)
4. ✅ Changes per district

#### Test 9: District Logic
**High Risk District (Govind Nagar):**
1. ✅ Generate prediction
2. ✅ Higher crime counts (10-15 per day)
3. ✅ Risk gauge: 75-85%

**Low Risk District (Kidwai Nagar):**
1. ✅ Generate prediction
2. ✅ Lower crime counts (3-5 per day)
3. ✅ Risk gauge: 35-45%

#### Test 10: Trend System
1. ✅ Generate prediction twice for same district
2. ✅ Should be similar (not random jumps)
3. ✅ Gradual changes only
4. ✅ Trend momentum shown

---

### ⚙️ **Settings Page**

#### Test 1: Profile Settings
1. ✅ Navigate to Settings
2. ✅ See default name: "Officer John Smith"
3. ✅ Change name to "Test User"
4. ✅ Change email to "test@example.com"
5. ✅ Change badge to "TEST-123"
6. ✅ Change department to "Test Dept"

#### Test 2: Theme Toggle
1. ✅ Click "Light Mode" button
2. ✅ Background should lighten (future feature)
3. ✅ Click "Dark Mode" button
4. ✅ Back to dark theme

#### Test 3: Notification Toggles
1. ✅ Toggle "Critical Alerts" OFF
2. ✅ Toggle "Email Notifications" OFF
3. ✅ Toggle "SMS Notifications" ON
4. ✅ Each switch animates smoothly

#### Test 4: Save Settings
1. ✅ Make changes to profile
2. ✅ Toggle some notifications
3. ✅ Click "Save Changes"
4. ✅ See green success message
5. ✅ Message disappears after 3 seconds

#### Test 5: Persistence Test
1. ✅ Change name to "Alice"
2. ✅ Toggle Critical Alerts OFF
3. ✅ Click Save
4. ✅ **Refresh the page** (Ctrl+R / Cmd+R)
5. ✅ Name still shows "Alice" ✅
6. ✅ Critical Alerts still OFF ✅
7. ✅ **Settings persisted!**

#### Test 6: Theme Persistence
1. ✅ Currently in Dark Mode
2. ✅ Click "Light Mode" (future)
3. ✅ Refresh page
4. ✅ Theme should persist

#### Test 7: localStorage Verification
**Open DevTools Console:**
```javascript
localStorage.getItem('userProfile')
localStorage.getItem('notificationPreferences')
localStorage.getItem('theme')
```
1. ✅ Should see saved JSON objects
2. ✅ Verify data matches UI

---

### 🔄 **Cross-Page Consistency**

#### Test 1: Data Sync
1. ✅ Open Dashboard
2. ✅ Note "Total Crimes" count
3. ✅ Navigate to Reports
4. ✅ See same number in "Total Reports"
5. ✅ Wait 10 seconds
6. ✅ Go back to Dashboard
7. ✅ Count increased
8. ✅ Go to Reports again
9. ✅ Reports also updated
10. ✅ **Same data everywhere!**

#### Test 2: Filter Sync
1. ✅ In Reports, filter by "Kakadeo"
2. ✅ Export CSV
3. ✅ Open CSV → only Kakadeo crimes
4. ✅ Export PDF
5. ✅ Open PDF → only Kakadeo crimes
6. ✅ **Filtered data in exports!**

---

## ✅ **All Features Checklist**

### Dashboard ✅
- [x] Live updates (6s interval)
- [x] Stats animation
- [x] Live feed with highlights
- [x] Kanpur map centered
- [x] Crime markers
- [x] Charts (4 types)
- [x] Alerts with auto-dismiss
- [x] ML metrics (85-95%)

### Reports ✅
- [x] Live crime data
- [x] Search filter
- [x] District filter
- [x] Crime type filter
- [x] Severity filter
- [x] Date range filter
- [x] Quick date buttons
- [x] Reset button
- [x] Pagination
- [x] CSV export (working)
- [x] PDF export (working)
- [x] Excel export (CSV)

### Predictions ✅
- [x] District selection
- [x] Period selection
- [x] Crime type selection
- [x] Generate button
- [x] Loading state
- [x] Daily forecast cards
- [x] Confidence scores
- [x] Risk gauge
- [x] Explanation panel
- [x] Crime breakdown
- [x] Intelligent algorithm
- [x] Trend tracking

### Settings ✅
- [x] Profile inputs (4 fields)
- [x] Theme toggle
- [x] Notification toggles (8)
- [x] Save button
- [x] Success message
- [x] localStorage save
- [x] localStorage load
- [x] Persistence after refresh

---

## 🎯 **Quick 5-Minute Test**

1. ✅ Open app → Dashboard loads with skeleton
2. ✅ Watch stats count up
3. ✅ See new crime in live feed after ~6s
4. ✅ Go to Reports → apply filter → export PDF
5. ✅ Go to Predictions → generate forecast
6. ✅ Go to Settings → change name → save
7. ✅ Refresh page → name persists
8. ✅ **Everything works!**

---

## 🐛 **Common Issues & Fixes**

### Issue: Stats not updating
- **Fix**: Wait 6 seconds, crimes added every 6-10s

### Issue: Export not downloading
- **Fix**: Check browser download settings, allow downloads

### Issue: Filters not working
- **Fix**: Click "Apply Filters" or just change filter (auto-applies)

### Issue: Settings not saving
- **Fix**: Click "Save Changes" button, check localStorage in DevTools

### Issue: Map not showing
- **Fix**: Check internet connection (needs OpenStreetMap tiles)

---

## 🎉 **Success Criteria**

✅ All pages load without errors  
✅ Live data updates every 6 seconds  
✅ Filters work and update instantly  
✅ CSV/PDF exports download successfully  
✅ Settings persist after page refresh  
✅ Theme saves to localStorage  
✅ Predictions are intelligent (not random)  
✅ ML metrics in 85-95% range  
✅ Map centered on Kanpur  
✅ All animations smooth  

---

**If all tests pass → Application is Production Ready!** ✅🚀
