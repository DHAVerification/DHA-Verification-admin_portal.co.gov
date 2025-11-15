# 🎯 LOCAL TESTING - QUICK REFERENCE CARD

## Print This Page for Testing Reference

---

## ⚡ QUICK TEST (Pick One)

### HTML Display (30 sec)
```
Open: test-documents-display.html
See: Muhammad Mohsin PR + FAATI ABDURAHMAN Refugee
Done: Both showing correctly? ✅
```

### Server Test (5 min)
```
Run: npm start
Test: http://localhost:3000/api/health
Test: http://localhost:3000/api/permits
Test: http://localhost:3000/api/permits/1
Done: All working? ✅
```

### Automated (1 min)
```
Run: node verify-local-setup.js
See: 8 tests execute
Done: All PASSED? ✅
```

---

## 📋 VERIFICATION CHECKLIST

### Data Verification
- [ ] Muhammad Mohsin: AD0110994
- [ ] Permit: PRP/5829/2025 JHB
- [ ] FAATI ABDURAHMAN ISA: Showing
- [ ] Refugee permit: REF/PTA/2025/10/13001
- [ ] All 13 documents: Loaded

### Display Verification
- [ ] HTML opens correctly
- [ ] Both documents showing
- [ ] Official DHA branding
- [ ] All details visible
- [ ] Verification badges showing

### API Verification
- [ ] Health endpoint works
- [ ] Permits list returns 13
- [ ] Individual permits work
- [ ] PDFs generate
- [ ] No errors in console

---

## 🔧 QUICK COMMANDS

```bash
# View HTML display
open test-documents-display.html

# Start server
npm start

# Run verification
node verify-local-setup.js

# Show setup instructions
bash test-setup.sh

# Show this summary
bash LOCAL_TESTING_SUMMARY.sh

# Show checklist
bash TESTING_CHECKLIST.sh
```

---

## 🌐 TEST URLS

When server running on http://localhost:3000:

```
Health:              http://localhost:3000/api/health
All Permits:         http://localhost:3000/api/permits
Muhammad Mohsin:     http://localhost:3000/api/permits/1
FAATI ABDURAHMAN:    http://localhost:3000/api/permits/13
PR PDF:              http://localhost:3000/api/permits/1/pdf
Refugee PDF:         http://localhost:3000/api/permits/13/pdf
PR QR:               http://localhost:3000/api/permits/1/qr
Refugee QR:          http://localhost:3000/api/permits/13/qr
```

---

## 📊 TEST DATA REFERENCE

| Field | Document 1 | Document 13 |
|-------|-----------|-----------|
| Applicant | Muhammad Mohsin | FAATI ABDURAHMAN ISA |
| Passport | AD0110994 ✓ | PF4E8000026215 |
| Type | Permanent Residence | Refugee Certificate |
| Permit # | PRP/5829/2025 JHB | REF/PTA/2025/10/13001 |
| Status | VALID | VALID |
| Validity | Indefinite | 4-Year (to 13-10-2029) |
| Display | Left side | Right side |

---

## ✅ SUCCESS INDICATORS

| Test | Success Looks Like |
|------|-------------------|
| HTML | Both documents show side-by-side |
| API | Returns JSON with all fields |
| PDF | Downloads successfully |
| Server | No errors in logs |
| Automated | 8/8 tests PASSED |

---

## 🚀 NEXT STEP

After all tests pass ✅:

```bash
git push origin main
# Go to: https://dashboard.render.com
# Create: New Web Service
# Deploy: System LIVE in 10 min 🎉
```

---

## 📚 GUIDE REFERENCE

| Need | Read | Time |
|------|------|------|
| Quick start | READY_TO_TEST.md | 2 min |
| Options | LOCAL_TESTING_START_HERE.md | 5 min |
| Step-by-step | TEST_EXECUTION_GUIDE.md | 10 min |
| Reference | LOCAL_TEST_QUICK_START.md | 3 min |
| Navigation | LOCAL_TESTING_INDEX.md | 5 min |

---

## ⏱️ TIME ESTIMATES

| Activity | Time |
|----------|------|
| HTML test | 30 sec |
| Server test | 5 min |
| Automated test | 1 min |
| Full testing | 10 min |
| Render deploy | 10 min |
| **Total** | **20 min** |

---

## 🎯 RECOMMENDED PATH

1. **Start** (30 sec): Open test-documents-display.html
2. **Verify** (5 min): Run npm start and test APIs
3. **Confirm** (1 min): Run verify-local-setup.js
4. **Deploy** (10 min): Push to GitHub, create Render service
5. **Done** (✅): System LIVE worldwide

---

## 💾 FILE LOCATIONS

```
Test Files:
├── test-documents-display.html
├── verify-local-setup.js
├── test-setup.sh
└── test-local.sh

Guides:
├── LOCAL_TESTING_START_HERE.md
├── TEST_EXECUTION_GUIDE.md
├── LOCAL_TEST_QUICK_START.md
├── READY_TO_TEST.md
├── FILE_LOCATIONS.md
└── LOCAL_TESTING_INDEX.md

Data:
├── server/index.js
├── server/config/secrets.js
└── server/services/permit-service.js (13 documents)
```

---

## 🆘 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| HTML won't open | Right-click → Open With → Browser |
| npm start fails | Run: npm install |
| Port 3000 in use | Kill: lsof -i :3000, then kill -9 PID |
| API returns error | Check server logs for details |
| Tests fail | Read TEST_EXECUTION_GUIDE.md |

---

## 📞 QUICK HELP

- **Want overview?** → LOCAL_TESTING_START_HERE.md
- **Want steps?** → TEST_EXECUTION_GUIDE.md  
- **Want checklist?** → TESTING_CHECKLIST.sh
- **Want quick ref?** → LOCAL_TEST_QUICK_START.md
- **Can't find file?** → FILE_LOCATIONS.md

---

**Status: ✅ READY TO TEST**

**Next: Pick a test method and execute** 👆
