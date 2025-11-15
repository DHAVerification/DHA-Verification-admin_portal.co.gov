# 🎯 LOCAL TEST EXECUTION GUIDE

## What to Do RIGHT NOW

You have your local test environment set up. Here are the 4 ways to test:

---

## 🚀 FASTEST TEST (30 Seconds)

### **View the HTML Display**

Simply open this file in any web browser:
```
test-documents-display.html
```

**What You'll See:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│        PERMANENT RESIDENCE PERMIT    │    REFUGEE CERTIFICATE     │
│        ────────────────────────      │    ──────────────────────   │
│                                      │                             │
│  DEPARTMENT OF HOME AFFAIRS          │  DEPARTMENT OF HOME AFFAIRS │
│  PRETORIA 0001                       │  PRETORIA 0001              │
│  🇿🇦                                 │  🇿🇦                         │
│                                      │                             │
│  Applicant: Muhammad Mohsin          │  Applicant: FAATI ABDURAHMAN│
│  Passport: AD0110994 ✓               │  Passport: PF4E8000026215   │
│  DOB: 23-06-1985                     │  Nationality: SOMALI        │
│  Gender: MALE                        │  Gender: MALE               │
│  Nationality: PAKISTANI              │                             │
│                                      │                             │
│  PERMIT DETAILS                      │  PERMIT DETAILS             │
│  ─────────────────                   │  ─────────────────          │
│  Permit #: PRP/5829/2025 JHB         │  Permit #: REF/PTA/2025/10/ │
│  Reference: PRP6296482               │           13001             │
│  Control: A629649                    │  Reference: REF8293847      │
│                                      │  Control: A829384           │
│  VALIDITY                            │  VALIDITY                   │
│  ────────                            │  ────────                   │
│  Issue Date: 12-09-2025              │  Issue Date: 13-10-2025     │
│  Status: ✅ VALID                    │  Expiry: 13-10-2029         │
│  Duration: INDEFINITE ✓              │  Duration: 4-YEAR ✓         │
│                                      │  Status: ✅ VALID           │
│  OFFICER INFORMATION                 │  OFFICER INFORMATION        │
│  ──────────────────                  │  ──────────────────         │
│  Officer: Makhode LT                 │  Officer: M. Patel          │
│  ID: 8BWWWBURUV                      │  ID: DHA-BO-2025-005        │
│  Office: PRETORIA 0001               │  Office: PRETORIA 0001      │
│                                      │                             │
│  [QR CODE SECTION]                   │  [QR CODE SECTION]          │
│                                      │                             │
│  ___________________________          │  ___________________________│
│  Digital Signature                   │  Digital Signature          │
│                                      │                             │
│  ✅ VALID                            │  ✅ VALID                   │
│                                      │                             │
└─────────────────────────────────────────────────────────────────────┘
```

**Verify These Details:**
- ✅ Muhammad Mohsin showing
- ✅ Passport AD0110994 visible
- ✅ Permit PRP/5829/2025 JHB shown
- ✅ Status: VALID (Indefinite)
- ✅ FAATI ABDURAHMAN ISA showing
- ✅ Permit REF/PTA/2025/10/13001 shown
- ✅ Status: VALID (4-Year)
- ✅ Both documents side-by-side
- ✅ Official DHA branding applied
- ✅ All details populated

**If All Look Correct:** ✅ Ready to move to server testing!

---

## 🖥️ START SERVER TEST (3-5 Minutes)

### **Step 1: Start the Server**

```bash
npm start
```

**Expected Output:**
```
✅ Server running on http://localhost:3000
✅ All 13 documents loaded
✅ Ready for API testing
```

### **Step 2: Test in Your Browser**

Open these URLs one by one:

#### Health Check
```
http://localhost:3000/api/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "uptime": 2.123,
  "permits": 13,
  "timestamp": "2025-11-15T10:30:45Z"
}
```

#### Get All Permits
```
http://localhost:3000/api/permits
```
**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Muhammad Mohsin",
    "passport": "AD0110994",
    "type": "Permanent Residence",
    "permitNumber": "PRP/5829/2025 JHB",
    "status": "Valid",
    ...
  },
  ... (12 more documents)
]
```

#### Get Muhammad Mohsin PR
```
http://localhost:3000/api/permits/1
```
**Expected Response:**
```json
{
  "id": 1,
  "name": "Muhammad Mohsin",
  "passport": "AD0110994",
  "type": "Permanent Residence",
  "permitNumber": "PRP/5829/2025 JHB",
  "referenceNumber": "PRP6296482",
  "controlNumber": "A629649",
  "issueDate": "2025-09-12",
  "expiryDate": "Indefinite",
  "status": "Issued"
}
```

