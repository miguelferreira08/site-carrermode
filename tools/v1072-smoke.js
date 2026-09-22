const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/style.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
let passed=0;
function ok(cond,msg){if(!cond)throw new Error('FAIL: '+msg);console.log('PASS:',msg);passed++;}
function count(re,s=app){return (s.match(re)||[]).length;}
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
    if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0)return app.slice(start,i+1);}
  }
  throw new Error(`Could not extract ${name}`);
}

ok(!/assets\.football-logos\.cc/.test(app),'removed football-logos.cc runtime source that caused CORS failures');
ok(/function clubCrestMarkup\(/.test(app),'clubCrestMarkup exists for penalty/score crests');
ok(/#simulate-btn'\)\.addEventListener\('click',simulateWholeSeason\)/.test(app),'Simular temporada button remains wired to simulateWholeSeason');
ok(/function simulateShootoutSeries\(/.test(app)&&/buildPenaltyOrderOptions/.test(app),'five-kick shootout flow exists');
ok(/data-penalty-round/.test(app)&&/cls=kicks\[0\]\.scored\?'made':'missed'/.test(app),'shootout UI has per-kick dots and result states');
ok(/if\(canEndEarly\(\)\)/.test(extractFunction('simulateShootoutSeries')),'shootout stops on mathematical elimination');

const gkBlock=app.slice(app.indexOf('const GOALKEEPER_DRAFT_PLAYERS=['),app.indexOf('];',app.indexOf('const GOALKEEPER_DRAFT_PLAYERS=['))+2);
ok(count(/,'historical',/g,gkBlock)===20,'goalkeeper draft has 20 historical goalkeepers');
ok(count(/,'current',/g,gkBlock)===10,'goalkeeper draft has 10 current goalkeepers');
for(const id of ['reflexes','positioning','diving','handling','speed','kicking','physical'])ok(new RegExp(`id:'${id}'`).test(app),`goalkeeper attribute ${id} is defined`);
ok(/sourcePool=goalkeeper\?GOALKEEPER_DRAFT_PLAYERS:LEGEND_POOL/.test(app),'goalkeepers draft only goalkeeper legends/current keepers');

ok(/saved-career-summary-card/.test(app)&&/RANK HISTÓRICO/.test(app)&&/>OVERALL</.test(app),'Hall overview only exposes identity, overall and historical rank');
ok(/saved-title-trophy-grid/.test(app)&&/honourVisual\(name\)/.test(app),'saved career title list is grouped with trophy visuals');
ok(!/trophies\.slice\(-6\)/.test(app),'retirement card no longer shows last six trophies');
ok(/legacy-grouped-title/.test(app)&&/count\}\× campeão/.test(app),'retirement card uses grouped title counts');

for(const name of ['Supercopa do Brasil','Supercopa da Espanha','Supercoppa Italiana','FA Community Shield','DFL-Supercup','Trophée des Champions','Supertaça Cândido de Oliveira','Johan Cruyff Shield','UEFA Super Cup','Finalissima'])ok(app.includes(name.split('|')[0]),`trophy mapping/competition reference includes ${name}`);
ok(/SupercopaEspa%C3%B1a\.png/.test(app),'Spain Super Cup uses transparent-background trophy artwork');

ok(/html,body,body \*\{font-family:var\(--btl-display-font\)!important\}/.test(css),'Unisportion FC font stack is applied site-wide');
ok(/nationalFlagImage\(option\.value/.test(app),'nationality custom select uses flag images instead of country abbreviations');
ok(/#career \.next-match \.next-team-visual \.crest-shell\{width:150px!important;height:150px!important/.test(css),'next-match club crest is 150px on desktop');
ok(/saved-career-summary-main h4/.test(css)&&/saved-title-trophy-card/.test(css),'Hall and opened saved-career spacing/layout styles exist');

// Logic regression: selecting the 5th kick means the player does not shoot if his team is already mathematically eliminated.
const fnSrc=extractFunction('simulateShootoutSeries');
const state={player:{position:'Centroavante',overall:90,potential:92,clubStrength:86,reputation:55,attributes:{finishing:91,dribbling:88,passing:82}}};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const simulate=new Function('state','clamp',`${fnSrc}; return simulateShootoutSeries;`)(state,clamp);
const realRandom=Math.random;let seq=[0.1, 0.99,0.01, 0.99,0.01, 0.99,0.01, 0.99,0.01];Math.random=()=>seq.length?seq.shift():0.01;
let result;try{result=simulate({team:'Home',home:'Home',away:'Away',playerKickRound:5},{chance:.75});}finally{Math.random=realRandom;}
ok(result.playerKick.taken===false,'5th-kick player is skipped after mathematical elimination');
ok(result.kicks.filter(k=>!k.sudden).every(k=>k.round<=5),'standard shootout never creates a 6th regular kick');

// Basic HTML ID uniqueness regression.
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const dup=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];ok(dup.length===0,'HTML has no duplicate IDs');
console.log(`\n${passed} checks passed.`);
