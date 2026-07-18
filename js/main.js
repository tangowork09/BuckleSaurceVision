/* ---------- Loader: concentric ring wipe -> logo -> reveal ---------- */
(function loader() {
  const el = document.getElementById("loader");
  if (!el) return;
  const rings = el.querySelectorAll(".ring");
  const logo = el.querySelector(".loader-logo");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || sessionStorage.getItem("seenIntro")) {
    el.classList.add("done");
    return;
  }
  const scaleTo = 2 * Math.ceil(Math.hypot(innerWidth, innerHeight) / 8);
  rings.forEach((r, i) => {
    r.animate(
      [{ transform: "scale(0)" }, { transform: `scale(${scaleTo})` }],
      { duration: 1100, delay: 500 + i * 550, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }
    );
  });
  logo.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 800, delay: 500 + rings.length * 550 + 300, fill: "forwards",
  });
  setTimeout(() => {
    el.classList.add("done");
    sessionStorage.setItem("seenIntro", "1");
  }, 500 + rings.length * 550 + 1600);
})();

/* ---------- Hero product carousel ---------- */
(function carousel() {
  const stage = document.getElementById("carousel");
  if (!stage) return;
  const order = ["pineapple", "habanero", "cherry"];
  const circleColor = { pineapple: "var(--gold)", habanero: "var(--orange)", cherry: "var(--red)" };
  const chunk = {
    pineapple: "assets/pineapple-cut-3.png",
    habanero: "assets/hananero.png",
    cherry: "assets/cherry.png",
  };
  let i = 0;
  const bottle = document.getElementById("car-bottle");
  const show = (idx) => {
    i = (idx + order.length) % order.length;
    const p = PRODUCTS[order[i]];
    bottle.classList.add("swap");
    setTimeout(() => {
      bottle.src = p.front;
      document.getElementById("car-num").textContent = String(i + 1).padStart(2, "0");
      document.getElementById("car-name").textContent = p.flatName;
      document.getElementById("car-circle").style.background = circleColor[p.id];
      document.getElementById("car-chunk-a").src = chunk[p.id];
      document.getElementById("car-chunk-b").src = chunk[p.id];
      const face = document.getElementById("car-face");
      if (face && face.load) face.load(p.lottie);
      bottle.classList.remove("swap");
    }, 350);
  };
  document.getElementById("car-prev").addEventListener("click", () => show(i - 1));
  document.getElementById("car-next").addEventListener("click", () => show(i + 1));
  document.getElementById("car-circle").style.background = circleColor.pineapple;
  const auto = setInterval(() => show(i + 1), 5000);
  stage.addEventListener("pointerdown", () => clearInterval(auto), { once: true });
})();

/* ---------- Scroll-morph nav + burger ---------- */
(function miniNav() {
  const mini = document.querySelector(".nav-mini");
  if (mini) {
    addEventListener("scroll", () => {
      document.body.classList.toggle("scrolled", scrollY > 260);
    }, { passive: true });
  }
  const burger = document.getElementById("burger");
  const menu = document.getElementById("burger-menu");
  if (burger && menu) {
    burger.addEventListener("click", () => menu.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#burger") && !e.target.closest("#burger-menu")) menu.classList.remove("open");
    });
  }
})();

/* ---------- Scroll reveal ---------- */
(function reveal() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  // Elements jumped past (anchor links / programmatic scroll) never intersect —
  // sweep anything already above the viewport bottom.
  const sweep = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
  });
  addEventListener("scroll", sweep, { passive: true });
  addEventListener("load", sweep);
})();

