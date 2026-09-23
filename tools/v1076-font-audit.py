from pathlib import Path
from playwright.sync_api import sync_playwright
css=Path(__file__).resolve().parents[1].joinpath('css/style.css').read_text()
html='''<!doctype html><html><head><meta charset="utf-8"><style>%s</style></head><body><h1 id="h">BE THE LEGEND — AÇÃO, Ç, Ã, É</h1><button id="b">Simular temporada</button><input id="i" value="Miguel Ferreira"></body></html>'''%css
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':900,'height':500})
    page.set_content(html,wait_until='domcontentloaded')
    page.evaluate("document.fonts.ready")
    result=page.evaluate('''() => ({
      checkAlias: document.fonts.check('16px "BTL Unisportion"'),
      checkExact: document.fonts.check('16px "UT Unisportion FC Demo"'),
      h: getComputedStyle(document.querySelector('#h')).fontFamily,
      b: getComputedStyle(document.querySelector('#b')).fontFamily,
      i: getComputedStyle(document.querySelector('#i')).fontFamily,
      status: document.fonts.status,
      widths: (()=>{const c=document.createElement('canvas').getContext('2d');c.font='32px \"BTL Unisportion\"';const a=c.measureText('BE THE LEGEND Miguel Ferreira 12345').width;c.font='32px sans-serif';const b=c.measureText('BE THE LEGEND Miguel Ferreira 12345').width;return {unisportion:a,sans:b}})()
    })''')
    print(result)
    assert result['checkAlias'] and result['checkExact']
    assert 'BTL Unisportion' in result['h'] and 'BTL Unisportion' in result['b'] and 'BTL Unisportion' in result['i']
    assert abs(result['widths']['unisportion']-result['widths']['sans']) > 1
    browser.close()
