# Kartly demo store

A small static storefront with a cookie-based login, built to practise test automation (for example reusing one login across several test cases).

- Pages: `index.html` (public shop), `login.html`, and protected `account.html`, `orders.html`, `wishlist.html`, `profile.html`, `settings.html`.
- Demo login (test data only): `demo_shopper` / `Demo-Only-2026`.
- Login is checked in the browser, so it is not real security. Three attempts per minute are allowed in one browser.
- Every protected page has `h1#page-title`. The login form uses `#username`, `#password`, `#login`.
