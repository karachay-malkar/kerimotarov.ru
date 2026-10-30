const {test, expect} = require('@playwright/test');

test('home, six portal sections and deep links', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('.hero-content h1')).toContainText('Отаров');
  await expect(page.locator('.portal-home-grid a')).toHaveCount(6);
  const portrait = page.locator('.hero-portrait');
  await expect(portrait).toBeVisible();
  await expect.poll(()=>portrait.evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
  await page.locator('.portal-home-grid a[href="#/works"]').click();
  await expect(page.locator('#portal-view h1')).toContainText('Слово');
  await expect(page.locator('.portal-book-card')).toHaveCount(4);
  await page.locator('.portal-book-card[href="#/works/roads"]').click();
  await expect(page).toHaveURL(/#\/works\/roads$/);
  await expect(page.locator('.portal-original')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#portal-work-search')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.hero-content h1')).toBeVisible();
});

test('direct link to reader, reader controls and local notes', async ({page}) => {
  await page.goto('/#/works/roads');
  await expect(page.locator('#portal-view h1')).toContainText('Сокъур');
  await expect(page.locator('.portal-translation')).toBeVisible();
  await page.locator('#portal-parallel').click();
  await expect(page.locator('.portal-original')).toBeHidden();
  await page.locator('#portal-parallel').click();
  await expect(page.locator('.portal-original')).toBeVisible();
  await page.locator('#portal-note-input').fill('Проверка личной заметки');
  await page.locator('#portal-note-save').click();
  await expect(page.locator('#portal-note-status')).toContainText('сохранена');
  await page.reload();
  await expect(page.locator('#portal-note-input')).toHaveValue('Проверка личной заметки');
  await page.locator('#portal-save').click();
  await expect(page.locator('#portal-save')).toHaveAttribute('aria-pressed','true');
});

test('search across library and pages', async ({page}) => {
  await page.goto('/#/life');
  await page.locator('#search-open').click();
  await expect(page.locator('.portal-search-panel')).toHaveClass(/open/);
  await page.locator('#portal-search-input').fill('жюрек');
  await expect(page.locator('#portal-search-results a')).toHaveCount(1);
  await page.locator('#portal-search-results a').first().click();
  await expect(page).toHaveURL(/#\/projects\/dictionary$/);
  await expect(page.locator('#portal-word-name')).toBeVisible();
  await page.locator('[data-portal-word="1"]').click();
  await expect(page.locator('#portal-word-meaning')).toHaveText('Сердце');
});

test('menu, all categories and browser history', async ({page,isMobile}) => {
  await page.goto('/#/media/photos');
  await expect(page.locator('.portal-photo-detail img')).toBeVisible();
  await page.locator('#menu-toggle').click();
  await expect(page.locator('#mobile-nav')).toHaveClass(/open/);
  await page.locator('#mobile-nav a[href="#/memory"]').click();
  await expect(page).toHaveURL(/#\/memory$/);
  await expect(page.locator('#mobile-nav')).not.toHaveClass(/open/);
  await page.locator('.portal-chapter[href="#/memory/publications"]').click();
  await expect(page.locator('.portal-publication-list article')).toHaveCount(3);
  await page.goBack();
  await expect(page.locator('.portal-memory-quote')).toBeVisible();
  for (const section of ['life','works','media','memory','projects','events']) {
    await page.goto('/#/'+section);
    await expect(page.locator('#portal-view h1')).toBeVisible();
  }
  await expect(page.locator('#portal-month-label')).toBeVisible();
  await page.locator('#portal-month-next').click();
  await expect(page.locator('#portal-month-label')).toContainText('ноябрь');
  await page.locator('a[href="#/events/example"]').click();
  await expect(page.locator('.portal-detail-intro')).toContainText('не указаны');
  const overflows=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  expect(overflows).toBe(false);
});
