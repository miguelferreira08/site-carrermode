const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const STORAGE_KEY = 'careerSimV5';
const BADGE_KEY = 'careerSimBadgeCacheV5';

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  created:false, player:null, season:null, history:[], offers:[], news:[], pendingEvent:null
};
let badgeCache = JSON.parse(localStorage.getItem(BADGE_KEY) || '{}');
let creationClubPool = [];
let creationChoices = [];
let nextEventCache = null;
let pendingSeasonCelebration = null;

const DEFAULT_THEME = {accent:'#42e88d',secondary:'#f4f7f5',bg:'#071016',panel:'#0d1820',panel2:'#111f29',border:'#243640',buttonText:'#032313'};

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function saveBadges(){ localStorage.setItem(BADGE_KEY, JSON.stringify(badgeCache)); }
function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function sample(array,count){ return [...array].sort(()=>Math.random()-.5).slice(0,count); }
function shuffle(array){ return [...array].sort(()=>Math.random()-.5); }
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function money(v){ return '€ ' + (v >= 1e6 ? (v/1e6).toFixed(1)+' mi' : Math.round(v/1000)+' mil'); }
function toast(msg){ const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800); }
function countryByCode(code){ return COUNTRIES.find(c=>c.code===code); }
function countryFlag(code){
  const special={ENG:'🏴',SCO:'🏴',WAL:'🏴',NIR:'🏴'};
  if(special[code]) return special[code];
  if(!code || code.length!==2) return '🌍';
  return code.toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt()));
}
function confederation(code){
  if(CONFEDERATIONS.southAmerica.includes(code)) return 'CONMEBOL';
  if(CONFEDERATIONS.europe.includes(code)) return 'UEFA';
  if(CONFEDERATIONS.concacaf.includes(code)) return 'CONCACAF';
  if(CONFEDERATIONS.asia.includes(code)) return 'AFC';
  if(CONFEDERATIONS.africa.includes(code)) return 'CAF';
  if(CONFEDERATIONS.oceania.includes(code)) return 'OFC';
  return 'Mundial';
}
function genericContinental(code){
  return ({CONMEBOL:'CONMEBOL Libertadores',UEFA:'UEFA Champions League',CONCACAF:'CONCACAF Champions Cup',AFC:'AFC Champions League Elite',CAF:'CAF Champions League',OFC:'OFC Champions League'})[confederation(code)] || 'Competição Continental';
}
function getCompetitionRule(code,countryName){
  return COMPETITION_RULES[code] || {league:`Liga Nacional de ${countryName}`,cup:`Copa Nacional de ${countryName}`,continental:[genericContinental(code)]};
}
function getLeagueFormat(code){
  return LEAGUE_FORMATS[code] || {teams:16,matches:30,mode:'double_round_robin',championPoints:62,label:'16 clubes · 30 rodadas · turno e returno (formato genérico)'};
}
function findClubData(name,code){
  const local=(LOCAL_CLUBS[code]||[]).find(c=>c.name===name);
  const transfer=TRANSFER_TARGETS.find(c=>c.name===name);
  return local || transfer || null;
}
function findClubDataAny(name){
  for(const clubs of Object.values(LOCAL_CLUBS)){ const hit=clubs.find(c=>c.name===name); if(hit)return hit; }
  return TRANSFER_TARGETS.find(c=>c.name===name) || null;
}
function clubStrength(name,code){ return findClubData(name,code)?.strength || findClubDataAny(name)?.strength || 72; }
function normalizedClub(raw,code){ return {name:raw.name||raw.strTeam,strength:raw.strength||72,badge:raw.badge||raw.strBadge||'',countryCode:code}; }
function allTransferClubs(){
  const fromLocal=Object.entries(LOCAL_CLUBS).flatMap(([countryCode,clubs])=>clubs.map(c=>({...c,countryCode})));
  const all=[...fromLocal,...TRANSFER_TARGETS];
  return [...new Map(all.map(c=>[`${c.countryCode}:${c.name}`,c])).values()];
}

function formatDateBR(iso){ if(!iso) return '-'; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; }
function calculateAge(iso, reference=new Date()){
  const birth=new Date(`${iso}T12:00:00`);
  let age=reference.getFullYear()-birth.getFullYear();
  const beforeBirthday=reference.getMonth()<birth.getMonth() || (reference.getMonth()===birth.getMonth() && reference.getDate()<birth.getDate());
  if(beforeBirthday) age--;
  return age;
}
function isoDate(date){ return date.toISOString().slice(0,10); }
function setupBirthdateLimits(){
  const today=new Date();
  const max=new Date(today); max.setFullYear(today.getFullYear()-17);
  const min=new Date(today); min.setFullYear(today.getFullYear()-23); min.setDate(min.getDate()+1);
  $('#birthdate').min=isoDate(min); $('#birthdate').max=isoDate(max);
}
function sanitizeShirtNumber(){
  const input=$('#number');
  let value=input.value.replace(/\D/g,'').slice(0,2);
  if(value && Number(value)>99) value='99';
  if(value==='0' || value==='00') value='1';
  input.value=value;
}

function applyClubTheme(name){
  const theme=CLUB_THEMES[name] || DEFAULT_THEME;
  const root=document.documentElement;
  root.style.setProperty('--green',theme.accent);
  root.style.setProperty('--green2',theme.accent2||theme.accent);
  root.style.setProperty('--club-secondary',theme.secondary||'#f4f7f5');
  root.style.setProperty('--button-text',theme.buttonText||'#ffffff');
  root.style.setProperty('--bg',theme.bg);
  root.style.setProperty('--panel',theme.panel);
  root.style.setProperty('--panel2',theme.panel2);
  root.style.setProperty('--border',theme.border);
  root.style.setProperty('--theme-flash',theme.accent);
  const current=document.body.dataset.clubTheme||'';
  if(name && current!==name){
    document.body.dataset.clubTheme=name;
    document.body.classList.remove('theme-pulse');
    void document.body.offsetWidth;
    document.body.classList.add('theme-pulse');
    setTimeout(()=>document.body.classList.remove('theme-pulse'),700);
  }else if(!name) document.body.dataset.clubTheme='';
}

