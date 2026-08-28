const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory database
let payments = [];

// Health check for this route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payments' });
});

// POST - Initiate payment (escrow)
router.post('/initiate', (req, res) => {
  const { orderId, amount, method } = req.body;
  
  if (!orderId || !amount) {
    return res.status(400).json({ error: 'Order ID and amount are required' });
  }
  
  const newPayment = {
    id: uuidv4(),
    orderId,
    amount: parseFloat(amount),
    method: method || 'card',
    status: 'pending',
    escrowStatus: 'held',
    createdAt: new Date().toISOString()
  };
  
  payments.push(newPayment);
  res.status(201).json(newPayment);
});

// POST - Confirm payment (release from escrow)
router.post('/:id/confirm', (req, res) => {
  const paymentIndex = payments.findIndex(p => p.id === req.params.id);
  if (paymentIndex === -1) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  
  payments[paymentIndex].status = 'completed';
  payments[paymentIndex].escrowStatus = 'released';
  payments[paymentIndex].completedAt = new Date().toISOString();
  
  res.json(payments[paymentIndex]);
});

// POST - Refund payment
router.post('/:id/refund', (req, res) => {
  const paymentIndex = payments.findIndex(p => p.id === req.params.id);
  if (paymentIndex === -1) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  
  payments[paymentIndex].status = 'refunded';
  payments[paymentIndex].escrowStatus = 'refunded';
  payments[paymentIndex].refundedAt = new Date().toISOString();
  
  res.json(payments[paymentIndex]);
});

// GET all payments
router.get('/', (req, res) => {
  const { orderId, status } = req.query;
  let filteredPayments = payments;
  
  if (orderId) {
    filteredPayments = filteredPayments.filter(p => p.orderId === orderId);
  }
  if (status) {
    filteredPayments = filteredPayments.filter(p => p.status === status);
  }
  
  res.json(filteredPayments);
});

// GET payment by ID
router.get('/:id', (req, res) => {
  const payment = payments.find(p => p.id === req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.json(payment);
});

module.exports = router;
