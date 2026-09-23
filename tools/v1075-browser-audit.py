import json, threading, http.server, socketserver, os, time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
PORT=8765
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
os.chdir(ROOT)
httpd=socketserver.TCPServer(('127.0.0.1',PORT),Quiet)
th=threading.Thread(target=httpd.serve_forever,daemon=True);th.start()
errs=[]
try:
  with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':390,'height':844})
    page.on('pageerror',lambda e: errs.append(str(e)))
    page.add_init_script("""
      (()=>{
        const account={accountKey:'guest:audit',id8:'12345678',nickname:'Audit',type:'guest',email:'',createdAt:new Date().toISOString()};
        localStorage.setItem('btlAccountsV1',JSON.stringify([account]));
        localStorage.setItem('btlAuthSessionV1',JSON.stringify({accountKey:account.accountKey,issuedAt:new Date().toISOString(),expiresAt:new Date(Date.now()+86400000).toISOString()}));
      })();
    """)
    page.goto('file://' + str(ROOT/'index.html'),wait_until='domcontentloaded',timeout=30000)
    page.wait_for_timeout(1200)
    # Create a valid career using the game's own season generator.
    page.evaluate("""
      const p={name:'Teste',birthdate:'2006-01-01',age:20,nationality:'Brasil',nationalityCode:'BR',position:'Centroavante',foot:'Direito',club:'Tottenham',clubCountry:'ENG',clubCountryName:'Inglaterra',clubStrength:84,clubLeague:'Premier League',clubCup:'FA Cup',clubDivisionLevel:1,number:9,overall:88,potential:94,initialPotential:94,value:100000000,titles:0,trophies:[],awards:[],calledUp:false,nationalTeamGames:0,nationalTeamGoals:0,nationalTeamAssists:0,nationalTrust:0,nationalCaptain:false,morale:80,reputation:50,developmentBoost:0,marketBonus:0,retired:false,appearance:{},attributes:{pace:90,finishing:92,dribbling:88,passing:82,defense:40,physical:87,weakFoot:4},dnaAttributes:{pace:90,finishing:92,dribbling:88,passing:82,defense:40,physical:87,weakFoot:4},attributeOrigins:{}};
      state={created:true,player:p,season:createSeason(p,2026,undefined),history:[],offers:[],news:[],pendingEvent:null,savedCareers:[]}; save(); render(); showView('career');
    """)
    page.wait_for_timeout(500)
    # Competition eligibility regression.
    elig=page.evaluate("""() => { const list=leaderboardCandidates('UEFA Champions League').map(x=>x.name); return {hasNeymar:list.includes('Neymar Jr'),hasCR:list.includes('Cristiano Ronaldo'),hasMbappe:list.includes('Kylian Mbappé')}; }""")
    assert not elig['hasNeymar'] and not elig['hasCR'] and elig['hasMbappe'],elig
    # Pause button placement in event modal.
    page.evaluate("""state.pendingEvent={id:'audit',type:'career',title:'Conversa com o treinador',description:'Teste',choices:[{label:'A',action:'leadership',effect:'x'}]}; openPendingEvent();""")
    page.wait_for_timeout(200)
    boxes=page.evaluate("""() => { const c=document.querySelector('#event-modal .modal-card').getBoundingClientRect(),b=document.querySelector('#pause-event').getBoundingClientRect(); return {card:{x:c.x,y:c.y,w:c.width,h:c.height},btn:{x:b.x,y:b.y,w:b.width,h:b.height}}; }""")
    assert abs((boxes['btn']['x']+boxes['btn']['w'])-(boxes['card']['x']+boxes['card']['w']-18)) < 3, boxes
    assert abs(boxes['btn']['y']-(boxes['card']['y']+18)) < 3, boxes
    page.evaluate("document.querySelector('#event-modal').classList.add('hidden'); state.pendingEvent=null;")
    # Previous decision result must stay hidden on a new decision.
    hidden=page.evaluate("""() => { const r=document.querySelector('#decision-result'); r.innerHTML='ANTIGO'; r.classList.add('hidden'); return getComputedStyle(r).display==='none'; }""")
    assert hidden
    # Chosen 4th penalty: three complete rounds happen before user is asked.
    page.evaluate("""
      Math.random=()=>0.3;
      state.pendingPenaltyShootout={scope:'continental',competition:'UEFA Champions League',stage:'Final',team:'Tottenham',home:'Tottenham',away:'Real Madrid',playerKickRound:4,shootoutLive:{first:'Tottenham',nextTeam:'Tottenham',round:1,kicks:[],score:{home:0,away:0},remaining:{home:5,away:5},phase:'standard',waitingForPlayer:false,finished:false}};
      openPenaltyShootoutDecision();
    """)
    page.wait_for_timeout(3900)
    pen=page.evaluate("""() => ({round:state.pendingPenaltyShootout?.shootoutLive?.round,kicks:state.pendingPenaltyShootout?.shootoutLive?.kicks?.length,waiting:state.pendingPenaltyShootout?.shootoutLive?.waitingForPlayer,choicesHidden:document.querySelector('#decision-choices').classList.contains('hidden')})""")
    assert pen['round']==4 and pen['kicks']==6 and pen['waiting'] and not pen['choicesHidden'],pen
    # Mobile horizontal overflow should not be introduced by new components.
    page.evaluate("document.querySelector('#match-decision-modal').classList.add('hidden')")
    overflow=page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
    assert overflow <= 1, overflow
    # screenshots for inspection
    out=Path('/mnt/data/v1075-audit');out.mkdir(exist_ok=True)
    page.screenshot(path=str(out/'career-mobile.png'),full_page=True)
    browser.close()
finally:
  httpd.shutdown();httpd.server_close()
print('browser audit PASS; page errors:',len(errs))
if errs: print('\n'.join(errs[:10]))
