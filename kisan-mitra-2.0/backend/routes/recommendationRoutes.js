const router = require('express').Router();
const { getAdvice } = require('../controllers/recommendationController');
router.get('/', getAdvice);
module.exports = router;