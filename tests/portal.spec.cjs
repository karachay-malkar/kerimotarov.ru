const {test,expect}=require('@playwright/test');
const errors=[];
test.beforeEach(async({page})=>{
  page.on('pageerror',e=>errors.push(e.message));
});
test.afterEach(()=>{expect(errors,'No uncaught browser errors').toEqual([]);errors.length=0;});

test('home is compact and uses original cinematic portrait',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.hero h1')).toContainText('Отаров');
 await expect(page.locator('.hero .hero-photo img')).toBeVisible();
 await expect.poll(()=>page.locator('.hero-photo img').evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
 await expect(page.locator('.home-discover')).toBeVisible();
 await expect(page.locator('.hero')).toHaveCount(1);
 await expect(page.locator('main .portal-home-index')).toHaveCount(0);
 const height=await page.evaluate(()=>document.querySelector('main').getBoundingClientRect().height/innerHeight);
 expect(height,'Home content should stay within roughly two screens').toBeLessThan(2.15);
});

test('minimal icons and working immersive navigation',async({page})=>{
 await page.goto('/');
 const menu=page.getByRole('button',{name:'Открыть меню'});
 await expect(menu.locator('svg')).toHaveCount(1);
 await expect(page.getByRole('button',{name:'Поиск'}).locator('svg')).toHaveCount(1);
 await menu.click();
 await expect(page.locator('#site-menu')).toHaveClass(/is-open/);
 await expect(page.locator('#site-menu a[data-link="memory"]')).toBeVisible();
 await page.locator('#site-menu a[data-link="memory"]').click();
 await expect(page).toHaveURL(/#\/memory$/);
 await expect(page.locator('#site-menu')).not.toHaveClass(/is-open/);
 await expect(page.locator('.page-title')).toContainText('Память');
 await page.goBack();
 await expect(page.locator('.hero h1')).toBeVisible();
});

test('all six sections are direct-linkable and navigable',async({page})=>{
 for(const p of ['life','works','media','memory','projects','events']){
   await page.goto('/#/'+p);
   await expect(page.locator('main .page-title')).toBeVisible();
   await expect(page.locator('main')).toContainText(p==='life'?'1912':p==='works'?'Сокъур':p==='media'?'Голос':p==='memory'?'Публикации':p==='projects'?'Словарь':'События');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),p+' no horizontal scrolling').toBe(false);
 }
});

test('book cards expand to pages with distinct URLs and history',async({page})=>{
 await page.goto('/#/works');
 await expect(page.locator('.work-card')).toHaveCount(4);
 await page.locator('[data-filter="translation"]').click();
 await expect(page.locator('.work-card:visible')).toHaveCount(1);
 await page.locator('[data-filter="all"]').click();
 await page.locator('.work-card[href="#/works/roads"]').click();
 await expect(page).toHaveURL(/#\/works\/roads$/);
 await expect(page.locator('.reading-original')).toBeVisible();
 await expect(page.locator('.reading-translation')).toBeVisible();
 await page.goBack();
 await expect(page.locator('.work-card')).toHaveCount(4);
});

test('reader state, notes, bookmark, reduced motion',async({page})=>{
 await page.goto('/#/works/roads');
 await page.getByRole('button',{name:'Скрыть оригинал'}).click();
 await expect(page.locator('.reading-original')).toBeHidden();
 await page.getByRole('button',{name:'Показать оригинал'}).click();
 await expect(page.locator('.reading-original')).toBeVisible();
 await page.locator('#reader-note').fill('Заметка для проверки');
 await page.getByRole('button',{name:'Сохранить заметку'}).click();
 await expect(page.locator('#reader-note-status')).toContainText('сохранена');
 await page.getByRole('button',{name:'Добавить в избранное'}).click();
 await expect(page.getByRole('button',{name:'Убрать из избранного'})).toBeVisible();
 await page.reload();
 await expect(page.locator('#reader-note')).toHaveValue('Заметка для проверки');
 await expect(page.getByRole('button',{name:'Убрать из избранного'})).toBeVisible();
});
test('reduced motion disables reveal animation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 expect(await page.locator('.hero').evaluate(el=>getComputedStyle(el).animationDuration)).toBe('0s');
});
test('search finds work and dictionary, closes on Escape',async({page})=>{
 await page.goto('/#/life');
 await page.getByRole('button',{name:'Поиск'}).click();
 await expect(page.locator('#search-panel')).toHaveClass(/is-open/);
 await page.locator('#global-search').fill('сокъур');
 await expect(page.locator('#search-results a[href="#/works/roads"]')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('#search-panel')).not.toHaveClass(/is-open/);
 await page.keyboard.press('Control+k');
 await expect(page.locator('#search-panel')).toHaveClass(/is-open/);
});
test('all controls are SVG, not unicode arrow glyphs',async({page})=>{
 await page.goto('/#/works');
 const svg=await page.locator('.round-icon svg').count();
 expect(svg).toBeGreaterThanOrEqual(2);
 const glyphs=await page.locator('button').allTextContents();
 expect(glyphs.filter(t=>/[↗→←✳♧☰]/.test(t))).toEqual([]);
});
test('no mobile overflow and menu accessible',async({page})=>{
 await page.goto('/');
 await expect(page.getByRole('button',{name:'Открыть меню'})).toBeVisible();
 await page.getByRole('button',{name:'Открыть меню'}).click();
 await expect(page.locator('#site-menu a')).toHaveCount(6);
 await page.getByRole('button',{name:'Закрыть меню'}).click();
 for(const path of ['/','/#/works','/#/works/roads','/#/projects','/#/events']){
   await page.goto(path);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'No mobile horizontal overflow on '+path).toBe(true);
 }
});

