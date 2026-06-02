const router = require('express').Router();
const { getForecast } = require('../controllers/weatherController');
router.get('/', getForecast);
module.exports = router;