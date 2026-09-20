import { useCallback, useState } from 'react';

const initialSellerProfile = { business: '', phone: '', vehicle: '', capacity: '2,000 gallons', document: 'ID document not uploaded' };

/**
 * Owns role switching, the workspace notice banner, and the access-gate state
 * for buyer, seller and admin (ops) sessions.
 */
export function useAuth() {
  const [role, setRole] = useState('buyer');
  const [notice, setNotice] = useState('');
  const [buyerAuthenticated, setBuyerAuthenticated] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [authStep, setAuthStep] = useState('verified');
  const [email, setEmail] = useState('alex@example.com');
  const [sellerProfile, setSellerProfile] = useState(initialSellerProfile);
  const [sellerApproved, setSellerApproved] = useState(false);
  const [available, setAvailable] = useState(true);

  const showNotice = useCallback((message) => setNotice(message), []);
  const dismissNotice = useCallback(() => setNotice(''), []);

  const selectRole = useCallback((nextRole) => {
    setRole(nextRole);
    setNotice('');
  }, []);

  const loginAdmin = useCallback((event) => {
    event.preventDefault();
    if (adminCredentials.username.trim() && adminCredentials.password.trim()) {
      setAdminAuthenticated(true);
      setNotice('Admin session verified. Access is logged for this demo workspace.');
    } else {
      setNotice('Enter both admin username and password.');
    }
  }, [adminCredentials]);

  const sendOtp = useCallback(() => {
    setAuthStep('otp');
    setNotice(`A verification code was sent to ${email}.`);
  }, [email]);

  const verifyOtp = useCallback(() => {
    setAuthStep('verified');
    setNotice('Email verified. Your account is ready to book.');
  }, []);

  return {
    role,
    selectRole,
    notice,
    showNotice,
    dismissNotice,
    buyerAuthenticated,
    setBuyerAuthenticated,
    adminAuthenticated,
    adminCredentials,
    setAdminCredentials,
    loginAdmin,
    authStep,
    email,
    setEmail,
    sendOtp,
    verifyOtp,
    sellerProfile,
    setSellerProfile,
    sellerApproved,
    setSellerApproved,
    available,
    setAvailable,
  };
}

export default useAuth;