async function resolveClubBadge(name){
  if(!name) return '';
  if(badgeCache[name]!==undefined) return badgeCache[name];
  try{
    const response=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(name)}`);
    if(!response.ok) throw new Error('badge');
    const data=await response.json();
    const teams=(data.teams||[]).filter(t=>!t.strSport || t.strSport==='Soccer');
    const exact=teams.find(t=>t.strTeam?.toLowerCase()===name.toLowerCase()) || teams[0];
    badgeCache[name]=exact?.strBadge||''; saveBadges(); return badgeCache[name];
  }catch(_){ badgeCache[name]=''; saveBadges(); return ''; }
}
async function hydrateBadge(img,name,fallback){
  if(!img) return;
  const url=await resolveClubBadge(name);
  if(url){ img.src=url;img.alt=`Escudo do ${name}`;img.classList.remove('hidden');if(fallback)fallback.classList.add('hidden'); }
  else { img.classList.add('hidden');if(fallback)fallback.classList.remove('hidden'); }
}
function hydrateRenderedBadges(){
  $$('.club-option[data-club-name]').forEach(async el=>{
    const name=el.dataset.clubName; const img=el.querySelector('img'); const fallback=el.querySelector('.crest-fallback'); await hydrateBadge(img,name,fallback);
  });
  $$('.offer[data-club-name]').forEach(async el=>{ await hydrateBadge(el.querySelector('img'),el.dataset.clubName,el.querySelector('.crest-fallback')); });
}

function populateCreationFields(){
  const countrySelect=$('#nationality');
  COUNTRIES.slice().sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')).forEach(c=>{
    const opt=document.createElement('option');opt.value=c.code;opt.textContent=c.name;countrySelect.appendChild(opt);
  });
  POSITIONS.forEach(pos=>{ const opt=document.createElement('option');opt.value=pos;opt.textContent=pos;$('#position').appendChild(opt); });
}

function countryClubBase(code){
  const names=LEAGUE_CLUB_POOLS[code] || [];
  const known=(LOCAL_CLUBS[code]||[]).map(c=>normalizedClub(c,code));
  const merged=[...known,...names.map(name=>({name,strength:clubStrength(name,code),badge:'',countryCode:code}))];
  return [...new Map(merged.map(c=>[c.name,c])).values()];
}
async function fetchCountryClubs(country){
  const local=countryClubBase(country.code);
  if(local.length>=3) return {clubs:local,source:'base local do protótipo'};
  const status=$('#club-status');status.textContent=`Buscando clubes de ${country.name}...`;status.classList.add('loading');
  try{
    const response=await fetch(`https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?s=Soccer&c=${encodeURIComponent(country.apiName)}`);
    if(!response.ok) throw new Error('Falha na API');
    const data=await response.json();
    const teams=(data.teams||[]).filter(t=>t.strTeam && (!t.strSport||t.strSport==='Soccer')).map(t=>normalizedClub(t,country.code));
    const unique=[...new Map(teams.map(t=>[t.name,t])).values()];
    if(unique.length>=3) return {clubs:unique,source:'TheSportsDB'};
    throw new Error('Poucos clubes');
  }catch(_){
    return {clubs:[
      {name:`Atlético ${country.name}`,strength:70,badge:'',countryCode:country.code},
      {name:`Sporting ${country.name}`,strength:69,badge:'',countryCode:country.code},
      {name:`${country.name} FC`,strength:68,badge:'',countryCode:country.code}
    ],source:'clubes fictícios de fallback'};
  }finally{ status.classList.remove('loading'); }
}
async function loadClubChoices(){
  const code=$('#nationality').value;$('#selected-club').value='';$('#create-submit').disabled=true;$('#club-options').innerHTML='';
  if(!code){$('#club-status').textContent='Selecione sua nacionalidade para sortear os clubes.';$('#reroll-clubs').disabled=true;return;}
  $('#reroll-clubs').disabled=true;
  const result=await fetchCountryClubs(countryByCode(code));creationClubPool=result.clubs;$('#club-status').dataset.source=result.source;drawThreeClubs();$('#reroll-clubs').disabled=false;
}
function drawThreeClubs(){
  const source=$('#club-status').dataset.source||'base de clubes';
  creationChoices=sample(creationClubPool,Math.min(3,creationClubPool.length));
  $('#club-status').innerHTML=`Três clubes foram sorteados. Escolha um para começar.<div class="club-source">Fonte dos clubes: ${source}</div>`;
  $('#club-options').innerHTML=creationChoices.map((c,i)=>`
    <button type="button" class="club-option" data-club-index="${i}" data-club-name="${c.name.replace(/"/g,'&quot;')}">
      <span class="check"></span><span class="crest-shell small"><img class="club-badge-img hidden" alt=""><span class="crest-fallback">⚽</span></span>
      <strong>${c.name}</strong><small>${getCompetitionRule(c.countryCode,countryByCode(c.countryCode)?.name||'seu país').league}</small><small>Força estimada: ${c.strength}</small>
    </button>`).join('');
  $$('.club-option').forEach(btn=>btn.addEventListener('click',()=>selectCreationClub(+btn.dataset.clubIndex)));
  hydrateRenderedBadges();
}
function selectCreationClub(index){
  const selected=creationChoices[index];$('#selected-club').value=selected.name;
  $$('.club-option').forEach((el,i)=>{el.classList.toggle('selected',i===index);el.querySelector('.check').textContent=i===index?'✓':'';});
  $('#create-submit').disabled=false;
}

function qualificationForClub(code,strength){
  const rule=getCompetitionRule(code,countryByCode(code)?.name||'seu país');const list=rule.continental||[];if(!list.length)return null;
  if(code==='BR'){ if(strength>=82)return list[0]; if(strength>=76)return Math.random()<.6?list[0]:list[1]; return Math.random()<.2?list[1]:null; }
  if(confederation(code)==='UEFA'){
    if(strength>=87)return list[0]; if(strength>=81)return Math.random()<.55?list[0]:list[1]; if(strength>=76)return Math.random()<.55?list[1]:list[2]; return Math.random()<.15?list[2]:null;
  }
  return strength>=80||Math.random()<.2?list[0]:null;
}
function continentalFromLeagueResult(code,position){
  const list=getCompetitionRule(code,countryByCode(code)?.name||'').continental||[];if(!list.length||!position)return null;
  if(code==='BR'){ if(position<=6)return list[0]; if(position<=12)return list[1]; return null; }
  if(confederation(code)==='UEFA'){ if(position<=4)return list[0];if(position<=6)return list[1];if(position<=7)return list[2];return null; }
  if(position<=3)return list[0]; return null;
}

function leaguePoolForCountry(code,currentClub){
  const format=getLeagueFormat(code);let names=[...(LEAGUE_CLUB_POOLS[code]||[]),...(LOCAL_CLUBS[code]||[]).map(c=>c.name)];
  if(!names.includes(currentClub)) names.unshift(currentClub);
  names=[...new Set(names)];
  const country=countryByCode(code)?.name||'Nacional';let i=1;
  while(names.length<format.teams){ const fake=`${country} Clube ${String(i).padStart(2,'0')}`;if(!names.includes(fake))names.push(fake);i++; }
  return names.slice(0,format.teams);
}
function generateLeagueSchedule(code,currentClub,leagueName){
  const format=getLeagueFormat(code);const teams=leaguePoolForCountry(code,currentClub);const opponents=shuffle(teams.filter(t=>t!==currentClub));const events=[];
  if(format.mode==='double_round_robin'){
    opponents.forEach((opp,i)=>{ const home=i%2===0;events.push({type:'league',competition:leagueName,round:i+1,home:home?currentClub:opp,away:home?opp:currentClub,opponent:opp}); });
    opponents.forEach((opp,i)=>{ const home=i%2!==0;events.push({type:'league',competition:leagueName,round:opponents.length+i+1,home:home?currentClub:opp,away:home?opp:currentClub,opponent:opp}); });
    return events;
  }
  for(let i=0;i<format.matches;i++){
    const opp=opponents[i%opponents.length];const home=i%2===0;events.push({type:'league',competition:leagueName,round:i+1,home:home?currentClub:opp,away:home?opp:currentClub,opponent:opp});
  }
  return events;
}
function domesticCupStages(code){ return (DOMESTIC_CUP_FORMATS[code]||{stages:[{name:'Fase inicial',legs:1},{name:'Oitavas de final',legs:1},{name:'Quartas de final',legs:1},{name:'Semifinal',legs:1},{name:'Final',legs:1}]}).stages; }
function createKnockoutState(name,stages,nextLeagueRound=3){
  return {name,active:true,eliminated:false,won:false,stages,stageIndex:0,leg:1,opponent:null,firstLegHome:true,aggregateFor:0,aggregateAgainst:0,nextLeagueRound};
}
function generateContinentalPhaseSchedule(p,name,format){
  if(!format.phaseMatches)return [];
  const conf=confederation(p.clubCountry);let pool=allTransferClubs().filter(c=>c.countryCode!==p.clubCountry&&confederation(c.countryCode)===conf).map(c=>c.name);
  pool=[...new Set(pool)];while(pool.length<format.phaseMatches){pool.push(`Rival internacional ${pool.length+1}`);}
  const selected=sample(pool,Math.min(format.phaseMatches,pool.length));const events=[];
  if(format.phaseMatches===6 && name.includes('CONMEBOL')){
    const three=selected.slice(0,3);three.forEach((opp,i)=>events.push({type:'continental',competition:name,stage:format.phase,round:i+1,home:i%2===0?p.club:opp,away:i%2===0?opp:p.club,opponent:opp}));
    three.forEach((opp,i)=>events.push({type:'continental',competition:name,stage:format.phase,round:i+4,home:i%2!==0?p.club:opp,away:i%2!==0?opp:p.club,opponent:opp}));return events;
  }
  selected.slice(0,format.phaseMatches).forEach((opp,i)=>{const home=i%2===0;events.push({type:'continental',competition:name,stage:format.phase,round:i+1,home:home?p.club:opp,away:home?opp:p.club,opponent:opp});});return events;
}
function createContinentalState(p,name){
  if(!name)return null;const format=CONTINENTAL_FORMATS[name]||{phaseMatches:6,phase:'Fase de grupos',qualifyPoints:9,directPoints:9,knockout:[{name:'Quartas de final',legs:2},{name:'Semifinal',legs:2},{name:'Final',legs:1}]};
  const phaseSchedule=generateContinentalPhaseSchedule(p,name,format);
  return {name,active:true,eliminated:false,won:false,format,phase:format.phaseMatches?'phase':'knockout',phaseSchedule,phaseIndex:0,points:0,wins:0,draws:0,losses:0,knockout:createKnockoutState(name,format.knockout,2),nextLeagueRound:2};
}
function createSeason(p,year,continentalOverride){
  const rule=getCompetitionRule(p.clubCountry,p.clubCountryName);const leagueFormat=getLeagueFormat(p.clubCountry);const continentalName=continentalOverride===undefined?qualificationForClub(p.clubCountry,p.clubStrength):continentalOverride;
  return {
    year,clubAtStart:p.club,countryAtStart:p.clubCountry,totalGames:0,clubGames:0,clubGoals:0,clubAssists:0,goals:0,assists:0,ratingSum:0,lastNationalAt:-10,lastCareerEventAt:-8,closed:false,endProcessed:false,featuredMatch:null,
    league:{name:rule.league,format:leagueFormat,schedule:generateLeagueSchedule(p.clubCountry,p.club,rule.league),index:0,points:0,wins:0,draws:0,losses:0,gf:0,ga:0,finished:false,position:null,titleAwarded:false},
    cup:createKnockoutState(rule.cup,domesticCupStages(p.clubCountry),3),
    continental:createContinentalState(p,continentalName)
  };
}

function knockoutOpponent(domestic=true){
  const p=state.player;
  if(domestic){ const pool=leaguePoolForCountry(p.clubCountry,p.club).filter(n=>n!==p.club);return pool[rnd(0,pool.length-1)]; }
  const conf=confederation(p.clubCountry);const pool=allTransferClubs().filter(c=>c.countryCode!==p.clubCountry&&confederation(c.countryCode)===conf);return pool.length?pool[rnd(0,pool.length-1)].name:'Rival internacional';
}
function getKnockoutEvent(comp,type){
  const p=state.player;const stage=comp.stages[comp.stageIndex];if(!stage)return null;
  if(!comp.opponent){comp.opponent=knockoutOpponent(type==='cup');comp.firstLegHome=Math.random()<.5;comp.aggregateFor=0;comp.aggregateAgainst=0;comp.leg=1;}
  const home=stage.legs===1 ? Math.random()<.5 : (comp.leg===1?comp.firstLegHome:!comp.firstLegHome);
  return {type,competition:comp.name,stage:stage.name,leg:comp.leg,home:home?p.club:comp.opponent,away:home?comp.opponent:p.club,opponent:comp.opponent};
}
function getContinentalEvent(){
  const c=state.season.continental;if(!c||!c.active)return null;
  if(c.phase==='phase') return c.phaseSchedule[c.phaseIndex]||null;
  return getKnockoutEvent(c.knockout,'continental');
}
function nationalCompetition(year,gameNo){ if(year%4===2)return gameNo%2===0?'Copa do Mundo':'Amistoso Internacional';return gameNo%2===0?'Eliminatórias da Copa do Mundo':'Amistoso Internacional'; }
function chooseNextEvent(){
  if(!state.created||state.player.retired)return null;const p=state.player,s=state.season;
  if(p.calledUp && s.totalGames-s.lastNationalAt>=10 && s.totalGames>0){
    const rivals=COUNTRIES.filter(c=>c.code!==p.nationalityCode);const rival=rivals[rnd(0,rivals.length-1)];
    const nationalHome=Math.random()<.5;return {type:'national',competition:nationalCompetition(s.year,s.totalGames+1),stage:'Seleção',home:nationalHome?p.nationality:rival.name,away:nationalHome?rival.name:p.nationality,opponent:rival.name};
  }
  const continental=s.continental;
  if(continental?.active && (s.league.index>=continental.nextLeagueRound || s.league.finished)){
    const event=getContinentalEvent();if(event)return event;
  }
  if(s.cup.active && (s.league.index>=s.cup.nextLeagueRound || s.league.finished)) return getKnockoutEvent(s.cup,'cup');
  if(!s.league.finished) return s.league.schedule[s.league.index];
  return null;
}
function seasonComplete(){ const s=state.season;return !!s && s.league.finished && !s.cup.active && (!s.continental||!s.continental.active); }

function poisson(lambda){
  const limit=Math.exp(-lambda);let product=1,k=0;
  do{k++;product*=Math.random();}while(product>limit&&k<9);
  return clamp(k-1,0,7);
}
function poissonProbability(k,lambda){
  let factorial=1;for(let i=2;i<=k;i++)factorial*=i;
  return Math.exp(-lambda)*Math.pow(lambda,k)/factorial;
}
function matchModel(homeStrength,awayStrength){
  const homeAdvantage=4;
  const effectiveHome=homeStrength+homeAdvantage;
  const diff=effectiveHome-awayStrength;
  const homeXg=clamp(1.35+diff*.045,.35,3.25);
  const awayXg=clamp(1.10-diff*.040,.25,2.85);
  let homeWin=0,draw=0,awayWin=0;
  for(let h=0;h<=7;h++)for(let a=0;a<=7;a++){
    const prob=poissonProbability(h,homeXg)*poissonProbability(a,awayXg);
    if(h>a)homeWin+=prob;else if(h===a)draw+=prob;else awayWin+=prob;
  }
  const total=homeWin+draw+awayWin;
  return {homeStrength,awayStrength,effectiveHome,homeAdvantage,homeXg,awayXg,homeWin:homeWin/total,draw:draw/total,awayWin:awayWin/total};
}
function playerClubStrength(){
  const p=state.player;
  const impact=clamp((p.overall-70)*.20,-3,5);
  return clamp((p.clubStrength||clubStrength(p.club,p.clubCountry))+impact,60,99);
}
function eventStrengths(event){
  const p=state.player;
  if(event.type==='national'){
    const ours=clamp(72+(p.overall-67)*.30+(p.reputation||0)*.03,68,94);
    const theirs=clamp(72+(event.opponent.charCodeAt(0)%18),70,91);
    return event.home===p.nationality?{home:ours,away:theirs}:{home:theirs,away:ours};
  }
  const ours=playerClubStrength();
  const theirs=clubStrength(event.opponent,p.clubCountry);
  return event.home===p.club?{home:ours,away:theirs}:{home:theirs,away:ours};
}
function favoritismForEvent(event){
  const strengths=eventStrengths(event);const model=matchModel(strengths.home,strengths.away);
  const homePct=Math.round(model.homeWin*100),drawPct=Math.round(model.draw*100),awayPct=Math.max(0,100-homePct-drawPct);
  const favorite=model.homeWin>=model.awayWin?event.home:event.away;
  const favoritePct=Math.round(Math.max(model.homeWin,model.awayWin)*100);
  return {...model,homePct,drawPct,awayPct,favorite,favoritePct};
}
function simulateScore(event){
  const strengths=eventStrengths(event);const model=matchModel(strengths.home,strengths.away);
  return {homeGoals:poisson(model.homeXg),awayGoals:poisson(model.awayXg),model};
}
function positionProfile(position){
  return ({'Goleiro':{goal:.002,assist:.015,defensive:true},'Zagueiro':{goal:.055,assist:.04,defensive:true},'Lateral direito':{goal:.05,assist:.15,defensive:true},'Lateral esquerdo':{goal:.05,assist:.15,defensive:true},'Volante':{goal:.08,assist:.13,defensive:true},'Meia central':{goal:.14,assist:.25},'Meia ofensivo':{goal:.22,assist:.32},'Meia direita':{goal:.19,assist:.28},'Meia esquerda':{goal:.19,assist:.28},'Segundo atacante':{goal:.34,assist:.25},'Ponta direita':{goal:.31,assist:.27},'Ponta esquerda':{goal:.31,assist:.27},'Centroavante':{goal:.43,assist:.15}})[position]||{goal:.14,assist:.25};
}
function simulatePlayerPerformance(teamGoals,oppGoals){
  const p=state.player,profile=positionProfile(p.position),quality=clamp((p.overall-60)/100,0,.36);
  let goals=0,assists=0;
  if(teamGoals>0){
    goals=Math.random()<profile.goal+quality?1:0;
    if(goals&&teamGoals>1&&Math.random()<.10+quality/3)goals++;
    goals=Math.min(goals,teamGoals);
    const assistSlots=Math.max(0,teamGoals-goals);
    if(assistSlots>0&&Math.random()<profile.assist+quality*.65)assists=1;
    if(assistSlots>1&&assists&&Math.random()<.08+quality/4)assists++;
    assists=Math.min(assists,assistSlots);
  }
  let rating=6.05+goals*1.2+assists*.65+(Math.random()*1.4-.5)+(p.morale-70)/120;let extraLabel='Passes',extraValue=`${rnd(72,96)}%`;
  if(p.position==='Goleiro'){const saves=rnd(2,9);rating=6.2+saves*.16+(oppGoals===0?.7:0)+(Math.random()*.5-.25);extraLabel='Defesas';extraValue=saves;}
  else if(profile.defensive&&oppGoals===0){rating+=.45;extraLabel='Desarmes';extraValue=rnd(2,7);}
  return {goals,assists,rating:clamp(rating,5.0,10),extraLabel,extraValue};
}
function simulateMatchCore(event){
  const p=state.player,s=state.season;const playerIsHome=event.type==='national'?event.home===p.nationality:event.home===p.club;
  const score=simulateScore(event);const teamGoals=playerIsHome?score.homeGoals:score.awayGoals;const oppGoals=playerIsHome?score.awayGoals:score.homeGoals;
  const perf=simulatePlayerPerformance(teamGoals,oppGoals);
  s.totalGames++;s.goals+=perf.goals;s.assists+=perf.assists;s.ratingSum+=perf.rating;
  if(event.type!=='national'){
    s.clubGames++;s.clubGoals+=perf.goals;s.clubAssists+=perf.assists;
    p.value=Math.max(200000,Math.round(p.value*(1+(perf.rating-6.5)/260)));
  }else{p.nationalTeamGames++;p.nationalTeamGoals+=perf.goals;}
  processCompetitionResult(event,teamGoals,oppGoals);
  if(perf.rating>=8)state.news.push(`${p.name} foi destaque em ${event.competition}, com nota ${perf.rating.toFixed(1)}.`);
  return {event,playerIsHome,teamGoals,oppGoals,homeGoals:score.homeGoals,awayGoals:score.awayGoals,perf,model:score.model};
}
function matchImportance(log){
  let value=log.event.type==='continental'?25:log.event.type==='cup'?18:log.event.type==='national'?12:5;
  if((log.event.stage||'').toLowerCase().includes('final'))value+=30;
  value+=clubStrength(log.event.opponent,state.player.clubCountry)/6+log.perf.rating+log.perf.goals*5+log.perf.assists*3;
  return value;
}
function generateMatchMoments(log){
  const p=state.player,attacker=['Segundo atacante','Ponta direita','Ponta esquerda','Centroavante','Meia ofensivo'].includes(p.position);
  const moments=[];let minute=8;
  const push=text=>{const jump=rnd(8,18);minute=Math.min(89,minute+jump);moments.push({minute,text});};
  if(p.position==='Goleiro')push(log.oppGoals===0?'Defesa firme em chute perigoso. Você mantém o placar zerado.':'Primeira defesa importante após finalização de média distância.');
  else if(attacker&&Math.random()<.65)push(log.perf.goals>0?'Pênalti para sua equipe. Você assume a cobrança e converte.':'Pênalti para sua equipe. Você bate, mas o goleiro evita o gol.');
  else push('Você participa de uma boa construção e ajuda a equipe a avançar no campo.');
  if(log.perf.goals>0)push(`Você aparece em ótima posição e marca${log.perf.goals>1?' um dos seus gols':' o seu gol'} na partida.`);
  else if(log.teamGoals===0)push('Boa chance criada, mas a finalização não entra. O placar segue sem gols para sua equipe.');
  else push('Sua equipe chega ao gol, mas a jogada termina com outro companheiro como protagonista.');
  if(log.perf.assists>0)push('Você encontra um companheiro livre e registra uma assistência.');
  else if(p.position==='Goleiro')push('Você organiza a defesa em uma bola parada e afasta o perigo.');
  else push('Você tenta o último passe, mas a defesa adversária consegue cortar.');
  if(log.oppGoals>0)push('O adversário aumenta a pressão e consegue balançar a rede em um dos ataques.');
  else push('A equipe suporta a pressão adversária sem sofrer gol nesse momento.');
  const result=log.teamGoals>log.oppGoals?'vitória':log.teamGoals===log.oppGoals?'empate':'derrota';
  push(`Apito final: ${result}. Sua nota na partida foi ${log.perf.rating.toFixed(1)}.`);
  return moments.slice(0,5);
}
function addTrophy(name){
  const p=state.player;p.trophies=p.trophies||[];if(p.trophies.some(t=>t.year===state.season.year&&t.name===name))return;
  p.trophies.push({year:state.season.year,name});p.titles=p.trophies.length;state.news.push(`${p.name} é campeão de ${name} com o ${p.club}!`);if(!state.simulatingSeason)showCelebration('🏆',`Campeão: ${name}`,`${p.name} adiciona mais um título à carreira.`);
}
function legacyV4_finalizeLeague(){
  const l=state.season.league;if(l.finished)return;l.finished=true;const pts=l.points,champ=l.format.championPoints;
  let pos;if(pts>=champ)pos=1;else if(pts>=champ-5)pos=rnd(2,4);else if(pts>=champ-12)pos=rnd(3,7);else if(pts>=champ-22)pos=rnd(6,11);else if(pts>=champ-32)pos=rnd(10,15);else pos=rnd(Math.max(12,l.format.teams-5),l.format.teams);
  l.position=clamp(pos,1,l.format.teams);if(l.position===1)addTrophy(l.name);state.news.push(`${state.player.club} encerrou ${l.name} na ${l.position}ª posição, com ${l.points} pontos.`);
}
function advanceKnockout(comp){
  comp.stageIndex++;comp.leg=1;comp.opponent=null;comp.aggregateFor=0;comp.aggregateAgainst=0;
  if(comp.stageIndex>=comp.stages.length){comp.active=false;comp.won=true;addTrophy(comp.name);}
}
function processKnockout(comp,event,pf,pa){
  const stage=comp.stages[comp.stageIndex];comp.aggregateFor+=pf;comp.aggregateAgainst+=pa;
  if(stage.legs===1 || comp.leg===stage.legs){
    let win=comp.aggregateFor>comp.aggregateAgainst;if(comp.aggregateFor===comp.aggregateAgainst)win=Math.random()<.5;
    if(win){state.news.push(`${state.player.club} avançou em ${comp.name} (${stage.name}).`);advanceKnockout(comp);}else{comp.active=false;comp.eliminated=true;state.news.push(`${state.player.club} foi eliminado de ${comp.name} na fase ${stage.name}.`);}
  }else comp.leg++;
}
function processContinentalResult(event,pf,pa){
  const c=state.season.continental;if(!c)return;
  if(c.phase==='phase'){
    c.phaseIndex++;if(pf>pa){c.points+=3;c.wins++;}else if(pf===pa){c.points++;c.draws++;}else c.losses++;
    if(c.phaseIndex>=c.phaseSchedule.length){
      if(c.points<c.format.qualifyPoints){c.active=false;c.eliminated=true;state.news.push(`${state.player.club} foi eliminado de ${c.name} após a ${c.format.phase.toLowerCase()}.`);}
      else{
        c.phase='knockout';const hasConditional=c.knockout.stages[0]?.conditional;if(hasConditional&&c.points>=c.format.directPoints)c.knockout.stageIndex=1;
        state.news.push(`${state.player.club} avançou ao mata-mata de ${c.name} com ${c.points} pontos.`);
      }
    }
  }else{processKnockout(c.knockout,event,pf,pa);if(!c.knockout.active){c.active=false;c.won=c.knockout.won;c.eliminated=c.knockout.eliminated;}}
}
function processCompetitionResult(event,pf,pa){
  const s=state.season;
  if(event.type==='league'){
    const l=s.league;l.index++;l.gf+=pf;l.ga+=pa;if(pf>pa){l.points+=3;l.wins++;}else if(pf===pa){l.points++;l.draws++;}else l.losses++;if(l.index>=l.schedule.length)finalizeLeague();
  }else if(event.type==='cup'){processKnockout(s.cup,event,pf,pa);s.cup.nextLeagueRound+=4;}
  else if(event.type==='continental'){processContinentalResult(event,pf,pa);if(s.continental)s.continental.nextLeagueRound+=3;}
  else if(event.type==='national'){s.lastNationalAt=s.totalGames;}
}

function updateSelectionAtSeasonEnd(avg){
  const p=state.player,was=p.calledUp;const eligible=p.overall>=73&&avg>=7.1;
  if(!was&&eligible&&Math.random()<clamp(.35+(avg-7.1)*.35+(p.overall-73)*.035,.35,.95)){p.calledUp=true;state.news.push(`${p.name} recebe sua primeira convocação para a seleção de ${p.nationality}!`);}
  else if(was&&(avg<6.6||p.overall<71)&&Math.random()<.5){p.calledUp=false;state.news.push(`${p.name} ficou fora da nova convocação de ${p.nationality}.`);}
}
function legacyV4_developmentResult(avg){
  const p=state.player;const age=p.age;const gk=p.position==='Goleiro';const devAge=gk?age-3:age;let delta=0;
  if(devAge<=20)delta=avg>=8?4:avg>=7.4?3:avg>=6.8?2:0;
  else if(devAge<=24)delta=avg>=8?3:avg>=7.3?2:avg>=6.8?1:0;
  else if(devAge<=28)delta=avg>=7.8?2:avg>=7?1:avg<6.4?-1:0;
  else if(devAge<=31)delta=avg>=7.8?1:avg<6.6?-1:0;
  else if(devAge<=34)delta=avg>=7.6?0:-rnd(1,2);
  else if(devAge<=38)delta=-rnd(1,3);else if(devAge<=41)delta=-rnd(2,4);else delta=-rnd(3,5);
  delta+=(p.developmentBoost||0);p.developmentBoost=0;
  if(age<=24){if(avg>=7.7)p.potential=clamp(p.potential+1,75,96);else if(avg<6.3)p.potential=Math.max(p.overall,p.potential-1);}
  else if(age>=30)p.potential=Math.max(55,p.potential-1);
  const before=p.overall;if(delta>0)p.overall=Math.min(p.potential,p.overall+delta);else p.overall=clamp(p.overall+delta,45,96);
  if(age>=32)p.potential=Math.max(p.overall,p.potential);
  return p.overall-before;
}
function evaluateAwards(avg){
  const p=state.player,s=state.season;const awards=[];const attacking=!['Goleiro','Zagueiro','Lateral direito','Lateral esquerdo','Volante'].includes(p.position);
  if(p.age<=21&&avg>=7.4&&s.clubGames>=18)awards.push('Melhor Jogador Jovem');
  if(avg>=7.45&&s.clubGames>=18)awards.push('Time da Temporada');
  const bootTarget=attacking?18:p.position==='Volante'?10:7;if(s.clubGoals>=bootTarget)awards.push('Chuteira de Ouro');
  const contributions=s.clubGoals+s.clubAssists;if(p.overall>=89&&avg>=7.9&&contributions>=24&&Math.random()<.68)awards.push('Bola de Ouro');
  p.awards=p.awards||[];awards.forEach(name=>{if(!p.awards.some(a=>a.year===s.year&&a.name===name))p.awards.push({year:s.year,name});});
  if(awards.length){state.news.push(`${p.name} recebeu: ${awards.join(', ')}.`);if(!state.simulatingSeason)showCelebration('⭐','Prêmios da temporada',awards.join(' · '));}
  return awards;
}
function legacyV4_generateOffers(avg){
  const p=state.player;
  const tierTargets=TRANSFER_TARGETS.filter(c=>c.name!==p.club&&p.overall>=c.minOverall);
  let normal=allTransferClubs().filter(c=>c.name!==p.club&&c.strength<=p.overall+8&&c.strength>=Math.max(64,p.overall-10));
  if(!normal.length)normal=allTransferClubs().filter(c=>c.name!==p.club&&c.strength<=p.overall+12).sort((a,b)=>Math.abs(a.strength-p.overall)-Math.abs(b.strength-p.overall)).slice(0,12);
  let pool=[...tierTargets,...normal];pool=[...new Map(pool.map(c=>[`${c.countryCode}:${c.name}`,c])).values()];
  const baseCount=avg>=7.8?3:avg>=7.0?2:1;const count=clamp(baseCount+(p.marketBonus||0),1,4);p.marketBonus=0;
  const chosen=sample(pool,Math.min(count,pool.length));
  state.offers=chosen.map(c=>({club:c.name,countryCode:c.countryCode,countryName:countryByCode(c.countryCode)?.name||c.countryCode,league:getCompetitionRule(c.countryCode,countryByCode(c.countryCode)?.name||'').league,strength:c.strength||clubStrength(c.name,c.countryCode),minOverall:c.minOverall||null,value:Math.round(p.value*(1.05+Math.random()*.70))}));
  if(state.offers.length)state.news.push(`${p.name} recebeu ${state.offers.length} proposta(s) ao fim da temporada.`);
}

function maybeTriggerCareerEvent(){
  const s=state.season;if(state.pendingEvent||s.totalGames-s.lastCareerEventAt<5||Math.random()>.17)return;
  const event=CAREER_EVENTS[rnd(0,CAREER_EVENTS.length-1)];state.pendingEvent={...event};s.lastCareerEventAt=s.totalGames;save();openPendingEvent();
}
function openPendingEvent(){
  const e=state.pendingEvent;if(!e)return;$('#event-title').textContent=e.title;$('#event-description').textContent=e.description;
  $('#event-choices').innerHTML=e.choices.map((c,i)=>`<button class="event-choice" data-choice="${i}"><strong>${c.label}</strong><small>${c.effect}</small></button>`).join('');
  $$('#event-choices .event-choice').forEach(b=>b.addEventListener('click',()=>resolveCareerEvent(+b.dataset.choice)));$('#event-modal').classList.remove('hidden');
}
function resolveCareerEvent(index){
  const e=state.pendingEvent;if(!e)return;const action=e.choices[index].action,p=state.player;let message='Decisão registrada.';
  if(action==='train_hard'){if(Math.random()<.7){p.developmentBoost=(p.developmentBoost||0)+1;message='O treino extra pode acelerar sua evolução nesta temporada.';}else{p.morale=clamp(p.morale-5,40,100);message='O treino pesou no físico e afetou seu moral.';}}
  if(action==='recover'){p.morale=clamp(p.morale+6,40,100);message='Você se sente mais recuperado para a sequência.';}
  if(action==='ambitious'){p.reputation+=4;p.pressure=(p.pressure||0)+1;message='Sua ambição repercutiu e sua reputação aumentou.';}
  if(action==='humble'){p.morale=clamp(p.morale+3,40,100);message='A resposta tranquila agradou ao vestiário.';}
  if(action==='leadership'){p.reputation+=3;if(Math.random()<.22&&p.overall<p.potential)p.overall++;message='Você assumiu mais responsabilidade no elenco.';}
  if(action==='learn'){if(p.age<=24)p.potential=clamp(p.potential+1,75,96);message='Você priorizou aprendizado e desenvolvimento.';}
  if(action==='market_push'){p.marketBonus=(p.marketBonus||0)+1;message='Seu empresário vai trabalhar por mais opções no mercado.';}
  if(action==='stability'){p.morale=clamp(p.morale+5,40,100);message='A estabilidade melhorou seu ambiente no clube.';}
  if(action==='play_tired'){p.reputation+=2;p.morale=clamp(p.morale-4,40,100);message='Você mostrou disposição, mas sentiu o desgaste.';}
  if(action==='rest'){p.morale=clamp(p.morale+4,40,100);message='O descanso ajudou sua recuperação.';}
  state.news.push(`${e.title}: ${message}`);state.pendingEvent=null;$('#event-modal').classList.add('hidden');save();render();toast(message);
}

function showCelebration(icon,title,subtitle){
  $('#celebration-icon').textContent=icon;$('#celebration-title').textContent=title;$('#celebration-subtitle').textContent=subtitle;
  $('#confetti').innerHTML=Array.from({length:38},(_,i)=>`<i style="--x:${rnd(-46,46)}vw;--r:${rnd(90,720)}deg;--d:${(Math.random()*1.4+.8).toFixed(2)}s;--delay:${(Math.random()*.5).toFixed(2)}s"></i>`).join('');
  $('#celebration').classList.remove('hidden');
}

function showView(id){
  if(['career','stats','market'].includes(id)&&!state.created)id='create';$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));window.scrollTo({top:0,behavior:'smooth'});render();
}
function competitionStatus(){
  const s=state.season;const items=[];const l=s.league;items.push({type:'league',title:l.name,status:`Rodada ${Math.min(l.index+1,l.schedule.length)}/${l.schedule.length} · ${l.points} pts${l.finished&&l.position?` · ${l.position}º`:''}`});
  const cup=s.cup;items.push({type:'cup',title:cup.name,status:cup.won?'Campeão':cup.eliminated?'Eliminado':`${cup.stages[cup.stageIndex]?.name||'Finalizado'}${cup.stages[cup.stageIndex]?.legs>1?` · jogo ${cup.leg}/${cup.stages[cup.stageIndex].legs}`:''}`});
  if(s.continental){const c=s.continental;let status=c.won?'Campeão':c.eliminated?'Eliminado':c.phase==='phase'?`${c.format.phase} · ${c.phaseIndex}/${c.phaseSchedule.length} · ${c.points} pts`:`${c.knockout.stages[c.knockout.stageIndex]?.name||'Mata-mata'} · jogo ${c.knockout.leg}/${c.knockout.stages[c.knockout.stageIndex]?.legs||1}`;items.push({type:'continental',title:c.name,status});}
  return items;
}
function render(){
  if(!state.created){$('#mini-profile').classList.add('hidden');$('#reset-career').classList.add('hidden');applyClubTheme(null);return;}
  const p=state.player,s=state.season;applyClubTheme(p.club);$('#mini-profile').classList.remove('hidden');$('#reset-career').classList.remove('hidden');$('#mini-profile').textContent=`${p.name} · ${p.overall}`;
  $('#p-name').textContent=p.name;$('#p-pos').textContent=p.position;$('#p-age').textContent=p.age;$('#p-country').textContent=p.nationality;$('#p-birthdate').textContent=formatDateBR(p.birthdate);$('#p-overall').textContent=p.overall;$('#p-potential').textContent=p.potential;$('#p-club').textContent=p.club;$('#p-league').textContent=s?.league?.name||getCompetitionRule(p.clubCountry,p.clubCountryName).league;$('#p-value').textContent=money(p.value);$('#avatar').textContent=p.number;
  hydrateBadge($('#p-club-badge'),p.club,$('#p-club-fallback'));
  $('#retired-banner').classList.toggle('hidden',!p.retired);if(p.retired)$('#retired-text').textContent=` ${p.name} se aposentou aos ${p.age} anos.`;
  if(s){
    $('#season-year').textContent=s.year;$('#s-games').textContent=s.totalGames;$('#s-goals').textContent=s.goals;$('#s-assists').textContent=s.assists;$('#s-rating').textContent=s.totalGames?(s.ratingSum/s.totalGames).toFixed(1):'-';
    $('#league-round-label').textContent=`${s.league.name}: ${s.league.index}/${s.league.schedule.length} jogos`;$('#league-points').textContent=`${s.league.points} pts`;$('#league-progress-bar').style.width=`${Math.round(s.league.index/s.league.schedule.length*100)}%`;
    $('#season-progress').textContent=s.closed?'Temporada encerrada':seasonComplete()?'Calendário concluído':'Pronta para simular';
    $('#finish-season').disabled=!s.closed||p.retired;$('#finish-season').textContent=s.closed?'Avançar para próxima temporada →':'Simule a temporada primeiro';
    nextEventCache=!s.closed?chooseNextEvent():null;
    if(nextEventCache){
      const fav=favoritismForEvent(nextEventCache);
      $('#home-team').textContent=nextEventCache.home;$('#away-team').textContent=nextEventCache.away;$('#match-title').textContent=`${nextEventCache.home} x ${nextEventCache.away}`;$('#match-competition').textContent=nextEventCache.competition;$('#match-context').textContent=nextEventCache.type==='league'?`Primeira prévia · rodada ${nextEventCache.round} de ${s.league.schedule.length}`:nextEventCache.stage||`Temporada ${s.year}`;
      $('#favorite-line').innerHTML=`Favorito: <strong>${fav.favorite}</strong> (${fav.favoritePct}%) · casa +${fav.homeAdvantage} de força`;
      $('#strength-line').textContent=`Forças efetivas: ${nextEventCache.home} ${fav.effectiveHome.toFixed(0)} × ${nextEventCache.away} ${fav.awayStrength.toFixed(0)}`;
      $('#simulate-btn').disabled=p.retired;$('#simulate-btn').textContent='Simular temporada →';
    }else{
      $('#match-title').textContent=s.closed?'Mercado aberto':'Temporada pronta para ser encerrada';$('#home-team').textContent='';$('#away-team').textContent='';$('#match-competition').textContent='';$('#match-context').textContent=s.closed?'Veja as propostas e depois avance para a próxima temporada.':'';$('#favorite-line').textContent='';$('#strength-line').textContent='';$('#simulate-btn').disabled=true;$('#simulate-btn').textContent=s.closed?'Temporada simulada':'Sem partidas pendentes';
    }
    $('#competitions-list').innerHTML=competitionStatus().map(c=>`<div class="competition-item ${c.type==='continental'?'international':''}"><strong>${c.type==='league'?'🏆':c.type==='cup'?'🥇':'🌍'} ${c.title}</strong><small>${c.status}</small></div>`).join('');
  }else{
    $('#season-year').textContent='—';$('#s-games').textContent='0';$('#s-goals').textContent='0';$('#s-assists').textContent='0';$('#s-rating').textContent='—';$('#league-round-label').textContent='Carreira encerrada';$('#league-points').textContent='';$('#league-progress-bar').style.width='100%';$('#season-progress').textContent='Aposentado';$('#finish-season').disabled=true;$('#finish-season').textContent='Carreira encerrada';$('#competitions-list').innerHTML='<div class="competition-item"><strong>👟 Carreira concluída</strong><small>Veja o histórico completo na aba Estatísticas.</small></div>';$('#match-title').textContent='Carreira encerrada';$('#home-team').textContent='';$('#away-team').textContent='';$('#match-competition').textContent='';$('#match-context').textContent='';$('#favorite-line').textContent='';$('#strength-line').textContent='';$('#simulate-btn').disabled=true;$('#simulate-btn').textContent='Aposentado';
  }
  $('#national-country').textContent=`Seleção de ${p.nationality}`;$('#national-flag').textContent=countryFlag(p.nationalityCode);$('#national-status').textContent=p.calledUp?'Convocado':'Ainda não convocado';$('#national-message').textContent=p.calledUp?'Partidas internacionais entram na simulação da temporada.':'Overall e desempenho aumentam as chances de convocação.';$('#nt-games').textContent=p.nationalTeamGames;$('#nt-goals').textContent=p.nationalTeamGoals;
  $('#news').innerHTML=(state.news.slice(-6).reverse().map(n=>`<div class="news-item"><strong>${n}</strong><small>CareerSim News</small></div>`).join('')||'<p class="muted">Nenhuma notícia ainda.</p>');
  renderHistory();renderOffers();renderHonours();renderMarketTier();if(state.pendingEvent)openPendingEvent();
}
function renderHistory(){
  if(!state.created)return;const current=state.season&&!state.season.closed?state.season:{clubGames:0,clubGoals:0,clubAssists:0};const totals=state.history.reduce((a,h)=>({games:a.games+h.games,goals:a.goals+h.goals,assists:a.assists+h.assists}),{games:current.clubGames||0,goals:current.clubGoals||0,assists:current.clubAssists||0});
  $('#career-games').textContent=totals.games;$('#career-goals').textContent=totals.goals;$('#career-assists').textContent=totals.assists;$('#career-titles').textContent=state.player.titles||0;
  $('#history-body').innerHTML=state.history.length?state.history.slice().reverse().map(h=>`<tr><td>${h.year}</td><td>${h.club}</td><td>${h.overall}</td><td>${h.games}</td><td>${h.goals}</td><td>${h.assists}</td><td>${h.rating}</td><td>${h.leaguePosition?`${h.leaguePosition}º`: '-'}</td></tr>`).join(''):'<tr><td colspan="8" class="muted">Conclua sua primeira temporada para criar o histórico.</td></tr>';
}
function renderHonours(){
  if(!state.created)return;const p=state.player;$('#trophies-list').innerHTML=p.trophies?.length?p.trophies.slice().reverse().map(t=>`<div><span>🏆 ${t.name}</span><strong>${t.year}</strong></div>`).join(''):'<p class="muted">Nenhum título ainda.</p>';$('#awards-list').innerHTML=p.awards?.length?p.awards.slice().reverse().map(a=>`<div><span>⭐ ${a.name}</span><strong>${a.year}</strong></div>`).join(''):'<p class="muted">Nenhum prêmio individual ainda.</p>';
}
function renderMarketTier(){
  if(!state.created)return;const o=state.player.overall;let text='Clubes nacionais e mercados menores acompanham você.';if(o>=90)text='Elite mundial liberada: clubes como Bayern, Barcelona e Real Madrid podem aparecer.';else if(o>=85)text='Grandes clubes europeus liberados: Chelsea, Arsenal e outros podem fazer propostas.';else if(o>=75)text='Mercado europeu em expansão: Benfica, Porto e clubes semelhantes podem aparecer.';$('#market-tier').innerHTML=`<strong>Faixa atual: GER ${o}</strong><p>${text}</p>`;
}
function renderOffers(){
  if(!state.created)return;const box=$('#offers');box.innerHTML=state.offers.length?state.offers.map((o,i)=>`<article class="panel offer" data-club-name="${o.club.replace(/"/g,'&quot;')}"><div class="offer-main"><span class="crest-shell"><img class="club-badge-img hidden" alt=""><span class="crest-fallback">⚽</span></span><div><p class="eyebrow">${o.countryName} · ${o.league}</p><h3>${o.club}</h3><p>Oferta estimada: <strong>${money(o.value)}</strong> · Força: ${o.strength}</p></div></div><div class="offer-actions"><button class="primary" onclick="acceptOffer(${i})">Aceitar</button><button class="danger" onclick="rejectOffer(${i})">Recusar</button></div></article>`).join(''):'<article class="panel"><h3>Nenhuma proposta no momento</h3><p class="muted">Conclua temporadas e aumente seu overall. Os clubes disponíveis mudam conforme seu nível.</p></article>';hydrateRenderedBadges();
}

