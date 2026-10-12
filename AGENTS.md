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
