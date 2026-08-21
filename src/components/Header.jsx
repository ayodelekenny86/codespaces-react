function Header({ cartCount }) {
  return (
    <header className="site-header">
      <h1>AquaLink Marketplace</h1>
      <span aria-label={`${cartCount} items in cart`}>Cart: {cartCount}</span>
    </header>
  );
}

export default Header;
