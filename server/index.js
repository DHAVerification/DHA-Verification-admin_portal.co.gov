
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import QRCode from 'qrcode';
import puppeteer from 'puppeteer';
import { config, validateConfig, logConfigStatus } from './config/secrets.js';
import { getAllPermits, findPermitByNumber, getPermitCount } from './services/permit-service.js';
import permitsRouter from './routes/permits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

validateConfig();
logConfigStatus();

const app = express();
const PORT = config.port;

// Security & Performance Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Trust proxy for Replit environment
app.set('trust proxy', 1);

// Serve static files with proper headers
app.use('/public', express.static(path.join(__dirname, '../attached_assets'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));


// Root route - serve main back office interface
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../attached_assets/dha-back-office-complete_1763210930331.html'));
});

// Admin dashboard route
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../attached_assets/admin-dashboard_1763210930330.html'));
});

// User profile route
app.get('/user-profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../attached_assets/user-profile_1763210930330.html'));
});

// ID Card route
app.get('/id-card', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../attached_assets/id-card.html'));
});

// Permanent Residence route
app.get('/permanent-residence', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../attached_assets/permanent-residence_1763213840475.html'));
});

// Travel Document route
app.get('/travel-document', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../attached_assets/travel-document_1763213840475.html'));
});

// E-Visa route
app.get('/e-visa', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../attached_assets/e-visa_1763213840475.html'));
});

// Permit Profile route
app.get('/permit-profile', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../attached_assets/permit-profile.html'));
});

// Use permits router
app.use('/api/permits', permitsRouter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const permitCount = await getPermitCount();
  const { apiHealthMonitor } = await import('./services/api-health-monitor.js');
  const apiHealth = apiHealthMonitor.getHealthReport();
  
  res.json({
    status: 'ok',
    service: 'DHA Back Office',
    permits: permitCount,
    environment: config.env,
    productionMode: config.production.useProductionApis,
    forceRealApis: config.production.forceRealApis,
    verificationLevel: config.production.verificationLevel,
    apiHealth: apiHealth,
    dataSource: apiHealthMonitor.isHealthy() ? 'DHA Production APIs' : 'Verified Fallback Data',
    timestamp: new Date().toISOString()
  });
});

// Validate permit endpoint
app.post('/api/validate-permit', async (req, res) => {
  const { permitNumber } = req.body;
  const permit = await findPermitByNumber(permitNumber);
  
  if (permit) {
    res.json({
      success: true,
      valid: true,
      permit: permit,
      verifiedBy: config.production.verificationLevel,
      realTimeValidation: config.production.realTimeValidation
    });
  } else {
    res.json({
      success: true,
      valid: false,
      message: 'Permit not found in DHA database'
    });
  }
});

