const router = require('express').Router();
const { getRiskIndex } = require('../controllers/cropRiskController');
router.get('/', getRiskIndex);
module.exports = router;