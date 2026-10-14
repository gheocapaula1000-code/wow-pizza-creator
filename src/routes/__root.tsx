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
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";

import appCss from "../styles.css?url";
import pwaCss from "../styles-pwa.css?url";
import { PizzaStoreProvider } from "@/components/pizza-store";
import { touchIconDataUri } from "@/lib/touch-icon";
import { BottomNav } from "@/components/bottom-nav";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Pagina non trovata</h2>
        <p className="mt-2 text-sm text-muted-foreground">La pagina che cerchi non esiste.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Torna alla home</Link>
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
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Riprova</button>
          <a href="/" className="rounded-md border px-4 py-2 text-sm">Home</a>
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
      { title: "Basex Pizza | Base pizza precotta e condimenti | Strano Ma Vero!" },
      { name: "description", content: "Basex Pizza: base pizza cotta al 90% nel forno a legna + condimenti preconfezionati per le tue ricette preferite. Finisci a casa in 3 minuti." },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#c45c26" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Basex Pizza" },
      { property: "og:title", content: "Basex Pizza — La pizzeria a casa tua" },
      { property: "og:description", content: "Base precotta al 90% + condimenti pronti. Il finale lo fai tu." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://basexpizza.com" },
      { property: "og:site_name", content: "Basex Pizza" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Basex Pizza — La pizzeria a casa tua" },
      { name: "twitter:description", content: "Base pizza precotta e condimenti per finire a casa." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: pwaCss },
      { rel: "manifest", href: "/manifest-v6.json" },
      { rel: "icon", href: "/favicon-v6.png", type: "image/png", sizes: "64x64" },
      { rel: "icon", href: "/favicon-v6.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: touchIconDataUri, sizes: "180x180" },
      { rel: "canonical", href: "https://basexpizza.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;600;700;800&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Basex Pizza",
          alternateName: "Strano Ma Vero!",
          url: "https://basexpizza.com",
          description: "Base pizza precotta al 90% nel forno a legna e condimenti preconfezionati da finire a casa.",
          servesCuisine: "Pizza",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IT"
          }
        })
      }
    ]
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
  const startY = useRef(0);
  const pulling = useRef(false);
  const pulled = useRef(0);
  const indicator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const THRESHOLD = 72;
    const MAX = 120;
    const show = (p: number) => {
      const el = indicator.current;
      if (!el) return;
      el.style.opacity = String(Math.min(p / THRESHOLD, 1));
      el.style.transform = `translateY(${p - 44}px)`;
      el.dataset['state'] = p >= THRESHOLD ? 'ready' : 'idle';
    };
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0]?.clientY ?? 0;
        pulling.current = true;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current) return;
      const dy = (e.touches[0]?.clientY ?? 0) - startY.current;
      pulled.current = dy <= 0 ? 0 : Math.min(dy * 0.5, MAX);
      show(pulled.current);
    };
    const onTouchEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      if (pulled.current >= THRESHOLD) {
        // Ricarica vera della pagina, non solo l'animazione.
        const el = indicator.current;
        if (el) {
          el.dataset['state'] = 'refreshing';
          el.style.opacity = '1';
          el.style.transform = `translateY(${THRESHOLD - 44}px)`;
        }
        window.location.reload();
        return;
      }
      pulled.current = 0;
      show(0);
    };
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PizzaStoreProvider>
        <div className="ptr-indicator" ref={indicator} data-state="idle" aria-hidden="true">
          <ArrowDown className="ptr-arrow" />
          <span className="ptr-spinner" />
        </div>
        <Outlet />
        <BottomNav />
      </PizzaStoreProvider>
    </QueryClientProvider>
  );
}
