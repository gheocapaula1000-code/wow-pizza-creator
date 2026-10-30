import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/legal-page";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    legalHead(
      "Privacy Policy",
      "Informativa sul trattamento dei dati personali del sito dimostrativo Basex Pizza ai sensi del GDPR (Reg. UE 2016/679).",
      "/privacy-policy",
    ),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      intro="Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR)."
    >
      <h2>Titolare del trattamento</h2>
      <p>
        Pi.Gi Service di Gheoca Paula, Via Guido Reni, 8, 35133 Padova (PD), P.IVA 05770260288.
        Contatti: <a href="mailto:info@pigiservice.com">info@pigiservice.com</a> · PEC{" "}
        <a href="mailto:pigiservice@pec.it">pigiservice@pec.it</a> ·{" "}
        <a href="tel:+393520966114">+39 352 0966114</a>.
      </p>
      <h2>Natura del sito</h2>
      <p>
        Basex Pizza è un sito dimostrativo: non ci sono ordini, pagamenti, account o moduli di
        contatto. Il carrello è solo un esempio e resta nel tuo browser.
      </p>
      <h2>Dati trattati</h2>
      <p>
        Il sito non raccoglie nome, indirizzo, telefono o email degli utenti. Restano sul tuo
        dispositivo solo il contenuto del carrello dimostrativo e la scelta sui cookie. Il servizio
        di hosting può registrare dati tecnici di navigazione (indirizzo IP, browser, data e ora)
        per sicurezza e funzionamento.
      </p>
      <h2>Finalità e basi giuridiche</h2>
      <ul>
        <li>Funzionamento e sicurezza del sito → legittimo interesse</li>
        <li>Memorizzazione della scelta sui cookie → necessario al funzionamento</li>
      </ul>
      <h2>Diritti dell’interessato</h2>
      <p>
        Accesso, rettifica, cancellazione, limitazione, portabilità, opposizione. Per esercitarli
        scrivi a <a href="mailto:info@pigiservice.com">info@pigiservice.com</a>. Puoi proporre
        reclamo al Garante per la protezione dei dati personali.
      </p>
      <h2>Cookie</h2>
      <p>
        Per i cookie si rinvia alla <Link to="/cookie-policy">Cookie Policy</Link>.
      </p>
    </LegalPage>
  ),
});
