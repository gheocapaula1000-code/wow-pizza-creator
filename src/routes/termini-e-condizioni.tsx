import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/legal-page";

export const Route = createFileRoute("/termini-e-condizioni")({
  head: () =>
    legalHead(
      "Termini e Condizioni",
      "Termini di utilizzo del sito dimostrativo BasexPizza: nessuna vendita, nessun ordine, nessun pagamento.",
      "/termini-e-condizioni",
    ),
  component: () => (
    <LegalPage title="Termini e Condizioni" intro="Termini di utilizzo del sito dimostrativo.">
      <h2>Gestore del sito</h2>
      <p>
        Pi.Gi Service di Gheoca Paula, Via Guido Reni, 8, 35133 Padova (PD), P.IVA 05770260288.
        Contatti: <a href="mailto:info@pigiservice.com">info@pigiservice.com</a> · PEC{" "}
        <a href="mailto:pigiservice@pec.it">pigiservice@pec.it</a> ·{" "}
        <a href="tel:+393520966114">+39 352 0966114</a>.
      </p>
      <h2>Natura dimostrativa</h2>
      <p>
        BasexPizza è una dimostrazione grafica e interattiva di un negozio di basi pizza precotte e
        condimenti. Non è un negozio operativo: non si possono effettuare ordini né pagamenti, e
        nessun prodotto viene venduto o spedito attraverso questo sito.
      </p>
      <h2>Prezzi, ricette e contenuti</h2>
      <p>
        Prezzi, ricette, disponibilità, foto e filmati sono esempi a scopo illustrativo e non
        costituiscono offerta al pubblico né promessa di vendita.
      </p>
      <h2>Proprietà intellettuale</h2>
      <p>
        Codice, grafica e testi del sito appartengono ai rispettivi titolari; ogni riproduzione
        richiede autorizzazione scritta.
      </p>
      <h2>Legge applicabile</h2>
      <p>
        Legge italiana. Per i consumatori resta fermo il foro inderogabile previsto dal Codice del
        Consumo.
      </p>
      <p>
        Per i dati personali vedi la <Link to="/privacy-policy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  ),
});
