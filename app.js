// Kartly demo store - client-side only (static hosting). Test data, not real security.
(function () {
  var USER = "demo_shopper";
  var PASS = "Demo-Only-2026";
  var COOKIE = "kartly_session";
  var MAX_ATTEMPTS = 3, WINDOW_MS = 60000;
  var BASE = location.pathname.replace(/[^/]*$/, "");

  var PRODUCTS = [
    { id: 1, name: "Noise-cancelling Headphones", cat: "Electronics", price: 129, was: 179, rating: 4.6, emoji: "🎧", bg: "#e8f0ff", tag: "28% off", stock: 12, desc: "Over-ear wireless headphones with a 30-hour battery and active noise cancelling." },
    { id: 2, name: "Smart Watch Series 5", cat: "Electronics", price: 199, was: 249, rating: 4.4, emoji: "⌚", bg: "#fff0e6", tag: "Hot", stock: 5, desc: "Heart-rate, sleep tracking and a bright always-on display." },
    { id: 3, name: "Trail Running Shoes", cat: "Fashion", price: 84, was: 110, rating: 4.7, emoji: "👟", bg: "#e9f8ef", tag: "New", stock: 30, desc: "Light, grippy shoes for wet and dry trails." },
    { id: 4, name: "Canvas Backpack 28L", cat: "Fashion", price: 56, was: 72, rating: 4.5, emoji: "🎒", bg: "#fdeef0", tag: "", stock: 18, desc: "Water-resistant canvas with a padded laptop sleeve." },
    { id: 5, name: "Pour-over Coffee Set", cat: "Home", price: 42, was: 55, rating: 4.8, emoji: "☕", bg: "#f4ece4", tag: "Top rated", stock: 9, desc: "Glass server, steel dripper and 100 filters." },
    { id: 6, name: "Ceramic Table Lamp", cat: "Home", price: 38, was: 49, rating: 4.3, emoji: "💡", bg: "#fff8dc", tag: "", stock: 2, desc: "Warm glow, hand-glazed base. Bulb included." },
    { id: 7, name: "Mechanical Keyboard", cat: "Electronics", price: 94, was: 120, rating: 4.6, emoji: "⌨️", bg: "#eaeaff", tag: "", stock: 14, desc: "Hot-swappable switches, aluminium frame, USB-C." },
    { id: 8, name: "Yoga Mat Pro", cat: "Sports", price: 29, was: 39, rating: 4.5, emoji: "🧘", bg: "#e7f7f6", tag: "Eco", stock: 40, desc: "6 mm natural rubber mat with alignment marks." },
    { id: 9, name: "Limited Edition Sneakers", cat: "Fashion", price: 240, was: 240, rating: 4.9, emoji: "👞", bg: "#f1eefc", tag: "Sold out", stock: 0, desc: "Numbered release. Currently out of stock (edge case: disabled add to cart)." },
    { id: 10, name: "Ultra-Wide Curved Gaming Monitor 49-inch Dual QHD 240Hz with HDR1000 and Adaptive Sync (Open Box)", cat: "Electronics", price: 899, was: 1299, rating: 4.2, emoji: "🖥️", bg: "#e6f3f8", tag: "Open box", stock: 3, desc: "Very long product name to test wrapping and truncation." },
    { id: 11, name: "Kids' \"Mini\" Tablet <8GB> & Case", cat: "Electronics", price: 79, was: 99, rating: 3.9, emoji: "📱", bg: "#fdf0e4", tag: "", stock: 21, desc: "Special characters in the name (quotes, angle brackets, ampersand) must be escaped." },
    { id: 12, name: "Free Sample Pack", cat: "Home", price: 0, was: 9, rating: 4.0, emoji: "🎁", bg: "#eef7e6", tag: "Free", stock: 99, desc: "A zero-price item: totals and free-shipping rules behave differently." }
  ];
  var COUPONS = {
    SAVE10: { type: "pct", value: 10, label: "10% off" },
    BIG50: { type: "amt", value: 50, min: 200, label: "$50 off orders of $200 or more" },
    FREESHIP: { type: "ship", value: 0, label: "Free shipping" },
    EXPIRED: { type: "expired" }
  };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function getCookie(n) { var m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)")); return m ? decodeURIComponent(m[1]) : null; }
  function setCookie(n, v, maxAge) { document.cookie = n + "=" + encodeURIComponent(v) + "; path=" + BASE + "; SameSite=Lax" + (maxAge ? "; max-age=" + maxAge : ""); }
  function delCookie(n) { document.cookie = n + "=; path=" + BASE + "; expires=Thu, 01 Jan 1970 00:00:00 GMT"; }
  function ls(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function money(n) { return "$" + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, ""); }
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === +id) return PRODUCTS[i]; return null; }

  var K = window.Kartly = {
    products: PRODUCTS, coupons: COUPONS, esc: esc, money: money, byId: byId, base: BASE,
    isLoggedIn: function () { return getCookie(COOKIE) === USER; },
    requireAuth: function () { if (!K.isLoggedIn()) { location.replace(BASE + "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search)); return false; } return true; },
    login: function (u, p, remember) {
      var now = Date.now();
      var attempts = ls("kartly_attempts", []).filter(function (t) { return now - t < WINDOW_MS; });
      if (attempts.length >= MAX_ATTEMPTS) return { ok: false, msg: "Too many login attempts. Try again in a minute." };
      attempts.push(now); lsSet("kartly_attempts", attempts);
      if (!u || !p) return { ok: false, msg: "Enter your username and password." };
      if (u === USER && p === PASS) { setCookie(COOKIE, USER, remember ? 604800 : 0); lsSet("kartly_logins", ls("kartly_logins", 0) + 1); return { ok: true }; }
      return { ok: false, msg: "Invalid username or password." };
    },
    logout: function () { delCookie(COOKIE); location.href = BASE + "index.html"; },
    loginCount: function () { return ls("kartly_logins", 0); },
    cart: function () { return ls("kartly_cart2", []); },
    saveCart: function (c) { lsSet("kartly_cart2", c); K.renderBadge(); },
    cartCount: function () { return K.cart().reduce(function (a, l) { return a + l.qty; }, 0); },
    addToCart: function (id, qty) {
      var p = byId(id); if (!p || p.stock < 1) return false;
      var c = K.cart(), line = c.filter(function (l) { return l.id === +id; })[0];
      var add = Math.max(1, +qty || 1);
      if (line) line.qty = Math.min(p.stock, line.qty + add); else c.push({ id: +id, qty: Math.min(p.stock, add) });
      K.saveCart(c); return true;
    },
    setQty: function (id, qty) { var c = K.cart(); c.forEach(function (l) { if (l.id === +id) l.qty = Math.max(1, Math.min(byId(id).stock, qty)); }); K.saveCart(c); },
    removeLine: function (id) { K.saveCart(K.cart().filter(function (l) { return l.id !== +id; })); },
    clearCart: function () { K.saveCart([]); },
    totals: function (code, shipping) {
      var sub = K.cart().reduce(function (a, l) { return a + byId(l.id).price * l.qty; }, 0);
      var cp = code ? COUPONS[String(code).toUpperCase()] : null, discount = 0, msg = "", ok = false;
      if (code && !cp) msg = "Coupon not found.";
      else if (cp && cp.type === "expired") msg = "This coupon has expired.";
      else if (cp && cp.min && sub < cp.min) msg = "Spend at least " + money(cp.min) + " to use this coupon.";
      else if (cp) { ok = true; msg = "Applied: " + cp.label; if (cp.type === "pct") discount = sub * cp.value / 100; if (cp.type === "amt") discount = cp.value; }
      var ship = sub === 0 ? 0 : (shipping != null ? shipping : (sub >= 50 ? 0 : 5));
      if (ok && cp.type === "ship") ship = 0;
      var tax = Math.max(0, sub - discount) * 0.08;
      return { sub: sub, discount: discount, ship: ship, tax: tax, total: Math.max(0, sub - discount) + ship + tax, msg: msg, ok: ok };
    },
    orders: function () { return ls("kartly_orders", []); },
    saveOrder: function (o) { var l = K.orders(); l.unshift(o); lsSet("kartly_orders", l); },
    renderBadge: function () { var b = document.getElementById("cart-count"); if (b) b.textContent = K.cartCount(); },
    stars: function (r) { var f = Math.round(r); return "★★★★★".slice(0, f) + "☆☆☆☆☆".slice(0, 5 - f); },
    card: function (p) {
      var out = p.stock < 1;
      return '<div class="card" data-testid="product-' + p.id + '"><a href="' + BASE + 'product.html?id=' + p.id + '" class="pic" style="background:' + p.bg + '" aria-label="' + esc(p.name) + '">' + (p.tag ? '<span class="tag">' + esc(p.tag) + '</span>' : '') + p.emoji + '</a>' +
        '<div class="body"><a class="name" href="' + BASE + 'product.html?id=' + p.id + '">' + esc(p.name) + '</a><div class="meta">' + esc(p.cat) + '</div>' +
        '<div class="stars" aria-label="Rated ' + p.rating + ' out of 5">' + K.stars(p.rating) + ' <span class="meta">' + p.rating + '</span></div>' +
        '<div class="price">' + money(p.price) + (p.was > p.price ? '<s>' + money(p.was) + '</s>' : '') + '</div>' +
        '<button type="button" data-add="' + p.id + '"' + (out ? ' disabled' : '') + '>' + (out ? 'Sold out' : 'Add to cart') + '</button></div></div>';
    },
    header: function () {
      var li = K.isLoggedIn();
      var h = '<div class="topbar"><div class="wrap"><span>Free shipping on orders over $50</span><span>Demo store - test data only</span></div></div>' +
        '<header class="header"><div class="wrap"><a class="logo" href="' + BASE + 'index.html">Kart<span>ly</span></a>' +
        '<form class="search" id="search-form" role="search"><input id="search" name="q" placeholder="Search products, brands and more" aria-label="Search" autocomplete="off"><button type="submit">Search</button></form>' +
        '<nav class="actions" aria-label="Account"><a id="nav-lab" href="' + BASE + 'lab.html">Test Lab</a>' + (li ? '<a id="nav-account" href="' + BASE + 'account.html">My Account</a>' : '<a id="nav-login" href="' + BASE + 'login.html">Sign in</a>') +
        '<a class="cart" id="nav-cart" href="' + BASE + 'cart.html">Cart<span class="badge" id="cart-count">0</span></a></nav></div></header>' +
        '<div class="cats"><div class="wrap"><a href="' + BASE + 'index.html">All</a><a href="' + BASE + 'index.html?cat=Electronics">Electronics</a><a href="' + BASE + 'index.html?cat=Fashion">Fashion</a><a href="' + BASE + 'index.html?cat=Home">Home</a><a href="' + BASE + 'index.html?cat=Sports">Sports</a><a href="' + BASE + 'lab.html">Test Lab</a></div></div>';
      var el = document.getElementById("site-header"); if (el) el.innerHTML = h;
      var f = document.getElementById("site-footer");
      if (f) f.innerHTML = '<div class="footer"><div class="wrap">Kartly is a demo storefront and test lab built to practise test automation. Nothing here is real. Demo login: ' + USER + ' / ' + PASS + ' &middot; <a href="' + BASE + 'lab.html" style="text-decoration:underline">Test Lab</a></div></div>';
      var sf = document.getElementById("search-form");
      if (sf) sf.addEventListener("submit", function (e) { e.preventDefault(); location.href = BASE + "index.html?q=" + encodeURIComponent(document.getElementById("search").value); });
      var q = new URLSearchParams(location.search).get("q"); var si = document.getElementById("search"); if (si && q) si.value = q;
      K.renderBadge();
      document.addEventListener("click", function (e) {
        var t = e.target; var id = t && t.getAttribute && t.getAttribute("data-add");
        if (id && K.addToCart(+id, 1)) { var o = t.textContent; t.textContent = "Added"; setTimeout(function () { t.textContent = o; }, 900); }
      });
    },
    side: function (active) {
      var items = [["account.html", "Overview"], ["orders.html", "Orders"], ["wishlist.html", "Wishlist"], ["profile.html", "Profile"], ["settings.html", "Settings"]];
      var h = items.map(function (i) { return '<a href="' + BASE + i[0] + '"' + (i[0] === active ? ' class="on"' : '') + '>' + i[1] + '</a>'; }).join("");
      h += '<a href="#" id="logout">Sign out</a>';
      var el = document.getElementById("side"); if (el) el.innerHTML = h;
      var lo = document.getElementById("logout"); if (lo) lo.addEventListener("click", function (e) { e.preventDefault(); K.logout(); });
    }
  };
})();
