// Kartly demo store - client-side only (static hosting). Test data, not real security.
(function () {
  var USER = "demo_shopper";
  var PASS = "Demo-Only-2026";
  var COOKIE = "kartly_session";
  var MAX_ATTEMPTS = 3, WINDOW_MS = 60000;
  var BASE = location.pathname.replace(/[^/]*$/, "");

  var PRODUCTS = [
    { id: 1, name: "Noise-cancelling Headphones", cat: "Electronics", price: 129, was: 179, rating: 4.6, emoji: "🎧", bg: "#e8f0ff", tag: "28% off" },
    { id: 2, name: "Smart Watch Series 5", cat: "Electronics", price: 199, was: 249, rating: 4.4, emoji: "⌚", bg: "#fff0e6", tag: "Hot" },
    { id: 3, name: "Trail Running Shoes", cat: "Fashion", price: 84, was: 110, rating: 4.7, emoji: "👟", bg: "#e9f8ef", tag: "New" },
    { id: 4, name: "Canvas Backpack 28L", cat: "Fashion", price: 56, was: 72, rating: 4.5, emoji: "🎒", bg: "#fdeef0", tag: "" },
    { id: 5, name: "Pour-over Coffee Set", cat: "Home", price: 42, was: 55, rating: 4.8, emoji: "☕", bg: "#f4ece4", tag: "Top rated" },
    { id: 6, name: "Ceramic Table Lamp", cat: "Home", price: 38, was: 49, rating: 4.3, emoji: "💡", bg: "#fff8dc", tag: "" },
    { id: 7, name: "Mechanical Keyboard", cat: "Electronics", price: 94, was: 120, rating: 4.6, emoji: "⌨️", bg: "#eaeaff", tag: "" },
    { id: 8, name: "Yoga Mat Pro", cat: "Sports", price: 29, was: 39, rating: 4.5, emoji: "🧘", bg: "#e7f7f6", tag: "Eco" }
  ];

  function getCookie(n) { var m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)")); return m ? decodeURIComponent(m[1]) : null; }
  function setCookie(n, v) { document.cookie = n + "=" + encodeURIComponent(v) + "; path=" + BASE + "; SameSite=Lax"; }
  function delCookie(n) { document.cookie = n + "=; path=" + BASE + "; expires=Thu, 01 Jan 1970 00:00:00 GMT"; }
  function ls(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var K = window.Kartly = {
    products: PRODUCTS,
    isLoggedIn: function () { return getCookie(COOKIE) === USER; },
    requireAuth: function () { if (!K.isLoggedIn()) { location.replace(BASE + "login.html"); return false; } return true; },
    login: function (u, p) {
      var now = Date.now();
      var attempts = ls("kartly_attempts", []).filter(function (t) { return now - t < WINDOW_MS; });
      if (attempts.length >= MAX_ATTEMPTS) return { ok: false, msg: "Too many login attempts. Try again in a minute." };
      attempts.push(now); lsSet("kartly_attempts", attempts);
      if (u === USER && p === PASS) { setCookie(COOKIE, USER); lsSet("kartly_logins", ls("kartly_logins", 0) + 1); return { ok: true }; }
      return { ok: false, msg: "Invalid username or password." };
    },
    logout: function () { delCookie(COOKIE); location.href = BASE + "index.html"; },
    loginCount: function () { return ls("kartly_logins", 0); },
    cart: function () { return ls("kartly_cart", []); },
    addToCart: function (id) { var c = K.cart(); c.push(id); lsSet("kartly_cart", c); K.renderBadge(); },
    renderBadge: function () { var b = document.getElementById("cart-count"); if (b) b.textContent = K.cart().length; },
    stars: function (r) { var f = Math.round(r); return "★★★★★".slice(0, f) + "☆☆☆☆☆".slice(0, 5 - f); },
    card: function (p) {
      return '<div class="card"><div class="pic" style="background:' + p.bg + '">' + p.emoji + '</div>' +
        '<div class="body"><div class="name">' + p.name + '</div><div class="meta">' + p.cat + '</div>' +
        '<div class="stars">' + K.stars(p.rating) + ' <span class="meta">' + p.rating + '</span></div>' +
        '<div class="price">$' + p.price + '<s>$' + p.was + '</s></div>' +
        '<button type="button" data-add="' + p.id + '">Add to cart</button></div></div>';
    },
    header: function () {
      var li = K.isLoggedIn();
      var h = '<div class="topbar"><div class="wrap"><span>Free shipping on orders over $50</span><span>Demo store - test data only</span></div></div>' +
        '<header class="header"><div class="wrap"><a class="logo" href="' + BASE + 'index.html">Kart<span>ly</span></a>' +
        '<form class="search" onsubmit="return false"><input id="search" placeholder="Search products, brands and more" aria-label="Search"><button type="submit">Search</button></form>' +
        '<nav class="actions">' + (li ? '<a id="nav-account" href="' + BASE + 'account.html">My Account</a>' : '<a id="nav-login" href="' + BASE + 'login.html">Sign in</a>') +
        '<a class="cart" id="nav-cart" href="#">Cart<span class="badge" id="cart-count">0</span></a></nav></div></header>' +
        '<div class="cats"><div class="wrap"><a href="' + BASE + 'index.html">All</a><a href="#">Electronics</a><a href="#">Fashion</a><a href="#">Home</a><a href="#">Sports</a><a href="#">Deals</a></div></div>';
      var el = document.getElementById("site-header"); if (el) el.innerHTML = h;
      var f = document.getElementById("site-footer");
      if (f) f.innerHTML = '<div class="footer"><div class="wrap">Kartly is a demo storefront built to practise test automation. Nothing here is real. Demo login: ' + USER + '</div></div>';
      K.renderBadge();
      document.addEventListener("click", function (e) { var id = e.target && e.target.getAttribute && e.target.getAttribute("data-add"); if (id) K.addToCart(+id); });
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
