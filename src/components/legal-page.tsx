import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export const LEGAL_OWNER = 'Strano Ma Vero Di Zoja Manuelito – Via Po 1, 35135 Padova (PD) – P.IVA 02682910282';

export function LegalPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <main className="legal-page section-space">
      <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>{title}</span></div>
      <div className="eyebrow">INFORMAZIONI LEGALI</div>
      <h1>{title}</h1>
      {intro && <p className="legal-intro">{intro}</p>}
      <div className="legal-body">{children}</div>
      <nav className="legal-links" aria-label="Pagine legali">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/cookie-policy">Cookie Policy</Link>
        <Link to="/termini-e-condizioni">Termini e Condizioni</Link>
      </nav>
    </main>
  );
}

export function legalHead(title: string, description: string, path: string) {
  const url = `https://basexpizza.com${path}`;
  return {
    meta: [
      { title: `${title} | Strano Ma Vero!` },
      { name: 'description', content: description },
      { property: 'og:title', content: `${title} | Strano Ma Vero!` },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}
