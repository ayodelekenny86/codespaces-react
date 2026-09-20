import { useCallback, useState } from 'react';

export const initialOrders = [
  { id: 'AQ-1048', location: 'East Legon, Accra', volume: '2,000 gal', status: 'Delivered', payment: 'Released', date: 'Today, 09:42', price: 'GH₵250' },
  { id: 'AQ-1032', location: 'Cantonments, Accra', volume: '1,000 gal', status: 'Delivered', payment: 'Released', date: 'Jun 18, 14:20', price: 'GH₵250' },
];

const initialBooking = { location: '', volume: '2,000 gallons', window: 'As soon as possible', payment: 'Mobile money' };

const initialSavedAddresses = ['Home · East Legon, Accra', 'Office · Cantonments, Accra'];

/**
 * Owns booking form state, the order list, saved addresses and the
 * driver-position update shown on the buyer and seller workspaces.
 */
export function useBooking({ email, onNotice }) {
  const [orders, setOrders] = useState(initialOrders);
  const [booking, setBooking] = useState(initialBooking);
  const [savedAddresses, setSavedAddresses] = useState(initialSavedAddresses);
  const [driverUpdate, setDriverUpdate] = useState('Driver Kojo · assigned seller · ETA 18 min');

  const updateBooking = useCallback((event) => {
    const { name, value } = event.target;
    setBooking((current) => ({ ...current, [name]: value }));
  }, []);

  const requestDelivery = useCallback((event) => {
    event.preventDefault();
    if (!booking.location.trim()) {
      onNotice('Add a delivery location to continue.');
      return;
    }
    const { location, volume } = booking;
    setBooking((current) => ({ ...current, location: '' }));
    setOrders((items) => [
      { id: 'AQ-1051', location, volume: volume.replace(' gallons', ' gal'), status: 'Confirmed', payment: 'Held in escrow', date: 'Just now', price: 'GH₵250' },
      ...items,
    ]);
    onNotice('Booking confirmed at the discounted GH₵250 buyer price. Hubtel payment is held in escrow until delivery.');
  }, [booking, onNotice]);

  const repeatBooking = useCallback((address) => {
    setBooking((current) => ({ ...current, location: address.replace(/^.* · /, '') }));
    onNotice('Saved address loaded. Review the volume and confirm when ready.');
  }, [onNotice]);

  const refreshDriverUpdate = useCallback(() => {
    setDriverUpdate('Driver Kojo · En Route from East Legon · ETA 12 min');
    onNotice('Live delivery update received from the seller app.');
  }, [onNotice]);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((items) => items.map((item) => (item.id === orderId ? { ...item, status } : item)));
    onNotice(`Order ${orderId} is now ${status.toLowerCase()}.`);
  }, [onNotice]);

  const confirmDelivery = useCallback((orderId) => {
    setOrders((items) => items.map((item) => (item.id === orderId ? { ...item, payment: 'Released' } : item)));
    onNotice('Delivery confirmed. Escrow funds released to the seller.');
  }, [onNotice]);

  const requestRefund = useCallback((orderId) => {
    onNotice(`Refund request opened for ${orderId}. Ops will review it and email ${email} with the decision.`);
  }, [email, onNotice]);

  return {
    orders,
    booking,
    updateBooking,
    requestDelivery,
    repeatBooking,
    savedAddresses,
    setSavedAddresses,
    driverUpdate,
    refreshDriverUpdate,
    updateOrderStatus,
    confirmDelivery,
    requestRefund,
  };
}

export default useBooking;
