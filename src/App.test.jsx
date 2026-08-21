import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

async function verifyBuyer(user) {
  await user.type(screen.getByRole('textbox', { name: /buyer phone number/i }), '0545009046');
  await user.click(screen.getByRole('button', { name: /send otp/i }));
  await user.type(screen.getByRole('textbox', { name: /buyer otp/i }), '123456');
  await user.click(screen.getByRole('button', { name: /verify otp/i }));
}

test('renders the buyer booking workspace', () => {
  const user = userEvent.setup();
  render(<App />);
  return verifyBuyer(user);
}).then(() => {
  render(<App />);
});
  expect(screen.getByRole('heading', { name: /good morning, alex/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /where should we deliver/i })).toBeInTheDocument();
  expect(screen.getByText(/GH₵300 · GH₵250/)).toBeInTheDocument();
  expect(screen.getByText(/silver tier/i)).toBeInTheDocument();
});

test('answers a buyer question with Aqua AI', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /aqua ai/i }));
  await user.type(screen.getByRole('textbox', { name: /ask aqua ai/i }), 'What is the delivery price?');
  await user.click(screen.getByRole('button', { name: /^ask/i }));

  expect(screen.getByText(/standard water price is GH₵300/i)).toBeInTheDocument();
});

test('creates a delivery booking and switches workspaces', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByPlaceholderText(/enter an address/i), 'Labone, Accra');
  await user.click(screen.getByRole('button', { name: /confirm booking/i }));

  expect(screen.getByRole('status')).toHaveTextContent(/booking confirmed/i);
  expect(screen.getByText('Labone, Accra')).toBeInTheDocument();
  expect(screen.getByText('Confirmed')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /seller app manage your fleet/i }));
  expect(screen.getByRole('heading', { name: /ready for the next job/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /online and accepting jobs/i })).toBeInTheDocument();
});

test('lets a seller submit onboarding details', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /seller app manage your fleet/i }));
  await user.type(screen.getByRole('textbox', { name: /business name/i }), 'AquaFlow Tankers');
  await user.type(screen.getByRole('textbox', { name: /seller phone/i }), '0244000000');
  await user.click(screen.getByRole('button', { name: /submit for review/i }));

  expect(screen.getByRole('status')).toHaveTextContent(/submitted/i);
});

test('shows human support channels to a buyer', () => {
  render(<App />);

  expect(screen.getByRole('link', { name: /call \+233 30 200 0123/i })).toHaveAttribute('href', 'tel:+233302000123');
  expect(screen.getByRole('link', { name: /support@aqualink.gh/i })).toHaveAttribute('href', 'mailto:support@aqualink.gh');
  expect(screen.getByRole('link', { name: /whatsapp 0545009046/i })).toHaveAttribute('href', 'https://wa.me/233545009046');
});

test('supports repeat booking and language switching', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /home · east legon/i }));
  expect(screen.getByRole('textbox', { name: /delivery location/i })).toHaveValue('East Legon, Accra');

  await user.selectOptions(screen.getByRole('combobox', { name: /language/i }), 'tw');
  expect(screen.getByRole('heading', { name: /ɛhe na yɛmfa nsuo nkɔ/i })).toBeInTheDocument();
});

test('shows AI business health signals in ops', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /ops console keep deliveries moving/i }));
  await user.type(screen.getByRole('textbox', { name: /admin username/i }), 'admin');
  await user.type(screen.getByLabelText(/admin password/i), 'demo-password');
  await user.click(screen.getByRole('button', { name: /open admin console/i }));
  expect(screen.getByRole('heading', { name: /business health signals/i })).toBeInTheDocument();
  expect(screen.getByText(/GH₵4,820 remains in escrow/i)).toBeInTheDocument();
});

test('refreshes a buyer live driver update', async () => {
  const user = userEvent.setup();
  render(<App />);

  expect(screen.getByText(/driver kojo · assigned seller/i)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /refresh position/i }));

  expect(screen.getByText(/driver kojo · en route from east legon/i)).toBeInTheDocument();
});

test('shows buyer commission and savings', () => {
  render(<App />);

  expect(screen.getByText(/buyer finance/i)).toBeInTheDocument();
  expect(screen.getByText('GH₵37.50')).toBeInTheDocument();
  expect(screen.getByText(/15% convenience fee/i)).toBeInTheDocument();
});

test('shows seller net payout and commission', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /seller app manage your fleet/i }));
  expect(screen.getByText(/seller finance/i)).toBeInTheDocument();
  expect(screen.getByText('GH₵6,904.40')).toBeInTheDocument();
  expect(screen.getByText(/20% seller fee/i)).toBeInTheDocument();
});

test('shows institution billing and ops revenue control tower', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /institution plan your supply/i }));
  expect(screen.getByText(/institution finance/i)).toBeInTheDocument();
  expect(screen.getAllByText('GH₵3,500').length).toBeGreaterThan(0);

  await user.click(screen.getByRole('button', { name: /ops console keep deliveries moving/i }));
  await user.type(screen.getByRole('textbox', { name: /admin username/i }), 'admin');
  await user.type(screen.getByLabelText(/admin password/i), 'demo-password');
  await user.click(screen.getByRole('button', { name: /open admin console/i }));
  expect(screen.getByText(/revenue control tower/i)).toBeInTheDocument();
  expect(screen.getByText('GH₵4,820')).toBeInTheDocument();
});
