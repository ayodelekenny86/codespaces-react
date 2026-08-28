import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Droplets, MapPin, Truck, AlertTriangle, CheckCircle, Clock, Thermometer, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const demandData = [
  { time: '00:00', demand: 12, supply: 10 },
  { time: '04:00', demand: 18, supply: 15 },
  { time: '08:00', demand: 85, supply: 70 },
  { time: '12:00', demand: 95, supply: 80 },
  { time: '16:00', demand: 75, supply: 65 },
  { time: '20:00', demand: 45, supply: 40 },
  { time: '23:59', demand: 20, supply: 18 },
];

const revenueData = [
  { month: 'Jan', revenue: 12500, costs: 8200 },
  { month: 'Feb', revenue: 15800, costs: 9500 },
  { month: 'Mar', revenue: 18200, costs: 10800 },
  { month: 'Apr', revenue: 22400, costs: 12500 },
  { month: 'May', revenue: 25600, costs: 14200 },
  { month: 'Jun', revenue: 28900, costs: 15800 },
];

const regionData = [
  { name: 'East Legon', value: 35 },
  { name: 'Osu', value: 28 },
  { name: 'Cantonments', value: 22 },
  { name: 'Tema', value: 15 },
];

const waterQualityData = [
  { parameter: 'pH', value: 7.2, min: 6.5, max: 8.5, unit: 'pH', status: 'optimal' },
  { parameter: 'Turbidity', value: 0.8, min: 0, max: 5, unit: 'NTU', status: 'optimal' },
  { parameter: 'TDS', value: 180, min: 50, max: 500, unit: 'ppm', status: 'optimal' },
  { parameter: 'Chlorine', value: 0.4, min: 0.2, max: 2.0, unit: 'mg/L', status: 'optimal' },
  { parameter: 'Temperature', value: 24, min: 15, max: 30, unit: '°C', status: 'optimal' },
];

const smartAlerts = [
  { id: 1, type: 'warning', message: 'High demand predicted in East Legon (08:00-10:00)', time: '5 min ago', priority: 'high' },
  { id: 2, type: 'success', message: 'Route optimization saved 23% fuel costs', time: '1 hour ago', priority: 'medium' },
  { id: 3, type: 'info', message: 'New water quality certification received', time: '2 hours ago', priority: 'low' },
  { id: 4, type: 'error', message: 'Truck #AQ-402 requires maintenance', time: '3 hours ago', priority: 'high' },
];

