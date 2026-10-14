import { createFileRoute } from '@tanstack/react-router';
import { LegalPage, legalHead } from '@/components/legal-page';

export const Route = createFileRoute('/cookie-policy')({
  head: () => legalHead('Cookie Policy', 'Quali cookie usa il sito Strano Ma Vero e come gestire il consenso.', '/cookie-policy'),
  component: () => (
    <LegalPage title="Cookie Policy">
      <p>Il sito utilizza cookie tecnici necessari (carrello, sessione) che non richiedono consenso. Eventuali cookie analitici vengono installati solo previo consenso tramite il banner.</p>
      <p>Puoi accettare tutti, rifiutare quelli non necessari o modificare le preferenze. La chiusura del banner o il pulsante Rifiuta equivale al rifiuto dei cookie non tecnici. Il consenso viene memorizzato per almeno 6 mesi.</p>
      <h2>Titolare</h2>
      <p>Zoja Manuelito – Strano Ma Vero, Via Po 1, 35135 Padova, P.IVA 02682910282 – <a href="mailto:manolo.zoja@gmail.com">manolo.zoja@gmail.com</a></p>
    </LegalPage>
  ),
});
