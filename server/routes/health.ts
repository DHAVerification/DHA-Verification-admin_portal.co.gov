import { Router } from 'express';
import { db } from '../storage.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Test database connection
    const documents = await db.query.documents.findMany({ limit: 1 });

    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      documentsAvailable: true
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;