import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import pwaCss from "../styles-pwa.css?url";
import { PizzaStoreProvider } from "@/components/pizza-store";
import { touchIconDataUri } from "@/lib/touch-icon";
import { BottomNav } from "@/components/bottom-nav";
import { PwaRuntime } from "@/components/pwa-runtime";
import { CookieBanner } from "@/components/cookie-banner";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Pagina non trovata</h2>
        <p className="mt-2 text-sm text-muted-foreground">La pagina che cerchi non esiste.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Qualcosa è andato storto</h1>
        <p className="mt-2 text-sm text-muted-foreground">Riprova o torna alla home.</p>
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Riprova
          </button>
          <a href="/" className="rounded-md border px-4 py-2 text-sm">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "BasexPizza | Base per Pizza precotta e condimenti" },
      {
        name: "description",
        content:
          "BasexPizza: base pizza cotta al 90% nel forno a legna + condimenti preconfezionati per le tue ricette preferite. Finisci a casa in 3 minuti.",
      },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#c45c26" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "BasexPizza" },
      { property: "og:title", content: "BasexPizza — La pizzeria a casa tua" },
      {
        property: "og:description",
        content: "Base precotta al 90% + condimenti pronti. Il finale lo fai tu.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://basexpizza.com" },
      { property: "og:site_name", content: "BasexPizza" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BasexPizza — La pizzeria a casa tua" },
      {
        name: "twitter:description",
        content: "Base pizza precotta e condimenti per finire a casa.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: pwaCss },
      { rel: "manifest", href: "/manifest-v6.json" },
      { rel: "icon", href: "/favicon-v6.png", type: "image/png", sizes: "64x64" },
      { rel: "icon", href: "/favicon-v6.ico", type: "image/x-icon" },
      // Icon embedded in the page: the phone never has to download it separately.
      { rel: "apple-touch-icon", href: touchIconDataUri, sizes: "180x180" },

      { rel: "canonical", href: "https://basexpizza.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://basexpizza.com/#organization",
              name: "Pi.Gi Service di Gheoca Paula",
              url: "https://basexpizza.com",
              email: "info@pigiservice.com",
              telephone: "+39 352 0966114",
              vatID: "IT05770260288",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via Guido Reni, 8",
                postalCode: "35133",
                addressLocality: "Padova",
                addressRegion: "PD",
                addressCountry: "IT",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://basexpizza.com/#website",
              url: "https://basexpizza.com",
              name: "BasexPizza",
              inLanguage: "it-IT",
              description:
                "Dimostrazione: base pizza precotta al 90% e condimenti da finire a casa. Nessun ordine né pagamento.",
              publisher: { "@id": "https://basexpizza.com/#organization" },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <PizzaStoreProvider>
        <Outlet />
        <BottomNav />
        <PwaRuntime />
        <CookieBanner />
      </PizzaStoreProvider>
    </QueryClientProvider>
  );
}
