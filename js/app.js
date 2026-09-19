const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const STORAGE_KEY = "careerSimV2";

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  created: false,
  player: null,
  season: null,
  history: [],
  offers: [],
  news: []
};

let creationClubPool = [];
let creationChoices = [];
let nextEventCache = null;

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function sample(array,count){ return [...array].sort(()=>Math.random()-.5).slice(0,count); }
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function money(v){ return "€ " + (v >= 1e6 ? (v/1e6).toFixed(1)+" mi" : Math.round(v/1000)+" mil"); }
function toast(msg){ const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800); }
function countryByCode(code){ return COUNTRIES.find(c=>c.code===code); }
function countryFlag(code){
  if(!code || code.length!==2) return "🌍";
  return code.toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt()));
}
function confederation(code){
  if(CONFEDERATIONS.southAmerica.includes(code)) return "CONMEBOL";
  if(CONFEDERATIONS.europe.includes(code)) return "UEFA";
  if(CONFEDERATIONS.concacaf.includes(code)) return "CONCACAF";
  if(CONFEDERATIONS.asia.includes(code)) return "AFC";
  if(CONFEDERATIONS.africa.includes(code)) return "CAF";
  if(CONFEDERATIONS.oceania.includes(code)) return "OFC";
  return "Mundial";
}
function genericContinental(code){
  return ({CONMEBOL:"CONMEBOL Libertadores",UEFA:"UEFA Champions League",CONCACAF:"CONCACAF Champions Cup",AFC:"AFC Champions League Elite",CAF:"CAF Champions League",OFC:"OFC Champions League"})[confederation(code)] || "Competição Continental";
}
function getCompetitionRule(code,countryName){
  return COMPETITION_RULES[code] || {
    league:`Liga Nacional de ${countryName}`,
    cup:`Copa Nacional de ${countryName}`,
    continental:[genericContinental(code)]
  };
}
function clubStrength(name,code){
  const found=(LOCAL_CLUBS[code]||[]).find(c=>c.name===name);
  return found?.strength || rnd(68,81);
}
function normalizedClub(raw,code){
  return {
    name:raw.name || raw.strTeam,
    strength:raw.strength || rnd(68,81),
    badge:raw.badge || raw.strBadge || "",
    countryCode:code
  };
}
function allTransferClubs(){
  return Object.entries(LOCAL_CLUBS).flatMap(([countryCode,clubs])=>clubs.map(c=>({...c,countryCode})));
}

function populateCreationFields(){
  const countrySelect=$("#nationality");
  COUNTRIES
    .slice()
    .sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"))
    .forEach(c=>{
      const opt=document.createElement("option");
      opt.value=c.code;opt.textContent=c.name;countrySelect.appendChild(opt);
    });
  POSITIONS.forEach(pos=>{
    const opt=document.createElement("option");opt.value=pos;opt.textContent=pos;$("#position").appendChild(opt);
  });
}

async function fetchCountryClubs(country){
  if(LOCAL_CLUBS[country.code]?.length>=3){
    return {clubs:LOCAL_CLUBS[country.code].map(c=>normalizedClub(c,country.code)),source:"base local do protótipo"};
  }
  const status=$("#club-status");
  status.textContent=`Buscando clubes de ${country.name}...`;
  status.classList.add("loading");
  try{
    const url=`https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?s=Soccer&c=${encodeURIComponent(country.apiName)}`;
    const response=await fetch(url);
    if(!response.ok) throw new Error("Falha na API");
    const data=await response.json();
    const teams=(data.teams||[])
      .filter(t=>t.strTeam && (!t.strSport || t.strSport==="Soccer"))
      .map(t=>normalizedClub(t,country.code));
    const unique=[...new Map(teams.map(t=>[t.name,t])).values()];
    if(unique.length>=3) return {clubs:unique,source:"TheSportsDB"};
    throw new Error("Poucos clubes encontrados");
  }catch(error){
    const fallback=[
      {name:`Atlético ${country.name}`,strength:70,countryCode:country.code},
      {name:`Sporting ${country.name}`,strength:69,countryCode:country.code},
      {name:`${country.name} FC`,strength:68,countryCode:country.code}
    ];
    return {clubs:fallback,source:"fallback fictício (API indisponível ou sem dados suficientes)"};
  }finally{
    status.classList.remove("loading");
  }
}

