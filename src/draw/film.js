/* ─────────────────────────────────────────────────────────────
   The film's continuous state as pure functions of time.
   Two segments that bisect each other, taken as diagonals: their ends
   always make a parallelogram; equal diagonals give a rectangle,
   perpendicular ones a rhombus, both a square.
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, outBack, outCubic, inOut, hump } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;

  const T = (ctx, s, x, y, o = {}) => A.text(ctx, s, x, y, Object.assign({ size: 48 }, o));
  const AMB = { color: A.amber };
  /** text width in the brush font */
  function width(ctx, s, size) { ctx.save(); ctx.font = `${size}px "LI Brush", "Comic Sans MS", cursive`; const w = ctx.measureText(s).width; ctx.restore(); return w; }
  /** write text, shrinking it to fit width w */
  function fit(ctx, s, x, y, size, w, o = {}) { const m = width(ctx, s, size); T(ctx, s, x, y, Object.assign({ size: m > w ? size * w / m : size }, o)); }
  /** a hand-drawn check mark at (x, y) */
  function tick(ctx, x, y, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x, y], [x + 12, y + 14], [x + 38, y - 20]], { w: 7, p, alpha: a, color: LI.AMBER_RGB, seed: 401, taper: [0.05, 0.3] });
  }
  /** a hand-drawn cross over (x, y) */
  function cross(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, color: LI.AMBER_RGB, seed: 411, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, color: LI.AMBER_RGB, seed: 412, taper: [0.1, 0.3] });
  }

  /** text whose last k characters can glow amber (h: 0..1) */
  function hotTail(ctx, s, x, y, size, k, h, o = {}) {
    const w = width(ctx, s, size), head = s.slice(0, s.length - k), tail = s.slice(s.length - k), wh = width(ctx, head, size);
    const a = o.alpha ?? 1, base = Object.assign({}, o, { size, align: 'left' });
    if (head) T(ctx, head, x - w / 2, y, base);
    if (h < 1) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, { alpha: a * (1 - h) }));
    if (h > 0) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, AMB, { alpha: a * h }));
  }
  /** the big number, digit by digit; hot(i) → 0..1 amber for digit i (spaces skipped) */
  const NUMBER = '2,375';
  function bigNum(ctx, NUM, a, p, hot) {
    if (a <= 0) return;
    const w = width(ctx, NUMBER, NUM.s); let x = NUM.x - w / 2, di = 0;
    [...NUMBER].forEach((ch, j) => {
      const cw = width(ctx, ch, NUM.s);
      if (/[0-9]/.test(ch)) {
        const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2), h = hot(di++);
        if (k > 0) {
          const y = NUM.y - 20 * (1 - outBack(k)) - 10 * h;
          if (h < 1) T(ctx, ch, x + cw / 2, y, { size: NUM.s, alpha: a * k * (1 - h) });
          if (h > 0) T(ctx, ch, x + cw / 2, y, Object.assign({ size: NUM.s * (1 + 0.08 * h), alpha: a * k * h }, AMB));
        }
      }
      else if (ch !== ' ') { const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2); if (k > 0) T(ctx, ch, x + cw / 2, NUM.y, { size: NUM.s, alpha: a * k }); }
      x += cw;
    });
  }
  /* ── fractions and expressions ──────────────────────────── */
  /** width of one expression item (a string, or {n, d} for a fraction) */
  function itemW(ctx, it, s) { return typeof it === 'string' ? width(ctx, it, s) : Math.max(width(ctx, String(it.n), s * 0.72), width(ctx, String(it.d), s * 0.72)) + s * 0.25; }
  /** a row of text and stacked fractions, centred at x */
  function expr(ctx, items, x, y, s, o = {}) {
    const a = o.alpha ?? 1, col = o.color ? { color: o.color } : {};
    let w = items.reduce((u, it) => u + itemW(ctx, it, s), 0);
    const sc = o.w && w > o.w ? o.w / w : 1; s *= sc; w *= sc;
    let cx = x - w / 2;
    items.forEach((it) => {
      const iw = itemW(ctx, it, s);
      if (typeof it === 'string') T(ctx, it, cx, y, Object.assign({ size: s, alpha: a, align: 'left', halo: o.halo }, col));
      else {
        const fc = it.hot ? AMB : col, m = cx + iw / 2;
        T(ctx, String(it.n), m, y - s * 0.42, Object.assign({ size: s * 0.72, alpha: a }, fc));
        ctx.strokeStyle = it.hot ? `rgba(${LI.AMBER_RGB},${a})` : `rgba(${LI.INK_RGB},${0.85 * a})`; ctx.lineWidth = Math.max(2.5, s * 0.055);
        ctx.beginPath(); ctx.moveTo(cx + s * 0.1, y + 2); ctx.lineTo(cx + iw - s * 0.1, y + 2); ctx.stroke();
        T(ctx, String(it.d), m, y + s * 0.46, Object.assign({ size: s * 0.72, alpha: a }, fc));
      }
      cx += iw;
    });
  }
  const fr = (n, d, hot) => ({ n, d, hot });

  /* ── two diagonals crossing at O ────────────────────────── */
  /** a state is {p, q, phi, s}: AC has half-length p (cm) and lies flat; BD has half-length q at angle phi,
      its midpoint moved s cm along it away from O (s = 0: the diagonals bisect each other) */
  const ST = {
    pk: { p: 4, q: 2.5, phi: 55, s: 0 }, pk2: { p: 4, q: 3.2, phi: 118, s: 0 }, pk3: { p: 3.4, q: 2, phi: 75, s: 0 },
    nb: { p: 3.4, q: 2, phi: 75, s: 1.3 },
    dik: { p: 3.6, q: 3.6, phi: 62, s: 0 }, ekd: { p: 4, q: 2.4, phi: 90, s: 0 }, kare: { p: 3.6, q: 3.6, phi: 90, s: 0 },
  };
  const KEYSET = ['p', 'q', 'phi', 's'];
  function stateAt(t, keys) {
    const v = Object.assign({}, ST[keys[0][1]]);
    for (let i = 1; i < keys.length; i++) {
      const k = inOut(seg(t, keys[i][0], keys[i][0] + 1.4)); if (k <= 0) break;
      KEYSET.forEach((n) => { v[n] = lerp(v[n], ST[keys[i][1]][n], k); });
    }
    return v;
  }
  /** corners A (right), B, C (left), D and the centre O, in world units */
  function quad(G, v) {
    const O = [G.cx, G.cy], u = G.u, r = v.phi * Math.PI / 180, e = [Math.cos(r), -Math.sin(r)];
    return {
      O, A: [O[0] + v.p * u, O[1]], C: [O[0] - v.p * u, O[1]],
      B: [O[0] + e[0] * (v.q + v.s) * u, O[1] + e[1] * (v.q + v.s) * u], D: [O[0] - e[0] * (v.q - v.s) * u, O[1] - e[1] * (v.q - v.s) * u],
    };
  }
  const dirDeg = (P, Q) => Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]) * 180 / Math.PI;
  function corner(P, Q, R) {
    let d0 = dirDeg(P, Q), d1 = dirDeg(P, R), diff = ((d1 - d0) % 360 + 360) % 360;
    if (diff > 180) { d0 = d1; diff = 360 - diff; }
    return [d0, d0 + diff];
  }
  /** parallelogram measures that add up exactly: A = C, B = D, A + B = 180 */
  function measures(q) {
    const a = Math.round(corner(q.A, q.B, q.D)[1] - corner(q.A, q.B, q.D)[0]);
    return { A: a, B: 180 - a, C: a, D: 180 - a };
  }
  const cm = (G, P, Q) => Math.hypot(Q[0] - P[0], Q[1] - P[1]) / G.u;
  const fmt = (x) => (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace(',0', '');
  function cornerMark(ctx, G, P, c, m, a, seed) {
    if (a <= 0) return;
    if (m === 90) {
      const u = A.at(P, c[0], G.r * 0.6), w = A.at(P, c[1], G.r * 0.6), z = [u[0] + w[0] - P[0], u[1] + w[1] - P[1]];
      Ink.path(ctx, [u, z, w], { w: 5, alpha: a, color: LI.AMBER_RGB, seed, taper: [0, 0] });
    } else A.arc(ctx, P, G.r, c[0], c[1], { alpha: a, w: 6, seed });
    const q = A.at(P, (c[0] + c[1]) / 2, G.nr + (c[1] - c[0] < 50 ? 26 : 0));
    T(ctx, `${m}°`, q[0], q[1], Object.assign({ size: G.s * 0.75, alpha: a, halo: true }, AMB));
  }
  /** hash marks across a segment (n = 1 or 2), at fraction f along it */
  function hash(ctx, P, Q, n, a, seed, f = 0.5) {
    if (a <= 0) return;
    const M = [lerp(P[0], Q[0], f), lerp(P[1], Q[1], f)], L = Math.hypot(Q[0] - P[0], Q[1] - P[1]) || 1;
    const u = [(Q[0] - P[0]) / L, (Q[1] - P[1]) / L], nn = [-u[1], u[0]];
    for (let i = 0; i < n; i++) {
      const o = (i - (n - 1) / 2) * 12, c = [M[0] + u[0] * o, M[1] + u[1] * o];
      Ink.path(ctx, [[c[0] - nn[0] * 13, c[1] - nn[1] * 13], [c[0] + nn[0] * 13, c[1] + nn[1] * 13]], { w: 4, alpha: a, seed: seed + i, taper: [0, 0] });
    }
  }
  /** the diagonals (drawn to k[0], k[1]) with their half marks and O */
  function diagonals(ctx, G, q, k, a, marks) {
    if (a <= 0) return;
    const ln = (P, Q, kk, seed) => { if (kk > 0) Ink.path(ctx, [P, Q], { w: 5, p: kk, alpha: a, seed, taper: [0.05, 0.05], wob: 0.15 }); };
    ln(q.C, q.A, k[0], 1701); ln(q.D, q.B, k[1], 1702);
    if (marks > 0) {
      hash(ctx, q.O, q.A, 1, a * marks, 1710); hash(ctx, q.O, q.C, 1, a * marks, 1712);
      hash(ctx, q.O, q.B, 2, a * marks, 1714); hash(ctx, q.O, q.D, 2, a * marks, 1717);
    }
    const o = seg(Math.min(k[0], k[1]), 0.9, 1) * a;
    if (o > 0) { Ink.dot(ctx, q.O[0], q.O[1], 7, { seed: 1720, alpha: o }); T(ctx, 'O', q.O[0] + 14, q.O[1] + 34, { size: G.s * 0.7, alpha: o, halo: true }); }
  }
  /** the four sides (drawn to k), corner letters */
  function sides(ctx, G, q, k, a) {
    if (a <= 0 || k <= 0) return;
    const P = [q.A, q.B, q.C, q.D];
    P.forEach((p, i) => { const r = P[(i + 1) % 4], kk = seg(k, i * 0.25, i * 0.25 + 0.25); if (kk > 0) Ink.path(ctx, [p, r], { w: 7, p: kk, alpha: a, seed: 1730 + i, taper: [0.05, 0.05], wob: 0.2 }); });
    const f = seg(k, 0.9, 1) * a;
    if (f > 0) ['A', 'B', 'C', 'D'].forEach((s, i) => { const p = P[i], d = Math.hypot(p[0] - q.O[0], p[1] - q.O[1]) || 1; T(ctx, s, p[0] + (p[0] - q.O[0]) / d * 34, p[1] + (p[1] - q.O[1]) / d * 34, { size: G.s * 0.8, alpha: f }); });
  }
  /** side lengths in cm, outside each side */
  function lengths(ctx, G, q, a) {
    if (a <= 0) return;
    const P = [q.A, q.B, q.C, q.D];
    P.forEach((p, i) => {
      const r = P[(i + 1) % 4], M = [(p[0] + r[0]) / 2, (p[1] + r[1]) / 2], d = Math.hypot(M[0] - q.O[0], M[1] - q.O[1]) || 1;
      T(ctx, `${fmt(cm(G, p, r))} cm`, M[0] + (M[0] - q.O[0]) / d * 40, M[1] + (M[1] - q.O[1]) / d * 40, Object.assign({ size: G.s * 0.68, alpha: a, halo: true }, AMB));
    });
  }
  function fill(ctx, q, a) {
    if (a <= 0) return;
    ctx.fillStyle = `rgba(${LI.AMBER_RGB},${0.12 * a})`;
    ctx.beginPath(); [q.A, q.B, q.C, q.D].forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill();
  }

  /** an ink (not amber) cross for "not divisible" */
  function crossInk(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, seed: 421, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, seed: 422, taper: [0.1, 0.3] });
  }

  /** Nokta, as a function of time */
  function nokta(t, env) {
    const L = KD.L(env);
    const p = { x: L.nx, y: L.gy, s: L.s, mouth: 0.4, brow: 0.1 };
    const g = outCubic(seg(t, 1.3, 2.3));
    p.born = { body: lerp(0.3, 1, g), legs: outCubic(seg(t, 2.0, 2.6)), arms: outCubic(seg(t, 2.3, 2.8)), tuft: outBack(seg(t, 2.5, 2.9)) };
    if (t < 3.0) { p.sq = lerp(0.4, 1, clamp(LI.E.spring(seg(t, 1.3, 3.0) * 2, 8, 3.4), 0, 1.3)); p.drop = 1 - g; p.wobble = 1 - seg(t, 1.3, 2.8); }
    p.eyeOpen = outCubic(seg(t, 2.8, 3.1));
    KD.look(p, [L.G.cx, L.G.cy]);
    if ((t > 24.6 && t < 28) || (t > 72 && t < 80)) KD.look(p, [L.W.x, L.W.y[1]]);
    if (t > 80 && t < 84) KD.look(p, [L.SUM.x, L.SUM.y[1]]);
    if (t > 2.9 && t < 5.6) { p.hold = 'brush'; p.brushAng = -0.8 + 0.3 * Math.sin(t * 9); p.hands = { R: [1.35, -0.2 + 0.15 * Math.sin(t * 9)] }; }
    const pointing = (a, b) => { if (t > a && t < b) { p.point = 'R'; p.hands = { L: [-1.2, 0.55], R: [1.5, -0.35] }; } };
    pointing(7.8, 9.4); pointing(17.8, 19.2); pointing(24.4, 26.0); pointing(30.2, 31.8); pointing(38.4, 40.0); pointing(47.8, 49.4); pointing(57.8, 59.4); pointing(72.4, 74.0); pointing(80.6, 82.4);
    const think = seg(t, 11.0, 11.4) * (1 - seg(t, 14.6, 14.9));
    if (think > 0) { p.hands = { L: [-1.2, 0.55], R: [0.75, -1.05 + 0.08 * Math.sin(t * 14)] }; p.brow = -0.5 * think; p.mouth = 0; p.lookY -= 0.3; }
    if (t > 22.8 && t < 24.0) { p.mouthOpen = 0.55; p.eyeScale = 1.1; }
    const joy = (a, b) => { if (t > a && t < b) { p.squint = 1; p.mouth = 1; p.sq = 1 + 0.1 * hump(t, a, a + 0.6); p.y -= 26 * hump(t, a, a + 0.6); p.hands = { L: [-1.3, -0.35], R: [1.3, -0.35] }; } };
    joy(19.6, 21.2); joy(44.0, 45.6); joy(64.0, 65.6); joy(77.6, 79.2);
    if (t > 84.0) {
      const j = (t - 84.0) % 1.4;
      p.squint = 1; p.mouth = 1; p.turn = 0.15; p.lookX = 0.3; p.lookY = 0;
      p.sq = 1 + 0.1 * Math.sin(Math.PI * clamp(j / 0.6)); p.y -= 40 * Math.sin(Math.PI * clamp(j / 0.6));
      p.hands = { L: [-1.35, -0.6 - 0.2 * Math.sin(t * 6)], R: [1.35, -0.6 + 0.2 * Math.sin(t * 6)] };
      if (t > 89.2) { p.squint = 0; p.lookX = 0; p.lookY = 0.2; p.turn = 0; p.y = L.gy; p.sq = 1; p.hands = { L: [-1.2, 0.55], R: [1.2, -1.0 + 0.25 * Math.sin(t * 10)] }; }
    }
    p.blink = Math.max(hump(t, 5.8, 5.95), hump(t, 18.0, 18.15), hump(t, 33.0, 33.15), hump(t, 50.0, 50.15), hump(t, 69.0, 69.15), hump(t, 81.0, 81.15));
    return p;
  }

  function base(ctx, env, t, cam, drawBefore) {
    const L = KD.L(env);
    LI.Ambient.specks(ctx, env, cam, t, { alpha: 0.22, n: 18, depth: 0.4, seed: 21 });
    LI.Camera.apply(ctx, env, cam);
    KD.ground(ctx, env, L.nx, L.gy);
    if (drawBefore) drawBefore();
    LI.Nokta.draw(ctx, LI.Nokta.follow((tt) => nokta(tt, env), t), t);
    if (t < 1.35 && t > 0.3) { const f = seg(t, 0.3, 1.3); Ink.dot(ctx, L.nx, lerp(-700, L.gy - 14, f * f), 15, { seed: 2, bleed: 0 }); }
    if (t > 1.3) Ink.drops(ctx, L.nx, L.gy - 4, t - 1.3, { n: 9, seed: 5, ground: L.gy + 4, scale: 0.8, alpha: 1 - seg(t, 4, 8) * 0.6 });
    return L;
  }

  LI.Film = { T, AMB, width, fit, tick, cross, crossInk, expr, fr, ST, stateAt, quad, corner, measures, cm, fmt, cornerMark, hash, diagonals, sides, lengths, fill, nokta, base };
})(window.LI = window.LI || {});
