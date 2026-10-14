<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the pizza concept frontend-only with in-memory selections; the demonstration must not create orders or connect commerce services.
- Define visual roles in src/styles.css and use the shared UI controls so the concept remains consistently themed and accessible.
- Prebundle React and the used Radix entry points together in Vite optimizeDeps; this prevents late dependency discovery from mixing React hook dispatchers in an open preview.

- Keep generated video pointers in project assets and render decorative footage through PizzaFilm with a poster, playback control, and reduced-motion/data-saving fallback; motion must never block the pizza selection flow.
- Section videos share viewport-aware playback through usePizzaVideo with first-visit autoplay and explicit replay; the opening HeroVideo independently loops the uploaded process film with MP4 first, positive stacking layers, playback/audio controls and accessibility fallbacks to keep iPhone playback separate from promotional footage.
- Promotional footage preserves its original aspect ratio and audio with muted autoplay and explicit sound controls, so mobile framing and browser playback remain reliable.
- Related product strips use the shared catalog, exclude the current pizza, and support touch, keyboard, navigation controls and pausing automatic scrolling.
- Define preset pizza examples in a shared browser-safe catalog and keep the demonstration bag in a root context; product routes and listings must share the same recipe and never create real orders.
- Give the catalog and every product detail page route-specific metadata without publishing fictional stock, reviews, or live Offer schema; the concept's example prices are not real commerce data.
- Generate every browser and manifest PNG icon with `python3 scripts/build-icons.py` (never hand-edit the PNGs) and keep every referenced icon file present; maskable icons need safe-area padding to avoid cropping the mark.
- Keep a version marker on every icon and manifest file reference (favicon, manifest icons); phones cache icons per URL forever, so bump the marker in the file name (never a ?query string) whenever the artwork changes.
- The apple-touch-icon is embedded as a data URI (src/lib/touch-icon.ts, regenerated from the PNG); iOS showed a letter tile when its separate icon download failed, and an inline icon needs no download.