async function loadClubChoices(){
  const code=$("#nationality").value;
  $("#selected-club").value="";
  $("#create-submit").disabled=true;
  $("#club-options").innerHTML="";
  nextEventCache=null;
  if(!code){
    $("#club-status").textContent="Selecione sua nacionalidade para sortear os clubes.";
    $("#reroll-clubs").disabled=true;
    return;
  }
  const country=countryByCode(code);
  $("#reroll-clubs").disabled=true;
  const result=await fetchCountryClubs(country);
  creationClubPool=result.clubs;
  $("#club-status").dataset.source=result.source;
  drawThreeClubs();
  $("#reroll-clubs").disabled=false;
}

function drawThreeClubs(){
  const source=$("#club-status").dataset.source || "base de clubes";
  creationChoices=sample(creationClubPool,Math.min(3,creationClubPool.length));
  $("#club-status").innerHTML=`Três clubes foram sorteados. Escolha um para começar.<div class="club-source">Fonte: ${source}</div>`;
  $("#club-options").innerHTML=creationChoices.map((c,i)=>`
    <button type="button" class="club-option" data-club-index="${i}">
      <span class="check"></span>
      <strong>⚽ ${c.name}</strong>
      <small>${getCompetitionRule(c.countryCode,countryByCode(c.countryCode)?.name || "seu país").league}</small>
      <small>Força estimada: ${c.strength}</small>
    </button>`).join("");
  $$(".club-option").forEach(btn=>btn.addEventListener("click",()=>selectCreationClub(+btn.dataset.clubIndex)));
}

function selectCreationClub(index){
  const selected=creationChoices[index];
  $("#selected-club").value=selected.name;
  $$(".club-option").forEach((el,i)=>{
    el.classList.toggle("selected",i===index);
    el.querySelector(".check").textContent=i===index?"✓":"";
  });
  $("#create-submit").disabled=false;
}

function qualificationForClub(code,strength){
  const country=countryByCode(code);
  const rule=getCompetitionRule(code,country?.name||"seu país");
  const list=rule.continental||[];
  if(!list.length) return null;
  if(list.length===3){
    if(strength>=87) return list[0];
    if(strength>=82) return Math.random()<.55?list[0]:list[1];
    if(strength>=77) return Math.random()<.45?list[1]:list[2];
    return Math.random()<.16?list[2]:null;
  }
  if(list.length===2){
    if(strength>=82) return list[0];
    if(strength>=76) return Math.random()<.45?list[0]:list[1];
    return Math.random()<.2?list[1]:null;
  }
  return strength>=80 || Math.random()<.25 ? list[0] : null;
}

function buildSeasonCompetitions(code,clubName,strength){
  const country=countryByCode(code);
  const rule=getCompetitionRule(code,country?.name||"seu país");
  const comps=[{name:rule.league,type:"league"},{name:rule.cup,type:"cup"}];
  const continental=qualificationForClub(code,strength);
  if(continental) comps.push({name:continental,type:"continental"});
  return comps;
}

