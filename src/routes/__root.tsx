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
import { useEffect, useRef, useState, type ReactNode } from "react";

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
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    const threshold = 70;

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 0) {
        startY.current = e.touches[0]?.clientY ?? 0;
        pulling.current = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current) return;
      const currentY = e.touches[0]?.clientY ?? 0;
      const diff = currentY - startY.current;
      if (diff > 30 && window.scrollY <= 0) {
        setSpinner(true);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!pulling.current) return;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const diff = endY - startY.current;
      setSpinner(false);
      if (diff > threshold && window.scrollY <= 0) {
        window.location.reload();
      }
      pulling.current = false;
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
        {spinner && (
          <div style={{position:'fixed', top:12, left:'50%', transform:'translateX(-50%)', zIndex:9999, background:'rgba(255,255,255,0.9)', borderRadius:20, padding:'6px 12px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{width:16, height:16, border:'2px solid #c45c26', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}} />
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <Outlet />
        <BottomNav />
      </PizzaStoreProvider>
    </QueryClientProvider>
  );
}
