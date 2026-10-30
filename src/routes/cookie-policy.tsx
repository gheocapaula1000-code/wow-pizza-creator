import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/legal-page";

export const Route = createFileRoute("/cookie-policy")({
  head: () =>
    legalHead(
      "Cookie Policy",
      "Quali dati tecnici usa il sito dimostrativo Basex Pizza e come gestire la scelta.",
      "/cookie-policy",
    ),
  component: () => (
    <LegalPage title="Cookie Policy">
      <p>
        Il sito usa solo memoria tecnica del browser (carrello dimostrativo, scelta sui cookie,
        copia offline dell’app) che non richiede consenso. Non usa cookie di profilazione né
        analitici.
      </p>
      <p>
        La scelta effettuata nel banner viene memorizzata per circa 6 mesi; puoi cancellarla in
        qualsiasi momento dalle impostazioni del browser.
      </p>
      <h2>Titolare</h2>
      <p>
        Pi.Gi Service di Gheoca Paula, Via Guido Reni, 8, 35133 Padova (PD), P.IVA 05770260288 –{" "}
        <a href="mailto:info@pigiservice.com">info@pigiservice.com</a> · PEC{" "}
        <a href="mailto:pigiservice@pec.it">pigiservice@pec.it</a> ·{" "}
        <a href="tel:+393520966114">+39 352 0966114</a>
      </p>
    </LegalPage>
  ),
});
