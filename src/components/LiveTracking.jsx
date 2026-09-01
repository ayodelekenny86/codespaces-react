import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Truck, Droplets, MapPin, Navigation, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const deliveryLocations = [
  { id: 1, name: 'East Legon Hub', lat: 5.6037, lng: -0.1870, type: 'hub', orders: 24, status: 'active' },
  { id: 2, name: 'Osu Delivery Point', lat: 5.5558, lng: -0.1739, type: 'point', orders: 18, status: 'active' },
  { id: 3, name: 'Cantonments Zone', lat: 5.5893, lng: -0.1824, type: 'zone', orders: 15, status: 'active' },
  { id: 4, name: 'Tema Station', lat: 5.6698, lng: -0.0167, type: 'hub', orders: 32, status: 'busy' },
  { id: 5, name: 'Airport Residential', lat: 5.6012, lng: -0.1719, type: 'point', orders: 12, status: 'active' },
];

const activeDrivers = [
  { id: 'D-001', name: 'Kojo M.', lat: 5.6025, lng: -0.1850, status: 'delivering', progress: 75, vehicle: 'Truck #AQ-101' },
  { id: 'D-002', name: 'Ama S.', lat: 5.5570, lng: -0.1720, status: 'en-route', progress: 45, vehicle: 'Truck #AQ-102' },
  { id: 'D-003', name: 'Ibrahim K.', lat: 5.5900, lng: -0.1800, status: 'idle', progress: 0, vehicle: 'Truck #AQ-103' },
  { id: 'D-004', name: 'Grace O.', lat: 5.6680, lng: -0.0150, status: 'delivering', progress: 90, vehicle: 'Truck #AQ-104' },
];

const recentDeliveries = [
  { id: 'AQ-1048', location: 'East Legon, Accra', time: '10 min ago', status: 'delivered', amount: 'GH₵250' },
  { id: 'AQ-1047', location: 'Osu, Accra', time: '25 min ago', status: 'delivered', amount: 'GH₵180' },
  { id: 'AQ-1046', location: 'Cantonments, Accra', time: '42 min ago', status: 'delivered', amount: 'GH₵320' },
  { id: 'AQ-1045', location: 'Tema, Accra', time: '1 hour ago', status: 'delivered', amount: 'GH₵450' },
];

export function LiveTrackingMap({ showNotice }) {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [mapCenter] = useState([5.6037, -0.1870]); // Accra coordinates
  const [zoom] = useState(12);
  const [filter, setFilter] = useState('all');

  const filteredDrivers = filter === 'all' 
    ? activeDrivers 
    : activeDrivers.filter(d => d.status === filter);

  return (
    <motion.div 
      className="live-tracking-map"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="tracking-header">
        <h2><Navigation size={24} /> Live Fleet Tracking</h2>
        <div className="tracking-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Drivers</option>
            <option value="delivering">Delivering</option>
            <option value="en-route">En Route</option>
            <option value="idle">Idle</option>
          </select>
          <button className="refresh-btn" onClick={() => showNotice('Live tracking data refreshed')}>
            Refresh
          </button>
        </div>
      </div>

      <div className="map-container-wrapper">
        <div className="map-sidebar">
          <div className="stats-panel">
            <div className="stat-item">
              <Truck size={20} color="#0088FE" />
              <div>
                <strong>{activeDrivers.length}</strong>
                <span>Active Drivers</span>
              </div>
            </div>
            <div className="stat-item">
              <Droplets size={20} color="#00C49F" />
              <div>
                <strong>101</strong>
                <span>Orders Today</span>
              </div>
            </div>
            <div className="stat-item">
              <CheckCircle size={20} color="#FFBB28" />
              <div>
                <strong>94.2%</strong>
                <span>On-Time Rate</span>
              </div>
            </div>
          </div>

          <div className="drivers-list">
            <h3>Active Drivers</h3>
            {filteredDrivers.map(driver => (
              <motion.div 
                key={driver.id}
                className={`driver-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                onClick={() => setSelectedDriver(driver)}
                whileHover={{ scale: 1.02 }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <div className="driver-info">
                  <div className="driver-avatar">{driver.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <strong>{driver.name}</strong>
                    <small>{driver.vehicle}</small>
                  </div>
                </div>
                <div className="driver-status">
                  <span className={`status-badge status-${driver.status}`}>{driver.status}</span>
                  {driver.status === 'delivering' && (
                    <span className="progress">{driver.progress}%</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="recent-deliveries">
            <h3>Recent Deliveries</h3>
            {recentDeliveries.map(delivery => (
              <div key={delivery.id} className="delivery-item">
                <div className="delivery-id">{delivery.id}</div>
                <div className="delivery-location">{delivery.location}</div>
                <div className="delivery-meta">
                  <span className="delivery-time">{delivery.time}</span>
                  <span className="delivery-amount">{delivery.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-wrapper">
          <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Delivery Locations */}
            {deliveryLocations.map(location => (
              <CircleMarker
                key={location.id}
                center={[location.lat, location.lng]}
                radius={location.type === 'hub' ? 20 : 12}
                fillColor={location.status === 'busy' ? '#FF8042' : '#00C49F'}
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.6}
              >
                <Popup>
                  <strong>{location.name}</strong><br />
                  Type: {location.type}<br />
                  Orders: {location.orders}<br />
                  Status: {location.status}
                </Popup>
              </CircleMarker>
            ))}

            {/* Driver Markers */}
            {filteredDrivers.map(driver => (
              <Marker
                key={driver.id}
                position={[driver.lat, driver.lng]}
                eventHandlers={{
                  click: () => setSelectedDriver(driver),
                }}
              >
                <Popup>
                  <strong>{driver.name}</strong><br />
                  Vehicle: {driver.vehicle}<br />
                  Status: {driver.status}<br />
                  Progress: {driver.progress}%
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {selectedDriver && (
            <motion.div 
              className="driver-detail-panel"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="detail-header">
                <h3>{selectedDriver.name}</h3>
                <button onClick={() => setSelectedDriver(null)}>×</button>
              </div>
              <div className="detail-content">
                <div className="detail-row">
                  <span>Vehicle:</span>
                  <strong>{selectedDriver.vehicle}</strong>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span className={`status-badge status-${selectedDriver.status}`}>{selectedDriver.status}</span>
                </div>
                <div className="detail-row">
                  <span>Progress:</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${selectedDriver.progress}%` }} />
                  </div>
                  <span>{selectedDriver.progress}%</span>
                </div>
                <div className="detail-row">
                  <span>Location:</span>
                  <strong>{selectedDriver.lat.toFixed(4)}, {selectedDriver.lng.toFixed(4)}</strong>
                </div>
                <button className="contact-driver-btn" onClick={() => showNotice(`Contacting ${selectedDriver.name}...`)}>
                  Contact Driver
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default LiveTrackingMap;
