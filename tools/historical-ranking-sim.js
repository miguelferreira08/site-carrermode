'use strict';
const fs=require('fs');
const vm=require('vm');
const path=require('path');

const appPath=path.join(__dirname,'..','js','app.js');
const source=fs.readFileSync(appPath,'utf8');
const start=source.indexOf('const HISTORICAL_SCORE_ANCHORS=');
const end=source.indexOf('function rankingPositionLabel',start);
if(start<0||end<0)throw new Error('Bloco de ranking histórico não encontrado em app.js');
const rankingSource=source.slice(start,end)+`\nthis.__rank=historicalRankBreakdown;`;

function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function split(total,n){
  const base=Math.floor((Number(total)||0)/n),rest=(Number(total)||0)-base*n;
  return Array.from({length:n},(_,i)=>base+(i<rest?1:0));
}
function makeTrophies(total,{champions=0,libertadores=0,worldCups=0,clubWorlds=0}={}){
  const list=[];
  for(let i=0;i<champions;i++)list.push({name:'UEFA Champions League',year:2000+i});
  for(let i=0;i<libertadores;i++)list.push({name:'CONMEBOL Libertadores',year:2020+i});
  for(let i=0;i<worldCups;i++)list.push({name:'FIFA World Cup',year:2022+i*4});
  for(let i=0;i<clubWorlds;i++)list.push({name:'FIFA Club World Cup',year:2030+i});
  while(list.length<total)list.push({name:`Título nacional ${list.length+1}`,year:2000+list.length});
  return list.slice(0,total);
}
function makeAwards({ballons=0,goldenShoes=0}={}){
  const list=[];
  for(let i=0;i<ballons;i++)list.push({name:'Bola de Ouro',year:2020+i});
  for(let i=0;i<goldenShoes;i++)list.push({name:'Chuteira de Ouro',year:2020+i});
  return list;
}
function ratingPattern({seasons=18,elite=0,dominant=0,transcendent=0,base=7.15,defensive=false}={}){
  // Os totais são inclusivos: temporadas transcendentes também contam como dominantes e elite.
  const transRating=defensive?8.12:8.22,domRating=defensive?7.92:8.02,eliteRating=defensive?7.65:7.75;
  const out=[];
  for(let i=0;i<transcendent;i++)out.push(transRating);
  for(let i=transcendent;i<dominant;i++)out.push(domRating);
  for(let i=dominant;i<elite;i++)out.push(eliteRating);
  while(out.length<seasons)out.push(base);
  return out.slice(0,seasons);
}
function makeState(s){
  const ntGames=s.ntGames||0,clubGames=Math.max(0,s.games-ntGames),seasons=s.seasons||Math.max(1,Math.round(clubGames/48));
  const ntGoals=s.ntGoals||0,ntAssists=s.ntAssists||0,clubGa=Math.max(0,s.ga-ntGoals-ntAssists);
  const goalShare=s.goalShare??0.62,clubGoals=Math.round(clubGa*goalShare),clubAssists=clubGa-clubGoals;
  const ratings=s.seasonRatings||Array(seasons).fill(s.avg??7.2),overalls=s.seasonOveralls||Array(seasons).fill(s.peak);
  const g=split(clubGames,seasons),goals=split(clubGoals,seasons),assists=split(clubAssists,seasons),saves=split(s.saves||0,seasons),tackles=split(s.tackles||0,seasons),cleanSheets=split(s.cleanSheets||0,seasons);
  const history=Array.from({length:seasons},(_,i)=>({
    year:2020+i,club:'Clube principal',overall:overalls[i]??s.peak,games:g[i],goals:goals[i],assists:assists[i],saves:saves[i],tackles:tackles[i],cleanSheets:cleanSheets[i],rating:String(ratings[i]??s.avg??7.2),leaguePosition:1
  }));
  return {
    player:{
      name:s.name,position:s.position,overall:s.peak,potential:s.peak,reputation:s.reputation??92,
      nationalTeamGames:ntGames,nationalTeamGoals:ntGoals,nationalTeamAssists:ntAssists,
      nationalCaptain:s.captain!==false,nationalIcon:s.nationalIcon!==false,
      clubIdols:s.idol===false?[]:['Clube principal'],
      trophies:makeTrophies(s.titles,{champions:s.champions,libertadores:s.libertadores||0,worldCups:s.worldCups,clubWorlds:s.clubWorlds||0}),
      awards:makeAwards({ballons:s.ballons,goldenShoes:s.goldenShoes||0})
    },
    history
  };
}
function evaluate(scenario){
  const context={clamp,state:makeState(scenario)};
  context.careerTotals=()=>context.state.history.reduce((a,h)=>({games:a.games+(h.games||0),goals:a.goals+(h.goals||0),assists:a.assists+(h.assists||0)}),{games:0,goals:0,assists:0});
  vm.createContext(context);
  vm.runInContext(rankingSource,context,{filename:'historical-ranking-production-block.js'});
  const r=context.__rank();
  return {
    nome:scenario.name,posicao:scenario.position,ga:r.ga,jogos:r.games,auge:r.peak,media:Number(r.avg.toFixed(2)),titulos:scenario.titles,
    champions:scenario.champions,copa:scenario.worldCups,bolaOuro:scenario.ballons,chuteira:scenario.goldenShoes||0,
    elite:r.eliteSeasons,dominantes:r.dominantSeasons,transcendentes:r.transcendentSeasons,
    desarmes:r.tackles,defesas:r.saves,cleanSheets:r.cleanSheets,pontos:r.score,
    rankBase:r.baseRank,ajustePosicao:r.rank<=100&&r.baseRank<=100?r.rank-r.baseRank:0,
    resultado:r.rank<=100?`#${r.rank}`:'Fora do Top 100',pisoElegibilidade:r.eligibilityCap
  };
}

