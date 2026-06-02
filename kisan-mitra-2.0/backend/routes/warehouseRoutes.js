const router = require('express').Router();
const { getWarehouses, bookWarehouse } = require('../controllers/warehouseController');
router.get('/', getWarehouses);
router.post('/book', bookWarehouse);
module.exports = router;