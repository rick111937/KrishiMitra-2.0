exports.getSoilStats = (req, res) => {
  res.json({
    nodes: [
      { id: 1, name: 'North Field (Wheat)', moisture: 65, status: 'Optimal', health: 'Good' },
      { id: 2, name: 'South Field (Rice)', moisture: 82, status: 'High', health: 'Slight Risk' },
      { id: 3, name: 'West Field (Corn)', moisture: 42, status: 'Low', health: 'Irrigate' }
    ],
    historicalMoisture: [
      { week: 'W1', north: 60, south: 78, west: 45 },
      { week: 'W2', north: 62, south: 80, west: 40 },
      { week: 'W3', north: 65, south: 82, west: 42 },
      { week: 'W4', north: 63, south: 85, west: 45 }
    ],
    nutrients: { n: 45, p: 82, k: 78, ph: 6.5 }
  });
};