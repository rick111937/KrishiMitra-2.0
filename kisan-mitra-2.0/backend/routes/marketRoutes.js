const router = require('express').Router();
const { getPrices } = require('../controllers/marketController');
router.get('/', getPrices);
module.exports = router;