const atkOldRatings=ratingPattern({seasons:16,elite:10,dominant:3,transcendent:1,base:7.35});
const gkOldRatings=ratingPattern({seasons:18,elite:11,dominant:5,transcendent:1,base:7.30,defensive:true});
const scenarios=[
  {name:'ATA comum',position:'Centroavante',ga:160,games:500,peak:82,avg:7.00,titles:5,champions:0,worldCups:0,ballons:0,goldenShoes:0,ntGames:45,ntGoals:18,ntAssists:5,reputation:55,idol:false,nationalIcon:false,captain:false},
  {name:'ATA histórico',position:'Centroavante',ga:780,games:820,peak:93,avg:7.60,titles:22,champions:2,worldCups:1,ballons:2,goldenShoes:1,ntGames:125,ntGoals:72,ntAssists:25,reputation:92},
  {name:'ATA antigo patamar GOAT',position:'Centroavante',ga:1000,games:820,peak:95,titles:30,champions:4,worldCups:1,ballons:5,goldenShoes:3,ntGames:140,ntGoals:95,ntAssists:35,reputation:100,seasons:16,seasonRatings:atkOldRatings},
  {name:'ATA panteão reforçado',position:'Centroavante',ga:1180,games:940,peak:96,titles:35,champions:5,worldCups:1,ballons:6,goldenShoes:4,ntGames:145,ntGoals:105,ntAssists:35,reputation:100,seasons:18,seasonRatings:ratingPattern({seasons:18,elite:10,dominant:6,transcendent:3,base:7.82})},
  {name:'ATA maior da história extremo',position:'Centroavante',ga:1420,games:1080,peak:96,titles:41,champions:7,worldCups:1,ballons:9,goldenShoes:6,ntGames:165,ntGoals:125,ntAssists:45,reputation:100,seasons:20,seasonRatings:ratingPattern({seasons:20,elite:13,dominant:9,transcendent:5,base:8.18})},

  // Meias/volantes: mesma carreira da V10.6, agora ~5 posições abaixo do rank-base.
  {name:'MEI antigo patamar de elite',position:'Meia ofensivo',ga:820,games:900,peak:95,titles:30,champions:4,worldCups:1,ballons:4,goldenShoes:1,ntGames:135,ntGoals:50,ntAssists:35,reputation:100,seasons:18,seasonRatings:ratingPattern({seasons:18,elite:8,dominant:4,transcendent:1,base:7.35})},
  {name:'MEI extremo',position:'Meia ofensivo',ga:1100,games:1060,peak:96,titles:39,champions:6,worldCups:1,ballons:7,goldenShoes:2,ntGames:155,ntGoals:72,ntAssists:45,reputation:100,seasons:20,seasonRatings:ratingPattern({seasons:20,elite:13,dominant:9,transcendent:5,base:8.10})},
  {name:'Meia central lendário',position:'Meia central',ga:560,games:900,peak:94,avg:7.70,titles:25,champions:4,worldCups:1,ballons:2,goldenShoes:0,ntGames:135,ntGoals:38,ntAssists:48,reputation:98},
  {name:'MC panteão reforçado',position:'Meia central',ga:760,games:1010,peak:95,titles:35,champions:5,worldCups:1,ballons:4,ntGames:145,ntGoals:42,ntAssists:38,reputation:100,seasons:19,seasonRatings:ratingPattern({seasons:19,elite:11,dominant:6,transcendent:3,base:7.82})},
  {name:'Volante lendário',position:'Volante',ga:420,games:900,peak:94,avg:7.66,titles:27,champions:3,worldCups:1,ballons:2,goldenShoes:0,tackles:2500,cleanSheets:245,ntGames:130,ntGoals:24,ntAssists:34,reputation:97},
  {name:'VOL panteão reforçado',position:'Volante',ga:530,games:1000,peak:95,titles:34,champions:5,worldCups:1,ballons:3,tackles:3000,cleanSheets:290,ntGames:145,ntGoals:18,ntAssists:22,reputation:100,seasons:19,seasonRatings:ratingPattern({seasons:19,elite:10,dominant:6,transcendent:3,base:7.74,defensive:true})},
  {name:'VOL extremo',position:'Volante',ga:650,games:1110,peak:96,titles:40,champions:6,worldCups:1,ballons:5,tackles:3600,cleanSheets:340,ntGames:160,ntGoals:22,ntAssists:28,reputation:100,seasons:21,seasonRatings:ratingPattern({seasons:21,elite:13,dominant:9,transcendent:5,base:8.08,defensive:true})},

  // Defensores e goleiros: podem ser Top 10 quando lendários, mas nunca #1.
  {name:'Lateral de elite',position:'Lateral direito',ga:300,games:880,peak:93,avg:7.58,titles:25,champions:3,worldCups:1,ballons:0,goldenShoes:0,tackles:2350,cleanSheets:270,ntGames:125,ntGoals:12,ntAssists:32,reputation:94},
  {name:'Lateral extremo',position:'Lateral esquerdo',ga:540,games:1100,peak:96,titles:40,champions:6,worldCups:1,ballons:3,tackles:3600,cleanSheets:400,ntGames:160,ntGoals:18,ntAssists:35,reputation:100,seasons:21,seasonRatings:ratingPattern({seasons:21,elite:13,dominant:9,transcendent:5,base:8.06,defensive:true})},
  {name:'Zagueiro lendário',position:'Zagueiro',ga:130,games:900,peak:94,avg:7.68,titles:27,champions:3,worldCups:1,ballons:1,goldenShoes:0,tackles:2650,cleanSheets:305,ntGames:130,ntGoals:15,ntAssists:8,reputation:98},
  {name:'ZAG panteão reforçado',position:'Zagueiro',ga:190,games:1000,peak:95,titles:34,champions:5,worldCups:1,ballons:2,tackles:3250,cleanSheets:355,ntGames:145,ntGoals:14,ntAssists:6,reputation:100,seasons:19,seasonRatings:ratingPattern({seasons:19,elite:10,dominant:6,transcendent:3,base:7.74,defensive:true})},
  {name:'ZAG extremo',position:'Zagueiro',ga:240,games:1120,peak:96,titles:41,champions:6,worldCups:1,ballons:4,tackles:3850,cleanSheets:430,ntGames:160,ntGoals:18,ntAssists:7,reputation:100,seasons:21,seasonRatings:ratingPattern({seasons:21,elite:13,dominant:9,transcendent:5,base:8.08,defensive:true})},
  {name:'Goleiro antigo patamar GOAT',position:'Goleiro',ga:10,games:1000,peak:96,titles:32,champions:4,worldCups:1,ballons:3,goldenShoes:0,saves:3600,cleanSheets:370,ntGames:155,ntGoals:0,ntAssists:2,reputation:100,goalShare:0.2,seasons:18,seasonRatings:gkOldRatings},
  {name:'Goleiro panteão reforçado',position:'Goleiro',ga:12,games:1120,peak:96,titles:37,champions:5,worldCups:1,ballons:4,goldenShoes:0,saves:4250,cleanSheets:430,ntGames:150,ntGoals:0,ntAssists:2,reputation:100,goalShare:0.2,seasons:20,seasonRatings:ratingPattern({seasons:20,elite:11,dominant:7,transcendent:3,base:7.82,defensive:true})},
  {name:'Goleiro extremo',position:'Goleiro',ga:15,games:1240,peak:96,titles:43,champions:7,worldCups:1,ballons:7,goldenShoes:0,saves:5050,cleanSheets:505,ntGames:170,ntGoals:0,ntAssists:3,reputation:100,goalShare:0.2,seasons:22,seasonRatings:ratingPattern({seasons:22,elite:14,dominant:10,transcendent:5,base:8.22,defensive:true})}
];

