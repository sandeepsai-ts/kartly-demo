# Kartly: demo store and web test lab

A static site (no backend) for practising web test automation. Host it anywhere; it is published with GitHub Pages.

**Live:** https://sandeepsai-ts.github.io/kartly-demo/

## Store flow
Search, category chips, sort, price and stock filters, product page (tabs, quantity, sold-out item), cart (quantity, remove, coupons), four-step checkout (address, shipping, payment, review), order confirmation and order history.

- Demo login (test data only): `demo_shopper` / `Demo-Only-2026`. The login is checked in the browser, so it is not real security. Three attempts per minute are allowed.
- Coupons: `SAVE10`, `BIG50` (needs $200), `FREESHIP`, `EXPIRED`.
- Test cards: `4242 4242 4242 4242` succeeds, `4000 0000 0000 0002` is declined.
- Protected pages (account, orders, wishlist, profile, settings, checkout) each have `h1#page-title`. The login form uses `#username`, `#password`, `#login`.

## Test Lab (`lab.html`)
| Page | What it covers |
|---|---|
| lab-forms | Validation, masks, disabled/read-only, multi-select, datalist, custom ARIA dropdown, autocomplete, switches |
| lab-alerts | alert/confirm/prompt, delayed alert, dialog element, toast, consent overlay, delete confirmation |
| lab-frames | iframe, nested iframes, postMessage, open and closed shadow DOM, slots |
| lab-windows | new tab, noopener, popup, named window, history API, hash, title |
| lab-dynamic | delayed and hidden elements, disappearing, random ids, stale elements, spinner overlay, flaky action, moving target |
| lab-tables | sort, filter, pagination, select all, inline edit, sticky header, infinite scroll, colspan/rowspan |
| lab-mouse | hover, tooltip, double and right click, long press, drag and drop, key events, shortcuts, clipboard, contenteditable |
| lab-files | file inputs, drag-drop zone, image preview, generated downloads |
| lab-storage | cookies with expiry, local/session storage, IndexedDB, session expiry timer |
| lab-network | 200/404, timeout, retry, offline simulation, console errors, uncaught exceptions |
| lab-visual | broken and lazy images, canvas, SVG, animations, carousel, overlapping elements, text edge cases |
| lab-a11y | landmarks, ARIA live, accordion, focus trap, dark mode, high contrast, large text, reduced motion, RTL |
| lab-auth | multiple user types, MFA code (`123456`), session timeout, captcha-style challenge, password reset |

Elements carry stable ids and `data-testid` attributes; each page lists its edge cases under "Test ideas and selectors".
