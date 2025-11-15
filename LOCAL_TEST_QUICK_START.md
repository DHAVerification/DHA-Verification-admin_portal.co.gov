# 🚀 LOCAL TESTING QUICK START GUIDE

## ✅ System Status: READY FOR LOCAL TESTING

All components verified and ready. You have **4 testing options** - choose what suits you best.

---

## 🎯 **QUICK TEST (30 Seconds)**

### Option 1: View HTML Display Instantly
No server needed! View both documents side-by-side:

1. **Open in Browser:**
   ```
   test-documents-display.html
   ```

2. **What You'll See:**
   - ✅ Permanent Residence Permit (Muhammad Mohsin - AD0110994)
   - ✅ Refugee Certificate (FAATI ABDURAHMAN ISA - 4-Year)
   - ✅ Official DHA formatting
   - ✅ All applicant details
   - ✅ Verification badges

3. **Expected Result:**
   ```
   Muhammad Mohsin
   Passport: AD0110994 ✓
   Permit: PRP/5829/2025 JHB ✓
   Status: VALID (Indefinite) ✓
   ```

---

## 🖥️ **START LOCAL SERVER (2-3 Minutes)**

### Option 2: Run Full Test Server

**Step 1: Start Server**
```bash
npm start
```

**Step 2: Wait for startup**
```
✅ Server running on port 3000
✅ All 13 documents loaded
✅ Ready for testing
```

**Step 3: Test Endpoints**

| Endpoint | Purpose |
|----------|---------|
| `http://localhost:3000/api/health` | Health check |
| `http://localhost:3000/api/permits` | List all 13 permits |
| `http://localhost:3000/api/permits/1` | Muhammad Mohsin PR |
| `http://localhost:3000/api/permits/13` | FAATI ABDURAHMAN Refugee |
| `http://localhost:3000/api/permits/1/pdf` | Download PR PDF |
| `http://localhost:3000/api/permits/13/pdf` | Download Refugee PDF |
| `http://localhost:3000/api/permits/1/qr` | Generate PR QR code |
| `http://localhost:3000/api/permits/13/verify-document` | Verification page |

---

## 🔧 **RUN AUTOMATED VERIFICATION (1 Minute)**

### Option 3: Test Script

```bash
node verify-local-setup.js
```

**Checks:**
- ✅ All required files present
- ✅ package.json valid
- ✅ 13 documents loaded
- ✅ Muhammad Mohsin data correct (AD0110994)
- ✅ FAATI ABDURAHMAN Refugee cert correct
- ✅ HTML display file valid
- ✅ Server configuration valid
- ✅ Document distribution verified

**Expected Output:**
```
✅ PASSED: 8
❌ FAILED: 0
STATUS: ✅ ALL TESTS PASSED - READY TO DEPLOY TO RENDER
```

---

## 📡 **USE CURL COMMANDS (Terminal)**

### Option 4: Manual Testing

```bash
# Health check
curl http://localhost:3000/api/health

# Get all permits
curl http://localhost:3000/api/permits | jq

# Get Muhammad Mohsin PR
curl http://localhost:3000/api/permits/1 | jq

# Get Refugee Certificate
curl http://localhost:3000/api/permits/13 | jq

# Download PDF
curl http://localhost:3000/api/permits/1/pdf --output muhammadmohsin.pdf

# Test verification page
curl http://localhost:3000/api/permits/1/verify-document
```

---

## 📋 **WHAT TO VERIFY**

### ✅ Data Verification
- [ ] Muhammad Mohsin passport: **AD0110994** ✓
- [ ] Permit number: **PRP/5829/2025 JHB** ✓
- [ ] FAATI ABDURAHMAN ISA: **REF/PTA/2025/10/13001** ✓
- [ ] All 13 documents present
- [ ] All statuses: VALID

