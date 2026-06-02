const router = require('express').Router();
const { getSoilStats } = require('../controllers/soilController');
router.get('/', getSoilStats);
module.exports = router;