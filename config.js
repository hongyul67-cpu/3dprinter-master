/* ============================================================
   3D프린터 마스터 — 연동 설정
   ------------------------------------------------------------
   Google 시트 연동을 켜려면 아래 SYNC_URL 에 Apps Script 웹앱 URL을
   붙여넣으세요. (설치법은 같은 폴더의 "교사용_구글시트_설치법.txt" 참고)
   비워두면(''), 인터넷 없이 이 브라우저에만 저장되는 오프라인 모드로 동작합니다.
============================================================ */
// 링크에 ?rc=<본인 exec URL> 이 있으면 그 주소(교사별 시트)가 우선합니다.
// 없으면 아래 기본 주소로 갑니다. → 선생님마다 자기 시트로 이어하기가 분리돼요.
const SYNC_URL = (function(){ try { return new URLSearchParams(location.search).get('rc') || ""; } catch(e){ return ""; } })()
  || "https://script.google.com/macros/s/AKfycbx_3vHqONU7_rMHhgHqZ1Vqem6kd23SIyLLDplWn7DJbR_3V0ChVXanOjKg8fTQFIIvjg/exec";