export function SmartAnalyticsDashboard({ showNotice }) {
  const [selectedRegion, setSelectedRegion] = useState('Accra');
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <motion.div 
      className="smart-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <h2><Activity size={24} /> Smart Analytics Dashboard</h2>
        <div className="dashboard-controls">
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            <option>Accra</option>
            <option>Kumasi</option>
            <option>Takoradi</option>
            <option>Tema</option>
            <option>Lagos</option>
          </select>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard 
          title="Total Revenue" 
          value="GH₵28,900" 
          change="+18.2%" 
          trend="up" 
          icon={<TrendingUp color="#00C49F" />} 
        />
        <KPICard 
          title="Active Orders" 
          value="142" 
          change="+12.5%" 
          trend="up" 
          icon={<Droplets color="#0088FE" />} 
        />
        <KPICard 
          title="Avg Delivery Time" 
          value="24 min" 
          change="-8.3%" 
          trend="down" 
          icon={<Clock color="#FFBB28" />} 
        />
        <KPICard 
          title="Water Quality Score" 
          value="98.5%" 
          change="+2.1%" 
          trend="up" 
          icon={<CheckCircle color="#00C49F" />} 
        />
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'demand' ? 'active' : ''} onClick={() => setActiveTab('demand')}>Demand Forecast</button>
        <button className={activeTab === 'quality' ? 'active' : ''} onClick={() => setActiveTab('quality')}>Water Quality</button>
        <button className={activeTab === 'routes' ? 'active' : ''} onClick={() => setActiveTab('routes')}>Route Optimization</button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="dashboard-content">
          <div className="chart-row">
            <div className="chart-card">
              <h3>Revenue vs Costs (6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="costs" stroke="#FF8042" fill="#FF8042" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Demand by Region</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={regionData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="alert-section">
            <h3><AlertTriangle size={20} /> Smart Alerts & Recommendations</h3>
            <div className="alerts-grid">
              {smartAlerts.map(alert => (
                <motion.div 
                  key={alert.id}
                  className={`alert-card alert-${alert.type}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: alert.id * 0.1 }}
                >
                  <span className={`alert-icon alert-${alert.type}`}>
                    {alert.type === 'warning' && <AlertTriangle size={18} />}
                    {alert.type === 'success' && <CheckCircle size={18} />}
                    {alert.type === 'error' && <AlertTriangle size={18} />}
                    {alert.type === 'info' && <Activity size={18} />}
                  </span>
                  <div className="alert-content">
                    <p>{alert.message}</p>
                    <small>{alert.time} • Priority: {alert.priority}</small>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'demand' && (
        <div className="dashboard-content">
          <div className="chart-card full-width">
            <h3>AI-Powered Demand Forecasting (24 Hours)</h3>
            <p className="chart-description">Machine learning model predicts demand patterns based on historical data, weather, and local events</p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="demand" stroke="#0088FE" strokeWidth={3} name="Predicted Demand" />
                <Line type="monotone" dataKey="supply" stroke="#00C49F" strokeWidth={3} name="Available Supply" />
              </LineChart>
            </ResponsiveContainer>
            <div className="forecast-insights">
              <div className="insight-card">
                <TrendingUp color="#00C49F" />
                <div>
                  <strong>Peak Hours Identified</strong>
                  <p>08:00-12:00 shows 85-95% capacity utilization</p>
                </div>
              </div>
              <div className="insight-card">
                <Truck color="#0088FE" />
                <div>
                  <strong>Recommendation</strong>
                  <p>Deploy 3 additional trucks to East Legon zone</p>
                </div>
              </div>
              <div className="insight-card">
                <AlertTriangle color="#FFBB28" />
                <div>
                  <strong>Supply Gap Warning</strong>
                  <p>15% shortage predicted at 12:00 - pre-position inventory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quality' && (
        <div className="dashboard-content">
          <div className="quality-monitoring">
            <h3><Thermometer size={24} /> Real-Time Water Quality Monitoring</h3>
            <p className="chart-description">IoT sensors provide continuous monitoring across all storage facilities</p>
            <div className="quality-grid">
              {waterQualityData.map((item, index) => (
                <motion.div 
                  key={item.parameter}
                  className="quality-card"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="quality-header">
                    <span className="quality-param">{item.parameter}</span>
                    <span className={`quality-status status-${item.status}`}>{item.status.toUpperCase()}</span>
                  </div>
                  <div className="quality-value">
                    <span className="value">{item.value}</span>
                    <span className="unit">{item.unit}</span>
                  </div>
                  <div className="quality-range">
                    <div className="range-bar">
                      <div 
                        className="range-fill" 
                        style={{ 
                          width: `${Math.min(((item.value - item.min) / (item.max - item.min)) * 100, 100)}%`,
                          backgroundColor: item.status === 'optimal' ? '#00C49F' : '#FFBB28'
                        }}
                      />
                    </div>
                    <div className="range-labels">
                      <span>{item.min}</span>
                      <span>{item.max}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="quality-certification">
              <h4>Certification Status</h4>
              <div className="cert-badge">
                <CheckCircle size={32} color="#00C49F" />
                <div>
                  <strong>GSA Certified</strong>
                  <p>Valid until Dec 2026 • Last test: 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="dashboard-content">
          <div className="route-optimization">
            <h3><MapPin size={24} /> AI Route Optimization</h3>
            <p className="chart-description">Smart routing algorithm reduces delivery time and fuel consumption</p>
            <div className="route-stats">
              <div className="stat-card">
                <strong>23%</strong>
                <p>Fuel Cost Reduction</p>
              </div>
              <div className="stat-card">
                <strong>18 min</strong>
                <p>Avg Time Saved/Route</p>
              </div>
              <div className="stat-card">
                <strong>94.2%</strong>
                <p>On-Time Delivery Rate</p>
              </div>
              <div className="stat-card">
                <strong>1,240 km</strong>
                <p>Total Distance Optimized</p>
              </div>
            </div>
            <div className="active-routes">
              <h4>Active Optimized Routes</h4>
              <div className="route-list">
                {[
                  { id: 'R-001', driver: 'Kojo M.', stops: 8, progress: 75, eta: '12 min', status: 'on-time' },
                  { id: 'R-002', driver: 'Ama S.', stops: 6, progress: 45, eta: '28 min', status: 'on-time' },
                  { id: 'R-003', driver: 'Ibrahim K.', stops: 10, progress: 90, eta: '5 min', status: 'delayed' },
                  { id: 'R-004', driver: 'Grace O.', stops: 5, progress: 20, eta: '42 min', status: 'on-time' },
                ].map(route => (
                  <div key={route.id} className="route-item">
                    <div className="route-info">
                      <span className="route-id">{route.id}</span>
                      <span className="route-driver">{route.driver}</span>
                      <span className="route-stops">{route.stops} stops</span>
                    </div>
                    <div className="route-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${route.progress}%` }} />
                      </div>
                      <span className="progress-text">{route.progress}%</span>
                    </div>
                    <div className="route-meta">
                      <span className={`status-badge status-${route.status}`}>{route.status}</span>
                      <span className="eta">ETA: {route.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function KPICard({ title, value, change, trend, icon }) {
  return (
    <motion.div 
      className="kpi-card"
      whileHover={{ scale: 1.02 }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        <span className="kpi-icon">{icon}</span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-change ${trend}`}>
        {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{change}</span>
      </div>
    </motion.div>
  );
}

export default SmartAnalyticsDashboard;
