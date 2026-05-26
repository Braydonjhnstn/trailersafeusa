import React, { useState } from 'react';
import './ComingSoon.css';
import { MAKES, getModelsForMake } from './equipmentData';

// Phone number shown in the top bar and hero. Update in one place.
const PHONE_DISPLAY = '(844) 728-7223';
const PHONE_TEL = '+18447287223';

/* ---- Inline icons (no extra dependencies) ---- */
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" fill="currentColor"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 2v3M17 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 3l8 3v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);
const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="m8.5 12 2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const HandshakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="m12 7 2-1.6a3 3 0 0 1 3.2-.3L22 7M2 7l2.8-1.9a3 3 0 0 1 3.2-.1L12 7m-9 1 4 4a1.8 1.8 0 0 0 2.5 0L12 9l2.5 1.7a2 2 0 0 0 2.4-.1L21 8M9.5 13l2 2m1-4 2.5 2.5m-3 1.5 1.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.8 7 12 7 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
/* Idaho state silhouette: narrow northern panhandle, straight western border,
   the Bitterroot/Montana diagonal on the northeast, and the wide flat south. */
const IdahoOutline = () => (
  <svg viewBox="20 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="cs-idaho">
    <path d="M40 6 L58 6 L62 52 L104 98 L104 122 L40 122 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M14 8.5h2.2V5.2c-.4 0-1.6-.2-3-.2-3 0-5 1.8-5 5.1V13H5.3v3.6H8.2V24h3.6v-7.4h2.8l.4-3.6h-3.2v-2.5c0-1 .3-1.8 1.9-1.8Z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2.5" y="6" width="19" height="12" rx="4" stroke="currentColor" strokeWidth="2"/>
    <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.94 8.5H4V20h2.94V8.5ZM5.47 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.4c0-3-1.6-4.4-3.7-4.4-1.7 0-2.5.95-2.9 1.6V8.5H10.5V20h2.94v-6.1c0-1.6.9-2 1.7-2 .9 0 1.92.6 1.92 2.1V20H20v-6.6Z"/>
  </svg>
);

