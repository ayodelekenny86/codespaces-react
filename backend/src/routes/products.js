const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory database
let products = [
  { id: '1', sellerId: '2', name: '5-Gallon Purified Water', description: 'Pure distilled water for home and office', price: 8.99, category: 'bottles', stock: 100, unit: 'bottle' },
  { id: '2', sellerId: '2', name: '1-Liter Spring Water (24-pack)', description: 'Natural spring water in convenient bottles', price: 12.99, category: 'bottles', stock: 50, unit: 'pack' },
  { id: '3', sellerId: '2', name: 'Water Dispenser Pump', description: 'Electric pump for 5-gallon bottles', price: 24.99, category: 'accessories', stock: 20, unit: 'piece' },
  { id: '4', sellerId: '2', name: 'Alkaline Water pH 9.5', description: 'Premium alkaline water with enhanced minerals', price: 15.99, category: 'premium', stock: 30, unit: 'bottle' }
];

// Health check for this route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'products' });
});

// GET all products
router.get('/', (req, res) => {
  const { category, sellerId, search } = req.query;
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  if (sellerId) {
    filteredProducts = filteredProducts.filter(p => p.sellerId === sellerId);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  res.json(filteredProducts);
});

// GET product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST - Create new product
router.post('/', (req, res) => {
  const { sellerId, name, description, price, category, stock, unit } = req.body;
  
  if (!sellerId || !name || !price) {
    return res.status(400).json({ error: 'Seller ID, name, and price are required' });
  }
  
  const newProduct = {
    id: uuidv4(),
    sellerId,
    name,
    description: description || '',
    price: parseFloat(price),
    category: category || 'other',
    stock: parseInt(stock) || 0,
    unit: unit || 'piece'
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT - Update product
router.put('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const { name, description, price, category, stock, unit } = req.body;
  if (name) products[productIndex].name = name;
  if (description) products[productIndex].description = description;
  if (price) products[productIndex].price = parseFloat(price);
  if (category) products[productIndex].category = category;
  if (stock !== undefined) products[productIndex].stock = parseInt(stock);
  if (unit) products[productIndex].unit = unit;
  
  res.json(products[productIndex]);
});

// DELETE - Delete product
router.delete('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products.splice(productIndex, 1);
  res.status(204).send();
});

module.exports = router;
