exports.getForecast = (req, res) => {
  res.json({
    current: { temp: 27, status: 'Mostly Cloudy', humidity: 58, wind: 12 },
    forecast: [
      { day: 'Mon', temp: 28, rain: 5, humidity: 45 },
      { day: 'Tue', temp: 27, rain: 20, humidity: 55 },
      { day: 'Wed', temp: 29, rain: 12, humidity: 50 },
      { day: 'Thu', temp: 25, rain: 75, humidity: 80 },
      { day: 'Fri', temp: 26, rain: 35, humidity: 70 },
      { day: 'Sat', temp: 28, rain: 10, humidity: 60 },
      { day: 'Sun', temp: 29, rain: 0, humidity: 50 }
    ]
  });
};