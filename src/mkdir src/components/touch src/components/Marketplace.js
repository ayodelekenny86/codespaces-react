import React from "react";
import ProductCard from "./ProductCard";

const products = [
  { id: 1, name: "Water Truck Service", price: 200 },
  { id: 2, name: "Borehole Installation", price: 1500 },
  { id: 3, name: "Water Purification Kit", price: 50 }
];

function Marketplace() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Services</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
