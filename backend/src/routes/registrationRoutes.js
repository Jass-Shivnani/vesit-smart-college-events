const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authenticateToken, requireAdmin, requireScannerOrAdmin } = require('../middleware/authMiddleware');

// Student endpoints
router.post('/', authenticateToken, registrationController.registerForEvent);
router.get('/my', authenticateToken, registrationController.getMyRegistrations);
router.delete('/:registration_id', authenticateToken, registrationController.cancelRegistration);

// Event roster endpoint (accessible by Admins and Gate Scanners for emergency manual lookup)
router.get('/event/:event_id', authenticateToken, requireScannerOrAdmin, registrationController.getEventRegistrations);

module.exports = router;
