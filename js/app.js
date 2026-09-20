const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const STORAGE_KEY = 'beTheLegendV88';
const LEGACY_STORAGE_KEY = 'careerSimV7';
const BADGE_KEY = 'beTheLegendBadgeCacheV88';
const DRAFT_KEY = 'beTheLegendV88AttributeDraft';

let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem('beTheLegendV87') || localStorage.getItem('beTheLegendV86') || localStorage.getItem('beTheLegendV85') || localStorage.getItem('beTheLegendV84') || localStorage.getItem('beTheLegendV83') || localStorage.getItem('beTheLegendV82') || localStorage.getItem('beTheLegendV81') || localStorage.getItem('beTheLegendV80') || localStorage.getItem('beTheLegendV79') || localStorage.getItem('beTheLegendV781') || localStorage.getItem('beTheLegendV78') || localStorage.getItem('beTheLegendV77') || localStorage.getItem('beTheLegendV76') || localStorage.getItem('careerSimV75') || localStorage.getItem('careerSimV72') || localStorage.getItem(LEGACY_STORAGE_KEY)) || {
  created:false, player:null, season:null, history:[], offers:[], news:[], pendingEvent:null
};
let badgeCache = JSON.parse(localStorage.getItem(BADGE_KEY) || localStorage.getItem('beTheLegendBadgeCacheV87') || localStorage.getItem('beTheLegendBadgeCacheV86') || localStorage.getItem('beTheLegendBadgeCacheV85') || localStorage.getItem('beTheLegendBadgeCacheV84') || localStorage.getItem('beTheLegendBadgeCacheV83') || localStorage.getItem('beTheLegendBadgeCacheV82') || localStorage.getItem('beTheLegendBadgeCacheV81') || localStorage.getItem('beTheLegendBadgeCacheV80') || localStorage.getItem('beTheLegendBadgeCacheV79') || localStorage.getItem('beTheLegendBadgeCacheV781') || localStorage.getItem('beTheLegendBadgeCacheV78') || localStorage.getItem('beTheLegendBadgeCacheV77') || localStorage.getItem('beTheLegendBadgeCacheV76') || localStorage.getItem('careerSimBadgeCacheV75') || localStorage.getItem('careerSimBadgeCacheV72') || '{}');
let creationClubPool = [];
let creationChoices = [];
let nextEventCache = null;
let pendingSeasonCelebration = null;
let pendingPlayerProfile = null;
let attributeDraft = null;
let pendingCareerCard = false;
let awardCeremonyQueue = [];
let awardCeremonyAfter = null;
const MAX_MARKET_VALUE = 300000000;
try{
  const savedDraft=JSON.parse(sessionStorage.getItem(DRAFT_KEY)||'null');
  if(savedDraft?.attributeDraft&&savedDraft?.pendingPlayerProfile){attributeDraft=savedDraft.attributeDraft;pendingPlayerProfile=savedDraft.pendingPlayerProfile;}
}catch(_){sessionStorage.removeItem(DRAFT_KEY);}
function saveDraftState(){
  if(attributeDraft&&pendingPlayerProfile)sessionStorage.setItem(DRAFT_KEY,JSON.stringify({attributeDraft,pendingPlayerProfile}));
  else sessionStorage.removeItem(DRAFT_KEY);
}
function clearDraftState(){sessionStorage.removeItem(DRAFT_KEY);}

const DEFAULT_THEME = {accent:'#42e88d',secondary:'#f4f7f5',bg:'#071016',panel:'#0d1820',panel2:'#111f29',border:'#243640',buttonText:'#032313'};

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function saveBadges(){ localStorage.setItem(BADGE_KEY, JSON.stringify(badgeCache)); }
function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function sample(array,count){ return [...array].sort(()=>Math.random()-.5).slice(0,count); }
function shuffle(array){ return [...array].sort(()=>Math.random()-.5); }
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function marketValue(v){ return clamp(Math.round(v),150000,MAX_MARKET_VALUE); }
function money(v){ return '€ ' + (v >= 1e6 ? (v/1e6).toFixed(1)+' mi' : Math.round(v/1000)+' mil'); }
function toast(msg){ const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800); }
function countryByCode(code){ return COUNTRIES.find(c=>c.code===code); }

const DEFAULT_APPEARANCE={hairEnabled:true,hairStyle:'fade',hairColor:'#17120f',beardEnabled:false,beardStyle:'stubble',skin:'skin-3'};
const SPONSOR_BRANDS=[
  {name:'Nike',tone:'sponsor-nike',base:1450000},
  {name:'adidas',tone:'sponsor-adidas',base:1400000},
  {name:'PUMA',tone:'sponsor-puma',base:1220000},
  {name:'New Balance',tone:'sponsor-newbalance',base:980000},
  {name:'Under Armour',tone:'sponsor-underarmour',base:880000},
  {name:'Mizuno',tone:'sponsor-mizuno',base:790000},
  {name:'Umbro',tone:'sponsor-umbro',base:720000}
];
function isWorldCupYear(year){return Number(year)%4===2;}
function normalizeAppearance(a={}){return {...DEFAULT_APPEARANCE,...a,hairEnabled:a.hairEnabled!==false,beardEnabled:!!a.beardEnabled};}
function currentAppearanceFromForm(){
  return normalizeAppearance({
    hairEnabled:$('#appearance-hair-enabled')?.value!=='no',
    hairStyle:$('#appearance-hair-style')?.value||'fade',
    hairColor:$('#appearance-hair-color')?.value||'#17120f',
    beardEnabled:$('#appearance-beard-enabled')?.value==='yes',
    beardStyle:$('#appearance-beard-style')?.value||'stubble',
    skin:$('#appearance-skin')?.value||'skin-3'
  });
}
function appearanceMarkup(appearance=DEFAULT_APPEARANCE,compact=false,number='10'){
  const a=normalizeAppearance(appearance),hairClass=a.hairEnabled?`hair-${a.hairStyle}`:'hair-bald',beardClass=a.beardEnabled?`beard-${a.beardStyle}`:'beard-none';
  return `<div class="player-face ${a.skin} ${hairClass} ${beardClass} ${compact?'compact':''}" style="--hair-color:${a.hairColor}"><span class="face-ear ear-left"></span><span class="face-ear ear-right"></span><span class="face-hair"></span><span class="face-brow brow-left"></span><span class="face-brow brow-right"></span><span class="face-eye eye-left"></span><span class="face-eye eye-right"></span><span class="face-nose"></span><span class="face-mouth"></span><span class="face-beard"></span><span class="face-neck"></span><span class="face-jersey"><b>${number}</b></span></div>`;
}
function updateAppearancePreview(){const box=$('#appearance-preview');if(box)box.innerHTML=appearanceMarkup(currentAppearanceFromForm(),false,$('#number')?.value||'10');}
function nationalInteractionLimit(s=state.season){return s&&isWorldCupYear(s.year)?3:1;}

