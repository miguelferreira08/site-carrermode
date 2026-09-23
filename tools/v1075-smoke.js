const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/style.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
let passed=0;
function ok(cond,msg){if(!cond)throw new Error('FAIL: '+msg);console.log('PASS:',msg);passed++;}
function extractFunction(name){
  const marker=`function ${name}(`,start=app.indexOf(marker);if(start<0)throw new Error('missing '+name);
  const brace=app.indexOf('{',start);let depth=0,inStr=null,esc=false,inLine=false,inBlock=false;
  for(let i=brace;i<app.length;i++){
    const c=app[i],n=app[i+1];
    if(inLine){if(c==='\n')inLine=false;continue;}if(inBlock){if(c==='*'&&n==='/'){inBlock=false;i++;}continue;}
    if(inStr){if(esc){esc=false;continue;}if(c==='\\'){esc=true;continue;}if(c===inStr)inStr=null;continue;}
    if(c==='/'&&n==='/'){inLine=true;i++;continue;}if(c==='/'&&n==='*'){inBlock=true;i++;continue;}if(c==='"'||c==="'"||c==='`'){inStr=c;continue;}
    if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0)return app.slice(start,i+1);}
  }
  throw new Error('unterminated '+name);
}

ok(/\?v=10\.7\.5/.test(html),'cache buster updated to v10.7.5');
ok(!/\bclubMeta\s*\(/.test(app),'undefined clubMeta reference remains removed');
ok(/'Bayern de Munique':\['https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/FC_Bayern_M/.test(app),'Bayern uses current real crest source');
ok(/luukhopman\/football-logos\/master\/logos/.test(app),'2026/27 European crest repository is used as a badge source');
ok(/'Ipswich Town':\['https:\/\/upload\.wikimedia\.org\/wikipedia\/en\/4\/43\/Ipswich_Town\.svg'\]/.test(app),'Ipswich keeps its real transparent crest');

ok(/worldRetirementChance\(age\)/.test(app),'world-player retirement curve exists');
ok(/wp\.name==='Cristiano Ronaldo'&&age>=43/.test(app),'Cristiano Ronaldo is guaranteed retired by age 43');
ok(/simulateWorldRetirements\(state\.season\?\.year\|\|START_YEAR\)/.test(app),'retirement check runs with world transfer/season update');
const retSrc=extractFunction('worldRetirementChance');
const ret=new Function(`${retSrc}; return worldRetirementChance;`)();
ok(ret(35)===0 && ret(36)>0 && ret(40)>ret(38) && ret(43)>ret(41) && ret(44)===1,'retirement probability increases after age 36');

ok(/UEFA Champions League\/i\.test\(title\).*confederation\(wp\.countryCode\)==='UEFA'.*strength>=82/s.test(app),'Champions leaderboard requires UEFA club and high club strength');
ok(/if\(!wp\|\|wp\.retired\|\|!wp\.club\)return false/.test(app),'retired players are excluded from competition leaderboards');
const eligSrc=extractFunction('worldPlayerEligibleForCompetition');
const elig=new Function('clubStrength','findClubDataAny','confederation',`${eligSrc}; return worldPlayerEligibleForCompetition;`)(
  (club,code)=>({'Real Madrid':94,'Santos':80,'Al-Nassr':82,'Bayern de Munique':93}[club]||75),
  ()=>null,
  code=>({ES:'UEFA',DE:'UEFA',BR:'CONMEBOL',SA:'AFC'}[code]||'OTHER')
);
ok(elig({club:'Real Madrid',countryCode:'ES',retired:false},'UEFA Champions League'),'elite European club is eligible for Champions');
ok(!elig({club:'Santos',countryCode:'BR',retired:false},'UEFA Champions League'),'Neymar/Santos-type non-European player is excluded from Champions');
ok(!elig({club:'Al-Nassr',countryCode:'SA',retired:false},'UEFA Champions League'),'Cristiano/Al-Nassr-type Asian player is excluded from Champions');

ok(/function penaltyTeamVisualMarkup/.test(app)&&/nationalFlagImage\(codeForCountryName\(team\),team\)/.test(app),'national-team penalty shootouts use country flags');
ok(/A disputa será simulada até chegar a sua vez/.test(app),'penalty order explicitly simulates before the user kick');
ok(/const isPlayerTurn=live\.phase==='standard'&&live\.nextTeam===pending\.team&&live\.round===pending\.playerKickRound/.test(app),'player only takes the chosen numbered kick');
ok(/live\.phase='sudden';live\.round=6;live\.nextTeam=live\.first/.test(app),'drawn five-kick series continues into sudden death');
ok(/penalty-sudden-list/.test(css),'sudden-death kicks have dedicated visual styling');

ok(/#decision-result\.hidden/.test(css),'previous match result is forcibly hidden before a new decision');
ok(/#event-modal \.overlay-pause-btn,#match-decision-modal \.overlay-pause-btn\{[\s\S]*position:absolute!important;[\s\S]*right:18px!important/.test(css),'pause button is fixed to the top-right of its modal card');
ok(/\*::-webkit-scrollbar-thumb/.test(css)&&/scrollbar-color:/.test(css),'scrollbars have custom styling');
ok(/input,textarea,select,\.btl-select-trigger\{/.test(css),'inputs/selects have a dedicated game UI');
ok(/\.fifa-icon-card \.icon-card-stats\{[\s\S]*padding-left:24px!important/.test(css),'ICON stats are inset so finishing is not clipped');
ok(/\.saved-career-detail-head\{padding:18px 22px 16px!important/.test(css),'saved-career header has safe edge spacing');
ok(/html,body,button,input,textarea,select,option,optgroup/.test(css)&&/--btl-display-font:'UT Unisportion FC'/.test(css),'Unisportion family is globally forced in CSS');

const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const dup=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
ok(dup.length===0,'HTML has no duplicate IDs');
console.log(`\n${passed} v10.7.5 checks passed.`);
