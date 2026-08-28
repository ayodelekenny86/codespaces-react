import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// In-memory database (replace with real DB in production)
const db = {
  users: [],
  products: [
    { id: 1, name: '20L Water Can', price: 50, seller: 'Pure Waters Ltd', stock: 100, category: 'water' },
    { id: 2, name: '10L Water Bottle', price: 30, seller: 'AquaFresh', stock: 50, category: 'water' },
    { id: 3, name: 'Water Dispenser', price: 500, seller: 'HomeEssentials', stock: 20, category: 'equipment' },
    { id: 4, name: '5L Mineral Water Pack', price: 15, seller: 'Mountain Spring', stock: 200, category: 'water' }
  ],
  orders: [],
  institutions: []
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// User routes
app.get('/api/users', (req, res) => {
  res.json(db.users);
});

app.post('/api/users', (req, res) => {
  const newUser = { id: db.users.length + 1, ...req.body };
  db.users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/api/users/:id', (req, res) => {
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Product routes
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const newProduct = { id: db.products.length + 1, ...req.body };
  db.products.push(newProduct);
  res.status(201).json(newProduct);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Order routes
app.get('/api/orders', (req, res) => {
  res.json(db.orders);
});

app.post('/api/orders', (req, res) => {
  const newOrder = { id: db.orders.length + 1, ...req.body, status: 'pending', createdAt: new Date() };
  db.orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.put('/api/orders/:id', (req, res) => {
  const orderIndex = db.orders.findIndex(o => o.id === parseInt(req.params.id));
  if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' });
  db.orders[orderIndex] = { ...db.orders[orderIndex], ...req.body };
  res.json(db.orders[orderIndex]);
});

// Institution routes
app.get('/api/institutions', (req, res) => {
  res.json(db.institutions);
});

app.post('/api/institutions', (req, res) => {
  const newInstitution = { id: db.institutions.length + 1, ...req.body };
  db.institutions.push(newInstitution);
  res.status(201).json(newInstitution);
});

// Payment simulation endpoint
app.post('/api/payments/process', (req, res) => {
  const { orderId, amount, method } = req.body;
  // Simulate payment processing
  setTimeout(() => {
    res.json({ 
      success: true, 
      transactionId: `TXN${Date.now()}`,
      message: 'Payment processed successfully'
    });
  }, 1000);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ AquaLink Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
