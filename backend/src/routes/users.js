const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory database (replace with real DB in production)
let users = [
  { id: '1', email: 'buyer@example.com', password: 'password123', role: 'buyer', name: 'John Buyer', phone: '+1234567890' },
  { id: '2', email: 'seller@example.com', password: 'password123', role: 'seller', name: 'Jane Seller', phone: '+1234567891' },
  { id: '3', email: 'institution@example.com', password: 'password123', role: 'institution', name: 'City Hospital', phone: '+1234567892' },
  { id: '4', email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'System Admin', phone: '+1234567893' }
];

// Health check for this route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'users' });
});

// GET all users (admin only)
router.get('/', (req, res) => {
  // In production, verify admin token here
  const { role } = req.query;
  let filteredUsers = users;
  if (role) {
    filteredUsers = users.filter(u => u.role === role);
  }
  // Remove passwords from response
  res.json(filteredUsers.map(({ password, ...user }) => user));
});

// GET user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// POST - Create new user (register)
router.post('/', (req, res) => {
  const { email, password, role, name, phone } = req.body;
  
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: uuidv4(),
    email,
    password, // In production, hash this!
    role,
    name: name || '',
    phone: phone || ''
  };
  
  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// POST - Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({
    user: userWithoutPassword,
    token: `mock-token-${user.id}` // In production, use JWT
  });
});

// PUT - Update user
router.put('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, phone, password } = req.body;
  if (name) users[userIndex].name = name;
  if (phone) users[userIndex].phone = phone;
  if (password) users[userIndex].password = password;
  
  const { password: _, ...updatedUser } = users[userIndex];
  res.json(updatedUser);
});

// DELETE - Delete user
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

module.exports = router;
