# 엄마의 여행 영어 ✈️

해외여행 영어 회화 퀴즈 웹앱 · https://muteldw.github.io/mom-english/

## 구조
- `index.html` — 앱 전체 (화면·학습 로직). 문장 데이터는 들어 있지 않음.
- `manifest.json` — 현재 버전, 사용자 공지(notice), 팩 목록(packs), 버전 기록(history).
- `packs/wN.json` — N주차 문장 팩 (10개 상황 × 10문장 + 상황별 상황극 3턴).
- `tools/validate.js` — 구조·중복 검사. 커밋 전 반드시 `node tools/validate.js`.
- `CHANGELOG.md` — 사람용 버전 기록.

## 팩 형식 (packs/wN.json)
```json
{"id":"w2","week":2,"date":"2026-11-23","title":"2주차 · 주제",
 "cats":[{"id":"w2car","e":"🚗","n":"렌터카","role":"렌터카 직원",
   "s":[["영어 문장","한국어 뜻","한글 발음","상황 설명"], ...10개],
   "r":[["NPC 영어","NPC 한국어",[["정답 영어","뜻"],["오답","뜻"],["오답","뜻"]]], ...3턴]}, ...10개]}
```
- 카테고리 id: `w{주차}{영소문자}` (예: `w2car`). 학습 기록 키가 되므로 **한 번 배포한 id·문장 순서는 절대 바꾸지 않음** (오타 수정만 허용).
- 영어 문장은 전체 팩에서 중복 금지 (validate가 검사).
- 문장은 5~10단어, 60대 여행자가 실제로 쓸 쉬운 표현. 발음은 한글로.

## 사용 기록
- 앱이 `manifest.json`의 `logUrl`(Google Apps Script 웹 앱)로 접속·학습 이벤트를 보냄. 수집 스크립트: `tools/log-collector.gs`.
- **manifest 수정 시 `logUrl` 필드는 그대로 유지할 것.**

## 매주 업데이트 절차
1. `packs/w{N}.json` 추가 (N = 마지막 팩 주차 + 1)
2. `manifest.json`: `packs`에 추가, `version` 마이너 +1 (1.1.0 → 1.2.0), `updated`, `notice`(id=version) 교체, `history` 맨 앞에 항목 추가
3. `CHANGELOG.md` 맨 위에 항목 추가
- 버그 수정·기능 개선은 패치 +1 (1.2.0 → 1.2.1), history에 기록. 공지를 새로 띄울 때만 notice 교체.
4. `node tools/validate.js` 통과 확인 → 커밋 → main에 push (GitHub Pages 자동 반영)
