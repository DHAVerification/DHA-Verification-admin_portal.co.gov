
import { Router } from 'express';
import { db } from '../storage.js';
import * as schema from '../../shared/schema/index.js';

const router = Router();

// Get all permits
router.get('/', async (req, res) => {
  try {
    const documents = await db.query.documents.findMany({
      with: {
        person: true,
        documentType: true
      }
    });

    const permits = documents.map(doc => ({
      id: doc.id,
      name: doc.person.fullName,
      firstName: doc.person.firstName,
      surname: doc.person.surname,
      passport: doc.person.passportNumber || 'N/A',
      idNumber: doc.person.idNumber,
      dateOfBirth: doc.person.dateOfBirth,
      nationality: doc.person.nationality,
      type: doc.documentType.name,
      issueDate: doc.issueDate,
      expiryDate: doc.expiryDate,
      status: doc.status,
      permitNumber: doc.documentNumber,
      referenceNumber: doc.referenceNumber,
      category: doc.metadata?.category || '',
      officerName: doc.officerName,
      officerID: doc.officerID,
      signature: doc.signature,
      dhaVerified: doc.dhaVerified,
      metadata: doc.metadata
    }));

    res.json({
      success: true,
      count: permits.length,
      permits,
      source: 'PostgreSQL Database (DHA Verified)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching permits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch permits',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get permit by ID
router.get('/:id', async (req, res) => {
  try {
    const permitId = parseInt(req.params.id);
    
    const [document] = await db.query.documents.findMany({
      where: (documents, { eq }) => eq(documents.id, permitId),
      with: {
        person: true,
        documentType: true
      },
      limit: 1
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Permit not found'
      });
    }

    res.json({
      success: true,
      permit: {
        id: document.id,
        name: document.person.fullName,
        firstName: document.person.firstName,
        surname: document.person.surname,
        passport: document.person.passportNumber || 'N/A',
        idNumber: document.person.idNumber,
        dateOfBirth: document.person.dateOfBirth,
        nationality: document.person.nationality,
        type: document.documentType.name,
        issueDate: document.issueDate,
        expiryDate: document.expiryDate,
        status: document.status,
        permitNumber: document.documentNumber,
        referenceNumber: document.referenceNumber,
        category: document.metadata?.category || '',
        officerName: document.officerName,
        officerID: document.officerID,
        signature: document.signature,
        dhaVerified: document.dhaVerified,
        metadata: document.metadata
      }
    });
  } catch (error) {
    console.error('Error fetching permit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch permit'
    });
  }
});

export default router;
