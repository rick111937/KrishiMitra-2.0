exports.getAlerts = (req, res) => {
  res.json([
    { id: 1, type: 'critical', title: 'Heavy Rainfall Warning', message: 'Precipitation model predicts 60mm on Thursday.', time: '12 mins ago', read: false },
    { id: 2, type: 'warning', title: 'Pest Risk Detected', message: 'High humidity favors fungal growth list. Inspect crop roots.', time: '1 hour ago', read: false },
    { id: 3, type: 'info', title: 'Market Trend update', message: 'Wheat prices up 1.5% in Indore mandi.', time: '3 hours ago', read: true }
  ]);
};