const results=scenarios.map(evaluate);
console.table(results);
console.log('\nJSON');
console.log(JSON.stringify(results,null,2));

const byName=Object.fromEntries(results.map(r=>[r.nome,r]));
const numericRank=r=>r.resultado.startsWith('#')?Number(r.resultado.slice(1)):999;
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

// Ataque continua com possibilidade real de #1, mas apenas em cenário extremo.
assert(byName['ATA comum'].resultado==='Fora do Top 100','Regressão: carreira comum entrou no Top 100.');
assert(numericRank(byName['ATA antigo patamar GOAT'])>=6,'Regressão: antigo patamar GOAT voltou ao Top 5.');
assert(byName['ATA maior da história extremo'].resultado==='#1','Regressão: atacante extremo deixou de poder alcançar #1.');

// Todos os MEI/MC/VOL dentro do Top 100 devem terminar exatamente 5 posições abaixo do rank-base.
for(const name of ['MEI antigo patamar de elite','MEI extremo','Meia central lendário','MC panteão reforçado','Volante lendário','VOL panteão reforçado','VOL extremo']){
  const r=byName[name];
  assert(r.rankBase<=95,`Cenário ${name} não serve para testar deslocamento +5 (rank-base ${r.rankBase}).`);
  assert(r.ajustePosicao===5,`Regressão: ${name} não recebeu ajuste de +5 posições.`);
  assert(numericRank(r)===r.rankBase+5,`Regressão: ${name} deveria terminar 5 posições abaixo do rank-base.`);
}

// Nenhum defensor/goleiro pode ser #1, mesmo em uma carreira absurdamente dominante.
for(const name of ['Lateral extremo','ZAG panteão reforçado','ZAG extremo','Goleiro panteão reforçado','Goleiro extremo']){
  const r=byName[name];
  assert(numericRank(r)!==1,`Regressão: ${name} foi classificado em #1.`);
}
// Cenários defensivos lendários/extremos ainda podem entrar no Top 10.
for(const name of ['Zagueiro lendário','ZAG panteão reforçado','ZAG extremo','Goleiro panteão reforçado','Goleiro extremo']){
  const rank=numericRank(byName[name]);
  assert(rank>=2&&rank<=10,`Regressão: ${name} deveria poder ocupar #2–#10, recebeu #${rank}.`);
}

console.log('\nOK: todas as regressões do ranking histórico V10.7 foram aprovadas.');