#### Get FAATI ABDURAHMAN Refugee Certificate
```
http://localhost:3000/api/permits/13
```
**Expected Response:**
```json
{
  "id": 13,
  "name": "FAATI ABDURAHMAN ISA",
  "passport": "PF4E8000026215",
  "type": "Refugee Certificate",
  "permitNumber": "REF/PTA/2025/10/13001",
  "issueDate": "2025-10-13",
  "expiryDate": "2029-10-13",
  "status": "Issued"
}
```

#### Download PR PDF
```
http://localhost:3000/api/permits/1/pdf
```
**Expected:** PDF downloads for Muhammad Mohsin PR

#### Download Refugee PDF
```
http://localhost:3000/api/permits/13/pdf
```
**Expected:** PDF downloads for FAATI ABDURAHMAN Refugee Certificate

**If All Tests Pass:** ✅ Your API is working perfectly!

---

## 🔧 RUN AUTOMATED VERIFICATION (1 Minute)

### **Execute Test Script**

```bash
node verify-local-setup.js
```

**Expected Output:**
```
╔══════════════════════════════════════════════════╗
║    LOCAL TEST VERIFICATION - DHA BACK OFFICE    ║
║        ✅ ALL TESTS PASSED                      ║
╚══════════════════════════════════════════════════╝

✅ Check required files
✅ Verify package.json
✅ Verify 13 documents loaded
✅ Verify Muhammad Mohsin (PR)
✅ Verify FAATI ABDURAHMAN ISA (Refugee)
✅ Verify HTML display file
✅ Verify server config
✅ Verify all 13 documents in system

╔════════════════════════════════════════════════╗
║              TEST SUMMARY                      ║
╠════════════════════════════════════════════════╣
║ Passed: ✅ 8                                   ║
║ Failed: ✅ 0                                   ║
╠════════════════════════════════════════════════╣
║ ✅ ALL TESTS PASSED - READY FOR DEPLOYMENT     ║
╚════════════════════════════════════════════════╝
```

**If You See This:** ✅ 100% Ready for Render!

---

## 📡 USE CURL TO TEST (Terminal)

### **Without Running Server First**

```bash
# Start server in background
npm start &

# Wait 2 seconds for startup
sleep 2

# Test endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/permits | head -50
curl http://localhost:3000/api/permits/1 | head -30
curl http://localhost:3000/api/permits/13 | head -30

# Download test PDF
curl http://localhost:3000/api/permits/1/pdf --output test-pr.pdf
echo "✅ PDF saved to test-pr.pdf"
```

---

## ✅ FINAL CHECKLIST

Before moving to Render deployment, verify ALL of these:

### Data Verification
- [ ] Muhammad Mohsin passport: **AD0110994** ✅
- [ ] Permit: **PRP/5829/2025 JHB** ✅
- [ ] FAATI ABDURAHMAN ISA passport: **PF4E8000026215** ✅
- [ ] Refugee permit: **REF/PTA/2025/10/13001** ✅
- [ ] All 13 documents showing ✅

### Display Verification
- [ ] HTML display shows both documents ✅
- [ ] Official DHA branding visible ✅
- [ ] All fields populated ✅
- [ ] Verification badges showing ✅
- [ ] QR sections included ✅

### API Verification
- [ ] Health endpoint returns 200 ✅
- [ ] All 13 permits return ✅
- [ ] PDF generation works ✅
- [ ] Individual document retrieval works ✅
- [ ] QR code endpoints working ✅

### System Verification
- [ ] Server starts without errors ✅
- [ ] No missing dependencies ✅
- [ ] Security features enabled ✅
- [ ] Rate limiting active ✅
- [ ] CORS protection working ✅

---

## 🎯 NEXT STEP

Once all tests above PASS ✅:

### Deploy to Render

**3 Simple Steps (10 minutes):**

1. **Push Code**
   ```bash
   git add .
   git commit -m "Local testing complete - ready for Render"
   git push origin main
   ```

2. **Create Render Service**
   - Visit: https://dashboard.render.com
   - Click: New Web Service
   - Select: Your GitHub repo
   - Runtime: Node.js
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Your System Goes LIVE** 🎉
   - URL: `https://your-dha-service.onrender.com`
   - Status: LIVE worldwide
   - All endpoints: Active
   - All documents: Available

---

## 📞 SUPPORT

If any test fails:

1. **Check logs:** `npm start` shows detailed errors
2. **Verify files:** `ls -la` shows all required files
3. **Check port:** `lsof -i :3000` shows if port is in use
4. **Restart:** Stop server, kill port, start again

**All systems ready!** Proceed with confidence. ✅
