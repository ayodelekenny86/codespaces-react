const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory database
let orders = [
  { id: '1', buyerId: '1', sellerId: '2', items: [{ productId: '1', quantity: 2, price: 8.99 }], total: 17.98, status: 'pending', paymentStatus: 'unpaid', deliveryAddress: '123 Main St', createdAt: new Date().toISOString() },
  { id: '2', buyerId: '3', sellerId: '2', items: [{ productId: '2', quantity: 5, price: 12.99 }], total: 64.95, status: 'delivered', paymentStatus: 'paid', deliveryAddress: '456 Hospital Ave', createdAt: new Date(Date.now() - 86400000).toISOString() }
];

// Health check for this route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'orders' });
});

// GET all orders
router.get('/', (req, res) => {
  const { buyerId, sellerId, status } = req.query;
  let filteredOrders = orders;
  
  if (buyerId) {
    filteredOrders = filteredOrders.filter(o => o.buyerId === buyerId);
  }
  if (sellerId) {
    filteredOrders = filteredOrders.filter(o => o.sellerId === sellerId);
  }
  if (status) {
    filteredOrders = filteredOrders.filter(o => o.status === status);
  }
  
  res.json(filteredOrders);
});

// GET order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// POST - Create new order
router.post('/', (req, res) => {
  const { buyerId, sellerId, items, deliveryAddress } = req.body;
  
  if (!buyerId || !sellerId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Buyer ID, seller ID, and items are required' });
  }
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const newOrder = {
    id: uuidv4(),
    buyerId,
    sellerId,
    items,
    total: parseFloat(total.toFixed(2)),
    status: 'pending',
    paymentStatus: 'unpaid',
    deliveryAddress: deliveryAddress || '',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// PUT - Update order status
router.put('/:id', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  const { status, paymentStatus, deliveryAddress } = req.body;
  if (status) orders[orderIndex].status = status;
  if (paymentStatus) orders[orderIndex].paymentStatus = paymentStatus;
  if (deliveryAddress) orders[orderIndex].deliveryAddress = deliveryAddress;
  
  res.json(orders[orderIndex]);
});

// DELETE - Cancel order
router.delete('/:id', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  // Only cancel pending orders
  if (orders[orderIndex].status !== 'pending') {
    return res.status(400).json({ error: 'Only pending orders can be cancelled' });
  }
  
  orders.splice(orderIndex, 1);
  res.status(204).send();
});

module.exports = router;
