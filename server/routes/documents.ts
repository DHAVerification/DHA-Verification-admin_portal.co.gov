
import { Router } from 'express';
import { db } from '../storage.js';

const router = Router();

// Get document statistics
router.get('/stats', async (req, res) => {
  try {
    const documents = await db.query.documents.findMany({
      with: {
        documentType: true
      }
    });

    const stats = {
      total: documents.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    };

    documents.forEach(doc => {
      const type = doc.documentType.name;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
    });

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// Get all people
router.get('/people', async (req, res) => {
  try {
    const people = await db.query.people.findMany();
    
    res.json({
      success: true,
      count: people.length,
      people
    });
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch people'
    });
  }
});

export default router;
