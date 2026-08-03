/* Slike jela za Kuvanje. Nema fotografija — svako jelo se sklapa iz posude
   (tanjir, činija, čaša…) i nekoliko slojeva hrane, isto kao što se gimnastičarka
   u illustrations.js sklapa iz skeleta po pozi. Šest posuda × devetnaest slojeva
   daje dovoljno različitih slika da četrdesetak jela izgleda različito, a da se
   ne crta četrdeset puta.

   Boje hrane su NAMERNO fiksne, ne iz teme: paradajz je crven i u lavanda temi.
   Posuđe je neutralna keramika iz istog razloga — hrana mora da se čita na svakoj
   od tri pozadine. Jedino ukras (`opts.decor`) sme da uzme var(--gd) i var(--a).

   viewBox je fiksan 0 0 200 160 i to je namerno — NE kopirati bbox() iz
   illustrations.js. Tamo je potreban jer je špaga široka a sveća visoka; ovde je
   svako jelo posuda sličnog gabarita na istoj liniji oko y=125, pa bi fitovanje
   po jelu prikazalo visoku čašu i širok tanjir u drastično različitim razmerama
   jednu pored druge u istoj mreži. Razlike se rešavaju unutar fiksnog okvira:
   čaša zauzima x 73–127, tanjir x 24–176. */