$$('[data-view]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showView(el.dataset.view);}));
$('#start-btn').addEventListener('click',()=>showView(state.created?'career':'create'));
$('#nationality').addEventListener('change',loadClubChoices);
$('#reroll-clubs').addEventListener('click',()=>{$('#selected-club').value='';$('#create-submit').disabled=true;drawThreeClubs();});
$('#number').addEventListener('input',sanitizeShirtNumber);
$('#number').addEventListener('blur',()=>{sanitizeShirtNumber();if(!$('#number').value)$('#number').value='10';});
$('#close-result').addEventListener('click',()=>$('#match-result').classList.add('hidden'));
$('#close-celebration').addEventListener('click',()=>$('#celebration').classList.add('hidden'));

$('#player-form').addEventListener('submit',e=>{
  e.preventDefault();sanitizeShirtNumber();const number=Number($('#number').value);if(!Number.isInteger(number)||number<1||number>99){toast('O número da camiseta deve ser de 1 a 99.');return;}
  const birthdate=$('#birthdate').value,age=calculateAge(birthdate);if(age<=16||age>=23){toast('A idade inicial precisa ser de 17 a 22 anos.');return;}
  const code=$('#nationality').value,country=countryByCode(code),selected=creationChoices.find(c=>c.name===$('#selected-club').value);if(!selected){toast('Escolha um dos três clubes sorteados.');return;}
  const initialPotential=clamp(rnd(82,91)+(22-age),84,95);const player={name:$('#name').value.trim(),birthdate,age,nationality:country.name,nationalityCode:code,position:$('#position').value,foot:$('#foot').value,club:selected.name,clubCountry:code,clubCountryName:country.name,clubStrength:selected.strength,number,overall:67,potential:initialPotential,value:900000,titles:0,trophies:[],awards:[],calledUp:false,nationalTeamGames:0,nationalTeamGoals:0,morale:70,reputation:10,developmentBoost:0,marketBonus:0,retired:false};
  state={created:true,player,season:null,history:[],offers:[],news:[`${player.name}, ${age} anos, assina seu primeiro contrato profissional com o ${selected.name}.`],pendingEvent:null};state.season=createSeason(player,START_YEAR,undefined);save();showView('career');toast('Carreira iniciada!');
});

function showSeasonSpotlight(log){
  if(!log)return;
  const moments=generateMatchMoments(log);const fav=log.model;
  $('#spotlight-competition').textContent=`${log.event.competition}${log.event.stage?` · ${log.event.stage}`:''}`;
  $('#spotlight-title').textContent=`${log.event.home} ${log.homeGoals} × ${log.awayGoals} ${log.event.away}`;
  $('#spotlight-favorite').textContent=`Pré-jogo: ${log.event.home} ${Math.round(fav.homeWin*100)}% · empate ${Math.round(fav.draw*100)}% · ${log.event.away} ${Math.round(fav.awayWin*100)}%`;
  $('#spotlight-moments').innerHTML=moments.map(m=>`<div class="timeline-moment"><span>${m.minute}'</span><p>${m.text}</p></div>`).join('');
  $('#spotlight-stats').innerHTML=`<div><strong>${log.perf.rating.toFixed(1)}</strong><small>Nota</small></div><div><strong>${log.perf.goals}</strong><small>Gols</small></div><div><strong>${log.perf.assists}</strong><small>Assist.</small></div><div><strong>${log.perf.extraValue}</strong><small>${log.perf.extraLabel}</small></div>`;
  $('#season-spotlight').classList.remove('hidden');
}
function legacyV4_processSeasonEnd(){
  const p=state.player,s=state.season;if(!s||s.endProcessed)return;
  const avg=s.totalGames?s.ratingSum/s.totalGames:6.5;
  evaluateAwards(avg);updateSelectionAtSeasonEnd(avg);const delta=developmentResult(avg);
  state.history.push({year:s.year,club:s.clubAtStart||p.club,overall:p.overall,games:s.clubGames,goals:s.clubGoals,assists:s.clubAssists,rating:avg.toFixed(1),leaguePosition:s.league.position,competitions:competitionStatus().map(c=>c.title)});
  p.value=Math.max(150000,Math.round(p.value*(1+delta*.11)));p.age++;
  state.news.push(`${p.name} encerra ${s.year} com média ${avg.toFixed(1)}. GER ${p.overall} (${delta>=0?'+':''}${delta}) e POT ${p.potential}.`);
  generateOffers(avg);s.endProcessed=true;s.closed=true;s.endAverage=avg;s.developmentDelta=delta;
  if(p.age>=46){p.retired=true;p.age=46;state.news.push(`${p.name} encerra oficialmente a carreira aos 46 anos.`);state.offers=[];}
}
function legacyV4_simulateWholeSeason(){
  const p=state.player,s=state.season;if(!s||s.closed||p.retired)return;
  const trophyCount=p.trophies?.length||0,awardCount=p.awards?.length||0;
  state.simulatingSeason=true;const logs=[];let safety=0;
  while(!seasonComplete()&&safety<140){
    const event=chooseNextEvent();if(!event)break;
    const log=simulateMatchCore(event);logs.push(log);safety++;
  }
  if(safety>=140){state.simulatingSeason=false;toast('A simulação atingiu o limite de segurança do calendário.');save();render();return;}
  const featured=logs.sort((a,b)=>matchImportance(b)-matchImportance(a))[0]||null;s.featuredMatch=featured?{competition:featured.event.competition}:null;
  processSeasonEnd();
  const newTitles=(p.trophies||[]).slice(trophyCount).map(t=>t.name);const newAwards=(p.awards||[]).slice(awardCount).map(a=>a.name);
  pendingSeasonCelebration={titles:newTitles,awards:newAwards};state.simulatingSeason=false;nextEventCache=null;save();render();showSeasonSpotlight(featured);
  toast(`${state.offers.length} proposta(s) chegaram ao fim da temporada.`);
}
function showPendingSeasonCelebration(){
  const c=pendingSeasonCelebration;pendingSeasonCelebration=null;if(!c)return;
  const parts=[];if(c.titles.length)parts.push(`Títulos: ${c.titles.join(', ')}`);if(c.awards.length)parts.push(`Prêmios: ${c.awards.join(', ')}`);
  if(parts.length)showCelebration(c.titles.length?'🏆':'⭐',c.titles.length?'Temporada de conquistas':'Prêmios da temporada',parts.join(' · '));
}

$('#simulate-btn').addEventListener('click',simulateWholeSeason);
$('#close-spotlight').addEventListener('click',()=>{$('#season-spotlight').classList.add('hidden');showPendingSeasonCelebration();});

$('#finish-season').addEventListener('click',()=>{
  const p=state.player,s=state.season;if(!s||!s.closed||p.retired)return;
  const oldDelta=s.developmentDelta||0;const stayed=p.club===(s.clubAtStart||p.club);
  const earned=stayed?continentalFromLeagueResult(s.countryAtStart||p.clubCountry,s.league.position):qualificationForClub(p.clubCountry,p.clubStrength);
  const nextYear=s.year+1;state.offers=[];state.season=createSeason(p,nextYear,earned);nextEventCache=null;
  if(p.age>=30&&oldDelta<0)state.news.push(`A idade começa a pesar: ${p.name} perdeu ${Math.abs(oldDelta)} ponto(s) de overall na última temporada.`);
  if(Math.random()<.55){const event=CAREER_EVENTS[rnd(0,CAREER_EVENTS.length-1)];state.pendingEvent={...event};}
  save();render();toast(`Temporada ${nextYear} iniciada. GER ${p.overall} · POT ${p.potential}`);
});

window.acceptOffer=index=>{
  const o=state.offers[index],p=state.player;if(!o||p.retired)return;const old=p.club;p.club=o.club;p.clubCountry=o.countryCode;p.clubCountryName=o.countryName;p.clubStrength=o.strength;p.value=o.value;p.morale=clamp(p.morale+5,40,100);state.news.push(`${p.name} deixa o ${old} e é anunciado pelo ${o.club}.`);state.offers=[];applyClubTheme(p.club);save();render();showCelebration('✍️',`Novo clube: ${o.club}`,`${p.name} inicia um novo capítulo da carreira.`);
};
window.rejectOffer=index=>{state.offers.splice(index,1);save();render();toast('Proposta recusada.');};

$('#reset-career').addEventListener('click',()=>{
  if(!confirm('Apagar a carreira atual e começar novamente?'))return;localStorage.removeItem(STORAGE_KEY);state={created:false,player:null,season:null,history:[],offers:[],news:[],pendingEvent:null};nextEventCache=null;applyClubTheme(null);showView('home');toast('Carreira apagada.');
});



/* ===== CareerSim V5: temporada interativa, classificação e mercado garantido ===== */
function leagueTableRow(team, code, format){
  const strength=clubStrength(team,code);const games=format.matches;
  let points=clamp(Math.round(games*(1.13+(strength-70)*.039)+rnd(-7,7)),Math.round(games*.55),Math.round(games*2.38));
  let draws=clamp(rnd(5,11),0,games);while(draws%3!==points%3&&draws<games)draws++;
  let wins=Math.floor((points-draws)/3);if(wins<0){wins=0;draws=points;}while(wins+draws>games&&draws>=3){draws-=3;wins++;}
  const losses=Math.max(0,games-wins-draws);points=wins*3+draws;
  const gf=clamp(Math.round(games*(1.05+(strength-68)*.035))+rnd(-7,8),18,100);const ga=clamp(Math.round(games*(1.18-(strength-68)*.018))+rnd(-6,8),16,90);
  return {team,games,wins,draws,losses,gf,ga,gd:gf-ga,points,strength};
}
function finalizeLeague(){
  const l=state.season.league;if(l.finished)return;l.finished=true;const p=state.player;
  const teams=leaguePoolForCountry(state.season.countryAtStart||p.clubCountry,state.season.clubAtStart||p.club);
  const rows=teams.filter(t=>t!==(state.season.clubAtStart||p.club)).map(t=>leagueTableRow(t,state.season.countryAtStart||p.clubCountry,l.format));
  rows.push({team:state.season.clubAtStart||p.club,games:l.schedule.length,wins:l.wins,draws:l.draws,losses:l.losses,gf:l.gf,ga:l.ga,gd:l.gf-l.ga,points:l.points,strength:playerClubStrength(),user:true});
  rows.sort((a,b)=>b.points-a.points||b.gd-a.gd||b.gf-a.gf||b.strength-a.strength);
  l.standings=rows.map((r,i)=>({...r,position:i+1}));l.position=l.standings.find(r=>r.user)?.position||1;
  if(l.position===1)addTrophy(l.name);state.news.push(`${state.season.clubAtStart||p.club} encerrou ${l.name} na ${l.position}ª posição, com ${l.points} pontos.`);
}
function developmentResult(avg){
  const p=state.player,age=p.age,gk=p.position==='Goleiro',devAge=gk?age-3:age;let base=0;
  if(devAge<=20)base=avg>=8?4:avg>=7.4?3:avg>=6.8?2:avg>=6.3?1:0;
  else if(devAge<=24)base=avg>=8?3:avg>=7.3?2:avg>=6.8?1:0;
  else if(devAge<=28)base=avg>=7.8?2:avg>=7?1:avg<6.4?-1:0;
  else if(devAge<=31)base=avg>=7.8?1:avg<6.6?-1:0;
  else if(devAge<=34)base=avg>=7.6?0:-rnd(1,2);
  else if(devAge<=38)base=-rnd(1,3);else if(devAge<=41)base=-rnd(2,4);else base=-rnd(3,5);
  if(base>0&&age<=20)base=Math.ceil(base*1.25);else if(base>0&&age<=22)base=Math.ceil(base*1.20);
  base+=(p.developmentBoost||0);p.developmentBoost=0;
  if(age<=22&&avg>=7.5)p.potential=clamp(p.potential+(avg>=8?2:1),p.overall,97);
  else if(age<=24&&avg>=7.7)p.potential=clamp(p.potential+1,p.overall,97);
  else if(age<=24&&avg<6.3)p.potential=Math.max(p.overall,p.potential-1);
  else if(age>=30)p.potential=Math.max(p.overall,p.potential-1);
  const before=p.overall;if(base>0)p.overall=Math.min(p.potential,p.overall+base);else p.overall=clamp(p.overall+base,45,97);
  if(age>=32)p.potential=Math.max(p.overall,p.potential);return p.overall-before;
}
function generateOffers(avg){
  const p=state.player;let all=allTransferClubs().filter(c=>c.name!==p.club);
  const eligible=all.filter(c=>!c.minOverall||p.overall>=c.minOverall);
  const ceiling=p.overall<72?76:p.overall<75?80:p.overall<80?86:p.overall<85?89:p.overall<90?92:99;
  let realistic=eligible.filter(c=>(c.strength||72)<=ceiling);
  if(!realistic.length)realistic=eligible.length?eligible:all;
  const thresholdNames=[];if(p.overall>=75)thresholdNames.push('Benfica');if(p.overall>=85)thresholdNames.push('Chelsea');if(p.overall>=90)thresholdNames.push('Bayern de Munique');
  const threshold=thresholdNames.map(name=>all.find(c=>c.name===name)).filter(Boolean);
  const ranked=[...realistic].sort((a,b)=>Math.abs((a.strength||72)-(p.overall+3))-Math.abs((b.strength||72)-(p.overall+3)));
  const performanceCount=avg>=7.8?4:avg>=7.0?3:2;const count=clamp(performanceCount+(p.marketBonus||0),2,4);p.marketBonus=0;
  let chosen=[];if(threshold.length&&avg>=6.8)chosen.push(sample(threshold,1)[0]);
  const candidatePool=sample(ranked.slice(0,Math.min(18,ranked.length)),Math.max(count*3,8));
  for(const c of candidatePool){if(chosen.length>=count)break;if(c&&!chosen.some(x=>x.name===c.name&&x.countryCode===c.countryCode))chosen.push(c);}
  for(const c of ranked){if(chosen.length>=count)break;if(!chosen.some(x=>x.name===c.name&&x.countryCode===c.countryCode))chosen.push(c);}
  if(chosen.length<2){for(const c of all){if(chosen.length>=2)break;if(!chosen.some(x=>x.name===c.name&&x.countryCode===c.countryCode))chosen.push(c);}}
  state.offers=chosen.slice(0,count).map(c=>({club:c.name,countryCode:c.countryCode,countryName:countryByCode(c.countryCode)?.name||c.countryCode,league:getCompetitionRule(c.countryCode,countryByCode(c.countryCode)?.name||'').league,strength:c.strength||clubStrength(c.name,c.countryCode),minOverall:c.minOverall||null,value:Math.round(p.value*(1.08+Math.random()*.72))}));
  state.news.push(`${p.name} recebeu ${state.offers.length} proposta(s) ao fim da temporada.`);
}
function cupFinalStatus(comp){
  if(!comp)return 'Não disputou';if(comp.won)return 'Campeão';if(comp.eliminated)return `Eliminado — ${comp.stages[comp.stageIndex]?.name||'mata-mata'}`;return comp.active?`${comp.stages[comp.stageIndex]?.name||'Em andamento'}`:'Encerrado';
}
function continentalFinalStatus(c){
  if(!c)return 'Não disputou';if(c.won)return 'Campeão';if(c.eliminated)return c.phase==='phase'?`Eliminado — ${c.format.phase}`:`Eliminado — ${c.knockout.stages[c.knockout.stageIndex]?.name||'mata-mata'}`;return c.phase==='phase'?`${c.format.phase} — ${c.points} pts`:`${c.knockout.stages[c.knockout.stageIndex]?.name||'Mata-mata'}`;
}
function buildDecisionScenario(event){
  const p=state.player,att=['Centroavante','Segundo atacante','Ponta direita','Ponta esquerda','Meia ofensivo'].includes(p.position),mid=['Meia central','Meia direita','Meia esquerda','Volante'].includes(p.position),def=['Zagueiro','Lateral direito','Lateral esquerdo'].includes(p.position);
  const minute=rnd(24,82),quality=clamp((p.overall-67)*.008,0,.20);
  if(p.position==='Goleiro')return {minute,title:'Cara a cara',description:`${event.opponent} escapa em velocidade e fica frente a frente com você. O que fazer?`,options:[{label:'Sair do gol',effect:'Agressivo: corta o ângulo, mas há risco.',type:'defense',chance:.58+quality,rating:.55,risk:.18},{label:'Esperar a finalização',effect:'Mais seguro, depende dos reflexos.',type:'defense',chance:.66+quality,rating:.45,risk:.10},{label:'Fechar o canto curto',effect:'Boa leitura, mas abre o outro lado.',type:'defense',chance:.61+quality,rating:.50,risk:.14}]};
  if(def)return {minute,title:'Ataque perigoso',description:`O adversário avança perto da área. Você precisa decidir rapidamente.`,options:[{label:'Dar o bote',effect:'Pode recuperar a bola ou ser driblado.',type:'defense',chance:.60+quality,rating:.50,risk:.18},{label:'Cercar e atrasar a jogada',effect:'Menos risco, força uma decisão do atacante.',type:'defense',chance:.70+quality,rating:.38,risk:.08},{label:'Antecipar o passe',effect:'Leitura difícil, recompensa alta.',type:'defense',chance:.53+quality,rating:.65,risk:.22}]};
  if(att&&Math.random()<.5)return {minute,title:'Pênalti para sua equipe',description:`Aos ${minute}', você pega a bola. Como vai cobrar?`,options:[{label:'Bater forte no canto',effect:'Boa chance de gol.',type:'goal',chance:.68+quality,rating:.62},{label:'Deslocar o goleiro',effect:'Mais técnico e mais arriscado.',type:'goal',chance:.62+quality,rating:.72},{label:'Cavadinha',effect:'Alto risco, grande destaque se entrar.',type:'goal',chance:.48+quality,rating:.90}]};
  if(att)return {minute,title:'Chance clara de gol',description:`Você recebe dentro da área com um defensor chegando.`,options:[{label:'Finalizar de primeira',effect:'Rápido e objetivo.',type:'goal',chance:.55+quality,rating:.58},{label:'Driblar o goleiro',effect:'Mais arriscado, mas abre o gol.',type:'goal',chance:.47+quality,rating:.78},{label:'Tocar para o companheiro',effect:'Busca uma assistência em vez da finalização.',type:'assist',chance:.64+quality,rating:.58}]};
  if(mid)return {minute,title:'Contra-ataque',description:`Você conduz pelo meio com opções na frente.`,options:[{label:'Passe em profundidade',effect:'Pode deixar um companheiro na cara do gol.',type:'assist',chance:.62+quality,rating:.62},{label:'Carregar e finalizar',effect:'Você assume a responsabilidade.',type:'goal',chance:.38+quality,rating:.72},{label:'Abrir na ponta',effect:'Opção segura para manter o ataque.',type:'assist',chance:.55+quality,rating:.44}]};
  return {minute,title:'Momento decisivo',description:'A bola sobra para você perto da área.',options:[{label:'Finalizar',effect:'Tentar decidir a partida.',type:'goal',chance:.42+quality,rating:.55},{label:'Passar',effect:'Criar para um companheiro.',type:'assist',chance:.55+quality,rating:.48},{label:'Manter a posse',effect:'Evitar o risco e reorganizar o time.',type:'control',chance:.78+quality,rating:.25}]};
}
function ensureDecisionPlan(){
  const s=state.season;if(s.decisionTargets?.length)return;const base=s.league.schedule.length;s.decisionTargets=[.14,.31,.49,.67,.85].map(x=>Math.max(2,Math.round(base*x)));s.decisionIndex=s.decisionIndex||0;s.decisionLogs=s.decisionLogs||[];s.startTrophyCount=state.player.trophies?.length||0;s.startAwardCount=state.player.awards?.length||0;
}
function openMatchDecision(event){
  const scenario=buildDecisionScenario(event);state.pendingMatchDecision={event,scenario};save();
  const fav=favoritismForEvent(event);$('#decision-competition').textContent=`${event.competition}${event.stage?` · ${event.stage}`:''}`;$('#decision-title').textContent=`${scenario.minute}' · ${scenario.title}`;$('#decision-match').textContent=`${event.home} x ${event.away} · favorito: ${fav.favorite} (${fav.favoritePct}%)`;$('#decision-description').textContent=scenario.description;
  $('#decision-choices').innerHTML=scenario.options.map((o,i)=>`<button class="event-choice decision-option" data-decision-option="${i}"><strong>${o.label}</strong><small>${o.effect}</small></button>`).join('');$('#decision-result').classList.add('hidden');$('#decision-continue').classList.add('hidden');$('#decision-choices').classList.remove('hidden');
  $$('.decision-option').forEach(b=>b.addEventListener('click',()=>resolveMatchDecision(+b.dataset.decisionOption)));$('#match-decision-modal').classList.remove('hidden');
}
function simulateInteractiveMatch(event,option){
  const p=state.player,s=state.season,playerIsHome=event.type==='national'?event.home===p.nationality:event.home===p.club;const score=simulateScore(event);let teamGoals=playerIsHome?score.homeGoals:score.awayGoals,oppGoals=playerIsHome?score.awayGoals:score.homeGoals;
  let perf=simulatePlayerPerformance(teamGoals,oppGoals);const success=Math.random()<clamp(option.chance,.12,.94);let outcome='A decisão não funciona como você esperava.';
  if(success&&option.type==='goal'){teamGoals++;perf.goals++;perf.rating+=option.rating||.5;outcome='Você executa a escolha perfeitamente e marca!';}
  else if(success&&option.type==='assist'){teamGoals++;perf.assists++;perf.rating+=option.rating||.45;outcome='Sua decisão cria o gol e você registra a assistência!';}
  else if(success&&option.type==='defense'){if(oppGoals>0)oppGoals--;perf.rating+=option.rating||.45;outcome='Leitura perfeita: você neutraliza uma chance clara do adversário.';}
  else if(success&&option.type==='control'){perf.rating+=option.rating||.2;outcome='Você mantém a posse e ajuda sua equipe a controlar o momento.';}
  else {perf.rating-=.28;if(option.type==='defense'&&Math.random()<(option.risk||.12)){oppGoals++;outcome='A tentativa falha e o adversário aproveita para marcar.';}}
  perf.goals=Math.min(perf.goals,teamGoals);perf.assists=Math.min(perf.assists,Math.max(0,teamGoals-perf.goals));perf.rating=clamp(perf.rating,5,10);
  const homeGoals=playerIsHome?teamGoals:oppGoals,awayGoals=playerIsHome?oppGoals:teamGoals;s.totalGames++;s.goals+=perf.goals;s.assists+=perf.assists;s.ratingSum+=perf.rating;
  if(event.type!=='national'){s.clubGames++;s.clubGoals+=perf.goals;s.clubAssists+=perf.assists;p.value=Math.max(200000,Math.round(p.value*(1+(perf.rating-6.5)/260)));}else{p.nationalTeamGames++;p.nationalTeamGoals+=perf.goals;}
  processCompetitionResult(event,teamGoals,oppGoals);if(perf.rating>=8)state.news.push(`${p.name} foi destaque em ${event.competition}, com nota ${perf.rating.toFixed(1)}.`);
  return {event,playerIsHome,teamGoals,oppGoals,homeGoals,awayGoals,perf,model:score.model,outcome,success};
}
function resolveMatchDecision(index){
  const pending=state.pendingMatchDecision;if(!pending)return;const option=pending.scenario.options[index];const log=simulateInteractiveMatch(pending.event,option);const s=state.season;s.decisionLogs=s.decisionLogs||[];s.decisionLogs.push({competition:log.event.competition,match:`${log.event.home} ${log.homeGoals} x ${log.awayGoals} ${log.event.away}`,choice:option.label,outcome:log.outcome,rating:log.perf.rating.toFixed(1)});s.decisionIndex=(s.decisionIndex||0)+1;state.pendingMatchDecision=null;save();render();
  $('#decision-choices').classList.add('hidden');$('#decision-result').classList.remove('hidden');$('#decision-result').innerHTML=`<strong>${log.outcome}</strong><span>Placar: ${log.event.home} ${log.homeGoals} × ${log.awayGoals} ${log.event.away}</span><span>Sua nota: ${log.perf.rating.toFixed(1)} · ${log.perf.goals} gol(s) · ${log.perf.assists} assistência(s)</span>`;$('#decision-continue').classList.remove('hidden');
}
function processSeasonEnd(){
  const p=state.player,s=state.season;if(!s||s.endProcessed)return;const avg=s.totalGames?s.ratingSum/s.totalGames:6.5;evaluateAwards(avg);updateSelectionAtSeasonEnd(avg);const delta=developmentResult(avg);
  const cupStatus=cupFinalStatus(s.cup),continentalStatus=s.continental?continentalFinalStatus(s.continental):'Não disputou';state.history.push({year:s.year,club:s.clubAtStart||p.club,overall:p.overall,games:s.clubGames,goals:s.clubGoals,assists:s.clubAssists,rating:avg.toFixed(1),leaguePosition:s.league.position,cupStatus,continentalStatus,competitions:competitionStatus().map(c=>c.title)});
  p.value=Math.max(150000,Math.round(p.value*(1+delta*.11)));p.age++;state.news.push(`${p.name} encerra ${s.year} com média ${avg.toFixed(1)}. GER ${p.overall} (${delta>=0?'+':''}${delta}) e POT ${p.potential}.`);generateOffers(avg);s.endProcessed=true;s.closed=true;s.endAverage=avg;s.developmentDelta=delta;s.finalCupStatus=cupStatus;s.finalContinentalStatus=continentalStatus;
  if(p.age>=46){p.retired=true;p.age=46;state.news.push(`${p.name} encerra oficialmente a carreira aos 46 anos.`);state.offers=[];}
}
function continueSeasonSimulation(){
  const p=state.player,s=state.season;if(!s||s.closed||p.retired||state.pendingMatchDecision)return;ensureDecisionPlan();state.simulatingSeason=true;let safety=0;
  while(!seasonComplete()&&safety<160){const event=chooseNextEvent();if(!event)break;const target=s.decisionTargets[s.decisionIndex];if(event.type!=='national'&&target!==undefined&&s.clubGames+1>=target){openMatchDecision(event);save();render();return;}simulateMatchCore(event);safety++;}
  if(safety>=160){state.simulatingSeason=false;toast('A simulação atingiu o limite de segurança do calendário.');save();render();return;}
  processSeasonEnd();const newTitles=(p.trophies||[]).slice(s.startTrophyCount||0).map(t=>t.name);const newAwards=(p.awards||[]).slice(s.startAwardCount||0).map(a=>a.name);pendingSeasonCelebration={titles:newTitles,awards:newAwards};state.simulatingSeason=false;nextEventCache=null;save();render();showSeasonSummary();toast(`${state.offers.length} proposta(s) chegaram ao fim da temporada.`);
}
function simulateWholeSeason(){
  const s=state.season,p=state.player;if(!s||s.closed||p.retired)return;ensureDecisionPlan();continueSeasonSimulation();
}
function showSeasonSummary(){
  const s=state.season,p=state.player;if(!s||!s.closed)return;$('#summary-year').textContent=`TEMPORADA ${s.year}`;$('#summary-title').textContent=`${s.league.position}º lugar em ${s.league.name}`;$('#summary-subtitle').textContent=`${s.league.points} pontos · ${s.league.wins}V ${s.league.draws}E ${s.league.losses}D · ${state.offers.length} proposta(s) recebida(s)`;
  const standings=s.league.standings||[];$('#summary-standings').innerHTML=standings.map(r=>`<tr class="${r.user?'user-row':''}"><td>${r.position}</td><td>${r.team}</td><td>${r.games}</td><td>${r.wins}</td><td>${r.draws}</td><td>${r.losses}</td><td>${r.gd>0?'+':''}${r.gd}</td><td><strong>${r.points}</strong></td></tr>`).join('');
  const cupItems=[{name:s.cup.name,status:s.finalCupStatus||cupFinalStatus(s.cup)}];if(s.continental)cupItems.push({name:s.continental.name,status:s.finalContinentalStatus||continentalFinalStatus(s.continental)});$('#summary-cups').innerHTML=cupItems.map(x=>`<div class="summary-status"><strong>${x.name}</strong><span>${x.status}</span></div>`).join('');
  $('#summary-decisions').innerHTML=(s.decisionLogs||[]).map((d,i)=>`<div><strong>${i+1}. ${d.match}</strong><span>${d.choice} · ${d.outcome}</span></div>`).join('');$('#summary-offers').innerHTML=state.offers.length?state.offers.map(o=>`<div class="summary-offer"><strong>${o.club}</strong><span>${o.countryName} · Força ${o.strength} · ${money(o.value)}</span></div>`).join(''):'<p class="muted">Nenhuma proposta devido à aposentadoria.</p>';$('#season-summary-modal').classList.remove('hidden');
}
$('#decision-continue').addEventListener('click',()=>{$('#match-decision-modal').classList.add('hidden');continueSeasonSimulation();});
$('#summary-market').addEventListener('click',()=>{$('#season-summary-modal').classList.add('hidden');showView('market');showPendingSeasonCelebration();});
$('#summary-close').addEventListener('click',()=>{$('#season-summary-modal').classList.add('hidden');showPendingSeasonCelebration();});

populateCreationFields();setupBirthdateLimits();render();if(state.pendingEvent)openPendingEvent();