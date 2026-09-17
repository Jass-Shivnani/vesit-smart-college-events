const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', eventController.getAllEvents);
router.get('/recommendations', authenticateToken, eventController.getRecommendedEvents);
router.get('/:id', eventController.getEventById);

// Admin-protected CRUD & Granular Controls
router.post('/', authenticateToken, requireAdmin, eventController.createEvent);
router.put('/:id', authenticateToken, requireAdmin, eventController.updateEvent);
router.patch('/:id/freeze', authenticateToken, requireAdmin, eventController.toggleFreezeEvent);
router.delete('/:id', authenticateToken, requireAdmin, eventController.deleteEvent);

module.exports = router;