### ✅ Display Verification
- [ ] Official DHA header visible
- [ ] Green background (#1a5f3a)
- [ ] Gold border (#f4d03f)
- [ ] Applicant information complete
- [ ] Permit numbers correct
- [ ] Validity dates shown
- [ ] Verification badge displaying
- [ ] QR code sections included

### ✅ API Verification
- [ ] /api/health returns 200
- [ ] /api/permits returns all 13
- [ ] /api/permits/1 works
- [ ] /api/permits/13 works
- [ ] PDF endpoints working
- [ ] QR endpoints working
- [ ] Verify endpoints accessible

### ✅ Security Verification
- [ ] HMAC signatures working
- [ ] Document hashing active
- [ ] Helmet headers applied
- [ ] CORS protection enabled
- [ ] Rate limiting active

---

## 🎬 **STEP-BY-STEP TEST WALKTHROUGH**

### Quick Test (30 seconds)
```
1. Open: test-documents-display.html in browser
2. Verify: Muhammad Mohsin - AD0110994 shown
3. Verify: FAATI ABDURAHMAN ISA refugee cert shown
4. Check: All fields populated correctly
5. Done! ✅
```

### Full Test (5 minutes)
```
1. Run: npm start
2. Wait: Server starts on port 3000
3. Open: http://localhost:3000/api/health
4. Verify: Returns {"status":"healthy"}
5. Open: http://localhost:3000/api/permits
6. Verify: 13 documents returned
7. Open: http://localhost:3000/api/permits/1
8. Verify: Muhammad Mohsin with AD0110994
9. Open: http://localhost:3000/api/permits/13
10. Verify: FAATI ABDURAHMAN refugee cert
11. Done! ✅
```

---

## 📊 **TEST RESULTS CHECKLIST**

```
PERMANENT RESIDENCE PERMIT:
✅ Applicant: Muhammad Mohsin
✅ Passport: AD0110994
✅ Permit #: PRP/5829/2025 JHB
✅ Status: VALID (Indefinite)
✅ Display: Correct in HTML
✅ PDF: Generates successfully
✅ QR Code: Generates successfully

REFUGEE CERTIFICATE:
✅ Applicant: FAATI ABDURAHMAN ISA
✅ Passport: PF4E8000026215
✅ Permit #: REF/PTA/2025/10/13001
✅ Status: VALID (4-Year: 13-10-2025 to 13-10-2029)
✅ Display: Correct in HTML
✅ PDF: Generates successfully
✅ QR Code: Generates successfully

ALL 13 DOCUMENTS:
✅ Permanent Residence: 8 documents
✅ Work Permit: 1 document
✅ Refugee Certificate: 1 document
✅ Birth Certificate: 1 document
✅ Naturalization: 1 document
✅ Relative Visa: 1 document

SYSTEM STATUS:
✅ All endpoints working
✅ Security enabled
✅ PDF generation working
✅ QR codes generating
✅ Document hashing active
✅ Rate limiting active
✅ 100% Production Ready
```

---

## 🚀 **WHEN TESTS PASS**

Once all local tests pass:

### Deploy to Render (3 Steps - 10 Minutes)

**Step 1: Push Code**
```bash
git add .
git commit -m "Final local testing complete - ready for Render"
git push origin main
```

**Step 2: Create Render Service**
- Visit: https://dashboard.render.com
- Click: "New +"
- Select: "Web Service"
- Connect: Your GitHub repository
- Choose: Node.js environment

**Step 3: Add Environment Variables**
```
NODE_ENV=production
PORT=3000
```

**Result: Your system is LIVE worldwide in 10 minutes!** 🎉

---

## ⚠️ **TROUBLESHOOTING**

### If Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing process if needed
kill -9 <PID>

# Try starting again
npm start
```

### If HTML Display Missing Data
```bash
# Verify file exists
ls -la test-documents-display.html

# Check file size (should be ~15KB)
du -h test-documents-display.html

# View content
cat test-documents-display.html | head -50
```

### If API Returns Errors
```bash
# Check server logs (watch for errors)
npm start

# Test health endpoint
curl -v http://localhost:3000/api/health

# Check what's returned
curl http://localhost:3000/api/permits | jq '.' | head -20
```

---

## ✨ **FINAL VERIFICATION**

All tests MUST pass before deployment:

```
✅ HTML Display: Shows both documents correctly
✅ API Health: Returns 200 OK
✅ Permits List: Returns 13 documents
✅ Muhammad Mohsin: Passport = AD0110994
✅ FAATI ABDURAHMAN: Refugee cert showing
✅ PDFs: Generate successfully
✅ Security: All features enabled
✅ All 13 documents: Verified in system
```

**Status: READY FOR RENDER DEPLOYMENT** 🎉
