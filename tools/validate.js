// 사용법: node tools/validate.js   (manifest.json 과 packs/*.json 구조 검사)
const fs=require('fs');const path=require('path');const root=path.join(__dirname,'..');
const err=[];const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
if(!/^\d+\.\d+\.\d+$/.test(m.version))err.push('manifest.version 형식 오류');
if(!m.notice||m.notice.id!==m.version)err.push('notice.id 는 version 과 같아야 함');
if(!m.history||m.history[0].version!==m.version)err.push('history 맨 앞이 현재 version 이어야 함');
const catIds=new Set(),sentences=new Map(),packIds=new Set();
for(const f of m.packs){const p=JSON.parse(fs.readFileSync(path.join(root,'packs',f),'utf8'));
 if(packIds.has(p.id))err.push(`${f}: pack id 중복 ${p.id}`);packIds.add(p.id);
 for(const k of ['id','week','date','title'])if(p[k]==null)err.push(`${f}: ${k} 없음`);
 if(!Array.isArray(p.cats)||p.cats.length!==10)err.push(`${f}: cats 는 10개여야 함`);
 for(const c of p.cats||[]){const w=`${f}/${c.id}`;
  if(!/^[a-z0-9]+$/.test(c.id))err.push(`${w}: id 는 영소문자/숫자만`);
  if(catIds.has(c.id))err.push(`${w}: 카테고리 id 중복`);catIds.add(c.id);
  for(const k of ['e','n','role'])if(!c[k])err.push(`${w}: ${k} 없음`);
  if(!Array.isArray(c.s)||c.s.length!==10)err.push(`${w}: 문장은 10개`);
  (c.s||[]).forEach((s,i)=>{if(!Array.isArray(s)||s.length!==4||s.some(x=>typeof x!=='string'||!x.trim()))err.push(`${w}#${i}: [영어,한국어,발음,상황] 4개 문자열`);
   else{const k=s[0].toLowerCase().replace(/[^a-z ]/g,'').trim();if(sentences.has(k))err.push(`${w}#${i}: 영어 문장 중복 "${s[0]}" (${sentences.get(k)})`);sentences.set(k,w)}});
  if(!Array.isArray(c.r)||c.r.length!==3)err.push(`${w}: 상황극 대화는 3턴`);
  (c.r||[]).forEach((t,i)=>{if(!Array.isArray(t)||t.length!==3||typeof t[0]!=='string'||typeof t[1]!=='string'||!Array.isArray(t[2])||t[2].length!==3||t[2].some(o=>!Array.isArray(o)||o.length!==2))err.push(`${w} 대화${i}: [NPC영,NPC한,[[정답영,한],[오답,한],[오답,한]]]`)});
 }}
if(err.length){console.error('❌ 검사 실패\n'+err.join('\n'));process.exit(1)}
console.log(`✅ OK  v${m.version} · 팩 ${m.packs.length}개 · 문장 ${sentences.size}개`);