// Generate PDF for permit
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { permitData } = req.body;
    
    if (!permitData) {
      return res.status(400).json({ success: false, message: 'No permit data provided' });
    }

    // Generate QR code for verification
    const verificationUrl = `https://dha.gov.za/verify/${permitData.permitNumber || permitData.referenceNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

    // Generate digital signature
    const signatureData = JSON.stringify({
      permitNumber: permitData.permitNumber || permitData.referenceNumber,
      name: permitData.name,
      issueDate: permitData.issueDate
    });
    const signature = crypto
      .createHmac('sha256', config.document.signingKey)
      .update(signatureData)
      .digest('hex');

    // Create HTML template for PDF
    const htmlTemplate = generatePermitHTML(permitData, qrCodeDataUrl, signature);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: config.puppeteer.executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${permitData.type}_${permitData.permitNumber || permitData.referenceNumber}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF', error: error.message });
  }
});

function generatePermitHTML(permit, qrCode, signature) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .header { background: linear-gradient(135deg, #004d00 0%, #006600 100%); color: white; padding: 20px; border-bottom: 4px solid #FFD700; }
    .flag-strip { background: linear-gradient(to right, #007749 33%, #FFD700 33%, #FFD700 66%, #DE3831 66%); height: 8px; }
    .seal { width: 80px; height: 80px; border: 3px solid #FFD700; border-radius: 50%; background: white; display: inline-block; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; color: rgba(0, 102, 0, 0.05); z-index: -1; white-space: nowrap; }
    .content { margin-top: 30px; }
    .field { margin: 15px 0; }
    .label { font-weight: bold; color: #006600; text-transform: uppercase; font-size: 11px; }
    .value { font-size: 14px; padding: 5px 0; }
    .qr-section { margin-top: 30px; text-align: center; }
    .signature { margin-top: 30px; padding: 15px; background: #f0f0f0; border-left: 4px solid #006600; font-family: monospace; font-size: 10px; word-break: break-all; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #006600; text-align: center; font-size: 10px; color: #666; }
  </style>
</head>
<body>
  <div class="watermark">DEPARTMENT OF HOME AFFAIRS</div>
  
  <div class="flag-strip"></div>
  <div class="header">
    <div class="seal"></div>
    <h1 style="display: inline-block; margin-left: 20px;">DEPARTMENT OF HOME AFFAIRS</h1>
    <p>Republic of South Africa</p>
    <h2>${permit.type}</h2>
  </div>

  <div class="content">
    <div class="field">
      <div class="label">Permit Number</div>
      <div class="value" style="font-size: 18px; font-weight: bold; color: #006600;">${permit.permitNumber || permit.referenceNumber}</div>
    </div>

    <div class="field">
      <div class="label">Full Name</div>
      <div class="value">${permit.name || permit.surname + ' ' + permit.forename}</div>
    </div>

    ${permit.passport ? `
    <div class="field">
      <div class="label">Passport Number</div>
      <div class="value">${permit.passport}</div>
    </div>` : ''}

    ${permit.idNumber || permit.identityNumber ? `
    <div class="field">
      <div class="label">ID Number</div>
      <div class="value">${permit.idNumber || permit.identityNumber}</div>
    </div>` : ''}

    <div class="field">
      <div class="label">Nationality</div>
      <div class="value">${permit.nationality}</div>
    </div>

    <div class="field">
      <div class="label">Issue Date</div>
      <div class="value">${permit.issueDate}</div>
    </div>

    <div class="field">
      <div class="label">Expiry Date</div>
      <div class="value">${permit.expiryDate}</div>
    </div>

    <div class="field">
      <div class="label">Category</div>
      <div class="value">${permit.category}</div>
    </div>
  </div>

  <div class="qr-section">
    <img src="${qrCode}" width="150" height="150" />
    <p style="font-size: 10px; margin-top: 10px;">Scan to verify document authenticity</p>
  </div>

  <div class="signature">
    <strong>Digital Signature:</strong><br/>
    ${signature}
  </div>

  <div class="footer">
    <p>This is an official government document issued by the Department of Home Affairs, Republic of South Africa</p>
    <p>Issued by: ${permit.officerName} (${permit.officerID})</p>
    <p>Document generated: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`;
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  const permitCount = await getPermitCount();
  console.log('========================================');
  console.log('🏛️  DHA BACK OFFICE SYSTEM');
  console.log('========================================');
  console.log(`🚀 Server: http://0.0.0.0:${PORT}`);
  console.log(`📊 Environment: ${config.env}`);
  console.log(`📄 Permits: ${permitCount}`);
  console.log(`✅ All ${permitCount} certificates available`);
  console.log(`🔒 Production mode: ${config.production.useProductionApis ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🔥 Force Real APIs: ${config.production.forceRealApis ? 'ENABLED' : 'DISABLED'}`);
  console.log(`📋 Validation API: ${config.production.realTimeValidation ? 'CONNECTED' : 'OFFLINE'}`);
  console.log(`🛡️  Security: QR Codes, Digital Signatures, Watermarks`);
  console.log(`🔐 Verification Level: ${config.production.verificationLevel}`);
  console.log('========================================');
});

export default app;