function showView(id){
  if(["career","stats","market"].includes(id) && !state.created) id="create";
  $$(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  $$("nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  window.scrollTo({top:0,behavior:"smooth"});
  render();
}

function currentClubPool(){
  const p=state.player;
  if(LOCAL_CLUBS[p.clubCountry]?.length) return LOCAL_CLUBS[p.clubCountry].map(c=>normalizedClub(c,p.clubCountry));
  if(state.clubPool?.length) return state.clubPool;
  return [{name:`Rival de ${p.clubCountryName}`,strength:70,countryCode:p.clubCountry}];
}

function nationalCompetition(year,gameNo){
  if(year%4===2) return gameNo%2===0?"Copa do Mundo":"Amistoso Internacional";
  return gameNo%2===0?"Eliminatórias da Copa do Mundo":"Amistoso Internacional";
}

function chooseNextEvent(){
  if(!state.created) return null;
  const p=state.player,s=state.season;
  const gameNo=s.games+1;
  if(p.calledUp && gameNo>=4 && gameNo%7===0){
    const possible=COUNTRIES.filter(c=>c.code!==p.nationalityCode && c.code.length===2);
    const rival=possible[rnd(0,possible.length-1)];
    return {kind:"national",competition:nationalCompetition(s.year,gameNo),home:p.nationality,away:rival.name,opponent:rival.name};
  }
  const continental=s.competitions.find(c=>c.type==="continental");
  const cup=s.competitions.find(c=>c.type==="cup");
  const league=s.competitions.find(c=>c.type==="league");
  let competition=league;
  if(continental && gameNo%4===0) competition=continental;
  else if(cup && gameNo%5===0) competition=cup;

  let opp;
  if(competition.type==="continental"){
    const conf=confederation(p.clubCountry);
    const options=allTransferClubs().filter(c=>c.countryCode!==p.clubCountry && confederation(c.countryCode)===conf);
    opp=options.length?options[rnd(0,options.length-1)].name:"Rival internacional";
  }else{
    const pool=currentClubPool().filter(c=>c.name!==p.club);
    opp=pool.length?pool[rnd(0,pool.length-1)].name:"Rival local";
  }
  return {kind:"club",competition:competition.name,competitionType:competition.type,home:p.club,away:opp,opponent:opp};
}

function positionProfile(position){
  const profiles={
    "Goleiro":{goal:.002,assist:.015,defensive:true},
    "Zagueiro":{goal:.06,assist:.04,defensive:true},
    "Lateral direito":{goal:.05,assist:.15,defensive:true},
    "Lateral esquerdo":{goal:.05,assist:.15,defensive:true},
    "Volante":{goal:.08,assist:.13,defensive:true},
    "Meia central":{goal:.14,assist:.25},
    "Meia ofensivo":{goal:.22,assist:.32},
    "Meia direita":{goal:.19,assist:.28},
    "Meia esquerda":{goal:.19,assist:.28},
    "Segundo atacante":{goal:.34,assist:.25},
    "Ponta direita":{goal:.31,assist:.27},
    "Ponta esquerda":{goal:.31,assist:.27},
    "Centroavante":{goal:.43,assist:.15}
  };
  return profiles[position]||profiles["Meia central"];
}

function simulatePlayerPerformance(event,ourGoals,theirGoals){
  const p=state.player,profile=positionProfile(p.position);
  const quality=clamp((p.overall-60)/100,0,.35);
  let goals=Math.random()<profile.goal+quality?1:0;
  if(goals && Math.random()<.12+quality/3) goals++;
  if(goals>ourGoals) goals=ourGoals;
  const assists=Math.random()<profile.assist+quality*.7?1:0;
  let rating=6.1+goals*1.15+assists*.65+(Math.random()*1.5-.55);
  let extraLabel="Passes",extraValue=`${rnd(72,96)}%`;
  if(p.position==="Goleiro"){
    const saves=rnd(2,8);rating=6.3+saves*.16+(theirGoals===0?.7:0)+(Math.random()*.6-.3);extraLabel="Defesas";extraValue=saves;
  }else if(profile.defensive && theirGoals===0){ rating+=.45;extraLabel="Desarmes";extraValue=rnd(2,7); }
  return {goals,assists,rating:clamp(rating,5.2,10),extraLabel,extraValue};
}

function updateSelectionAtSeasonEnd(avg){
  const p=state.player;
  const wasCalled=p.calledUp;
  const eligible=p.overall>=73 && avg>=7.15;
  if(!wasCalled && eligible){
    const chance=clamp(.35+(avg-7.15)*.35+(p.overall-73)*.035,.35,.94);
    if(Math.random()<chance){
      p.calledUp=true;
      state.news.push(`${p.name} recebe sua primeira convocação para a seleção de ${p.nationality}!`);
    }
  }else if(wasCalled && (avg<6.65 || p.overall<71) && Math.random()<.55){
    p.calledUp=false;
    state.news.push(`${p.name} ficou fora da nova lista da seleção de ${p.nationality}.`);
  }else if(wasCalled && avg>=7.2){
    state.news.push(`${p.name} permanece nos planos da seleção de ${p.nationality}.`);
  }
}

function generateOffers(avg){
  const p=state.player;
  if(avg<7.0) return;
  const candidates=allTransferClubs().filter(c=>c.name!==p.club && c.strength<=p.overall+18 && c.strength>=p.overall-4);
  const count=avg>=7.8?3:2;
  state.offers=sample(candidates,count).map(c=>({
    club:c.name,countryCode:c.countryCode,
    countryName:countryByCode(c.countryCode)?.name||c.countryCode,
    league:getCompetitionRule(c.countryCode,countryByCode(c.countryCode)?.name||"").league,
    strength:c.strength,value:Math.round(p.value*(1.12+Math.random()*.7))
  }));
  if(state.offers.length) state.news.push(`${p.name} recebeu ${state.offers.length} proposta(s) após a boa temporada.`);
}

function render(){
  if(!state.created){
    $("#mini-profile").classList.add("hidden");$("#reset-career").classList.add("hidden");return;
  }
  const p=state.player,s=state.season;
  $("#mini-profile").classList.remove("hidden");$("#reset-career").classList.remove("hidden");
  $("#mini-profile").textContent=`${p.name} · ${p.overall}`;
  $("#p-name").textContent=p.name;$("#p-pos").textContent=p.position;$("#p-age").textContent=p.age;$("#p-country").textContent=p.nationality;
  $("#p-overall").textContent=p.overall;$("#p-club").textContent=p.club;$("#p-league").textContent=getCompetitionRule(p.clubCountry,p.clubCountryName).league;
  $("#p-value").textContent=money(p.value);$("#avatar").textContent=p.number;
  $("#season-label").textContent=s.year;$("#season-year").textContent=s.year;
  $("#s-games").textContent=s.games;$("#s-goals").textContent=s.goals;$("#s-assists").textContent=s.assists;
  $("#s-rating").textContent=s.games?(s.ratingSum/s.games).toFixed(1):"-";

  nextEventCache=chooseNextEvent();
  $("#home-team").textContent=nextEventCache.home;$("#away-team").textContent=nextEventCache.away;
  $("#match-title").textContent=`${nextEventCache.home} x ${nextEventCache.away}`;
  $("#match-competition").textContent=nextEventCache.competition;

  $("#competitions-list").innerHTML=s.competitions.map(c=>`<div class="competition-item ${c.type==='continental'?'international':''}">${c.type==='league'?'🏆':c.type==='cup'?'🥇':'🌍'} ${c.name}</div>`).join("");
  $("#national-country").textContent=`Seleção de ${p.nationality}`;$("#national-flag").textContent=countryFlag(p.nationalityCode);
  $("#national-status").textContent=p.calledUp?"Convocado":"Ainda não convocado";
  $("#national-message").textContent=p.calledUp?"Você pode receber jogos de seleção durante a temporada.":"Bom desempenho e overall alto aumentam suas chances.";
  $("#nt-games").textContent=p.nationalTeamGames;$("#nt-goals").textContent=p.nationalTeamGoals;

  $("#news").innerHTML=(state.news.slice(-5).reverse().map(n=>`<div class="news-item"><strong>${n}</strong><small>CareerSim News</small></div>`).join("")||"<p class='muted'>Nenhuma notícia ainda.</p>");
  renderHistory();renderOffers();
}

function renderHistory(){
  if(!state.created) return;
  const totals=state.history.reduce((a,h)=>({games:a.games+h.games,goals:a.goals+h.goals,assists:a.assists+h.assists}),{games:state.season.clubGames||0,goals:state.season.clubGoals||0,assists:state.season.clubAssists||0});
  $("#career-games").textContent=totals.games;$("#career-goals").textContent=totals.goals;$("#career-assists").textContent=totals.assists;$("#career-titles").textContent=state.player.titles;
  $("#history-body").innerHTML=state.history.length?state.history.slice().reverse().map(h=>`<tr><td>${h.year}</td><td>${h.club}</td><td>${h.games}</td><td>${h.goals}</td><td>${h.assists}</td><td>${h.rating}</td><td>${h.competitions.join(", ")}</td></tr>`).join(""):`<tr><td colspan="7" class="muted">Encerre sua primeira temporada para criar o histórico.</td></tr>`;
}

function renderOffers(){
  if(!state.created) return;
  const box=$("#offers");
  box.innerHTML=state.offers.length?state.offers.map((o,i)=>`<article class="panel offer">
    <div><p class="eyebrow">${o.countryName} · ${o.league}</p><h3>⚽ ${o.club}</h3><p>Oferta estimada: <strong>${money(o.value)}</strong> · Força do clube: ${o.strength}</p></div>
    <div class="offer-actions"><button class="primary" onclick="acceptOffer(${i})">Aceitar</button><button class="danger" onclick="rejectOffer(${i})">Recusar</button></div>
  </article>`).join(""):`<article class="panel"><h3>Nenhuma proposta no momento</h3><p class="muted">Continue jogando bem. Propostas normalmente surgem depois de boas temporadas.</p></article>`;
}

$$('[data-view]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showView(el.dataset.view)}));
$("#start-btn").addEventListener("click",()=>showView(state.created?"career":"create"));
$("#nationality").addEventListener("change",loadClubChoices);
$("#reroll-clubs").addEventListener("click",()=>{ $("#selected-club").value="";$("#create-submit").disabled=true;drawThreeClubs(); });

$("#player-form").addEventListener("submit",e=>{
  e.preventDefault();
  const number=Number($("#number").value);
  if(!Number.isInteger(number)||number<1||number>99){toast("O número da camiseta deve ser um inteiro entre 1 e 99.");return;}
  const code=$("#nationality").value;
  const country=countryByCode(code);
  const selected=creationChoices.find(c=>c.name===$("#selected-club").value);
  if(!selected){toast("Escolha um dos três clubes sorteados.");return;}
  const competitions=buildSeasonCompetitions(code,selected.name,selected.strength);
  state={
    created:true,
    player:{
      name:$("#name").value.trim(),nationality:country.name,nationalityCode:code,position:$("#position").value,foot:$("#foot").value,
      club:selected.name,clubCountry:code,clubCountryName:country.name,clubStrength:selected.strength,number,age:16,overall:67,value:900000,titles:0,
      calledUp:false,nationalTeamGames:0,nationalTeamGoals:0
    },
    clubPool:creationClubPool,
    season:{year:START_YEAR,games:0,clubGames:0,clubGoals:0,clubAssists:0,goals:0,assists:0,ratingSum:0,competitions},
    history:[],offers:[],news:[`${$("#name").value.trim()} assina seu primeiro contrato profissional com o ${selected.name}.`]
  };
  if(competitions.some(c=>c.type==="continental")) state.news.push(`${selected.name} também disputará ${competitions.find(c=>c.type==="continental").name} nesta temporada.`);
  save();showView("career");toast("Carreira iniciada!");
});

$("#simulate-btn").addEventListener("click",()=>{
  const p=state.player,s=state.season,event=nextEventCache||chooseNextEvent();
  if(s.games>=42){toast("A temporada atingiu o limite de partidas desta versão.");return;}
  let our=rnd(0,4),their=rnd(0,3);
  if(event.kind==="national"){ our=rnd(0,3);their=rnd(0,3); }
  const perf=simulatePlayerPerformance(event,our,their);
  s.games++;s.goals+=perf.goals;s.assists+=perf.assists;s.ratingSum+=perf.rating;
  if(event.kind==="club"){
    s.clubGames++;s.clubGoals+=perf.goals;s.clubAssists+=perf.assists;
    p.value=Math.max(200000,Math.round(p.value*(1+(perf.rating-6.5)/190)));
  }else{
    p.nationalTeamGames++;p.nationalTeamGoals+=perf.goals;
  }
  $("#result-competition").textContent=event.competition;$("#result-home").textContent=event.home;$("#result-away").textContent=event.away;$("#score").textContent=`${our} – ${their}`;
  $("#player-match-stats").innerHTML=`<div><strong>${perf.rating.toFixed(1)}</strong><small>Nota</small></div><div><strong>${perf.goals}</strong><small>Gols</small></div><div><strong>${perf.assists}</strong><small>Assist.</small></div><div><strong>${perf.extraValue}</strong><small>${perf.extraLabel}</small></div>`;
  $("#match-result").classList.remove("hidden");
  if(perf.rating>=8) state.news.push(`${p.name} foi destaque por ${event.kind==='national'?p.nationality:p.club} em ${event.competition}, com nota ${perf.rating.toFixed(1)}.`);
  if(event.kind==="national") state.news.push(`${p.name} entrou em campo pela seleção de ${p.nationality} contra ${event.opponent}.`);
  nextEventCache=null;save();render();
});

$("#close-result").addEventListener("click",()=>$("#match-result").classList.add("hidden"));

$("#finish-season").addEventListener("click",()=>{
  const p=state.player,s=state.season;
  if(s.games<8){toast("Jogue pelo menos 8 partidas antes de encerrar a temporada.");return;}
  const avg=s.ratingSum/s.games;
  state.history.push({year:s.year,club:p.club,games:s.clubGames,goals:s.clubGoals,assists:s.clubAssists,rating:avg.toFixed(1),competitions:s.competitions.map(c=>c.name)});
  const growth=avg>=8?rnd(3,5):avg>=7.25?rnd(2,3):avg>=6.75?rnd(0,2):-1;
  p.overall=clamp(p.overall+growth,55,94);p.age++;p.value=Math.max(250000,Math.round(p.value*(1+growth*.12)));
  if(Math.random()<clamp(.10+(avg-6.5)*.12,0,.35)){p.titles++;state.news.push(`${p.name} encerra ${s.year} comemorando um título com o ${p.club}!`);}
  updateSelectionAtSeasonEnd(avg);generateOffers(avg);
  state.news.push(`${p.name} encerra ${s.year} com média ${avg.toFixed(1)} e overall ${p.overall}.`);
  const nextComps=buildSeasonCompetitions(p.clubCountry,p.club,p.clubStrength);
  state.season={year:s.year+1,games:0,clubGames:0,clubGoals:0,clubAssists:0,goals:0,assists:0,ratingSum:0,competitions:nextComps};
  nextEventCache=null;save();render();toast(`Temporada encerrada. Overall: ${p.overall}`);
});

window.acceptOffer=index=>{
  const o=state.offers[index],p=state.player,old=p.club;
  p.club=o.club;p.clubCountry=o.countryCode;p.clubCountryName=o.countryName;p.clubStrength=o.strength;p.value=o.value;
  state.clubPool=(LOCAL_CLUBS[o.countryCode]||[]).map(c=>normalizedClub(c,o.countryCode));
  state.season.competitions=buildSeasonCompetitions(o.countryCode,o.club,o.strength);
  state.news.push(`${p.name} deixa o ${old} e é anunciado pelo ${o.club}, de ${o.countryName}.`);
  state.offers=[];nextEventCache=null;save();render();toast(`Transferência concluída: ${o.club}`);
};
window.rejectOffer=index=>{state.offers.splice(index,1);save();render();toast("Proposta recusada.");};

$("#reset-career").addEventListener("click",()=>{
  if(confirm("Tem certeza? Isso apagará a carreira salva neste navegador.")){
    localStorage.removeItem(STORAGE_KEY);location.reload();
  }
});

populateCreationFields();
render();
