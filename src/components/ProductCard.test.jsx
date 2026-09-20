import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from './ProductCard';

const product = { id: 1, name: 'Water Truck Service', price: 200 };

test('renders the product name and formatted price', () => {
  render(<ProductCard product={product} onAdd={() => {}} />);

  expect(screen.getByRole('heading', { name: 'Water Truck Service' })).toBeInTheDocument();
  // The component renders `${price.toLocaleString()}`, which may add
  // thousands separators, so match the currency prefix loosely.
  expect(screen.getByText(/^\$\s?200$/)).toBeInTheDocument();
});

test('calls onAdd with the product when the button is clicked', async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();

  render(<ProductCard product={product} onAdd={onAdd} />);

  await user.click(screen.getByRole('button', { name: /add to cart/i }));

  expect(onAdd).toHaveBeenCalledTimes(1);
  expect(onAdd).toHaveBeenCalledWith(product);
});
