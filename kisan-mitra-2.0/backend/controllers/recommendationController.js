exports.getAdvice = (req, res) => {
  res.json([
    { 
      id: 1, 
      priority: 'critical', 
      action: 'Delay Irrigation', 
      reason: 'Forecasting heavy rain tomorrow afternoon.', 
      category: 'Weather',
      benefit: 'Prevents root damage from waterlogging and saves water utility costs.',
      steps: [
        'Confirm weather window with local MET reports',
        'Disable automated irrigation valves and timers',
        'Verify drainage paths around low-lying nodes'
      ]
    },
    { 
      id: 2, 
      priority: 'warning', 
      action: 'Apply Nitrogen Boost', 
      reason: 'Soil NPK sensors indicate nitrogen dip in sector B.', 
      category: 'Soil',
      benefit: 'Maintains optimal crop growth rate and boosts potential harvest yield.',
      steps: [
        'Procure Urea or equivalent Nitrogen-rich fertilizer',
        'Calibrate spreader settings for sector coordinates',
        'Schedule application during early morning window'
      ]
    },
    { 
      id: 3, 
      priority: 'normal', 
      action: 'Check Market Rates early', 
      reason: 'Tomato prices peaking in adjacent districts.', 
      category: 'Market',
      benefit: 'Capitalize on peak demand to maximize revenue margins on existing stock.',
      steps: [
        'Fetch live APMC prices for target coordinates',
        'Evaluate transportation logistics bandwidth',
        'Harvest mature batches for immediate dispatch'
      ]
    }
  ]);
};