const CLUB_BADGE_ALIASES = {
  'Bayern de Munique':['Bayern München','Bayern Munich'],
  'Inter de Milão':['Inter','Inter Milan'],
  'Milan':['Milan','AC Milan'],
  'Betis':['Real Betis'],
  'Atlético de Madrid':['Atletico Madrid'],
  'Paris Saint-Germain':['Paris Saint-Germain'],
  'Sporting CP':['Sporting CP'],
  'Tottenham':['Tottenham','Tottenham Hotspur'],
  'West Ham':['West Ham','West Ham United'],
  'Newcastle United':['Newcastle United','Newcastle'],
  'Nottingham Forest':['Nottingham Forest'],
  'Vitória de Guimarães':['Vitória de Guimarães','Vitoria SC','Guimaraes'],
  'Beşiktaş':['Besiktas'],
  'Fenerbahçe':['Fenerbahce'],
  'İstanbul Başakşehir':['Istanbul Basaksehir','Basaksehir'],
  'Guadalajara':['Guadalajara','Chivas','Chivas Guadalajara'],
  'Tigres UANL':['Tigres UANL','Tigres'],
  'Los Angeles FC':['Los Angeles FC','LAFC'],
  'Yokohama F. Marinos':['Yokohama F Marinos','Yokohama Marinos'],
  'Atlético Mineiro':['Atlético Mineiro','Atletico Mineiro','Atletico-MG'],
  'Grêmio':['Grêmio','Gremio'],
  'São Paulo':['São Paulo','Sao Paulo'],
  'Peñarol':['Peñarol','Penarol'],
  'Atlético Nacional':['Atlético Nacional','Atletico Nacional'],
  'América de Cali':['América de Cali','America de Cali'],
  'Independiente Medellín':['Independiente Medellín','Independiente Medellin'],
  'Universidad Católica':['Universidad Católica','Universidad Catolica'],
  'PSV':['PSV Eindhoven','PSV'],
  'Porto':['FC Porto','Porto'],
  'Internacional':['Internacional','SC Internacional'],
  'Corinthians':['Corinthians','SC Corinthians Paulista'],
  'América':['Club América','Club America','America'],
  'Inter Miami':['Inter Miami CF','Inter Miami'],
  'LA Galaxy':['LA Galaxy','Los Angeles Galaxy'],
  'Al-Nassr':['Al Nassr'],
  'Al-Hilal':['Al Hilal'],
  'Al-Ittihad':['Al Ittihad'],
  'Al-Ahli':['Al Ahli'],
  'Al-Shabab':['Al Shabab'],
  'Liverpool Montevideo':['Liverpool Montevideo'],
  'Club Brugge':['Club Brugge','Club Brugge KV'],
  'Union Saint-Gilloise':['Union Saint-Gilloise','Royale Union Saint-Gilloise'],
  'Kawasaki Frontale':['Kawasaki Frontale'],
  'Urawa Red Diamonds':['Urawa Red Diamonds','Urawa Reds'],
  'Vissel Kobe':['Vissel Kobe'],
  'Kashima Antlers':['Kashima Antlers'],
  'Athletic Club':['Athletic Club','Athletic Bilbao']
};
const CLUB_COUNTRY_SLUG={BR:'brazil',AR:'argentina',UY:'uruguay',CO:'colombia',CL:'chile',ES:'spain',ENG:'england',SCO:'scotland',GB:'united-kingdom',DE:'germany',IT:'italy',FR:'france',PT:'portugal',NL:'netherlands',BE:'belgium',TR:'turkey',MX:'mexico',US:'usa',JP:'japan',SA:'saudi-arabia'};
const CLUB_LOGO_CATALOG_URL='https://raw.githubusercontent.com/hixcoder/football-teams-flags/refs/heads/main/football_teams.json';
let clubLogoCatalogPromise=null;
function stripDiacritics(str=''){ return str.normalize('NFD').replace(/[̀-ͯ]/g,''); }
function normalizeKey(str=''){ return stripDiacritics(str).toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,''); }
function slugifyClub(name=''){ return stripDiacritics(name).toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function fallbackClubDataUri(name='Clube'){
  const initials=(name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('')||'FC').toUpperCase();
  const label=(name.length>18?name.slice(0,18)+'…':name).replace(/&/g,'&amp;');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#0e1b22"/><stop offset="1" stop-color="#1f3b48"/></linearGradient></defs><path d="M48 5l32 11v22c0 22-15 40-32 53C31 78 16 60 16 38V16L48 5z" fill="url(#g)" stroke="#d8efe6" stroke-width="3"/><text x="48" y="46" text-anchor="middle" fill="#d8efe6" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700">${initials}</text><text x="48" y="66" text-anchor="middle" fill="#7ce7a7" font-size="8" font-family="Arial, Helvetica, sans-serif">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function fallbackTrophyDataUri(name='Título'){
  const label=(name.length>22?name.slice(0,22)+'…':name).replace(/&/g,'&amp;');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="18" fill="#0e171d"/><path d="M33 20h30v8c0 11-6 21-15 27-9-6-15-16-15-27v-8zm-8 6h8v7c0 4-3 8-8 8-4 0-7-4-7-8 0-4 3-7 7-7zm46 0h8c4 0 7 3 7 7 0 4-3 8-7 8-5 0-8-4-8-8v-7zM42 55h12v10h10v7H32v-7h10V55z" fill="#f2c94c"/><text x="48" y="84" text-anchor="middle" fill="#eef3f5" font-size="8" font-family="Arial, Helvetica, sans-serif">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
async function ensureClubLogoCatalog(){
  if(clubLogoCatalogPromise) return clubLogoCatalogPromise;
  clubLogoCatalogPromise=fetch(CLUB_LOGO_CATALOG_URL).then(r=>r.ok?r.json():[]).then(rows=>Array.isArray(rows)?rows:[]).catch(()=>[]);
  return clubLogoCatalogPromise;
}
function repoFileVariants(name=''){
  const manual={'Bayern de Munique':['Bayern_Munchen','Bayern_Munich','FC_Bayern_Munchen'],'Inter de Milão':['Inter','Inter_Milan'],'Milan':['Milan','AC_Milan'],'Betis':['Real_Betis'],'Atlético de Madrid':['Atletico_Madrid'],'Paris Saint-Germain':['Paris_Saint-Germain','Paris_Saint_Germain'],'Sporting CP':['Sporting_CP'],'Tottenham':['Tottenham_Hotspur'],'West Ham':['West_Ham_United'],'Porto':['FC_Porto'],'Benfica':['Benfica','SL_Benfica'],'Vitória de Guimarães':['Vitoria_de_Guimaraes'],'Beşiktaş':['Besiktas'],'Fenerbahçe':['Fenerbahce'],'İstanbul Başakşehir':['Istanbul_Basaksehir'],'América':['Club_America','America'],'Guadalajara':['Guadalajara','Chivas'],'Tigres UANL':['Tigres_UANL'],'Los Angeles FC':['Los_Angeles_FC'],'Yokohama F. Marinos':['Yokohama_F_Marinos'],'Atlético Mineiro':['Atletico_Mineiro'],'Grêmio':['Gremio'],'São Paulo':['Sao_Paulo'],'Peñarol':['Penarol'],'Atlético Nacional':['Atletico_Nacional'],'América de Cali':['America_de_Cali'],'Independiente Medellín':['Independiente_Medellin'],'Universidad Católica':['Universidad_Catolica'],'PSV':['PSV_Eindhoven','PSV'],'Inter Miami':['Inter_Miami','Inter_Miami_CF']};
  const base=[name,stripDiacritics(name)].map(x=>x.replace(/\s+/g,'_').replace(/\./g,'').replace(/'/g,''));
  return [...new Set([...(manual[name]||[]),...base].filter(Boolean))];
}
function clubCodeFor(name){const found=allTransferClubs().find(c=>c.name===name)?.countryCode;if(found)return found;return state.player?.club===name?(state.player.clubCountry||''):'';}
function clubAliasCandidates(name=''){
  const aliases=CLUB_BADGE_ALIASES[name]||[];
  const extra=[name,stripDiacritics(name),name.replace(/\bFC\b/gi,'').trim(),name.replace(/\bSC\b/gi,'').trim(),name.replace(/\bCF\b/gi,'').trim()];
  return [...new Set([...aliases,...extra].filter(Boolean))];
}
async function exactClubBadge(name){
  if(!name) return '';
  if(badgeCache[name]) return badgeCache[name];
  const rows=await ensureClubLogoCatalog();
  if(rows?.length){
    const candidates=clubAliasCandidates(name).map(normalizeKey);
    const direct=rows.find(r=>candidates.includes(normalizeKey(r.name||''))) || rows.find(r=>candidates.some(c=>normalizeKey(r.name||'').includes(c)||c.includes(normalizeKey(r.name||''))));
    if(direct?.logoUrl){badgeCache[name]=direct.logoUrl;saveBadges();return direct.logoUrl;}
  }
  return '';
}
function clubBadgeSources(name,exact=''){
  const country=CLUB_COUNTRY_SLUG[clubCodeFor(name)]||'england';
  const slug=slugifyClub((CLUB_BADGE_ALIASES[name]?.[0]||name));
  const sources=[exact,`https://assets.football-logos.cc/logos/${country}/256x256/${slug}.png`];
  for(const file of repoFileVariants(name))sources.push(`https://raw.githubusercontent.com/JoseArroyave/football-logos/refs/heads/main/logos/${country}/${encodeURIComponent(file)}.svg`);
  sources.push(fallbackClubDataUri(name),'assets/fallback-club.svg');
  return [...new Set(sources.filter(Boolean))];
}
function averageCornerColor(data,w,h){
  const pts=[[1,1],[w-2,1],[1,h-2],[w-2,h-2]],colors=pts.map(([x,y])=>{const i=(y*w+x)*4;return [data[i],data[i+1],data[i+2],data[i+3]];});
  const alpha=colors.reduce((s,c)=>s+c[3],0)/colors.length;if(alpha<180)return null;
  const avg=[0,1,2].map(k=>colors.reduce((s,c)=>s+c[k],0)/colors.length);const spread=Math.max(...colors.flatMap(c=>avg.map((a,k)=>Math.abs(c[k]-a))));
  return spread<=34?avg:null;
}
function processFlatBackground(img,source){
  try{
    const w=source.naturalWidth||source.width,h=source.naturalHeight||source.height;if(!w||!h||w*h>3500000)return;
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0,w,h);
    const image=ctx.getImageData(0,0,w,h),data=image.data,bg=averageCornerColor(data,w,h);if(!bg)return;
    // Remove only pixels connected to the outer edge. This avoids punching holes
    // inside a silver/white trophy that happens to share a colour with the backdrop.
    const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0,touched=0;
    const colourDistance=idx=>Math.hypot(data[idx*4]-bg[0],data[idx*4+1]-bg[1],data[idx*4+2]-bg[2]);
    const enqueue=(x,y)=>{if(x<0||x>=w||y<0||y>=h)return;const pos=y*w+x;if(seen[pos])return;const d=colourDistance(pos);if(d>66)return;seen[pos]=1;queue[tail++]=pos;};
    for(let x=0;x<w;x++){enqueue(x,0);enqueue(x,h-1);}for(let y=1;y<h-1;y++){enqueue(0,y);enqueue(w-1,y);}
    while(head<tail){const pos=queue[head++],x=pos%w,y=(pos/w)|0,d=colourDistance(pos),i=pos*4;data[i+3]=d<38?0:Math.round(data[i+3]*Math.max(0,Math.min(1,(d-38)/28)));touched++;enqueue(x-1,y);enqueue(x+1,y);enqueue(x,y-1);enqueue(x,y+1);}
    if(touched/(w*h)<.035)return;ctx.putImageData(image,0,0);img.dataset.bgCleaned='1';img.src=canvas.toDataURL('image/png');
  }catch(_){/* CORS or unsupported image: keep original safely. */}
}
function polishSiteImage(img){
  if(!img||img.dataset.bgCleaned||img.dataset.bgCleaning)return;img.style.background='transparent';const src=img.currentSrc||img.src||'';
  if(!src||/\.svg(?:\?|$)/i.test(src)||src.startsWith('data:image/svg'))return;
  if(/^https?:/i.test(src)){
    img.dataset.bgCleaning='1';const probe=new Image();probe.crossOrigin='anonymous';probe.onload=()=>{delete img.dataset.bgCleaning;processFlatBackground(img,probe);if(/Brasileir/i.test(img.alt||'')&&!img.dataset.bgCleaned)window.cycleHonourImage?.(img);};probe.onerror=()=>{delete img.dataset.bgCleaning;if(/Brasileir/i.test(img.alt||''))window.cycleHonourImage?.(img);};probe.src=src;return;
  }
  processFlatBackground(img,img);
}
function polishAllSiteImages(root=document){
  if(!root?.querySelectorAll)return;root.querySelectorAll('img').forEach(img=>{if(img.complete&&img.naturalWidth)polishSiteImage(img);else img.addEventListener('load',()=>polishSiteImage(img),{once:true});});
}
function observeSiteImages(){
  polishAllSiteImages(document);
  if(typeof MutationObserver==='undefined')return;
  const observer=new MutationObserver(mutations=>mutations.forEach(m=>m.addedNodes.forEach(node=>{if(node?.nodeType!==1)return;if(node.tagName==='IMG')polishAllSiteImages(node.parentElement||document);else polishAllSiteImages(node);})));observer.observe(document.body,{childList:true,subtree:true});
}
function applyImageSources(img,sources,fallback){if(!img)return;const list=sources.filter(Boolean);let i=0;const next=()=>{if(i>=list.length){img.classList.add('hidden');fallback?.classList.remove('hidden');return;}img.onerror=next;img.onload=()=>{img.classList.remove('hidden');fallback?.classList.add('hidden');polishSiteImage(img);};img.src=list[i++];};next();}
// Real-life trophy photography/renders are always first. Local artwork is terminal fallback only.
const TROPHY_ART=[
  {test:/Eliminat[oó]rias da Copa do Mundo/i,urls:['assets/trophies/world-cup-qualifiers.svg'],kind:'competition-mark'},
  {test:/FIFA World Cup|Copa do Mundo/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/n0mwq71650790783.png','https://commons.wikimedia.org/wiki/Special:FilePath/FIFA_World_Cup_Trophy.jpg','assets/trophies/fifa-world-cup.svg'],kind:'real-trophy'},
  {test:/FIFA Club World Cup|Mundial/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/a9owwp1750014610.png','assets/trophies/club-world-cup.svg'],kind:'real-trophy'},
  {test:/UEFA Champions League/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/jkil3z1747884991.png','https://commons.wikimedia.org/wiki/Special:FilePath/Champions_league_trophy.jpg','assets/trophies/champions-league.svg'],kind:'real-trophy'},
  {test:/UEFA Europa League/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/cmqrd51747884363.png','assets/trophies/europa-league.svg'],kind:'real-trophy'},
  {test:/UEFA Conference League/i,urls:['https://az.trend.az/media/2024/12/12/conference_league.jpg','assets/trophies/conference-league.svg'],kind:'real-trophy'},
  {test:/CONMEBOL Libertadores/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/wuo2p41696615728.png','https://upload.wikimedia.org/wikipedia/commons/3/39/Ta%C3%A7aLibertadores2024.jpg','assets/trophies/libertadores.svg'],kind:'real-trophy'},
  {test:/CONMEBOL Sul-Americana/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/bmx40o1651006251.png','assets/trophies/sudamericana.svg'],kind:'real-trophy'},
  {test:/CONCACAF Champions Cup/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/6qrtgk1650831532.png','assets/trophies/concacaf-champions-cup.svg'],kind:'real-trophy'},
  {test:/AFC Champions League Elite/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/k9ycaa1747120551.png','assets/trophies/afc-champions-elite.svg'],kind:'real-trophy'},
  {test:/AFC Champions League Two/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/d6y5dn1747120731.png','assets/trophies/afc-champions-two.svg'],kind:'real-trophy'},
  {test:/CAF Champions League/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/elh0rb1782708713.png','assets/trophies/caf-champions-league.svg'],kind:'real-trophy'},
  {test:/OFC Champions League/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/9q7kf91755713207.png','assets/trophies/ofc-champions-league.svg'],kind:'real-trophy'},

  {test:/Scottish Premiership|Premier League \/ Premiership/i,urls:['https://files.tips.gg/static/image/news/Scottish-Premiership-Trophy.jpg','assets/trophies/scottish-premiership.svg'],kind:'real-trophy'},
  {test:/Premier League/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/6nw7za1650642103.png','assets/trophies/premier-league.svg'],kind:'real-trophy'},
  {test:/Brasileir[aã]o/i,urls:['https://commons.wikimedia.org/wiki/Special:FilePath/Trof%C3%A9u_Campeonato_Brasileiro_2024.jpg','assets/trophies/brasileirao-transparent.svg','assets/trophies/brasileirao.svg'],kind:'real-trophy'},
  {test:/Liga Profesional Argentina/i,urls:['https://media.tycsports.com/files/2025/12/11/909243/trofeo-lpf_862x485.webp','https://cdn.eldestapeweb.com/eldestape/022026/1771880856075/torneo-apertura-webp..webp?ch=676&cw=1200','assets/trophies/liga-profesional-argentina.svg'],kind:'real-trophy'},
  {test:/Primera Divisi[oó]n Uruguaia/i,urls:['https://imgs.elpais.com.uy/dims4/default/4c928c6/2147483647/strip/false/crop/1805x1230%2B0%2B0/resize/1200x818%21/quality/90/?url=https%3A%2F%2Fel-pais-uruguay-production-web.s3.us-east-1.amazonaws.com%2Fbrightspot%2F72%2Fde%2F418a05b9406888cc84a9bc0e76d2%2Fliverpool-vs-nacional-13103545.jpg','assets/trophies/campeonato-uruguayo.svg'],kind:'real-trophy'},
  {test:/Categor[ií]a Primera A/i,urls:['https://files.winsports.co/cms/2026/02/21175629/Joven-delantero-rescindiria-su-contrato-con-club-campeon-de-Liga-BetPlay-VizzorImage.jpg?r=1_1','assets/trophies/liga-betplay.svg'],kind:'real-trophy'},
  {test:/Primera Divisi[oó]n do Chile/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/4fovsy1747119113.png','assets/trophies/campeonato-chileno.svg'],kind:'real-trophy'},
  {test:/LaLiga/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/nco20w1650642293.png','assets/trophies/laliga.svg'],kind:'real-trophy'},
  {test:/Bundesliga/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/2h65bk1650459989.png','assets/trophies/bundesliga.svg'],kind:'real-trophy'},
  {test:/Serie A/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/ulm5h21650642920.png','assets/trophies/serie-a.svg'],kind:'real-trophy'},
  {test:/Ligue 1/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/oj1nt71650790210.png','assets/trophies/ligue-1.svg'],kind:'real-trophy'},
  {test:/Primeira Liga/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/kn8lcb1726462032.png','assets/trophies/primeira-liga.svg'],kind:'real-trophy'},
  {test:/Eredivisie/i,urls:['https://commons.wikimedia.org/wiki/Special:FilePath/Eredivisie_Trophy.png','assets/trophies/eredivisie.svg'],kind:'real-trophy'},
  {test:/Belgian Pro League/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/7vtwlw1651311242.png','assets/trophies/belgian-pro-league.svg'],kind:'real-trophy'},
  {test:/Süper Lig|Super Lig/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/61tliv1651315359.png','assets/trophies/super-lig.svg'],kind:'real-trophy'},
  {test:/Liga MX/i,urls:['https://commons.wikimedia.org/wiki/Special:FilePath/Liga_MX_Trophy.jpg','assets/trophies/liga-mx.svg'],kind:'real-trophy'},
  {test:/Major League Soccer/i,urls:['https://media.tiffany.com/is/image/tco/Search_Image_7x5_Soccer','https://commons.wikimedia.org/wiki/Special:FilePath/MLS_Cup.svg','assets/trophies/mls.svg'],kind:'real-trophy'},
  {test:/J1 League/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/p97twq1655894364.png','assets/trophies/j1-league.svg'],kind:'real-trophy'},
  {test:/Saudi Pro League/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/71r6nh1747536339.png','assets/trophies/saudi-pro-league.svg'],kind:'real-trophy'},

  {test:/Copa do Brasil/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/dn1f2q1773714824.png','assets/trophies/copa-do-brasil.svg'],kind:'real-trophy'},
  {test:/Copa Argentina/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/kcxstl1735693591.png','assets/trophies/copa-argentina.svg'],kind:'real-trophy'},
  {test:/Copa AUF Uruguay/i,urls:['https://assets.debate.com.uy/__export/1761093037830/sites/debate/img/2025/10/21/copa_auf_jpg_830916777.jpeg_423682103.jpeg','assets/trophies/copa-auf-uruguay.svg'],kind:'real-trophy'},
  {test:/Copa Colombia/i,urls:['https://commons.wikimedia.org/wiki/Special:FilePath/Copa_Betplay_Trophy.png','https://assets.directvsports.com/__export/1766488475592/sites/dsports/img/2025/12/23/cop-141036.jpg_264373127.jpg','assets/trophies/copa-colombia.svg'],kind:'real-trophy'},
  {test:/Copa Chile/i,urls:['https://s3.us-east-2.amazonaws.com/img2.eltipografo.cl/media/2025/12/03I0253-1024x683-1-750x500.jpg','assets/trophies/copa-chile.svg'],kind:'real-trophy'},
  {test:/Scottish Cup/i,urls:['https://i2-prod.footballscotland.co.uk/article15668702.ece/ALTERNATES/s1200c/0_JS120858836.jpg','assets/trophies/scottish-cup.svg'],kind:'real-trophy'},
  {test:/Copa MX/i,urls:['https://www.milenio.com/uploads/media/2019/11/06/trofeo-de-la-copa-mx-2_0_21_958_596.jpg','assets/trophies/copa-mx.svg'],kind:'real-trophy'},
  {test:/Copa da B[eé]lgica|Belgian Cup/i,urls:['https://statics-maker.llt-services.com/prl/images/2024/09/09/original/9464e3bd-995f-49a5-a54b-0356fab24c13-15.jpg','assets/trophies/belgian-cup.svg'],kind:'real-trophy'},
  {test:/Copa da Turquia|Turkish Cup/i,urls:['https://bismilhabercomtr.teimg.com/bismilhaber-com-tr/uploads/2024/05/besiktas-turkiye-kupasini-11-kez-kazandi.jpg','https://img.piri.net/piri/upload/3/2024/12/20/ce33b6a6-imuui92475r3y7arfa2iga.jpeg','assets/trophies/turkish-cup.svg'],kind:'real-trophy'},
  {test:/Copa do Imperador|Emperor/i,urls:['https://www.jleague.jp/img/news/2022/09/23261.jpg?_=1662553116','assets/trophies/emperors-cup.svg'],kind:'real-trophy'},
  {test:/Copa do Rei|Copa del Rey/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/4f9dox1650576268.png','assets/trophies/copa-del-rey.svg'],kind:'real-trophy'},
  {test:/Coppa Italia/i,urls:['https://commons.wikimedia.org/wiki/Special:FilePath/Coppa_Italia_trophy_icon.jpg','assets/trophies/coppa-italia.svg'],kind:'real-trophy'},
  {test:/Coupe de France/i,urls:['https://commons.wikimedia.org/wiki/Special:FilePath/Coupe_de_France_trophy.png','assets/trophies/coupe-de-france.svg'],kind:'real-trophy'},
  {test:/DFB-Pokal/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/y3j8971697171355.png','assets/trophies/dfb-pokal.svg'],kind:'real-trophy'},
  {test:/FA Cup/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/6go3jj1755713117.png','assets/trophies/fa-cup.svg'],kind:'real-trophy'},
  {test:/KNVB Beker/i,urls:['https://r2.thesportsdb.com/images/media/league/trophy/mfvzr81611677287.png/medium','assets/trophies/knvb-beker.svg'],kind:'real-trophy'},
  {test:/King Cup/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/8bemyo1754244467.png','assets/trophies/king-cup.svg'],kind:'real-trophy'},
  {test:/Taça de Portugal/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/n6xp1q1651313641.png','assets/trophies/taca-de-portugal.svg'],kind:'real-trophy'},
  {test:/U\.S\. Open Cup|US Open Cup/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/ux8kje1655030140.png','assets/trophies/us-open-cup.svg'],kind:'real-trophy'},

  {test:/Bola de Ouro|Ballon d/i,urls:['https://www.thesportsdb.com/images/media/honour/trophy/octewt1650480648.png','assets/trophies/ballon-dor.svg'],kind:'real-trophy'},
  {test:/Chuteira de Ouro|European Golden Shoe/i,urls:['assets/trophies/golden-shoe-transparent.png','https://www.365scores.com/pt-br/news/magazine/wp-content/uploads/2025/05/Chuteira-Ouro.jpg','assets/trophies/golden-shoe.svg'],kind:'real-trophy'},
  {test:/Melhor Jogador Jovem|Kopa Trophy/i,urls:['https://en.dragoparis.com/media/wysiwyg/blog/savoir-faire/trophee-sportif-kopa-ballon-d-or.jpg','assets/trophies/golden-boy.svg'],kind:'real-trophy'},
  // There is no single physical "Team of the Season" cup; this remains a season-XI visual, not a fake trophy.
  {test:/Time da Temporada/i,urls:['assets/trophies/tots.svg'],kind:'award-visual'}
];
function trophyEntryFor(name){return TROPHY_ART.find(x=>x.test.test(name||''))||null;}
function trophySourcesFor(name){const hit=trophyEntryFor(name);return [...(hit?.urls||[]),'assets/fallback-trophy.svg'];}
function trophyArtFor(name){return trophySourcesFor(name)[0];}
function honourInitials(name){return (name||'BTL').split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]).join('').toUpperCase();}
function honourVisual(name){const sources=trophySourcesFor(name),encoded=sources.map(encodeURIComponent).join('|');return `<span class="honour-art"><img src="${sources[0]}" data-sources="${encoded}" data-index="0" alt="${name}" loading="eager" fetchpriority="high" decoding="async" referrerpolicy="no-referrer" onload="polishSiteImage(this)" onerror="cycleHonourImage(this)"><b>${honourInitials(name)}</b></span>`;}
window.cycleHonourImage=function(img){const sources=(img.dataset.sources||'').split('|').map(decodeURIComponent).filter(Boolean),i=Number(img.dataset.index||0)+1;if(i<sources.length){img.dataset.index=String(i);delete img.dataset.bgCleaned;delete img.dataset.bgCleaning;img.src=sources[i];return;}const parent=img.parentElement;img.remove();parent?.classList.add('fallback');};
const TROPHY_PRELOAD_CACHE=[];
function preloadTrophyImages(){
  const urls=[...new Set(TROPHY_ART.filter(x=>x.kind==='real-trophy').map(x=>x.urls[0]).filter(u=>/^https?:/i.test(u)))];
  urls.forEach(url=>{const img=new Image();img.decoding='async';img.referrerPolicy='no-referrer';img.src=url;TROPHY_PRELOAD_CACHE.push(img);});
}

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
function getLeagueFormatForClub(code,leagueName=''){
  return (typeof MARKET_LEAGUE_FORMATS!=='undefined'&&MARKET_LEAGUE_FORMATS[leagueName]) || getLeagueFormat(code);
}
function findClubData(name,code){
  const market=(typeof TRANSFER_MARKET_CLUBS!=='undefined'?TRANSFER_MARKET_CLUBS:[]).find(c=>c.name===name&&(!code||c.countryCode===code));
  const local=(LOCAL_CLUBS[code]||[]).find(c=>c.name===name);
  const transfer=TRANSFER_TARGETS.find(c=>c.name===name&&(!code||c.countryCode===code));
  return market || local || transfer || null;
}
function findClubDataAny(name){
  const market=(typeof TRANSFER_MARKET_CLUBS!=='undefined'?TRANSFER_MARKET_CLUBS:[]).find(c=>c.name===name);if(market)return market;
  for(const clubs of Object.values(LOCAL_CLUBS)){ const hit=clubs.find(c=>c.name===name); if(hit)return hit; }
  return TRANSFER_TARGETS.find(c=>c.name===name) || null;
}
function clubStrength(name,code){ return findClubData(name,code)?.strength || findClubDataAny(name)?.strength || 72; }
function normalizedClub(raw,code){ return {name:raw.name||raw.strTeam,strength:raw.strength||72,badge:raw.badge||raw.strBadge||'',countryCode:code}; }
function allTransferClubs(){
  const fromLocal=Object.entries(LOCAL_CLUBS).flatMap(([countryCode,clubs])=>clubs.map(c=>({...c,countryCode})));
  const market=typeof TRANSFER_MARKET_CLUBS!=='undefined'?TRANSFER_MARKET_CLUBS:[];
  const all=[...fromLocal,...TRANSFER_TARGETS,...market];
  return [...new Map(all.map(c=>[`${c.countryCode}:${c.name}`,c])).values()];
}
function clubCompetitionProfile(name,code){
  const c=findClubData(name,code)||{};const base=getCompetitionRule(code,countryByCode(code)?.name||code);
  return {league:c.league||base.league,cup:c.cup||base.cup,divisionLevel:c.divisionLevel||1,continental:c.divisionLevel>1?[]:(base.continental||[])};
}
function canonicalClubCountryCode(name,fallback=''){
  if(!name)return fallback||'';
  const localHits=Object.entries(LOCAL_CLUBS).filter(([,clubs])=>clubs.some(c=>c.name===name)).map(([code])=>code);
  const poolHits=Object.entries(LEAGUE_CLUB_POOLS||{}).filter(([,clubs])=>clubs.includes(name)).map(([code])=>code);
  const transferHits=(TRANSFER_TARGETS||[]).filter(c=>c.name===name).map(c=>c.countryCode);
  const marketHits=(typeof TRANSFER_MARKET_CLUBS!=='undefined'?TRANSFER_MARKET_CLUBS:[]).filter(c=>c.name===name).map(c=>c.countryCode);
  const hits=[...new Set([...localHits,...poolHits,...transferHits,...marketHits])];
  if(hits.length===1)return hits[0];
  if(fallback&&hits.includes(fallback))return fallback;
  return hits[0]||fallback||'';
}
function leagueForClub(name,fallbackCode=''){
  const code=canonicalClubCountryCode(name,fallbackCode);
  return clubCompetitionProfile(name,code).league;
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

const ATTRIBUTE_DRAFT_FIELDS = [
  {id:'pace',label:'Ritmo',short:'RIT'},
  {id:'finishing',label:'Finalização',short:'FIN'},
  {id:'dribbling',label:'Drible',short:'DRI'},
  {id:'passing',label:'Passe',short:'PAS'},
  {id:'defense',label:'Defesa',short:'DEF'},
  {id:'physical',label:'Físico',short:'FIS'},
  {id:'weakFoot',label:'Perna ruim',short:'PR'}
];
const ATTRIBUTE_ICONS = {
  pace:'⚡',finishing:'🎯',dribbling:'🪄',passing:'🧠',defense:'🛡️',physical:'💪',weakFoot:'👣'
};

function legendAttributeSet(player){
  if(player?.attributes)return {...player.attributes};
  return {pace:75,finishing:75,dribbling:75,passing:75,defense:60,physical:70,weakFoot:3};
}
function attributeDisplayValue(id,value){return id==='weakFoot'?`${value}★`:value;}
function weakFootPotentialValue(stars){return ({1:60,2:70,3:80,4:90,5:99})[stars]||80;}

// Cada posição valoriza características diferentes. Esses pesos influenciam o
// potencial, o rendimento em campo e a velocidade de evolução dos atributos.
const POSITION_ATTRIBUTE_WEIGHTS = {
  'Goleiro':{pace:.08,finishing:.02,dribbling:.05,passing:.15,defense:.42,physical:.20,weakFoot:.08},
  'Zagueiro':{pace:.15,finishing:.04,dribbling:.06,passing:.10,defense:.34,physical:.20,weakFoot:.11},
  'Lateral direito':{pace:.22,finishing:.05,dribbling:.13,passing:.14,defense:.22,physical:.14,weakFoot:.10},
  'Lateral esquerdo':{pace:.22,finishing:.05,dribbling:.13,passing:.14,defense:.22,physical:.14,weakFoot:.10},
  'Volante':{pace:.10,finishing:.06,dribbling:.12,passing:.22,defense:.24,physical:.16,weakFoot:.10},
  'Meia central':{pace:.10,finishing:.10,dribbling:.20,passing:.28,defense:.10,physical:.12,weakFoot:.10},
  'Meia ofensivo':{pace:.12,finishing:.18,dribbling:.24,passing:.24,defense:.05,physical:.07,weakFoot:.10},
  'Meia direita':{pace:.20,finishing:.12,dribbling:.22,passing:.22,defense:.06,physical:.08,weakFoot:.10},
  'Meia esquerda':{pace:.20,finishing:.12,dribbling:.22,passing:.22,defense:.06,physical:.08,weakFoot:.10},
  'Ponta direita':{pace:.24,finishing:.22,dribbling:.24,passing:.10,defense:.03,physical:.06,weakFoot:.11},
  'Ponta esquerda':{pace:.24,finishing:.22,dribbling:.24,passing:.10,defense:.03,physical:.06,weakFoot:.11},
  'Segundo atacante':{pace:.16,finishing:.28,dribbling:.22,passing:.12,defense:.03,physical:.08,weakFoot:.11},
  'Centroavante':{pace:.15,finishing:.35,dribbling:.12,passing:.07,defense:.03,physical:.16,weakFoot:.12}
};
const DEFAULT_ATTRIBUTE_WEIGHTS={pace:.15,finishing:.15,dribbling:.15,passing:.15,defense:.15,physical:.15,weakFoot:.10};
function positionAttributeWeights(position){return POSITION_ATTRIBUTE_WEIGHTS[position]||DEFAULT_ATTRIBUTE_WEIGHTS;}
function primaryAttributeForPosition(position){
  const w=positionAttributeWeights(position);return Object.entries(w).filter(([id])=>id!=='weakFoot').sort((a,b)=>b[1]-a[1])[0][0];
}
function normalizedAttributeValue(id,value){return id==='weakFoot'?weakFootPotentialValue(value):Number(value)||0;}
function weightedAttributeAverage(attributes,position,onlyIds=null){
  const weights=positionAttributeWeights(position);const ids=onlyIds||ATTRIBUTE_DRAFT_FIELDS.map(f=>f.id);
  let total=0,weightTotal=0;ids.forEach(id=>{if(attributes[id]===undefined)return;const w=weights[id]||0;total+=normalizedAttributeValue(id,attributes[id])*w;weightTotal+=w;});
  return weightTotal?total/weightTotal:68;
}
function calculatePotentialFromAttributes(attributes,position){return clamp(Math.round(weightedAttributeAverage(attributes,position)),68,99);}
function positionWeightedAttributeScore(player,attributesOverride=null){
  const attrs=attributesOverride||normalizePlayerAttributes(player);return weightedAttributeAverage(attrs,player.position);
}
function buildStartingAttributes(dna,potential){
  const attrs={};
  ATTRIBUTE_DRAFT_FIELDS.forEach(f=>{
    if(f.id==='weakFoot'){attrs[f.id]=dna[f.id];return;}
    // GER começa em 68, preservando o perfil relativo do DNA escolhido.
    attrs[f.id]=clamp(Math.round(68+(dna[f.id]-potential)*.45),35,82);
  });
  return attrs;
}
function normalizePlayerAttributes(player){
  if(player.attributes)return player.attributes;
  const base=player.overall||68;
  player.attributes={
    pace:clamp(base+(player.position?.includes('Ponta')?4:0),45,99),
    finishing:clamp(base+(['Centroavante','Segundo atacante'].includes(player.position)?5:-2),45,99),
    dribbling:clamp(base+(['Meia ofensivo','Ponta direita','Ponta esquerda'].includes(player.position)?4:0),45,99),
    passing:clamp(base+((player.position||'').includes('Meia')?5:0),45,99),
    defense:clamp(base+(['Zagueiro','Volante','Lateral direito','Lateral esquerdo','Goleiro'].includes(player.position)?5:-12),35,99),
    physical:clamp(base+2,45,99),
    weakFoot:4
  };
  player.dnaAttributes=player.dnaAttributes||{...player.attributes};
  player.initialPotential=player.initialPotential||player.potential||80;
  player.attributeOrigins=player.attributeOrigins||{};
  return player.attributes;
}
function drawLegendForDraft(excludeName=''){
  const used=new Set(attributeDraft.usedLegends||[]);
  let pool=LEGEND_POOL.filter(l=>l.name!==excludeName&&!used.has(l.name));
  if(!pool.length)pool=LEGEND_POOL.filter(l=>l.name!==excludeName);
  const player=pool[rnd(0,pool.length-1)];
  attributeDraft.current={legend:player,values:legendAttributeSet(player)};
}
function selectedDraftCount(){return attributeDraft?Object.keys(attributeDraft.selections||{}).length:0;}
function renderAttributeDraft(){
  if(!attributeDraft)return;
  const current=attributeDraft.current,selected=attributeDraft.selections,count=selectedDraftCount();
  $('#draft-progress-bar').style.width=`${Math.round(count/ATTRIBUTE_DRAFT_FIELDS.length*100)}%`;
  $('#draft-progress-text').textContent=`${count} de ${ATTRIBUTE_DRAFT_FIELDS.length}`;
  $('#draft-attribute-label').textContent=count===ATTRIBUTE_DRAFT_FIELDS.length?'DNA completo':'Escolha qualquer atributo disponível';
  $('#legend-position').textContent=current.legend.position;
  $('#legend-badge').textContent=current.legend.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
  $('#legend-name').textContent=current.legend.name;
  $('#legend-rating').textContent=current.legend.rating;
  if($('#legend-era'))$('#legend-era').textContent=current.legend.category==='current'?'ATUAL · MELHOR FASE':'HISTÓRICO · AUGE';
  if($('#legend-source'))$('#legend-source').textContent=current.legend.source||'Referência EA SPORTS FC';
  const noSkipLeft=(attributeDraft.skipsRemaining||0)<=0;
  $('#reroll-legend').disabled=noSkipLeft;
  $('#reroll-legend').textContent=noSkipLeft?'Pulo único já utilizado':'Pular este jogador · resta 1';

  const values=current.values;const primaryId=primaryAttributeForPosition(pendingPlayerProfile?.position);
  $('#legend-attributes').innerHTML=ATTRIBUTE_DRAFT_FIELDS.map(f=>{
    const already=!!selected[f.id],isPrimary=f.id===primaryId;
    return `<button type="button" class="draft-attribute-choice ${already?'locked':''} ${isPrimary?'role-primary':''}" data-draft-attribute="${f.id}" ${already?'disabled':''}>
      <span>${f.short}${isPrimary?' ★':''}</span><strong>${attributeDisplayValue(f.id,values[f.id])}</strong><small>${already?'já escolhido':isPrimary?`atributo principal · ${pendingPlayerProfile?.position||''}`:'usar este atributo'}</small>
    </button>`;
  }).join('');
  $$('[data-draft-attribute]').forEach(btn=>btn.addEventListener('click',()=>selectDraftAttribute(btn.dataset.draftAttribute)));

  $('#draft-slots').innerHTML=ATTRIBUTE_DRAFT_FIELDS.map(f=>{
    const pick=selected[f.id];
    return `<div class="draft-slot ${pick?'done':'pending'}"><span>${f.short}</span><strong>${pick?attributeDisplayValue(f.id,pick.value):'—'}</strong><small>${pick?pick.legend:'a escolher'}</small></div>`;
  }).join('');

  if(count===ATTRIBUTE_DRAFT_FIELDS.length){
    const attrs={};ATTRIBUTE_DRAFT_FIELDS.forEach(f=>attrs[f.id]=selected[f.id].value);
    $('#draft-overall-preview').textContent=`POT ${calculatePotentialFromAttributes(attrs,pendingPlayerProfile?.position)}`;
  }else if(count){
    const partialAttrs={};Object.entries(selected).forEach(([id,p])=>partialAttrs[id]=p.value);
    const partialIds=Object.keys(partialAttrs);
    $('#draft-overall-preview').textContent=`POT parcial ${Math.round(weightedAttributeAverage(partialAttrs,pendingPlayerProfile?.position,partialIds))}`;
  }else $('#draft-overall-preview').textContent='GER inicial 68';
}
function startAttributeDraft(profile){
  pendingPlayerProfile=profile;
  attributeDraft={selections:{},current:null,skipsRemaining:1,usedLegends:[]};
  drawLegendForDraft();
  saveDraftState();
  showView('attribute-draft');
  renderAttributeDraft();
}
function selectDraftAttribute(attributeId){
  if(!attributeDraft||attributeDraft.selections[attributeId])return;
  const field=ATTRIBUTE_DRAFT_FIELDS.find(f=>f.id===attributeId);if(!field)return;
  const current=attributeDraft.current;
  attributeDraft.selections[attributeId]={
    value:current.values[attributeId],legend:current.legend.name,legendRating:current.legend.rating,
    category:current.legend.category||'historical',source:current.legend.source||''
  };
  attributeDraft.usedLegends.push(current.legend.name);
  saveDraftState();
  if(selectedDraftCount()>=ATTRIBUTE_DRAFT_FIELDS.length){renderAttributeDraft();setTimeout(finalizeCareerFromDraft,260);return;}
  drawLegendForDraft();saveDraftState();renderAttributeDraft();
}
function finalizeCareerFromDraft(){
  const dnaAttributes={},attributeOrigins={};
  ATTRIBUTE_DRAFT_FIELDS.forEach(f=>{
    const pick=attributeDraft.selections[f.id];
    dnaAttributes[f.id]=pick.value;
    attributeOrigins[f.id]={legend:pick.legend,legendRating:pick.legendRating,category:pick.category,source:pick.source};
  });
  const profile=pendingPlayerProfile;
  const overall=68;
  const potential=calculatePotentialFromAttributes(dnaAttributes,profile.position);
  const attributes=buildStartingAttributes(dnaAttributes,potential);
  const value=1100000;
  const player={...profile,overall,potential,initialPotential:potential,value,titles:0,trophies:[],awards:[],calledUp:false,nationalTeamGames:0,nationalTeamGoals:0,nationalTrust:0,nationalCaptain:false,morale:70,reputation:10,developmentBoost:0,marketBonus:0,retired:false,attributes,dnaAttributes,attributeOrigins};
  state={created:true,player,season:null,history:[],offers:[],news:[`${player.name}, ${player.age} anos, inicia a carreira com GER 68. O DNA escolhido definiu POT ${potential}.`],pendingEvent:null};
  state.season=createSeason(player,START_YEAR,undefined);
  pendingPlayerProfile=null;attributeDraft=null;clearDraftState();save();showView('career');toast(`Carreira iniciada! GER 68 · POT ${potential}`);
}
function evolvePlayerAttributes(delta,avg){
  const p=state.player,a=normalizePlayerAttributes(p),dna=p.dnaAttributes||a;if(!delta)return;
  const weights=positionAttributeWeights(p.position);
  const bonusCeiling=Math.max(0,(p.potential||p.initialPotential||80)-(p.initialPotential||p.potential||80));
  if(delta>0){
    ['pace','finishing','dribbling','passing','defense','physical'].forEach(id=>{
      const target=clamp((dna[id]||75)+Math.round(bonusCeiling*.55),35,99);const gap=Math.max(0,target-a[id]);
      // Atributos mais importantes para a posição sobem mais depressa.
      const roleMultiplier=.55+(weights[id]||.1)*2.4;
      const gain=Math.max(1,Math.round(delta*roleMultiplier+Math.min(2,gap/18)+(avg>=8.0?1:0)));
      a[id]=clamp(Math.min(target,a[id]+gain),35,99);
    });
  }else{
    ['pace','physical'].forEach(id=>a[id]=clamp(a[id]+delta,35,99));
    if(avg<6.4)a.dribbling=clamp(a.dribbling-1,35,99);
  }
}

function generatedClubTheme(name){
  if(!name)return DEFAULT_THEME;
  const palettes=[
    {accent:'#d9343f',secondary:'#ffffff',bg:'#190708',panel:'#2e0f12',panel2:'#43161a',border:'#6d2930',buttonText:'#ffffff'},
    {accent:'#397bd8',secondary:'#ffffff',bg:'#061126',panel:'#0b2045',panel2:'#103160',border:'#294f82',buttonText:'#ffffff'},
    {accent:'#2f9f65',secondary:'#ffffff',bg:'#05180f',panel:'#0a2a1c',panel2:'#10412b',border:'#286747',buttonText:'#ffffff'},
    {accent:'#f0d33c',secondary:'#111111',bg:'#171505',panel:'#2a270b',panel2:'#3d3910',border:'#655e22',buttonText:'#111111'},
    {accent:'#f2f2f2',secondary:'#111111',bg:'#060606',panel:'#121212',panel2:'#1d1d1d',border:'#3c3c3c',buttonText:'#080808'},
    {accent:'#7c54d8',secondary:'#ffffff',bg:'#10091d',panel:'#1d1033',panel2:'#2b184a',border:'#513172',buttonText:'#ffffff'}
  ];
  let hash=0;for(const ch of name)hash=(hash*31+ch.charCodeAt(0))>>>0;
  return palettes[hash%palettes.length];
}
function applyClubTheme(name){
  const theme=CLUB_THEMES[name] || generatedClubTheme(name);
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

async function resolveClubBadge(name){ const exact=await exactClubBadge(name); return clubBadgeSources(name,exact)[0]||fallbackClubDataUri(name); }
async function hydrateBadge(img,name,fallback){ if(!img)return; const exact=await exactClubBadge(name); applyImageSources(img,clubBadgeSources(name,exact),fallback); }
function hydrateRenderedBadges(){
  $$('.club-option[data-club-name]').forEach(el=>hydrateBadge(el.querySelector('img'),el.dataset.clubName,el.querySelector('.crest-fallback')));
  $$('.offer[data-club-name]').forEach(el=>hydrateBadge(el.querySelector('img'),el.dataset.clubName,el.querySelector('.crest-fallback')));
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
function continentalFromLeagueResult(code,position,divisionLevel=1){
  if(divisionLevel>1)return null;
  const list=getCompetitionRule(code,countryByCode(code)?.name||'').continental||[];if(!list.length||!position)return null;
  if(code==='BR'){ if(position<=6)return list[0]; if(position<=12)return list[1]; return null; }
  if(confederation(code)==='UEFA'){ if(position<=4)return list[0];if(position<=6)return list[1];if(position<=7)return list[2];return null; }
  if(position<=3)return list[0]; return null;
}

function leaguePoolForCountry(code,currentClub,leagueName=''){
  const format=getLeagueFormatForClub(code,leagueName);let names=[];
  if(leagueName&&typeof MARKET_LEAGUE_POOLS!=='undefined'&&MARKET_LEAGUE_POOLS[leagueName]) names.push(...MARKET_LEAGUE_POOLS[leagueName]);
  const market=typeof TRANSFER_MARKET_CLUBS!=='undefined'?TRANSFER_MARKET_CLUBS:[];
  names.push(...market.filter(c=>c.countryCode===code&&(!leagueName||c.league===leagueName)).map(c=>c.name));
  if(!leagueName||leagueName===getCompetitionRule(code,countryByCode(code)?.name||'').league){
    names.push(...(LEAGUE_CLUB_POOLS[code]||[]),...(LOCAL_CLUBS[code]||[]).map(c=>c.name));
  }
  if(!names.includes(currentClub)) names.unshift(currentClub);
  names=[...new Set(names)];
  const country=countryByCode(code)?.name||'Nacional';let i=1;
  while(names.length<format.teams){ const fake=`${leagueName||country} Clube ${String(i).padStart(2,'0')}`;if(!names.includes(fake))names.push(fake);i++; }
  return names.slice(0,format.teams);
}
function generateLeagueSchedule(code,currentClub,leagueName){
  const format=getLeagueFormatForClub(code,leagueName);const teams=leaguePoolForCountry(code,currentClub,leagueName);const opponents=shuffle(teams.filter(t=>t!==currentClub));const events=[];
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
  const baseRule=getCompetitionRule(p.clubCountry,p.clubCountryName);const clubProfile=clubCompetitionProfile(p.club,p.clubCountry);
  const leagueName=p.clubLeague||clubProfile.league||baseRule.league;const cupName=p.clubCup||clubProfile.cup||baseRule.cup;const divisionLevel=p.clubDivisionLevel||clubProfile.divisionLevel||1;
  const leagueFormat=getLeagueFormatForClub(p.clubCountry,leagueName);
  const continentalName=divisionLevel>1?null:(continentalOverride===undefined?qualificationForClub(p.clubCountry,p.clubStrength):continentalOverride);
  return {
    year,clubAtStart:p.club,countryAtStart:p.clubCountry,leagueAtStart:leagueName,divisionLevel,totalGames:0,clubGames:0,clubGoals:0,clubAssists:0,leagueGames:0,leagueGoals:0,leagueAssists:0,goals:0,assists:0,ratingSum:0,lastNationalAt:-10,lastCareerEventAt:-8,lastNationalEventAt:-10,lastSponsorEventAt:-20,nationalGamesPlayed:0,nationalDecisionCount:0,nationalInteractionCount:0,sponsorEventDone:false,closed:false,endProcessed:false,featuredMatch:null,
    league:{name:leagueName,format:leagueFormat,schedule:generateLeagueSchedule(p.clubCountry,p.club,leagueName),index:0,points:0,wins:0,draws:0,losses:0,gf:0,ga:0,finished:false,position:null,titleAwarded:false},
    cup:createKnockoutState(cupName,domesticCupStages(p.clubCountry),3),
    continental:createContinentalState(p,continentalName)
  };
}

function knockoutOpponent(domestic=true){
  const p=state.player;
  if(domestic){ const leagueName=state.season?.league?.name||p.clubLeague||clubCompetitionProfile(p.club,p.clubCountry).league;const pool=leaguePoolForCountry(p.clubCountry,p.club,leagueName).filter(n=>n!==p.club);return pool[rnd(0,pool.length-1)]; }
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
function nationalEventMeta(s){
  const n=s.nationalGamesPlayed||0;
  if(isWorldCupYear(s.year)){
    const stages=['Preparação para a Copa','Fase de grupos','Fase de grupos','Fase de grupos','Mata-mata','Mata-mata','Jogo decisivo'];
    return {competition:n===0?'Amistoso Internacional':'Copa do Mundo',stage:stages[Math.min(n,stages.length-1)]};
  }
  return {competition:n%2===0?'Eliminatórias da Copa do Mundo':'Amistoso Internacional',stage:n%2===0?'Eliminatórias':'Data FIFA'};
}
function chooseNextEvent(){
  if(!state.created||state.player.retired)return null;const p=state.player,s=state.season;
  const nationalGap=isWorldCupYear(s.year)?5:9;
  if(p.calledUp && s.totalGames-s.lastNationalAt>=nationalGap && s.totalGames>0){
    const rivals=COUNTRIES.filter(c=>c.code!==p.nationalityCode);const rival=rivals[rnd(0,rivals.length-1)];
    const nationalHome=Math.random()<.5,meta=nationalEventMeta(s);return {type:'national',competition:meta.competition,stage:meta.stage,home:nationalHome?p.nationality:rival.name,away:nationalHome?rival.name:p.nationality,opponent:rival.name};
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
  const p=state.player,profile=positionProfile(p.position),a=normalizePlayerAttributes(p);
  const attackSkill=(a.finishing*.42+a.dribbling*.25+a.pace*.18+a.physical*.15);
  const creationSkill=(a.passing*.48+a.dribbling*.27+a.pace*.15+(50+a.weakFoot*10)*.10);
  const defenseSkill=(a.defense*.55+a.physical*.30+a.pace*.15);
  const roleSkill=positionWeightedAttributeScore(p,a);
  const primaryId=primaryAttributeForPosition(p.position);
  const primaryValue=normalizedAttributeValue(primaryId,a[primaryId]);
  const quality=clamp((p.overall-60)/95+(roleSkill-68)/135+(primaryValue-68)/420,0,.58);
  let goals=0,assists=0;
  if(teamGoals>0){
    const goalBoost=clamp((attackSkill-75)/210,-.05,.12);
    goals=Math.random()<profile.goal+quality+goalBoost?1:0;
    if(goals&&teamGoals>1&&Math.random()<.10+quality/3+(a.finishing-75)/500)goals++;
    goals=Math.min(goals,teamGoals);
    const assistSlots=Math.max(0,teamGoals-goals);
    const assistBoost=clamp((creationSkill-75)/215,-.04,.12);
    if(assistSlots>0&&Math.random()<profile.assist+quality*.58+assistBoost)assists=1;
    if(assistSlots>1&&assists&&Math.random()<.08+quality/4+(a.passing-75)/520)assists++;
    assists=Math.min(assists,assistSlots);
  }
  const skillRating=(roleSkill-68)/70;
  let rating=6.12+goals*1.2+assists*.65+skillRating+(Math.random()*1.10-.36)+(p.morale-70)/120;
  let extraLabel='Passes',extraValue=`${clamp(rnd(72,92)+Math.round((a.passing-75)/5),65,99)}%`;
  if(p.position==='Goleiro'){const saves=clamp(rnd(2,7)+Math.round((a.defense-75)/8),2,12);rating=6.1+saves*.16+(oppGoals===0?.7:0)+(defenseSkill-75)/90+(Math.random()*.45-.2);extraLabel='Defesas';extraValue=saves;}
  else if(profile.defensive){if(oppGoals===0)rating+=.35;extraLabel='Desarmes';extraValue=clamp(rnd(2,5)+Math.round((a.defense-75)/10),1,9);}
  return {goals,assists,rating:clamp(rating,5.0,10),extraLabel,extraValue};
}
function simulateMatchCore(event){
  const p=state.player,s=state.season;const playerIsHome=event.type==='national'?event.home===p.nationality:event.home===p.club;
  const score=simulateScore(event);const teamGoals=playerIsHome?score.homeGoals:score.awayGoals;const oppGoals=playerIsHome?score.awayGoals:score.homeGoals;
  if((p.injuryGames||0)>0){
    p.injuryGames=Math.max(0,p.injuryGames-1);processCompetitionResult(event,teamGoals,oppGoals);
    if(p.injuryGames===0)state.news.push(`${p.name} está recuperado e volta a ficar disponível.`);
    return {event,playerIsHome,teamGoals,oppGoals,homeGoals:score.homeGoals,awayGoals:score.awayGoals,perf:{goals:0,assists:0,rating:0,extraLabel:'Status',extraValue:'Fora'},model:score.model,missed:true};
  }
  const perf=simulatePlayerPerformance(teamGoals,oppGoals);
  s.totalGames++;s.goals+=perf.goals;s.assists+=perf.assists;s.ratingSum+=perf.rating;
  if(event.type!=='national'){
    s.clubGames++;s.clubGoals+=perf.goals;s.clubAssists+=perf.assists;if(event.type==='league'){s.leagueGames=(s.leagueGames||0)+1;s.leagueGoals=(s.leagueGoals||0)+perf.goals;s.leagueAssists=(s.leagueAssists||0)+perf.assists;}
    p.value=marketValue(p.value*(1+(perf.rating-6.5)/260));
  }else{p.nationalTeamGames++;p.nationalTeamGoals+=perf.goals;p.nationalTrust=clamp((p.nationalTrust||0)+(perf.rating>=8?3:perf.rating>=7.2?2:perf.rating<6.2?-1:1),0,100);}
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
  p.trophies.push({year:state.season.year,name});p.titles=p.trophies.length;state.news.push(`${p.name} é campeão de ${name} com o ${p.club}!`);if(!state.simulatingSeason)showCelebrationForHonour(name,`Campeão: ${name}`,`${p.name} adiciona mais um título à carreira.`);
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
  else if(event.type==='national'){s.lastNationalAt=s.totalGames;s.nationalGamesPlayed=(s.nationalGamesPlayed||0)+1;}
}

function nationalRoleForPlayer(p=state.player){
  if(!p?.calledUp)return 'Fora do grupo';
  if(p.nationalCaptain)return 'Capitão';
  const trust=p.nationalTrust||0,caps=p.nationalTeamGames||0;
  if(trust>=70&&caps>=12)return 'Titular';
  if(trust>=42)return 'Rotação';
  return 'Reserva';
}
function updateSelectionAtSeasonEnd(avg){
  const p=state.player,was=p.calledUp;const eligible=p.overall>=73&&avg>=7.1;
  if(!was&&eligible&&Math.random()<clamp(.35+(avg-7.1)*.35+(p.overall-73)*.035,.35,.95)){
    p.calledUp=true;p.nationalTrust=Math.max(p.nationalTrust||0,22);state.news.push(`${p.name} recebe sua primeira convocação para a seleção de ${p.nationality}!`);
  }else if(was&&(avg<6.6||p.overall<71)&&Math.random()<.5){
    p.calledUp=false;p.nationalCaptain=false;p.nationalTrust=Math.max(0,(p.nationalTrust||0)-10);state.news.push(`${p.name} ficou fora da nova convocação de ${p.nationality}.`);
  }else if(was){
    p.nationalTrust=clamp((p.nationalTrust||0)+(avg>=8?5:avg>=7.3?3:avg<6.5?-3:1),0,100);
  }
  if(p.calledUp&&!p.nationalCaptain&&(p.nationalTeamGames||0)>=18&&(p.nationalTrust||0)>=82&&(p.reputation||0)>=45&&p.age>=25){
    p.nationalCaptain=true;state.news.push(`${p.name} recebe a braçadeira de capitão da seleção de ${p.nationality}.`);
  }
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
const UEFA_AWARD_COUNTRY_CODES=new Set([...(CONFEDERATIONS.europe||[]),'IL']);
function isEuropeanCountryCode(code){return !!code&&UEFA_AWARD_COUNTRY_CODES.has(code);}

// European Golden Shoe: league goals only. The standard weighting gives 2.0 to
// the strongest five leagues, 1.5 to the next tier and 1.0 to the remaining
// eligible European leagues. Only domestic top-flight league goals count.
const GOLDEN_SHOE_FACTORS={
  // UEFA association ranking 2026: top five associations = x2.
  ENG:2,IT:2,ES:2,DE:2,FR:2,
  // Associations ranked 6–22 = x1.5.
  PT:1.5,NL:1.5,BE:1.5,TR:1.5,CZ:1.5,GR:1.5,PL:1.5,DK:1.5,NO:1.5,CY:1.5,CH:1.5,AT:1.5,SCO:1.5,SE:1.5,HR:1.5,IL:1.5,HU:1.5
};
function goldenShoeFactor(code){if(!isEuropeanCountryCode(code))return 0;return GOLDEN_SHOE_FACTORS[code]||1;}

const WORLD_AWARD_RIVALS=[
  {name:'Kylian Mbappé',countryCode:'ES',rating:94,goalBase:36,assistBase:10,teamPower:95},
  {name:'Erling Haaland',countryCode:'ENG',rating:93,goalBase:35,assistBase:6,teamPower:94},
  {name:'Harry Kane',countryCode:'DE',rating:93,goalBase:32,assistBase:9,teamPower:93},
  {name:'Mohamed Salah',countryCode:'ENG',rating:93,goalBase:28,assistBase:13,teamPower:93},
  {name:'Vinícius Jr.',countryCode:'ES',rating:92,goalBase:23,assistBase:13,teamPower:95},
  {name:'Lamine Yamal',countryCode:'ES',rating:91,goalBase:20,assistBase:16,teamPower:94},
  {name:'Ousmane Dembélé',countryCode:'FR',rating:91,goalBase:25,assistBase:12,teamPower:94},
  {name:'Raphinha',countryCode:'ES',rating:91,goalBase:23,assistBase:14,teamPower:94},
  {name:'Lautaro Martínez',countryCode:'IT',rating:91,goalBase:26,assistBase:8,teamPower:91},
  {name:'Cole Palmer',countryCode:'ENG',rating:90,goalBase:22,assistBase:14,teamPower:89},
  {name:'Jude Bellingham',countryCode:'ES',rating:91,goalBase:17,assistBase:13,teamPower:95},
  {name:'Robert Lewandowski',countryCode:'ES',rating:91,goalBase:28,assistBase:7,teamPower:94},
  {name:'Alexander Isak',countryCode:'ENG',rating:90,goalBase:27,assistBase:8,teamPower:92},
  {name:'Viktor Gyökeres',countryCode:'ENG',rating:90,goalBase:28,assistBase:7,teamPower:91},
  {name:'Michael Olise',countryCode:'DE',rating:89,goalBase:20,assistBase:14,teamPower:94},
  {name:'Julián Álvarez',countryCode:'ES',rating:90,goalBase:24,assistBase:10,teamPower:92},
  {name:'Victor Osimhen',countryCode:'TR',rating:89,goalBase:28,assistBase:5,teamPower:88}
];
function rivalNoise(span=6){return rnd(-span,span);}
function titlePrestige(name=''){
  if(/Copa do Mundo|FIFA World Cup/i.test(name))return 72;
  if(/UEFA Champions League/i.test(name))return 56;
  if(/CONMEBOL Libertadores/i.test(name))return 50;
  if(/FIFA Club World Cup|Mundial/i.test(name))return 28;
  if(/UEFA Europa League|Sul-Americana/i.test(name))return 30;
  if(/UEFA Conference League/i.test(name))return 20;
  if(/Premier League|LaLiga|Bundesliga|Serie A|Ligue 1/i.test(name))return 30;
  if(/Primeira Liga|Eredivisie|Belgian Pro League|Süper Lig|Scottish Premiership/i.test(name))return 25;
  if(/Brasileir|Liga Profesional|Primera División|Categoría Primera A|Liga MX|Major League Soccer|Saudi Pro League|J1 League/i.test(name))return 24;
  if(/Copa|Cup|Pokal|Beker|Taça|Coppa|Coupe/i.test(name))return 14;
  return 10;
}
function seasonTitleNames(){const p=state.player,s=state.season,start=s?.startTrophyCount||0;return (p?.trophies||[]).slice(start).map(t=>t.name);}
function titleScoreFor(names=[]){return clamp(names.reduce((sum,n)=>sum+titlePrestige(n),0),0,100);}
function simulateRivalTitles(r){
  const rule=getCompetitionRule(r.countryCode,countryByCode(r.countryCode)?.name||'');const titles=[];
  const leagueChance=clamp((r.teamPower-80)/28,.12,.68),cupChance=clamp((r.teamPower-80)/45,.08,.35),uclChance=clamp((r.teamPower-86)/35,.04,.30);
  if(Math.random()<leagueChance)titles.push(rule.league);
  if(Math.random()<cupChance)titles.push(rule.cup);
  if(Math.random()<uclChance)titles.push('UEFA Champions League');
  return titles;
}
function simulateRivalSeason(r){
  const factor=goldenShoeFactor(r.countryCode);const leagueGoals=clamp(r.goalBase+rivalNoise(7),8,46),leagueAssists=clamp(r.assistBase+rivalNoise(5),1,24);
  const allGoals=clamp(leagueGoals+rnd(2,11),leagueGoals,60),allAssists=clamp(leagueAssists+rnd(1,6),leagueAssists,30);
  const avg=clamp(7.15+(r.rating-88)*.08+allGoals*.011+allAssists*.007+(Math.random()-.5)*.34,6.8,9.35);
  const minutes=clamp(Math.round((getLeagueFormat(r.countryCode)?.matches||34)*rnd(70,88)),1900,3400);const titles=simulateRivalTitles(r);
  return {...r,goals:leagueGoals,assists:leagueAssists,allGoals,allAssists,avg,minutes,titles,goldenPoints:Number((leagueGoals*factor).toFixed(1)),titleScore:titleScoreFor(titles),fairPlay:rnd(82,99)};
}
function ballonIndividualScore({avg,goals,assists,rating}){
  const ratingPart=clamp((avg-6.6)*27,0,70);const outputPart=clamp(goals*.72+assists*.48,0,42);const qualityPart=clamp((rating-84)*1.4,0,16);
  return clamp(ratingPart+outputPart+qualityPart,0,100);
}
function ballonScore(candidate){
  // France Football hierarchy: individual impact first, team achievements second,
  // class/fair play third. The simulator converts that hierarchy into 52/40/8.
  const individual=ballonIndividualScore(candidate);return Number((individual*.52+(candidate.titleScore||0)*.40+(candidate.fairPlay||90)*.08).toFixed(2));
}
function buildAwardRaceResults(avg){
  const p=state.player,s=state.season;const rivals=WORLD_AWARD_RIVALS.filter(r=>normalizeKey(r.name)!==normalizeKey(p.name)).map(simulateRivalSeason);const seasonTitles=seasonTitleNames();
  const userLeagueGoals=s.leagueGoals||0,userLeagueAssists=s.leagueAssists||0,userLeagueGames=s.leagueGames||s.league?.index||0;
  const userFactor=goldenShoeFactor(s.countryAtStart);const user={name:p.name,isUser:true,countryCode:s.countryAtStart,rating:p.overall,goals:userLeagueGoals,assists:userLeagueAssists,avg,minutes:Math.max(1,userLeagueGames)*82,titles:seasonTitles,titleScore:titleScoreFor(seasonTitles),fairPlay:clamp(Math.round(78+(p.morale||70)*.12+(p.reputation||10)*.08),70,100)};
  user.goldenPoints=Number((user.goals*userFactor).toFixed(1));
  const goldenCandidates=userFactor?[user,...rivals.filter(r=>goldenShoeFactor(r.countryCode)>0)]:[];
  goldenCandidates.sort((a,b)=>b.goldenPoints-a.goldenPoints||a.minutes-b.minutes||b.assists-a.assists);
  const goldenUserRank=userFactor?goldenCandidates.findIndex(x=>x.isUser)+1:null;const goldenWinner=goldenCandidates[0]||null;
  const ballonCandidates=[{...user,goals:s.goals||s.clubGoals||0,assists:s.assists||s.clubAssists||0},...rivals.map(r=>({...r,goals:r.allGoals,assists:r.allAssists}))];
  ballonCandidates.forEach(c=>c.ballonPoints=ballonScore(c));
  ballonCandidates.sort((a,b)=>b.ballonPoints-a.ballonPoints||b.titleScore-a.titleScore||(b.goals+b.assists)-(a.goals+a.assists));
  const ballonUserRank=ballonCandidates.findIndex(x=>x.isUser)+1;const ballonWinner=ballonCandidates[0];
  return {
    goldenShoe:userFactor?{name:'Chuteira de Ouro',winner:goldenWinner,userRank:goldenUserRank,user:user,top:goldenCandidates.slice(0,5)}:null,
    ballonDor:{name:'Bola de Ouro',winner:ballonWinner,userRank:ballonUserRank,user:{...ballonCandidates.find(x=>x.isUser)},top:ballonCandidates.slice(0,8)}
  };
}
function awardCeremonyEntry(race){
  if(!race?.winner)return null;const winner=race.winner,user=race.user,isUserWinner=!!winner.isUser;
  if(/Chuteira de Ouro/i.test(race.name)){
    return {name:race.name,winner:winner.name,isUserWinner,userRank:race.userRank,stats:[`${winner.goals} gols de liga`,`coef. ${goldenShoeFactor(winner.countryCode).toFixed(1)}`,`${winner.goldenPoints} pontos`],copy:isUserWinner?`Você liderou a corrida com ${winner.goals} gols de liga e ${winner.goldenPoints} pontos.`:`${winner.name} venceu com ${winner.goals} gols de liga (${winner.goldenPoints} pontos). Você terminou em ${race.userRank}º com ${user.goals} gols e ${user.goldenPoints} pontos.`};
  }
  return {name:race.name,winner:winner.name,isUserWinner,userRank:race.userRank,stats:[`${winner.goals} gols`,`${winner.assists} assist.`,`${winner.titles.length} título(s)`,`nota ${winner.avg.toFixed(2)}`],copy:isUserWinner?`Seu impacto individual e os resultados coletivos colocaram você no topo da votação simulada.`:`${winner.name} terminou à frente na avaliação de desempenho individual, títulos e fair play. Você ficou em ${race.userRank}º.`};
}
function evaluateAwards(avg){
  const p=state.player,s=state.season;const awards=[];const seasonCountry=s?.countryAtStart;const europe=isEuropeanCountryCode(seasonCountry);
  if(europe&&p.age<=21&&avg>=7.4&&s.clubGames>=18)awards.push('Melhor Jogador Jovem');
  if(europe&&avg>=7.45&&s.clubGames>=18)awards.push('Time da Temporada');

  const races=buildAwardRaceResults(avg);s.awardRaceResults=races;s.specialAwardCeremonies=[];
  const golden=races.goldenShoe;
  if(golden){
    if(golden.userRank===1)awards.push('Chuteira de Ouro');
    if(golden.userRank<=5&&golden.user.goals>=8){const entry=awardCeremonyEntry(golden);if(entry)s.specialAwardCeremonies.push(entry);}
    const gw=golden.winner;state.news.push(golden.userRank===1?`${p.name} venceu a Chuteira de Ouro com ${golden.user.goals} gols de liga e ${golden.user.goldenPoints} pontos.`:`${gw.name} venceu a Chuteira de Ouro com ${gw.goals} gols de liga; ${p.name} ficou em ${golden.userRank}º.`);
  }
  const ballon=races.ballonDor;
  if(ballon.userRank===1)awards.push('Bola de Ouro');
  if(ballon.userRank<=8&&(avg>=7.15||(s.goals+s.assists)>=18||seasonTitleNames().length)){const entry=awardCeremonyEntry(ballon);if(entry)s.specialAwardCeremonies.push(entry);}
  state.news.push(ballon.userRank===1?`${p.name} venceu a Bola de Ouro após liderar a avaliação da temporada.`:`${ballon.winner.name} venceu a Bola de Ouro; ${p.name} terminou em ${ballon.userRank}º na votação simulada.`);

  p.awards=p.awards||[];awards.forEach(name=>{if(!p.awards.some(a=>a.year===s.year&&a.name===name))p.awards.push({year:s.year,name,countryCode:seasonCountry,club:s.clubAtStart||p.club});});
  const ordinary=awards.filter(a=>!/Bola de Ouro|Chuteira de Ouro/i.test(a));if(ordinary.length)state.news.push(`${p.name} recebeu: ${ordinary.join(', ')}.`);
  if(!state.simulatingSeason){queueSpecialAwardCeremonies(s.specialAwardCeremonies||[],()=>{if(awards.length)showSeasonHonoursGallery([],awards);});}
  return awards;
}
function sanitizeAwardsEligibility(){
  if(!state.created||!state.player)return;const p=state.player;let changed=false;
  p.awards=(p.awards||[]).filter(a=>{
    let code=a.countryCode;
    if(!code){const h=(state.history||[]).find(x=>x.year===a.year);code=h?.clubCountry||findClubDataAny(h?.club||'')?.countryCode||null;}
    const ok=/Bola de Ouro/i.test(a.name)||isEuropeanCountryCode(code);if(!ok)changed=true;else if(!a.countryCode&&code){a.countryCode=code;changed=true;}return ok;
  });
  if(changed)save();
}
function legacyV4_generateOffers(avg){
  const p=state.player;
  const tierTargets=TRANSFER_TARGETS.filter(c=>c.name!==p.club&&p.overall>=c.minOverall);
  let normal=allTransferClubs().filter(c=>c.name!==p.club&&c.strength<=p.overall+8&&c.strength>=Math.max(64,p.overall-10));
  if(!normal.length)normal=allTransferClubs().filter(c=>c.name!==p.club&&c.strength<=p.overall+12).sort((a,b)=>Math.abs(a.strength-p.overall)-Math.abs(b.strength-p.overall)).slice(0,12);
  let pool=[...tierTargets,...normal];pool=[...new Map(pool.map(c=>[`${c.countryCode}:${c.name}`,c])).values()];
  const baseCount=avg>=7.8?3:avg>=7.0?2:1;const count=clamp(baseCount+(p.marketBonus||0),1,4);p.marketBonus=0;
  const chosen=sample(pool,Math.min(count,pool.length));
  state.offers=chosen.map(c=>({club:c.name,countryCode:c.countryCode,countryName:countryByCode(c.countryCode)?.name||c.countryCode,league:getCompetitionRule(c.countryCode,countryByCode(c.countryCode)?.name||'').league,strength:c.strength||clubStrength(c.name,c.countryCode),minOverall:c.minOverall||null,value:marketValue(p.value*(1.05+Math.random()*.70))}));
  if(state.offers.length)state.news.push(`${p.name} recebeu ${state.offers.length} proposta(s) ao fim da temporada.`);
}

function pickFreshCareerEvent(pool){
  if(!pool?.length)return null;
  const p=state.player;const recent=p?.recentCareerEventIds||[];
  let available=pool.filter(e=>!recent.includes(e.id));
  if(!available.length)available=pool;
  const event=available[rnd(0,available.length-1)];
  if(p&&event){p.recentCareerEventIds=[...recent,event.id].slice(-6);}
  return event;
}

function pickFreshNationalEvent(){
  const p=state.player,s=state.season,pool=(typeof NATIONAL_TEAM_EVENTS!=='undefined'?NATIONAL_TEAM_EVENTS:[]).filter(e=>!e.worldCupOnly||isWorldCupYear(s?.year));
  if(!pool.length)return null;const recent=p.recentNationalEventIds||[];let available=pool.filter(e=>!recent.includes(e.id));if(!available.length)available=pool;
  const event=available[rnd(0,available.length-1)];p.recentNationalEventIds=[...recent,event.id].slice(-6);return event;
}
function maybeTriggerNationalEvent(lastEvent){
  const p=state.player,s=state.season;if(!p?.calledUp||!s||state.pendingEvent||lastEvent?.type!=='national')return false;
  const wc=isWorldCupYear(s.year),gap=wc?1:2;if((s.nationalGamesPlayed||0)-(s.lastNationalEventAt||0)<gap)return false;
  if(Math.random()>(wc ? .62 : .26))return false;
  const event=pickFreshNationalEvent();if(!event)return false;state.pendingEvent={...event,type:'national'};s.lastNationalEventAt=s.nationalGamesPlayed||0;state.resumeSeasonAfterEvent=true;save();openPendingEvent();return true;
}
function sponsorOfferEvent(){
  const p=state.player,s=state.season;if(!p||!s)return null;const current=p.sponsor?.brand||null;
  let pool=SPONSOR_BRANDS.filter(b=>b.name!==current);if(!pool.length)pool=SPONSOR_BRANDS;
  const brand=pool[rnd(0,pool.length-1)],starPower=1+(p.overall-68)*.055+(p.reputation||10)*.018,annual=Math.max(180000,Math.round(brand.base*starPower));
  return {id:`sponsor_${normalizeKey(brand.name)}_${s.year}`,type:'sponsor',title:`Proposta de patrocínio · ${brand.name}`,description:`A ${brand.name} quer fechar um contrato pessoal com você. A oferta estimada é de ${money(annual)} por temporada, além de bônus por exposição e títulos.`,sponsorBrand:brand.name,sponsorTone:brand.tone,sponsorValue:annual,choices:[
    {label:`Assinar com ${brand.name}`,action:'sponsor_accept',effect:'contrato imediato; + reputação'},
    {label:'Negociar bônus maiores',action:'sponsor_negotiate',effect:'pode aumentar o valor ou fazer a marca recuar'},
    {label:'Recusar a proposta',action:'sponsor_decline',effect:'mantém liberdade para outra marca'}]};
}
function maybeTriggerSponsorEvent(){
  const p=state.player,s=state.season;if(!p||!s||state.pendingEvent||s.sponsorEventDone||s.clubGames<7)return false;
  const rep=p.reputation||10,ovr=p.overall||68;const chance=clamp(.025+(rep-10)*.0015+(ovr-75)*.0015,.02,.16);
  if(Math.random()>chance)return false;const event=sponsorOfferEvent();if(!event)return false;state.pendingEvent=event;s.sponsorEventDone=true;s.lastSponsorEventAt=s.clubGames;state.resumeSeasonAfterEvent=true;save();openPendingEvent();return true;
}
function maybeTriggerCareerEvent(){
  const s=state.season;
  if(!s||state.pendingEvent||s.totalGames-(s.lastCareerEventAt||0)<5||Math.random()>.19)return false;
  const incidentPool=typeof INCIDENT_EVENTS!=='undefined'?INCIDENT_EVENTS:[];
  const useIncident=incidentPool.length&&Math.random()<.52;
  const pool=useIncident?incidentPool:CAREER_EVENTS;
  const event=pickFreshCareerEvent(pool);if(!event)return false;
  state.pendingEvent={...event};s.lastCareerEventAt=s.totalGames;state.resumeSeasonAfterEvent=true;save();openPendingEvent();return true;
}
function eventChoiceIcon(action=''){if(/train|learn|video|specialist|adapt/i.test(action))return '↗';if(/recover|rest|rehab|illness|travel/i.test(action))return '✚';if(/market|agent|contract|sponsor/i.test(action))return '€';if(/lead|ambitious|captain|derby|mentor|charity/i.test(action))return '★';if(/controversy|public|confront|fire|leak/i.test(action))return '!';if(/peace|humble|stability|stay|safe|share/i.test(action))return '●';return '◆';}
function openPendingEvent(){
  const e=state.pendingEvent;if(!e)return;const modal=$('#event-modal');
  modal.classList.toggle('sponsor-event-active',e.type==='sponsor');modal.classList.toggle('national-event-active',e.type==='national');
  $('#event-title').textContent=e.title;$('#event-description').textContent=e.description;
  $('#event-choices').innerHTML=(e.type==='sponsor'?`<div class="sponsor-brand-banner ${e.sponsorTone||''}"><span>PARCERIA</span><strong>${e.sponsorBrand||'Marca esportiva'}</strong><small>${money(e.sponsorValue||0)} / temporada</small></div>`:'')+e.choices.map((c,i)=>`<button class="event-choice visual-event-choice" data-choice="${i}"><span>${eventChoiceIcon(c.action)}</span><strong>${c.label}</strong><small>${c.effect}</small></button>`).join('');
  $$('#event-choices .event-choice').forEach(b=>b.addEventListener('click',()=>resolveCareerEvent(+b.dataset.choice)));modal.classList.remove('hidden');
}
function resolveCareerEvent(index){
  const e=state.pendingEvent;if(!e)return;const action=e.choices[index].action,p=state.player;let message='Decisão registrada.';
  if(action==='train_hard'){if(Math.random()<.7){p.developmentBoost=(p.developmentBoost||0)+1;message='O treino extra pode acelerar sua evolução nesta temporada.';}else{p.morale=clamp(p.morale-5,40,100);message='O treino pesou no físico e afetou seu moral.';}}
  if(action==='recover'){p.morale=clamp(p.morale+6,40,100);message='Você se sente mais recuperado para a sequência.';}
  if(action==='ambitious'){p.reputation+=4;p.pressure=(p.pressure||0)+1;message='Sua ambição repercutiu e sua reputação aumentou.';}
  if(action==='humble'){p.morale=clamp(p.morale+3,40,100);message='A resposta tranquila agradou ao vestiário.';}
  if(action==='leadership'){p.reputation+=3;const seasonCap=currentSeasonOverallCap();if(Math.random()<.22&&p.overall<p.potential&&p.overall<seasonCap)p.overall++;message='Você assumiu mais responsabilidade no elenco.';}
  if(action==='learn'){if(p.age<=24)p.potential=clamp(p.potential+1,75,96);message='Você priorizou aprendizado e desenvolvimento.';}
  if(action==='market_push'){p.marketBonus=(p.marketBonus||0)+1;message='Seu empresário vai trabalhar por mais opções no mercado.';}
  if(action==='stability'){p.morale=clamp(p.morale+5,40,100);message='A estabilidade melhorou seu ambiente no clube atual.';}
  if(action==='play_tired'){p.reputation+=2;p.morale=clamp(p.morale-4,40,100);message='Você mostrou disposição, mas sentiu o desgaste.';}
  if(action==='rest'){p.morale=clamp(p.morale+4,40,100);message='O descanso ajudou sua recuperação.';}
  if(action==='injury_rehab'){p.injuryGames=Math.max(p.injuryGames||0,rnd(2,4));p.morale=clamp(p.morale+1,40,100);message=`Você inicia tratamento e deve perder cerca de ${p.injuryGames} jogo(s).`;}
  if(action==='injury_rush'){p.injuryGames=Math.max(p.injuryGames||0,rnd(1,2));p.morale=clamp(p.morale-2,40,100);if(Math.random()<.28){p.injuryGames+=2;message='A volta foi apressada e o incômodo piorou. Você ficará mais tempo fora.';}else message='Você acelera o retorno e deve perder poucos jogos, mas assume algum risco.';}
  if(action==='controversy_apologize'){p.reputation=clamp((p.reputation||0)-1,0,100);p.morale=clamp(p.morale+2,40,100);p.pressure=Math.max(0,(p.pressure||0)-1);message='O esclarecimento reduz a pressão e o assunto perde força.';}
  if(action==='controversy_defend'){p.reputation=clamp((p.reputation||0)+2,0,100);p.pressure=(p.pressure||0)+2;p.morale=clamp(p.morale-2,40,100);message='Sua postura divide opiniões: sua personalidade cresce, mas a pressão também.';}
  if(action==='locker_peace'){p.morale=clamp(p.morale+5,40,100);message='A conversa interna melhora o ambiente do elenco.';}
  if(action==='locker_public'){p.reputation=clamp((p.reputation||0)+2,0,100);p.morale=clamp(p.morale-5,40,100);p.pressure=(p.pressure||0)+1;message='A resposta pública aumenta a repercussão e desgasta o vestiário.';}
  if(action==='rumor_focus'){p.morale=clamp(p.morale+2,40,100);p.pressure=Math.max(0,(p.pressure||0)-1);message='Você responde em campo e recupera a confiança do clube.';}
  if(action==='rumor_ignore'){p.morale=clamp(p.morale-rnd(2,5),40,100);p.pressure=(p.pressure||0)+1;message='O assunto continua rendendo e aumenta o desgaste fora de campo.';}
  if(action==='agent_open'){p.marketBonus=(p.marketBonus||0)+1;p.morale=clamp(p.morale-2,40,100);message='Seu nome passa a circular mais no mercado, mas o ambiente fica menos estável.';}
  if(action==='agent_stay'){p.morale=clamp(p.morale+4,40,100);p.pressure=Math.max(0,(p.pressure||0)-1);message='Você encerra as especulações e reforça o compromisso com o clube.';}
  if(action==='illness_rest'){p.injuryGames=Math.max(p.injuryGames||0,1);p.morale=clamp(p.morale+2,40,100);message='Você reduz a carga e recupera o corpo com segurança.';}
  if(action==='illness_push'){p.reputation=clamp((p.reputation||0)+1,0,100);if(Math.random()<.30){p.injuryGames=Math.max(p.injuryGames||0,2);message='A insistência piora o quadro e você perde alguns jogos.';}else{p.morale=clamp(p.morale-1,40,100);message='Você consegue treinar, mas sente o desgaste.';}}
  if(action==='leak_deny'){p.morale=clamp(p.morale+3,40,100);p.pressure=Math.max(0,(p.pressure||0)-1);message='O clube compra sua versão e o ambiente se acalma.';}
  if(action==='leak_feed'){p.marketBonus=(p.marketBonus||0)+1;p.reputation=clamp((p.reputation||0)+2,0,100);p.pressure=(p.pressure||0)+2;message='A especulação cresce e aumenta seu valor de mercado, junto da pressão.';}
  if(action==='derby_focus'){p.morale=clamp(p.morale+4,40,100);p.reputation=clamp((p.reputation||0)+2,0,100);message='Sua postura agrada à torcida e eleva a confiança para o clássico.';}
  if(action==='derby_fire'){p.reputation=clamp((p.reputation||0)+3,0,100);p.pressure=(p.pressure||0)+2;message='A rivalidade esquenta e todos esperam uma resposta em campo.';}
  if(action==='training_peace'){p.morale=clamp(p.morale+4,40,100);message='O clima melhora e o treino termina sem novo atrito.';}
  if(action==='training_confront'){p.reputation=clamp((p.reputation||0)+1,0,100);p.morale=clamp(p.morale-4,40,100);message='Sua cobrança mostra personalidade, mas pesa no ambiente.';}
  if(action==='travel_rest'){p.morale=clamp(p.morale+3,40,100);message='Você prioriza sono e recuperação após a viagem difícil.';}
  if(action==='travel_activate'){p.developmentBoost=(p.developmentBoost||0)+1;p.morale=clamp(p.morale-2,40,100);message='A ativação extra melhora a preparação, mas cobra energia.';}
  if(action==='sponsor_accept'){p.reputation=clamp((p.reputation||0)+3,0,100);p.pressure=(p.pressure||0)+1;message='Sua exposição cresce, junto da cobrança externa.';}
  if(action==='sponsor_focus'){p.developmentBoost=(p.developmentBoost||0)+1;p.morale=clamp(p.morale+1,40,100);message='Você reduz a agenda e ganha tempo para preparação esportiva.';}
  if(action==='fans_talk'){p.reputation=clamp((p.reputation||0)+3,0,100);p.morale=clamp(p.morale+2,40,100);message='A conversa aproxima você da torcida.';}
  if(action==='fans_train'){p.developmentBoost=(p.developmentBoost||0)+1;message='Você se blinda da pressão e transforma a semana em trabalho.';}
  if(action==='boots_safe'){p.morale=clamp(p.morale+2,40,100);message='Você volta ao equipamento conhecido e recupera conforto.';}
  if(action==='boots_risk'){if(Math.random()<.55){p.developmentBoost=(p.developmentBoost||0)+1;message='A adaptação funciona e você se sente mais solto tecnicamente.';}else{p.morale=clamp(p.morale-2,40,100);message='O material ainda incomoda e a adaptação demora.';}}
  if(action==='setpiece_take'){p.reputation=clamp((p.reputation||0)+2,0,100);p.developmentBoost=(p.developmentBoost||0)+1;message='Você assume mais bolas paradas e ganha protagonismo.';}
  if(action==='setpiece_share'){p.morale=clamp(p.morale+3,40,100);message='A divisão das cobranças fortalece o ambiente do grupo.';}
  if(action==='mentor_help'){p.reputation=clamp((p.reputation||0)+3,0,100);p.morale=clamp(p.morale+2,40,100);message='Você passa a ser visto como referência dentro do elenco.';}
  if(action==='mentor_focus'){p.developmentBoost=(p.developmentBoost||0)+1;message='Você preserva tempo para o próprio desenvolvimento.';}
  if(action==='documentary_yes'){p.reputation=clamp((p.reputation||0)+4,0,100);p.pressure=(p.pressure||0)+2;message='Sua imagem cresce, mas a rotina fica mais exposta.';}
  if(action==='documentary_no'){p.morale=clamp(p.morale+4,40,100);p.pressure=Math.max(0,(p.pressure||0)-1);message='Você protege a rotina e reduz distrações.';}
  if(action==='tactical_adapt'){p.developmentBoost=(p.developmentBoost||0)+1;p.morale=clamp(p.morale+2,40,100);message='A adaptação aumenta sua confiança e repertório.';}
  if(action==='tactical_stay'){p.morale=clamp(p.morale+2,40,100);message='Você mantém sua função mais confortável e preserva estabilidade.';}
  if(action==='captain_speech'){p.reputation=clamp((p.reputation||0)+3,0,100);p.morale=clamp(p.morale+2,40,100);message='Sua voz ganha peso dentro do grupo.';}
  if(action==='captain_example'){p.morale=clamp(p.morale+4,40,100);p.pressure=Math.max(0,(p.pressure||0)-1);message='Sua liderança silenciosa transmite confiança.';}
  if(action==='specialist_primary'){p.developmentBoost=(p.developmentBoost||0)+1;message='A sessão especializada reforça sua principal arma.';}
  if(action==='specialist_weak'){p.potential=clamp((p.potential||p.overall)+1,p.overall,99);message='Você melhora o equilíbrio do jogo e ganha margem de evolução.';}
  if(action==='charity_join'){p.reputation=clamp((p.reputation||0)+3,0,100);p.morale=clamp(p.morale+3,40,100);message='A ação aproxima você da comunidade e melhora seu moral.';}
  if(action==='charity_rest'){p.morale=clamp(p.morale+4,40,100);message='O descanso ajuda a recuperar energia para a sequência.';}
  if(action==='video_learn'){p.developmentBoost=(p.developmentBoost||0)+1;message='A análise de vídeo revela detalhes que podem melhorar seu jogo.';}
  if(action==='video_confidence'){p.morale=clamp(p.morale+4,40,100);message='Rever seus melhores lances aumenta sua confiança.';}
  if(action==='contract_stay'){p.morale=clamp(p.morale+4,40,100);p.pressure=Math.max(0,(p.pressure||0)-1);message='Sua sinalização de permanência reduz os ruídos.';}
  if(action==='contract_market'){p.marketBonus=(p.marketBonus||0)+1;p.reputation=clamp((p.reputation||0)+1,0,100);message='Seu estafe passa a ouvir novas possibilidades.';}
  if(action==='recovery_tech'){p.morale=clamp(p.morale+4,40,100);p.injuryGames=Math.max(0,(p.injuryGames||0)-1);message='O protocolo ajuda sua recuperação física.';}
  if(action==='recovery_normal'){p.morale=clamp(p.morale+2,40,100);message='Você mantém a rotina conhecida e evita mudanças desnecessárias.';}
  if(action==='sponsor_accept'){p.sponsor={brand:e.sponsorBrand,value:e.sponsorValue,startYear:state.season?.year||START_YEAR};p.reputation=clamp((p.reputation||0)+4,0,100);p.morale=clamp(p.morale+2,40,100);message=`Você assina com a ${e.sponsorBrand} por ${money(e.sponsorValue)} por temporada.`;}
  if(action==='sponsor_negotiate'){if(Math.random()<.58){const raised=Math.round((e.sponsorValue||0)*1.22);p.sponsor={brand:e.sponsorBrand,value:raised,startYear:state.season?.year||START_YEAR};p.reputation=clamp((p.reputation||0)+5,0,100);message=`A ${e.sponsorBrand} aceita a negociação: novo acordo de ${money(raised)} por temporada.`;}else{p.reputation=clamp((p.reputation||0)+1,0,100);message=`A ${e.sponsorBrand} não melhora a oferta e as conversas são encerradas.`;}}
  if(action==='sponsor_decline'){p.reputation=clamp((p.reputation||0)+1,0,100);message=`Você recusa a ${e.sponsorBrand} e mantém espaço para futuras propostas.`;}
  if(action==='nt_camp_train'){p.nationalTrust=clamp((p.nationalTrust||0)+4,0,100);p.developmentBoost=(p.developmentBoost||0)+1;message='A sessão extra fortalece sua posição dentro da seleção.';}
  if(action==='nt_camp_rest'){p.morale=clamp(p.morale+4,40,100);message='Você chega mais inteiro para a próxima partida da seleção.';}
  if(action==='nt_penalty_take'||action==='wc_penalty_duty'){p.nationalTrust=clamp((p.nationalTrust||0)+5,0,100);p.pressure=(p.pressure||0)+2;message='Você assume responsabilidade entre os cobradores e ganha protagonismo.';}
  if(action==='nt_penalty_support'||action==='wc_penalty_skip'){p.nationalTrust=clamp((p.nationalTrust||0)+2,0,100);p.morale=clamp(p.morale+3,40,100);message='Sua postura coletiva melhora o ambiente e preserva a confiança.';}
  if(action==='nt_press_ambitious'||action==='nt_rival_media'){p.reputation=clamp((p.reputation||0)+3,0,100);p.pressure=(p.pressure||0)+2;message='Sua fala repercute e aumenta o peso sobre suas atuações pela seleção.';}
  if(action==='nt_press_calm'||action==='nt_rival_focus'){p.nationalTrust=clamp((p.nationalTrust||0)+3,0,100);p.morale=clamp(p.morale+3,40,100);message='Você reduz o ruído e mantém o grupo concentrado.';}
  if(action==='nt_tactical_adapt'||action==='wc_video_study'){p.nationalTrust=clamp((p.nationalTrust||0)+4,0,100);p.developmentBoost=(p.developmentBoost||0)+1;message='A preparação aumenta sua confiança e leitura tática na seleção.';}
  if(action==='nt_tactical_stay'||action==='wc_instinct'){p.morale=clamp(p.morale+2,40,100);message='Você preserva sua confiança na função em que rende melhor.';}
  if(action==='nt_leader_speech'||action==='wc_tunnel_speech'){p.nationalTrust=clamp((p.nationalTrust||0)+5,0,100);p.reputation=clamp((p.reputation||0)+2,0,100);message='Sua voz ganha força no vestiário da seleção.';}
  if(action==='nt_leader_example'||action==='wc_tunnel_calm'){p.nationalTrust=clamp((p.nationalTrust||0)+3,0,100);p.morale=clamp(p.morale+4,40,100);message='Sua postura transmite segurança ao grupo.';}
  if(action==='wc_arrival_embrace'){p.nationalTrust=clamp((p.nationalTrust||0)+4,0,100);p.morale=clamp(p.morale+5,40,100);message='Você absorve o clima da Copa e entra ainda mais motivado.';}
  if(action==='wc_arrival_focus'){p.nationalTrust=clamp((p.nationalTrust||0)+3,0,100);p.pressure=Math.max(0,(p.pressure||0)-1);message='A rotina controlada ajuda você a lidar com a pressão da Copa.';}
  if(action==='wc_family_visit'){p.morale=clamp(p.morale+6,40,100);message='A visita renova seu ânimo durante a Copa.';}
  if(action==='wc_family_focus'){p.nationalTrust=clamp((p.nationalTrust||0)+3,0,100);message='Você mantém foco total na preparação da seleção.';}
  state.news.push(`${e.title}: ${message}`);const resume=!!state.resumeSeasonAfterEvent;state.resumeSeasonAfterEvent=false;state.pendingEvent=null;const eventModal=$('#event-modal');eventModal.classList.add('hidden');eventModal.classList.remove('sponsor-event-active','national-event-active');save();render();toast(message);if(resume&&!state.player?.retired&&state.season&&!state.season.closed)setTimeout(continueSeasonSimulation,120);
}

function showCelebration(icon,title,subtitle){
  const iconBox=$('#celebration-icon');iconBox.className='celebration-icon';
  if(/^https?:/i.test(icon||'')){
    const sources=[icon,fallbackTrophyDataUri(title),'assets/fallback-trophy.svg'],encoded=sources.map(encodeURIComponent).join('|');
    iconBox.innerHTML=`<img src="${sources[0]}" data-sources="${encoded}" data-index="0" alt="${title}" loading="eager" fetchpriority="high" decoding="async" referrerpolicy="no-referrer" onload="polishSiteImage(this)" onerror="cycleHonourImage(this)">`;
  }else iconBox.textContent=icon;
  $('#celebration-title').textContent=title;$('#celebration-subtitle').textContent=subtitle;
  $('#confetti').innerHTML=Array.from({length:38},(_,i)=>`<i style="--x:${rnd(-46,46)}vw;--r:${rnd(90,720)}deg;--d:${(Math.random()*1.4+.8).toFixed(2)}s;--delay:${(Math.random()*.5).toFixed(2)}s"></i>`).join('');
  $('#celebration').classList.remove('hidden');
}
function showCelebrationForHonour(name,title,subtitle){
  const iconBox=$('#celebration-icon');iconBox.className='celebration-icon';
  const sources=trophySourcesFor(name),encoded=sources.map(encodeURIComponent).join('|');
  iconBox.innerHTML=`<img src="${sources[0]}" data-sources="${encoded}" data-index="0" alt="${title}" loading="eager" fetchpriority="high" decoding="async" referrerpolicy="no-referrer" onload="polishSiteImage(this)" onerror="cycleHonourImage(this)">`;
  $('#celebration-title').textContent=title;$('#celebration-subtitle').textContent=subtitle;
  $('#confetti').innerHTML=Array.from({length:38},(_,i)=>`<i style="--x:${rnd(-46,46)}vw;--r:${rnd(90,720)}deg;--d:${(Math.random()*1.4+.8).toFixed(2)}s;--delay:${(Math.random()*.5).toFixed(2)}s"></i>`).join('');
  $('#celebration').classList.remove('hidden');
}

function showSeasonHonoursGallery(titles=[],awards=[]){
  const iconBox=$('#celebration-icon');
  const items=[...titles.map(name=>({name,type:'Título'})),...awards.map(name=>({name,type:'Prêmio'}))];
  iconBox.className='celebration-icon season-honours-showcase';
  iconBox.innerHTML=items.map(item=>`<div class="season-honour-tile">${honourVisual(item.name)}<span><strong>${item.name}</strong><small>${item.type}</small></span></div>`).join('');
  $('#celebration-title').textContent=titles.length?'Temporada de conquistas':'Prêmios da temporada';
  $('#celebration-subtitle').textContent=`${titles.length} título(s) · ${awards.length} prêmio(s)`;
  $('#confetti').innerHTML=Array.from({length:52},(_,i)=>`<i style="--x:${rnd(-48,48)}vw;--r:${rnd(90,900)}deg;--d:${(Math.random()*1.6+.8).toFixed(2)}s;--delay:${(Math.random()*.6).toFixed(2)}s"></i>`).join('');
  $('#celebration').classList.remove('hidden');
}
function specialAwardTheme(name){
  if(/Bola de Ouro/i.test(name))return {className:'ballon-dor',kicker:'NOITE DE GALA · BOLA DE OURO'};
  if(/Chuteira de Ouro/i.test(name))return {className:'golden-shoe',kicker:'CERIMÔNIA · CHUTEIRA DE OURO'};
  return {className:'standard-award',kicker:'PRÊMIO INDIVIDUAL'};
}
function showAwardCeremony(result){
  const p=state.player;const entry=typeof result==='string'?{name:result,winner:p?.name||'Você',isUserWinner:true,stats:[],copy:'Seu nome foi anunciado como vencedor.'}:result;
  const theme=specialAwardTheme(entry.name),stage=$('#award-ceremony-stage');stage.className=`award-ceremony-stage ${theme.className}`;
  $('#award-ceremony-kicker').textContent=theme.kicker;
  $('#award-ceremony-title').textContent=`${entry.winner} — ${entry.name}`;
  $('#award-ceremony-copy').textContent=entry.copy||'';
  $('#award-ceremony-stats').innerHTML=(entry.stats||[]).map(x=>`<span>${x}</span>`).join('');
  $('#award-ceremony-trophy').innerHTML=honourVisual(entry.name);
  $('#award-ceremony-continue').textContent=entry.isUserWinner?'Receber prêmio':'Continuar';
  stage.classList.toggle('award-lost',!entry.isUserWinner);
  $('#award-ceremony-modal').classList.remove('hidden');
}
function playNextAwardCeremony(){
  if(!awardCeremonyQueue.length){
    $('#award-ceremony-modal').classList.add('hidden');
    const after=awardCeremonyAfter;awardCeremonyAfter=null;if(after)after();return;
  }
  showAwardCeremony(awardCeremonyQueue.shift());
}
function queueSpecialAwardCeremonies(results,after){
  awardCeremonyQueue=(results||[]).map(x=>typeof x==='string'?{name:x,winner:state.player?.name||'Você',isUserWinner:true,stats:[],copy:'Seu nome foi anunciado como vencedor.'}:x).filter(x=>/Bola de Ouro|Chuteira de Ouro/i.test(x.name||''));
  awardCeremonyAfter=after;
  if(awardCeremonyQueue.length)playNextAwardCeremony();else if(after)after();
}

function showView(id){
  if(['career','stats','market'].includes(id)&&!state.created)id='create';$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));window.scrollTo({top:0,behavior:'smooth'});render();if(id==='attribute-draft'&&attributeDraft)renderAttributeDraft();
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
  $('#p-name').textContent=p.name;$('#p-pos').textContent=p.position;$('#p-age').textContent=p.age;$('#p-country').textContent=p.nationality;$('#p-birthdate').textContent=formatDateBR(p.birthdate);$('#p-overall').textContent=p.overall;$('#p-potential').textContent=p.potential;$('#p-club').textContent=p.club;$('#p-league').textContent=s?.league?.name||p.clubLeague||clubCompetitionProfile(p.club,p.clubCountry).league;$('#p-value').textContent=money(p.value);$('#avatar').innerHTML=appearanceMarkup(p.appearance,true,p.number||10);$('#avatar').classList.add('face-avatar');const sponsorChip=$('#p-sponsor-chip');sponsorChip?.classList.toggle('hidden',!p.sponsor?.brand);if($('#p-sponsor'))$('#p-sponsor').textContent=p.sponsor?.brand||'';
  const attrs=normalizePlayerAttributes(p),origins=p.attributeOrigins||{};
  const dna=p.dnaAttributes||attrs;const primaryId=primaryAttributeForPosition(p.position);$('#player-attributes').innerHTML=ATTRIBUTE_DRAFT_FIELDS.map(f=>`<div class="player-attribute ${f.id===primaryId?'role-primary':''}"><span><em>${ATTRIBUTE_ICONS[f.id]||'•'}</em>${f.short}${f.id===primaryId?' ★':''}</span><strong>${attributeDisplayValue(f.id,attrs[f.id])}</strong><small>${origins[f.id]?.legend?`DNA ${attributeDisplayValue(f.id,dna[f.id])} · ${origins[f.id].legend}`:f.label}</small></div>`).join('');
  $('#retire-career').classList.toggle('hidden',p.retired||p.age<=30);
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
      $('#favorite-line').innerHTML=`⚡ <strong>${fav.favorite}</strong>`;
      const favoritePct=clamp(fav.favoritePct,8,92);$('#favorite-percent').textContent=`${fav.favoritePct}%`;$('#favorite-meter-fill').style.width=`${favoritePct}%`;
      $('#strength-line').textContent=`CASA ${fav.effectiveHome.toFixed(0)}  ·  FORA ${fav.awayStrength.toFixed(0)}`;
      $('#simulate-btn').disabled=p.retired;$('#simulate-btn').textContent='Simular temporada →';
    }else{
      $('#match-title').textContent=s.closed?'Mercado aberto':'Temporada pronta para ser encerrada';$('#home-team').textContent='';$('#away-team').textContent='';$('#match-competition').textContent='';$('#match-context').textContent=s.closed?'Veja as propostas e depois avance para a próxima temporada.':'';$('#favorite-line').textContent='';$('#favorite-percent').textContent='';$('#favorite-meter-fill').style.width='0%';$('#strength-line').textContent='';$('#simulate-btn').disabled=true;$('#simulate-btn').textContent=s.closed?'Temporada simulada':'Sem partidas pendentes';
    }
    $('#competitions-list').innerHTML=competitionStatus().map(c=>`<div class="competition-item ${c.type==='continental'?'international':''}">${honourVisual(c.title)}<div><strong>${c.title}</strong><small>${c.status}</small></div></div>`).join('');
  }else{
    $('#season-year').textContent='—';$('#s-games').textContent='0';$('#s-goals').textContent='0';$('#s-assists').textContent='0';$('#s-rating').textContent='—';$('#league-round-label').textContent='Carreira encerrada';$('#league-points').textContent='';$('#league-progress-bar').style.width='100%';$('#season-progress').textContent='Aposentado';$('#finish-season').disabled=true;$('#finish-season').textContent='Carreira encerrada';$('#competitions-list').innerHTML='<div class="competition-item"><strong>👟 Carreira concluída</strong><small>Veja o histórico completo na aba Estatísticas.</small></div>';$('#match-title').textContent='Carreira encerrada';$('#home-team').textContent='';$('#away-team').textContent='';$('#match-competition').textContent='';$('#match-context').textContent='';$('#favorite-line').textContent='';$('#favorite-percent').textContent='';$('#favorite-meter-fill').style.width='0%';$('#strength-line').textContent='';$('#simulate-btn').disabled=true;$('#simulate-btn').textContent='Aposentado';
  }
  $('#national-country').textContent=`Seleção de ${p.nationality}`;$('#national-flag').textContent=countryFlag(p.nationalityCode);$('#national-status').textContent=p.calledUp?(s&&isWorldCupYear(s.year)?'Ano de Copa · Convocado':'Convocado'):'Fora da lista';$('#national-message').textContent=p.calledUp?(s&&isWorldCupYear(s.year)?'◆ Preparação especial para a Copa':(p.nationalCaptain?'★ Capitão e referência':'● Grupo principal')):'Suba GER + desempenho';const trust=clamp(p.nationalTrust||0,0,100);$('#national-trust-fill').style.width=`${trust}%`;$('#national-trust-label').textContent=`${trust}%`;$('#nt-games').textContent=p.nationalTeamGames;$('#nt-goals').textContent=p.nationalTeamGoals;$('#national-role').textContent=nationalRoleForPlayer(p);const nationalAction=$('#national-action'),interactionCount=s?.nationalInteractionCount||0,interactionLimit=nationalInteractionLimit(s);nationalAction.disabled=!p.calledUp||p.retired||!s||interactionCount>=interactionLimit;nationalAction.textContent=!p.calledUp?'Aguardando convocação':interactionCount>=interactionLimit?'Conversas concluídas':(isWorldCupYear(s?.year)?`Falar com a seleção · ${interactionCount+1}/${interactionLimit}`:'Conversar com a seleção');
  const newsIcon=n=>/les[aã]o|tratamento|fora/i.test(n)?'✚':/campe[aã]o|t[ií]tulo|trof[eé]u/i.test(n)?'★':/sele[cç][aã]o|convoca/i.test(n)?'◉':/proposta|mercado|clube/i.test(n)?'↗':'●';
  $('#news').innerHTML=(state.news.slice(-4).reverse().map(n=>`<div class="news-item compact"><span class="news-icon">${newsIcon(n)}</span><div><strong>${n}</strong></div></div>`).join('')||'<div class="empty-visual">○<span>Sem notícias</span></div>');
  animateSeasonDashboard();renderHistory();renderOffers();renderHonours();renderMarketTier();if(state.pendingEvent)openPendingEvent();
}
function renderHistory(){
  if(!state.created)return;const current=state.season&&!state.season.closed?state.season:{clubGames:0,clubGoals:0,clubAssists:0};const totals=state.history.reduce((a,h)=>({games:a.games+h.games,goals:a.goals+h.goals,assists:a.assists+h.assists}),{games:current.clubGames||0,goals:current.clubGoals||0,assists:current.clubAssists||0});
  $('#career-games').textContent=totals.games;$('#career-goals').textContent=totals.goals;$('#career-assists').textContent=totals.assists;$('#career-titles').textContent=state.player.titles||0;
  $('#history-body').innerHTML=state.history.length?state.history.slice().reverse().map(h=>`<tr><td>${h.year}</td><td>${h.club}</td><td>${h.overall}</td><td>${h.games}</td><td>${h.goals}</td><td>${h.assists}</td><td>${h.rating}</td><td>${h.leaguePosition?`${h.leaguePosition}º`: '-'}</td></tr>`).join(''):'<tr><td colspan="8" class="muted">Conclua sua primeira temporada para criar o histórico.</td></tr>';
}
function renderHonours(){
  if(!state.created)return;const p=state.player;
  $('#trophies-list').innerHTML=p.trophies?.length?p.trophies.slice().reverse().map(t=>`<div class="honour-row">${honourVisual(t.name)}<span><b>${t.name}</b><small>Título conquistado</small></span><strong>${t.year}</strong></div>`).join(''):'<p class="muted">Nenhum título ainda.</p>';
  $('#awards-list').innerHTML=p.awards?.length?p.awards.slice().reverse().map(a=>`<div class="honour-row">${honourVisual(a.name)}<span><b>${a.name}</b><small>Prêmio individual</small></span><strong>${a.year}</strong></div>`).join(''):'<p class="muted">Nenhum prêmio individual ainda.</p>';
}
function legacyClubEligible(){
  const p=state.player,s=state.season;if(!p||p.retired||!s?.closed||p.age<35)return false;
  const consolidated=(p.overall>=84)||(p.titles||0)>=2||(p.awards||[]).length>=1||(p.reputation||0)>=45;
  return consolidated;
}
function renderLegacyClubChoice(){
  const panel=$('#legacy-club-panel'),select=$('#legacy-club-choice');if(!panel||!select)return;
  const eligible=legacyClubEligible();panel.classList.toggle('hidden',!eligible);if(!eligible)return;
  const p=state.player;const clubs=allTransferClubs().filter(c=>c.name!==p.club).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
  select.innerHTML=clubs.map(c=>`<option value="${c.countryCode}|${c.name.replace(/"/g,'&quot;')}">${c.name} · ${countryByCode(c.countryCode)?.name||c.countryCode}</option>`).join('');
}
function renderMarketTier(){
  if(!state.created)return;const o=state.player.overall;let tier='Desenvolvimento',level=28,icon='◌';if(o>=85){tier='Elite europeia';level=100;icon='★';}else if(o>=79){tier='Europa forte';level=76;icon='◆';}else if(o>=73){tier='Mercado global';level=54;icon='◇';}else if(o>=68){tier='Desenvolvimento internacional';level=36;icon='◎';}
  $('#market-tier').innerHTML=`<div class="market-tier-visual"><span class="market-tier-icon">${icon}</span><div><small>FAIXA ATUAL</small><strong>${tier}</strong></div><div class="market-ger"><b>${o}</b><small>GER</small></div></div><div class="market-tier-track"><span style="width:${level}%"></span></div><div class="market-tier-chips"><span>€ teto ${money(MAX_MARKET_VALUE).replace('€ ','')}</span><span>${state.offers.length} proposta(s)</span></div>`;renderLegacyClubChoice();
}
function renderOffers(){
  if(!state.created)return;const box=$('#offers');box.innerHTML=state.offers.length?state.offers.map((o,i)=>`<article class="panel offer compact-offer" data-club-name="${o.club.replace(/"/g,'&quot;')}"><div class="offer-main"><span class="crest-shell"><img class="club-badge-img hidden" alt=""><span class="crest-fallback">⚽</span></span><div><small>${o.countryName} · ${o.league}</small><h3>${o.club}</h3><div class="offer-metrics"><span>€ ${money(o.value).replace('€ ','')}</span><span>FOR ${o.strength}</span></div></div></div><div class="offer-actions"><button class="primary" onclick="acceptOffer(${i})">Aceitar</button><button class="danger" onclick="rejectOffer(${i})">×</button></div></article>`).join(''):'<div class="empty-market"><span>◎</span><strong>Sem propostas</strong><small>Simule mais uma temporada para movimentar o mercado.</small></div>';hydrateRenderedBadges();
}

$$('[data-view]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showView(el.dataset.view);}));
$('#start-btn').addEventListener('click',()=>showView(state.created?'career':attributeDraft?'attribute-draft':'create'));
$('#nationality').addEventListener('change',loadClubChoices);
$('#reroll-clubs').addEventListener('click',()=>{$('#selected-club').value='';$('#create-submit').disabled=true;drawThreeClubs();});
$('#number').addEventListener('input',()=>{sanitizeShirtNumber();updateAppearancePreview();});
$('#number').addEventListener('blur',()=>{sanitizeShirtNumber();if(!$('#number').value)$('#number').value='10';});
['#appearance-hair-enabled','#appearance-hair-style','#appearance-hair-color','#appearance-beard-enabled','#appearance-beard-style','#appearance-skin'].forEach(sel=>$(sel)?.addEventListener('change',updateAppearancePreview));
$('#close-result').addEventListener('click',()=>$('#match-result').classList.add('hidden'));
$('#close-celebration').addEventListener('click',()=>{$('#celebration').classList.add('hidden');$('#celebration-icon').className='celebration-icon';if(pendingCareerCard){pendingCareerCard=false;showCareerLegacyCard();}});
$('#award-ceremony-continue').addEventListener('click',()=>{$('#award-ceremony-modal').classList.add('hidden');setTimeout(playNextAwardCeremony,180);});

$('#reroll-legend').addEventListener('click',()=>{
  if(!attributeDraft||(attributeDraft.skipsRemaining||0)<=0)return;
  const previous=attributeDraft.current.legend.name;
  attributeDraft.skipsRemaining=0;
  drawLegendForDraft(previous);saveDraftState();renderAttributeDraft();
});

$('#player-form').addEventListener('submit',e=>{
  e.preventDefault();sanitizeShirtNumber();const number=Number($('#number').value);if(!Number.isInteger(number)||number<1||number>99){toast('O número da camiseta deve ser de 1 a 99.');return;}
  const birthdate=$('#birthdate').value,age=calculateAge(birthdate);if(age<=16||age>=23){toast('A idade inicial precisa ser de 17 a 22 anos.');return;}
  const code=$('#nationality').value,country=countryByCode(code),selected=creationChoices.find(c=>c.name===$('#selected-club').value);if(!selected){toast('Escolha um dos três clubes sorteados.');return;}
  const profile={name:$('#name').value.trim(),birthdate,age,nationality:country.name,nationalityCode:code,position:$('#position').value,foot:$('#foot').value,club:selected.name,clubCountry:code,clubCountryName:country.name,clubStrength:selected.strength,number,appearance:currentAppearanceFromForm()};
  startAttributeDraft(profile);
});

$('#national-action').addEventListener('click',openNationalInteraction);
$('#national-modal-close').addEventListener('click',()=>$('#national-modal').classList.add('hidden'));
$('#legacy-club-sign').addEventListener('click',signLegacyClub);
$('#legacy-close').addEventListener('click',()=>{if(state.player){state.player.legacyCardSeen=true;save();}$('#career-legacy-modal').classList.add('hidden');});
$('#legacy-view-stats').addEventListener('click',()=>{if(state.player){state.player.legacyCardSeen=true;save();}$('#career-legacy-modal').classList.add('hidden');showView('stats');});

function openNationalInteraction(){
  const p=state.player,s=state.season;if(!p?.calledUp){toast('Você ainda precisa ser convocado para interagir com a seleção.');return;}
  if(p.retired||!s)return;const limit=nationalInteractionLimit(s);if((s.nationalInteractionCount||0)>=limit){toast('Você já concluiu as conversas disponíveis com a seleção nesta temporada.');return;}
  const wc=isWorldCupYear(s.year);
  $('#national-modal-title').textContent=`${p.nationality} · ${wc?'Ano de Copa':'Data FIFA'} · ${nationalRoleForPlayer(p)}`;
  $('#national-modal-copy').textContent=wc?`Confiança: ${p.nationalTrust||0}/100. Em ano de Copa você pode ter até ${limit} conversas especiais com a comissão.`:`Confiança na seleção: ${p.nationalTrust||0}/100. Escolha como conduzir sua relação com a comissão técnica.`;
  const choices=wc?[
    {label:'Treinar pênaltis',effect:'+ confiança; assume responsabilidade em jogos grandes.',action:'wc_penalties'},
    {label:'Pedir papel de protagonista',effect:'+ confiança e reputação; + pressão.',action:'wc_star'},
    {label:'Blindar o grupo',effect:'+ moral e entrosamento na Copa.',action:'wc_group'},
    {label:'Estudar os rivais',effect:'+ preparação e desenvolvimento.',action:'wc_scout'}
  ]:[
    {label:'Pedir mais minutos',effect:'Aumenta confiança, mas também a cobrança.',action:'minutes'},
    {label:'Focar no entrosamento',effect:'Melhora confiança e moral com baixo risco.',action:'chemistry'},
    {label:'Assumir liderança',effect:'Busca protagonismo e pode aproximar a braçadeira.',action:'leadership'}
  ];
  $('#national-modal-choices').innerHTML=choices.map((c,i)=>`<button class="event-choice national-choice visual-event-choice" data-national-choice="${i}"><span>${['↗','◎','★','◈'][i]||'◆'}</span><strong>${c.label}</strong><small>${c.effect}</small></button>`).join('');
  $$('.national-choice').forEach(b=>b.addEventListener('click',()=>resolveNationalInteraction(choices[+b.dataset.nationalChoice].action)));
  $('#national-modal').classList.remove('hidden');
}
function resolveNationalInteraction(action){
  const p=state.player,s=state.season;if(!p||!s)return;let msg='Conversa concluída.';
  if(action==='minutes'){p.nationalTrust=clamp((p.nationalTrust||0)+4,0,100);p.pressure=(p.pressure||0)+1;msg='Você pede mais espaço e entra no radar para ter mais protagonismo.';}
  if(action==='chemistry'){p.nationalTrust=clamp((p.nationalTrust||0)+3,0,100);p.morale=clamp(p.morale+3,40,100);msg='A postura coletiva melhora seu entrosamento com o grupo.';}
  if(action==='leadership'){p.nationalTrust=clamp((p.nationalTrust||0)+5,0,100);p.reputation=clamp((p.reputation||0)+2,0,100);msg='Você assume mais responsabilidade dentro da seleção.';}
  if(action==='wc_penalties'){p.nationalTrust=clamp((p.nationalTrust||0)+5,0,100);p.pressure=(p.pressure||0)+2;msg='Você entra na lista de cobradores para os momentos decisivos da Copa.';}
  if(action==='wc_star'){p.nationalTrust=clamp((p.nationalTrust||0)+6,0,100);p.reputation=clamp((p.reputation||0)+3,0,100);p.pressure=(p.pressure||0)+2;msg='A comissão entende que você quer ser protagonista na Copa.';}
  if(action==='wc_group'){p.nationalTrust=clamp((p.nationalTrust||0)+4,0,100);p.morale=clamp(p.morale+5,40,100);msg='Sua postura fortalece o ambiente e o entrosamento do grupo.';}
  if(action==='wc_scout'){p.nationalTrust=clamp((p.nationalTrust||0)+4,0,100);p.developmentBoost=(p.developmentBoost||0)+1;msg='Você estuda os adversários e chega mais preparado aos jogos da Copa.';}
  if(!p.nationalCaptain&&(p.nationalTeamGames||0)>=18&&(p.nationalTrust||0)>=82&&(p.reputation||0)>=45&&p.age>=25){p.nationalCaptain=true;msg+=' A comissão entrega a braçadeira de capitão a você.';}
  s.nationalInteractionCount=(s.nationalInteractionCount||0)+1;p.lastNationalInteractionYear=s.year;state.news.push(`Seleção de ${p.nationality}: ${msg}`);$('#national-modal').classList.add('hidden');save();render();toast(msg);
}
function careerTotals(){
  const p=state.player;return (state.history||[]).reduce((a,h)=>({games:a.games+(h.games||0),goals:a.goals+(h.goals||0),assists:a.assists+(h.assists||0)}),{games:0,goals:0,assists:0});
}
function historicalRankBreakdown(){
  const p=state.player,tot=careerTotals(),peak=Math.max(p.overall||0,...(state.history||[]).map(h=>h.overall||0),68);
  const trophies=p.trophies||[],awards=p.awards||[];
  const count=rx=>trophies.filter(t=>rx.test(t.name)).length;
  const worldCups=count(/FIFA World Cup|Copa do Mundo/i),champions=count(/UEFA Champions League/i),libertadores=count(/CONMEBOL Libertadores/i),clubWorlds=count(/Mundial|Club World Cup/i);
  const ballons=awards.filter(a=>/Bola de Ouro/i.test(a.name)).length;
  const peakPts=Math.max(0,peak-68)*4.2;
  const majorPts=worldCups*45+champions*20+libertadores*18+clubWorlds*14;
  const titlePts=Math.max(0,trophies.length-worldCups-champions-libertadores-clubWorlds)*5;
  const awardPts=ballons*28+Math.max(0,awards.length-ballons)*8;
  const productionPts=tot.goals/14+tot.assists/20;
  const nationalPts=(p.nationalTeamGames||0)/7+(p.nationalTeamGoals||0)/4;
  const longevityPts=(state.history||[]).length*1.5;
  const score=peakPts+majorPts+titlePts+awardPts+productionPts+nationalPts+longevityPts;
  let rank;if(score>=330)rank=1;else if(score>=285)rank=Math.round(2+(330-score)/9);else if(score>=235)rank=Math.round(7+(285-score)/5);else if(score>=180)rank=Math.round(17+(235-score)/3);else if(score>=125)rank=Math.round(35+(180-score)/2);else rank=Math.round(63+(125-score)*1.4);
  rank=clamp(rank,1,300);
  const tier=rank<=5?'Panteão do futebol':rank<=15?'Entre os maiores da história':rank<=30?'Lenda mundial':rank<=60?'Ídolo histórico':rank<=100?'Carreira de elite':'Carreira de destaque';
  return {rank,tier,score:Math.round(score),peak,worldCups,champions,libertadores,clubWorlds,ballons};
}
function historicalRankEstimate(){return historicalRankBreakdown().rank;}
function showCareerLegacyCard(){
  const p=state.player;if(!p)return;const tot=careerTotals(),r=historicalRankBreakdown(),trophies=p.trophies||[],awards=p.awards||[];
  const leagueTitles=Math.max(0,trophies.length-r.worldCups-r.champions-r.libertadores-r.clubWorlds);
  const clubs=[...new Set([...(state.history||[]).map(h=>h.club).filter(Boolean),p.club].filter(Boolean))];
  $('#legacy-card-name').textContent=p.name;$('#legacy-card-subtitle').textContent=`${p.position} · ${p.nationality} · camisa ${p.number||10} · aposentado aos ${p.retiredAge||p.age} anos`;
  $('#legacy-rank').textContent=`#${r.rank}`;$('#legacy-final-overall').textContent=p.overall||'—';$('#legacy-peak-overall').textContent=r.peak;$('#legacy-seasons').textContent=(state.history||[]).length;$('#legacy-titles').textContent=trophies.length;$('#legacy-awards').textContent=awards.length;$('#legacy-position').textContent=p.position;$('#legacy-games').textContent=tot.games;$('#legacy-goals').textContent=tot.goals;$('#legacy-assists').textContent=tot.assists;$('#legacy-nt').textContent=p.nationalTeamGames||0;$('#legacy-shirt-name').textContent=p.name.split(' ').slice(-1)[0].toUpperCase();$('#legacy-shirt-number').textContent=p.number||10;
  $('#legacy-major-titles').innerHTML=[{label:'Copa do Mundo',count:r.worldCups,art:'FIFA World Cup'},{label:'Champions',count:r.champions,art:'UEFA Champions League'},{label:'Mundial',count:r.clubWorlds,art:'FIFA Club World Cup'},{label:'Libertadores',count:r.libertadores,art:'CONMEBOL Libertadores'},{label:'Ligas/Copas',count:leagueTitles,art:trophies[0]?.name||'Premier League'},{label:'Bola de Ouro',count:r.ballons,art:'Bola de Ouro'}].map(item=>`<div class="legacy-major-item">${honourVisual(item.art)}<span><strong>${item.count}</strong><small>${item.label}</small></span></div>`).join('');
  $('#legacy-clubs').innerHTML=clubs.length?clubs.map(name=>`<div class="legacy-club-chip"><span class="crest-shell small"><img class="club-badge-img hidden" alt=""><span class="crest-fallback">⚽</span></span><b>${name}</b></div>`).join(''):'<p class="muted">Nenhum clube registrado.</p>';
  const honours=[...trophies.slice(-6),...awards.slice(-3)];$('#legacy-honours-preview').innerHTML=honours.length?honours.map(h=>`<div>${honourVisual(h.name)}<span><strong>${h.name}</strong><small>${h.year}</small></span></div>`).join(''):'<p class="muted">A carreira terminou sem títulos ou prêmios registrados.</p>';
  $('#legacy-rank-tier').textContent=`${r.tier} · #${r.rank}`;$('#legacy-rank-detail').textContent=`Pontuação histórica ${r.score}. Critérios: auge (GER), Copa do Mundo, Champions/Libertadores, Mundial, outros títulos, Bola de Ouro e demais prêmios, gols, assistências, seleção e longevidade.`;
  $('#career-legacy-modal').classList.remove('hidden');$$('#legacy-clubs .legacy-club-chip').forEach(el=>hydrateBadge(el.querySelector('img'),el.querySelector('b')?.textContent,el.querySelector('.crest-fallback')));
}

function signLegacyClub(){
  const p=state.player;if(!legacyClubEligible())return;const raw=$('#legacy-club-choice').value;if(!raw)return;const sep=raw.indexOf('|'),code=raw.slice(0,sep),name=raw.slice(sep+1);const club=allTransferClubs().find(c=>c.countryCode===code&&c.name===name);if(!club)return;
  const old=p.club;p.club=club.name;p.clubCountry=club.countryCode;p.clubCountryName=countryByCode(club.countryCode)?.name||club.countryCode;p.clubStrength=club.strength||clubStrength(club.name,club.countryCode);p.clubLeague=club.league||clubCompetitionProfile(club.name,club.countryCode).league;p.clubCup=club.cup||clubCompetitionProfile(club.name,club.countryCode).cup;p.clubDivisionLevel=club.divisionLevel||1;p.value=marketValue(p.value);state.offers=[];state.news.push(`${p.name}, já consolidado, escolhe o ${club.name} para um dos últimos capítulos da carreira, deixando o ${old}.`);applyClubTheme(p.club);save();render();showCelebration('✍️',`Destino escolhido: ${club.name}`,`${p.name} decide onde quer escrever o fim da própria história.`);
}

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
  p.value=marketValue(p.value*(1+delta*.11));p.age++;
  state.news.push(`${p.name} encerra ${s.year} com média ${avg.toFixed(1)}. GER ${p.overall} (${delta>=0?'+':''}${delta}) e POT ${p.potential}.`);
  generateOffers(avg);s.endProcessed=true;s.closed=true;s.endAverage=avg;s.developmentDelta=delta;
  if(p.age>=46){p.retired=true;p.age=46;p.retiredAge=46;p.legacyCardSeen=false;pendingCareerCard=true;state.news.push(`${p.name} encerra oficialmente a carreira aos 46 anos.`);state.offers=[];}
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
  pendingSeasonCelebration={titles:newTitles,awards:newAwards,ceremonies:state.season?.specialAwardCeremonies||[]};state.simulatingSeason=false;nextEventCache=null;save();render();showSeasonSpotlight(featured);
  toast(`${state.offers.length} proposta(s) chegaram ao fim da temporada.`);
}
function showPendingSeasonCelebration(){
  const c=pendingSeasonCelebration;pendingSeasonCelebration=null;if(!c)return;
  const ceremonies=c.ceremonies||[];if(!c.titles.length&&!c.awards.length&&!ceremonies.length)return;
  const after=()=>{if(c.titles.length||c.awards.length)showSeasonHonoursGallery(c.titles,c.awards);};
  queueSpecialAwardCeremonies(ceremonies,after);
}

$('#simulate-btn').addEventListener('click',simulateWholeSeason);
$('#close-spotlight').addEventListener('click',()=>{$('#season-spotlight').classList.add('hidden');showPendingSeasonCelebration();});

$('#finish-season').addEventListener('click',()=>{
  const p=state.player,s=state.season;if(!s||!s.closed||p.retired)return;
  const oldDelta=s.developmentDelta||0;const stayed=p.club===(s.clubAtStart||p.club);
  const earned=stayed?continentalFromLeagueResult(s.countryAtStart||p.clubCountry,s.league.position,s.divisionLevel||1):((p.clubDivisionLevel||1)>1?null:qualificationForClub(p.clubCountry,p.clubStrength));
  const nextYear=s.year+1;state.offers=[];state.season=createSeason(p,nextYear,earned);nextEventCache=null;
  if(p.age>=30&&oldDelta<0)state.news.push(`A idade começa a pesar: ${p.name} perdeu ${Math.abs(oldDelta)} ponto(s) de overall na última temporada.`);
  if(Math.random()<.60){const event=pickFreshCareerEvent(CAREER_EVENTS);if(event)state.pendingEvent={...event};}
  save();render();toast(`Temporada ${nextYear} iniciada. GER ${p.overall} · POT ${p.potential}`);
});

window.acceptOffer=index=>{
  const o=state.offers[index],p=state.player;if(!o||p.retired)return;const old=p.club;p.club=o.club;p.clubCountry=o.countryCode;p.clubCountryName=o.countryName;p.clubStrength=o.strength;p.clubLeague=o.league||clubCompetitionProfile(o.club,o.countryCode).league;p.clubCup=o.cup||clubCompetitionProfile(o.club,o.countryCode).cup;p.clubDivisionLevel=o.divisionLevel||1;p.value=marketValue(o.value);p.morale=clamp(p.morale+5,40,100);state.news.push(`${p.name} deixa o ${old} e é anunciado pelo ${o.club}${p.clubDivisionLevel>1?` (${p.clubLeague})`:''}.`);state.offers=[];applyClubTheme(p.club);save();render();showCelebration('✍️',`Novo clube: ${o.club}`,`${p.name} inicia um novo capítulo da carreira.`);
};
window.rejectOffer=index=>{state.offers.splice(index,1);save();render();toast('Proposta recusada.');};

$('#reset-career').addEventListener('click',()=>{
  if(!confirm('Apagar a carreira atual e começar novamente?'))return;localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(LEGACY_STORAGE_KEY);clearDraftState();pendingPlayerProfile=null;attributeDraft=null;state={created:false,player:null,season:null,history:[],offers:[],news:[],pendingEvent:null};nextEventCache=null;applyClubTheme(null);showView('home');toast('Carreira apagada.');
});


$('#retire-career').addEventListener('click',()=>{
  const p=state.player,s=state.season;if(!p||p.retired)return;
  if(p.age<=30){toast('A aposentadoria voluntária fica disponível após os 30 anos.');return;}
  if(!confirm(`Encerrar a carreira de ${p.name} aos ${p.age} anos? Esta decisão é definitiva.`))return;
  if(s&&!s.closed&&s.clubGames>0){
    const avg=s.totalGames?s.ratingSum/s.totalGames:6.5;
    state.history.push({year:s.year,club:s.clubAtStart||p.club,clubCountry:s.countryAtStart||p.clubCountry,overall:p.overall,games:s.clubGames,goals:s.clubGoals,assists:s.clubAssists,rating:avg.toFixed(1),leaguePosition:s.league.position||null,cupStatus:'Aposentadoria durante a temporada',continentalStatus:'Aposentadoria durante a temporada',competitions:competitionStatus().map(c=>c.title)});
  }
  p.retired=true;p.retiredAge=p.age;p.legacyCardSeen=false;state.offers=[];state.pendingEvent=null;state.pendingMatchDecision=null;state.season=null;
  state.news.push(`${p.name} anunciou a aposentadoria aos ${p.age} anos.`);pendingCareerCard=true;
  nextEventCache=null;save();render();showCelebration('👟','Fim de carreira',`${p.name} encerra sua trajetória profissional aos ${p.age} anos.`);
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
// Limites de GER para o começo da carreira. O POT pode continuar acima desses
// valores; o limite controla apenas quanto GER o jogador pode atingir em cada temporada.
const EARLY_CAREER_OVERALL_CAPS = [73, 78, 82, 87];
function currentCareerSeasonNumber(){
  if(state.season?.year && typeof START_YEAR!=='undefined') return Math.max(1,state.season.year-START_YEAR+1);
  return Math.max(1,(state.history?.length||0)+1);
}
function currentSeasonOverallCap(){
  const seasonNumber=currentCareerSeasonNumber();
  return EARLY_CAREER_OVERALL_CAPS[seasonNumber-1] ?? 99;
}

function developmentResult(avg){
  const p=state.player,s=state.season,age=p.age,gk=p.position==='Goleiro',devAge=gk?age-3:age;
  const games=Math.max(1,s?.clubGames||1),contributions=(s?.clubGoals||0)+(s?.clubAssists||0),rate=contributions/games;
  const attacking=!['Goleiro','Zagueiro','Lateral direito','Lateral esquerdo','Volante'].includes(p.position);
  const contributionTarget=attacking?.48:.18;
  const attrs=normalizePlayerAttributes(p),roleSkill=positionWeightedAttributeScore(p,attrs);
  const primaryId=primaryAttributeForPosition(p.position),primaryValue=normalizedAttributeValue(primaryId,attrs[primaryId]);

  // Curva moderada de evolução. A intenção é que um jovem de bom rendimento siga
  // algo próximo de 68 -> 72 -> 75 -> 78 -> 81, sem transformar toda temporada
  // positiva em um salto enorme de overall.
  let base=avg>=8.8?5:avg>=8.3?4:avg>=7.2?3:avg>=6.8?2:avg>=6.5?1:avg<5.8?-2:avg<6.1?-1:0;
  if(devAge<=22&&p.overall<=69&&avg>=7.2)base=Math.max(base,4);

  // Produção acima do esperado ajuda, mas o bônus de performance é limitado a 1.
  let performanceBonus=0;
  if(avg>=7.3&&rate>=contributionTarget*1.25)performanceBonus=1;
  if(avg>=8.2&&(primaryValue>=82||roleSkill>=84))performanceBonus=1;
  base+=performanceBonus;

  // A idade e o GER atual criam um teto de ganho por temporada. No começo da
  // carreira o primeiro salto pode chegar a +4; depois a progressão típica fica
  // em +3. Temporadas realmente excepcionais podem ultrapassar isso em 1 ponto.
  if(base>0){
    let cap;
    if(devAge<=22)cap=p.overall<72?4:3;
    else if(devAge<=25)cap=3;
    else if(devAge<=29)cap=2;
    else if(devAge<=32)cap=1;
    else if(devAge<=35)cap=avg>=8.5?1:0;
    else cap=0;
    if(avg>=8.8&&devAge<=29)cap+=1;
    base=Math.min(base,cap);
  }

  // Declínio físico: a partir dos 35 anos o GER passa a cair em todas as posições.
  // Temporadas excelentes reduzem o ritmo da queda, mas não voltam a gerar crescimento.
  if(age>=35){
    if(age<=36)base=-1;
    else if(age<=38)base=avg>=8.6?-1:-rnd(1,2);
    else if(age<=40)base=-rnd(1,2);
    else if(age<=42)base=-rnd(2,3);
    else base=-rnd(3,5);
  }

  // Bônus de treino pode ajudar, mas não deve romper a curva de evolução.
  const trainingBoost=clamp(p.developmentBoost||0,0,1);p.developmentBoost=0;
  if(age<35&&base>0&&trainingBoost){
    const trainingCap=devAge<=22?(p.overall<72?4:3):devAge<=25?3:devAge<=29?2:1;
    base=Math.min(base+trainingBoost,trainingCap+(avg>=8.8&&devAge<=29?1:0));
  }
  base=clamp(base,-5,5);

  // O potencial segue dinâmico, porém agora se move de forma mais gradual.
  let potentialDelta=age>=35?-1:(avg>=8.8?3:avg>=8.2?2:avg>=7.2?1:avg<5.9&&age<=29?-1:0);
  if(avg>=8.3&&rate>=contributionTarget*1.40)potentialDelta=Math.min(3,potentialDelta+1);
  if(avg>=8.6&&primaryValue>=85&&roleSkill>=84)potentialDelta=Math.min(3,potentialDelta+1);
  p.potential=clamp(p.potential+potentialDelta,Math.max(68,p.overall),99);

  // Se o desempenho justificaria evolução mas o POT estiver apenas um pouco
  // abaixo, ele pode se ajustar suavemente em vez de bloquear a carreira de vez.
  if(base>0&&p.overall+base>p.potential&&avg>=7.4){
    const needed=p.overall+base-p.potential;
    const ceilingBoost=clamp(needed,1,2);
    p.potential=clamp(p.potential+ceilingBoost,p.overall,99);
  }

  const before=p.overall;
  const seasonOverallCap=currentSeasonOverallCap();
  if(base>0)p.overall=Math.min(seasonOverallCap,99,Math.min(p.potential,p.overall+base));
  else p.overall=clamp(p.overall+base,45,Math.min(99,seasonOverallCap));
  if(age>=35)p.potential=Math.max(p.overall,p.potential);
  const delta=p.overall-before;evolvePlayerAttributes(delta,avg);return delta;
}

function marketBandForOverall(overall){
  if(overall<=72)return {id:'development',label:'Desenvolvimento',tiers:['development'],target:71,spread:6};
  if(overall<=78)return {id:'global',label:'Mercado global',tiers:['global','development','upper'],target:78,spread:7};
  if(overall<=84)return {id:'upper',label:'Europa forte',tiers:['upper','global','elite'],target:84,spread:7};
  return {id:'elite',label:'Elite europeia',tiers:['elite','upper'],target:90,spread:8};
}
function inferredMarketTier(c){
  if(c.marketTier)return c.marketTier;const strength=c.strength||72,conf=confederation(c.countryCode);
  if(conf==='UEFA')return strength>=87?'elite':strength>=80?'upper':strength>=74?'global':'development';
  if(['US','MX','JP','SA','KR','QA','AE'].includes(c.countryCode))return strength>=82?'upper':'global';
  return strength>=83?'upper':strength>=74?'global':'development';
}
function offerClubScore(c,p,band,avg){
  const strength=c.strength||72,tier=inferredMarketTier(c),tierIndex=band.tiers.indexOf(tier),conf=confederation(c.countryCode);let score=0;
  score+=tierIndex===0?42:tierIndex===1?22:tierIndex===2?8:-18;
  score+=Math.max(0,28-Math.abs(strength-band.target)*3.1);
  if(c.minOverall&&p.overall<c.minOverall)score-=80;
  if(c.maxOverall&&p.overall>c.maxOverall)score-=55;
  if((c.divisionLevel||1)>1&&p.overall>=79)score-=65;
  if(band.id==='development'){
    if((c.divisionLevel||1)>1)score+=20;
    if(conf==='UEFA'&&!['ENG','ES','DE','IT','FR'].includes(c.countryCode)&&strength<=79)score+=24;
  }
  if(band.id==='global'&&['US','MX','JP','SA','KR','QA','AE'].includes(c.countryCode))score+=20;
  if(band.id==='upper')score+=conf==='UEFA'?20:-38;
  if(band.id==='elite')score+=conf==='UEFA'&&strength>=86?28:-90;
  score+=(avg-6.5)*7+Math.random()*18;
  return score;
}
function generateOffers(avg){
  const p=state.player,band=marketBandForOverall(p.overall);let all=allTransferClubs().filter(c=>c.name!==p.club);
  const recent=new Set(p.recentOfferClubs||[]);let eligible=all.filter(c=>(!c.minOverall||p.overall>=c.minOverall)&&(!c.maxOverall||p.overall<=c.maxOverall));
  if(band.id==='upper')eligible=eligible.filter(c=>confederation(c.countryCode)==='UEFA'&&(c.divisionLevel||1)===1);
  if(band.id==='elite')eligible=eligible.filter(c=>confederation(c.countryCode)==='UEFA'&&(c.divisionLevel||1)===1&&(c.strength||72)>=82);
  if(band.id==='global')eligible=eligible.filter(c=>inferredMarketTier(c)!=='elite');
  if(eligible.length<12){eligible=all.filter(c=>(!c.minOverall||p.overall>=c.minOverall));if(band.id==='upper'||band.id==='elite')eligible=eligible.filter(c=>confederation(c.countryCode)==='UEFA'&&(c.divisionLevel||1)===1);}
  const fresh=eligible.filter(c=>!recent.has(`${c.countryCode}:${c.name}`));if(fresh.length>=10)eligible=fresh;
  const ranked=eligible.map(c=>({...c,_marketScore:offerClubScore(c,p,band,avg)})).sort((a,b)=>b._marketScore-a._marketScore);
  const performanceCount=avg>=8.15?4:avg>=7.25?3:2;const count=clamp(performanceCount+(p.marketBonus||0),2,4);p.marketBonus=0;
  const shortlist=ranked.slice(0,Math.min(42,ranked.length));const chosen=[],usedCountries=new Set();
  for(let slot=0;slot<count;slot++){
    let pool=shortlist.filter(c=>!chosen.some(x=>x.name===c.name&&x.countryCode===c.countryCode)&&!usedCountries.has(c.countryCode));
    if(!pool.length)pool=shortlist.filter(c=>!chosen.some(x=>x.name===c.name&&x.countryCode===c.countryCode));
    if(!pool.length)break;
    const window=pool.slice(0,Math.min(12,pool.length));const pick=window[Math.floor(Math.pow(Math.random(),1.65)*window.length)];
    if(pick){chosen.push(pick);usedCountries.add(pick.countryCode);}
  }
  if(chosen.length<count){for(const c of ranked){if(chosen.length>=count)break;if(!chosen.some(x=>x.name===c.name&&x.countryCode===c.countryCode))chosen.push(c);}}
  const valueMultiplier=tier=>tier==='elite'?[1.24,1.90]:tier==='upper'?[1.14,1.72]:tier==='global'?[1.05,1.52]:[.96,1.34];
  state.offers=chosen.slice(0,count).map(c=>{
    const profile=clubCompetitionProfile(c.name,c.countryCode),tier=inferredMarketTier(c),[lo,hi]=valueMultiplier(tier);return {club:c.name,countryCode:c.countryCode,countryName:countryByCode(c.countryCode)?.name||c.countryCode,league:c.league||profile.league,cup:c.cup||profile.cup,divisionLevel:c.divisionLevel||profile.divisionLevel||1,marketTier:tier,strength:c.strength||clubStrength(c.name,c.countryCode),minOverall:c.minOverall||null,value:marketValue(p.value*(lo+Math.random()*(hi-lo)))};
  });
  p.recentOfferClubs=[...(p.recentOfferClubs||[]),...state.offers.map(o=>`${o.countryCode}:${o.club}`)].slice(-14);
  state.news.push(`${p.name} recebeu ${state.offers.length} proposta(s) ao fim da temporada · faixa ${band.label}.`);
}

function cupFinalStatus(comp){
  if(!comp)return 'Não disputou';if(comp.won)return 'Campeão';if(comp.eliminated)return `Eliminado — ${comp.stages[comp.stageIndex]?.name||'mata-mata'}`;return comp.active?`${comp.stages[comp.stageIndex]?.name||'Em andamento'}`:'Encerrado';
}
function continentalFinalStatus(c){
  if(!c)return 'Não disputou';if(c.won)return 'Campeão';if(c.eliminated)return c.phase==='phase'?`Eliminado — ${c.format.phase}`:`Eliminado — ${c.knockout.stages[c.knockout.stageIndex]?.name||'mata-mata'}`;return c.phase==='phase'?`${c.format.phase} — ${c.points} pts`:`${c.knockout.stages[c.knockout.stageIndex]?.name||'Mata-mata'}`;
}
function buildDecisionScenario(event){
  const p=state.player,s=state.season;
  const minute=rnd(18,88),quality=clamp((p.overall-67)*.008,0,.20);
  const boost=opts=>opts.map(o=>({...o,chance:clamp(o.chance+quality,.12,.94)}));
  const make=(id,visual,title,description,options,prompt='')=>({id,minute,visual,title,description,options:boost(options),prompt});
  const goalkeeper=[
    make('gk_one_on_one','goalkeeper','Cara a cara',`${event.opponent} escapa em velocidade e fica frente a frente com você.`,[
      {label:'Sair do gol',effect:'Fecha o ângulo, mas aumenta o risco.',type:'defense',chance:.58,rating:.58,risk:.18},
      {label:'Esperar a finalização',effect:'Confia nos reflexos e mantém a posição.',type:'defense',chance:.66,rating:.46,risk:.09},
      {label:'Fechar o canto curto',effect:'Protege o lado mais próximo.',type:'defense',chance:.61,rating:.52,risk:.13}], 'Escolha como defender o 1 contra 1'),
    make('gk_cross','goalkeeper','Cruzamento venenoso','A bola vem fechada na pequena área com vários jogadores disputando.',[
      {label:'Sair de soco',effect:'Agressivo e eficaz se o tempo for perfeito.',type:'defense',chance:.61,rating:.55,risk:.16},
      {label:'Tentar segurar',effect:'Mais controle, mas exige segurança.',type:'defense',chance:.57,rating:.65,risk:.18},
      {label:'Ficar na linha',effect:'Evita o erro na saída e reage à cabeçada.',type:'defense',chance:.68,rating:.42,risk:.09}], 'Decida como atacar o cruzamento'),
    make('gk_penalty','goalkeeper','Pênalti contra','O árbitro aponta a marca da cal. O cobrador espera sua reação.',[
      {label:'Canto esquerdo',effect:'Aposte na leitura corporal do batedor.',type:'defense',chance:.40,rating:.82,risk:.12},
      {label:'Esperar no centro',effect:'Chance menor de se comprometer cedo.',type:'defense',chance:.36,rating:.88,risk:.10},
      {label:'Canto direito',effect:'Tente antecipar a direção da cobrança.',type:'defense',chance:.40,rating:.82,risk:.12}], 'Escolha sua leitura do pênalti'),
    make('gk_long_shot','goalkeeper','Chute de longa distância','O meia rival encontra espaço e arma uma finalização forte de fora da área.',[
      {label:'Dar um passo à frente',effect:'Melhora o ângulo, mas exige reação rápida.',type:'defense',chance:.66,rating:.52,risk:.10},
      {label:'Manter-se na linha',effect:'Prioriza tempo de reação.',type:'defense',chance:.70,rating:.44,risk:.08},
      {label:'Antecipar o canto',effect:'Leitura ousada para buscar uma grande defesa.',type:'defense',chance:.54,rating:.74,risk:.18}], 'Escolha seu posicionamento'),
    make('gk_sweeper','goalkeeper','Bola nas costas da defesa','Um lançamento longo quebra a linha e você precisa decidir se sai da área.',[
      {label:'Sair como líbero',effect:'Pode matar a jogada antes do atacante.',type:'defense',chance:.60,rating:.66,risk:.20},
      {label:'Esperar na área',effect:'Menos risco, mas concede avanço.',type:'defense',chance:.68,rating:.42,risk:.10},
      {label:'Atacar a bola de cabeça',effect:'Muito arriscado, grande impacto se funcionar.',type:'defense',chance:.48,rating:.88,risk:.26}], 'Decida até onde sair do gol')
  ];
  const defenders=[
    make('def_tackle','defense','Ataque perigoso','O adversário acelera perto da área e você é o último defensor por dentro.',[
      {label:'Dar o bote',effect:'Pode roubar a bola ou ser driblado.',type:'defense',chance:.60,rating:.52,risk:.18},
      {label:'Cercar e atrasar',effect:'Força o atacante a pensar.',type:'defense',chance:.70,rating:.38,risk:.08},
      {label:'Antecipar o passe',effect:'Leitura difícil, recompensa alta.',type:'defense',chance:.53,rating:.67,risk:.22}], 'Escolha sua abordagem defensiva'),
    make('def_cross','defense','Cruzamento na segunda trave','O ponta levanta a bola e seu adversário aparece atacando o espaço.',[
      {label:'Atacar a bola',effect:'Prioriza o corte antes do cabeceio.',type:'defense',chance:.66,rating:.52,risk:.11},
      {label:'Marcar o corpo',effect:'Tira o equilíbrio do atacante.',type:'defense',chance:.63,rating:.49,risk:.12},
      {label:'Recuar para a linha',effect:'Protege o gol, mas concede a disputa.',type:'defense',chance:.69,rating:.38,risk:.08}], 'Como defender o cruzamento?'),
    make('def_counter','defense','Contra-ataque 3 contra 2','Seu time perde a bola e você precisa controlar uma transição em inferioridade.',[
      {label:'Fechar o passe central',effect:'Protege o corredor mais perigoso.',type:'defense',chance:.68,rating:.48,risk:.09},
      {label:'Pressionar o portador',effect:'Tenta matar a jogada cedo.',type:'defense',chance:.56,rating:.66,risk:.20},
      {label:'Recuar até a área',effect:'Ganha tempo para os companheiros voltarem.',type:'defense',chance:.72,rating:.36,risk:.07}], 'Escolha como frear o contra-ataque'),
    make('def_build','build','Saída sob pressão','Você recebe a bola na defesa com a linha rival pressionando alto.',[
      {label:'Passe vertical',effect:'Quebra linhas se encontrar o volante.',type:'assist',chance:.55,rating:.56},
      {label:'Conduzir para o espaço',effect:'Atrai a pressão e cria superioridade.',type:'control',chance:.64,rating:.46},
      {label:'Bola longa',effect:'Alivia a pressão rapidamente.',type:'control',chance:.74,rating:.28}], 'Escolha a saída de bola'),
    make('def_setpiece','defense','Escanteio nos acréscimos','O rival lota a área em busca do empate.',[
      {label:'Marcar a primeira trave',effect:'Corta a trajetória mais curta.',type:'defense',chance:.68,rating:.50,risk:.09},
      {label:'Seguir o melhor cabeceador',effect:'Duelo direto contra a maior ameaça.',type:'defense',chance:.61,rating:.62,risk:.14},
      {label:'Ficar na sobra',effect:'Protege a segunda bola.',type:'defense',chance:.66,rating:.47,risk:.11}], 'Defina sua função no escanteio')
  ];
  const midfield=[
    make('mid_counter','build','Contra-ataque','Você conduz pelo meio com três opções se abrindo à frente.',[
      {label:'Passe em profundidade',effect:'Pode deixar um companheiro na cara do gol.',type:'assist',chance:.62,rating:.64},
      {label:'Carregar e finalizar',effect:'Você assume a responsabilidade.',type:'goal',chance:.38,rating:.74},
      {label:'Abrir na ponta',effect:'Amplia o campo e mantém o ataque.',type:'assist',chance:.56,rating:.46}], 'Escolha a rota do contra-ataque'),
    make('mid_press','build','Pressão no meio-campo','Dois rivais fecham seus lados e você recebe de costas.',[
      {label:'Girar e acelerar',effect:'Quebra a pressão se conseguir o drible.',type:'control',chance:.54,rating:.64},
      {label:'Tabela curta',effect:'Usa um companheiro para escapar.',type:'assist',chance:.67,rating:.48},
      {label:'Recuar a jogada',effect:'Mantém a posse e reorganiza.',type:'control',chance:.80,rating:.26}], 'Como escapar da pressão?'),
    make('mid_edge','chance','Sobra na entrada da área','A defesa corta mal e a bola sobra limpa para você na meia-lua.',[
      {label:'Bater colocado',effect:'Busca o canto com precisão.',type:'goal',chance:.45,rating:.72},
      {label:'Chutar forte',effect:'Mais potência, menos controle.',type:'goal',chance:.40,rating:.68},
      {label:'Enfiar para o atacante',effect:'Tenta encontrar o passe final.',type:'assist',chance:.61,rating:.58}], 'Decida em um toque'),
    make('mid_switch','build','Defesa fechada','O rival se compacta por dentro e você tem a bola no corredor central.',[
      {label:'Inverter o lado',effect:'Muda o ponto de ataque.',type:'assist',chance:.67,rating:.46},
      {label:'Passe entrelinhas',effect:'Mais difícil, mas pode quebrar a defesa.',type:'assist',chance:.53,rating:.68},
      {label:'Atrair e carregar',effect:'Tenta abrir espaço com condução.',type:'control',chance:.60,rating:.50}], 'Escolha como desmontar o bloco'),
    make('mid_late','build','Últimos minutos','Seu time protege uma vantagem mínima e você recebe no meio.',[
      {label:'Prender no canto',effect:'Gasta tempo e reduz o risco.',type:'control',chance:.82,rating:.28},
      {label:'Buscar o segundo gol',effect:'Acelera a transição para matar o jogo.',type:'assist',chance:.52,rating:.62},
      {label:'Chutar de longe',effect:'Tenta surpreender o goleiro.',type:'goal',chance:.30,rating:.78}], 'Gerencie os minutos finais')
  ];
  const attackers=[
    make('att_penalty','penalty','Pênalti para sua equipe',`Aos ${minute}', você pega a bola e encara o goleiro.`,[
      {label:'Bater forte no canto',effect:'Boa chance de gol.',type:'goal',chance:.68,rating:.62},
      {label:'Deslocar o goleiro',effect:'Mais técnico e mais arriscado.',type:'goal',chance:.62,rating:.72},
      {label:'Cavadinha',effect:'Alto risco, grande destaque se entrar.',type:'goal',chance:.48,rating:.90}], 'Escolha o tipo de cobrança'),
    make('att_one_on_one','chance','Cara a cara com o goleiro','Você rompe a última linha e entra sozinho na área.',[
      {label:'Finalizar cruzado',effect:'Escolha objetiva para o canto oposto.',type:'goal',chance:.58,rating:.60},
      {label:'Driblar o goleiro',effect:'Mais arriscado, mas abre o gol.',type:'goal',chance:.47,rating:.80},
      {label:'Tocar por cobertura',effect:'Técnica e frieza em uma execução difícil.',type:'goal',chance:.43,rating:.88}], 'Como concluir o 1 contra 1?'),
    make('att_cutback','chance','Passe para trás na área','O ponta chega à linha de fundo e rola a bola para você.',[
      {label:'Finalizar de primeira',effect:'Rápido e direto.',type:'goal',chance:.62,rating:.58},
      {label:'Dominar antes',effect:'Mais controle, mas a defesa se aproxima.',type:'goal',chance:.55,rating:.66},
      {label:'Deixar passar',effect:'Tenta criar uma assistência inesperada.',type:'assist',chance:.60,rating:.64}], 'Escolha o toque dentro da área'),
    make('att_header','goal','Cruzamento perfeito','A bola vem alta entre você e o zagueiro dentro da área.',[
      {label:'Cabecear no chão',effect:'Busca dificultar a defesa do goleiro.',type:'goal',chance:.58,rating:.64},
      {label:'Testar no contrapé',effect:'Exige direção precisa.',type:'goal',chance:.53,rating:.72},
      {label:'Escorar para trás',effect:'Tenta servir um companheiro melhor posicionado.',type:'assist',chance:.62,rating:.56}], 'Escolha a ação no alto'),
    make('att_counter','chance','Contra-ataque em velocidade','Você dispara com um defensor recuando e um companheiro ao lado.',[
      {label:'Cortar para dentro e chutar',effect:'Você busca o gol.',type:'goal',chance:.48,rating:.72},
      {label:'Passar no momento certo',effect:'Cria uma chance limpa para o companheiro.',type:'assist',chance:.65,rating:.60},
      {label:'Acelerar até a área',effect:'Tenta ganhar no corpo e na velocidade.',type:'goal',chance:.52,rating:.66}], 'Decida antes da defesa se recompor'),
    make('att_free_kick','goal','Falta frontal','Uma falta é marcada perto da meia-lua e você assume a bola.',[
      {label:'Por cima da barreira',effect:'Curva e precisão para buscar o ângulo.',type:'goal',chance:.38,rating:.84},
      {label:'Chute forte no canto',effect:'Potência para surpreender o goleiro.',type:'goal',chance:.42,rating:.76},
      {label:'Jogada ensaiada',effect:'Tenta criar uma assistência em vez do chute.',type:'assist',chance:.57,rating:.62}], 'Escolha a cobrança da falta'),
    make('att_backpost','goal','Bola na segunda trave','Um cruzamento atravessa a área e chega quase sem ângulo para você.',[
      {label:'Bater de primeira',effect:'Difícil, mas pode surpreender.',type:'goal',chance:.42,rating:.78},
      {label:'Dominar e ajeitar',effect:'Ganha controle, perde tempo.',type:'goal',chance:.50,rating:.66},
      {label:'Tocar para o meio',effect:'Procura alguém de frente para o gol.',type:'assist',chance:.63,rating:.58}], 'Escolha entre finalizar ou servir')
  ];
  let pool;
  if(p.position==='Goleiro')pool=goalkeeper;
  else if(['Zagueiro','Lateral direito','Lateral esquerdo'].includes(p.position))pool=defenders;
  else if(['Meia central','Meia direita','Meia esquerda','Volante'].includes(p.position))pool=midfield;
  else pool=attackers;
  const recent=s?.recentDecisionScenarioIds||[];
  let available=pool.filter(x=>!recent.includes(x.id));if(!available.length)available=pool;
  const scenario=available[rnd(0,available.length-1)];
  if(s&&scenario)s.recentDecisionScenarioIds=[...recent,scenario.id].slice(-4);
  return scenario;
}

function renderDecisionChoices(scenario){
  const visual=$('#decision-visual');
  const choiceBox=$('#decision-choices');
  visual.innerHTML='';
  visual.className='decision-visual hidden';
  choiceBox.innerHTML='';
  choiceBox.classList.remove('hidden');
  const buttons=scenario.options.map((o,i)=>`<button class="event-choice decision-option" data-decision-option="${i}"><strong>${o.label}</strong><small>${o.effect}</small></button>`).join('');
  if(['goal','penalty','chance','goalkeeper','defense','build'].includes(scenario.visual)){
    const slotClasses=(scenario.visual==='goal'||scenario.visual==='penalty')?
      ['slot-left','slot-center','slot-right']:
      scenario.visual==='chance'?
      ['chance-left','chance-center','chance-right']:
      scenario.visual==='goalkeeper'?
      ['lane-left','lane-center','lane-right']:
      scenario.visual==='defense'?
      ['lane-left','lane-center','lane-right']:
      ['build-left','build-center','build-right'];
    const typeClass=scenario.visual==='goal'||scenario.visual==='penalty'?'goal-mouth':scenario.visual==='chance'?'chance-board':scenario.visual==='goalkeeper'?'goalkeeper-board':scenario.visual==='defense'?'defense-board':'build-board';
    visual.className=`decision-visual ${typeClass}`;
    const label=scenario.prompt|| (scenario.visual==='penalty'?'Escolha o tipo de cobrança':scenario.visual==='goal'?'Escolha a finalização':scenario.visual==='chance'?'Escolha como atacar o lance':'Escolha sua leitura no lance');
    const inner=scenario.options.map((o,i)=>`<button class="visual-choice ${slotClasses[i]||''}" data-decision-option="${i}"><span>${o.type==='assist'?'🤝':o.type==='defense'?'🛡️':o.type==='control'?'⏱️':'⚽'}</span><strong>${o.label}</strong><small>${o.effect}</small></button>`).join('');
    visual.innerHTML=`<div class="decision-visual-label">${label}</div><div class="visual-stage">${inner}</div>`;
    choiceBox.classList.add('hidden');
    visual.querySelectorAll('[data-decision-option]').forEach(b=>b.addEventListener('click',()=>resolveMatchDecision(+b.dataset.decisionOption)));
    return;
  }
  choiceBox.innerHTML=buttons;
  choiceBox.querySelectorAll('.decision-option').forEach(b=>b.addEventListener('click',()=>resolveMatchDecision(+b.dataset.decisionOption)));
}

function ensureDecisionPlan(){
  const s=state.season;if(s.decisionTargets?.length)return;const base=s.league.schedule.length;s.decisionTargets=[.14,.31,.49,.67,.85].map(x=>Math.max(2,Math.round(base*x)));s.decisionIndex=s.decisionIndex||0;s.decisionLogs=s.decisionLogs||[];s.startTrophyCount=state.player.trophies?.length||0;s.startAwardCount=state.player.awards?.length||0;
}

function playMatchVisualFX(kind='build',outcome='intro'){
  const card=$('#match-decision-modal .decision-card');if(!card)return;
  card.classList.remove('match-fx-goal','match-fx-penalty','match-fx-chance','match-fx-goalkeeper','match-fx-defense','match-fx-build','match-fx-success','match-fx-miss');
  void card.offsetWidth;card.classList.add(`match-fx-${kind}`,outcome==='success'?'match-fx-success':outcome==='miss'?'match-fx-miss':'');
  card.querySelector('.match-cinematic')?.remove();const fx=document.createElement('div');fx.className=`match-cinematic cinematic-${kind} cinematic-${outcome}`;
  fx.innerHTML='<i></i><i></i><i></i><i></i><span class="match-ball"></span><span class="match-flash"></span>';card.appendChild(fx);setTimeout(()=>fx.remove(),1350);
}
function animateSeasonDashboard(){
  const s=state.season,seasonCard=$('.season-card'),competitionCard=$('.competitions-card'),nationalCard=$('.national-card');
  seasonCard?.classList.toggle('season-live',!!s&&!s.closed);competitionCard?.classList.toggle('season-live',!!s&&!s.closed);nationalCard?.classList.toggle('world-cup-year',!!s&&isWorldCupYear(s.year));
  if(s&&!s.closed){$$('#competitions-list .competition-item').forEach((el,i)=>el.style.setProperty('--stagger',`${i*.12}s`));}
}
function openMatchDecision(event){
  const scenario=buildDecisionScenario(event);state.pendingMatchDecision={event,scenario,isNationalDecision:event.type==='national'};if(event.type==='national')state.season.nationalDecisionCount=(state.season.nationalDecisionCount||0)+1;save();
  const fav=favoritismForEvent(event);$('#decision-competition').textContent=`${event.competition}${event.stage?` · ${event.stage}`:''}`;$('#decision-title').textContent=`${scenario.minute}' · ${scenario.title}`;$('#decision-match').textContent=`${event.home} x ${event.away} · favorito: ${fav.favorite} (${fav.favoritePct}%)`;$('#decision-description').textContent=scenario.description;
  $('#decision-result').classList.add('hidden');$('#decision-continue').classList.add('hidden');renderDecisionChoices(scenario);$('#match-decision-modal').classList.remove('hidden');playMatchVisualFX(scenario.visual||'build','intro');
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
  if(event.type!=='national'){s.clubGames++;s.clubGoals+=perf.goals;s.clubAssists+=perf.assists;if(event.type==='league'){s.leagueGames=(s.leagueGames||0)+1;s.leagueGoals=(s.leagueGoals||0)+perf.goals;s.leagueAssists=(s.leagueAssists||0)+perf.assists;}p.value=marketValue(p.value*(1+(perf.rating-6.5)/260));}else{p.nationalTeamGames++;p.nationalTeamGoals+=perf.goals;p.nationalTrust=clamp((p.nationalTrust||0)+(perf.rating>=8?3:perf.rating>=7.2?2:perf.rating<6.2?-1:1),0,100);}
  processCompetitionResult(event,teamGoals,oppGoals);if(perf.rating>=8)state.news.push(`${p.name} foi destaque em ${event.competition}, com nota ${perf.rating.toFixed(1)}.`);
  return {event,playerIsHome,teamGoals,oppGoals,homeGoals,awayGoals,perf,model:score.model,outcome,success};
}
function resolveMatchDecision(index){
  const pending=state.pendingMatchDecision;if(!pending)return;const option=pending.scenario.options[index];const log=simulateInteractiveMatch(pending.event,option);const s=state.season;s.decisionLogs=s.decisionLogs||[];s.decisionLogs.push({competition:log.event.competition,match:`${log.event.home} ${log.homeGoals} x ${log.awayGoals} ${log.event.away}`,choice:option.label,outcome:log.outcome,rating:log.perf.rating.toFixed(1)});if(!pending.isNationalDecision)s.decisionIndex=(s.decisionIndex||0)+1;else state.player.nationalTrust=clamp((state.player.nationalTrust||0)+(log.success?3:-1),0,100);state.pendingMatchDecision=null;playMatchVisualFX(pending.scenario.visual||'build',log.success?'success':'miss');save();render();
  $('#decision-visual').classList.add('hidden');$('#decision-choices').classList.add('hidden');$('#decision-result').classList.remove('hidden');$('#decision-result').innerHTML=`<strong>${log.outcome}</strong><span>Placar: ${log.event.home} ${log.homeGoals} × ${log.awayGoals} ${log.event.away}</span><span>Sua nota: ${log.perf.rating.toFixed(1)} · ${log.perf.goals} gol(s) · ${log.perf.assists} assistência(s)</span>`;$('#decision-continue').classList.remove('hidden');
}
function processSeasonEnd(){
  const p=state.player,s=state.season;if(!s||s.endProcessed)return;const avg=s.totalGames?s.ratingSum/s.totalGames:6.5;evaluateAwards(avg);updateSelectionAtSeasonEnd(avg);const delta=developmentResult(avg);
  const cupStatus=cupFinalStatus(s.cup),continentalStatus=s.continental?continentalFinalStatus(s.continental):'Não disputou';state.history.push({year:s.year,club:s.clubAtStart||p.club,clubCountry:s.countryAtStart||p.clubCountry,overall:p.overall,games:s.clubGames,goals:s.clubGoals,assists:s.clubAssists,leagueGames:s.leagueGames||0,leagueGoals:s.leagueGoals||0,leagueAssists:s.leagueAssists||0,rating:avg.toFixed(1),leaguePosition:s.league.position,cupStatus,continentalStatus,competitions:competitionStatus().map(c=>c.title)});
  p.value=marketValue(p.value*(1+delta*.11));p.age++;state.news.push(`${p.name} encerra ${s.year} com média ${avg.toFixed(1)}. GER ${p.overall} (${delta>=0?'+':''}${delta}) e POT ${p.potential}.`);generateOffers(avg);s.endProcessed=true;s.closed=true;s.endAverage=avg;s.developmentDelta=delta;s.finalCupStatus=cupStatus;s.finalContinentalStatus=continentalStatus;
  if(p.age>=46){p.retired=true;p.age=46;p.retiredAge=46;p.legacyCardSeen=false;pendingCareerCard=true;state.news.push(`${p.name} encerra oficialmente a carreira aos 46 anos.`);state.offers=[];}
}
function continueSeasonSimulation(){
  const p=state.player,s=state.season;if(!s||s.closed||p.retired||state.pendingMatchDecision)return;ensureDecisionPlan();state.simulatingSeason=true;let safety=0;
  while(!seasonComplete()&&safety<160){
    const event=chooseNextEvent();if(!event)break;const target=s.decisionTargets[s.decisionIndex];
    const healthy=(p.injuryGames||0)<=0;
    const wc=isWorldCupYear(s.year),nationalLimit=wc?4:2,nationalDecision=event.type==='national'&&healthy&&(s.nationalDecisionCount||0)<nationalLimit&&Math.random()<(wc ? .86 : .58);
    if(nationalDecision){openMatchDecision(event);save();render();return;}
    if(event.type!=='national'&&healthy&&target!==undefined&&s.clubGames+1>=target){openMatchDecision(event);save();render();return;}
    simulateMatchCore(event);safety++;
    if(healthy&&event.type==='national'&&maybeTriggerNationalEvent(event)){state.simulatingSeason=false;save();render();return;}
    if(healthy&&event.type!=='national'&&maybeTriggerSponsorEvent()){state.simulatingSeason=false;save();render();return;}
    if(healthy&&event.type!=='national'&&maybeTriggerCareerEvent()){state.simulatingSeason=false;save();render();return;}
  }
  if(safety>=160){state.simulatingSeason=false;toast('A simulação atingiu o limite de segurança do calendário.');save();render();return;}
  processSeasonEnd();const newTitles=(p.trophies||[]).slice(s.startTrophyCount||0).map(t=>t.name);const newAwards=(p.awards||[]).slice(s.startAwardCount||0).map(a=>a.name);pendingSeasonCelebration={titles:newTitles,awards:newAwards,ceremonies:state.season?.specialAwardCeremonies||[]};state.simulatingSeason=false;nextEventCache=null;save();render();showSeasonSummary();toast(`${state.offers.length} proposta(s) chegaram ao fim da temporada.`);
}
function simulateWholeSeason(){
  const s=state.season,p=state.player;if(!s||s.closed||p.retired)return;ensureDecisionPlan();continueSeasonSimulation();
}
function showSeasonSummary(){
  const s=state.season,p=state.player;if(!s||!s.closed)return;$('#summary-year').textContent=`TEMPORADA ${s.year}`;$('#summary-title').textContent=`${s.league.position}º lugar em ${s.league.name}`;$('#summary-subtitle').textContent=`${s.league.points} pontos · ${s.league.wins}V ${s.league.draws}E ${s.league.losses}D · ${state.offers.length} proposta(s) recebida(s)`;
  const seasonTitles=(p.trophies||[]).slice(s.startTrophyCount||0).map(t=>t.name);const seasonAwards=(p.awards||[]).slice(s.startAwardCount||0).map(a=>a.name);
  const seasonHonours=[...seasonTitles.map(name=>({name,type:'Título'})),...seasonAwards.map(name=>({name,type:'Prêmio'}))];
  $('#summary-honours').innerHTML=seasonHonours.length?seasonHonours.map(h=>`<div class="summary-honour">${honourVisual(h.name)}<span><strong>${h.name}</strong><small>${h.type}</small></span></div>`).join(''):'<p class="muted">Nenhum título ou prêmio nesta temporada.</p>';
  const standings=s.league.standings||[];$('#summary-standings').innerHTML=standings.map(r=>`<tr class="${r.user?'user-row':''}"><td>${r.position}</td><td>${r.team}</td><td>${r.games}</td><td>${r.wins}</td><td>${r.draws}</td><td>${r.losses}</td><td>${r.gd>0?'+':''}${r.gd}</td><td><strong>${r.points}</strong></td></tr>`).join('');
  const cupItems=[{name:s.cup.name,status:s.finalCupStatus||cupFinalStatus(s.cup)}];if(s.continental)cupItems.push({name:s.continental.name,status:s.finalContinentalStatus||continentalFinalStatus(s.continental)});$('#summary-cups').innerHTML=cupItems.map(x=>`<div class="summary-status with-art">${honourVisual(x.name)}<strong>${x.name}</strong><span>${x.status}</span></div>`).join('');
  $('#summary-decisions').innerHTML=(s.decisionLogs||[]).map((d,i)=>`<div><strong>${i+1}. ${d.match}</strong><span>${d.choice} · ${d.outcome}</span></div>`).join('');$('#summary-offers').innerHTML=state.offers.length?state.offers.map(o=>`<div class="summary-offer"><strong>${o.club}</strong><span>${o.countryName} · Força ${o.strength} · ${money(o.value)}</span></div>`).join(''):'<p class="muted">Nenhuma proposta devido à aposentadoria.</p>';$('#season-summary-modal').classList.remove('hidden');
}
$('#decision-continue').addEventListener('click',()=>{$('#match-decision-modal').classList.add('hidden');continueSeasonSimulation();});
$('#summary-market').addEventListener('click',()=>{$('#season-summary-modal').classList.add('hidden');if(state.player?.retired&&pendingCareerCard){pendingCareerCard=false;showCareerLegacyCard();return;}showView('market');showPendingSeasonCelebration();});
$('#summary-close').addEventListener('click',()=>{$('#season-summary-modal').classList.add('hidden');if(state.player?.retired&&pendingCareerCard){pendingCareerCard=false;showCareerLegacyCard();return;}showPendingSeasonCelebration();});

function normalizePersistentState(){
  if(!state.player)return;
  const p=state.player;
  p.value=marketValue(p.value||1100000);p.nationalTrust=clamp(p.nationalTrust||0,0,100);p.injuryGames=Math.max(0,p.injuryGames||0);p.reputation=clamp(p.reputation||10,0,100);p.morale=clamp(p.morale||70,40,100);p.recentCareerEventIds=p.recentCareerEventIds||[];p.recentOfferClubs=p.recentOfferClubs||[];p.recentNationalEventIds=p.recentNationalEventIds||[];p.appearance=normalizeAppearance(p.appearance||{});

  // Corrige país/liga do clube em saves antigos. O nome do clube é a fonte de verdade.
  const canonical=canonicalClubCountryCode(p.club,p.clubCountry);
  if(canonical&&canonical!==p.clubCountry){p.clubCountry=canonical;p.clubCountryName=countryByCode(canonical)?.name||canonical;}
  else if(canonical&&!p.clubCountryName)p.clubCountryName=countryByCode(canonical)?.name||canonical;
  const currentClubProfile=clubCompetitionProfile(p.club,p.clubCountry);p.clubLeague=p.clubLeague||currentClubProfile.league;p.clubCup=p.clubCup||currentClubProfile.cup;p.clubDivisionLevel=p.clubDivisionLevel||currentClubProfile.divisionLevel||1;

  (state.history||[]).forEach(h=>{
    const code=canonicalClubCountryCode(h.club,h.clubCountry);
    if(code)h.clubCountry=code;
  });

  const s=state.season;
  if(s){
    s.nationalGamesPlayed=Math.max(0,s.nationalGamesPlayed||0);s.nationalDecisionCount=Math.max(0,s.nationalDecisionCount||0);s.nationalInteractionCount=Math.max(0,s.nationalInteractionCount||0);s.lastNationalEventAt=s.lastNationalEventAt??-10;s.sponsorEventDone=!!s.sponsorEventDone;
    if(s.leagueGames==null){
      const played=Math.max(0,s.clubGames||0),leaguePlayed=Math.min(s.league?.index||0,played||s.league?.index||0),ratio=played?leaguePlayed/played:1;
      s.leagueGames=leaguePlayed;s.leagueGoals=Math.round((s.clubGoals||0)*ratio);s.leagueAssists=Math.round((s.clubAssists||0)*ratio);
    }
    s.leagueGoals=Math.max(0,s.leagueGoals||0);s.leagueAssists=Math.max(0,s.leagueAssists||0);
    const seasonClub=s.clubAtStart||p.club;
    const seasonCode=canonicalClubCountryCode(seasonClub,s.countryAtStart||p.clubCountry);
    const seasonProfile=clubCompetitionProfile(seasonClub,seasonCode);const rule=getCompetitionRule(seasonCode,countryByCode(seasonCode)?.name||'');
    const seasonLeague=s.leagueAtStart||seasonProfile.league||rule.league;const format=getLeagueFormatForClub(seasonCode,seasonLeague);
    const wrongLeague=seasonCode&&(s.countryAtStart!==seasonCode||s.league?.name!==seasonLeague);
    s.countryAtStart=seasonCode||s.countryAtStart||p.clubCountry;s.leagueAtStart=seasonLeague;s.divisionLevel=s.divisionLevel||seasonProfile.divisionLevel||1;
    if(wrongLeague&&s.league){
      const oldIndex=s.league.index||0;
      s.league.name=seasonLeague;s.league.format=format;
      s.league.schedule=generateLeagueSchedule(seasonCode,seasonClub,seasonLeague);
      s.league.index=Math.min(oldIndex,s.league.schedule.length);
      if(s.league.standings)s.league.standings=[];
    }
    if(s.cup){s.cup.name=seasonProfile.cup||rule.cup;if(!s.cup.stages?.length)s.cup.stages=domesticCupStages(seasonCode);}
  }

  (p.trophies||[]).forEach(t=>{
    const season=(state.history||[]).find(h=>h.year===t.year);
    const seasonCode=canonicalClubCountryCode(season?.club||'',season?.clubCountry||'');
    if(t.name==='Premier League / Premiership'||t.name==='Scottish Premiership'||t.name==='Premier League'){
      if(seasonCode==='SCO')t.name='Scottish Premiership';
      else if(seasonCode==='ENG')t.name='Premier League';
    }
    if(t.name==='Copa Nacional'||t.name==='Scottish Cup'||t.name==='FA Cup'){
      if(seasonCode==='SCO')t.name='Scottish Cup';
      else if(seasonCode==='ENG')t.name='FA Cup';
      else if(seasonCode==='MX')t.name='Copa MX';
    }
  });

  state.offers=(state.offers||[]).map(o=>{
    const code=canonicalClubCountryCode(o.club,o.countryCode);
    const profile=clubCompetitionProfile(o.club,code);return {...o,countryCode:code,countryName:countryByCode(code)?.name||code,league:o.league||profile.league,cup:o.cup||profile.cup,divisionLevel:o.divisionLevel||profile.divisionLevel||1,value:marketValue(o.value||p.value)};
  });
}

preloadTrophyImages();populateCreationFields();setupBirthdateLimits();updateAppearancePreview();normalizePersistentState();sanitizeAwardsEligibility();save();render();observeSiteImages();if(state.pendingEvent)openPendingEvent();if(state.player?.retired&&!state.player.legacyCardSeen)setTimeout(showCareerLegacyCard,100);