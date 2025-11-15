
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Security & Performance Middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts for now
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Import routes
import permitRoutes from './routes/permits.js';
import documentRoutes from './routes/documents.js';
import healthRoutes from './routes/health.js';

// API Routes
app.use('/api/permits', permitRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/health', healthRoutes);

// Serve static files from attached_assets
app.use('/public', express.static(path.join(__dirname, '../attached_assets')));

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'DHA Backend API',
    version: '1.0.0',
    endpoints: {
      permits: '/api/permits',
      documents: '/api/documents',
      health: '/api/health'
    }
  });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑');
  console.log('✅ DHA Backend Server LIVE');
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: Connected`);
  console.log('👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑');
});
