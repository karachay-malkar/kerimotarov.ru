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