/* ---------- Cart (localStorage) ---------- */
const Cart = {
  read() { return JSON.parse(localStorage.getItem("cart") || "[]"); },
  write(items) { localStorage.setItem("cart", JSON.stringify(items)); this.render(); },
  add(id) {
    const items = this.read();
    const hit = items.find((i) => i.id === id);
    if (hit) hit.qty += 1;
    else items.push({ id, qty: 1 });
    this.write(items);
    this.open();
  },
  setQty(id, qty) {
    let items = this.read();
    items = qty <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty } : i));
    this.write(items);
  },
  itemInfo(id) { return PRODUCTS[id] || BUNDLES[id]; },
  total() { return this.read().reduce((s, i) => s + this.itemInfo(i.id).price * i.qty, 0); },
  open() {
    document.getElementById("cart-drawer").classList.add("open");
    document.getElementById("cart-overlay").classList.add("open");
  },
  close() {
    document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("cart-overlay").classList.remove("open");
  },
  render() {
    const wrap = document.getElementById("cart-items");
    if (!wrap) return;
    const items = this.read();
    if (!items.length) {
      wrap.innerHTML = `<div class="cart-empty">Nothing in here yet.<br>Your grill is judging you.</div>`;
    } else {
      wrap.innerHTML = items.map((i) => {
        const p = this.itemInfo(i.id);
        const img = p.front || p.img;
        return `<div class="cart-item">
          <img src="${img}" alt="${p.flatName || p.name}">
          <div>
            <div class="ci-name">${p.flatName || p.name}</div>
            <div class="ci-qty">
              <button data-qty="${i.id}:${i.qty - 1}">−</button>
              <span>${i.qty}</span>
              <button data-qty="${i.id}:${i.qty + 1}">+</button>
            </div>
          </div>
          <div class="ci-price">$${(p.price * i.qty).toFixed(2)}</div>
        </div>`;
      }).join("");
    }
    const hasSingle = items.some((i) => PRODUCTS[i.id]);
    const hasBundle = items.some((i) => BUNDLES[i.id]);
    document.getElementById("best-value").style.display = hasSingle && !hasBundle ? "block" : "none";
    const total = this.total();
    document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;
    const count = items.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll(".cart-count").forEach((el) => { el.textContent = count; });
    const ship = document.getElementById("ship-note");
    if (ship) {
      ship.textContent = total >= FREE_SHIP_MIN
        ? "Free shipping unlocked."
        : `$${(FREE_SHIP_MIN - total).toFixed(2)} away from free shipping.`;
    }
  },
};

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-add]");
  if (addBtn) {
    const id = addBtn.dataset.add;
    const lbl = addBtn.querySelector(".lbl");
    const hov = addBtn.querySelector(".lbl-hover");
    if (lbl) {
      lbl.textContent = "Adding";
      if (hov) hov.textContent = "Adding";
      setTimeout(() => {
        lbl.textContent = "Added";
        if (hov) hov.textContent = "Added";
        setTimeout(() => { lbl.textContent = "Add to Cart"; if (hov) hov.textContent = "Add to Cart"; }, 1200);
      }, 450);
    }
    setTimeout(() => Cart.add(id), 450);
  }
  const qtyBtn = e.target.closest("[data-qty]");
  if (qtyBtn) {
    const [id, qty] = qtyBtn.dataset.qty.split(":");
    Cart.setQty(id, parseInt(qty, 10));
  }
  if (e.target.closest("[data-cart-open]")) { e.preventDefault(); Cart.open(); }
  if (e.target.closest("[data-cart-close]") || e.target.id === "cart-overlay") Cart.close();
});

/* ---------- Bundle toggle ---------- */
(function bundles() {
  const toggle = document.querySelector(".bundle-toggle");
  if (!toggle) return;
  const img = document.getElementById("bundle-img");
  const price = document.getElementById("bundle-price");
  const addBtn = document.getElementById("bundle-add");
  toggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    toggle.querySelectorAll("button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    const b = BUNDLES[btn.dataset.bundle];
    img.src = b.img;
    price.textContent = `$${b.price.toFixed(2)}`;
    addBtn.dataset.add = b.id;
  });
})();

