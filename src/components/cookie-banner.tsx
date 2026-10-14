import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

const KEY = 'smv-cookie-consent';
const SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;

/** Reads the stored choice: 'accepted' | 'rejected' | null (expired or missing). */
export function getCookieConsent(): 'accepted' | 'rejected' | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { value, at } = JSON.parse(raw);
    if (Date.now() - at > SIX_MONTHS) return null;
    return value;
  } catch { return null; }
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!getCookieConsent()) setShow(true); }, []);
  const choose = (value: 'accepted' | 'rejected') => {
    try { localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() })); } catch { /* storage unavailable */ }
    setShow(false);
  };
  if (!show) return null;
  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Preferenze cookie">
      <p>Usiamo cookie tecnici per far funzionare il sito. Altri cookie solo con il tuo consenso. <Link to="/cookie-policy">Cookie Policy</Link></p>
      <div className="cookie-actions">
        <Button variant="outline" onClick={() => choose('rejected')}>Rifiuta</Button>
        <Button onClick={() => choose('accepted')}>OK, accetta</Button>
      </div>
    </div>
  );
}
