exports.getRiskIndex = (req, res) => {
  res.json({
    score: 78,
    breakdown: [
      { name: 'Excess Rainfall', value: 45, color: '#ef4444' },
      { name: 'Soil Pests', value: 20, color: '#f59e0b' },
      { name: 'Extreme Heat', value: 10, color: '#10b981' },
      { name: 'Humidity Stress', value: 25, color: '#3b82f6' }
    ],
    incidents: [
      { id: 1, date: '18 Mar 2026', factor: 'Heavy Rain', damage: 'High Risk', advice: 'Improve drainage and delay fertilizer spray.' },
      { id: 2, date: '10 Mar 2026', factor: 'Insects', damage: 'Medium Risk', advice: 'Apply neem oil spray early morning.' },
      { id: 3, date: '01 Mar 2026', factor: 'Heat Wave', damage: 'Low Risk', advice: 'No action needed, optimal state.' }
    ],
    mitigations: [
      { id: 1, action: 'Apply Temporary Drainage Trenches', factor: 'Excess Rainfall', reduction: 18, type: 'critical' },
      { id: 2, action: 'Deploy Bio-Pesticide spray nodes', factor: 'Soil Pests', reduction: 12, type: 'warning' },
      { id: 3, action: 'Enable Shade Netting node mesh layouts', factor: 'Extreme Heat', reduction: 8, type: 'normal' }
    ]
  });
};