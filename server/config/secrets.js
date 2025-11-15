export const config = {
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3000,
  
  production: {
    useProductionApis: process.env.USE_PRODUCTION_APIS === 'true',
    forceRealApis: process.env.FORCE_REAL_APIS === 'true',
    verificationLevel: process.env.VERIFICATION_LEVEL || 'high',
    realTimeValidation: process.env.REAL_TIME_VALIDATION === 'true'
  },

  document: {
    signingKey: process.env.DOCUMENT_SIGNING_KEY || 'dha-digital-signature-key-2025',
    encryptionKey: process.env.DOCUMENT_ENCRYPTION_KEY,
    pkiCertPath: process.env.PKI_CERTIFICATE_PATH,
    pkiPrivateKey: process.env.PKI_PRIVATE_KEY,
    pkiPublicKey: process.env.PKI_PUBLIC_KEY
  },

  api: {
    maxRetries: 2,
    retryDelay: 1000,
    timeout: 5000,
    bypassSslVerification: true
  },

  dha: {
    nprApiKey: process.env.DHA_NPR_API_KEY,
    dmsApiKey: process.env.DHA_DMS_API_KEY,
    visaApiKey: process.env.DHA_VISA_API_KEY,
    mcsApiKey: process.env.DHA_MCS_API_KEY,
    abisApiKey: process.env.DHA_ABIS_API_KEY,
    hanisApiKey: process.env.HANIS_API_KEY,
    nprCertKey: process.env.DHA_NPR_CERT_KEY,
    niisApiKey: process.env.NIIS_API_KEY
  },

  endpoints: {
    npr: process.env.DHA_NPR_ENDPOINT,
    dms: process.env.DHA_DMS_ENDPOINT,
    visa: process.env.DHA_VISA_ENDPOINT,
    mcs: process.env.DHA_MCS_ENDPOINT,
    abis: process.env.DHA_ABIS_ENDPOINT,
    hanis: process.env.HANIS_ENDPOINT,
    gwp: process.env.GWP_URL_ENDPOINT,
    cipc: process.env.CIPC_API_ENDPOINT,
    dhaBase: process.env.DHA_API_BASE_URL,
    sita: process.env.SITA_API_BASE_URL
  },

  icao: {
    pkdApiKey: process.env.ICAO_PKD_API_KEY,
    pkdBaseUrl: process.env.ICAO_PKD_BASE_URL,
    cscaCert: process.env.ICAO_CSCA_CERT,
    verification: process.env.ICAO_VERIFICATION
  },

  saps: {
    crcApiKey: process.env.SAPS_CRC_API_KEY,
    crcBaseUrl: process.env.SAPS_CRC_BASE_URL
  },

  puppeteer: {
    executablePath: process.env.PUPPETEER_EXEC_PATH || '/nix/store/qa9cnw4v5xkxyip6mb9kxqfqlz4x2dx1-chromium-138.0.7204.100/bin/chromium'
  }
};

export function validateConfig() {
  const errors = [];
  const warnings = [];

  if (config.production.useProductionApis) {
    console.log('✅ Production mode enabled - Real DHA API Integration');
    
    if (!config.dha.nprApiKey) warnings.push('DHA_NPR_API_KEY not configured');
    if (!config.dha.dmsApiKey) warnings.push('DHA_DMS_API_KEY not configured');
    if (!config.dha.visaApiKey) warnings.push('DHA_VISA_API_KEY not configured');
    if (!config.dha.mcsApiKey) warnings.push('DHA_MCS_API_KEY not configured');
    if (!config.dha.abisApiKey) warnings.push('DHA_ABIS_API_KEY not configured');
    if (!config.dha.hanisApiKey) warnings.push('HANIS_API_KEY not configured');
    
    if (!config.endpoints.npr) warnings.push('DHA_NPR_ENDPOINT not configured');
    if (!config.endpoints.dms) warnings.push('DHA_DMS_ENDPOINT not configured');
    if (!config.endpoints.visa) warnings.push('DHA_VISA_ENDPOINT not configured');
    if (!config.endpoints.mcs) warnings.push('DHA_MCS_ENDPOINT not configured');
    if (!config.endpoints.abis) warnings.push('DHA_ABIS_ENDPOINT not configured');
    if (!config.endpoints.hanis) warnings.push('HANIS_ENDPOINT not configured');
    
    const endpointCount = [
      config.endpoints.npr,
      config.endpoints.dms,
      config.endpoints.visa,
      config.endpoints.mcs,
      config.endpoints.abis,
      config.endpoints.hanis
    ].filter(Boolean).length;
    
    if (endpointCount === 6) {
      console.log('✅ All 6 DHA production endpoints configured');
    } else {
      console.log(`⚠️  Only ${endpointCount}/6 DHA endpoints configured`);
    }
  }

  if (!config.document.signingKey) {
    warnings.push('DOCUMENT_SIGNING_KEY not configured - using default');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:', errors);
    throw new Error('Configuration validation failed: ' + errors.join(', '));
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Configuration warnings:', warnings.join(', '));
  }

  return true;
}