/* ---------- Pinned scroll-driven 01→03 sequence ---------- */
(function whyPin() {
  const pin = document.getElementById("why-pin");
  if (!pin) return;
  const track = document.getElementById("why-track");
  const tick = document.getElementById("tickline2");
  const steps = track.children.length;
  const onScroll = () => {
    const total = pin.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / total));
    track.style.transform = `translateX(${-p * (steps - 1) * 100}vw)`;
    tick.style.backgroundPositionX = `${-p * 1400}px`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------- Arched titles (per-letter rotation) ---------- */
document.querySelectorAll(".arc-text").forEach((el) => {
  const text = el.textContent.trim();
  el.textContent = "";
  const chars = [...text];
  const mid = (chars.length - 1) / 2;
  chars.forEach((c, idx) => {
    const s = document.createElement("span");
    s.textContent = c === " " ? " " : c;
    const off = (idx - mid) / mid;
    s.style.transform = `rotate(${off * 11}deg) translateY(${off * off * 64}px)`;
    el.appendChild(s);
  });
});

/* ---------- Reviews marquee (alternating dark/cream cards) ---------- */
(function reviews() {
  const wrap = document.getElementById("marquee");
  if (!wrap) return;
  const cards = REVIEWS.map((r, idx) => `<div class="rev-card ${idx % 2 ? "rev-cream" : "rev-dark"}">
      <div class="q">❝</div>
      <div class="rev-head">${r.quote}</div>
      <div class="rev-body">${r.body}</div>
      <div class="rev-who">${r.who}</div>
    </div>`).join("");
  wrap.innerHTML = cards + cards; // duplicated for seamless loop
})();

/* ---------- FAQ accordion ---------- */
document.querySelectorAll(".faq-q").forEach((q) => {
  q.addEventListener("click", () => q.closest(".faq-item").classList.toggle("open"));
});

/* ---------- Product cards renderer (used on home + shop) ---------- */
function renderProductCards(targetId) {
  const wrap = document.getElementById(targetId);
  if (!wrap) return;
  const hasPlayer = !!customElements.get("dotlottie-player");
  wrap.innerHTML = Object.values(PRODUCTS).map((p) => `
    <div class="card reveal" data-flavor="${p.id}">
      ${hasPlayer
        ? `<dotlottie-player class="mascot" src="${p.lottie}" autoplay loop style="width:70px;height:70px;margin:0 auto 8px;"></dotlottie-player>`
        : `<img class="mascot" src="${p.mascot}" alt="">`}
      <div class="bottle-wrap">
        <img class="bottle-front" src="${p.front}" alt="${p.flatName} bottle front">
        <img class="bottle-back" src="${p.back}" alt="${p.flatName} bottle back">
      </div>
      <h3>${p.name.replace(/\n/g, "<br>")}</h3>
      <p class="tagline">${p.tagline}</p>
      <div class="price">$${p.price.toFixed(2)}</div>
      <div class="actions">
        <button class="btn btn-orange" data-add="${p.id}">
          <span class="lbl">Add to Cart</span><span class="lbl-hover">Add to Cart</span>
        </button>
        <a class="view-link" href="product.html?f=${p.id}">View Product</a>
      </div>
    </div>`).join("");
  document.querySelectorAll("#" + targetId + " .reveal").forEach((el) => {
    new IntersectionObserver((es, io) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.disconnect(); } }), { threshold: 0.1 }).observe(el);
  });
}

/* ---------- Free-from stack: dim cards once the next plate stacks over ---------- */
(function ffStack() {
  const cards = [...document.querySelectorAll(".ff-stack .ff-card")];
  if (!cards.length) return;
  const update = () => {
    cards.forEach((c, idx) => {
      const next = cards[idx + 1];
      if (!next) { c.classList.remove("dimmed"); return; }
      const covered = next.getBoundingClientRect().top < c.getBoundingClientRect().bottom - 12;
      c.classList.toggle("dimmed", covered);
    });
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
})();

/* ---------- Per-character stagger reveal on the main heading ---------- */
(function headingReveal() {
  const el = document.querySelector(".hero2-headline") || document.querySelector(".page-hero h1");
  if (!el || el.classList.contains("arc-text") || el.dataset.split) return;
  el.dataset.split = "1";
  el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  const spans = [];
  const build = (src, dest) => {
    src.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        [...node.textContent].forEach((ch) => {
          const s = document.createElement("span");
          s.setAttribute("aria-hidden", "true");
          s.style.display = "inline-block";
          s.style.whiteSpace = "pre";
          s.textContent = ch === " " ? " " : ch;
          spans.push(s);
          dest.appendChild(s);
        });
      } else if (node.nodeType === 1) {
        if (node.tagName === "BR") { dest.appendChild(document.createElement("br")); }
        else { const clone = node.cloneNode(false); build(node, clone); dest.appendChild(clone); }
      }
    });
  };
  const frag = document.createDocumentFragment();
  build(el, frag);
  el.textContent = "";
  el.appendChild(frag);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  spans.forEach((s, i) => {
    s.animate(
      [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 520, delay: i * 40, easing: "cubic-bezier(.2,.7,.3,1)", fill: "backwards" }
    );
  });
})();

/* ---------- Vertical letter-stack decorative labels ---------- */
document.querySelectorAll(".vert-label[data-vert]").forEach((el) => {
  el.innerHTML = [...el.dataset.vert]
    .map((c) => (c === " " ? '<span class="sp"></span>' : `<span>${c}</span>`))
    .join("");
});

Cart.render();
