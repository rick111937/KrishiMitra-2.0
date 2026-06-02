exports.getPrices = (req, res) => {
  res.json({
    cropPrices: [
      { id: 1, crop: 'Wheat (Good Quality)', price: 2450, change: '+4.5%', trend: 'up', mandi: 'Indore Mandi' },
      { id: 2, crop: 'Rice (Basmati)', price: 4800, change: '-1.2%', trend: 'down', mandi: 'Karnal Mandi' },
      { id: 3, crop: 'Cotton', price: 6200, change: '+2.1%', trend: 'up', mandi: 'Rajkot Mandi' }
    ],
    historicalPrices: [
      { date: '1 Mar', Wheat: 2200, Rice: 4700 },
      { date: '5 Mar', Wheat: 2320, Rice: 4750 },
      { date: '10 Mar', Wheat: 2400, Rice: 4680 },
      { date: '15 Mar', Wheat: 2450, Rice: 4800 }
    ],
    mandiComparison: [
      { id: 1, mandi: 'Indore Market', distance: 42, price: 2510, change: '+1.2%', trend: 'up' },
      { id: 2, mandi: 'Ujjain Market', distance: 55, price: 2480, change: '+0.5%', trend: 'up' },
      { id: 3, mandi: 'Dhar Market', distance: 68, price: 2410, change: '-0.8%', trend: 'down' }
    ]
  });
};