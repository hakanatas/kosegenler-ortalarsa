/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 6. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'İki doğru parçası birbirini ortalıyor', en: 'Two segments bisect each other',
      note: 'AC ve BD doğru parçaları O noktasında kesişiyor. O, ikisinin de orta noktası: OA ile OC eşit, OB ile OD eşit. Bunlara birbirini ortalayan doğru parçaları denir.' },
    { scene: 2, start: 10.8, end: 16.8, tr: 'Varsayım: hep paralelkenar oluşur', en: 'A guess: it is always a parallelogram',
      note: 'Uçlarını birleştirelim: bir dörtgen oluşur ve AC ile BD onun köşegenleri olur. Varsayımımız: her seferinde bir paralelkenar oluşur. Kenarları ölçelim.' },
    { scene: 2, start: 17.2, end: 21.8, tr: 'Karşılıklı kenarlar hep eşit', en: 'Opposite sides stay equal',
      note: 'Köşegenleri döndürüp uzatıp kısaltalım. Birbirlerini ortaladıkları sürece AB ile CD, BC ile DA hep eşit çıkıyor: paralelkenar.' },
    { scene: 2, start: 22.2, end: 27.8, tr: 'Ortalamazsa: paralelkenar değil', en: 'If not bisected: no parallelogram',
      note: 'Şimdi O noktası BD’nin ortası olmasın. AB ile CD artık eşit değil: paralelkenar oluşmadı. Varsayımda “birbirini ortalama” şartı önemli.' },
    { scene: 3, start: 28.6, end: 36.6, tr: 'Paralelkenar: karşılıklı kenarlar ve açılar eşit', en: 'Parallelogram: opposite sides and angles equal',
      note: 'Köşegenleri birbirini ortalayan dörtgen paralelkenardır. Karşılıklı kenarları eşit, karşılıklı açıları eşit. Köşegenleri 8 cm ve 5 cm, farklı uzunlukta.' },
    { scene: 3, start: 37.2, end: 45.8, tr: 'Köşegenler eşit: dikdörtgen', en: 'Equal diagonals: a rectangle',
      note: 'Köşegenleri eşit yapalım: ikisi de 7,2 cm olsun. Köşegenler eşit uzunlukta olunca dört açı da 90° olur: dikdörtgen. Önerme: köşegenleri eşit ve birbirini ortalayan dörtgen dikdörtgendir.' },
    { scene: 4, start: 46.6, end: 55.8, tr: 'Köşegenler dik: eşkenar dörtgen', en: 'Perpendicular diagonals: a rhombus',
      note: 'Şimdi köşegenler O noktasında dik kesişsin. Dört kenar eşit olur: eşkenar dörtgen. Önerme: köşegenleri dik ve birbirini ortalayan dörtgen eşkenar dörtgendir.' },
    { scene: 4, start: 56.6, end: 65.8, tr: 'Eşit ve dik: kare', en: 'Equal and perpendicular: a square',
      note: 'Köşegenler hem eşit uzunlukta hem dik olsun: dört kenar eşit, dört açı 90°. Bu bir kare.' },
    { scene: 5, start: 66.6, end: 72.8, tr: 'Eşit mi? Dik mi?', en: 'Equal? Perpendicular?',
      note: 'Bir tablo yapalım. Köşegenler eşit değil ve dik değilse paralelkenar, dikse eşkenar dörtgen; eşit ama dik değilse dikdörtgen, eşit ve dikse kare.' },
    { scene: 5, start: 73.0, end: 79.8, tr: 'Dörtgenleri köşegenlerinden tanıyabiliriz', en: 'Diagonals can define quadrilaterals',
      note: 'Bu önermeler dörtgenleri başka bir yoldan, köşegenleriyle tanımlamamızı sağlar. Hepsinin köşegenleri birbirini ortalar, yani hepsi paralelkenardır.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Ortala, eşitle, dikle', en: 'Bisect, make equal, make perpendicular',
      note: 'Aklında kalsın: köşegenler birbirini ortalarsa paralelkenar, bir de eşitse dikdörtgen, bir de dikse eşkenar dörtgen, eşit ve dikse kare.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Köşegenler dörtgeni anlatır!', en: 'The diagonals tell the shape!',
      note: 'Köşegenlere bakan, dörtgeni tanır!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
