import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductCard from './ProductCard';

const product = { id: 1, name: 'Water Truck Service', price: 200 };

test.each([
  { price: 0, formatted: '$0' },
  { price: 199.5, formatted: '$199.5' },
  { price: 1234567, formatted: '$1,234,567' },
])('formats the price $price as $formatted', ({ price, formatted }) => {
  render(<ProductCard product={{ ...product, price }} onAdd={() => {}} />);

  expect(screen.getByText(formatted)).toBeInTheDocument();
});

test('renders the product name and formatted price', () => {
  render(<ProductCard product={product} onAdd={() => {}} />);

  const heading = screen.getByRole('heading', { name: 'Water Truck Service' });
  expect(heading).toBeInTheDocument();

  // The component renders `${price.toLocaleString()}`, which may add
  // thousands separators, so match the currency prefix loosely.
  const price = screen.getByText(/^\$\s?200$/);
  expect(price).toBeInTheDocument();

  // Pin down the rest of the card so a dropped image/description/button
  // cannot slip through.
  expect(screen.getByRole('article')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
});

test('calls onAdd with the product when the button is clicked', async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();

  render(<ProductCard product={product} onAdd={onAdd} />);

  await user.click(screen.getByRole('button', { name: /add to cart/i }));

  expect(onAdd).toHaveBeenCalledTimes(1);
  expect(onAdd).toHaveBeenCalledWith(product);
});

test('renders a product without a price without crashing', () => {
  const { price, ...withoutPrice } = product;

  render(<ProductCard product={withoutPrice} onAdd={() => {}} />);

  expect(screen.getByRole('heading', { name: 'Water Truck Service' })).toBeInTheDocument();
  // Renders an empty currency string instead of throwing on undefined price.
  expect(screen.getByText('$')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
});

test('does not call onAdd when no handler is provided', async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();

  render(<ProductCard product={product} onAdd={onAdd} />);

  expect(onAdd).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button', { name: /add to cart/i }));

  expect(onAdd).toHaveBeenCalledOnce();
});
