import { createFileRoute, Link } from '@tanstack/react-router';
import { LegalPage, legalHead } from '@/components/legal-page';

export const Route = createFileRoute('/privacy-policy')({
  head: () => legalHead('Privacy Policy', 'Informativa sul trattamento dei dati personali di Strano Ma Vero ai sensi del GDPR (Reg. UE 2016/679).', '/privacy-policy'),
  component: () => (
    <LegalPage title="Privacy Policy" intro="Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR).">
      <h2>Titolare del trattamento</h2>
      <p>Zoja Manuelito, titolare della ditta individuale Strano Ma Vero, Via Po 1, 35135 Padova (PD), P.IVA 02682910282. Contatti: tel. <a href="tel:+39049604748">+39 049 604748</a> – email: <a href="mailto:manolo.zoja@gmail.com">manolo.zoja@gmail.com</a></p>
      <h2>Dati trattati</h2>
      <p>Nome, cognome, indirizzo di consegna, telefono, email, dettagli ordine, dati di navigazione e cookie.</p>
      <h2>Finalità e basi giuridiche</h2>
      <ul>
        <li>Gestione ordini e consegna → esecuzione del contratto</li>
        <li>Adempimenti fiscali e contabili → obbligo di legge (conservazione 10 anni)</li>
        <li>Assistenza clienti → contratto / legittimo interesse</li>
        <li>Marketing solo previo consenso esplicito</li>
        <li>Cookie tecnici → necessario al funzionamento</li>
      </ul>
      <h2>Diritti dell’interessato</h2>
      <p>Accesso, rettifica, cancellazione, limitazione, portabilità, opposizione, revoca consenso. Per esercitarli: <a href="mailto:manolo.zoja@gmail.com">manolo.zoja@gmail.com</a>. Reclamo al Garante Privacy.</p>
      <h2>Cookie</h2>
      <p>Per i cookie si rinvia alla <Link to="/cookie-policy">Cookie Policy</Link>.</p>
    </LegalPage>
  ),
});
