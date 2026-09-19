const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let state = JSON.parse(localStorage.getItem("careerSim")) || {
  created:false, player:null, season:null, history:[], offers:[], news:[]
};

function save(){ localStorage.setItem("careerSim", JSON.stringify(state)); }
function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function club(name){ return CLUBS.find(c=>c.name===name) || CLUBS[0]; }
function money(v){ return "€ " + (v >= 1e6 ? (v/1e6).toFixed(1)+" mi" : Math.round(v/1000)+" mil"); }
function toast(msg){ const t=$("#toast"); t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600); }

function showView(id){
  if(["career","stats","market"].includes(id) && !state.created) id="create";
  $$(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  $$("nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  window.scrollTo({top:0,behavior:"smooth"});
  render();
}

$$("[data-view]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();showView(el.dataset.view)}));
$("#start-btn").addEventListener("click",()=>showView(state.created?"career":"create"));

$("#player-form").addEventListener("submit",e=>{
  e.preventDefault();
  const initialClub=$("#club").value;
  state={
    created:true,
    player:{
      name:$("#name").value.trim(), nationality:$("#nationality").value,
      position:$("#position").value, foot:$("#foot").value, club:initialClub,
      number:+$("#number").value, age:16, overall:67, value:900000, titles:0
    },
    season:{year:START_YEAR,games:0,goals:0,assists:0,ratingSum:0},
    history:[],offers:[],
    news:[`${$("#name").value.trim()} assina seu primeiro contrato profissional com o ${initialClub}.`]
  };
  save(); showView("career"); toast("Carreira iniciada!");
});

function opponent(){
  const pool=CLUBS.filter(c=>c.name!==state.player.club);
  return pool[rnd(0,pool.length-1)].name;
}

function render(){
  if(!state.created){$("#mini-profile").classList.add("hidden");return}
  const p=state.player,s=state.season,c=club(p.club);
  $("#mini-profile").classList.remove("hidden"); $("#mini-profile").textContent=`${p.name} · ${p.overall}`;
  $("#p-name").textContent=p.name;$("#p-pos").textContent=p.position;$("#p-age").textContent=p.age;
  $("#p-overall").textContent=p.overall;$("#p-club").textContent=p.club;$("#p-league").textContent=c.league;
  $("#p-value").textContent=money(p.value);$("#avatar").textContent=p.number;
  $("#season-label").textContent=s.year;$("#season-year").textContent=s.year;
  $("#s-games").textContent=s.games;$("#s-goals").textContent=s.goals;$("#s-assists").textContent=s.assists;
  $("#s-rating").textContent=s.games?(s.ratingSum/s.games).toFixed(1):"-";
  const opp=opponent();$("#home-team").textContent=p.club;$("#away-team").textContent=opp;$("#match-title").textContent=`${p.club} x ${opp}`;
  $("#news").innerHTML=(state.news.slice(-4).reverse().map(n=>`<div class="news-item"><strong>${n}</strong><small>CareerSim News</small></div>`).join("")||"<p class='muted'>Nenhuma notícia ainda.</p>");
  renderHistory();renderOffers();
}

$("#simulate-btn").addEventListener("click",()=>{
  const p=state.player,s=state.season;
  if(s.games>=38){toast("A temporada já chegou a 38 partidas.");return}
  const opp=$("#away-team").textContent;
  const our=rnd(0,4),their=rnd(0,3);
  const scoringChance=Math.min(.75,.16+(p.overall-60)/100);
  const goals=Math.random()<scoringChance?rnd(1,Math.random()<.12?3:2):0;
  const assists=Math.random()<Math.min(.55,.12+(p.overall-60)/120)?1:0;
  const rating=Math.min(10,Math.max(5.5,6.2+goals*1.25+assists*.65+(Math.random()*1.4-.5)));
  s.games++;s.goals+=goals;s.assists+=assists;s.ratingSum+=rating;
  p.value=Math.round(p.value*(1+(rating-6.5)/180));
  $("#result-home").textContent=p.club;$("#result-away").textContent=opp;$("#score").textContent=`${our} – ${their}`;
  $("#player-match-stats").innerHTML=`<div><strong>${rating.toFixed(1)}</strong><small>Nota</small></div><div><strong>${goals}</strong><small>Gols</small></div><div><strong>${assists}</strong><small>Assist.</small></div><div><strong>${rnd(70,96)}%</strong><small>Passes</small></div>`;
  $("#match-result").classList.remove("hidden");
  if(rating>=8) state.news.push(`${p.name} foi destaque na partida contra o ${opp}, com nota ${rating.toFixed(1)}.`);
  save();render();
});
$("#close-result").addEventListener("click",()=>$("#match-result").classList.add("hidden"));

$("#finish-season").addEventListener("click",()=>{
  const p=state.player,s=state.season;
  if(s.games<5){toast("Jogue pelo menos 5 partidas antes de encerrar.");return}
  const avg=s.ratingSum/s.games;
  state.history.push({year:s.year,club:p.club,games:s.games,goals:s.goals,assists:s.assists,rating:avg.toFixed(1)});
  const growth=avg>=8?rnd(3,5):avg>=7?rnd(1,3):avg>=6.5?rnd(0,2):-1;
  p.overall=Math.max(55,Math.min(94,p.overall+growth));p.age++;p.value=Math.max(250000,Math.round(p.value*(1+growth*.12)));
  if(avg>=7.2) generateOffers();
  if(Math.random()<.22){p.titles++;state.news.push(`${p.name} encerra ${s.year} comemorando um título com o ${p.club}!`);}
  state.news.push(`${p.name} encerra a temporada ${s.year} com média ${avg.toFixed(1)}.`);
  state.season={year:s.year+1,games:0,goals:0,assists:0,ratingSum:0};
  save();render();toast(`Temporada encerrada. Overall: ${p.overall}`);
});

function generateOffers(){
  const p=state.player;
  const candidates=CLUBS.filter(c=>c.name!==p.club && c.strength<=p.overall+20 && c.strength>=p.overall-2);
  state.offers=candidates.sort(()=>Math.random()-.5).slice(0,2).map(c=>({
    club:c.name,league:c.league,value:Math.round(p.value*(1.15+Math.random()*.65))
  }));
  if(state.offers.length) state.news.push(`${p.name} recebeu novas propostas após boas atuações.`);
}

function renderOffers(){
  if(!state.created)return;
  const box=$("#offers");
  box.innerHTML=state.offers.length?state.offers.map((o,i)=>`<article class="panel offer">
    <div><p class="eyebrow">${o.league}</p><h3>⚽ ${o.club}</h3><p>Oferta estimada: <strong>${money(o.value)}</strong></p></div>
    <div class="offer-actions"><button class="primary" onclick="acceptOffer(${i})">Aceitar</button><button class="danger" onclick="rejectOffer(${i})">Recusar</button></div>
  </article>`).join(""):`<article class="panel"><h3>Nenhuma proposta no momento</h3><p class="muted">Continue jogando bem. Propostas podem surgir ao fim de uma boa temporada.</p></article>`;
}

window.acceptOffer=i=>{
  const o=state.offers[i],old=state.player.club;state.player.club=o.club;state.player.value=o.value;
  state.news.push(`${state.player.name} deixa o ${old} e é anunciado pelo ${o.club}.`);
  state.offers=[];save();render();toast(`Transferência concluída: ${o.club}`);
};
window.rejectOffer=i=>{state.offers.splice(i,1);save();render();toast("Proposta recusada.");};

function renderHistory(){
  if(!state.created)return;
  const totals=state.history.reduce((a,h)=>({games:a.games+h.games,goals:a.goals+h.goals,assists:a.assists+h.assists}),{games:state.season.games,goals:state.season.goals,assists:state.season.assists});
  $("#career-games").textContent=totals.games;$("#career-goals").textContent=totals.goals;$("#career-assists").textContent=totals.assists;$("#career-titles").textContent=state.player.titles;
  $("#history-body").innerHTML=state.history.length?state.history.slice().reverse().map(h=>`<tr><td>${h.year}</td><td>${h.club}</td><td>${h.games}</td><td>${h.goals}</td><td>${h.assists}</td><td>${h.rating}</td></tr>`).join(""):`<tr><td colspan="6" class="muted">Encerre sua primeira temporada para criar o histórico.</td></tr>`;
}

render();
