import { useState } from 'react';
import './App.css';

const roles = [
  ['buyer', 'Buyer app', 'Book reliable water'],
  ['seller', 'Seller app', 'Manage your fleet'],
  ['institution', 'Institution', 'Plan your supply'],
  ['ops', 'Admin', 'Authorized operations access'],
];

const languages = [
  ['en', 'English'],
  ['tw', 'Twi'],
  ['ha', 'Hausa'],
  ['ee', 'Ewe'],
  ['gaa', 'Ga'],
  ['fr', 'Français'],
];

const translations = {
  en: { buyer: 'Buyer app', seller: 'Seller app', institution: 'Institution', ops: 'Admin', book: 'Confirm booking', location: 'Where should we deliver?', recent: 'Recent deliveries', support: 'Need an agent?' },
  tw: { buyer: 'Adetɔ app', seller: 'Ogufo app', institution: 'Ahyehyɛde', ops: 'Dwumadie console', book: 'Si booking no so', location: 'Ɛhe na yɛmfa nsuo nkɔ?', recent: 'Nsu a wɔde aba nnansa yi', support: 'Wo pɛ ɔboafoɔ?' },
  ha: { buyer: 'Manhajar mai siya', seller: 'Manhajar mai sayarwa', institution: 'Cibiyar aiki', ops: 'Ofishin aiki', book: 'Tabbatar da oda', location: 'Ina za mu kai ruwa?', recent: 'Isarwa na baya-bayan nan', support: 'Kana bukatar wakili?' },
  ee: { buyer: 'Asiɖa ƒe app', seller: 'Aƒetɔ ƒe app', institution: 'Dɔwɔƒe', ops: 'Dɔdzikpɔla', book: 'Ɖoɖo ƒe ŋutɔŋutɔ', location: 'Afikae míatsɔ tsi ayi?', recent: 'Nusiwo mítsɔ va fifia', support: 'Èhiã ame aɖe ƒe kpekpeɖeŋu?' },
  gaa: { buyer: 'Shishi app', seller: 'Okai app', institution: 'Shishi klɛ', ops: 'Ops klɛ', book: 'Confirm booking', location: 'Nɔɔ ni yɛkɛ nɔɔ?', recent: 'Nɔɔ nɔɔ nɔɔ', support: 'Ohiɛ agent?' },
  fr: { buyer: 'Application acheteur', seller: 'Application vendeur', institution: 'Institution', ops: 'Console opérations', book: 'Confirmer la réservation', location: 'Où devons-nous livrer ?', recent: 'Livraisons récentes', support: 'Besoin d’un agent ?' },
};

const initialOrders = [
  { id: 'AQ-1048', location: 'East Legon, Accra', volume: '2,000 gal', status: 'Delivered', payment: 'Released', date: 'Today, 09:42', price: 'GH₵250' },
  { id: 'AQ-1032', location: 'Cantonments, Accra', volume: '1,000 gal', status: 'Delivered', payment: 'Released', date: 'Jun 18, 14:20', price: 'GH₵250' },
];

const finance = {
  buyer: { transaction: 'GH₵250', fee: 'GH₵37.50', feeRate: '15%', savings: 'GH₵50.00', wallet: 'GH₵24.50' },
  seller: { gross: 'GH₵8,420', commission: 'GH₵1,684.00', commissionRate: '20%', bonus: 'GH₵168.40', net: 'GH₵6,904.40' },
  institution: { plan: 'GH₵3,500', nextInvoice: '21 Sep 2026', monthSpend: 'GH₵3,500', deliveries: '14' },
};

