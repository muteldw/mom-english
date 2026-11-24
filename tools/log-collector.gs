/**
 * 엄마의 여행 영어 — 사용 기록 수집용 Google Apps Script
 * 1) 새 구글 시트 만들기 → 확장 프로그램 → Apps Script
 * 2) 이 코드를 전부 붙여넣고 저장
 * 3) 배포 → 새 배포 → 유형: 웹 앱 / 실행: 나 / 액세스: 모든 사용자 → 배포 → 권한 허용
 * 4) 나온 웹 앱 URL(https://script.google.com/macros/s/.../exec)을 manifest.json 의 logUrl 에 넣기
 */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('log') || ss.insertSheet('log');
  if (sh.getLastRow() === 0) {
    sh.appendRow(['받은 시각', '기기 시각(KST)', '이름', '기기ID', '이벤트', '내용', '버전', '기기·브라우저']);
    sh.setFrozenRows(1);
  }
  var d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { d = { event: 'parse_error', detail: String(err) }; }
  var names = { open: '접속', study: '오늘의 연습 완료', role: '상황극 완료', newpack: '새 문장 시작', name: '이름 설정' };
  sh.appendRow([new Date(), d.ts || '', String(d.name || '').slice(0, 20), d.device || '', names[d.event] || d.event || '',
                String(d.detail || '').slice(0, 200), d.version || '', d.ua || '']);
  return ContentService.createTextOutput('ok');
}
function doGet() { return ContentService.createTextOutput('mom-english log collector OK'); }
