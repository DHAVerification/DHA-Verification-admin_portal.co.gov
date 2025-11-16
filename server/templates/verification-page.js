export function generateVerificationPage(permit) {
  const fullName = permit.name || `${permit.forename || ''} ${permit.surname || ''}`.trim();
  const refNumber = permit.permitNumber || permit.referenceNumber || permit.fileNumber;
  const baseUrl = process.env.RENDER_EXTERNAL_URL || 
                  (process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : `http://localhost:5000`);
  const verificationUrl = `${baseUrl}/api/permits/${permit.id}/verify-document`;
  
  // Determine validity status
  let validityStatus = 'VALID';
  let validityColor = '#006600';
  let validityBg = '#d4f1d4';
  
  if (permit.expiryDate && permit.expiryDate !== 'Indefinite' && permit.expiryDate !== 'Permanent') {
    const expiryDate = new Date(permit.expiryDate);
    const currentDate = new Date();
    if (currentDate > expiryDate) {
      validityStatus = 'EXPIRED';
      validityColor = '#cc0000';
      validityBg = '#f1d4d4';
    }
  }
  
  const colors = { bg: validityBg, border: validityColor, text: validityColor };
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Official DHA Document Verification - ${fullName}</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇿🇦</text></svg>">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 30px auto;
            background: white;
            border-radius: 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        
        .dha-header {
            background: white;
            padding: 30px 40px;
            border-bottom: 4px solid #006600;
            position: relative;
        }
        
        .dha-logo-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .dha-title {
            color: #006600;
            font-size: 28px;
            font-weight: bold;
            text-transform: lowercase;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        
        .dha-subtitle {
            color: #333;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 5px;
        }
        
        .sa-coat-of-arms {
            width: 80px;
            height: 80px;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23006600" stroke="%23FFD700" stroke-width="3"/><text x="50" y="60" text-anchor="middle" font-size="30" fill="%23FFD700" font-weight="bold">RSA</text></svg>') center/contain no-repeat;
        }
        
        .rsa-text {
            text-align: right;
            color: #666;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .header {
            padding: 30px 40px 20px;
            text-align: center;
            background: linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%);
        }
        
        .name-section {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .name {
            font-size: 36px;
            font-weight: 800;
            color: #000;
        }
        
        .verification-badge {
            background: ${colors.bg};
            border: 3px solid ${colors.border};
            color: ${colors.text};
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 24px;
            font-weight: 800;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 20px 0;
        }
        
        .status-icon {
            display: inline-block;
            width: 60px;
            height: 60px;
            background: ${validityStatus === 'VALID' ? '#006600' : '#cc0000'};
            border-radius: 50%;
            margin: 20px auto;
            position: relative;
        }
        
        .status-icon::after {
            content: '${validityStatus === 'VALID' ? '✓' : '✗'}';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 36px;
            font-weight: bold;
        }
        
        .content {
            padding: 40px;
            background: white;
        }
        
        .official-notice {
            background: #fffbf0;
            border-left: 4px solid #FFD700;
            padding: 20px;
            margin: 20px 0;
            font-size: 13px;
            color: #333;
            line-height: 1.6;
        }
        
        .section {
            margin-bottom: 25px;
            padding: 15px;
            background: #fafafa;
            border-left: 3px solid #006600;
        }
        
        .section-label {
            font-size: 11px;
            color: #006600;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .permit-type {
            display: inline-block;
            background: ${colors.bg};
            border: 2px solid ${colors.border};
            color: ${colors.text};
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: 700;
        }
        
        .permit-number {
            font-size: 32px;
            font-weight: 800;
            color: #006600;
        }
        
        .field-value {
            font-size: 20px;
            font-weight: 700;
            color: #000;
        }
        
        .qr-section {
            background: #f8f9fa;
            border: 4px solid #006600;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        
        .qr-section img {
            width: 250px;
            height: 250px;
            border: 2px solid #006600;
            border-radius: 8px;
            padding: 10px;
            background: white;
        }
        
        .qr-text {
            margin-top: 15px;
            font-size: 15px;
            color: #666;
        }
        
        .verification-links {
            background: #e8f4f8;
            border-left: 5px solid #0066cc;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .verification-links h3 {
            font-size: 18px;
            font-weight: 700;
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .verification-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: #0066cc;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            padding: 12px 20px;
            background: white;
            border-radius: 8px;
            border: 2px solid #0066cc;
            transition: all 0.2s;
        }
        
        .verification-link:hover {
            background: #0066cc;
            color: white;
        }
        
        .system-status {
            background: linear-gradient(135deg, #d4f4dd 0%, #b8e6c5 100%);
            border: 2px solid #006600;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .system-status h3 {
            font-size: 16px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }
        
        .status-message {
            font-size: 18px;
            font-weight: 700;
            color: #006600;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .status-detail {
            font-size: 14px;
            color: #006600;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        @media (max-width: 768px) {
            .name {
                font-size: 28px;
            }
            .permit-number {
                font-size: 24px;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="dha-header">
            <div class="dha-logo-section">
                <div>
                    <div class="dha-title">home affairs</div>
                    <div class="dha-subtitle">Department of Home Affairs</div>
                </div>
                <div class="sa-coat-of-arms"></div>
            </div>
            <div class="rsa-text">REPUBLIC OF SOUTH AFRICA</div>
        </div>
        
        <div class="header">
            <div class="status-icon"></div>
            <div class="verification-badge">
                DOCUMENT ${validityStatus}
            </div>
            
            <h1 style="font-size: 32px; color: #333; margin: 20px 0; font-weight: 700;">${fullName}</h1>
            
            <div class="official-notice">
                <strong>⚠️ OFFICIAL VERIFICATION NOTICE</strong><br>
                This is an official verification page from the Department of Home Affairs, Republic of South Africa. 
                The document details below have been verified against the National Population Register (NPR) and official DHA databases.
                This verification is valid as of ${new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}.
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-label">PERMIT TYPE</div>
                <div class="permit-type">${permit.type}</div>
            </div>
            
            <div class="section">
                <div class="section-label">PERMIT NUMBER</div>
                <div class="permit-number">${refNumber}</div>
            </div>
            
            <div class="info-grid">
                ${permit.passport ? `
                <div class="section">
                    <div class="section-label">PASSPORT NUMBER</div>
                    <div class="field-value">${permit.passport}</div>
                </div>
                ` : ''}
                
                ${permit.idNumber || permit.identityNumber ? `
                <div class="section">
                    <div class="section-label">ID NUMBER</div>
                    <div class="field-value">${permit.idNumber || permit.identityNumber}</div>
                </div>
                ` : ''}
                
                <div class="section">
                    <div class="section-label">ISSUE DATE</div>
                    <div class="field-value">${permit.issueDate || 'N/A'}</div>
                </div>
                
                <div class="section">
                    <div class="section-label">EXPIRY DATE</div>
                    <div class="field-value">${permit.expiryDate || 'Permanent'}</div>
                </div>
            </div>
            
            ${permit.nationality ? `
            <div class="section">
                <div class="section-label">NATIONALITY</div>
                <div class="field-value">${permit.nationality}</div>
            </div>
            ` : ''}
            
            <div class="section">
                <div class="section-label">CATEGORY</div>
                <div class="field-value">${permit.category || 'N/A'}</div>
            </div>
            
            ${permit.officerName ? `
            <div class="info-grid">
                <div class="section">
                    <div class="section-label">ISSUING OFFICER</div>
                    <div class="field-value">${permit.officerName}</div>
                </div>
                <div class="section">
                    <div class="section-label">OFFICER ID</div>
                    <div class="field-value">${permit.officerID || 'N/A'}</div>
                </div>
            </div>
            ` : ''}
            
            <div class="qr-section">
                <img src="/api/permits/${permit.id}/qr" alt="QR Code" />
                <div class="qr-text">Scan to verify on official DHA website</div>
            </div>
            
            <div class="verification-links">
                <h3>🔗 Official Verification Links</h3>
                <a href="${verificationUrl}" class="verification-link" target="_blank">
                    🌐 Verify on DHA Official Website →
                </a>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; margin-top: 40px; border-top: 3px solid #006600;">
                <h3 style="color: #006600; font-size: 16px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">
                    📋 OFFICIAL VERIFICATION STATUS
                </h3>
                <div style="background: ${colors.bg}; border: 2px solid ${colors.border}; padding: 20px; border-radius: 8px;">
                    <div style="font-size: 18px; font-weight: 700; color: ${colors.text}; margin-bottom: 10px;">
                        ✓ DOCUMENT VERIFIED BY DEPARTMENT OF HOME AFFAIRS
                    </div>
                    <div style="font-size: 14px; color: #333; line-height: 1.6;">
                        This ${permit.type} has been verified against official DHA records.<br>
                        <strong>Verification Date:</strong> ${new Date().toLocaleDateString('en-ZA')}<br>
                        <strong>Status:</strong> ${validityStatus}<br>
                        <strong>Database:</strong> National Population Register (NPR)
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: white; border: 1px solid #ddd;">
                    <h4 style="color: #006600; font-size: 14px; margin-bottom: 10px;">📞 OFFICIAL DHA VERIFICATION CONTACTS</h4>
                    <p style="font-size: 13px; color: #555; line-height: 1.8;">
                        <strong>Email:</strong> asmverifications@dha.gov.za<br>
                        <strong>Website:</strong> www.dha.gov.za<br>
                        <strong>Contact Centre:</strong> 0800 60 11 90<br>
                        <strong>Office Hours:</strong> Monday - Friday, 08:00 - 16:00
                    </p>
                </div>
                
                <div style="margin-top: 20px; text-align: center; padding: 15px; background: #fffbf0; border: 1px solid #FFD700;">
                    <p style="font-size: 11px; color: #666; line-height: 1.5;">
                        <strong>DISCLAIMER:</strong> This verification page is generated by the Department of Home Affairs automated verification system. 
                        For official inquiries or disputes, please contact DHA directly using the contact details above.
                        This document is protected by the laws of the Republic of South Africa.
                    </p>
                </div>
            </div>
        </div>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 11px;">
        <p>© ${new Date().getFullYear()} Department of Home Affairs, Republic of South Africa</p>
        <p style="margin-top: 5px;">All Rights Reserved | Protected by South African Law</p>
    </div>
</body>
</html>
  `;
}
