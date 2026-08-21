import ProductCard from './ProductCard';

const products = [
  { id: 1, name: 'Water Truck Service', price: 200 },
  { id: 2, name: 'Borehole Installation', price: 1500 },
  { id: 3, name: 'Water Purification Kit', price: 50 },
];

function Marketplace({ onAdd }) {
  return (
    <main className="marketplace">
      <h2>Available services</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </main>
  );
}

export default Marketplace;
