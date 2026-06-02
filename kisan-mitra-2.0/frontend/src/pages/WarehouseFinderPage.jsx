import React, { useState, useEffect } from 'react'
import { fetchWarehouses, bookWarehouse } from '../api/warehouseApi'

export default function WarehouseFinderPage() {
  const [warehouses, setWarehouses] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [quantity, setQuantity] = useState('')
  const [duration, setDuration] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookId, setBookId] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [map, setMap] = useState(null)

  useEffect(() => {
    fetchWarehouses().then(res => setWarehouses(res.data || [])).catch(console.error);

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else if (window.L) {
      initMap();
    }

    const initMap = () => {
      const L = window.L;
      if (!L || !document.getElementById('map') || window.mapInstance) return;
      
      const m = L.map('map', { zoomControl: false }).setView([12.74, 77.82], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(m);
      
      window.mapInstance = m;
      setMap(m);
    };

    return () => {
      if (window.mapInstance) {
        window.mapInstance.remove();
        window.mapInstance = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map || warehouses.length === 0) return;
    const L = window.L;

    warehouses.forEach(item => {
      if (item.lat && item.lng) {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-4 h-4 rounded-full ${item.capacity > 80 ? 'bg-red-500' : 'bg-blue-500'} border-2 border-white animate-bounce shadow-lg"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        L.marker([item.lat, item.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<b class="text-xs text-black">${item.name}</b><br/><span class="text-[10px] text-gray-500">${item.address}</span>`);
      }
    });
  }, [map, warehouses]);

  const handleConfirmBooking = () => {
    if(!quantity || !duration) return setErrorMsg("Please fill all booking details");
    setLoading(true);
    setErrorMsg('');
    bookWarehouse({ warehouseId: selectedWarehouse.id, quantity, duration })
      .then(res => {
        setLoading(false);
        if(res.data && res.data.success) {
          setBookId(res.data.bookingId);
          setBookingSuccess(true);
          setIsModalOpen(false);
          setQuantity('');
          setDuration('');
          setTimeout(() => setBookingSuccess(false), 4000);
        } else {
          setErrorMsg(res.data.message || 'Booking failed. Try again.');
        }
      }).catch(err => {
        setLoading(false);
        setErrorMsg('Network error. Check server connection.');
        console.error(err);
      })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Warehouse Finder</h1>
        <p className="text-slate-400 text-sm mt-1">Locate and book available cold storage and grain silos near you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive map view */}
        <div className="glass-card lg:col-span-2 p-0 overflow-hidden h-[500px] relative border border-white/5 z-0">
          <div id="map" className="absolute inset-0 w-full h-full"></div>
          
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs z-10">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span>Centered on your coordinates</span>
          </div>
        </div>

        {/* List of Warehouses */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Nearest Warehouses</h3>
          <p className="text-slate-400 text-xs">Showing 4 locations within 50 km.</p>
          
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-2">
            {warehouses.map((item) => {
              let capColor = "bg-green-500";
              if (item.capacity > 80) capColor = "bg-red-500";
              else if (item.capacity > 60) capColor = "bg-yellow-500";

              return (
                <div key={item.id} className="glass-card p-4 hover:bg-white/10 transition-all cursor-pointer border border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.address}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-white/5 rounded-lg border border-white/10">{item.distance}</span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="text-slate-400">Inventory Utilization</span>
                      <span className={item.capacity > 80 ? 'text-red-400' : 'text-slate-200'}>{item.capacity}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${capColor} transition-all duration-300`} style={{ width: `${item.capacity}%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                    <span className="text-xs text-slate-500">{item.phone}</span>
                    <button 
                      onClick={() => { setSelectedWarehouse(item); setIsModalOpen(true); }}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                      Book Space
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {isModalOpen && selectedWarehouse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full p-6 relative flex flex-col gap-4 border border-white/10">
            <div>
              <h3 className="text-xl font-bold text-white">Book Storage Space</h3>
              <p className="text-slate-400 text-xs mt-1">{selectedWarehouse.name}</p>
            </div>
            {errorMsg && (
              <p className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                {errorMsg}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400">STOCK QUANTITY (QUINTALS)</label>
                <input type="number" placeholder="50" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mt-1 text-sm text-white focus:outline-none focus:border-blue-500/50" value={quantity} onChange={(e)=>setQuantity(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400">DURATION (DAYS)</label>
                <input type="number" placeholder="30" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mt-1 text-sm text-white focus:outline-none focus:border-blue-500/50" value={duration} onChange={(e)=>setDuration(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={()=>{setIsModalOpen(false);setQuantity('');setDuration('');setErrorMsg('');}} disabled={loading} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-all border border-white/5 disabled:opacity-50">Cancel</button>
              <button 
                onClick={handleConfirmBooking} 
                disabled={loading}
                className={`flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-sm font-bold text-white transition-all shadow-md shadow-blue-500/20 ${loading?'opacity-50':''}`}
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
      {bookingSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500/10 border border-green-500/20 backdrop-blur-md text-green-400 px-4 py-3 rounded-xl flex items-center gap-2 z-50">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-sm font-bold">Space Booked! ID: {bookId}</span>
        </div>
      )}
    </div>
  )
}