test('primary navigation uses the same names as the full menu',async({page})=>{
 await page.goto('/');
 const names=await page.locator('.toplinks a').allTextContents();
 expect(names).toEqual(['Жизнь','Творчество','Медиа']);
 await page.goto('/#/sources');
 await expect(page.locator('main')).toContainText('Источники');
 await expect(page.locator('main a[href^="https://"]')).toHaveCount(5);
});
test('interaction layer is not just a decorative icon',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Открыть меню'}).click();
 await expect(page.locator('#site-menu')).toHaveCSS('pointer-events','auto');
 await expect(page.locator('#site-menu')).toHaveClass(/is-open/);
 await page.getByRole('button',{name:'Закрыть меню'}).click();
 await page.goto('/#/works');
 const card=page.locator('.work-card').first();
 await card.hover();
 await expect(card.locator('.cover-visual')).toHaveCSS('transform',/matrix/);
});

test('desktop magnetic control reacts to pointer movement',async({page,isMobile})=>{
 test.skip(isMobile,'Touch screens do not have hover interactions');
 await page.goto('/');
 const target=page.locator('.hero-side-action');
 const box=await target.boundingBox();
 expect(box).toBeTruthy();
 await page.mouse.move(box.x+box.width*.78,box.y+box.height*.3);
 await expect.poll(()=>target.evaluate(el=>getComputedStyle(el).transform)).not.toBe('none');
 await page.mouse.move(5,5);
 await expect.poll(()=>target.evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});

test('capture desktop and mobile review of the main scenes',async({page},testInfo)=>{
 const fs=require('node:fs');
 fs.mkdirSync('test-results/visual',{recursive:true});
 const prefix='test-results/visual/'+testInfo.project.name;
 await page.goto('/');
 await page.screenshot({path:prefix+'-home.png',fullPage:true});
 await page.getByRole('button',{name:'Открыть меню'}).click();
 await expect(page.locator('#site-menu')).toHaveClass(/is-open/);
 await page.screenshot({path:prefix+'-menu.png'});
 await page.getByRole('button',{name:'Закрыть меню'}).click();
 await page.goto('/#/works');
 await page.screenshot({path:prefix+'-library.png',fullPage:true});
 await page.goto('/#/works/roads');
 await page.screenshot({path:prefix+'-reader.png',fullPage:true});
});


test('all action icons use the vendored official Lucide library',async({page})=>{
  const routes=['/','/#/works','/#/works/roads','/#/media','/#/memory','/#/projects','/#/events'];
  for (const route of routes){
    await page.goto(route);
    const icons=page.locator('main svg.icon, header svg, #site-menu svg, #search-panel svg');
    expect(await icons.count(),route+' must contain icon elements').toBeGreaterThan(3);
    const audit=await icons.evaluateAll(nodes=>nodes.map(svg=>({
      hasUse:svg.querySelector('use')?.getAttribute('href')?.startsWith('./assets/lucide-sprite.svg#')||false,
      hasHanddrawnPath:!!svg.querySelector('path, circle, rect, line, polyline'),
      source:svg.querySelector('use')?.getAttribute('href')
    })));
    expect(audit.filter(i=>!i.hasUse || i.hasHanddrawnPath),route+' must contain no self-drawn icon markup').toEqual([]);
  }
  const response=await page.request.get('/assets/lucide-sprite.svg');
  expect(response.ok()).toBeTruthy();
  const source=await response.text();
  for(const name of ['arrow-up-right','search','menu','x','book-open','volume-2','calendar-days','bookmark','check','feather']){
    expect(source).toContain('<symbol id="'+name+'"');
  }
  expect(source).toContain('Lucide');
});

test('menu icon changes state using the Lucide library',async({page})=>{
  await page.goto('/');
  const icon=page.locator('#menu-trigger svg use');
  await expect(icon).toHaveAttribute('href','./assets/lucide-sprite.svg#menu');
  await page.getByRole('button',{name:'Открыть меню'}).click();
  await expect(icon).toHaveAttribute('href','./assets/lucide-sprite.svg#x');
  await page.getByRole('button',{name:'Закрыть меню'}).click();
  await expect(icon).toHaveAttribute('href','./assets/lucide-sprite.svg#menu');
});

test('award-inspired kinetic scene responds to scroll and is restrained for reduced motion',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.scene-progress')).toBeVisible();
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight/2));
  await expect.poll(()=>page.locator('.scene-progress').evaluate(el=>getComputedStyle(el).transform)).not.toBe('none');
  await page.goto('/#/works');
  await expect(page.locator('.scene-progress')).toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.hero')).toHaveClass(/motion-reduced/);
});

test('Lucide icons are locally hosted, no runtime dependency on an icon CDN',async({page})=>{
  const externals=[];
  page.on('request',req=>{ if(/(?:unpkg\.com|cdn\.jsdelivr\.net|fonts\.googleapis\.com)/.test(req.url())) externals.push(req.url()); });
  await page.goto('/');
  await page.getByRole('button',{name:'Открыть меню'}).click();
  await page.locator('#site-menu a[href="#/media"]').click();
  expect(externals).toEqual([]);
});
