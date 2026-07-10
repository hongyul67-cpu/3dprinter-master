/**
 * 3D프린터 마스터 — 학생 진행상황 저장/조회 (Google Apps Script)
 * 이 코드를 구글 시트의 [확장 프로그램] > [Apps Script]에 붙여넣고
 * [배포] > [새 배포] > 유형: 웹 앱 / 액세스: "모든 사용자" 로 배포하세요.
 * 배포 후 나오는 웹 앱 URL을 config.js 의 SYNC_URL 에 넣으면 됩니다.
 */

var SHEET_NAME = 'progress';
var HEADERS = ['반', '이름', '점수', '개념익힘', '푼문제', '정답', '오답', '문제진도(%)', '마지막접속', '상태(JSON)'];

function _sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function _findRow(sh, cls, name) {
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(cls) && String(data[i][1]) === String(name)) return i + 1;
  }
  return -1;
}

function _save(p) {
  var sh = _sheet();
  var cls = String(p.cls || '');
  var name = String(p.name || '');
  if (!name) return;
  var row = [cls, name, p.score || 0, p.known || 0, p.seen || 0, p.ok || 0, p.wrong || 0, p.pct || 0, new Date(), p.state || ''];
  var r = _findRow(sh, cls, name);
  if (r > 0) sh.getRange(r, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
}

// 저장 (앱에서 POST)
function doPost(e) {
  try {
    var p = JSON.parse(e.postData.contents);
    _save(p);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 조회 (앱에서 JSONP GET: ?action=get&cls=..&name=..&callback=..)
function doGet(e) {
  var cb = (e && e.parameter && e.parameter.callback) || '';
  var out = { ok: false };
  try {
    var action = e.parameter.action;
    if (action === 'save') {           // URL 길이가 짧을 때 GET 저장도 허용
      _save(e.parameter);
      out = { ok: true };
    } else if (action === 'get') {
      var sh = _sheet();
      var r = _findRow(sh, e.parameter.cls || '', e.parameter.name || '');
      if (r > 0) {
        var v = sh.getRange(r, 1, 1, HEADERS.length).getValues()[0];
        out = { ok: true, found: true, state: v[9] || '', score: v[2] };
      } else {
        out = { ok: true, found: false };
      }
    }
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  var json = JSON.stringify(out);
  if (cb) return ContentService.createTextOutput(cb + '(' + json + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
