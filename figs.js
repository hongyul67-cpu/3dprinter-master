/* ══════════════════════════════════════════════════════════════
   3D프린터 마스터 — 그림 모음 (그림00 시범 · 2026-09-30)
   공용 그리기 도우미 links/fig.js 를 쓴다. 이 파일은 index.html · lesson.js 가 함께 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', topics:['주제키'…], cards:['카드 앞면 글자'…], draw:function(){ … } }
       topics — index.html 의 TOPICS 키. 그 주제의 카드 화면 맨 위 「그림으로 먼저 보기」에 나온다
       cards  — data.js 의 CONCEPTS 카드 앞면 글자와 **똑같이**. 그 카드 뒷면에 🖼️ 단추가 생긴다
     순서 = 화면에 나오는 순서.

   그림 내용은 data.js 의 개념 카드와 lesson.js 의 슬라이드 본문을 그대로 옮긴 것이다.
   카드에 없는 수치는 넣지 않았다(치수 기호 그림의 숫자는 기호를 보여 주려는 예시).
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, callout = F.callout;

  /* 작은 도우미 */
  function ell(cx, cy, rx, ry, o) {
    o = o || {};
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + (o.fill || 'none') +
      '" stroke="' + (o.c || C.ink) + '" stroke-width="' + (o.w || 1.6) + '"' +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
  }
  function dot(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3) + '" fill="' + (c || C.ink) + '"/>'; }
  function nozzle(x, y, s) { /* 끝점(x,y) 기준 노즐 */
    s = s || 1;
    return F.poly([[x - 12 * s, y - 26 * s], [x + 12 * s, y - 26 * s], [x + 12 * s, y - 12 * s], [x + 5 * s, y - 12 * s],
      [x, y], [x - 5 * s, y - 12 * s], [x - 12 * s, y - 12 * s]], { close: 1, fill: C.grayM, w: 1.4 });
  }
  function divider(x, y1, y2) { return line(x, y1, x, y2, { c: C.grayM, w: 1.4, dash: '6 5' }); }
  function bed(x, y, w) { return box(x, y, w, 7, { fill: C.grayM, r: 2, w: 1 }); }
  function arcPts(cx, cy, rx, ry, a0, a1, k) {
    var p = [];
    for (var i = 0; i <= k; i++) { var a = a0 + (a1 - a0) * i / k; p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
    return p;
  }

  return {

  /* ─────────── ① 3D프린팅 개요 ─────────── */
  am: { topics: ['intro'], cards: ['적층가공(AM)이란?', '절삭가공과의 차이', '적층가공의 장점'],
    cap: '깎아 내는 절삭가공과, 한 층씩 쌓는 적층가공(3D프린팅)',
    draw: function () {
      var s = t(125, 30, '절삭가공 (SM)', { a: 'm', b: 1, size: 17 }) +
        t(355, 30, '적층가공 (AM)', { a: 'm', b: 1, size: 17, c: C.blue }) + divider(240, 18, 240);
      /* 덩어리를 깎는다 */
      s += F.path('M55,70 H100 V118 H150 V70 H195 V175 H55 Z', { fill: C.grayL, w: 2.2 });
      s += line(100, 70, 150, 70, { c: C.red, w: 1.6, dash: '5 4' });
      s += box(117, 46, 16, 60, { fill: C.grayM, r: 3, w: 1.4 });
      s += F.poly([[158, 52], [168, 48], [166, 58]], { close: 1, fill: C.red, c: C.red, w: 1 }) +
        F.poly([[172, 60], [183, 58], [178, 67]], { close: 1, fill: C.red, c: C.red, w: 1 }) +
        F.poly([[160, 64], [168, 66], [162, 72]], { close: 1, fill: C.red, c: C.red, w: 1 });
      s += callout(182, 62, 205, 98, '칩', { c: C.red, tc: C.red, b: 1 });
      s += t(125, 200, '덩어리에서 깎아 낸다', { a: 'm' }) + t(125, 226, '버려지는 재료가 많다', { a: 'm', c: C.red, b: 1 });
      /* 한 층씩 쌓는다 */
      var ws = [120, 110, 100, 96, 100, 110];
      for (var i = 0; i < ws.length; i++) {
        var top = i === ws.length - 1;
        s += box(355 - ws[i] / 2, 160 - 15 * i, ws[i], 15, { fill: top ? C.orangeL : C.blueL, c: top ? C.orange : C.blue, r: 3, w: 1.4 });
      }
      s += nozzle(355, 80) + bed(280, 175, 150);
      s += callout(412, 92, 430, 62, '새 층', { c: C.orange, tc: C.orange, b: 1 });
      s += t(355, 200, '한 층씩 쌓아 올린다', { a: 'm' }) + t(355, 226, '버리는 재료가 적다', { a: 'm', c: C.green, b: 1 });
      return F.svg(480, 248, s);
    } },

  flow: { topics: ['intro'], cards: ['3D프린터 작업 순서'],
    cap: '작업 순서 — 모델링 → 슬라이싱(G코드로 변환) → 출력',
    draw: function () {
      var s = '', x = [12, 180, 348], fill = [C.blueL, C.orangeL, C.greenL], c = [C.blue, C.orange, C.green],
        a = ['3D 모델링', '슬라이싱', '출력'], b = ['CAD · 3D 스캔', 'G코드로 변환', '한 층씩 적층'];
      for (var i = 0; i < 3; i++) {
        s += box(x[i], 34, 120, 72, { fill: fill[i], c: c[i] }) + F.num(x[i] + 14, 34, i + 1, { c: c[i] }) +
          t(x[i] + 60, 62, a[i], { a: 'm', b: 1, size: 17, halo: false }) + t(x[i] + 60, 86, b[i], { a: 'm', size: 14, c: C.sub, halo: false });
      }
      s += arrow(134, 70, 178, 70) + t(156, 52, 'STL', { a: 'm', size: 13, b: 1, c: C.sub });
      s += arrow(302, 70, 346, 70) + t(324, 52, 'G코드', { a: 'm', size: 13, b: 1, c: C.sub });
      return F.svg(480, 126, s);
    } },

  xyz: { topics: ['intro', 'gcode'], cards: ['기본 메커니즘', '좌표계 축', '델타 방식 좌표'],
    cap: 'X·Y·Z 3축 — 가로 X, 세로 Y, 높이 Z (CNC 공작기계와 같은 구조)',
    draw: function () {
      var s = '', O = [80, 200];
      s += arrow(O[0], O[1], 182, 200, { c: C.red }) + t(182, 222, 'X 가로', { a: 'm', b: 1, c: C.red });
      s += arrow(O[0], O[1], 138, 150, { c: C.green }) + t(146, 140, 'Y 세로', { b: 1, c: C.green });
      s += arrow(O[0], O[1], O[0], 82, { c: C.blue }) + t(O[0], 66, 'Z 높이', { a: 'm', b: 1, c: C.blue });
      s += dot(O[0], O[1], 4) + t(O[0] - 8, 214, '원점', { a: 'e', size: 13, c: C.sub });
      /* 프린터 */
      s += box(262, 44, 12, 186, { fill: C.grayM, r: 2, w: 1.2 }) + box(436, 44, 12, 186, { fill: C.grayM, r: 2, w: 1.2 }) +
        box(262, 40, 186, 12, { fill: C.grayM, r: 2, w: 1.2 });
      s += box(274, 112, 162, 10, { fill: C.grayM, r: 2, w: 1.2 });
      s += box(335, 98, 40, 36, { fill: C.orangeL, c: C.orange, r: 4 }) + F.poly([[349, 134], [361, 134], [355, 146]], { close: 1, fill: C.ink, w: 1 });
      s += F.poly([[290, 198], [428, 198], [414, 220], [276, 220]], { close: 1, fill: C.blueL, c: C.blue, w: 1.4 });
      s += box(337, 180, 36, 18, { fill: C.blueL, c: C.blue, r: 2, w: 1.2 });
      s += arrow(318, 86, 392, 86, { c: C.red, both: 1, w: 1.8, head: 9 }) + t(400, 86, 'X', { b: 1, c: C.red });
      s += arrow(290, 94, 290, 158, { c: C.blue, both: 1, w: 1.8, head: 9 }) + t(300, 166, 'Z', { b: 1, c: C.blue });
      s += arrow(378, 244, 402, 206, { c: C.green, both: 1, w: 1.8, head: 9 }) + t(410, 240, 'Y', { b: 1, c: C.green });
      return F.svg(480, 262, s);
    } },

  /* ─────────── ② 프린팅 방식 ─────────── */
  'method-tree': { topics: ['method'], cards: ['재료 기반 3대 분류', '소재 연결 정리'],
    cap: '재료가 고체냐 · 액체냐 · 분말이냐로 방식이 세 갈래로 나뉜다',
    draw: function () {
      var s = box(170, 14, 140, 40, { fill: C.grayL, label: '재료의 상태' });
      s += F.poly([[240, 54], [240, 70], [85, 70], [85, 88]], { w: 1.6 }) + F.poly([[240, 70], [395, 70], [395, 88]], { w: 1.6 }) + line(240, 70, 240, 88, { w: 1.6 });
      var x = [15, 170, 325], fl = [C.orangeL, C.blueL, C.purpleL], cl = [C.orange, C.blue, C.purple],
        name = ['고체 기반', '액체 기반', '분말 기반'], sub = ['필라멘트 · 시트', '광경화성 레진', '플라스틱 · 금속 분말'],
        list = [['FDM', 'LOM'], ['SLA', 'DLP', 'Polyjet'], ['SLS', 'DMLS', '3DP', 'EBM']];
      for (var i = 0; i < 3; i++) {
        s += box(x[i], 88, 140, 40, { fill: fl[i], c: cl[i], label: name[i], lc: cl[i] });
        s += line(x[i] + 70, 128, x[i] + 70, 140, { w: 1.6 });
        s += box(x[i], 140, 140, 114, { fill: C.paper, c: cl[i], w: 1.4 });
        s += t(x[i] + 70, 158, sub[i], { a: 'm', size: 13, c: C.sub });
        for (var j = 0; j < list[i].length; j++) s += t(x[i] + 70, 180 + j * 19, list[i][j], { a: 'm', b: 1, size: 16, ans: 1 });
      }
      return F.svg(480, 266, s);
    } },

  fdm: { topics: ['method'], cards: ['FDM / FFF'],
    cap: 'FDM — 필라멘트를 노즐에서 녹여 짜내며 한 층씩 쌓는다',
    draw: function () {
      var s = F.circle(75, 80, 42, { fill: C.orangeL, c: C.orange }) + F.circle(75, 80, 12, { fill: C.paper, c: C.orange });
      s += t(75, 140, '필라멘트', { a: 'm', b: 1 }) + t(75, 160, '(열가소성 수지)', { a: 'm', size: 13, c: C.sub });
      s += F.path('M112,62 Q180,30 240,48 L240,120', { c: C.orange, w: 3 });
      s += F.circle(226, 84, 12, { fill: C.grayM }) + F.circle(254, 84, 12, { fill: C.grayM });
      s += box(214, 118, 52, 34, { fill: C.redL, c: C.red, label: '가열', size: 13, lc: C.red });
      s += F.poly([[228, 152], [252, 152], [240, 170]], { close: 1, fill: C.grayM, w: 1.4 });
      s += line(240, 170, 240, 186, { c: C.orange, w: 5 });
      s += box(150, 186, 90, 12, { fill: C.orangeL, c: C.orange, r: 2, w: 1.2 });
      for (var i = 0; i < 3; i++) s += box(150, 198 + 12 * i, 180, 12, { fill: C.blueL, c: C.blue, r: 2, w: 1.2 });
      s += bed(60, 234, 360);
      s += arrow(256, 178, 298, 178, { c: C.blue, w: 1.8, head: 9 });
      s += callout(266, 84, 318, 62, '구동 기어') + callout(266, 132, 318, 110, '가열 블록') +
        callout(250, 162, 318, 148, '노즐') + callout(330, 216, 356, 216, '쌓인 층') + callout(400, 241, 416, 266, '베드');
      return F.svg(480, 286, s);
    } },

  'sla-dlp': { topics: ['method', 'mat'], cards: ['SLA', 'DLP', '레진(광경화성 수지)'],
    cap: 'SLA 는 레이저 “점”으로, DLP 는 프로젝터로 한 층 “면”을 한 번에 굳힌다',
    draw: function () {
      var s = t(120, 24, 'SLA', { a: 'm', b: 1, size: 18, c: C.blue }) + t(360, 24, 'DLP', { a: 'm', b: 1, size: 18, c: C.purple }) + divider(240, 14, 280);
      /* SLA */
      s += box(24, 44, 64, 30, { fill: C.redL, c: C.red, label: '레이저', size: 13, lc: C.red });
      s += line(88, 59, 160, 59, { c: C.red, w: 2 }) + line(150, 48, 172, 70, { w: 4 }) + line(161, 59, 126, 188, { c: C.red, w: 2 });
      s += callout(170, 52, 196, 40, '거울', { a: 's' });
      s += box(30, 170, 180, 80, { fill: C.blueL, c: C.blueL, r: 2, w: 1 }) + F.path('M26,160 V254 H214 V160', {});
      s += box(95, 188, 70, 40, { fill: '#93c5fd', c: C.blue, r: 2, w: 1.2 }) + dot(126, 188, 4.5, C.red);
      s += t(40, 238, '액체 레진', { size: 13, c: C.blue, halo: false });
      s += t(120, 272, '레이저 “점”으로 그린다', { a: 'm', size: 14, b: 1 });
      /* DLP */
      s += box(322, 42, 76, 34, { fill: C.purpleL, c: C.purple, label: '프로젝터', size: 13, lc: C.purple });
      s += F.poly([[346, 76], [374, 76], [410, 188], [310, 188]], { close: 1, fill: C.yellowL, c: '#eab308', w: 1 });
      s += box(270, 170, 180, 80, { fill: C.blueL, c: C.blueL, r: 2, w: 1 }) + F.path('M266,160 V254 H454 V160', {});
      s += box(325, 188, 70, 40, { fill: '#93c5fd', c: C.blue, r: 2, w: 1.2 }) + line(325, 188, 395, 188, { c: C.purple, w: 5 });
      s += t(280, 238, '액체 레진', { size: 13, c: C.blue, halo: false });
      s += t(360, 272, '한 층을 “면”으로 한 번에', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 290, s);
    } },

  sls: { topics: ['method'], cards: ['SLS', 'DMLS'],
    cap: 'SLS — 분말을 한 층 깔고 레이저로 녹여 붙인다(소결). 남은 분말이 받쳐 줘서 지지대가 필요 없다',
    draw: function () {
      var s = box(205, 24, 70, 30, { fill: C.redL, c: C.red, label: '레이저', size: 13, lc: C.red }) + line(240, 54, 240, 128, { c: C.red, w: 2 });
      s += t(26, 84, '롤러가 분말을 한 층씩 편다', { size: 13.5 });
      s += box(26, 128, 110, 120, { fill: '#eeeceb', r: 2 }) + box(160, 128, 170, 120, { fill: '#eeeceb', r: 2 });
      for (var x = 34; x < 330; x += 12) for (var y = 136; y < 248; y += 12) {
        if (x > 136 && x < 162) continue;
        if (x > 196 && x < 284 && y < 204) continue;
        s += dot(x, y, 1.6, '#a8a29e');
      }
      s += box(200, 129, 80, 70, { fill: C.orangeL, c: C.orange, r: 2, w: 1.8 }) + dot(240, 129, 4.5, C.red);
      s += F.circle(142, 116, 11, { fill: C.grayM }) + arrow(158, 104, 198, 104, { c: C.blue, w: 1.8, head: 9 });
      s += t(81, 264, '분말 공급', { a: 'm', size: 13, c: C.sub }) + t(245, 264, '만드는 곳', { a: 'm', size: 13, c: C.sub });
      s += callout(280, 160, 344, 146, '소결된 부분', { tc: C.orange, b: 1 });
      s += callout(318, 226, 344, 206, '굳지 않은 분말이\n받쳐 준다', { size: 14 });
      s += t(350, 238, '→ 지지대 불필요', { size: 14, c: C.green, b: 1 });
      return F.svg(480, 280, s);
    } },

  /* ─────────── ③ 재료 ─────────── */
  thermo: { topics: ['mat'], cards: ['열가소성 vs 열경화성'],
    cap: '열가소성은 데우면 다시 물러지고, 열경화성은 한 번 굳으면 끝이다',
    draw: function () {
      var s = t(20, 26, '열가소성 — PLA · ABS', { b: 1, c: C.blue });
      s += box(20, 44, 110, 44, { fill: C.blueL, c: C.blue, label: '단단함' }) + box(185, 44, 110, 44, { fill: C.orangeL, c: C.orange, label: '물러짐' }) +
        box(350, 44, 110, 44, { fill: C.blueL, c: C.blue, label: '다시 단단함' });
      s += arrow(132, 66, 183, 66, { c: C.red }) + t(157, 52, '가열', { a: 'm', size: 13, c: C.red, b: 1 });
      s += arrow(297, 66, 348, 66, { c: C.blue }) + t(322, 52, '식힘', { a: 'm', size: 13, c: C.blue, b: 1 });
      s += F.route([[405, 88], [405, 108], [240, 108], [240, 90]], { c: C.red, w: 1.6, head: 9 }) +
        t(322, 124, '다시 데우면 또 물러진다', { a: 'm', size: 13, c: C.red });
      s += t(20, 152, '열경화성 — 레진 계열', { b: 1, c: C.orange });
      s += box(20, 168, 110, 44, { fill: C.grayL, label: '굳기 전' }) + box(185, 168, 110, 44, { fill: C.orangeL, c: C.orange, label: '단단히 경화' }) +
        box(350, 168, 110, 44, { fill: C.paper, c: C.sub, dash: '5 4', label: '다시 안 녹음', lc: C.sub, size: 15 });
      s += arrow(132, 190, 183, 190, { c: C.red }) + t(157, 176, '가열', { a: 'm', size: 13, c: C.red, b: 1 });
      s += arrow(297, 190, 348, 190, { c: C.sub, dash: '4 3' }) + t(322, 190, '✕', { a: 'm', size: 22, c: C.red, b: 1 });
      return F.svg(480, 226, s);
    } },

  pva: { topics: ['mat', 'post'], cards: ['PVA', '수용성 서포터 제거'],
    cap: 'PVA 는 물에 녹는다 — 서포터로 쓰면 물에 담가 녹여 없앤다',
    draw: function () {
      function obj(dx) {
        return box(dx + 70, 95, 40, 85, { fill: C.blueL, c: C.blue, r: 2 }) + box(dx + 40, 73, 150, 22, { fill: C.blueL, c: C.blue, r: 2 }) + bed(dx + 30, 180, 170);
      }
      var sup = { fill: C.yellowL, c: '#ca8a04', dash: '4 3', r: 0, w: 1.2 };
      var s = t(115, 26, '출력 직후', { a: 'm', b: 1 }) + t(365, 26, '물에 녹인 뒤', { a: 'm', b: 1 });
      s += box(40, 95, 30, 85, sup) + box(110, 95, 80, 85, sup) + obj(0);
      s += t(115, 206, '노란 부분 = PVA 서포터', { a: 'm', size: 13.5, c: '#a16207', b: 1 });
      s += arrow(210, 124, 262, 124, { c: C.blue }) + t(236, 104, '물에 담그기', { a: 'm', size: 13, c: C.blue, b: 1 });
      s += obj(250) + t(365, 206, '서포터만 녹아 없어진다', { a: 'm', size: 13.5, c: C.green, b: 1 });
      return F.svg(480, 226, s);
    } },

  /* ─────────── ④ 3D 스캐닝 ─────────── */
  'scan-types': { topics: ['scan'], cards: ['스캐닝이란?', '접촉식 스캐너', '패턴 이미지 기반', '백색광 방식', '변조광 방식', ],
    cap: '3D 스캐너는 “닿느냐, 안 닿느냐”로 먼저 나눈다',
    draw: function () {
      var s = box(170, 14, 140, 38, { fill: C.grayL, label: '3D 스캐너' });
      s += F.poly([[240, 52], [240, 66], [85, 66], [85, 80]], { w: 1.6 }) + F.poly([[240, 66], [330, 66], [330, 80]], { w: 1.6 });
      s += box(20, 80, 130, 38, { fill: C.orangeL, c: C.orange, label: '접촉식', lc: C.orange });
      s += t(85, 146, '터치 프로브로\n좌표를 읽는다', { a: 'm', size: 14 }) + t(85, 186, '정밀 · 느림', { a: 'm', size: 14, c: C.orange, b: 1 });
      s += box(200, 80, 260, 38, { fill: C.blueL, c: C.blue, label: '비접촉식 (빛 · 레이저)', lc: C.blue });
      s += line(330, 118, 330, 126, { w: 1.6 }) + F.poly([[262, 132], [262, 126], [397, 126], [397, 132]], { w: 1.6 });
      var it = [['TOF', '왕복 시간으로'], ['광 삼각법', '반사광 · CCD'], ['패턴 이미지', '패턴 변형 측정'], ['변조광', '주파수 변조']];
      for (var i = 0; i < 4; i++) {
        var x = i % 2 ? 335 : 200, y = i < 2 ? 132 : 192;
        s += box(x, y, 125, 52, { fill: C.paper, c: C.blue, w: 1.3 }) + t(x + 62, y + 18, it[i][0], { a: 'm', b: 1, ans: 1 }) +
          t(x + 62, y + 38, it[i][1], { a: 'm', size: 13, c: C.sub });
      }
      return F.svg(480, 258, s);
    } },

  triangulation: { topics: ['scan'], cards: ['광 삼각법 레이저', '핸드헬드 스캐너'],
    cap: '광 삼각법 — 레이저 · 물체 · 카메라가 이루는 삼각형으로 거리를 잰다',
    draw: function () {
      var s = box(40, 40, 80, 36, { fill: C.redL, c: C.red, label: '레이저', lc: C.red, size: 14 }) +
        box(330, 40, 110, 36, { fill: C.blueL, c: C.blue, label: 'CCD 카메라', lc: C.blue, size: 14 });
      s += line(120, 58, 330, 58, { c: C.sub, w: 1.2, dash: '5 4' }) + t(225, 44, '거리가 정해진 기준선', { a: 'm', size: 13, c: C.sub });
      s += ell(220, 234, 92, 16, { fill: C.grayM, c: C.ink });
      s += box(180, 150, 80, 76, { fill: C.orangeL, c: C.orange, r: 4 });
      s += line(80, 76, 205, 150, { c: C.red, w: 2.2 }) + line(205, 150, 385, 76, { c: C.blue, w: 2, dash: '6 4' }) + dot(205, 150, 4.5, C.red);
      s += t(118, 124, '레이저 빛', { a: 'e', size: 14, c: C.red, b: 1 }) + t(318, 124, '반사광', { size: 14, c: C.blue, b: 1 });
      s += F.route(arcPts(220, 236, 104, 26, 0.3 * Math.PI, 0.72 * Math.PI, 10), { c: C.blue, w: 1.8, head: 9 });
      s += callout(306, 240, 340, 264, '턴테이블');
      return F.svg(480, 284, s);
    } },

  tof: { topics: ['scan'], cards: ['TOF 방식'],
    cap: 'TOF — 레이저가 갔다 돌아오는 시간으로 거리를 계산한다',
    draw: function () {
      var s = box(24, 68, 84, 64, { fill: C.grayL, label: '스캐너' }) + box(400, 36, 40, 124, { fill: C.orangeL, c: C.orange, r: 3 });
      s += t(420, 176, '물체', { a: 'm', size: 14 });
      s += arrow(110, 88, 398, 88, { c: C.red }) + t(252, 72, '① 레이저를 쏜다', { a: 'm', size: 14, c: C.red, b: 1 });
      s += arrow(398, 114, 110, 114, { c: C.blue }) + t(252, 132, '② 반사되어 돌아온다', { a: 'm', size: 14, c: C.blue, b: 1 });
      s += t(222, 176, '거리 = 빛의 속도 × 왕복 시간 ÷ 2', { a: 'm', b: 1, size: 15 });
      return F.svg(480, 198, s);
    } },

  'scan-data': { topics: ['scan'], cards: ['스캔 데이터 유형'],
    cap: '스캔 데이터는 점군 → 폴리라인 → 삼각형 메시로 다듬어 STL 로 저장한다',
    draw: function () {
      var s = '', cx = [62, 182, 302, 422], P = [];
      function pts(c) {
        var a = [];
        for (var r = 0; r < 3; r++) { var row = []; for (var k = 0; k < 6; k++) row.push([c - 40 + k * 16, 52 + r * 24 - 12 * Math.sin(Math.PI * k / 5)]); a.push(row); }
        return a;
      }
      for (var p = 0; p < 3; p++) {
        P = pts(cx[p]);
        if (p === 2) for (var r = 0; r < 2; r++) for (var k = 0; k < 5; k++) {
          var a = P[r][k], b = P[r][k + 1], c = P[r + 1][k], d = P[r + 1][k + 1];
          s += F.poly([a, b, c], { close: 1, fill: C.blueL, c: C.blue, w: 1 }) + F.poly([b, d, c], { close: 1, fill: C.blueL, c: C.blue, w: 1 });
        }
        if (p === 1) for (var r2 = 0; r2 < 3; r2++) s += F.poly(P[r2], { c: C.blue, w: 1.6 });
        for (var r3 = 0; r3 < 3; r3++) for (var k3 = 0; k3 < 6; k3++) s += dot(P[r3][k3][0], P[r3][k3][1], 2.6, C.ink);
      }
      s += F.path('M396,34 H436 L450,48 V116 H396 Z', { fill: C.greenL, c: C.green, w: 1.8 }) + F.path('M436,34 V48 H450', { c: C.green, w: 1.4 }) +
        t(423, 84, 'STL', { a: 'm', b: 1, size: 17, c: C.green, halo: false });
      var nm = ['점군', '폴리라인', '삼각형 메시', 'STL 파일'];
      for (var i = 0; i < 4; i++) s += t(cx[i], 146, nm[i], { a: 'm', b: 1, size: 15, ans: 1 });
      for (var j = 0; j < 3; j++) s += arrow(cx[j] + 46, 80, cx[j] + 74, 80, { c: C.sub, w: 1.8, head: 9 });
      return F.svg(480, 166, s);
    } },

  /* ─────────── ⑤ 데이터 포맷 ─────────── */
  stl: { topics: ['format'], cards: ['STL'],
    cap: 'STL 은 곡면을 삼각형 조각으로 근사한다 — 색·질감·위상정보가 없다',
    draw: function () {
      var s = F.circle(120, 104, 70, { fill: C.blueL, c: C.blue, w: 2 }) + t(120, 200, '실제 모양(매끈한 곡면)', { a: 'm', size: 14 });
      var v = [];
      for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5; v.push([350 + 70 * Math.cos(a), 104 + 70 * Math.sin(a)]); }
      s += F.circle(350, 104, 70, { fill: 'none', c: C.line, w: 1, dash: '4 4' });
      s += F.poly(v, { close: 1, fill: C.blueL, c: C.blue, w: 2 });
      for (var j = 0; j < 10; j++) s += line(350, 104, v[j][0], v[j][1], { c: C.blue, w: 1 });
      s += arrow(205, 104, 265, 104) + t(235, 86, '변환', { a: 'm', size: 13, b: 1 });
      s += t(350, 200, 'STL — 삼각형으로 근사', { a: 'm', size: 15, b: 1 }) + t(350, 224, '색 · 질감 · 위상정보 없음', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 242, s);
    } },

  formats: { topics: ['format'], cards: ['OBJ', 'AMF', 'IGES', 'STEP', 'XYZ'],
    cap: '포맷마다 “무엇을 담느냐”가 다르다',
    draw: function () {
      var s = '', W = 148, H = 104, it = [
        ['STL', '삼각형 면만', 'mesh'], ['OBJ', '폴리곤 + 색·질감', 'meshc'], ['AMF', 'STL 보완 · 색·윤곽', 'meshc'],
        ['IGES', '최초 호환 표준', 'ent'], ['STEP', 'ISO · CAD 간 교환', 'swap'], ['XYZ', '점 좌표만', 'dots']];
      for (var i = 0; i < 6; i++) {
        var x = 12 + (i % 3) * (W + 8), y = 12 + Math.floor(i / 3) * (H + 10), cx = x + 36, cy = y + 40, ic = '';
        if (it[i][2] === 'mesh' || it[i][2] === 'meshc') {
          var col = it[i][2] === 'meshc';
          ic = F.poly([[cx - 20, cy + 16], [cx, cy - 20], [cx + 20, cy + 16]], { close: 1, fill: col ? C.orangeL : C.blueL, c: C.blue, w: 1.4 }) +
            line(cx, cy - 20, cx, cy + 16, { c: C.blue, w: 1 }) + line(cx - 20, cy + 16, cx + 10, cy - 2, { c: C.blue, w: 1 });
          if (col) ic += F.circle(cx + 20, cy - 16, 7, { fill: C.red, c: C.red, w: 1 });
        } else if (it[i][2] === 'ent') {
          ic = dot(cx - 20, cy - 14, 3.5) + line(cx - 20, cy + 16, cx + 6, cy - 16, { w: 1.8 }) + F.circle(cx + 12, cy + 8, 11, { fill: 'none', w: 1.8 });
        } else if (it[i][2] === 'swap') {
          ic = box(cx - 26, cy - 14, 18, 28, { fill: C.blueL, c: C.blue, r: 3, w: 1.2 }) + box(cx + 8, cy - 14, 18, 28, { fill: C.greenL, c: C.green, r: 3, w: 1.2 }) +
            arrow(cx - 6, cy - 4, cx + 6, cy - 4, { w: 1.4, head: 7 }) + arrow(cx + 6, cy + 6, cx - 6, cy + 6, { w: 1.4, head: 7 });
        } else {
          for (var d = 0; d < 7; d++) ic += dot(cx - 20 + (d * 13) % 40, cy - 16 + ((d * 17) % 32), 2.8);
        }
        s += box(x, y, W, H, { fill: C.paper, c: C.grayM, w: 1.4 }) + ic +
          t(x + 72, y + 40, it[i][0], { b: 1, size: 19 }) + t(x + W / 2, y + 86, it[i][1], { a: 'm', size: 13, c: C.sub, ans: 1 });
      }
      return F.svg(480, 244, s);
    } },

  /* ─────────── ⑥ 3D 모델링 ─────────── */
  'poly-nurbs': { topics: ['model'], cards: ['폴리곤 모델링', '넙스(NURBS) 모델링'],
    cap: '폴리곤은 면을 이어 붙여 각이 지고, 넙스는 수식 곡선이라 매끈하다',
    draw: function () {
      var s = t(125, 24, '폴리곤', { a: 'm', b: 1 }) + t(365, 24, '넙스 (NURBS)', { a: 'm', b: 1, c: C.blue }) + divider(245, 14, 216);
      var v = [];
      for (var k = 0; k <= 5; k++) { var a = Math.PI + k * (Math.PI / 2) / 5; v.push([190 + 130 * Math.cos(a), 180 + 130 * Math.sin(a)]); }
      s += F.poly(v.concat([[190, 180]]), { close: 1, fill: C.blueL, c: C.blue, w: 2 });
      for (var j = 0; j < v.length; j++) s += dot(v[j][0], v[j][1], 3.5, C.blue);
      s += F.path('M300,180 A130,130 0 0 1 430,50 L430,180 Z', { fill: C.blueL, c: C.blue, w: 2 });
      s += F.poly([[300, 180], [300, 50], [430, 50]], { c: C.orange, w: 1.2, dash: '5 4' });
      s += box(295, 45, 10, 10, { fill: C.orange, c: C.orange, r: 1, w: 1 }) + box(295, 175, 10, 10, { fill: C.orange, c: C.orange, r: 1, w: 1 }) +
        box(425, 45, 10, 10, { fill: C.orange, c: C.orange, r: 1, w: 1 });
      s += t(318, 82, '조절점', { size: 13, c: C.orange });
      s += t(125, 204, '각진 면(계단)', { a: 'm', size: 14 }) + t(365, 204, '매끈한 곡면 · 계산 많음', { a: 'm', size: 14 });
      return F.svg(480, 224, s);
    } },

  'sketch-3d': { topics: ['model'], cards: ['2D→3D 변환', '돌출/회전', '스윕/로프트'],
    cap: '2D 단면을 3D 로 — 돌출 · 회전 · 스윕 · 로프트',
    draw: function () {
      var s = divider(240, 14, 306) + line(10, 162, 470, 162, { c: C.grayM, w: 1.4, dash: '6 5' });
      function title(x, y, a, b) { return t(x, y, a, { b: 1, size: 15 }) + t(x + (a.length >= 12 ? 126 : 112), y, b, { size: 13, c: C.sub }); }
      /* 돌출 */
      s += title(16, 28, '돌출 (Extrude)', '단면 + 높이');
      s += F.poly([[40, 85], [120, 85], [145, 67], [65, 67]], { close: 1, fill: '#bfdbfe', c: C.blue, w: 1.6 }) +
        F.poly([[120, 85], [145, 67], [145, 122], [120, 140]], { close: 1, fill: '#93c5fd', c: C.blue, w: 1.6 }) +
        box(40, 85, 80, 55, { fill: C.blueL, c: C.blue, r: 0, w: 1.6 });
      s += F.poly([[40, 140], [120, 140], [145, 122]], { c: C.orange, w: 3 });
      s += arrow(178, 136, 178, 74, { c: C.orange }) + t(188, 106, '높이', { size: 13, c: C.orange, b: 1 });
      /* 회전 */
      s += title(252, 28, '회전 (Revolve)', '단면 + 축');
      s += line(330, 44, 330, 152, { c: C.sub, w: 1.2, dash: 'center' });
      s += F.poly([[330, 58], [362, 58], [354, 78], [376, 122], [364, 140], [330, 140]], { close: 1, fill: C.orangeL, c: C.orange, w: 2 });
      s += F.route(arcPts(330, 100, 68, 13, 0.1 * Math.PI, 1.75 * Math.PI, 20), { c: C.blue, w: 1.8, head: 10 });
      s += t(410, 142, '중심축', { size: 13, c: C.sub });
      /* 스윕 */
      s += title(16, 184, '스윕 (Sweep)', '단면 + 경로');
      var bz = [];
      for (var i = 0; i <= 16; i++) { var u = i / 16, m = 1 - u;
        bz.push([m * m * m * 40 + 3 * m * m * u * 80 + 3 * m * u * u * 150 + u * u * u * 200, m * m * m * 285 + 3 * m * m * u * 205 + 3 * m * u * u * 300 + u * u * u * 215]); }
      s += F.route(bz, { c: C.blue, w: 1.6, dash: '6 4', head: 10 });
      s += ell(bz[8][0], bz[8][1], 8, 16, { c: C.orange, dash: '4 3' }) + ell(bz[16][0] - 4, bz[16][1] + 2, 8, 16, { c: C.orange, dash: '4 3' }) +
        ell(40, 285, 8, 16, { fill: C.orangeL, c: C.orange, w: 2 });
      s += t(62, 298, '단면', { size: 13, c: C.orange, b: 1 }) + t(150, 236, '경로', { size: 13, c: C.blue, b: 1 });
      /* 로프트 */
      s += title(252, 184, '로프트 (Loft)', '단면 여러 개');
      s += line(290, 282, 312, 214, { c: C.blue, w: 1.4 }) + line(390, 282, 372, 214, { c: C.blue, w: 1.4 }) +
        line(320, 272, 327, 204, { c: C.blue, w: 1, dash: '4 3' }) + line(362, 272, 387, 204, { c: C.blue, w: 1, dash: '4 3' });
      s += ell(340, 282, 50, 12, { fill: C.orangeL, c: C.orange, w: 2 }) + F.poly([[312, 214], [372, 214], [387, 204], [327, 204]], { close: 1, fill: C.orangeL, c: C.orange, w: 2 });
      s += t(398, 290, '단면 ①', { size: 13, c: C.orange, b: 1 }) + t(398, 208, '단면 ②', { size: 13, c: C.orange, b: 1 });
      return F.svg(480, 310, s);
    } },

  csg: { topics: ['model'], cards: ['CSG 모델링'],
    cap: 'CSG — 기본 도형을 더하고(합) · 빼고(차) · 겹친 부분만 남긴다(교)',
    draw: function () {
      var s = '', ox = [25, 180, 335], nm = ['합집합', '차집합', '교집합'], sb = ['더하기', '사각형 − 원', '겹친 부분만'];
      for (var i = 0; i < 3; i++) {
        var x = ox[i], d;
        if (i === 0) d = 'M' + x + ',25 H' + (x + 80) + ' V30 A35,35 0 0 1 ' + (x + 80) + ',100 V105 H' + x + ' Z';
        else if (i === 1) d = 'M' + x + ',25 H' + (x + 80) + ' V30 A35,35 0 0 0 ' + (x + 80) + ',100 V105 H' + x + ' Z';
        else d = 'M' + (x + 80) + ',30 A35,35 0 0 0 ' + (x + 80) + ',100 Z';
        s += F.path(d, { fill: C.blueL, c: C.blue, w: 2.2 });
        s += box(x, 25, 80, 80, { fill: 'none', c: C.line, r: 0, w: 1, dash: '4 3' }) + F.circle(x + 80, 65, 35, { fill: 'none', c: C.line, w: 1, dash: '4 3' });
        s += t(x + 57, 136, nm[i], { a: 'm', b: 1, ans: 1 }) + t(x + 57, 158, sb[i], { a: 'm', size: 13, c: C.sub });
      }
      return F.svg(480, 176, s);
    } },

  /* ─────────── ⑦ 도면 · 투상 ─────────── */
  proj13: { topics: ['draw'], cards: ['투상법(1각/3각)'],
    cap: '제1각법은 눈 → 물체 → 투상면, 제3각법은 눈 → 투상면 → 물체',
    draw: function () {
      function eye(x, y) { return F.path('M' + (x - 20) + ',' + y + ' Q' + x + ',' + (y - 15) + ' ' + (x + 20) + ',' + y + ' Q' + x + ',' + (y + 15) + ' ' + (x - 20) + ',' + y + ' Z', { fill: C.paper, w: 1.6 }) + dot(x, y, 5); }
      function scr(x, y) { return line(x, y - 30, x, y + 30, { c: C.blue, w: 4 }); }
      function obj(x, y) { return box(x - 20, y - 20, 40, 40, { fill: C.orangeL, c: C.orange, r: 2 }); }
      var s = t(20, 22, '제1각법', { b: 1 }) + eye(50, 62) + obj(170, 62) + scr(290, 62) + line(72, 62, 286, 62, { c: C.sub, w: 1, dash: '4 4' }) +
        t(290, 22, '투상면', { a: 'm', size: 12.5, c: C.blue }) + t(318, 62, '눈 → 물체 → 투상면', { size: 14.5 });
      s += t(20, 112, '제3각법', { b: 1, c: C.blue }) + eye(50, 152) + scr(170, 152) + obj(290, 152) + line(72, 152, 268, 152, { c: C.sub, w: 1, dash: '4 4' }) +
        t(170, 112, '투상면', { a: 'm', size: 12.5, c: C.blue }) + t(318, 152, '눈 → 투상면 → 물체', { size: 14.5, b: 1, c: C.blue });
      return F.svg(480, 196, s);
    } },

  third: { topics: ['draw'], cards: ['제3각법 배치'],
    cap: '제3각법 — 정면도를 기준으로, 본 방향 그대로 위·아래·왼쪽·오른쪽에 놓는다',
    draw: function () {
      var W = 96, H = 52, s = '', it = [[192, 30, '평면도', '위에서 본 것'], [76, 102, '좌측면도', '왼쪽에서'], [308, 102, '우측면도', '오른쪽에서'], [192, 174, '저면도', '아래에서']];
      s += box(192, 102, W, H, { fill: C.blueL, c: C.blue, label: '정면도', lc: C.blue });
      for (var i = 0; i < 4; i++) {
        s += box(it[i][0], it[i][1], W, H, { fill: C.grayL }) + t(it[i][0] + W / 2, it[i][1] + 21, it[i][2], { a: 'm', b: 1, halo: false, ans: 1 }) +
          t(it[i][0] + W / 2, it[i][1] + 39, it[i][3], { a: 'm', size: 12.5, c: C.sub, halo: false });
      }
      s += t(240, 252, '정면도 위 = 평면도 · 아래 = 저면도 · 오른쪽 = 우측면도', { a: 'm', size: 13.5, c: C.sub });
      return F.svg(480, 272, s);
    } },

  lines: { topics: ['draw'], cards: ['선의 종류'],
    cap: '선의 모양이 곧 뜻이다 — 굵은 실선 · 가는 실선 · 파선 · 1점쇄선',
    draw: function () {
      var s = '', rows = [
        ['굵은 실선', '외형선', { w: 3.4 }], ['가는 실선', '치수선 · 치수보조선 · 해칭선', { w: 1.2 }],
        ['파선', '숨은선', { w: 2, dash: '9 5' }], ['가는 1점쇄선', '중심선', { w: 1.2, dash: 'center' }]];
      for (var i = 0; i < 4; i++) {
        var y = 38 + i * 52;
        s += line(24, y, 180, y, rows[i][2]) + t(204, y - 10, rows[i][0], { b: 1 }) + t(204, y + 12, rows[i][1], { size: 14, c: C.blue, ans: 1 });
      }
      return F.svg(480, 226, s);
    } },

  hatch: { topics: ['draw'], cards: ['해칭(Hatching)', '스머징(Smudging)'],
    cap: '절단면 표시 — 45° 가는 실선(해칭) 또는 색칠(스머징)',
    draw: function () {
      var s = t(120, 24, '해칭', { a: 'm', b: 1 }) + t(360, 24, '스머징', { a: 'm', b: 1 }) + divider(240, 14, 214);
      s += F.hatch(50, 46, 50, 120) + F.hatch(140, 46, 50, 120) + box(50, 46, 50, 120, { fill: 'none', r: 0, w: 2.2 }) + box(140, 46, 50, 120, { fill: 'none', r: 0, w: 2.2 });
      s += line(120, 36, 120, 176, { c: C.sub, w: 1.1, dash: 'center' });
      s += box(290, 46, 50, 120, { fill: '#c7d2fe', r: 0, w: 2.2 }) + box(380, 46, 50, 120, { fill: '#c7d2fe', r: 0, w: 2.2 });
      s += line(360, 36, 360, 176, { c: C.sub, w: 1.1, dash: 'center' });
      s += t(120, 196, '절단면을 45° 가는 실선으로', { a: 'm', size: 13.5 }) + t(360, 196, '넓은 절단면은 색칠로', { a: 'm', size: 13.5 });
      return F.svg(480, 214, s);
    } },

  dims: { topics: ['draw'], cards: ['치수보조 기호'],
    cap: '치수 앞에 붙는 기호 — Ø 지름 · R 반지름 · C 모따기 · t 두께 (숫자는 예시)',
    draw: function () {
      var s = F.path('M60,70 H260 L270,80 V149 A21,21 0 0 1 249,170 H60 Z', { fill: C.grayL, w: 2.2 });
      s += F.circle(130, 120, 22, { fill: C.paper, w: 2.2 }) + line(98, 120, 162, 120, { c: C.sub, w: 1, dash: 'center' }) + line(130, 88, 130, 152, { c: C.sub, w: 1, dash: 'center' });
      s += F.dim(60, 170, 270, 170, '100', { off: 26, side: -1 }) + F.dim(60, 70, 60, 170, '50', { off: 26 });
      s += callout(146, 104, 178, 46, 'Ø20', { c: C.ink, tc: C.blue, b: 1 }) + callout(266, 76, 292, 48, 'C5', { c: C.ink, tc: C.blue, b: 1 }) +
        callout(264, 164, 290, 204, 'R10', { c: C.ink, tc: C.blue, b: 1 });
      var lg = [['Ø', '지름'], ['R', '반지름'], ['C', '모따기'], ['t', '판의 두께'], ['□', '정사각형 변'], ['(30)', '참고치수']];
      s += box(338, 40, 132, 176, { fill: C.paper, c: C.grayM, w: 1.2 });
      for (var i = 0; i < 6; i++) s += t(366, 62 + i * 27, lg[i][0], { a: 'm', b: 1, c: C.blue }) + t(392, 62 + i * 27, lg[i][1], { size: 14, ans: 1 });
      return F.svg(480, 232, s);
    } },

  /* ─────────── ⑧ 슬라이싱 설정 ─────────── */
  layer: { topics: ['slice'], cards: ['레이어(층) 두께', '레이어 수 계산'],
    cap: '층이 얇을수록 곡면이 매끈하지만 출력 시간이 늘어난다(두께 절반 → 시간 약 2배)',
    draw: function () {
      var s = t(120, 26, '두꺼운 층', { a: 'm', b: 1 }) + t(360, 26, '얇은 층', { a: 'm', b: 1, c: C.blue }) + divider(240, 14, 214);
      function dome(cx, n) {
        var R = 84, H = 120, base = 188, h = H / n, o = '';
        for (var i = 0; i < n; i++) {
          var ym = (i + 0.5) * h, w = R * Math.sqrt(Math.max(0, 1 - (ym / H) * (ym / H)));
          o += box(cx - w, base - (i + 1) * h, 2 * w, h, { fill: C.blueL, c: C.blue, r: 0, w: 1 });
        }
        return o + F.path('M' + (cx - R) + ',' + base + ' A' + R + ',' + H + ' 0 0 1 ' + (cx + R) + ',' + base, { c: C.red, w: 1.4, dash: '5 4' }) + bed(cx - 100, base, 200);
      }
      s += dome(120, 5) + dome(360, 12);
      s += t(120, 212, '계단이 거칠다 · 빠르다', { a: 'm', size: 13.5 }) + t(360, 212, '곡면이 매끈 · 느리다', { a: 'm', size: 13.5 });
      s += t(240, 244, '층 수 = 높이 ÷ 층 두께   (50mm ÷ 0.25mm = 200층)', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 262, s);
    } },

  infill: { topics: ['slice'], cards: ['인필(Infill)', '쉘/Number of shells'],
    cap: '인필은 속 채움 비율, 쉘은 바깥 벽 — 채울수록 강하지만 오래 걸린다',
    draw: function () {
      var s = '', xs = [30, 185, 340], gap = [22, 11, 0], nm = ['인필 20%', '인필 50%', '인필 100%'];
      for (var i = 0; i < 3; i++) {
        var x = xs[i], y = 40;
        s += box(x, y, 110, 110, { fill: C.orangeL, c: C.orange, r: 4, w: 1.4 }) + box(x + 9, y + 9, 92, 92, { fill: gap[i] ? C.paper : C.blueL, c: C.orange, r: 2, w: 1.2 });
        if (gap[i]) for (var k = gap[i]; k < 92; k += gap[i]) s += line(x + 9 + k, y + 9, x + 9 + k, y + 101, { c: C.blue, w: 1.3 }) + line(x + 9, y + 9 + k, x + 101, y + 9 + k, { c: C.blue, w: 1.3 });
        s += t(x + 55, 172, nm[i], { a: 'm', b: 1 });
      }
      s += callout(74, 44, 100, 18, '쉘(외벽)', { tc: C.orange, b: 1 });
      s += arrow(40, 198, 440, 198, { c: C.red, w: 2 }) + t(240, 222, '채울수록 강도↑ · 출력 시간↑', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 238, s);
    } },

  adhesion: { topics: ['slice'], cards: ['래프트(Raft)', '브림(Brim)', '스커트(Skirt)'],
    cap: '바닥 보조 — 스커트는 떨어진 한 줄, 브림은 테두리, 래프트는 밑판',
    draw: function () {
      var s = '', cx = [85, 240, 395], nm = ['스커트', '브림', '래프트'];
      for (var i = 0; i < 3; i++) {
        var x = cx[i];
        s += t(x, 22, nm[i], { a: 'm', b: 1, ans: 1 });
        if (i === 0) s += F.circle(x, 88, 50, { fill: 'none', c: C.orange, w: 2 });
        if (i === 1) s += F.circle(x, 88, 46, { fill: C.orangeL, c: C.orange, w: 1.4 }) + F.circle(x, 88, 40, { fill: 'none', c: C.orange, w: 1 }) + F.circle(x, 88, 35, { fill: 'none', c: C.orange, w: 1 });
        if (i === 2) { s += box(x - 50, 38, 100, 100, { fill: C.orangeL, c: C.orange, r: 2, w: 1.4 }); for (var k = 10; k < 100; k += 10) s += line(x - 50 + k, 38, x - 50 + k, 138, { c: C.orange, w: 0.8 }); }
        s += F.circle(x, 88, 30, { fill: C.blueL, c: C.blue, w: 1.8 });
        /* 옆에서 본 모습 */
        s += bed(x - 68, 206, 136);
        if (i === 0) s += box(x - 30, 166, 60, 40, { fill: C.blueL, c: C.blue, r: 2 }) + box(x - 52, 202, 8, 4, { fill: C.orange, c: C.orange, r: 1, w: 1 }) + box(x + 44, 202, 8, 4, { fill: C.orange, c: C.orange, r: 1, w: 1 });
        if (i === 1) s += box(x - 48, 201, 96, 5, { fill: C.orange, c: C.orange, r: 1, w: 1 }) + box(x - 30, 161, 60, 40, { fill: C.blueL, c: C.blue, r: 2 });
        if (i === 2) s += box(x - 52, 190, 104, 16, { fill: C.orangeL, c: C.orange, r: 1, w: 1.2 }) + box(x - 30, 150, 60, 40, { fill: C.blueL, c: C.blue, r: 2 });
      }
      s += t(85, 236, '떨어진 한 줄\n(노즐 점검용)', { a: 'm', size: 13 }) + t(240, 236, '바닥 테두리를\n넓혀 안 떨어지게', { a: 'm', size: 13 }) + t(395, 236, '밑에 보조판을\n깔아 수평 보정', { a: 'm', size: 13 });
      return F.svg(480, 262, s);
    } },

  support: { topics: ['slice', 'error'], cards: ['서포터(지지대)', '오버행(Overhang)', '새깅(Sagging)'],
    cap: '허공에 뜬 부분(오버행)은 처진다 — 서포터로 받치거나, 방향을 바꿔 서포터를 줄인다',
    draw: function () {
      var s = divider(160, 14, 222) + divider(320, 14, 222), nm = ['① 그냥 출력', '② 서포터로 받침', '③ 방향 바꾸기'];
      for (var i = 0; i < 3; i++) s += t(80 + i * 160, 24, nm[i], { a: 'm', b: 1, size: 15 }) + bed(20 + i * 160, 180, 120);
      /* ① 처짐 */
      s += box(35, 92, 30, 88, { fill: C.blueL, c: C.blue, r: 2 }) + box(35, 70, 100, 22, { fill: C.blueL, c: C.blue, r: 2 });
      for (var k = 0; k < 5; k++) { var x = 78 + k * 12; s += F.path('M' + x + ',92 q-5,14 2,26 q5,10 -1,' + (14 + k * 4), { c: C.red, w: 1.4 }); }
      s += callout(128, 72, 128, 46, '오버행', { tc: C.red, b: 1, c: C.red, a: 'm' });
      /* ② 서포터 */
      s += box(227, 92, 68, 88, { fill: C.yellowL, c: '#ca8a04', dash: '4 3', r: 0, w: 1 });
      for (var j = 235; j < 295; j += 9) s += line(j, 92, j, 180, { c: '#ca8a04', w: 1 });
      s += box(195, 92, 30, 88, { fill: C.blueL, c: C.blue, r: 2 }) + box(195, 70, 100, 22, { fill: C.blueL, c: C.blue, r: 2 });
      /* ③ 뒤집기 */
      s += box(355, 68, 30, 90, { fill: C.blueL, c: C.blue, r: 2 }) + box(355, 158, 100, 22, { fill: C.blueL, c: C.blue, r: 2 });
      s += t(80, 206, '처진다(새깅)', { a: 'm', size: 13.5, c: C.red, b: 1 }) + t(240, 206, '받쳐 준다', { a: 'm', size: 13.5, c: '#a16207', b: 1 }) +
        t(400, 206, '서포터가 필요 없다', { a: 'm', size: 13.5, c: C.green, b: 1 });
      return F.svg(480, 226, s);
    } },

  /* ─────────── ⑨ G코드 · M코드 ─────────── */
  'g-motion': { topics: ['gcode'], cards: ['G0 / G1', 'G2 / G3'],
    cap: 'G0 급속 이동 · G1 직선 · G2 시계방향 원호 · G3 반시계방향 원호',
    draw: function () {
      var s = divider(120, 14, 206) + divider(240, 14, 206) + divider(360, 14, 206), nm = ['G0', 'G1', 'G2', 'G3'], sb = ['급속 이동', '직선 이동', '시계방향 원호', '반시계방향 원호'];
      for (var i = 0; i < 4; i++) s += t(60 + i * 120, 30, nm[i], { a: 'm', b: 1, size: 21, ans: 0 }) + t(60 + i * 120, 190, sb[i], { a: 'm', size: 14, ans: 1 });
      s += dot(20, 150, 4) + arrow(20, 150, 100, 70, { c: C.sub, dash: '6 5', w: 2 });
      s += dot(140, 150, 4) + arrow(140, 150, 220, 70, { c: C.orange, w: 3.2 });
      s += dot(260, 130, 4) + F.route(arcPts(300, 130, 40, 40, Math.PI, 2 * Math.PI, 18), { c: C.blue, w: 2.6 });
      s += dot(380, 110, 4) + F.route(arcPts(420, 110, 40, 40, Math.PI, 0, 18), { c: C.purple, w: 2.6 });
      return F.svg(480, 210, s);
    } },

  g90: { topics: ['gcode'], cards: ['G90 / G91'],
    cap: 'G90 은 원점에서 잰 좌표(절대), G91 은 지금 자리에서 더 갈 만큼(증분)',
    draw: function () {
      var s = '', X = function (u) { return 40 + u * 5; }, Y = function (u) { return 220 - u * 5; };
      for (var u = 5; u <= 40; u += 5) s += line(X(u), Y(0), X(u), Y(30), { c: C.edge, w: 1 });
      for (var v = 5; v <= 30; v += 5) s += line(X(0), Y(v), X(40), Y(v), { c: C.edge, w: 1 });
      s += arrow(X(0), Y(0), X(42), Y(0), { w: 1.6, head: 9 }) + arrow(X(0), Y(0), X(0), Y(32), { w: 1.6, head: 9 });
      s += t(X(42) + 6, Y(0), 'X', { b: 1 }) + t(X(0), Y(32) - 12, 'Y', { a: 'm', b: 1 }) + t(X(0), Y(0) + 18, '원점 (0,0)', { a: 'm', size: 12.5, c: C.sub });
      s += line(X(30), Y(20), X(30), Y(0), { c: C.blue, w: 1.2, dash: '4 3' }) + line(X(0), Y(20), X(30), Y(20), { c: C.blue, w: 1.2, dash: '4 3' });
      s += t(X(30), Y(0) + 18, '30', { a: 'm', b: 1, c: C.blue, size: 14 }) + t(X(0) - 8, Y(20), '20', { a: 'e', b: 1, c: C.blue, size: 14 });
      s += arrow(X(10), Y(10), X(30) - 2, Y(10), { c: C.orange, w: 2.2, head: 10 }) + arrow(X(30), Y(10), X(30), Y(20) + 2, { c: C.orange, w: 2.2, head: 10 });
      s += t(X(20), Y(10) + 14, '+20', { a: 'm', b: 1, c: C.orange, size: 14 }) + t(X(30) + 8, Y(15), '+10', { b: 1, c: C.orange, size: 14 });
      s += dot(X(10), Y(10), 5, C.ink) + t(X(10) - 8, Y(10) - 12, 'A (10,10)', { a: 'e', size: 13, b: 1 });
      s += dot(X(30), Y(20), 5, C.ink) + t(X(30) + 8, Y(20) - 14, 'B (30,20)', { size: 13, b: 1 });
      s += t(272, 34, 'A 에서 B 로 갈 때', { b: 1 });
      s += box(270, 52, 198, 80, { fill: C.blueL, c: C.blue }) + t(282, 72, 'G90 절대좌표', { b: 1, c: C.blue, halo: false }) +
        t(282, 96, 'G1 X30 Y20', { size: 16, b: 1, halo: false, ans: 1 }) + t(282, 118, '원점에서 잰 값', { size: 13, c: C.sub, halo: false });
      s += box(270, 144, 198, 80, { fill: C.orangeL, c: C.orange }) + t(282, 164, 'G91 증분좌표', { b: 1, c: C.orange, halo: false }) +
        t(282, 188, 'G1 X20 Y10', { size: 16, b: 1, halo: false, ans: 1 }) + t(282, 210, '지금 자리에서 더 갈 만큼', { size: 13, c: C.sub, halo: false });
      return F.svg(480, 250, s);
    } },

  /* ─────────── ⑩ 출력 오류 ─────────── */
  warping: { topics: ['error', 'mat'], cards: ['워핑(Warping)', 'ABS'],
    cap: '워핑 — 식으면서 수축해 가장자리가 들뜬다(ABS 에서 심함)',
    draw: function () {
      var s = F.path('M70,100 L250,100 L250,150 Q160,190 70,150 Z', { fill: C.blueL, c: C.blue, w: 2 }) + box(40, 170, 240, 8, { fill: C.grayM, r: 2, w: 1 });
      s += arrow(54, 168, 54, 140, { c: C.red, w: 2, head: 9 }) + arrow(266, 168, 266, 140, { c: C.red, w: 2, head: 9 });
      s += arrow(92, 84, 130, 84, { c: C.blue, w: 1.8, head: 9 }) + arrow(228, 84, 190, 84, { c: C.blue, w: 1.8, head: 9 });
      s += t(160, 62, '식으면서 수축', { a: 'm', size: 14, c: C.blue, b: 1 }) + t(160, 200, '가장자리가 바닥에서 들뜬다', { a: 'm', size: 14, c: C.red, b: 1 });
      s += box(300, 44, 166, 86, { fill: C.redL, c: C.red }) + t(312, 66, '원인', { b: 1, c: C.red, halo: false }) +
        t(312, 90, '굳으면서 수축', { size: 14, halo: false }) + t(312, 112, 'ABS 에서 심함', { size: 14, halo: false });
      s += box(300, 142, 166, 64, { fill: C.greenL, c: C.green }) + t(312, 164, '대책', { b: 1, c: C.green, halo: false }) +
        t(312, 188, '래프트 · 베드 가열', { size: 14, halo: false, ans: 1 });
      return F.svg(480, 222, s);
    } },

  string: { topics: ['error'], cards: ['스트링(String) 현상', '리트랙션'],
    cap: '스트링 — 이동하는 사이 흘러나온 재료가 거미줄이 된다. 리트랙션으로 막는다',
    draw: function () {
      var s = box(50, 90, 40, 100, { fill: C.blueL, c: C.blue, r: 2 }) + box(190, 90, 40, 100, { fill: C.blueL, c: C.blue, r: 2 }) + bed(30, 190, 220);
      for (var k = 0; k < 5; k++) { var y = 104 + k * 17; s += F.path('M90,' + y + ' Q140,' + (y + 16) + ' 190,' + (y + 4), { c: C.red, w: 1 }); }
      s += nozzle(140, 52) + arrow(96, 66, 184, 66, { c: C.blue, w: 1.6, dash: '5 4', head: 9 });
      s += t(140, 214, '이동 중 흘러나와 거미줄', { a: 'm', size: 13.5, c: C.red, b: 1 }) + divider(270, 14, 222);
      s += t(380, 24, '리트랙션', { a: 'm', b: 1 });
      s += line(365, 42, 365, 92, { c: C.orange, w: 4 }) + box(340, 92, 50, 34, { fill: C.redL, c: C.red, label: '가열', size: 12, lc: C.red }) +
        F.poly([[353, 126], [377, 126], [365, 144]], { close: 1, fill: C.grayM, w: 1.4 });
      s += arrow(396, 88, 396, 46, { c: C.blue, w: 2.2, head: 10 }) + t(404, 66, '살짝\n뒤로 당김', { size: 13.5, c: C.blue, b: 1 });
      s += t(380, 172, '이동 전에 압출을 멈춘다', { a: 'm', size: 13.5 }) + t(380, 196, '거리 · 속도 · 온도 조절', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 228, s);
    } },

  mesh: { topics: ['error'], cards: ['오픈/클로즈 메시', '비(非)매니폴드'],
    cap: '정상 메시는 모서리 하나를 면 두 개가 나눠 쓴다 — 1개면 구멍, 3개 이상이면 비매니폴드',
    draw: function () {
      var s = divider(160, 14, 222) + divider(320, 14, 222);
      s += F.poly([[80, 50], [80, 150], [25, 115]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 }) + F.poly([[80, 50], [80, 150], [135, 90]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 }) +
        line(80, 50, 80, 150, { c: C.green, w: 3.4 });
      s += F.poly([[200, 60], [280, 60], [240, 100]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 }) + F.poly([[280, 60], [280, 140], [240, 100]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 }) +
        F.poly([[280, 140], [200, 140], [240, 100]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 }) + F.poly([[200, 140], [200, 60], [240, 100]], { close: 1, c: C.red, w: 1.6, dash: '4 3' });
      s += F.poly([[400, 50], [400, 150], [345, 115]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 }) + F.poly([[400, 50], [400, 150], [460, 88]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 }) +
        F.poly([[400, 50], [400, 150], [452, 160]], { close: 1, fill: C.orangeL, c: C.orange, w: 1.6 }) + line(400, 50, 400, 150, { c: C.red, w: 3.4 });
      var nm = [['클로즈 메시', '면 2개가 공유 (정상)', C.green], ['오픈 메시', '빈 곳 = 구멍', C.red], ['비매니폴드', '면 3개 이상이 공유', C.red]];
      for (var i = 0; i < 3; i++) s += t(80 + i * 160, 184, nm[i][0], { a: 'm', b: 1, ans: 1 }) + t(80 + i * 160, 206, nm[i][1], { a: 'm', size: 13, c: nm[i][2] });
      return F.svg(480, 224, s);
    } },

  /* ─────────── ⑪ 후처리 · 회수 ─────────── */
  retrieve: { topics: ['post'], cards: ['출력물 회수 순서', 'SLA 후처리'],
    cap: '출력물 회수 — 보호장구를 먼저 쓰고, 멈춘 것을 확인한 뒤 연다. 레진 출력물은 수지 제거 · 서포터 제거 · 후경화까지 (교안 8장 순서)',
    draw: function () {
      /* 순서는 교안 「3D 프린터 운용기능사 8장」 출력물 회수(고체 방식) · (액체 방식) 을 따랐다 */
      var s = t(14, 22, '출력물 회수 순서 (고체 방식)', { b: 1 }),
        st = ['보호장구\n착용', '작동 멈춤\n확인', '문 개방', '플랫폼\n분리', '출력물\n분리', '플랫폼\n재설치', '정리 ·\n대기 상태'];
      for (var i = 0; i < 7; i++) {
        var row = i < 4 ? 0 : 1, col = row ? i - 4 : i, x = 12 + col * 116, y = 38 + row * 70, safe = i < 2;
        s += box(x, y, 100, 52, { fill: safe ? C.redL : C.grayL, c: safe ? C.red : C.ink }) + F.num(x + 10, y, i + 1, { c: safe ? C.red : C.blue, r: 10, size: 12 }) +
          t(x + 50, y + 27, st[i], { a: 'm', size: 14, b: 1, halo: false, ans: safe ? 0 : 1 });
        if (col < (row ? 2 : 3)) s += arrow(x + 101, y + 26, x + 115, y + 26, { w: 1.6, head: 7 });
      }
      s += F.route([[410, 90], [410, 99], [62, 99], [62, 107]], { w: 1.4, head: 7, c: C.sub });
      s += t(14, 192, '레진(액체 방식) 출력물은 이어서', { b: 1, c: C.purple });
      var sl = [['수지 제거\n(세척)', C.blueL, C.blue], ['서포터\n제거', C.grayL, C.ink], ['후경화\n(경화기)', C.purpleL, C.purple]];
      for (var j = 0; j < 3; j++) {
        var x2 = 12 + j * 158;
        s += box(x2, 208, 138, 52, { fill: sl[j][1], c: sl[j][2] }) + t(x2 + 69, 234, sl[j][0], { a: 'm', size: 14, b: 1, halo: false, ans: 1 });
        if (j < 2) s += arrow(x2 + 140, 234, x2 + 156, 234, { w: 1.6, head: 8 });
      }
      return F.svg(480, 274, s);
    } },

  /* ─────────── ⑫ 안전 · 응급처치 ─────────── */
  ppe: { topics: ['safety'], cards: ['레진 취급 안전', '유해물질'],
    cap: '레진·ABS 를 다룰 때 — 방독 마스크 · 니트릴 장갑 · 환기',
    draw: function () {
      var s = '';
      /* 마스크 */
      s += F.path('M50,86 Q80,58 110,86 L106,122 Q80,142 54,122 Z', { fill: C.grayL, w: 2 }) + F.circle(58, 118, 13, { fill: C.grayM }) + F.circle(102, 118, 13, { fill: C.grayM }) +
        line(50, 90, 36, 80, { w: 1.6 }) + line(110, 90, 124, 80, { w: 1.6 });
      s += t(80, 170, '방독 마스크', { a: 'm', b: 1 });
      /* 장갑 */
      s += F.path('M218,140 V92 Q218,84 225,84 Q232,84 232,92 V80 Q232,72 239,72 Q246,72 246,80 V78 Q246,70 253,70 Q260,70 260,78 V86 Q260,78 267,78 Q274,78 274,86 V120 Q274,132 262,140 Z',
        { fill: C.blueL, c: C.blue, w: 2 }) + F.path('M218,110 Q206,100 202,108 Q200,116 218,128', { fill: C.blueL, c: C.blue, w: 2 });
      s += t(240, 170, '니트릴 장갑', { a: 'm', b: 1 });
      /* 환기 */
      s += box(358, 64, 84, 76, { fill: C.paper, c: C.ink, r: 3, w: 2 }) + line(400, 64, 400, 140, { w: 1.4 }) + line(358, 102, 442, 102, { w: 1.4 });
      s += arrow(420, 84, 462, 72, { c: C.green, w: 2, head: 9 }) + arrow(420, 120, 462, 108, { c: C.green, w: 2, head: 9 });
      s += t(400, 170, '환기', { a: 'm', b: 1 });
      s += t(240, 204, '세척은 알코올로 — 레진이 피부에 닿지 않게', { a: 'm', size: 13.5, c: C.sub });
      return F.svg(480, 222, s);
    } },

  fire: { topics: ['safety'], cards: ['화재 등급'],
    cap: '화재 등급과 알맞은 소화 약제',
    draw: function () {
      var s = '', col = [['A급', '일반 화재', C.orangeL, C.orange, ['물', '산 · 알칼리']], ['B급', '유류 · 가스', C.yellowL, '#ca8a04', ['포말 · 분말', 'CO₂']], ['C급', '전기 화재', C.blueL, C.blue, ['유기성 · 분말', 'CO₂']]];
      for (var i = 0; i < 3; i++) {
        var x = 12 + i * 156;
        s += box(x, 14, 144, 60, { fill: col[i][2], c: col[i][3] }) + t(x + 72, 36, col[i][0], { a: 'm', b: 1, size: 22, c: col[i][3], halo: false }) +
          t(x + 72, 60, col[i][1], { a: 'm', size: 14, b: 1, halo: false });
        s += box(x, 82, 144, 100, { fill: C.paper, c: col[i][3], w: 1.4 }) + t(x + 72, 102, '소화 약제', { a: 'm', size: 12.5, c: C.sub }) +
          t(x + 72, 130, col[i][4][0], { a: 'm', b: 1, ans: 1 }) + t(x + 72, 156, col[i][4][1], { a: 'm', b: 1, ans: 1 });
      }
      return F.svg(480, 196, s);
    } },

  cpr: { topics: ['safety'], cards: ['심폐소생술 소생률', '골든타임'],
    cap: '심정지 뒤 4분이 골든타임 — 그 뒤로 1분마다 소생률이 약 10%씩 떨어진다',
    draw: function () {
      var s = '', v = [75, 50, 40, 30, 20], base = 200, top = 40, h = function (p) { return (base - top) * p / 100; };
      s += line(52, top - 6, 52, base, { w: 1.4 }) + line(52, base, 306, base, { w: 1.4 }) + t(20, 24, '소생률', { size: 13, c: C.sub });
      for (var i = 0; i < 5; i++) {
        var cx = 84 + i * 48, sure = i < 2;
        s += box(cx - 16, base - h(v[i]), 32, h(v[i]), { fill: sure ? C.blue : C.grayM, c: sure ? C.blue : C.line, r: 3, w: 1 });
        s += t(cx, base - h(v[i]) - 12, (sure ? '' : '약 ') + v[i] + '%', { a: 'm', size: 13, b: 1, c: sure ? C.blue : C.sub });
        s += t(cx, base + 16, (i + 3) + '분', { a: 'm', size: 13 });
      }
      s += line(156, top - 10, 156, base, { c: C.red, w: 1.6, dash: '5 4' }) + t(160, top - 12, '골든타임 4분', { size: 13.5, c: C.red, b: 1 });
      s += box(324, 50, 146, 110, { fill: C.redL, c: C.red }) + t(397, 74, '심폐소생술', { a: 'm', b: 1, c: C.red, halo: false }) +
        t(397, 104, '가슴압박 30', { a: 'm', size: 15, b: 1, halo: false }) + t(397, 128, ': 인공호흡 2', { a: 'm', size: 15, b: 1, halo: false });
      s += t(397, 186, '119 · AED 먼저', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 226, s);
    } }
  };
})();
