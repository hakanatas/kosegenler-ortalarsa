/* SAHNE 1 — İKİ DOĞRU PARÇASI (0–10 s)  Two segments cross at their midpoints.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });

  /** the diagonals over time */
  const KEYS = [[0, 'pk'], [17.6, 'pk2'], [20.0, 'pk3'], [22.4, 'nb'], [28.4, 'pk'], [37.0, 'dik'], [46.4, 'ekd'], [56.4, 'kare']];

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'İki doğru parçası orta noktalarında kesişiyor'],
      [10.6, 27.8, 'Uçlarını birleştirelim: hangi dörtgen oluşur?'],
      [28.4, 45.8, 'Köşegenleri birbirini ortalayan dörtgenler'],
      [46.4, 65.8, 'Köşegenler dik kesişirse?'],
      [66.4, 79.8, 'Dörtgenleri köşegenlerinden tanıyalım'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), G = L.G, f = F(), a = END(t) * (1 - seg(t, 65.8, 66.4)); if (a <= 0) return;
    const v = f.stateAt(t, KEYS), q = f.quad(G, v);
    f.fill(ctx, q, seg(t, 13.6, 14.4) * a);
    f.diagonals(ctx, G, q, [seg(t, 4.6, 5.8), seg(t, 5.6, 6.8)], a, seg(t, 7.4, 8.2) * (1 - win(t, 22.4, 28.6, 0.6, 0.6)));
    f.sides(ctx, G, q, seg(t, 12.4, 14.2), a);
    f.lengths(ctx, G, q, Math.max(win(t, 14.6, 27.8), win(t, 30.2, 65.8)) * a);
    const qa = win(t, 30.8, 65.8) * a;
    if (qa > 0) {
      const m = f.measures(q);
      f.cornerMark(ctx, G, q.A, f.corner(q.A, q.B, q.D), m.A, qa, 1501);
      f.cornerMark(ctx, G, q.B, f.corner(q.B, q.C, q.A), m.B, qa, 1502);
      f.cornerMark(ctx, G, q.C, f.corner(q.C, q.D, q.B), m.C, qa, 1503);
      f.cornerMark(ctx, G, q.D, f.corner(q.D, q.A, q.C), m.D, qa, 1504);
    }
    // a right angle at O
    const ra = win(t, 47.8, 65.8) * a;
    if (ra > 0) {
      const u = A.at(q.O, 0, 22), w = A.at(q.O, 90, 22), z = [u[0] + w[0] - q.O[0], u[1] + w[1] - q.O[1]];
      Ink.path(ctx, [u, z, w], { w: 4, alpha: ra, color: LI.AMBER_RGB, seed: 1750, taper: [0, 0] });
    }
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[7.8, 10.2, 'OA = OC ve OB = OD', true],
      [11.2, 16.8, 'Varsayım: her seferinde paralelkenar oluşur'], [17.6, 21.8, 'Döndürelim, uzatalım, kısaltalım'],
      [22.8, 27.8, 'O noktası BD’nin ortası olmazsa?'],
      [30.2, 36.6, 'Birbirini ortalıyorlar: paralelkenar'], [38.4, 45.8, 'Köşegenler eşit uzunlukta olursa: dikdörtgen'],
      [47.8, 55.8, 'Köşegenler dik olursa: eşkenar dörtgen'], [57.8, 65.8, 'Köşegenler hem eşit hem dik olursa: kare'],
      [72.4, 79.8, 'Hepsinin köşegenleri birbirini ortalar: hepsi paralelkenar']]);
    exprs(ctx, t, at(W, 1), [[13.4, 16.8, 'AB ile CD, BC ile DA eşit mi?'], [18.6, 21.8, 'Karşılıklı kenarlar hep eşit: varsayım tutuyor', true],
      [24.4, 27.8, 'AB ile CD eşit değil: paralelkenar oluşmadı', true],
      [31.8, 36.6, 'Karşılıklı kenarlar eşit, karşılıklı açılar eşit'], [40.0, 45.8, 'AC = 7,2 cm, BD = 7,2 cm · dört açı 90°'],
      [49.4, 55.8, 'Dört kenar eşit, karşılıklı açılar eşit'], [59.4, 65.8, 'Dört kenar eşit, dört açı 90°'],
      [74.4, 79.8, 'Köşegenlere bakarak dörtgeni tanımlayabiliriz']]);
    exprs(ctx, t, at(W, 2), [[33.4, 36.6, 'Köşegenler: AC = 8 cm, BD = 5 cm'],
      [42.0, 45.8, 'Köşegenleri eşit ve birbirini ortalayan dörtgen dikdörtgendir', true],
      [51.4, 55.8, 'Köşegenleri dik ve birbirini ortalayan dörtgen eşkenar dörtgendir', true],
      [61.4, 65.8, 'Köşegenleri eşit, dik ve birbirini ortalayan dörtgen karedir', true],
      [76.4, 79.8, 'Kare: köşegenleri hem eşit hem dik', true]]);
  }

  /** a 2 × 2 table: are the diagonals equal? are they perpendicular? */
  function table(ctx, env, t) {
    const a = win(t, 66.6, 79.8); if (a <= 0) return;
    const L = KD.L(env), P = L.TB, f = F();
    const X = (j) => P.x + (j - 0.5) * P.dx, H = seg(t, 66.8, 67.4) * a;
    if (H > 0) {
      f.T(ctx, 'dik değil', X(0), P.y[0] - P.h * 0.55, { size: P.s * 0.8, alpha: H }); f.T(ctx, 'dik', X(1), P.y[0] - P.h * 0.55, { size: P.s * 0.8, alpha: H });
      f.T(ctx, 'eşit değil', P.lx, P.y[0], { size: P.s * 0.8, alpha: H }); f.T(ctx, 'eşit', P.lx, P.y[1], { size: P.s * 0.8, alpha: H });
      Ink.path(ctx, [[P.lx - 90, P.y[0] - P.h * 0.42], [X(1) + P.dx / 2, P.y[0] - P.h * 0.42]], { w: 3, alpha: H * 0.5, seed: 1800, taper: [0, 0] });
      Ink.path(ctx, [[P.lx + 110, P.y[0] - P.h * 0.62], [P.lx + 110, P.y[1] + P.h * 0.5]], { w: 3, alpha: H * 0.5, seed: 1801, taper: [0, 0] });
    }
    const C = [['pk', 'Paralelkenar', 0, 0, 67.6], ['ekd', 'Eşkenar dörtgen', 0, 1, 68.8], ['dik', 'Dikdörtgen', 1, 0, 70.0], ['kare', 'Kare', 1, 1, 71.2]];
    C.forEach(([st, name, i, j, t0]) => {
      const k = seg(t, t0, t0 + 0.6) * a; if (k <= 0) return;
      const G = { cx: X(j), cy: P.y[i] - P.h * 0.08, u: P.h * 0.1, r: 0, nr: 0, s: P.s }, q = f.quad(G, f.ST[st]);
      f.fill(ctx, q, k);
      [[q.A, q.B], [q.B, q.C], [q.C, q.D], [q.D, q.A]].forEach(([p, r], n) => Ink.path(ctx, [p, r], { w: 4, alpha: k, seed: 1810 + n, taper: [0, 0] }));
      Ink.path(ctx, [q.C, q.A], { w: 3, alpha: k * 0.6, seed: 1820, color: LI.AMBER_RGB, taper: [0, 0] });
      Ink.path(ctx, [q.D, q.B], { w: 3, alpha: k * 0.6, seed: 1821, color: LI.AMBER_RGB, taper: [0, 0] });
      f.T(ctx, name, G.cx, P.y[i] + P.h * 0.36, Object.assign({ size: P.s * 0.8, alpha: k, halo: true }, st === 'kare' ? f.AMB : {}));
    });
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Köşegenler birbirini ortalarsa: paralelkenar', 80.6], ['Bir de eşit uzunluktaysa: dikdörtgen', 81.6], ['Bir de dik kesişirse: eşkenar dörtgen', 82.6], ['Hem eşit hem dik: kare', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.15 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); table(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'Two segments', nameTr: 'İki doğru parçası', concept: 'Crossing at their midpoints', conceptTr: 'Orta noktalarında kesişiyor', render });
})(window.LI = window.LI || {});
