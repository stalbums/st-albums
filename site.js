/* S&T Custom Albums: fills every page from content.js.
   You don't need to edit this file. All text and prices are in content.js. */
(function () {
  var S = window.SITE; if (!S) return;
  var A = S.albums || [];

  function q(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function money(n) { return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function plus(n) { return n ? '+ ' + money(n) : 'Included'; }
  function bySlug(s) { for (var i = 0; i < A.length; i++) if (A[i].slug === s) return A[i]; }
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- simple text ---------- */
  q('[data-k]').forEach(function (e) { var v = S[e.getAttribute('data-k')]; if (v != null) { e.textContent = v; e.hidden = v === ''; } });

  /* ---------- boxes section ---------- */
  q('[data-boxes]').forEach(function (c) {
    c.innerHTML = '';
    (S.boxes || []).forEach(function (b) {
      var d = el('div', 'box'), ph = el('div', 'ph'), im = new Image();
      im.src = b.photo; im.alt = b.name; im.loading = 'lazy'; ph.appendChild(im); d.appendChild(ph);
      var t = el('div', 't'); t.appendChild(el('b', null, b.name)); if (b.text) t.appendChild(el('p', null, b.text));
      d.appendChild(t); c.appendChild(d);
    });
  });

  /* ---------- album cards ---------- */
  q('[data-cards]').forEach(function (c) {
    var ex = c.getAttribute('data-exclude'), small = !!ex; c.innerHTML = '';
    A.forEach(function (a) {
      if (a.slug === ex) return;
      var l = el('a', 'card'); l.href = a.slug + '.html';
      var ph = el('div', 'ph'), im = new Image(); im.src = a.photo || ('images/' + a.slug + '.jpg'); im.alt = a.name; im.loading = 'lazy';
      ph.appendChild(im); l.appendChild(ph);
      var b = el('div', 'body'); b.appendChild(el('h3', null, a.name)); if (!small) b.appendChild(el('p', null, a.short));
      b.appendChild(el('span', 'go', 'Choose & price →')); l.appendChild(b); c.appendChild(l);
    });
  });

  /* ---------- process steps ---------- */
  q('[data-steps]').forEach(function (c) {
    c.innerHTML = '';
    (S.steps || []).forEach(function (x) { var li = el('li'), d = el('div'); d.appendChild(el('h3', null, x[0])); d.appendChild(el('p', null, x[1])); li.appendChild(d); c.appendChild(li); });
  });

  /* ---------- Our Work flipbook ---------- */
  q('[data-book]').forEach(function (book) {
    var stage = book.querySelector('.book-stage'), thumbs = book.querySelector('.thumbs'), count = book.querySelector('.pg-count'),
        prev = book.querySelector('.prev'), next = book.querySelector('.next'), pages = S.albumPages || [], cur = 0;
    if (!pages.length) { stage.appendChild(el('p', 'book-empty', 'Album pages coming soon.')); return; }
    pages.forEach(function (src, i) {
      var d = el('div', 'spread'), im = new Image(); im.src = src; im.alt = 'Album spread ' + (i + 1); d.appendChild(im); stage.appendChild(d);
      var b = el('button'); b.type = 'button'; b.setAttribute('aria-label', 'Go to page ' + (i + 1));
      var t = new Image(); t.src = src; t.alt = ''; b.appendChild(t); b.onclick = function () { go(i); }; thumbs.appendChild(b);
    });
    function go(i) {
      cur = Math.max(0, Math.min(pages.length - 1, i));
      q('.spread', stage).forEach(function (e, k) { e.classList.toggle('on', k === cur); });
      q('button', thumbs).forEach(function (e, k) { e.classList.toggle('on', k === cur); });
      count.textContent = 'Page ' + (cur + 1) + ' of ' + pages.length; prev.disabled = cur === 0; next.disabled = cur === pages.length - 1;
    }
    prev.onclick = function () { go(cur - 1); }; next.onclick = function () { go(cur + 1); };
    document.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(cur - 1); if (e.key === 'ArrowRight') go(cur + 1); });
    var sx = null;
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
    go(0);
  });

  /* ---------- album pages ---------- */
  function coverColors(name) { return ((S.covers || {})[name]) || []; }

  function makeBuilder(host, a, oi, onBack) {
    var o = a.options[oi], single = a.options.length === 1;
    var st = { size: 0, upgrade: false, cover: 0, color: 0, spreads: 0, box: false, boxIdx: 0 };
    var wrap = el('div', 'builder'), pv = el('div', 'preview'), frame = el('div', 'pv-frame'), cap = el('p', 'pv-cap');
    pv.appendChild(frame); pv.appendChild(cap);
    var col = el('div', 'config');
    wrap.appendChild(pv); wrap.appendChild(col); host.innerHTML = ''; host.appendChild(wrap);

    function missing(text) { frame.innerHTML = ''; frame.classList.remove('diagram'); frame.appendChild(el('span', 'pv-missing', 'Photo coming soon')); cap.textContent = text; }
    function showImg(src, text) {
      if (!src) return missing(text);
      frame.innerHTML = ''; frame.classList.remove('diagram');
      var im = new Image(); im.onerror = function () { missing(text); }; im.src = src; im.alt = text; frame.appendChild(im); cap.textContent = text;
    }
    function showSize(idx) {
      var s = o.sizes[idx]; if (s[2]) return showImg(s[2], s[0]);
      frame.innerHTML = ''; frame.classList.add('diagram');
      var nums = o.sizes.map(function (x) { var m = /(\d+)/.exec(x[0]); return m ? +m[1] : 10; });
      var max = Math.max.apply(null, nums.concat([12])), W = 400, H = 300, pad = 30, unit = (H - pad * 2) / max;
      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Album size comparison">';
      nums.map(function (n, i) { return [n, i]; }).sort(function (x, y) { return y[0] - x[0]; }).forEach(function (p) {
        var n = p[0], i = p[1], sz = n * unit, x = pad + 10, y = H - pad - sz, on = i === idx;
        svg += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" class="' + (on ? 'sz-on' : 'sz-off') + '"/>';
        svg += '<text x="' + (x + sz + 8) + '" y="' + (y + 14) + '" class="' + (on ? 'sz-t-on' : 'sz-t') + '">' + o.sizes[i][0] + '</text>';
      });
      frame.innerHTML = svg + '</svg>'; cap.textContent = s[0] + ' album, shown to scale';
    }
    var incl = o.covers || [], ups = o.upgradeCovers || [];
    function coverName() { return st.upgrade ? ups[st.cover] : incl[st.cover]; }
    function showCover() { var c = coverName(), k = coverColors(c)[st.color]; showImg(k ? k[1] : '', c + (k && k[0] ? ' · ' + k[0] : '')); }

    function chips(list, sel, onPick, extra) {
      var box = el('div', 'choices');
      list.forEach(function (label, i) {
        var b = el('button', 'pick'); b.type = 'button'; b.setAttribute('aria-pressed', i === sel ? 'true' : 'false');
        b.appendChild(el('span', null, label)); if (extra && extra[i]) b.appendChild(el('small', null, extra[i]));
        b.onclick = function () { onPick(i); }; box.appendChild(b);
      });
      return box;
    }
    function swatches(c) {
      var cols = coverColors(c), box = el('div', 'swatches');
      if (cols.length < 2) return box;
      cols.forEach(function (k, i) {
        var b = el('button', 'swatch'); b.type = 'button'; b.setAttribute('aria-pressed', i === st.color ? 'true' : 'false');
        var im = new Image(); im.alt = ''; im.onerror = function () { im.remove(); b.classList.add('noimg'); }; im.src = k[1];
        b.appendChild(im); b.appendChild(el('span', null, k[0]));
        b.onclick = function () { st.color = i; render(); showCover(); };
        box.appendChild(b);
      });
      return box;
    }
    function section(title) { var s = el('div', 'cfg'); s.appendChild(el('span', 'k', title)); col.appendChild(s); return s; }
    function boxPrice() { return o.box != null ? o.box : null; }

    function lines() {
      var L = [[o.name, money(o.price)]], sz = o.sizes[st.size], k = coverColors(coverName())[st.color];
      L.push(['Size: ' + sz[0], sz[1] ? '+ ' + money(sz[1]) : '']);
      var cv = 'Cover: ' + coverName() + (k && k[0] ? ' · ' + k[0] : '');
      if (st.upgrade) L.push([cv + ' (upgraded)', '+ ' + money(o.upgradedCover)]); else L.push([cv, '']);
      if (st.spreads) L.push(['Added spreads: ' + st.spreads + ' × ' + money(o.addedSpread), '+ ' + money(st.spreads * o.addedSpread)]);
      if (st.box && boxPrice() != null) L.push(['Box: ' + ((S.boxes || [])[st.boxIdx] || {}).name, '+ ' + money(o.box)]);
      return L;
    }
    function total() {
      return o.price + (o.sizes[st.size][1] || 0) + (st.upgrade ? o.upgradedCover : 0) + st.spreads * o.addedSpread + (st.box && boxPrice() != null ? o.box : 0);
    }

    function render() {
      col.innerHTML = '';
      var h = el('div', 'cfg-head');
      if (onBack) { var bk = el('button', 'back-link', '← Back to both options'); bk.type = 'button'; bk.onclick = onBack; h.appendChild(bk); }
      h.appendChild(el(single ? 'h1' : 'h2', 'script', single ? a.name : o.name));
      if (single) h.appendChild(el('p', 'lead', a.short));
      col.appendChild(h);

      var inc = section("What's included"), parts = el('div', 'parts');
      (o.includes || []).forEach(function (p) { var d = el('div', 'part'); if (o.includes.length > 1) d.appendChild(el('b', null, p.name)); var ul = el('ul'); p.items.forEach(function (t) { ul.appendChild(el('li', null, t)); }); d.appendChild(ul); parts.appendChild(d); });
      inc.appendChild(parts);

      section('Size').appendChild(chips(o.sizes.map(function (x) { return x[0]; }), st.size, function (i) { st.size = i; render(); showSize(i); },
        o.sizes.map(function (x) { return x[1] ? '+ ' + money(x[1]) : ''; })));

      var cv = section('Cover');
      function pickCover(i) { st.cover = i; st.color = 0; render(); showCover(); }
      if (!st.upgrade) {
        cv.appendChild(chips(incl, st.cover, pickCover));
        cv.appendChild(swatches(coverName()));
      }
      if (ups.length && o.upgradedCover != null) {
        var t = el('label', 'toggle'), cb = el('input'); cb.type = 'checkbox'; cb.checked = st.upgrade;
        cb.onchange = function () { st.upgrade = cb.checked; st.cover = 0; st.color = 0; render(); showCover(); };
        t.appendChild(cb); t.appendChild(el('span', null, 'Upgrade cover')); t.appendChild(el('b', null, '+ ' + money(o.upgradedCover))); cv.appendChild(t);
        if (st.upgrade) {
          cv.appendChild(chips(ups, st.cover, pickCover));
          cv.appendChild(swatches(coverName()));
        }
      }
      cv.appendChild(el('p', 'hint', 'Click a cover to see a sample.'));

      var ex = section('Extras');
      if (o.addedSpread != null) {
        var sp = el('div', 'stepper'); sp.appendChild(el('span', null, 'Added spreads'));
        var ctl = el('div', 'ctl'), mi = el('button', null, '−'), n = el('output', null, String(st.spreads)), pl = el('button', null, '+');
        mi.type = pl.type = 'button'; mi.setAttribute('aria-label', 'Fewer spreads'); pl.setAttribute('aria-label', 'More spreads'); mi.disabled = st.spreads === 0;
        mi.onclick = function () { st.spreads = Math.max(0, st.spreads - 1); render(); };
        pl.onclick = function () { st.spreads = Math.min(50, st.spreads + 1); render(); };
        ctl.appendChild(mi); ctl.appendChild(n); ctl.appendChild(pl); sp.appendChild(ctl);
        sp.appendChild(el('b', null, '+ ' + money(o.addedSpread) + ' each')); ex.appendChild(sp);
      }
      if (boxPrice() != null) {
        var t2 = el('label', 'toggle'), cb2 = el('input'); cb2.type = 'checkbox'; cb2.checked = st.box;
        cb2.onchange = function () { st.box = cb2.checked; render(); if (st.box) { var b = (S.boxes || [])[st.boxIdx]; if (b) showImg(b.photo, b.name); } };
        t2.appendChild(cb2); t2.appendChild(el('span', null, o.boxLabel || 'Add a box')); t2.appendChild(el('b', null, '+ ' + money(o.box))); ex.appendChild(t2);
        if (st.box) {
          var bx = el('div', 'box-picks');
          (S.boxes || []).forEach(function (b, i) {
            var btn = el('button', 'box-pick'); btn.type = 'button'; btn.setAttribute('aria-pressed', i === st.boxIdx ? 'true' : 'false');
            var im = new Image(); im.src = b.photo; im.alt = ''; btn.appendChild(im); btn.appendChild(el('span', null, b.name));
            btn.onclick = function () { st.boxIdx = i; render(); showImg(b.photo, b.name); };
            bx.appendChild(btn);
          });
          ex.appendChild(bx);
        }
      }

      var sum = el('div', 'summary'); sum.appendChild(el('span', 'k', 'Your selection'));
      lines().forEach(function (l) { var r = el('div', 'row'); r.appendChild(el('span', null, l[0])); r.appendChild(el('b', null, l[1])); sum.appendChild(r); });
      var tr = el('div', 'row total'); tr.appendChild(el('span', null, 'Estimated total')); tr.appendChild(el('b', null, money(total()))); sum.appendChild(tr);
      col.appendChild(sum);

      var go = el('button', 'btn', 'Continue to inquiry'); go.type = 'button';
      go.onclick = function () {
        var data = { slug: a.slug, album: a.name, lines: lines(), total: money(total()) };
        var json = JSON.stringify(data); store('st-order', json);
        location.href = 'contact.html?order=' + encodeURIComponent(json) + '#' + a.slug;
      };
      col.appendChild(go);
      if (S.spreadNote) col.appendChild(el('p', 'hint', S.spreadNote));
    }
    render(); showImg(o.photo || a.photo, o.photo ? o.name : a.name);
  }

  function optionCard(a, o, i, onChoose) {
    var ar = el('article', 'opt');
    if (o.photo) { var ph = el('div', 'opt-photo'), pim = new Image(); pim.src = o.photo; pim.alt = o.name; pim.loading = 'lazy'; ph.appendChild(pim); ar.appendChild(ph); }
    ar.appendChild(el('span', 'caps', 'Option ' + (i + 1)));
    ar.appendChild(el('h2', 'script', o.name));
    ar.appendChild(el('div', 'opt-price', money(o.price)));
    var b1 = el('div', 'block'); b1.appendChild(el('span', 'k', "What's included")); var ps = el('div', 'parts');
    (o.includes || []).forEach(function (p) { var d = el('div', 'part'); d.appendChild(el('b', null, p.name)); var ul = el('ul'); (p.items || []).forEach(function (t) { ul.appendChild(el('li', null, t)); }); d.appendChild(ul); ps.appendChild(d); });
    b1.appendChild(ps); ar.appendChild(b1);
    var b2 = el('div', 'block'); b2.appendChild(el('span', 'k', 'Cover options')); var ct = el('div', 'cover-tags');
    (o.covers || []).forEach(function (c) { ct.appendChild(el('span', 'tag', c)); });
    b2.appendChild(ct);
    if ((o.upgradeCovers || []).length) {
      b2.appendChild(el('span', 'k up-k', 'Upgrade covers (+ ' + money(o.upgradedCover) + ')'));
      var ut = el('div', 'cover-tags'); o.upgradeCovers.forEach(function (c) { ut.appendChild(el('span', 'tag up', c)); }); b2.appendChild(ut);
    }
    ar.appendChild(b2);
    var b3 = el('div', 'block'); b3.appendChild(el('span', 'k', 'Add-ons')); var ad = el('div', 'addons');
    function row(n, p) { var r = el('div', 'row'); r.appendChild(el('span', null, n)); r.appendChild(el('b', null, money(p))); ad.appendChild(r); }
    o.sizes.forEach(function (s) { if (s[1]) row('Upgrade to ' + s[0], s[1]); });
    if (o.upgradedCover != null && (o.upgradeCovers || []).length) row('Upgraded cover', o.upgradedCover);
    if (o.addedSpread != null) row('Every added spread', o.addedSpread);
    if (o.box != null) row(o.boxLabel || 'Add a box', o.box);
    b3.appendChild(ad); ar.appendChild(b3);
    var bt = el('button', 'btn', 'Choose this option'); bt.type = 'button'; bt.onclick = function () { onChoose(i); }; ar.appendChild(bt);
    return ar;
  }

  q('[data-builder]').forEach(function (root) {
    var a = bySlug(root.getAttribute('data-builder')); if (!a) return;
    document.title = a.name + ' · S&T Custom Albums';
    q('[data-a="name"]').forEach(function (e) { e.textContent = a.name; });
    var opts = a.options || [];
    if (opts.length === 1) { makeBuilder(root, a, 0, null); return; }

    var cards = el('div'), host = el('div', 'opt-builder'); host.hidden = true;
    var head = el('div', 'opt-head'); head.appendChild(el('h1', 'script', a.name)); head.appendChild(el('p', 'lead', a.short)); cards.appendChild(head);
    var grid = el('div', 'opts');
    function choose(i) {
      cards.hidden = true; host.hidden = false;
      makeBuilder(host, a, i, function () { host.hidden = true; cards.hidden = false; root.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    opts.forEach(function (o, i) { grid.appendChild(optionCard(a, o, i, choose)); });
    cards.appendChild(grid);
    if (S.spreadNote) { var nt = el('p', 'note', S.spreadNote); nt.style.textAlign = 'center'; nt.style.marginTop = '18px'; cards.appendChild(nt); }
    root.appendChild(cards); root.appendChild(host);
  });

  /* ---------- contact page ---------- */
  q('[data-album-options]').forEach(function (sel) {
    sel.innerHTML = '';
    A.forEach(function (a) { var o = el('option', null, a.name); o.value = a.slug; sel.appendChild(o); });
    var o = el('option', null, 'Other'); o.value = 'other'; sel.appendChild(o);
    var h = location.hash.slice(1); if (bySlug(h)) sel.value = h;
  });
  q('[data-order]').forEach(function (box) {
    var raw = null;
    try { raw = new URLSearchParams(location.search).get('order'); } catch (e) {}
    if (!raw) raw = store('st-order');
    var d = null; try { d = raw ? JSON.parse(raw) : null; } catch (e) {}
    if (!d || !d.lines) return;
    var list = box.querySelector('.order-lines'); list.innerHTML = '';
    var text = [];
    d.lines.forEach(function (l) { var r = el('div', 'row'); r.appendChild(el('span', null, l[0])); r.appendChild(el('b', null, l[1])); list.appendChild(r); text.push(l[0] + (l[1] ? '  ' + l[1] : '')); });
    var t = el('div', 'row total'); t.appendChild(el('span', null, 'Estimated total')); t.appendChild(el('b', null, d.total)); list.appendChild(t);
    text.push('Estimated total: ' + d.total);
    var edit = box.querySelector('.order-edit'); if (edit && d.slug) edit.href = d.slug + '.html';
    var field = document.getElementById('f-selection'); if (field) field.value = text.join('\n');
    var sel = document.getElementById('f-type'); if (sel && bySlug(d.slug)) sel.value = d.slug;
    var wrapF = document.getElementById('sel-wrap'); if (wrapF) wrapF.hidden = false;
    box.hidden = false;
    function clear() {
      try { sessionStorage.removeItem('st-order'); } catch (e) {}
      if (field) field.value = '';
      if (wrapF) wrapF.hidden = true;
      box.hidden = true;
      try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
    }
    var rm = box.querySelector('.order-clear'); if (rm) rm.onclick = clear;
    if (sel) sel.addEventListener('change', function () { if (sel.value !== d.slug) clear(); });
  });
})();
