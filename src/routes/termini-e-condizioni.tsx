import { createFileRoute, Link } from '@tanstack/react-router';
import { LegalPage, legalHead } from '@/components/legal-page';

export const Route = createFileRoute('/termini-e-condizioni')({
  head: () => legalHead('Termini e Condizioni', 'Condizioni generali di vendita di Strano Ma Vero: basi pizza precotte al 90% e kit condimenti.', '/termini-e-condizioni'),
  component: () => (
    <LegalPage title="Termini e Condizioni" intro="Condizioni generali di vendita.">
      <h2>Venditore</h2>
      <p>Zoja Manuelito – Strano Ma Vero, Via Po 1, 35135 Padova (PD), P.IVA 02682910282, tel. <a href="tel:+39049604748">+39 049 604748</a>, email <a href="mailto:manolo.zoja@gmail.com">manolo.zoja@gmail.com</a>.</p>
      <h2>Oggetto</h2>
      <p>Vendita a distanza di basi pizza precotte al 90% e kit condimenti per il completamento a casa.</p>
      <h2>Pagamenti e prezzi</h2>
      <p>Metodi di pagamento accettati: Carta di Credito/Debito, Stripe, Bonifico Bancario e Postale.</p>
      <p>Prezzi in euro IVA inclusa. Spese di consegna indicate in checkout.</p>
      <h2>Conclusione del contratto</h2>
      <p>Il contratto si perfeziona con la conferma dell’ordine da parte del venditore.</p>
      <h2>Diritto di recesso e garanzia</h2>
      <p>Diritto di recesso: escluso ai sensi dell’art. 59, comma 1, lett. d) del Codice del Consumo per i prodotti alimentari deperibili. Si applica la garanzia legale di conformità di 24 mesi (artt. 128 e ss. Codice del Consumo).</p>
      <h2>Allergeni</h2>
      <p>I prodotti possono contenere glutine, latte e altri allergeni. Consultare le schede prodotto o contattare il venditore (Reg. UE 1169/2011).</p>
      <h2>Legge applicabile</h2>
      <p>Legge italiana. Foro del consumatore.</p>
      <p>L’invio dell’ordine implica l’accettazione delle presenti condizioni e della <Link to="/privacy-policy">Privacy Policy</Link>.</p>
    </LegalPage>
  ),
});