export function logConfigStatus() {
  console.log('========================================');
  console.log('🔧 Configuration Status:');
  console.log('========================================');
  console.log(`📊 Environment: ${config.env}`);
  console.log(`🔒 Production mode: ${config.production.useProductionApis ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🛡️  Force Real APIs: ${config.production.forceRealApis ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🔐 Verification Level: ${config.production.verificationLevel}`);
  console.log(`⚡ Real-time Validation: ${config.production.realTimeValidation ? 'ENABLED' : 'DISABLED'}`);
  console.log('');
  console.log('🔑 Document Security:');
  console.log(`  DOCUMENT_SIGNING_KEY: ${config.document.signingKey ? '✅ CONFIGURED' : '❌ MISSING'}`);
  console.log(`  DOCUMENT_ENCRYPTION_KEY: ${config.document.encryptionKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  PKI_CERTIFICATE_PATH: ${config.document.pkiCertPath ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  PKI_PRIVATE_KEY: ${config.document.pkiPrivateKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  PKI_PUBLIC_KEY: ${config.document.pkiPublicKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log('');
  console.log('🔑 DHA API Keys:');
  console.log(`  DHA_NPR_API_KEY: ${config.dha.nprApiKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  DHA_DMS_API_KEY: ${config.dha.dmsApiKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  DHA_VISA_API_KEY: ${config.dha.visaApiKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  DHA_MCS_API_KEY: ${config.dha.mcsApiKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  DHA_ABIS_API_KEY: ${config.dha.abisApiKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  HANIS_API_KEY: ${config.dha.hanisApiKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  DHA_NPR_CERT_KEY: ${config.dha.nprCertKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  NIIS_API_KEY: ${config.dha.niisApiKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log('');
  console.log('🌐 Production Endpoints:');
  console.log(`  NPR Endpoint: ${config.endpoints.npr ? '✅ ' + config.endpoints.npr : '⚠️  NOT SET'}`);
  console.log(`  DMS Endpoint: ${config.endpoints.dms ? '✅ ' + config.endpoints.dms : '⚠️  NOT SET'}`);
  console.log(`  VISA Endpoint: ${config.endpoints.visa ? '✅ ' + config.endpoints.visa : '⚠️  NOT SET'}`);
  console.log(`  MCS Endpoint: ${config.endpoints.mcs ? '✅ ' + config.endpoints.mcs : '⚠️  NOT SET'}`);
  console.log(`  ABIS Endpoint: ${config.endpoints.abis ? '✅ ' + config.endpoints.abis : '⚠️  NOT SET'}`);
  console.log(`  HANIS Endpoint: ${config.endpoints.hanis ? '✅ ' + config.endpoints.hanis : '⚠️  NOT SET'}`);
  console.log(`  GWP Endpoint: ${config.endpoints.gwp ? '✅ ' + config.endpoints.gwp : '⚠️  NOT SET'}`);
  console.log('');
  console.log('🌍 ICAO PKD Integration:');
  console.log(`  ICAO_PKD_API_KEY: ${config.icao.pkdApiKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  ICAO_PKD_BASE_URL: ${config.icao.pkdBaseUrl ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  ICAO_CSCA_CERT: ${config.icao.cscaCert ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  ICAO_VERIFICATION: ${config.icao.verification ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log('');
  console.log('🚓 SAPS CRC Integration:');
  console.log(`  SAPS_CRC_API_KEY: ${config.saps.crcApiKey ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log(`  SAPS_CRC_BASE_URL: ${config.saps.crcBaseUrl ? '✅ CONFIGURED' : '⚠️  NOT SET'}`);
  console.log('');
  console.log('⚙️  Configuration:');
  console.log(`  USE_PRODUCTION_APIS: ${config.production.useProductionApis ? '✅ ENABLED' : '❌ DISABLED'}`);
  console.log(`  FORCE_REAL_APIS: ${config.production.forceRealApis ? '✅ ENABLED' : '❌ DISABLED'}`);
  console.log(`  VERIFICATION_LEVEL: ${config.production.verificationLevel}`);
  console.log(`  REAL_TIME_VALIDATION: ${config.production.realTimeValidation ? '✅ ENABLED' : '❌ DISABLED'}`);
  console.log('========================================');
}