function ComingSoon() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // NOTE: No backend / form destination is wired up yet (pending sign-off on where
    // pre-order submissions should go — email service, CRM, or serverless endpoint).
    // For now we just confirm receipt client-side so the flow can be reviewed.
    setSubmitted(true);
  };

  return (
    <div className="cs-page">
      {/* Top bar */}
      <header className="cs-topbar">
        <a href="#top" className="cs-brand" aria-label="TrailerSafe USA">
          <img src="/new.logo2.png" alt="TrailerSafe USA" className="cs-logo" />
        </a>
        <a href={`tel:${PHONE_TEL}`} className="cs-topbar-phone">
          <span className="cs-phone-circle"><PhoneIcon /></span>
          CALL US: <strong>{PHONE_DISPLAY}</strong>
        </a>
      </header>

      {/* Hero + form */}
      <main className="cs-main" id="top">
        <section
          className="cs-hero"
          style={{
            backgroundImage:
              'linear-gradient(100deg, rgba(8,9,11,0.92) 0%, rgba(8,9,11,0.6) 55%, rgba(8,9,11,0.4) 100%), url(/excavator.jpg)',
          }}
        >
          <div className="cs-hero-inner">
            <h1 className="cs-coming-soon">COMING SOON</h1>
            <span className="cs-accent-bar" />
            <p className="cs-hero-sub">
              Heavy-duty track covers for equipment transport.<br />
              Protect roadways. Reduce cleanup. Keep machines moving.
            </p>
            <div className="cs-hero-actions">
              <a href="#preorder" className="cs-btn cs-btn-primary">
                <CalendarIcon />
                <span className="cs-btn-stack">
                  <strong>PRE-ORDER NOW</strong>
                  <small>Be the first to get yours</small>
                </span>
              </a>
              <a href={`tel:${PHONE_TEL}`} className="cs-btn cs-btn-outline">
                <PhoneIcon />
                <span className="cs-btn-stack">
                  <strong>CALL US</strong>
                  <small>{PHONE_DISPLAY}</small>
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="cs-form-panel" id="preorder">
          <h2 className="cs-form-title">PRE-<span className="cs-accent">ORDER</span> YOURS TODAY</h2>
          <p className="cs-form-sub">
            Pre-order now to reserve your track covers.<br />
            We'll notify you as soon as they're ready to ship.
          </p>

          {submitted ? (
            <div className="cs-form-success" role="status">
              <CheckIcon />
              <h3>Thank you — your request is in.</h3>
              <p>We've received your pre-order request and will reach out as soon as your track covers are ready to ship.</p>
            </div>
          ) : (
            <form className="cs-form" onSubmit={handleSubmit}>
              <div className="cs-form-row">
                <input type="text" name="fullName" placeholder="Full Name *" aria-label="Full Name" required />
                <input type="text" name="company" placeholder="Company / Organization *" aria-label="Company or Organization" required />
              </div>
              <div className="cs-form-row">
                <input type="tel" name="phone" placeholder="Phone Number *" aria-label="Phone Number" required />
                <input type="email" name="email" placeholder="Email Address *" aria-label="Email Address" required />
              </div>

              <select
                name="manufacturer"
                aria-label="Equipment Manufacturer"
                value={make}
                onChange={(e) => { setMake(e.target.value); setModel(''); }}
                required
              >
                <option value="" disabled>Equipment Manufacturer *</option>
                {MAKES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>

              <select
                name="model"
                aria-label="Machine Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!make}
                required
              >
                <option value="" disabled>Machine Model *</option>
                {getModelsForMake(make).map((mod) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>

              <select name="quantity" aria-label="Quantity Needed" defaultValue="" required>
                <option value="" disabled>Quantity Needed *</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6-10">6–10</option>
                <option value="10+">10+</option>
              </select>

              <textarea name="message" placeholder="Additional Message" aria-label="Additional Message" rows="2" />

              <button type="submit" className="cs-btn cs-btn-primary cs-btn-submit">
                <SendIcon />
                SUBMIT PRE-ORDER REQUEST
              </button>

              <p className="cs-privacy-note">
                <LockIcon />
                We respect your privacy. Your information will never be shared.
              </p>
            </form>
          )}
        </section>
      </main>

      {/* Feature strip */}
      <section className="cs-features">
        <div className="cs-feature">
          <ShieldIcon />
          <div>
            <h3>PROTECT WHAT MOVES</h3>
            <p>Prevent damage to roads and worksites.</p>
          </div>
        </div>
        <div className="cs-feature">
          <GearIcon />
          <div>
            <h3>BUILT TO PERFORM</h3>
            <p>Engineered for the toughest conditions and heavy use.</p>
          </div>
        </div>
        <div className="cs-feature">
          <CheckIcon />
          <div>
            <h3>EASY TO USE</h3>
            <p>Fast installation. Secure fit. Get on the road with confidence.</p>
          </div>
        </div>
        <div className="cs-feature">
          <HandshakeIcon />
          <div>
            <h3>DEALER INQUIRIES WELCOME</h3>
            <p>Partner with TrailerSafe USA. Let's build safer roads together.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-footer-main">
          <div className="cs-footer-brand">
            <img src="/new.logo2.png" alt="TrailerSafe USA" className="cs-logo" />
            <p>Track covers built to protect roadways and keep jobsites moving.</p>
            <div className="cs-socials" aria-label="Social media">
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="YouTube"><YoutubeIcon /></a>
              <a href="#" aria-label="LinkedIn"><LinkedinIcon /></a>
            </div>
          </div>

          <nav className="cs-footer-col" aria-label="Products">
            <h4>PRODUCTS</h4>
            <a href="#">Track Covers</a>
            <a href="#">Accessories</a>
            <a href="#">Size Guide</a>
          </nav>
          <nav className="cs-footer-col" aria-label="Company">
            <h4>COMPANY</h4>
            <a href="#">About Us</a>
            <a href="#">Why TrailerSafe</a>
            <a href="#">Contact Us</a>
          </nav>
          <nav className="cs-footer-col" aria-label="Resources">
            <h4>RESOURCES</h4>
            <a href="#">Installation Guide</a>
            <a href="#">Product Docs</a>
            <a href="#">FAQs</a>
          </nav>

          <div className="cs-footer-hq">
            <div className="cs-hq-head"><PinIcon /> <span>HEADQUARTERED IN<br /><strong>EMMETT, IDAHO</strong></span></div>
            <p>Proudly designed and supported in the USA.</p>
            <IdahoOutline />
          </div>
        </div>

        <div className="cs-footer-bottom">
          <span>© {new Date().getFullYear()} TrailerSafe USA. All rights reserved.</span>
          <span className="cs-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default ComingSoon;
