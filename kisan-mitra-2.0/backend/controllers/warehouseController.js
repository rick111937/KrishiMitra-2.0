exports.getWarehouses = (req, res) => {
  res.json([
    { id: 1, name: 'Adani Agri Logistics', address: 'Hosur Industrial Area', distance: '12 km', capacity: 85, phone: '+91 98765 43210', lat: 12.7409, lng: 77.8253 },
    { id: 2, name: 'NCBH Cold Chain', address: 'Hosur Rural Center', distance: '18 km', capacity: 40, phone: '+91 98765 43211', lat: 12.7523, lng: 77.8312 },
    { id: 3, name: 'State Warehousing Silo', address: 'Mandi Road, Hosur', distance: '5 km', capacity: 92, phone: '+91 98765 43212', lat: 12.7301, lng: 77.8124 }
  ]);
};

exports.bookWarehouse = (req, res) => {
  const { warehouseId, quantity, duration } = req.body;
  res.json({
    success: true,
    bookingId: `BK-${Math.floor(Math.random() * 90000) + 10000}`,
    message: 'Storage Space Booked Successfully',
    details: { warehouseId, quantity, duration }
  });
};