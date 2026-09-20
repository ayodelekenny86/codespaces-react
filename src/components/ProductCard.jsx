/**
 * @typedef {object} Product
 * @property {string|number} id
 * @property {string} name
 * @property {number} price
 */

/**
 * @param {{ product: Product, onAdd: (product: Product) => void }} props
 */
function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price?.toLocaleString() ?? ''}</p>
      <button type="button" onClick={() => onAdd(product)}>
        Add to cart
      </button>
    </article>
  );
}

export default ProductCard;
