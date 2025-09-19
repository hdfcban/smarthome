const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// GET /api/devices - Get all devices
router.get('/', deviceController.getAllDevices);

// GET /api/devices/:id - Get single device
router.get('/:id', deviceController.getDevice);

// POST /api/devices - Create new device
router.post('/', deviceController.createDevice);

// PATCH /api/devices/:id - Update device
router.patch('/:id', deviceController.updateDevice);

// DELETE /api/devices/:id - Delete device
router.delete('/:id', deviceController.deleteDevice);

// POST /api/devices/:id/toggle - Toggle device
router.post('/:id/toggle', deviceController.toggleDevice);

module.exports = router;