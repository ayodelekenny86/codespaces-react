/**
 * @typedef {object} CartItem
 * @property {string|number} id
 * @property {string} name
 */

/**
 * @param {{ items: CartItem[], onRemove: (id: string|number) => void }} props
 */
function Cart({ items, onRemove }) {
  return (
    <aside className="cart" aria-labelledby="cart-title">
      <h2 id="cart-title">Your cart</h2>
      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <button type="button" onClick={() => onRemove(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default Cart;
