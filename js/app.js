const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const STORAGE_KEY = 'careerSimV3';
const BADGE_KEY = 'careerSimBadgeCacheV3';

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  created:false, player:null, season:null, history:[], offers:[], news:[], pendingEvent:null
};
let badgeCache = JSON.parse(localStorage.getItem(BADGE_KEY) || '{}');
let creationClubPool = [];
let creationChoices = [];
let nextEventCache = null;

const DEFAULT_THEME = {accent:'#42e88d',bg:'#071016',panel:'#0d1820',panel2:'#111f29',border:'#243640'};

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
function clubStrength(name,code){ return findClubData(name,code)?.strength || 72; }
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
  root.style.setProperty('--bg',theme.bg);
  root.style.setProperty('--panel',theme.panel);
  root.style.setProperty('--panel2',theme.panel2);
  root.style.setProperty('--border',theme.border);
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
    year,totalGames:0,clubGames:0,clubGoals:0,clubAssists:0,goals:0,assists:0,ratingSum:0,lastNationalAt:-10,lastCareerEventAt:-8,
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

function weightedGoals(strengthDiff,home){
  let chance=clamp(.42+strengthDiff*.012+(home?.05:0),.18,.78);let goals=0;
  for(let i=0;i<4;i++) if(Math.random()<chance/(i+1.5)) goals++;
  return clamp(goals,0,5);
}
function positionProfile(position){
  return ({'Goleiro':{goal:.002,assist:.015,defensive:true},'Zagueiro':{goal:.055,assist:.04,defensive:true},'Lateral direito':{goal:.05,assist:.15,defensive:true},'Lateral esquerdo':{goal:.05,assist:.15,defensive:true},'Volante':{goal:.08,assist:.13,defensive:true},'Meia central':{goal:.14,assist:.25},'Meia ofensivo':{goal:.22,assist:.32},'Meia direita':{goal:.19,assist:.28},'Meia esquerda':{goal:.19,assist:.28},'Segundo atacante':{goal:.34,assist:.25},'Ponta direita':{goal:.31,assist:.27},'Ponta esquerda':{goal:.31,assist:.27},'Centroavante':{goal:.43,assist:.15}})[position]||{goal:.14,assist:.25};
}
function simulatePlayerPerformance(playerGoals,oppGoals){
  const p=state.player,profile=positionProfile(p.position);const quality=clamp((p.overall-60)/100,0,.36);let goals=Math.random()<profile.goal+quality?1:0;
  if(goals&&Math.random()<.10+quality/3)goals++;goals=Math.min(goals,playerGoals);const assists=Math.random()<profile.assist+quality*.65?1:0;
  let rating=6.05+goals*1.2+assists*.65+(Math.random()*1.4-.5)+(p.morale-70)/120;let extraLabel='Passes',extraValue=`${rnd(72,96)}%`;
  if(p.position==='Goleiro'){const saves=rnd(2,9);rating=6.2+saves*.16+(oppGoals===0?.7:0)+(Math.random()*.5-.25);extraLabel='Defesas';extraValue=saves;}
  else if(profile.defensive&&oppGoals===0){rating+=.45;extraLabel='Desarmes';extraValue=rnd(2,7);}
  return {goals,assists,rating:clamp(rating,5.0,10),extraLabel,extraValue};
}
function addTrophy(name){
  const p=state.player;p.trophies=p.trophies||[];if(p.trophies.some(t=>t.year===state.season.year&&t.name===name))return;
  p.trophies.push({year:state.season.year,name});p.titles=p.trophies.length;state.news.push(`${p.name} é campeão de ${name} com o ${p.club}!`);showCelebration('🏆',`Campeão: ${name}`,`${p.name} adiciona mais um título à carreira.`);
}
function finalizeLeague(){
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
function developmentResult(avg){
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
  if(awards.length){state.news.push(`${p.name} recebeu: ${awards.join(', ')}.`);showCelebration('⭐','Prêmios da temporada',awards.join(' · '));}
  return awards;
}
function generateOffers(avg){
  const p=state.player;if(avg<6.75){state.offers=[];return;}
  const tierTargets=TRANSFER_TARGETS.filter(c=>c.name!==p.club&&p.overall>=c.minOverall);
  const normal=allTransferClubs().filter(c=>c.name!==p.club&&c.strength<=p.overall+8&&c.strength>=Math.max(68,p.overall-8));
  let pool=[...tierTargets,...normal];pool=[...new Map(pool.map(c=>[`${c.countryCode}:${c.name}`,c])).values()];
  const count=clamp((avg>=7.8?3:2)+(p.marketBonus||0),1,4);p.marketBonus=0;
  state.offers=sample(pool,count).map(c=>({club:c.name,countryCode:c.countryCode,countryName:countryByCode(c.countryCode)?.name||c.countryCode,league:getCompetitionRule(c.countryCode,countryByCode(c.countryCode)?.name||'').league,strength:c.strength||clubStrength(c.name,c.countryCode),minOverall:c.minOverall||null,value:Math.round(p.value*(1.12+Math.random()*.75))}));
  if(state.offers.length)state.news.push(`${p.name} recebeu ${state.offers.length} proposta(s) no mercado.`);
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
    $('#league-round-label').textContent=`${s.league.name}: ${s.league.index}/${s.league.schedule.length} jogos`;$('#league-points').textContent=`${s.league.points} pts`;$('#league-progress-bar').style.width=`${Math.round(s.league.index/s.league.schedule.length*100)}%`;$('#season-progress').textContent=seasonComplete()?'Calendário concluído':'Em andamento';$('#finish-season').disabled=!seasonComplete()||p.retired;
    nextEventCache=chooseNextEvent();
    if(nextEventCache){$('#home-team').textContent=nextEventCache.home;$('#away-team').textContent=nextEventCache.away;$('#match-title').textContent=`${nextEventCache.home} x ${nextEventCache.away}`;$('#match-competition').textContent=nextEventCache.competition;$('#match-context').textContent=nextEventCache.type==='league'?`Rodada ${nextEventCache.round} de ${s.league.schedule.length}`:nextEventCache.stage||`Temporada ${s.year}`;$('#simulate-btn').disabled=p.retired;$('#simulate-btn').textContent='Simular partida →';}
    else{$('#match-title').textContent=p.retired?'Carreira encerrada':'Temporada pronta para ser concluída';$('#home-team').textContent='';$('#away-team').textContent='';$('#match-competition').textContent='';$('#match-context').textContent='';$('#simulate-btn').disabled=true;$('#simulate-btn').textContent='Sem partidas pendentes';}
    $('#competitions-list').innerHTML=competitionStatus().map(c=>`<div class="competition-item ${c.type==='continental'?'international':''}"><strong>${c.type==='league'?'🏆':c.type==='cup'?'🥇':'🌍'} ${c.title}</strong><small>${c.status}</small></div>`).join('');
  }else{
    $('#season-year').textContent='—';$('#s-games').textContent='0';$('#s-goals').textContent='0';$('#s-assists').textContent='0';$('#s-rating').textContent='—';$('#league-round-label').textContent='Carreira encerrada';$('#league-points').textContent='';$('#league-progress-bar').style.width='100%';$('#season-progress').textContent='Aposentado';$('#finish-season').disabled=true;$('#competitions-list').innerHTML='<div class="competition-item"><strong>👟 Carreira concluída</strong><small>Veja o histórico completo na aba Estatísticas.</small></div>';$('#match-title').textContent='Carreira encerrada';$('#home-team').textContent='';$('#away-team').textContent='';$('#match-competition').textContent='';$('#match-context').textContent='';$('#simulate-btn').disabled=true;$('#simulate-btn').textContent='Aposentado';
  }
  $('#national-country').textContent=`Seleção de ${p.nationality}`;$('#national-flag').textContent=countryFlag(p.nationalityCode);$('#national-status').textContent=p.calledUp?'Convocado':'Ainda não convocado';$('#national-message').textContent=p.calledUp?'Partidas internacionais podem entrar no calendário.':'Overall e desempenho aumentam as chances de convocação.';$('#nt-games').textContent=p.nationalTeamGames;$('#nt-goals').textContent=p.nationalTeamGoals;
  $('#news').innerHTML=(state.news.slice(-6).reverse().map(n=>`<div class="news-item"><strong>${n}</strong><small>CareerSim News</small></div>`).join('')||'<p class="muted">Nenhuma notícia ainda.</p>');
  renderHistory();renderOffers();renderHonours();renderMarketTier();if(state.pendingEvent)openPendingEvent();
}
function renderHistory(){
  if(!state.created)return;const current=state.season||{clubGames:0,clubGoals:0,clubAssists:0};const totals=state.history.reduce((a,h)=>({games:a.games+h.games,goals:a.goals+h.goals,assists:a.assists+h.assists}),{games:current.clubGames||0,goals:current.clubGoals||0,assists:current.clubAssists||0});
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

$('#simulate-btn').addEventListener('click',()=>{
  const p=state.player,s=state.season,event=nextEventCache||chooseNextEvent();if(!event||p.retired)return;
  const playerIsHome=event.type==='national'?event.home===p.nationality:event.home===p.club;const playerStrength=event.type==='national'?clamp(p.overall+3,70,96):clamp(p.clubStrength+(p.overall-70)*.2,65,96);const oppStrength=event.type==='national'?rnd(72,91):clubStrength(event.opponent,p.clubCountry);const diff=playerStrength-oppStrength;
  let pf=weightedGoals(diff,playerIsHome),pa=weightedGoals(-diff,!playerIsHome);if(event.type==='cup'||(event.type==='continental'&&state.season.continental?.phase==='knockout')){if(pf===pa&&((event.type==='cup'&&state.season.cup.stages[state.season.cup.stageIndex].legs===1)||(event.type==='continental'&&state.season.continental.knockout.stages[state.season.continental.knockout.stageIndex]?.legs===1))){/* empate pode ir a pênaltis no processamento */}}
  const perf=simulatePlayerPerformance(pf,pa);s.totalGames++;s.goals+=perf.goals;s.assists+=perf.assists;s.ratingSum+=perf.rating;
  if(event.type!=='national'){s.clubGames++;s.clubGoals+=perf.goals;s.clubAssists+=perf.assists;p.value=Math.max(200000,Math.round(p.value*(1+(perf.rating-6.5)/210)));}
  else{p.nationalTeamGames++;p.nationalTeamGoals+=perf.goals;}
  const homeGoals=playerIsHome?pf:pa,awayGoals=playerIsHome?pa:pf;processCompetitionResult(event,pf,pa);
  $('#result-competition').textContent=`${event.competition}${event.stage?` · ${event.stage}`:''}`;$('#result-home').textContent=event.home;$('#result-away').textContent=event.away;$('#score').textContent=`${homeGoals} – ${awayGoals}`;$('#player-match-stats').innerHTML=`<div><strong>${perf.rating.toFixed(1)}</strong><small>Nota</small></div><div><strong>${perf.goals}</strong><small>Gols</small></div><div><strong>${perf.assists}</strong><small>Assist.</small></div><div><strong>${perf.extraValue}</strong><small>${perf.extraLabel}</small></div>`;$('#match-result').classList.remove('hidden');
  if(perf.rating>=8)state.news.push(`${p.name} foi destaque em ${event.competition}, com nota ${perf.rating.toFixed(1)}.`);if(event.type==='national')state.news.push(`${p.name} atuou pela seleção de ${p.nationality} contra ${event.opponent}.`);nextEventCache=null;maybeTriggerCareerEvent();save();render();
});

$('#finish-season').addEventListener('click',()=>{
  const p=state.player,s=state.season;if(!seasonComplete()){toast('Ainda existem partidas pendentes nesta temporada.');return;}const avg=s.totalGames?s.ratingSum/s.totalGames:6.5;
  evaluateAwards(avg);updateSelectionAtSeasonEnd(avg);const delta=developmentResult(avg);const oldAge=p.age;
  state.history.push({year:s.year,club:p.club,overall:p.overall,games:s.clubGames,goals:s.clubGoals,assists:s.clubAssists,rating:avg.toFixed(1),leaguePosition:s.league.position,competitions:competitionStatus().map(c=>c.title)});generateOffers(avg);
  p.value=Math.max(150000,Math.round(p.value*(1+delta*.11)));p.age++;
  state.news.push(`${p.name} encerra ${s.year} com média ${avg.toFixed(1)}. GER ${p.overall} (${delta>=0?'+':''}${delta}) e POT ${p.potential}.`);
  if(p.age>=46){p.retired=true;p.age=46;state.news.push(`${p.name} encerra oficialmente a carreira aos 46 anos.`);state.season=null;state.offers=[];showCelebration('👟','Fim de carreira',`${p.name} se aposenta aos 46 anos após uma longa trajetória.`);}
  else{
    const earned=continentalFromLeagueResult(p.clubCountry,s.league.position);state.season=createSeason(p,s.year+1,earned);nextEventCache=null;
    if(oldAge>=30&&delta<0)state.news.push(`A idade começa a pesar: ${p.name} perdeu ${Math.abs(delta)} ponto(s) de overall nesta temporada.`);
  }
  save();render();toast(p.retired?'Carreira encerrada aos 46 anos.':`Nova temporada. GER ${p.overall} · POT ${p.potential}`);
});

window.acceptOffer=index=>{
  const o=state.offers[index],p=state.player;if(!o||p.retired)return;const old=p.club;p.club=o.club;p.clubCountry=o.countryCode;p.clubCountryName=o.countryName;p.clubStrength=o.strength;p.value=o.value;p.morale=clamp(p.morale+5,40,100);state.news.push(`${p.name} deixa o ${old} e é anunciado pelo ${o.club}.`);state.offers=[];
  if(state.season&&state.season.totalGames===0)state.season=createSeason(p,state.season.year,qualificationForClub(p.clubCountry,p.clubStrength));applyClubTheme(p.club);save();render();showCelebration('✍️',`Novo clube: ${o.club}`,`${p.name} inicia um novo capítulo da carreira.`);
};
window.rejectOffer=index=>{state.offers.splice(index,1);save();render();toast('Proposta recusada.');};

$('#reset-career').addEventListener('click',()=>{
  if(!confirm('Apagar a carreira atual e começar novamente?'))return;localStorage.removeItem(STORAGE_KEY);state={created:false,player:null,season:null,history:[],offers:[],news:[],pendingEvent:null};nextEventCache=null;applyClubTheme(null);showView('home');toast('Carreira apagada.');
});

populateCreationFields();setupBirthdateLimits();render();if(state.pendingEvent)openPendingEvent();