const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/style.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
let passed=0;
function ok(cond,msg){if(!cond)throw new Error('FAIL: '+msg);console.log('PASS:',msg);passed++;}
function extractFunction(name){
  const marker=`function ${name}(`;const start=app.indexOf(marker);if(start<0)throw new Error(`Function ${name} missing`);
  const brace=app.indexOf('{',start);let depth=0,inStr=null,esc=false,inLine=false,inBlock=false;
  for(let i=brace;i<app.length;i++){
    const c=app[i],n=app[i+1];
    if(inLine){if(c==='\n')inLine=false;continue;}
    if(inBlock){if(c==='*'&&n==='/'){inBlock=false;i++;}continue;}
    if(inStr){if(esc){esc=false;continue;}if(c==='\\'){esc=true;continue;}if(c===inStr)inStr=null;continue;}
    if(c==='/'&&n==='/'){inLine=true;i++;continue;}if(c==='/'&&n==='*'){inBlock=true;i++;continue;}
    if(c==='"'||c==="'"||c==='`'){inStr=c;continue;}
    if(c==='{')depth++; else if(c==='}'){depth--;if(depth===0)return app.slice(start,i+1);}
  }
  throw new Error(`Could not extract ${name}`);
}

ok(!/\bclubMeta\s*\(/.test(app),'removed undefined clubMeta reference');
ok(/const currentClub=findClubData\(wp\.club,wp\.countryCode\)\|\|findClubDataAny\(wp\.club\)\|\|\{\}/.test(app),'world-transfer code resolves current club with existing helpers');
ok(/try\{simulateWorldTransfers\(\);\}catch\(error\)/.test(app),'next-season flow cannot be blocked by transfer refresh errors');
ok(/state\.season=createSeason\(p,nextYear,earned\);nextEventCache=null/.test(app),'next-season handler creates the following season after transfer refresh');
ok(/#finish-season'\)\.addEventListener\('click'/.test(app),'advance-to-next-season button remains wired');
ok(/\?v=10\.7\.4/.test(html),'front-end cache buster updated to v10.7.4');

// Execute the exact world-transfer function with minimal dependencies to catch unresolved identifiers.
const fnSrc=extractFunction('simulateWorldTransfers');
const allTransferClubs=()=>[
  {name:'Arsenal',countryCode:'ENG',strength:88,marketTier:'elite'},
  {name:'Chelsea',countryCode:'ENG',strength:86,marketTier:'elite'},
  {name:'Flamengo',countryCode:'BR',strength:84,marketTier:'elite'}
];
const players=[{name:'Teste',rating:87,club:'Arsenal',countryCode:'ENG'}];
const ensureWorldPlayers=()=>players;
const findClubData=(name,code)=>allTransferClubs().find(c=>c.name===name&&c.countryCode===code)||null;
const findClubDataAny=name=>allTransferClubs().find(c=>c.name===name)||null;
const confederation=code=>code==='ENG'?'UEFA':code==='BR'?'CONMEBOL':'OTHER';
const rnd=(min,max)=>min;
const simulate=new Function('allTransferClubs','ensureWorldPlayers','findClubData','findClubDataAny','confederation','rnd',`${fnSrc}; return simulateWorldTransfers;`)(allTransferClubs,ensureWorldPlayers,findClubData,findClubDataAny,confederation,rnd);
const oldRandom=Math.random; Math.random=()=>0; try{simulate();} finally{Math.random=oldRandom;}
ok(true,'simulateWorldTransfers executes without ReferenceError');

ok(/'Ipswich Town':\['https:\/\/upload\.wikimedia\.org\/wikipedia\/en\/4\/43\/Ipswich_Town\.svg'\]/.test(app),'Ipswich Town uses the real transparent crest SVG');
ok(!/football-logos\.cc/.test(app),'blocked football-logos.cc source is absent');

ok(app.includes('Copa América'),'Copa América trophy mapping exists');
ok(/Copa_tr_icon\.png/.test(app),'Copa América uses a transparent trophy asset');
ok(/Coppa_Italia_%28Italy_Cup%29\.svg/.test(app),'Coppa Italia uses a transparent SVG trophy');
ok(/brasileirao-transparent\.svg/.test(app),'Brasileirão uses transparent trophy artwork');
ok(/UEFA_-_Super_Cup\.png/.test(app),'UEFA Super Cup uses transparent trophy artwork');
ok(/saved-title-trophy-card \.honour-art,.saved-title-trophy-card \.honour-art img\{background:transparent!important\}/.test(css),'saved-title trophies explicitly render without painted backgrounds');

ok(/id="saved-career-view-ranking"/.test(html),'saved career modal has a ranking button');
ok(/function renderSavedCareerHistoricalRanking\(index\)/.test(app),'specific archived-career ranking renderer exists');
ok(/renderSavedCareerHistoricalRanking\(index\)/.test(app),'saved-career ranking button opens that archived career ranking');
ok(/rankingComponents:\{\.\.\.r\.components\}/.test(app),'new archived careers persist their ranking breakdown');

ok(/saved-career-club-badge/.test(app)&&/clubCrestMarkup\(name\)/.test(app),'career-clubs section renders crests instead of plain names');
ok(/function leaderboardTeamVisual\(/.test(app),'competition leaderboard has crest/flag renderer');
ok(/\$\{leaderboardTeamVisual\(r,leaderboardCompetition\)\}/.test(app),'competition highlights render team crests in the team column');
ok(/hydratePenaltyBadges\(box\)/.test(app),'competition highlight crests are hydrated with real badge sources');

ok(/decision-score-team \.crest-shell\{width:62px!important;height:62px!important/.test(css),'match-result crests have larger centered containers');
ok(/object-fit:contain!important;object-position:center!important/.test(css),'club crests are centered without cropping');
ok(/#career \.next-match \.next-team-visual \.crest-shell\{width:168px!important;height:168px!important/.test(css),'next-match crests are considerably larger on desktop');
ok(/saved-icon-section \.fifa-icon-card\{justify-self:center!important;align-self:center!important/.test(css),'saved ICON card is centered and kept visible');
ok(/saved-icon-section>div:last-child\{padding-left:18px!important/.test(css),'saved ICON copy is moved slightly away from the left edge');

ok(/font-family:'UT Unisportion FC'/.test(css),'exact UT Unisportion FC family alias is declared');
ok(/html,body,body \*,button,input,select,option,optgroup,textarea,table,thead,tbody,tfoot,tr,th,td,label,a,p,span,strong,b,small,em,i,h1,h2,h3,h4,h5,h6\{font-family:var\(--btl-display-font\)!important\}/.test(css),'Unisportion stack is forced across all textual UI elements');
ok(!/fonts\.googleapis\.com/.test(html),'old Google font stylesheet removed so it cannot visually override the chosen family');
ok(!/Arial, Helvetica, sans-serif/.test(app),'generated fallback graphics also use the Unisportion family');

const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const dup=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
ok(dup.length===0,'HTML has no duplicate IDs');

console.log(`\n${passed} v10.7.4 checks passed.`);