function App() {
  const [role, setRole] = useState('buyer');
  const [orders, setOrders] = useState(initialOrders);
  const [booking, setBooking] = useState({ location: '', volume: '2,000 gallons', window: 'As soon as possible', payment: 'Mobile money' });
  const [notice, setNotice] = useState('');
  const [buyerAuthenticated, setBuyerAuthenticated] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [available, setAvailable] = useState(true);
  const [authStep, setAuthStep] = useState('verified');
  const [email, setEmail] = useState('alex@example.com');
  const [sellerProfile, setSellerProfile] = useState({ business: '', phone: '', vehicle: '', capacity: '2,000 gallons', document: 'ID document not uploaded' });
  const [sellerApproved, setSellerApproved] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([{ from: 'ai', text: 'Hi Alex. I can help compare delivery options, explain an order, or flag an ops risk.' }]);
  const [language, setLanguage] = useState('en');
  const [region, setRegion] = useState('Accra');
  const [savedAddresses, setSavedAddresses] = useState(['Home · East Legon, Accra', 'Office · Cantonments, Accra']);
  const [driverUpdate, setDriverUpdate] = useState('Driver Kojo · assigned seller · ETA 18 min');
  const t = translations[language];

  function updateBooking(event) {
    setBooking({ ...booking, [event.target.name]: event.target.value });
  }

  function requestDelivery(event) {
    event.preventDefault();
    if (!booking.location.trim()) {
      setNotice('Add a delivery location to continue.');
      return;
    }
    setBooking({ ...booking, location: '' });
    setOrders([{ id: 'AQ-1051', location: booking.location, volume: booking.volume.replace(' gallons', ' gal'), status: 'Confirmed', payment: 'Held in escrow', date: 'Just now', price: 'GH₵250' }, ...orders]);
    setNotice('Booking confirmed at the discounted GH₵250 buyer price. Hubtel payment is held in escrow until delivery.');
  }

  function repeatBooking(address) {
    setBooking({ ...booking, location: address.replace(/^.* · /, '') });
    setNotice('Saved address loaded. Review the volume and confirm when ready.');
  }

  function refreshDriverUpdate() {
    setDriverUpdate('Driver Kojo · En Route from East Legon · ETA 12 min');
    setNotice('Live delivery update received from the seller app.');
  }

  function updateOrderStatus(orderId, status) {
    setOrders((items) => items.map((item) => item.id === orderId ? { ...item, status } : item));
    setNotice(`Order ${orderId} is now ${status.toLowerCase()}.`);
  }

  function confirmDelivery(orderId) {
    setOrders((items) => items.map((item) => item.id === orderId ? { ...item, payment: 'Released' } : item));
    setNotice('Delivery confirmed. Escrow funds released to the seller.');
  }

  function requestRefund(orderId) {
    setNotice(`Refund request opened for ${orderId}. Ops will review it and email ${email} with the decision.`);
  }

  function sendOtp() {
    setAuthStep('otp');
    setNotice(`A verification code was sent to ${email}.`);
  }

  function verifyOtp() {
    setAuthStep('verified');
    setNotice('Email verified. Your account is ready to book.');
  }

  function showNotice(message) {
    setNotice(message);
  }

  function askAi(event) {
    event.preventDefault();
    const question = aiInput.trim();
    if (!question) return;
    const lowerQuestion = question.toLowerCase();
    let answer = 'I can help with bookings, delivery status, pricing, rewards, seller performance, or operations. What should we look at?';
    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost')) answer = 'The standard water price is GH₵300, with a buyer discount to GH₵250. The 15% buyer commission is GH₵37.50 and Hubtel payment is held in escrow.';
    if (lowerQuestion.includes('status') || lowerQuestion.includes('order')) answer = 'Your newest order is confirmed. A seller can move it to En Route, then Delivered. You release payment only after confirming receipt.';
    if (lowerQuestion.includes('dispatch') || lowerQuestion.includes('seller')) answer = 'Priority recommendation: assign AQ-1051 to the nearest verified seller with a 4.8+ rating and a 96%+ completion rate. This minimizes late-delivery risk.';
    if (lowerQuestion.includes('forecast') || lowerQuestion.includes('demand')) answer = 'Tomorrow’s demand signal is strongest in East Legon and Osu between 07:00–10:00. Pre-position 6 available trucks and keep 2 as reserve capacity.';
    if (lowerQuestion.includes('receipt')) answer = 'Your receipt is available in Recent deliveries. Choose Receipt on a completed order to download or email the Hubtel payment record.';
    if (lowerQuestion.includes('driver') || lowerQuestion.includes('position') || lowerQuestion.includes('eta')) answer = 'For an En Route order, choose Driver position in Recent deliveries. The seller app shares the latest ETA; AquaLink does not expose an unverified live map.';
    if (lowerQuestion.includes('refund')) { answer = 'I can open a refund request for AQ-1048. Ops will review the order evidence and email you with the decision.'; requestRefund('AQ-1048'); }
    if (lowerQuestion.includes('support') || lowerQuestion.includes('agent')) answer = 'You can call 0545009046, email support@aqualink.gh, message WhatsApp at 0545009046, or open a ticket from the Human support card.';
    if (language !== 'en') answer = `${translations[language].support} · ${answer}`;
    setAiMessages((messages) => [...messages, { from: 'user', text: question }, { from: 'ai', text: answer }]);
    setAiInput('');
  }

  function loginAdmin(event) {
    event.preventDefault();
    if (adminCredentials.username.trim() && adminCredentials.password.trim()) {
      setAdminAuthenticated(true);
      setNotice('Admin session verified. Access is logged for this demo workspace.');
    } else setNotice('Enter both admin username and password.');
  }

  function downloadReport(kind) {
    const report = { report: kind, generatedAt: new Date().toISOString(), region, demand: [{ area: 'East Legon', share: '31%', peak: '07:00–10:00', recommendation: 'Stage 6 trucks' }, { area: 'Osu', share: '24%', peak: '07:00–10:00', recommendation: 'Stage 4 trucks' }, { area: 'Low demand zones', share: '18%', peak: 'After 14:00', recommendation: 'Reduce idle capacity' }], paymentsPending: 'GH₵4,820', revenueAtRisk: 'GH₵1,240', interventions: 'Redeploy drivers, review escrow, contact dissatisfied buyers' };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `aqualink-${kind.toLowerCase().replaceAll(' ', '-')}-${region.toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    setNotice(`${kind} report downloaded for ${region}.`);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="app-logo" href="#main" aria-label="AquaLink dashboard"><span>A</span>Aqua<strong>Link</strong></a>
        <div className="workspace-label">WORKSPACE</div>
        <div className="role-list">
          {roles.map(([key, label, description]) => (
            <button className={`role-button ${role === key ? 'active' : ''}`} key={key} type="button" onClick={() => { setRole(key); setNotice(''); }}>
              <span className={`role-icon ${key}`} aria-hidden="true">{key === 'buyer' ? '⌂' : key === 'seller' ? '↗' : key === 'institution' ? '▦' : '◈'}</span>
              <span><b>{label}</b><small>{description}</small></span>
            </button>
          ))}
        </div>
        <div className="sidebar-bottom"><button className="sidebar-link" type="button" onClick={() => showNotice('Help request received. Our support team will call you back shortly.')}><span>?</span>Help & support</button><div className="profile"><span className="avatar">AK</span><span><b>Alex K.</b><small>Accra, Ghana</small></span><span className="more">•••</span></div></div>
      </aside>

      <main className="main-content" id="main">
        <header className="topbar"><div className="breadcrumb"><span>AquaLink</span><i>/</i><strong>{t[role]}</strong><select aria-label="Operating region" value={region} onChange={(event) => { setRegion(event.target.value); showNotice(`Workspace switched to ${event.target.value}.`); }}><option>Accra</option><option>Kumasi</option><option>Takoradi</option><option>Tema</option><option>Lagos</option><option>Abidjan</option></select></div><div className="topbar-actions"><label className="language-picker"><span>文</span><select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value)}>{languages.map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label><button className={`ai-trigger ${aiOpen ? 'active' : ''}`} type="button" onClick={() => setAiOpen(!aiOpen)}><span>✦</span> Aqua AI</button><button className="icon-button" type="button" aria-label="Notifications" onClick={() => showNotice('You have 2 new delivery updates.')}><span>♧</span><em>2</em></button><button className="profile mobile-profile" type="button"><span className="avatar">AK</span></button></div></header>
        {notice && <div className="notice" role="status"><span>✓</span>{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button></div>}
        {aiOpen && <AiPanel role={role} input={aiInput} setInput={setAiInput} messages={aiMessages} askAi={askAi} close={() => setAiOpen(false)} />}
        {role === 'buyer' && (buyerAuthenticated ? <><BuyerView booking={booking} updateBooking={updateBooking} requestDelivery={requestDelivery} orders={orders} showNotice={showNotice} authStep={authStep} email={email} setEmail={setEmail} sendOtp={sendOtp} verifyOtp={verifyOtp} confirmDelivery={confirmDelivery} requestRefund={requestRefund} savedAddresses={savedAddresses} repeatBooking={repeatBooking} setSavedAddresses={setSavedAddresses} t={t} driverUpdate={driverUpdate} refreshDriverUpdate={refreshDriverUpdate} /><BuyerFinance showNotice={showNotice} /></> : <BuyerAccessGate onVerified={() => setBuyerAuthenticated(true)} />)}
        {role === 'seller' && (sellerApproved ? <SellerView available={available} setAvailable={setAvailable} showNotice={showNotice} orders={orders} updateOrderStatus={updateOrderStatus} sellerProfile={sellerProfile} setSellerProfile={setSellerProfile} /> : <SellerAccessGate sellerProfile={sellerProfile} setSellerProfile={setSellerProfile} onApproved={() => setSellerApproved(true)} />)}
        {role === 'seller' && <SellerFinance showNotice={showNotice} />}
        {role === 'seller' && <LiveAgentCard role="seller" showNotice={showNotice} />}
        {role === 'institution' && <InstitutionView showNotice={showNotice} />}
        {role === 'institution' && <InstitutionFinance showNotice={showNotice} />}
        {role === 'institution' && <InstitutionAgentCard showNotice={showNotice} />}
        {role === 'ops' && (adminAuthenticated ? <OpsView downloadReport={downloadReport} /> : <AdminAccessGate credentials={adminCredentials} setCredentials={setAdminCredentials} loginAdmin={loginAdmin} />)}
        {role === 'ops' && adminAuthenticated && <ReportActions downloadReport={downloadReport} />}
        {role === 'ops' && adminAuthenticated && <OperationalRiskPanel />}
        {role === 'ops' && adminAuthenticated && <RevenueFinance showNotice={showNotice} />}
        </main>
    </div>
  );
}

function BuyerAccessGate({ onVerified }) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone');
  const [otp, setOtp] = useState('');
  return <section className="access-gate panel"><span className="access-lock">⌁</span><p className="eyebrow">Verified buyer access</p><h1>Verify your phone to view your orders.</h1><p>Enter your phone number and AquaLink will send a one-time code before showing wallet, order, and receipt details.</p>{step === 'phone' ? <form onSubmit={(event) => { event.preventDefault(); if (phone.trim()) setStep('otp'); }}><input aria-label="Buyer phone number" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" inputMode="tel" /><button className="primary-button" type="submit">Send OTP →</button></form> : <form onSubmit={(event) => { event.preventDefault(); if (otp.trim()) onVerified(); }}><input aria-label="Buyer OTP" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Enter OTP sent to your phone" inputMode="numeric" /><button className="primary-button" type="submit">Verify OTP →</button></form>}<small>OTP delivery is simulated in this frontend demo. Production should use a secure SMS/USSD provider and never store OTPs in the browser.</small></section>;
}

function SellerAccessGate({ sellerProfile, setSellerProfile, onApproved }) {
  const [submitted, setSubmitted] = useState(false);
  function update(event) {
    setSellerProfile({ ...sellerProfile, [event.target.name]: event.target.value });
  }
  return <section className="access-gate panel seller-gate"><span className="access-lock">↗</span><p className="eyebrow">Seller signup & approval</p><h1>{submitted ? 'Application awaiting approval.' : 'Create your seller account.'}</h1><p>{submitted ? 'AquaLink Ops must verify your identity, vehicle, and water-source documents before you can receive jobs.' : 'Complete your business and vehicle details. Your seller workspace stays locked until Admin approves the application.'}</p>{!submitted ? <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><input aria-label="Business name" name="business" value={sellerProfile.business} onChange={update} placeholder="Business or trading name" /><input aria-label="Seller phone" name="phone" value={sellerProfile.phone} onChange={update} placeholder="Registered phone number" /><input aria-label="Vehicle registration" name="vehicle" value={sellerProfile.vehicle} onChange={update} placeholder="Vehicle registration" /><select aria-label="Tank capacity" name="capacity" value={sellerProfile.capacity} onChange={update}><option>1,000 gallons</option><option>2,000 gallons</option><option>5,000 gallons</option></select><button className="primary-button" type="submit">Submit signup for review →</button></form> : <div className="pending-approval"><strong>Pending manual review</strong><small>Demo control: an authorized Admin would approve this application from the Admin console.</small><button className="primary-button" type="button" onClick={onApproved}>Approve seller for demo →</button></div>}<small>Required controls: ID, vehicle registration, tank capacity, water-source evidence, approval audit trail, and payout verification.</small></section>;
}

function AdminAccessGate({ credentials, setCredentials, loginAdmin }) {
  return <section className="access-gate panel admin-gate"><span className="access-lock">▣</span><p className="eyebrow">Restricted admin area</p><h1>Operations data needs a verified admin.</h1><p>Sign in with your admin username and password. Every report and operational action should be audit logged in production.</p><form onSubmit={loginAdmin}><input aria-label="Admin username" value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} placeholder="Admin username" autoComplete="username" /><input aria-label="Admin password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="Admin password" type="password" autoComplete="current-password" /><button className="primary-button" type="submit">Open admin console →</button></form><small>Production requirement: use server-side sessions, MFA, RBAC, encrypted storage, and audit logs. No password is stored by this demo.</small></section>;
}

function ReportActions({ downloadReport }) {
  return <section className="report-actions"><span><strong>Intervention reporting</strong><small>Export demand and deployment data for partners and internal planning.</small></span><button className="outline-button" type="button" onClick={() => downloadReport('Regional demand report')}>Download JSON report ↓</button><button className="primary-button" type="button" onClick={() => downloadReport('Partner intervention brief')}>Create partner brief →</button></section>;
}

function PageHeader({ eyebrow, title, copy, action }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-copy">{copy}</p></div>{action}</div>;
}

function BuyerView({ booking, updateBooking, requestDelivery, orders, showNotice, authStep, email, setEmail, sendOtp, verifyOtp, confirmDelivery, requestRefund, savedAddresses, repeatBooking, setSavedAddresses, t, driverUpdate, refreshDriverUpdate }) {
  return <>
    <PageHeader eyebrow="Tuesday, 21 August 2026" title="Good morning, Alex." copy="Get your next delivery sorted in a few taps." action={<button className="outline-button" type="button" onClick={() => showNotice('Referral link copied to your clipboard.')}>↗ Invite a friend <span>+GH₵20</span></button>} />
    <section className="auth-strip panel"><div><span className="section-kicker">ACCOUNT & SECURITY</span><strong>{authStep === 'verified' ? 'Email verified' : 'Check your inbox'}</strong><small>{authStep === 'verified' ? 'OTP login enabled · no password required' : `We sent a 6-digit code to ${email}`}</small></div>{authStep === 'verified' ? <form className="auth-form" onSubmit={(event) => { event.preventDefault(); sendOtp(); }}><input aria-label="Email address" value={email} onChange={(event) => setEmail(event.target.value)} type="email" /><button className="outline-button" type="submit">Send OTP</button></form> : <form className="auth-form" onSubmit={(event) => { event.preventDefault(); verifyOtp(); }}><input aria-label="OTP code" placeholder="Enter 6-digit OTP" inputMode="numeric" /><button className="primary-button" type="submit">Verify</button></form>}</section>
    <section className="saved-addresses panel"><div><span className="section-kicker">FAST REBOOK</span><strong>Saved addresses</strong><small>Repeat a trusted delivery without typing it again.</small></div><div className="saved-address-list">{savedAddresses.map((address) => <button type="button" key={address} onClick={() => repeatBooking(address)}>⌖ {address}</button>)}<button type="button" onClick={() => { const address = 'New address · Tema, Ghana'; setSavedAddresses([...savedAddresses, address]); showNotice('New saved address added.'); }}>+ Add address</button></div></section>
    <div className="buyer-grid">
      <section className="panel booking-panel"><div className="panel-title"><div><span className="section-kicker">NEW BOOKING · {t.book}</span><h2>{t.location}</h2></div><span className="verified-pill">✓ Verified sellers</span></div><form onSubmit={requestDelivery}><label>Delivery location<div className="input-wrap"><span>⌖</span><input name="location" value={booking.location} onChange={updateBooking} placeholder="Enter an address or landmark" /></div></label><div className="form-row"><label>Water volume<select name="volume" value={booking.volume} onChange={updateBooking}><option>1,000 gallons</option><option>2,000 gallons</option><option>5,000 gallons</option></select></label><label>Delivery window<select name="window" value={booking.window} onChange={updateBooking}><option>As soon as possible</option><option>Today, 12:00–14:00</option><option>Tomorrow morning</option></select></label></div><div className="quote"><span><small>LIST PRICE · BUYER PRICE</small><strong>GH₵300 · GH₵250</strong></span><span className="quote-note">GH₵50 discount<br />No surge fees</span></div><label className="payment-label">Payment method<select name="payment" value={booking.payment} onChange={updateBooking}><option>Hubtel mobile money</option><option>Cash on delivery fallback</option></select></label><p className="escrow-note">Funds are held securely in escrow until you confirm receipt.</p><button className="primary-button full" type="submit">{t.book} <span>→</span></button></form></section>
      <div className="side-stack"><section className="panel rewards-panel"><div className="panel-title"><div><span className="section-kicker">YOUR REWARDS</span><h2>Silver tier</h2></div><span className="tier-badge">✦</span></div><div className="reward-progress"><strong>340</strong><span>/ 500 points to Gold</span><div><i /></div></div><div className="reward-foot"><span>2% cashback available</span><button type="button" onClick={() => showNotice('Your wallet balance is GH₵24.50.')}>View wallet →</button></div></section><LiveAgentCard role="buyer" driverUpdate={driverUpdate} refreshDriverUpdate={refreshDriverUpdate} showNotice={showNotice} /></div>
    </div>
    <section className="orders-section"><div className="section-heading"><div><span className="section-kicker">ACTIVITY</span><h2>{t.recent}</h2></div><button className="text-button" type="button" onClick={() => showNotice('Showing all delivery history.')}>View all →</button></div><div className="orders-table"><div className="table-head"><span>ORDER</span><span>LOCATION</span><span>VOLUME</span><span>STATUS</span><span>PAYMENT</span></div>{orders.map((order) => <div className="order-row" key={order.id}><strong>{order.id}<small>{order.date}</small></strong><span>{order.location}</span><span>{order.volume}</span><span><i className={`status ${order.status.toLowerCase()}`}>{order.status}</i>{order.status === 'En Route' && <button className="confirm-button" type="button" onClick={() => showNotice('Driver Kojo is 12 minutes away. Position updated from the seller app.')}>Driver position</button>}{order.status === 'Delivered' && order.payment !== 'Released' && <button className="confirm-button" type="button" onClick={() => confirmDelivery(order.id)}>Confirm receipt</button>}{order.status === 'Delivered' && <button className="confirm-button" type="button" onClick={() => showNotice(`Receipt for ${order.id} is ready to download or email.`)}>Receipt</button>}{order.status === 'Delivered' && <button className="confirm-button" type="button" onClick={() => requestRefund(order.id)}>Request refund</button>}</span><b>{order.payment}<small>{order.price}</small></b></div>)}</div></section><section className="support-card panel"><div><span className="section-kicker">HUMAN SUPPORT</span><h2>{t.support}</h2><p>Accra support: phone, email, WhatsApp, or a ticket for late deliveries, refunds, quality concerns, or payment receipts.</p></div><div className="support-actions"><a href="tel:+233302000123">☎ Call +233 30 200 0123</a><a href="mailto:support@aqualink.gh">✉ support@aqualink.gh</a><a href="https://wa.me/233545009046" target="_blank" rel="noreferrer">◌ WhatsApp 0545009046</a><button type="button" onClick={() => showNotice('Support ticket created. Reference: SUP-2048.')}>Open support ticket</button></div></section>
  </>;
}

function SellerView({ available, setAvailable, showNotice, orders, updateOrderStatus, sellerProfile, setSellerProfile }) {
  const activeOrder = orders.find((order) => order.id === 'AQ-1051');

  function updateProfile(event) {
    setSellerProfile({ ...sellerProfile, [event.target.name]: event.target.value });
  }

  return <><PageHeader eyebrow="Seller workspace · Accra" title="Ready for the next job?" copy="Keep your status current and turn more deliveries into income." action={<button className={`availability ${available ? 'online' : ''}`} type="button" onClick={() => { setAvailable(!available); showNotice(available ? 'You are now offline.' : 'You are back online and visible to buyers.'); }}><i />{available ? 'Online and accepting jobs' : 'Offline'}</button>} /><section className="seller-onboarding panel"><div><span className="section-kicker">SELLER ONBOARDING</span><h2>Complete your verification profile</h2><p>Ops manually reviews these details before you receive paid jobs.</p></div><form className="seller-form" onSubmit={(event) => { event.preventDefault(); showNotice('Seller profile submitted. Ops will review your documents within one business day.'); }}><input aria-label="Business name" name="business" value={sellerProfile.business} onChange={updateProfile} placeholder="Business name" /><input aria-label="Seller phone" name="phone" value={sellerProfile.phone} onChange={updateProfile} placeholder="Phone number" /><input aria-label="Vehicle registration" name="vehicle" value={sellerProfile.vehicle} onChange={updateProfile} placeholder="Vehicle registration" /><select aria-label="Tank capacity" name="capacity" value={sellerProfile.capacity} onChange={updateProfile}><option>1,000 gallons</option><option>2,000 gallons</option><option>5,000 gallons</option></select><select aria-label="Verification document" name="document" value={sellerProfile.document} onChange={updateProfile}><option>ID document not uploaded</option><option>ID document uploaded</option><option>ID + vehicle documents uploaded</option></select><button className="primary-button" type="submit">Submit for review →</button></form></section><div className="seller-stats"><div><span>THIS MONTH</span><strong>GH₵8,420</strong><small>↑ 18% vs last month</small></div><div><span>DELIVERIES</span><strong>52</strong><small>2% volume bonus unlocked</small></div><div><span>RATING</span><strong>4.8 <small>★</small></strong><small>Top performer status</small></div></div><section className="orders-section seller-jobs"><div className="section-heading"><div><span className="section-kicker">JOB QUEUE</span><h2>Incoming requests</h2></div><span className="queue-count">Manual dispatch</span></div>{['Osu, Oxford Street', 'Airport Residential', 'Cantonments'].map((location, index) => <div className="job-card" key={location}><span className="job-time">{index === 0 ? '2 min ago' : `${index + 3} min ago`}</span><div><strong>{location}</strong><p>{index === 1 ? '5,000 gallons' : '2,000 gallons'} · {index === 1 ? 'GH₵280' : 'GH₵150'}</p></div><button className="primary-button" type="button" onClick={() => { if (index === 0 && activeOrder?.status === 'En Route') updateOrderStatus('AQ-1051', 'Delivered'); else if (index === 0 && activeOrder?.status === 'Confirmed') updateOrderStatus('AQ-1051', 'En Route'); else showNotice(`Job accepted for ${location}. Navigation is ready.`); }}>{index === 0 && activeOrder?.status === 'En Route' ? 'Mark delivered →' : 'Accept job →'}</button></div>)}</section><section className="seller-mvp-note"><span>JOB LIFECYCLE</span><strong>Confirmed → En Route → Delivered</strong><small>Seller marks delivered on arrival. Buyer confirmation releases escrow.</small></section></>;
}

function LiveAgentCard({ role, driverUpdate, refreshDriverUpdate, showNotice }) {
  const buyer = role === 'buyer';
  return <section className="live-agent-card panel"><div className="live-agent-head"><span className="ai-label">● LIVE AGENT AI</span><span className="agent-online">Online</span></div><strong>{buyer ? driverUpdate : 'Your route is clear. 3 jobs are ready to accept.'}</strong><p>{buyer ? 'Updates are shared by the assigned seller. Ask for help at any time.' : 'I can prepare job notes, suggest the fastest route, and warn you about late-delivery risk.'}</p><div className="live-agent-actions">{buyer ? <button type="button" onClick={refreshDriverUpdate}>Refresh position</button> : <button type="button" onClick={() => showNotice('AI prepared a route brief: Osu → Airport Residential → Cantonments.')}>Prepare route brief</button>}<button type="button" onClick={() => showNotice('Live agent is reviewing this request.')}>Talk to agent</button></div></section>;
}

function InstitutionAgentCard({ showNotice }) {
  return <section className="live-agent-card panel institution-agent"><div className="live-agent-head"><span className="ai-label">✦ LIVE AGENT AI</span><span className="agent-online">Online</span></div><strong>Schedule optimizer is ready</strong><p>Demand is typically highest on weekday mornings. I can suggest recurring delivery windows, flag low reserve levels, and prepare a renewal summary.</p><div className="live-agent-actions"><button type="button" onClick={() => showNotice('AI recommendation: add one Friday delivery and keep 10,000 gallons reserve capacity.')}>Optimize schedule</button><button type="button" onClick={() => showNotice('Institution support has been notified.')}>Talk to agent</button></div></section>;
}

function InstitutionView({ showNotice }) {
  return <><PageHeader eyebrow="Institution workspace · Accra" title="Your supply, planned." copy="Keep your school, hospital, or hotel running with guaranteed water delivery." action={<button className="primary-button" type="button" onClick={() => showNotice('Our institutional team will contact you about plan changes.')}>Manage plan →</button>} /><div className="institution-hero"><div><span className="section-kicker">CURRENT PLAN</span><h2>Reliability Plus</h2><p>GH₵3,500 / month · renews 21 Sep 2026</p></div><div className="plan-status"><span>● Active</span><small>14 deliveries remaining</small></div></div><div className="institution-grid"><section className="panel schedule-panel"><div className="section-heading"><div><span className="section-kicker">UPCOMING</span><h2>Scheduled supply</h2></div><button className="text-button" type="button" onClick={() => showNotice('Schedule editor opened.')}>Edit schedule →</button></div>{['Wed 23 Aug · 08:00', 'Fri 25 Aug · 08:00', 'Mon 28 Aug · 08:00'].map((date) => <div className="schedule-row" key={date}><span className="calendar-icon">▦</span><div><strong>{date}</strong><small>5,000 gallons · Fixed rate</small></div><span className="status confirmed">Confirmed</span></div>)}</section><section className="panel quality-panel"><span className="section-kicker">QUALITY & COMPLIANCE</span><h2>Water quality</h2><div className="quality-score"><strong>100%</strong><span>certificates up to date</span></div><button className="outline-button" type="button" onClick={() => showNotice('Certificate archive download started.')}>Download certificates ↓</button></section></div></>;
}

function OpsView({ downloadReport }) {
  return <><PageHeader eyebrow="Admin dashboard · All regions" title="The network is moving." copy="Manually assign orders, approve sellers, resolve disputes, and keep certification current." action={<span className="live-console"><i /> Manual ops mode</span>} /><div className="ops-stats"><div><span>ORDERS TODAY</span><strong>124</strong><small>GH₵18,540 GMV</small></div><div><span>ACTIVE BUYERS / SELLERS</span><strong>1,248 / 86</strong><small className="positive">96.4% fulfillment</small></div><div><span>DISPUTES</span><strong>4</strong><small className="warning">Needs attention</small></div><div><span>QUALITY BADGES</span><strong>92%</strong><small>Current certifications</small></div></div><section className="ai-insights panel"><div><span className="ai-label">✦ AQUA AI INTELLIGENCE</span><h2>Tomorrow’s demand signal</h2><p>East Legon and Osu are likely to peak between 07:00–10:00. Pre-position 6 trucks and keep 2 in reserve to protect the 96.4% fulfillment rate.</p></div><div className="insight-metrics"><strong>+24%</strong><span>predicted morning demand</span><strong>6</strong><span>trucks to stage</span></div></section><div className="admin-grid"><section className="panel admin-panel"><div className="section-heading"><div><span className="section-kicker">DISPATCH VIEW</span><h2>Orders awaiting assignment</h2></div><span className="queue-count">Assisted matching</span></div>{['AQ-1051 · Labone, Accra', 'AQ-1050 · Osu, Accra', 'AQ-1049 · Kaneshie, Accra'].map((order) => <div className="admin-row" key={order}><span>{order}<small>Payment held in escrow · fixed price</small></span><button className="outline-button" type="button">Assign seller</button></div>)}</section><section className="panel admin-panel"><div className="section-heading"><div><span className="section-kicker">SELLER APPROVAL QUEUE</span><h2>Manual reviews</h2></div><span className="queue-count">3 pending</span></div>{['S-019 · ID + vehicle docs', 'S-021 · Water-source certificate', 'S-024 · New registration'].map((seller) => <div className="admin-row" key={seller}><span>{seller}<small>Uploaded by seller · awaiting review</small></span><button className="text-button" type="button">Review →</button></div>)}</section></div><div className="admin-grid"><section className="panel admin-panel"><div className="section-heading"><div><span className="section-kicker">DISPUTE INBOX</span><h2>Manual resolution</h2></div><button className="text-button" type="button">Open inbox →</button></div>{['AQ-1043 · Late delivery', 'AQ-1038 · Short volume'].map((issue) => <div className="admin-row" key={issue}><span>{issue}<small>Buyer flagged order · refund available</small></span><button className="outline-button" type="button">Resolve</button></div>)}</section><section className="panel admin-panel"><div className="section-heading"><div><span className="section-kicker">QUALITY CERTIFICATION</span><h2>Review documents</h2></div><span className="verified-pill">Badge workflow</span></div><div className="cert-card"><strong>S-019 · AquaFlow Tanker</strong><p>Certification uploaded 2 hours ago. Approve to publish the verified-water badge.</p><div><button className="primary-button" type="button">Approve badge</button><button className="text-button" type="button">Decline with reason</button></div></div></section></div></>;
}

function AiPanel({ role, input, setInput, messages, askAi, close }) {
  const quickActions = role === 'ops' ? ['Forecast demand', 'Optimize dispatch', 'Find service risks', 'Review refund queue'] : ['Explain my order', 'Check delivery price', 'Find my receipt', 'Track driver ETA', 'Request a refund'];
  return <section className="ai-panel" aria-label="Aqua AI assistant"><div className="ai-panel-head"><div><span className="ai-label">✦ AQUA AI</span><strong>{role === 'ops' ? 'Operations copilot' : 'Your water-delivery copilot'}</strong></div><button type="button" aria-label="Close Aqua AI" onClick={close}>×</button></div><div className="ai-messages">{messages.slice(-4).map((message, index) => <p className={message.from} key={`${message.from}-${index}`}>{message.text}</p>)}</div><div className="ai-quick-actions">{quickActions.map((action) => <button type="button" key={action} onClick={() => setInput(action)}>{action}</button>)}</div><form className="ai-form" onSubmit={askAi}><input aria-label="Ask Aqua AI" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about orders, pricing, or demand..." /><button type="submit">Ask <span>→</span></button></form><small className="ai-disclaimer">AI suggestions are decision support. Confirm payment, quality, and dispatch actions in the workspace.</small></section>;
}

function OperationalRiskPanel() {
  return <section className="operational-risk panel"><div className="section-heading"><div><span className="ai-label">✦ AQUA AI EARLY WARNING</span><h2>Business health signals</h2></div><span className="queue-count">Updated now</span></div><div className="risk-grid"><article><span className="risk-icon warning">!</span><div><strong>Seller slowdown</strong><p>S-019 declined 6 jobs this week. Estimated GMV exposure: GH₵420.</p></div><button type="button">Diagnose →</button></article><article><span className="risk-icon alert">◌</span><div><strong>Buyer dissatisfaction</strong><p>3 East Legon buyers reported late deliveries. Churn risk is rising.</p></div><button type="button">Open cohort →</button></article><article><span className="risk-icon good">✓</span><div><strong>Payment health</strong><p>GH₵4,820 remains in escrow across 31 orders. 4 need manual review.</p></div><button type="button">Review queue →</button></article></div></section>;
}

function BuyerFinance({ showNotice }) {
  return <section className="finance-workspace"><div className="finance-heading"><div><span className="section-kicker">BUYER FINANCE</span><h2>Your money, explained.</h2><p>Clear fees, savings, and wallet credits on every booking.</p></div><button className="outline-button" type="button" onClick={() => showNotice('Buyer statement ready: 8 bookings, GH₵1,170 spent, GH₵96.50 saved.')}>Download statement ↓</button></div><div className="finance-grid buyer-finance"><article><span>LAST TRANSACTION</span><strong>{finance.buyer.transaction}</strong><small>Water delivery · AQ-1048</small></article><article><span>AQUALINK FEE</span><strong>{finance.buyer.fee}</strong><small>{finance.buyer.feeRate} convenience fee</small></article><article><span>LOYALTY SAVINGS</span><strong>{finance.buyer.savings}</strong><small>Cashback + fixed-price savings</small></article><article><span>WALLET BALANCE</span><strong>{finance.buyer.wallet}</strong><small>Available for future bookings</small></article></div></section>;
}

function SellerFinance({ showNotice }) {
  return <section className="finance-workspace"><div className="finance-heading"><div><span className="section-kicker">SELLER FINANCE</span><h2>Know what you take home.</h2><p>Commission, bonuses, and payout timing are visible per month and per job.</p></div><button className="outline-button" type="button" onClick={() => showNotice('Seller payout statement downloaded for August 2026.')}>Download payout statement ↓</button></div><div className="finance-grid seller-finance"><article><span>GROSS EARNINGS</span><strong>{finance.seller.gross}</strong><small>52 completed deliveries</small></article><article><span>PLATFORM COMMISSION</span><strong>-{finance.seller.commission}</strong><small>{finance.seller.commissionRate} seller fee</small></article><article><span>PERFORMANCE BONUSES</span><strong>+{finance.seller.bonus}</strong><small>2% volume + rating incentives</small></article><article className="finance-highlight"><span>ESTIMATED NET PAYOUT</span><strong>{finance.seller.net}</strong><small>Next payout: daily batch · within 24 hours</small></article></div></section>;
}

function InstitutionFinance({ showNotice }) {
  return <section className="finance-workspace"><div className="finance-heading"><div><span className="section-kicker">INSTITUTION FINANCE</span><h2>Plan the month with confidence.</h2><p>Subscription billing, invoice history, and delivery usage in one view.</p></div><button className="outline-button" type="button" onClick={() => showNotice('Invoice INV-2026-08 downloaded.')}>Download invoice ↓</button></div><div className="finance-grid institution-finance"><article className="finance-highlight"><span>ACTIVE PLAN</span><strong>{finance.institution.plan}<small> / month</small></strong><small>Reliability Plus</small></article><article><span>NEXT INVOICE</span><strong>{finance.institution.nextInvoice}</strong><small>Auto-pay · Hubtel</small></article><article><span>MONTHLY COMMITMENT</span><strong>{finance.institution.monthSpend}</strong><small>Fixed pricing protected</small></article><article><span>DELIVERIES REMAINING</span><strong>{finance.institution.deliveries}</strong><small>Included this cycle</small></article></div></section>;
}

function RevenueFinance({ showNotice }) {
  return <section className="finance-workspace"><div className="finance-heading"><div><span className="section-kicker">REVENUE CONTROL TOWER</span><h2>Money moving through the network.</h2><p>Track marketplace take, pending escrow, payout exposure, and revenue mix.</p></div><button className="outline-button" type="button" onClick={() => showNotice('Revenue report generated with payment, GMV, and commission detail.')}>Generate report ↓</button></div><div className="finance-grid ops-finance"><article><span>GMV TODAY</span><strong>GH₵18,540</strong><small>124 completed orders</small></article><article><span>BUYER COMMISSIONS</span><strong>GH₵1,020</strong><small>40% of revenue mix</small></article><article><span>SELLER COMMISSIONS</span><strong>GH₵892</strong><small>35% of revenue mix</small></article><article><span>INSTITUTIONAL MRR</span><strong>GH₵637</strong><small>25% of revenue mix</small></article><article className="finance-warning"><span>PENDING ESCROW</span><strong>GH₵4,820</strong><small>31 orders · review before payout</small></article><article className="finance-warning"><span>REVENUE AT RISK</span><strong>GH₵1,240</strong><small>Late delivery + dispute exposure</small></article></div></section>;
}

export default App;
