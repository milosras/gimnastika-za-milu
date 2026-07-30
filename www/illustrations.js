/* Drawn fallbacks. Lili's photographs in www/img are the real illustrations,
   but not every exercise has one yet, so this file supplies a poseable gymnast
   for those, plus the reminder scene and the sticker badges. All inline SVG,
   themed from the CSS custom properties the app already carries. */
(function (global) {
  "use strict";

  var SKIN = "#ffd9bf";
  var SKIN_FAR = "#eebd9c";
  var HAIR = "#7a4a2b";
  var INK = "#3b2540";

  /* Each pose is a tiny skeleton in a 200×200 box: hip, shoulder and head
     points, plus an elbow/hand pair per arm and a knee/foot pair per leg.
     Index 1 of arms/legs is the far side and gets drawn behind the torso. */
  var POSES = {
    spaga: {
      hip: [100, 148], shoulder: [100, 104], head: [100, 80], rot: 0,
      arms: [[[76, 82], [62, 54]], [[124, 82], [138, 54]]],
      legs: [[[64, 152], [30, 157]], [[136, 152], [170, 157]]]
    },
    leptiric: {
      hip: [100, 138], shoulder: [100, 92], head: [100, 68], rot: 0,
      arms: [[[66, 124], [84, 160]], [[134, 124], [116, 160]]],
      legs: [[[56, 150], [88, 166]], [[144, 150], [112, 166]]]
    },
    /* bridge — a wide dome on near-vertical limbs, head hanging back */
    mostic: {
      hip: [130, 108], shoulder: [70, 108], head: [50, 126], rot: -125,
      curve: [100, 58],
      arms: [[[60, 140], [52, 168]], [[68, 140], [60, 168]]],
      legs: [[[142, 140], [150, 168]], [[134, 140], [142, 168]]]
    },
    /* all fours — deliberately flat next to the bridge, only a soft cat arch */
    macka: {
      hip: [136, 104], shoulder: [76, 108], head: [56, 118], rot: 95,
      curve: [106, 92],
      arms: [[[72, 134], [70, 166]], [[80, 134], [78, 166]]],
      legs: [[[140, 132], [144, 166]], [[132, 132], [136, 166]]]
    },
    arabeska: {
      hip: [96, 112], shoulder: [90, 74], head: [86, 50], rot: -8,
      arms: [[[62, 70], [38, 58]], [[116, 80], [142, 70]]],
      legs: [[[100, 140], [102, 168]], [[126, 114], [160, 98]]]
    },
    noge: {
      hip: [122, 150], shoulder: [66, 152], head: [44, 150], rot: -90,
      arms: [[[88, 168], [110, 170]], [[86, 166], [108, 168]]],
      legs: [[[126, 112], [130, 72]], [[116, 114], [120, 74]]]
    },
    cucanj: {
      hip: [102, 118], shoulder: [96, 80], head: [90, 56], rot: -10,
      arms: [[[68, 82], [42, 84]], [[70, 88], [44, 90]]],
      legs: [[[76, 142], [74, 168]], [[118, 142], [120, 168]]]
    },
    prsti: {
      hip: [100, 112], shoulder: [100, 74], head: [100, 50], rot: 0,
      arms: [[[72, 80], [46, 66]], [[128, 80], [154, 66]]],
      legs: [[[93, 140], [91, 168]], [[107, 140], [109, 168]]]
    },
    cuk: {
      hip: [104, 142], shoulder: [88, 104], head: [80, 82], rot: -14,
      arms: [[[104, 120], [126, 126]], [[100, 126], [122, 132]]],
      legs: [[[130, 112], [112, 142]], [[136, 120], [118, 148]]]
    },
    sveca: {
      hip: [100, 118], shoulder: [100, 158], head: [98, 180], rot: 180,
      arms: [[[76, 152], [88, 126]], [[124, 152], [112, 126]]],
      legs: [[[99, 86], [98, 50]], [[107, 88], [108, 52]]]
    },
    /* jumping jack, caught mid-air */
    zvezdice: {
      hip: [100, 118], shoulder: [100, 78], head: [100, 54], rot: 0,
      arms: [[[68, 58], [50, 30]], [[132, 58], [150, 30]]],
      legs: [[[74, 148], [56, 174]], [[126, 148], [144, 174]]]
    },
    /* downward dog — an A shape on straight limbs */
    psic: {
      hip: [116, 66], shoulder: [64, 112], head: [46, 130], rot: 118,
      arms: [[[56, 140], [50, 168]], [[64, 140], [58, 168]]],
      legs: [[[140, 118], [150, 168]], [[132, 120], [142, 168]]]
    },
    /* forearm plank — one straight line, head to heels */
    daska: {
      hip: [136, 132], shoulder: [80, 122], head: [56, 118], rot: -96,
      arms: [[[76, 150], [54, 158]], [[84, 152], [62, 160]]],
      legs: [[[158, 148], [178, 166]], [[150, 150], [170, 166]]]
    },
    /* superman — prone, arms and legs lifted off the floor */
    lastavica: {
      hip: [134, 140], shoulder: [80, 144], head: [56, 136], rot: -100,
      arms: [[[54, 126], [30, 116]], [[58, 132], [34, 122]]],
      legs: [[[158, 128], [180, 114]], [[152, 134], [174, 120]]]
    },
    /* cobra — hips down, chest lifted on straight arms */
    kobra: {
      hip: [142, 154], shoulder: [88, 118], head: [70, 98], rot: -58,
      arms: [[[88, 140], [86, 168]], [[96, 142], [94, 168]]],
      legs: [[[162, 160], [184, 164]], [[156, 162], [178, 166]]]
    },
    /* seated pike fold — sitting on the floor, folded over straight legs */
    pretklon: {
      hip: [64, 148], shoulder: [106, 126], head: [126, 134], rot: 62,
      arms: [[[128, 142], [158, 150]], [[122, 146], [152, 154]]],
      legs: [[[112, 156], [162, 158]], [[106, 150], [156, 152]]]
    },
    /* forward lunge */
    iskorak: {
      hip: [104, 118], shoulder: [98, 80], head: [92, 56], rot: -8,
      arms: [[[78, 106], [70, 128]], [[124, 106], [132, 128]]],
      legs: [[[62, 140], [56, 170]], [[142, 148], [162, 170]]]
    },
    /* heel-to-toe walk, arms out for balance */
    linija: {
      hip: [100, 116], shoulder: [100, 78], head: [100, 54], rot: 0,
      arms: [[[72, 82], [44, 74]], [[128, 82], [156, 74]]],
      legs: [[[94, 144], [78, 170]], [[108, 146], [126, 172]]]
    },
    /* child's pose — sitting back on the heels, forehead down, arms forward */
    dete: {
      hip: [150, 148], shoulder: [98, 160], head: [76, 166], rot: -68,
      curve: [124, 146],
      arms: [[[72, 168], [40, 172]], [[78, 170], [46, 174]]],
      legs: [[[160, 168], [140, 174]], [[154, 170], [134, 176]]]
    }
  };

  function limb(a, b, c, w, color) {
    return '<path d="M' + a[0] + ',' + a[1] + ' L' + b[0] + ',' + b[1] +
      ' L' + c[0] + ',' + c[1] + '" fill="none" stroke="' + color +
      '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function face(p, rot, accent) {
    return '<g transform="translate(' + p[0] + ',' + p[1] + ') rotate(' + rot + ')">' +
      '<circle cx="0" cy="-14" r="9" fill="' + HAIR + '"/>' +
      '<rect x="-5" y="-10" width="10" height="4.5" rx="2.2" fill="' + accent + '"/>' +
      '<circle cx="0" cy="0" r="16" fill="' + HAIR + '"/>' +
      '<circle cx="0" cy="2.6" r="14" fill="' + SKIN + '"/>' +
      '<circle cx="-8.6" cy="6" r="2.7" fill="#ffb3cf" opacity=".75"/>' +
      '<circle cx="8.6" cy="6" r="2.7" fill="#ffb3cf" opacity=".75"/>' +
      '<circle cx="-5" cy="1.5" r="2" fill="' + INK + '"/>' +
      '<circle cx="5" cy="1.5" r="2" fill="' + INK + '"/>' +
      '<circle cx="-4.3" cy="0.7" r="0.7" fill="#fff"/>' +
      '<circle cx="5.7" cy="0.7" r="0.7" fill="#fff"/>' +
      '<path d="M-4,7.5 Q0,11 4,7.5" fill="none" stroke="' + INK +
      '" stroke-width="1.8" stroke-linecap="round"/>' +
      '</g>';
  }

  function sparkle(x, y, r, fill) {
    return '<path transform="translate(' + x + ',' + y + ') scale(' + (r / 12) + ')" ' +
      'd="M0,-12 C1.6,-4.4 4.4,-1.6 12,0 C4.4,1.6 1.6,4.4 0,12 C-1.6,4.4 -4.4,1.6 -12,0 ' +
      'C-4.4,-1.6 -1.6,-4.4 0,-12 Z" fill="' + fill + '"/>';
  }

  /* Poses differ a lot in shape — a split is wide, a candle is tall. Fitting
     the viewBox to the actual skeleton means the figure fills whatever slot
     it lands in instead of floating in a mostly empty square. */
  function bbox(p, pad) {
    var pts = [p.head, p.shoulder, p.hip]
      .concat(p.arms[0], p.arms[1], p.legs[0], p.legs[1]);
    if (p.curve) pts.push(p.curve);
    var xs = pts.map(function (a) { return a[0]; });
    var ys = pts.map(function (a) { return a[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    /* the head disc, bun included, reaches ~26 past its centre */
    x0 = Math.min(x0, p.head[0] - 26); x1 = Math.max(x1, p.head[0] + 26);
    y0 = Math.min(y0, p.head[1] - 26); y1 = Math.max(y1, p.head[1] + 26);
    return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + pad * 2, h: y1 - y0 + pad * 2 };
  }
  function r2(n) { return Math.round(n * 10) / 10; }

  /* A gymnast in one of the poses above. `accent` is the leotard. */
  function gymnast(pose, opts) {
    opts = opts || {};
    var p = POSES[pose] || POSES.prsti;
    var accent = opts.accent || "var(--a)";
    var violet = opts.violet || "var(--v)";
    var decor = opts.decor !== false;
    var b = bbox(p, decor ? 30 : 14);
    var out = '<svg class="illu" viewBox="' + r2(b.x) + " " + r2(b.y) + " " + r2(b.w) + " " + r2(b.h) +
      '" role="img" aria-label="' + (opts.label || "Gimnastičarka") + '">';

    if (decor) {
      var s = Math.min(b.w, b.h) * 0.05;
      out += '<ellipse cx="' + r2(b.x + b.w / 2) + '" cy="' + r2(b.y + b.h - 17) +
        '" rx="' + r2(b.w * 0.33) + '" ry="' + r2(Math.min(b.w, b.h) * 0.045) +
        '" fill="' + violet + '" opacity=".1"/>';
      out += sparkle(b.x + b.w * 0.08, b.y + b.h * 0.13, s, accent) +
        sparkle(b.x + b.w * 0.93, b.y + b.h * 0.21, s * 0.72, violet) +
        sparkle(b.x + b.w * 0.83, b.y + b.h * 0.05, s * 0.52, accent);
    }

    out += limb(p.shoulder, p.arms[1][0], p.arms[1][1], 10, SKIN_FAR);
    out += limb(p.hip, p.legs[1][0], p.legs[1][1], 12.5, SKIN_FAR);

    if (p.curve) {
      out += '<path d="M' + p.hip[0] + ',' + p.hip[1] + ' Q' + p.curve[0] + ',' + p.curve[1] +
        ' ' + p.shoulder[0] + ',' + p.shoulder[1] + '" fill="none" stroke="' + accent +
        '" stroke-width="30" stroke-linecap="round"/>';
    } else {
      out += '<path d="M' + p.hip[0] + ',' + p.hip[1] + ' L' + p.shoulder[0] + ',' + p.shoulder[1] +
        '" fill="none" stroke="' + accent + '" stroke-width="30" stroke-linecap="round"/>';
    }

    out += limb(p.hip, p.legs[0][0], p.legs[0][1], 12.5, SKIN);
    out += limb(p.shoulder, p.arms[0][0], p.arms[0][1], 10, SKIN);
    out += face(p.head, p.rot, violet);
    return out + '</svg>';
  }

  /* Reminder scene — the design asks for "budilnik i flašica". */
  function reminderScene(opts) {
    opts = opts || {};
    var accent = opts.accent || "var(--a)";
    var violet = opts.violet || "var(--v)";
    var o = '<svg class="illu" viewBox="0 0 200 160" role="img" aria-label="Budilnik i flašica vode">';
    o += sparkle(24, 26, 8, accent) + sparkle(176, 34, 6, violet);
    o += '<ellipse cx="100" cy="146" rx="72" ry="9" fill="' + violet + '" opacity=".1"/>';
    /* alarm clock */
    o += '<path d="M46,36 L34,24" stroke="' + violet + '" stroke-width="7" stroke-linecap="round"/>';
    o += '<path d="M94,36 L106,24" stroke="' + violet + '" stroke-width="7" stroke-linecap="round"/>';
    o += '<circle cx="46" cy="22" r="9" fill="' + accent + '"/><circle cx="94" cy="22" r="9" fill="' + accent + '"/>';
    o += '<path d="M56,128 L52,142" stroke="' + violet + '" stroke-width="7" stroke-linecap="round"/>';
    o += '<path d="M84,128 L88,142" stroke="' + violet + '" stroke-width="7" stroke-linecap="round"/>';
    o += '<circle cx="70" cy="82" r="44" fill="#fff" stroke="' + violet + '" stroke-width="6"/>';
    o += '<circle cx="70" cy="82" r="34" fill="var(--sf)" opacity=".7"/>';
    o += '<g stroke="' + violet + '" stroke-width="4" stroke-linecap="round" opacity=".55">' +
      '<path d="M70,54 v6"/><path d="M70,104 v6"/><path d="M42,82 h6"/><path d="M92,82 h6"/></g>';
    o += '<path d="M70,82 V62" stroke="' + accent + '" stroke-width="6" stroke-linecap="round"/>';
    o += '<path d="M70,82 L86,92" stroke="' + accent + '" stroke-width="6" stroke-linecap="round"/>';
    o += '<circle cx="70" cy="82" r="5" fill="' + violet + '"/>';
    /* water bottle */
    o += '<rect x="132" y="52" width="34" height="88" rx="16" fill="#fff" stroke="' + violet + '" stroke-width="5"/>';
    o += '<path d="M136,102 h26 v22 a12,12 0 0 1 -12,12 h-2 a12,12 0 0 1 -12,-12 z" fill="' + accent + '" opacity=".75"/>';
    o += '<rect x="140" y="36" width="18" height="18" rx="6" fill="' + violet + '"/>';
    o += '<rect x="136" y="66" width="26" height="10" rx="5" fill="var(--sf)"/>';
    return o + '</svg>';
  }

  /* Sticker badges — one glyph per award. */
  var GLYPHS = {
    first: '<path d="M12 3l2.6 5.7 6.2.7-4.6 4.2 1.2 6.1L12 16.6 6.6 19.7l1.2-6.1L3.2 9.4l6.2-.7z"/>',
    streak3: '<path d="M12 3c1 4-4 5-4 9a4 4 0 0 0 8 0c0-2-1-3-1-3 2 1 3 3 3 5a6 6 0 0 1-12 0c0-5 6-6 6-11z"/>',
    bridge: '<path d="M4 19q8-15 16 0"/><path d="M4 19h16"/>',
    balance: '<path d="M12 4v16"/><path d="M6 9h12"/><path d="M6 9l-3 6a3 3 0 0 0 6 0z"/><path d="M18 9l3 6a3 3 0 0 1-6 0z"/>',
    ten: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 21.5 12 19l5 2.5L15.5 14"/>',
    split: '<circle cx="12" cy="4.6" r="2.2"/><path d="M12 8v5"/><path d="M12 13L4 18"/><path d="M12 13l8 5"/>',
    candle: '<rect x="9" y="9" width="6" height="12" rx="2.4"/><path d="M12 9c0-2.6-2.2-2.6-2.2-5.2 0 0 4.4 1.2 4.4 5.2"/>',
    week: '<rect x="3" y="5" width="18" height="16" rx="4"/><path d="M8 3v4M16 3v4M3 11h18"/><path d="M8.6 15.6l2.4 2.4 4.4-4.8"/>',
    fifty: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3.4 2"/>',
    gold: '<path d="M12 5.5l2 4.4 4.8.5-3.6 3.2.9 4.7L12 15.9 7.9 18.3l.9-4.7L5.2 10.4l4.8-.5z"/><path d="M3 12h1.5M19.5 12H21M12 3v1.5M12 19.5V21"/>'
  };

  function badge(key, unlocked, opts) {
    opts = opts || {};
    var accent = opts.accent || "var(--a)";
    var gold = opts.gold || "var(--gd)";
    var stroke = unlocked ? "#fff" : "rgba(59,37,64,.34)";
    var d = GLYPHS[key] || GLYPHS.first;
    var fill = unlocked ? (key === "gold" ? gold : accent) : "rgba(123,47,242,.1)";
    return '<svg class="illu" viewBox="0 0 100 100" role="img" aria-hidden="true">' +
      '<circle cx="50" cy="50" r="40" fill="' + fill + '"/>' +
      (unlocked ? '<circle cx="50" cy="50" r="46" fill="none" stroke="' + fill +
        '" stroke-width="3" opacity=".35"/>' : "") +
      '<g transform="translate(50,50) scale(2.05) translate(-12,-12)" fill="none" stroke="' + stroke +
      '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + d + '</g></svg>';
  }

  global.ILLU = {
    gymnast: gymnast, reminderScene: reminderScene,
    badge: badge, sparkle: sparkle, poses: POSES
  };
})(window);