(function (global) {
  "use strict";

  var C = {
    /* povrće */
    paradajz: "#e0402c", krastavac: "#5eb35e", krompir: "#e8c589", sargarepa: "#ef8a2b",
    luk: "#ecdcc8", paprika: "#e04a3a", tikvica: "#6cb04a", spanac: "#357a35",
    salata: "#7bc043", grasak: "#61b34a", pasulj: "#c07a4a", zelen: "#4ea94e",
    /* voće */
    jabuka: "#e2483c", banana: "#f5dc72", jagoda: "#e8365d", limun: "#f5d33f",
    pomorandza: "#f59f2b", kruska: "#c8d160", grozdje: "#8e5ba6", borovnica: "#5b5fc7",
    breskva: "#f2a25c",
    /* mleko i sir */
    mleko: "#fdfbf5", jogurt: "#f8f5ec", sir: "#ffd76a", kackavalj: "#f5c243",
    pavlaka: "#fdfaf0", puter: "#f7dc8a",
    /* meso, riba, jaja */
    jaje: "#f6b93b", belance: "#fffdf6", pile: "#dfa96f", meso: "#b45739",
    sunka: "#ef9090", riba: "#a9bfc9",
    /* testenina i žitarice */
    testenina: "#efc379", pirinac: "#f7f2e3", hleb: "#e2a765", tost: "#eab777",
    kora: "#c98a4e", palenta: "#f2c451",
    /* ostalo */
    med: "#e9a72c", kakao: "#7a4a2b", cokolada: "#6b4226", orasi: "#b08050",
    keks: "#d9a86a", supa: "#eea23c", ulje: "#e8c34d", voda: "#bfe0f0",
    bela: "#fffdf6", tamna: "#4a3550"
  };

  var INK_10 = "rgba(59,37,64,.10)";
  var INK_14 = "rgba(59,37,64,.14)";
  var KERAMIKA = "#fffdf8";
  var UNUTRA = "#f3ece1";

  function r2(n) { return Math.round(n * 10) / 10; }

  /* Nepoznat ključ pada na neutralnu boju hrane, a čist heks prolazi kroz —
     isto kao POSES[pose] || POSES.prsti: iz ove funkcije ne sme da izađe
     prazan fill, jer bi jelo nestalo bez ijedne poruke o grešci. */
  function col(k, pod) {
    if (!k) return pod || "#e8c589";
    if (C[k]) return C[k];
    return k.charAt(0) === "#" ? k : (pod || "#e8c589");
  }

  /* Namerno fiksna tabela umesto Math.random(): render() se poziva na svaki
     dodir, pa slika mora da bude ista svaki put. */
  var WOB = [0, 0.62, -0.41, 0.88, -0.75, 0.3, -0.58, 0.71, -0.22, 0.49, -0.9, 0.36];
  function w(i) { return WOB[(i % WOB.length + WOB.length) % WOB.length]; }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ═══ posude ════════════════════════════════════════════════════════
     Svaka vraća { back, front, area }. `back` je unutrašnjost i daleki obod i
     crta se PRE hrane; `front` je bliža ivica, ručka ili odsjaj stakla i crta se
     POSLE, pa hrana sedi *u* posudi umesto da lebdi preko nje. `area` je prostor
     u koji slojevi polažu hranu. */

  var VESSELS = {
    tanjir: function () {
      return {
        back: '<ellipse cx="100" cy="130" rx="76" ry="16" fill="' + INK_10 + '"/>' +
          '<ellipse cx="100" cy="125" rx="76" ry="18" fill="' + KERAMIKA + '"/>' +
          '<ellipse cx="100" cy="123" rx="55" ry="12.5" fill="' + UNUTRA + '"/>',
        front: '<ellipse cx="100" cy="125" rx="76" ry="18" fill="none" stroke="' + INK_14 +
          '" stroke-width="1.6"/>',
        area: { cx: 100, cy: 114, rx: 50, ry: 12 }
      };
    },

    cinija: function () {
      return {
        back: '<ellipse cx="100" cy="140" rx="48" ry="9" fill="' + INK_10 + '"/>' +
          '<ellipse cx="100" cy="98" rx="56" ry="15" fill="' + UNUTRA + '"/>',
        front: '<path d="M44,98 C44,106.3 69.1,113 100,113 C130.9,113 156,106.3 156,98 ' +
          'C156,124 130,142 100,142 C70,142 44,124 44,98 Z" fill="' + KERAMIKA + '"/>' +
          '<path d="M44,98 C44,106.3 69.1,113 100,113 C130.9,113 156,106.3 156,98" ' +
          'fill="none" stroke="' + INK_14 + '" stroke-width="1.6"/>' +
          '<path d="M58,112 C62,128 78,136 92,138" fill="none" stroke="#fff" ' +
          'stroke-width="4" stroke-linecap="round" opacity=".5"/>',
        area: { cx: 100, cy: 97, rx: 44, ry: 11 }
      };
    },

    casa: function () {
      return {
        back: '<ellipse cx="100" cy="146" rx="26" ry="6" fill="' + INK_10 + '"/>' +
          '<path d="M73,58 L79,136 Q100,145 121,136 L127,58 Z" fill="' + UNUTRA + '"/>',
        front: '<path d="M73,58 L79,136 Q100,145 121,136 L127,58" fill="none" stroke="' + INK_14 +
          '" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<ellipse cx="100" cy="58" rx="27" ry="8" fill="none" stroke="' + INK_14 +
          '" stroke-width="2.4"/>' +
          '<path d="M84,70 L89,126" fill="none" stroke="#fff" stroke-width="3.5" ' +
          'stroke-linecap="round" opacity=".55"/>',
        area: { cx: 100, cy: 104, rx: 20, ry: 32 }
      };
    },

    daska: function () {
      return {
        back: '<ellipse cx="100" cy="142" rx="70" ry="8" fill="' + INK_10 + '"/>' +
          '<rect x="22" y="108" width="156" height="18" rx="8" fill="#e6bb80"/>' +
          '<path d="M22,120 h156 v6 a8,8 0 0 1 -8,8 h-140 a8,8 0 0 1 -8,-8 z" fill="#c8935a"/>' +
          '<circle cx="165" cy="117" r="3.6" fill="#c8935a"/>',
        front: "",
        area: { cx: 98, cy: 100, rx: 54, ry: 13 }
      };
    },

    solja: function () {
      return {
        back: '<ellipse cx="94" cy="144" rx="34" ry="7" fill="' + INK_10 + '"/>' +
          '<path d="M128,86 a17,15 0 0 1 0,30" fill="none" stroke="' + KERAMIKA +
          '" stroke-width="9" stroke-linecap="round"/>' +
          '<path d="M128,86 a17,15 0 0 1 0,30" fill="none" stroke="' + INK_14 +
          '" stroke-width="1.4" stroke-linecap="round"/>' +
          '<ellipse cx="94" cy="74" rx="34" ry="10" fill="' + UNUTRA + '"/>',
        front: '<path d="M60,74 C60,80.6 75.2,84.6 94,84.6 C112.8,84.6 128,80.6 128,74 ' +
          'L128,122 C128,130.5 112.8,136 94,136 C75.2,136 60,130.5 60,122 Z" fill="' + KERAMIKA + '"/>' +
          '<path d="M60,74 C60,80.6 75.2,84.6 94,84.6 C112.8,84.6 128,80.6 128,74" ' +
          'fill="none" stroke="' + INK_14 + '" stroke-width="1.6"/>' +
          '<path d="M70,92 L70,124" fill="none" stroke="#fff" stroke-width="4" ' +
          'stroke-linecap="round" opacity=".5"/>',
        area: { cx: 94, cy: 73, rx: 27, ry: 8 }
      };
    },

    /* Plitka vatrostalna posuda, ne duboki lim: hrana mora da se vidi, a ne da
       leži na dnu bunara. Zato svetla keramika i zid visok svega desetak jedinica. */
    pleh: function () {
      return {
        back: '<ellipse cx="100" cy="140" rx="74" ry="8" fill="' + INK_10 + '"/>' +
          '<rect x="22" y="80" width="156" height="54" rx="12" fill="#ded4c4"/>' +
          '<rect x="30" y="86" width="140" height="36" rx="8" fill="#f4ede1"/>',
        front: '<path d="M22,112 h156 v10 a12,12 0 0 1 -12,12 h-132 a12,12 0 0 1 -12,-12 z" ' +
          'fill="#ded4c4"/>' +
          '<path d="M23,112 h154" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/>',
        area: { cx: 100, cy: 99, rx: 60, ry: 14 }
      };
    }
  };

  /* ═══ slojevi hrane ═════════════════════════════════════════════════
     Svaki uzima (area, boja, indeks) i vraća SVG. Crtaju se pozadi-napred, redom
     kojim stoje u `art.t`. Boja koja nedostaje pada na razumnu za taj sloj, pa
     "steam" i "fried_egg" smeju da se navedu i bez dvotačke. */

  var TOPS = {
    mound: function (a, c) {
      c = c || C.krompir;
      var x0 = r2(a.cx - a.rx * 0.92), x1 = r2(a.cx + a.rx * 0.92);
      return '<path d="M' + x0 + "," + r2(a.cy + a.ry * 0.2) +
        " Q" + a.cx + "," + r2(a.cy - a.ry * 2.4) + " " + x1 + "," + r2(a.cy + a.ry * 0.2) +
        " Q" + a.cx + "," + r2(a.cy + a.ry * 1.1) + " " + x0 + "," + r2(a.cy + a.ry * 0.2) +
        '  Z" fill="' + c + '"/>' +
        '<path d="M' + r2(a.cx - a.rx * 0.45) + "," + r2(a.cy - a.ry * 0.9) +
        " Q" + r2(a.cx - a.rx * 0.1) + "," + r2(a.cy - a.ry * 1.7) + " " +
        r2(a.cx + a.rx * 0.2) + "," + r2(a.cy - a.ry * 1.1) +
        '" fill="none" stroke="#fff" stroke-width="' + r2(a.ry * 0.3) +
        '" stroke-linecap="round" opacity=".22"/>';
    },

    noodles: function (a, c) {
      c = c || C.testenina;
      var s = '<g fill="none" stroke="' + c + '" stroke-width="' + r2(a.ry * 0.44) +
        '" stroke-linecap="round">';
      for (var n = 0; n < 5; n++) {
        var y = r2(a.cy - a.ry * 1.0 + n * a.ry * 0.5);
        var sp = a.rx * (0.92 - n * 0.07);
        s += '<path d="M' + r2(a.cx - sp) + "," + y +
          " Q" + r2(a.cx - sp * 0.45) + "," + r2(a.cy - a.ry * 1.0 + n * a.ry * 0.5 - a.ry * 0.6) +
          " " + a.cx + "," + y +
          " T" + r2(a.cx + sp) + "," + y + '"/>';
      }
      return s + "</g>";
    },

    rounds: function (a, c) {
      c = c || C.paradajz;
      var s = "", n, x, y, r = r2(a.ry * 0.62);
      for (n = 0; n < 5; n++) {
        x = r2(a.cx + (n - 2) * a.rx * 0.38);
        y = r2(a.cy - a.ry * 0.35 + w(n) * a.ry * 0.45);
        s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/>' +
          '<circle cx="' + r2(x - r * 0.28) + '" cy="' + r2(y - r * 0.3) + '" r="' + r2(r * 0.42) +
          '" fill="#fff" opacity=".22"/>';
      }
      return s;
    },

    wedges: function (a, c) {
      c = c || C.paprika;
      var s = "", n, x;
      for (n = 0; n < 3; n++) {
        x = a.cx + (n - 1) * a.rx * 0.62;
        s += '<path d="M' + r2(x + w(n) * 3) + "," + r2(a.cy - a.ry * 1.55) +
          " L" + r2(x + a.rx * 0.3) + "," + r2(a.cy + a.ry * 0.45) +
          " L" + r2(x - a.rx * 0.3) + "," + r2(a.cy + a.ry * 0.45) +
          ' Z" fill="' + c + '"/>';
      }
      return s;
    },

    leaves: function (a, c) {
      c = c || C.salata;
      var s = "", n, x, y;
      for (n = 0; n < 5; n++) {
        x = r2(a.cx + (n - 2) * a.rx * 0.38);
        y = r2(a.cy - a.ry * 0.3 + w(n + 3) * a.ry * 0.55);
        s += '<ellipse cx="0" cy="0" rx="' + r2(a.rx * 0.25) + '" ry="' + r2(a.ry * 0.55) +
          '" fill="' + c + '" transform="translate(' + x + "," + y + ") rotate(" +
          (-44 + n * 22) + ')"/>';
      }
      return s;
    },

    cubes: function (a, c) {
      c = c || C.bela;
      var s = "", n, x, y, d = a.ry * 0.74;
      for (n = 0; n < 6; n++) {
        x = a.cx + ((n % 3) - 1) * a.rx * 0.48 + (n > 2 ? a.rx * 0.2 : 0);
        y = a.cy - a.ry * (n > 2 ? 0.9 : 0.15) + w(n) * a.ry * 0.15;
        s += '<rect x="' + r2(x - d / 2) + '" y="' + r2(y - d / 2) + '" width="' + r2(d) +
          '" height="' + r2(d) + '" rx="' + r2(d * 0.28) + '" fill="' + c +
          '" transform="rotate(' + r2(w(n) * 14) + " " + r2(x) + " " + r2(y) + ')"/>';
      }
      return s;
    },

    patty: function (a, c) {
      c = c || C.pile;
      return '<rect x="' + r2(a.cx - a.rx * 0.72) + '" y="' + r2(a.cy - a.ry * 1.05) +
        '" width="' + r2(a.rx * 1.44) + '" height="' + r2(a.ry * 1.55) +
        '" rx="' + r2(a.ry * 0.7) + '" fill="' + c + '"/>' +
        '<rect x="' + r2(a.cx - a.rx * 0.48) + '" y="' + r2(a.cy - a.ry * 0.8) +
        '" width="' + r2(a.rx * 0.96) + '" height="' + r2(a.ry * 0.38) +
        '" rx="' + r2(a.ry * 0.19) + '" fill="#fff" opacity=".2"/>';
    },

    /* Razmak između kriški mora da bude veći od njihove visine, inače se tri
       elipse stope u jednu mrlju i palačinke izgledaju kao lokva. */
    stack: function (a, c) {
      c = c || C.tost;
      var s = "", n, x, y, h = a.ry * 0.5, ry = h * 0.6;
      for (n = 0; n < 3; n++) {
        x = r2(a.cx + w(n) * a.rx * 0.08);
        y = r2(a.cy + a.ry * 0.45 - n * h * 1.25);
        s += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r2(a.rx * 0.72) + '" ry="' + r2(ry) +
          '" fill="' + c + '" stroke="rgba(59,37,64,.14)" stroke-width="1.1"/>';
      }
      return s;
    },

    /* U visokoj posudi (čaša) tečnost mora da se popne skoro do vrha — čaša
       napunjena do trećine izgleda kao da je neko već popio. */
    liquid: function (a, c) {
      c = c || C.mleko;
      var top = a.cy - a.ry * (a.ry > a.rx ? 0.82 : 0.28);
      var bot = a.cy + a.ry, rx = a.rx * 0.94;
      return '<path d="M' + r2(a.cx - rx) + "," + r2(top) +
        " L" + r2(a.cx - rx * 0.86) + "," + r2(bot) +
        " Q" + a.cx + "," + r2(bot + a.ry * 0.16) + " " + r2(a.cx + rx * 0.86) + "," + r2(bot) +
        " L" + r2(a.cx + rx) + "," + r2(top) +
        ' Z" fill="' + c + '"/>' +
        '<ellipse cx="' + a.cx + '" cy="' + r2(top) + '" rx="' + r2(rx) + '" ry="' +
        r2(Math.min(rx * 0.3, a.ry * 0.55)) + '" fill="#fff" opacity=".2"/>';
    },

    sprinkle: function (a, c) {
      c = c || C.sir;
      var s = "", n, x, y;
      for (n = 0; n < 11; n++) {
        x = r2(a.cx + ((n % 5) - 2) * a.rx * 0.34 + w(n) * a.rx * 0.16);
        y = r2(a.cy - a.ry * 0.95 + (n % 3) * a.ry * 0.55 + w(n + 5) * a.ry * 0.25);
        s += '<circle cx="' + x + '" cy="' + y + '" r="' + r2(a.ry * 0.17) + '" fill="' + c + '"/>';
      }
      return s;
    },

    grains: function (a, c) {
      c = c || C.pirinac;
      var s = '<path d="M' + r2(a.cx - a.rx * 0.88) + "," + r2(a.cy + a.ry * 0.3) +
        " Q" + a.cx + "," + r2(a.cy - a.ry * 1.9) + " " + r2(a.cx + a.rx * 0.88) + "," +
        r2(a.cy + a.ry * 0.3) + ' Z" fill="' + c + '"/>';
      for (var n = 0; n < 12; n++) {
        s += '<ellipse cx="' + r2(a.cx + ((n % 6) - 2.5) * a.rx * 0.24 + w(n) * a.rx * 0.08) +
          '" cy="' + r2(a.cy - a.ry * (n < 6 ? 0.8 : 0.2) + w(n + 2) * a.ry * 0.18) +
          '" rx="' + r2(a.ry * 0.22) + '" ry="' + r2(a.ry * 0.11) +
          '" fill="rgba(59,37,64,.16)"/>';
      }
      return s;
    },

    /* Namerno uži od ostalih slojeva: sos ide preko nečega i mora da pusti da se
       vidi šta je ispod, inače pasta pod sosom izgleda kao gola mrlja. */
    sauce: function (a, c) {
      c = c || C.paradajz;
      var X = a.rx * 0.7, Y = a.ry * 0.6;
      function px(k) { return r2(a.cx + X * k); }
      function py(k) { return r2(a.cy + Y * k); }
      return '<path d="M' + px(-0.68) + "," + py(-0.1) +
        " C" + px(-0.8) + "," + py(-1.3) + " " + px(-0.2) + "," + py(-1.55) +
        " " + px(0.14) + "," + py(-1.0) +
        " C" + px(0.44) + "," + py(-1.6) + " " + px(0.86) + "," + py(-0.85) +
        " " + px(0.6) + "," + py(0.18) +
        " C" + px(0.28) + "," + py(0.75) + " " + px(-0.34) + "," + py(0.75) +
        " " + px(-0.68) + "," + py(-0.1) +
        ' Z" fill="' + c + '"/>';
    },

    bread: function (a, c) {
      c = c || C.hleb;
      var wd = a.rx * 1.2, h = a.ry * 2.0;
      var x = a.cx - wd / 2, y = a.cy - h * 0.72;
      return '<path d="M' + r2(x) + "," + r2(y + h * 0.34) +
        " Q" + r2(x) + "," + r2(y) + " " + r2(x + wd * 0.5) + "," + r2(y) +
        " Q" + r2(x + wd) + "," + r2(y) + " " + r2(x + wd) + "," + r2(y + h * 0.34) +
        " L" + r2(x + wd) + "," + r2(y + h - 3) +
        " Q" + r2(x + wd) + "," + r2(y + h) + " " + r2(x + wd - 3) + "," + r2(y + h) +
        " L" + r2(x + 3) + "," + r2(y + h) +
        " Q" + r2(x) + "," + r2(y + h) + " " + r2(x) + "," + r2(y + h - 3) +
        ' Z" fill="' + c + '"/>' +
        '<path d="M' + r2(x + wd * 0.14) + "," + r2(y + h * 0.42) +
        " L" + r2(x + wd * 0.86) + "," + r2(y + h * 0.42) +
        '" fill="none" stroke="#fff" stroke-width="' + r2(h * 0.12) +
        '" stroke-linecap="round" opacity=".24"/>';
    },

    stick: function (a, c) {
      c = c || C.sargarepa;
      var s = "", n, x, hw = a.rx * 0.115, hh = a.ry * 1.2;
      for (n = 0; n < 4; n++) {
        x = a.cx + (n - 1.5) * a.rx * 0.44;
        s += '<rect x="' + r2(x - hw) + '" y="' + r2(a.cy - hh + w(n) * a.ry * 0.2) +
          '" width="' + r2(hw * 2) + '" height="' + r2(hh * 1.65) + '" rx="' + r2(hw) +
          '" fill="' + c + '" transform="rotate(' + r2(w(n) * 10) + " " + r2(x) + " " +
          r2(a.cy) + ')"/>';
      }
      return s;
    },

    berry: function (a, c) {
      c = c || C.jagoda;
      var s = "", n, x, y, r = r2(a.ry * 0.38);
      for (n = 0; n < 7; n++) {
        x = r2(a.cx + ((n % 4) - 1.5) * a.rx * 0.44 + (n > 3 ? a.rx * 0.22 : 0));
        y = r2(a.cy - a.ry * (n > 3 ? 0.95 : 0.25) + w(n) * a.ry * 0.18);
        s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/>' +
          '<circle cx="' + r2(x - r * 0.3) + '" cy="' + r2(y - r * 0.35) + '" r="' + r2(r * 0.32) +
          '" fill="#fff" opacity=".3"/>';
      }
      return s;
    },

    /* Visina se vezuje za manju od dve poluose, a vrtlog sedi pri vrhu prostora,
       inače u čaši potone u sok a iz šolje odleti u vazduh. Obrub je nužan:
       pavlaka je bela na beloj keramici. */
    swirl: function (a, c) {
      c = c || C.pavlaka;
      var u = Math.min(a.ry, a.rx * 0.45), base = a.cy - a.ry * 0.55, s = "", n;
      for (n = 0; n < 3; n++) {
        s += '<ellipse cx="' + r2(a.cx + w(n) * a.rx * 0.06) + '" cy="' + r2(base - n * u * 0.5) +
          '" rx="' + r2(a.rx * (0.56 - n * 0.15)) + '" ry="' + r2(u * 0.42) +
          '" fill="' + c + '" stroke="rgba(59,37,64,.13)" stroke-width="1"/>';
      }
      return s;
    },

    melt: function (a, c) {
      c = c || C.kackavalj;
      var x0 = r2(a.cx - a.rx * 0.88), x1 = r2(a.cx + a.rx * 0.88), y = a.cy - a.ry * 0.55;
      return '<path d="M' + x0 + "," + r2(y) +
        " Q" + r2(a.cx - a.rx * 0.44) + "," + r2(y - a.ry * 0.8) + " " + a.cx + "," + r2(y) +
        " Q" + r2(a.cx + a.rx * 0.44) + "," + r2(y - a.ry * 0.8) + " " + x1 + "," + r2(y) +
        " L" + x1 + "," + r2(y + a.ry * 0.4) +
        " Q" + r2(a.cx + a.rx * 0.5) + "," + r2(y + a.ry * 1.4) + " " +
        r2(a.cx + a.rx * 0.16) + "," + r2(y + a.ry * 0.55) +
        " Q" + r2(a.cx - a.rx * 0.3) + "," + r2(y + a.ry * 1.45) + " " +
        r2(a.cx - a.rx * 0.6) + "," + r2(y + a.ry * 0.55) +
        " L" + x0 + "," + r2(y + a.ry * 0.4) +
        ' Z" fill="' + c + '"/>';
    },

    fried_egg: function (a) {
      var y = a.cy - a.ry * 0.3;
      return '<path d="M' + r2(a.cx - a.rx * 0.6) + "," + r2(y) +
        " C" + r2(a.cx - a.rx * 0.74) + "," + r2(y - a.ry * 1.1) +
        " " + r2(a.cx - a.rx * 0.1) + "," + r2(y - a.ry * 1.25) +
        " " + r2(a.cx + a.rx * 0.2) + "," + r2(y - a.ry * 0.75) +
        " C" + r2(a.cx + a.rx * 0.8) + "," + r2(y - a.ry * 1.15) +
        " " + r2(a.cx + a.rx * 0.86) + "," + r2(y + a.ry * 0.5) +
        " " + r2(a.cx + a.rx * 0.24) + "," + r2(y + a.ry * 0.62) +
        " C" + r2(a.cx - a.rx * 0.3) + "," + r2(y + a.ry * 1.05) +
        " " + r2(a.cx - a.rx * 0.72) + "," + r2(y + a.ry * 0.6) +
        " " + r2(a.cx - a.rx * 0.6) + "," + r2(y) +
        ' Z" fill="' + C.belance + '"/>' +
        '<circle cx="' + r2(a.cx - a.rx * 0.02) + '" cy="' + r2(y - a.ry * 0.12) + '" r="' +
        r2(a.ry * 0.56) + '" fill="' + C.jaje + '"/>' +
        '<circle cx="' + r2(a.cx - a.rx * 0.16) + '" cy="' + r2(y - a.ry * 0.35) + '" r="' +
        r2(a.ry * 0.17) + '" fill="#fff" opacity=".35"/>';
    },

    steam: function (a, c) {
      var s = '<g fill="none" stroke="' + (c || "rgba(59,37,64,.24)") +
        '" stroke-width="3.2" stroke-linecap="round">', n, x, top;
      for (n = 0; n < 3; n++) {
        x = r2(a.cx + (n - 1) * a.rx * 0.44);
        top = r2(a.cy - a.ry - 16 - (n === 1 ? 9 : 0));
        s += '<path d="M' + x + "," + r2(top + 26) +
          " c-5.5,-6.5 5.5,-10.5 0,-17 c-5.5,-6.5 4.5,-9.5 1,-13.5" + '"/>';
      }
      return s + "</g>";
    }
  };

  /* ═══ sklapanje ═════════════════════════════════════════════════════ */

  function layers(spec, area) {
    var out = "", i, raw, j, key, fn;
    spec = spec || [];
    for (i = 0; i < spec.length; i++) {
      raw = String(spec[i]);
      j = raw.indexOf(":");
      key = j < 0 ? raw : raw.slice(0, j);
      fn = TOPS[key];
      /* Nepoznat sloj se tiho preskače. Slika bez jednog sloja je i dalje
         slika; `undefined` u putanji je pokvaren SVG. */
      if (!fn) continue;
      out += fn(area, j < 0 ? "" : col(raw.slice(j + 1)), i);
    }
    return out;
  }

  /* Jedno jelo: posuda + slojevi. `art` = { v: "cinija", t: ["liquid:supa", …] } */
  function dish(art, opts) {
    opts = opts || {};
    art = art || {};
    var v = (VESSELS[art.v] || VESSELS.tanjir)();
    var deco = "";
    if (opts.decor && global.ILLU && global.ILLU.sparkle) {
      deco = global.ILLU.sparkle(28, 32, 8, "var(--gd)") +
        global.ILLU.sparkle(174, 46, 6, "var(--a)") +
        global.ILLU.sparkle(158, 20, 4.5, "var(--v)");
    }
    return '<svg class="illu" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img" aria-label="' + esc(opts.label || "Jelo") + '">' +
      deco + v.back + layers(art.t, v.area) + v.front + "</svg>";
  }

  /* Jedan sastojak, bez posude — sitna sličica za mrežu u ostavi. */
  function namirnica(id, opts) {
    opts = opts || {};
    var list = (global.KUVANJE && global.KUVANJE.SASTOJCI) || [];
    var spec = "mound:krompir", i;
    for (i = 0; i < list.length; i++) {
      if (list[i].id === id) { spec = list[i].a || spec; break; }
    }
    return '<svg class="illu" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img" aria-label="' + esc(opts.label || id || "Sastojak") + '">' +
      layers([spec], { cx: 20, cy: 24, rx: 14, ry: 8 }) + "</svg>";
  }

  global.FOOD = {
    dish: dish, namirnica: namirnica,
    vessels: VESSELS, tops: TOPS, colors: C
  };
})(window);
