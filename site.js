/* Literary portal / 2026. Single router and original interaction system. */
(() => {
'use strict';
const $ = (sel,root=document) => root.querySelector(sel);
const $$ = (sel,root=document) => [...root.querySelectorAll(sel)];
const main=$('#main'),menu=$('#site-menu'),search=$('#search-panel'),trigger=$('#menu-trigger');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const fine=matchMedia('(hover:hover) and (pointer:fine)');
const portrait='./assets/otarov-portrait-kbp.jpg';
const sources={
  life:'https://www.smikbr.ru/node/12223',
  poem:'https://www.elbrusoid.net/articles/abiyat/358978/',
  book:'https://gvardiya.ru/books/zhizn-zamechatelnyh-lyudey/kerim-otarov',
  portrait:'https://www.kbpravda.ru/node/2225',
  press:'https://www.goryankakbr.ru/node/679',
  readings:'https://www.kbpravda.ru/node/40920'
};
const sections=[
 {key:'life',name:'Жизнь',caption:'БИОГРАФИЯ И ХРОНОЛОГИЯ',lead:'Поэт и свидетель эпохи'},
 {key:'works',name:'Творчество',caption:'БИБЛИОТЕКА',lead:'Произведения и переводы'},
 {key:'media',name:'Медиа',caption:'АРХИВНЫЕ МАТЕРИАЛЫ',lead:'Голос, фотография, кино'},
 {key:'memory',name:'Память',caption:'СВИДЕТЕЛЬСТВА',lead:'Места и публикации'},
 {key:'projects',name:'Проекты',caption:'ЯЗЫК И ОБРАЗОВАНИЕ',lead:'Новые формы чтения'},
 {key:'events',name:'Афиша',caption:'ЛИТЕРАТУРНЫЕ СОБЫТИЯ',lead:'Встречи и чтения'}
];
const works=[
 {id:'roads',title:'Сокъур болур эдим',cover:'sage',type:'poetry',kind:'СТИХОТВОРЕНИЕ',year:'1955',line:'Стихотворение о родной земле. Доступен фрагмент на двух языках.',by:'ОТАРЛАНЫ КЕРИМ'},
 {id:'land',title:'Родная земля',cover:'sand',type:'poetry',kind:'ПОЭЗИЯ',year:'1960',line:'Поэтическое издание. Полный текст готовится к публикации.',by:'КЕРИМ ОТАРОВ'},
 {id:'star',title:'Моя утренняя звезда',cover:'indigo',type:'poetry',kind:'ПОЭЗИЯ',year:'1969',line:'Лирика Керима Отарова. Полный текст пока недоступен.',by:'КЕРИМ ОТАРОВ'},
 {id:'hero',title:'Герой нашего времени',cover:'oxide',type:'translation',kind:'ПЕРЕВОД',year:'',line:'М. Ю. Лермонтов. Каталожная запись, текст перевода проверяется.',by:'М. Ю. ЛЕРМОНТОВ'}
];
const timeline=[
 ['1912','Гюрхожан','Рождение в балкарском ауле у подножия Эльбруса.'],
 ['1938','Первые сборники','Издан сборник «Стихи и песни».'],
 ['1944','Депортация','Вместе с балкарским народом пережил изгнание. Годы ссылки прошли в Киргизии.'],
 ['1956','Возвращение','Вернулся в Нальчик; вышел сборник «Дороги».'],
 ['1974','Наследие','Литературный путь завершён, но произведения продолжают жить.']
];
const words=[
 ['Тау','Гора','Образ горного мира.'],
 ['Жюрек','Сердце','Слово, связанное с чувством и переживанием.'],
 ['Жол','Дорога, путь','Может означать и жизненный путь.'],
 ['Тил','Язык','Речь, родной язык.'],
 ['Жарыкъ','Свет, светлый','Значение зависит от контекста.']
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Official Lucide SVG symbols are vendored in assets/lucide-sprite.svg (ISC).
// No hand-drawn icon paths and no runtime CDN dependency.
const iconNames={
 arrow:'arrow-up-right',right:'arrow-right',left:'arrow-left',
 chevron:'chevron-right',book:'book-open',sound:'volume-2',
 headphones:'headphones',image:'image',film:'film',pin:'map-pin',
 layers:'layers',calendar:'calendar-days',bookmark:'bookmark',
 check:'check',close:'x',search:'search',menu:'menu',
 clock:'clock-3',quote:'quote',feather:'feather'
};
const ico=(name,cls='')=>{
 const symbol=iconNames[name]||iconNames.arrow;
 return '<svg class="icon '+cls+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="./assets/lucide-sprite.svg#'+symbol+'"></use></svg>';
};
const action=(href,label,className='under-link')=>'<a class="'+className+'" href="#/'+href+'">'+esc(label)+ico('arrow')+'</a>';
const circle=(href,label,extra='')=>'<a href="#/'+href+'" class="round-icon '+extra+'" aria-label="'+esc(label)+'" title="'+esc(label)+'" data-magnetic>'+ico('arrow')+'</a>';
const source=(url,text)=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer" class="source-link">'+esc(text)+ico('arrow')+'</a>';
const kicker=(n,text)=>'<span class="eyebrow"><b>'+esc(n)+'</b> &nbsp;/&nbsp; '+esc(text)+'</span>';
function workCover(w,detail=false){
 const first=w.title.split(' ');let headline=w.id==='roads'?'Сокъур<br>болур <em>эдим</em>':w.id==='land'?'Родная<br><em>земля</em>':w.id==='star'?'Моя<br>утренняя <em>звезда</em>':'Герой<br>нашего<br><em>времени</em>';
 return '<div class="cover-visual cover-'+w.cover+(detail?' detail-cover':'')+'">'+
 '<span class="cover-top">'+esc(w.by)+'</span><div class="cover-wordmark">'+headline+'</div>'+
 '<span class="cover-pattern" aria-hidden="true"></span><span class="cover-bottom">'+esc(w.year||w.kind)+'</span></div>';
}
function home(){
 return '<section class="hero" aria-label="Керим Отаров">'+
 '<div class="hero-halo" aria-hidden="true"></div><div class="hero-grid" aria-hidden="true"></div>'+
 '<div class="hero-photo" aria-hidden="true"><img src="'+portrait+'" alt="" fetchpriority="high"><div class="hero-photo-edge"></div></div>'+
 '<div class="hero-content"><div class="hero-prelude"><span class="living-line"></span><span>НАРОДНЫЙ ПОЭТ БАЛКАРИИ</span><span>1912 — 1974</span></div>'+
 '<p class="hero-native" lang="krc">Отарланы Керим</p>'+
 '<h1><span class="line-reveal"><span>Керим</span></span><span class="line-reveal second"><span>Отаров</span></span></h1>'+
 '<p class="hero-description">Жизнь и поэзия, в которых<br>живёт память народа.</p>'+
 '<div class="hero-cta">'+action('works','Читать произведения','primary-link')+circle('life','Узнать о поэте','hero-side-action')+'</div></div>'+
 '<div class="hero-vert" aria-hidden="true">ЛИТЕРАТУРНОЕ НАСЛЕДИЕ &nbsp;/&nbsp; ЦИФРОВОЙ АРХИВ</div>'+
 '<div class="hero-end"><span>СОХРАНЯТЬ. ЧИТАТЬ. ПЕРЕДАВАТЬ.</span><span>01 &nbsp; / &nbsp; 02</span></div></section>'+
 '<section class="home-discover" aria-label="Исследовать наследие">'+
 '<div class="discover-intro">'+kicker('01','ОТКРОЙТЕ АРХИВ')+'<h2>С чего<br><i>начать?</i></h2><p>Три пути к наследию поэта.</p></div>'+
 '<div class="discover-links">'+
 '<a href="#/life" class="discover-card"><span class="discover-n">01 / ЧЕЛОВЕК</span><span class="discover-title">Его жизнь</span><span class="discover-desc">Судьба. Родина. Возвращение.</span><span class="discover-arrow">'+ico('arrow')+'</span></a>'+
 '<a href="#/works" class="discover-card"><span class="discover-n">02 / СЛОВО</span><span class="discover-title">Его книги</span><span class="discover-desc">Стихи. Переводы. Подстрочник.</span><span class="discover-arrow">'+ico('arrow')+'</span></a>'+
 '<a href="#/media" class="discover-card"><span class="discover-n">03 / ГОЛОС</span><span class="discover-title">Его архив</span><span class="discover-desc">Фотографии. Звучание. Память.</span><span class="discover-arrow">'+ico('arrow')+'</span></a>'+
 '</div></section>';
}
function heading(section,sub=''){
 const s=sections.find(x=>x.key===section);
 return '<div class="page-head">'+
 '<div class="page-head-top">'+kicker(String(sections.indexOf(s)+1).padStart(2,'0'),s.caption)+'<span class="page-head-archive">КЕРИМ ОТАРОВ / ЛИТЕРАТУРНОЕ НАСЛЕДИЕ</span></div>'+
 '<div class="page-heading"><div><h1 class="page-title">'+esc(s.name)+'</h1><p>'+esc(sub||s.lead)+'</p></div><span class="heading-orbit" aria-hidden="true"></span></div></div>';
}
function breadcrumb(section,text){
 return '<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="#/">Главная</a>'+ico('chevron')+'<a href="#/'+section+'">'+esc(sections.find(s=>s.key===section).name)+'</a>'+ico('chevron')+'<span aria-current="page">'+esc(text)+'</span></nav>';
}
function life(){
 return '<div class="page page-life">'+heading('life','1912—1974 · Поэт, переводчик, свидетель эпохи')+
 '<section class="life-layout content-wrap">'+
 '<div class="life-photo"><img src="'+portrait+'" alt="Архивный портрет Керима Отарова" loading="lazy"><span>КЕРИМ САРАМУРЗАЕВИЧ ОТАРОВ</span></div>'+
 '<div class="life-copy">'+kicker('01','БИОГРАФИЯ')+
 '<h2>Судьба народа.<br><i>Голос человека.</i></h2>'+
 '<p>Поэт прошёл через войну, изгнание и возвращение. Родная земля и родной язык стали основой его поэтического мира.</p>'+
 '<div class="timeline-min">'+timeline.map(([year,title,description])=>'<button class="time-chip'+(year==='1912'?' active':'')+'" data-time="'+year+'" aria-pressed="'+(year==='1912')+'">'+year+'</button>').join('')+'</div>'+
 '<div class="time-detail" aria-live="polite"><span id="time-year">1912</span><div><h3 id="time-title">Гюрхожан</h3><p id="time-description">Рождение в балкарском ауле у подножия Эльбруса.</p></div></div>'+
 '<div class="detail-links">'+action('life/chronology','Все даты')+source(sources.life,'Источник биографии')+'</div></div></section></div>';
}
function lifeSub(kind){
 const title=kind==='chronology'?'Хронология':kind==='places'?'География жизни':kind==='family'?'Семья и окружение':null;
 if(!title)return missing();
 const content=kind==='chronology'?
  '<div class="chronology">'+timeline.map(([y,t,d])=>'<article><span>'+y+'</span><div><h3>'+t+'</h3><p>'+d+'</p></div></article>').join('')+'</div>':
  kind==='places'?
  '<div class="three-feature">'+[['Гюрхожан','Родина поэта, аул у подножия Эльбруса.'],['Киргизия','Годы ссылки вместе с балкарским народом.'],['Нальчик','Возвращение и литературная жизнь.']].map(([t,d])=>'<article>'+ico('pin')+'<h3>'+t+'</h3><p>'+d+'</p></article>').join('')+'</div>':
  '<div class="quiet-panel"><h2>Память семьи.</h2><p>В публикации 2024 года дочь поэта Римма Керимовна рассказывает о работе по изданию его произведений на нескольких языках.</p>'+source(sources.press,'Читать публикацию')+'</div>';
 return '<div class="page page-detail">'+heading('life',title)+
 '<div class="content-wrap detail-content">'+breadcrumb('life',title)+'<h2 class="detail-h2">'+title+'</h2>'+content+'</div></div>';
}
function card(w,index){
 return '<a class="work-card" data-work="'+w.id+'" href="#/works/'+w.id+'" style="--i:'+index+'">'+
 workCover(w)+'<div class="work-meta"><span>'+esc(w.kind)+(w.year?' · '+esc(w.year):'')+'</span><span class="work-go">'+ico('arrow')+'</span></div>'+
 '<h3>'+esc(w.title)+'</h3></a>';
}
function worksPage(){
 return '<div class="page page-works">'+heading('works','Стихи, сборники, переводы и параллельное чтение')+
 '<div class="content-wrap works-main"><div class="works-controls"><span class="eyebrow">БИБЛИОТЕКА / <b id="work-count">04</b></span>'+
 '<div class="pills" role="group" aria-label="Тип произведений"><button class="chosen" data-filter="all" aria-pressed="true">Все</button><button data-filter="poetry" aria-pressed="false">Поэзия</button><button data-filter="translation" aria-pressed="false">Переводы</button></div>'+
 '<label class="work-search"><span class="visually-hidden">Поиск произведения</span>'+ico('search')+'<input id="work-query" type="search" placeholder="Название произведения"></label></div>'+
 '<div class="works-grid" id="works-grid">'+works.map(card).join('')+'</div>'+
 '<p id="works-empty" class="works-empty" hidden>По вашему запросу произведений не найдено.</p>'+
 '<p class="editorial-disclaimer">Электронный архив пополняется: полные тексты доступны только после проверки и согласования публикации.</p></div></div>';
}
function reader(w){
 return '<div class="reader-body"><div class="reading-toolbar"><span class="eyebrow">ЧИТАЛЬНЫЙ ЗАЛ / КАРАЧАЕВО-БАЛКАРСКИЙ</span>'+
 '<div class="reader-actions"><button type="button" id="toggle-original" class="reader-button" aria-label="Скрыть оригинал">'+ico('book')+'<span>Два языка</span></button>'+
 '<button type="button" id="bookmark" class="reader-button" aria-label="Добавить в избранное">'+ico('bookmark')+'<span>Сохранить</span></button></div></div>'+
 '<div class="reading-grid" id="reading-grid"><div class="reading-original"><span>01 / ОРИГИНАЛ</span><blockquote lang="krc">Туугъан жерим!<br>Сени кёрмей къалырда,<br>Бушуудан къара сокъур<br>болур эдим.</blockquote></div>'+
 '<div class="reading-translation"><span>02 / РУССКИЙ ПОДСТРОЧНИК</span><blockquote>Родная земля!<br>Если бы я больше тебя<br>не увидел, от горя<br>я бы ослеп.</blockquote></div></div>'+
 '<div class="reading-bottom"><div><span class="eyebrow">НА ПОЛЯХ</span><p>Фрагмент стихотворения (1955). Русский текст — предварительный подстрочник для знакомства, не опубликованный художественный перевод.</p>'+source(sources.poem,'Сверить оригинал')+'</div>'+
 '<div class="reader-note-block"><label for="reader-note">Ваша заметка</label><textarea id="reader-note" maxlength="800" rows="3" placeholder="Сохраните мысль об этом стихотворении"></textarea><button type="button" id="save-note" class="minimal-button">'+ico('check')+'Сохранить заметку</button><small id="reader-note-status" role="status">Хранится только в вашем браузере.</small></div></div></div>';
}
function workDetail(id){
 const w=works.find(x=>x.id===id);if(!w)return missing();
 return '<div class="page page-work-detail"><div class="content-wrap">'+breadcrumb('works',w.title)+
 '<div class="work-feature"><div class="work-feature-copy">'+kicker(w.year||'—',w.kind)+'<h1 class="detail-title">'+esc(w.title)+'</h1><p>'+esc(w.line)+'</p><div class="detail-links">'+action('works','Вся библиотека')+
 '<button type="button" class="minimal-button share-button" data-action="share">'+ico('arrow')+'Поделиться</button></div></div>'+
 '<div class="work-feature-image">'+workCover(w,true)+'</div></div></div>'+
 (id==='roads'?reader(w):'<section class="quiet-panel unavailable content-wrap"><h2>Текст готовится.</h2><p>Проверенный электронный текст пока не размещён. Публикация будет доступна после сверки источника и прав.</p>'+action('works/roads','Открыть доступное стихотворение')+'</section>')+'</div>';
}
const mediaItems=[
 ['author','Голос автора','Архивные чтения. Аудиофайлы ожидают публикации.','sound'],
 ['readers','Современные чтения','Исполнения стихов поэта современными чтецами.','headphones'],
 ['photos','Фотоархив','Портреты и исторические свидетельства.','image'],
 ['video','Видеоархив','Документальные материалы и выступления.','film']
];
function mediaPage(){
 return '<div class="page">'+heading('media','Фотографии, голос поэта и современные прочтения')+
 '<div class="content-wrap media-layout"><div class="media-lead">'+kicker('01','ЗВУК И ПАМЯТЬ')+
 '<h2>Голос, который<br><i>хочется услышать.</i></h2><p>Архивное собрание пополняется. Подлинные записи появятся здесь после получения файлов.</p>'+
 '<div class="sound-illustration" aria-hidden="true"><div class="disc"><div></div></div><span>ОТАРЛАНЫ КЕРИМ</span></div></div>'+
 '<div class="media-links">'+mediaItems.map(([id,title,desc,icon],i)=>
 '<a href="#/media/'+id+'" class="line-item"><span class="item-no">0'+(i+1)+'</span><span class="item-svg">'+ico(icon)+'</span><span class="item-label"><strong>'+title+'</strong><small>'+desc+'</small></span><span class="round-icon">'+ico('arrow')+'</span></a>').join('')+'</div></div></div>';
}
function mediaDetail(kind){
 const item=mediaItems.find(x=>x[0]===kind);if(!item)return missing();
 return '<div class="page">'+heading('media',item[1])+'<section class="content-wrap detail-content">'+breadcrumb('media',item[1])+
 (kind==='photos'?'<div class="photo-archive"><img src="'+portrait+'" alt="Керим Отаров. Архивный портрет"><div>'+kicker('01','ПОДЛИННЫЙ СНИМОК')+'<h2>Лицо<br><i>эпохи.</i></h2><p>Архивная фотография из публикации «Кабардино-Балкарской правды». Другие снимки появятся после проверки происхождения.</p>'+source(sources.portrait,'Источник фотографии')+'</div></div>':
 '<div class="quiet-panel"><div class="panel-icon">'+ico(item[3])+'</div><h2>'+item[1]+'</h2><p>Пока аудио- и видеофайлы не получены и не согласованы для публикации, здесь нет фиктивных кнопок воспроизведения.</p>'+action('media','К архивным коллекциям')+'</div>')+
 '</section></div>';
}
function memoryPage(){
 return '<div class="page">'+heading('memory','Свидетельства, места и исследования')+
 '<section class="content-wrap memory-layout"><div class="memory-lead">'+kicker('01','ПАМЯТЬ О ПОЭТЕ')+'<h2>Время проходит.<br><i>Слово остаётся.</i></h2><p>Воспоминания современников, география жизни и документы о литературном наследии.</p></div>'+
 '<div class="memory-items">'+
 '<a href="#/memory/places" class="line-item">'+ico('pin')+'<span class="item-label"><strong>Памятные места</strong><small>Гюрхожан · Нальчик · Киргизия</small></span><span class="round-icon">'+ico('arrow')+'</span></a>'+
 '<a href="#/memory/voices" class="line-item">'+ico('quote')+'<span class="item-label"><strong>Воспоминания</strong><small>Свидетельства и семейные материалы</small></span><span class="round-icon">'+ico('arrow')+'</span></a>'+
 '<a href="#/memory/publications" class="line-item">'+ico('book')+'<span class="item-label"><strong>Публикации</strong><small>Биографии, статьи и исследования</small></span><span class="round-icon">'+ico('arrow')+'</span></a></div></section></div>';
}
function memoryDetail(kind){
 const labels={places:'Памятные места',voices:'Воспоминания',publications:'Публикации'};
 if(!labels[kind])return missing();
 const places='<div class="three-feature">'+[['Гюрхожан','Родной аул у подножия Эльбруса.'],['Киргизия','Место многолетнего изгнания.'],['Нальчик','Возвращение к литературной жизни.']].map(([title,desc])=>'<article>'+ico('pin')+'<h3>'+title+'</h3><p>'+desc+'</p></article>').join('')+'</div>';
 const voices='<div class="quiet-panel"><h2>Истории, которые<br><i>нужно сохранить.</i></h2><p>Воспоминания семьи и современников будут публиковаться после проверки происхождения. Пока доступна публикация о работе дочери поэта Риммы Керимовны над изданиями.</p>'+source(sources.press,'Материал «Горянки»')+'</div>';
 const publications='<div class="publication-list">'+[
  ['Керим Отаров','Биографическая публикация','Портал СМИ КБР',sources.life],
  ['Пока огонь пылает в очаге','Материал о литературных чтениях','Кабардино-Балкарская правда',sources.readings],
  ['Я горд своей дорогою земной…','О новых изданиях и семейном архиве','Газета «Горянка»',sources.press],
  ['Керим Отаров. ЖЗЛ','Биографическое издание','Молодая гвардия',sources.book]
 ].map(([title,label,subtitle,url],i)=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer" class="publication">'+
 '<span>0'+(i+1)+' / '+label+'</span><strong>'+title+'</strong><small>'+subtitle+'</small>'+ico('arrow')+'</a>').join('')+'</div>';
 return '<div class="page">'+heading('memory',labels[kind])+'<section class="content-wrap detail-content">'+breadcrumb('memory',labels[kind])+
 '<h2 class="detail-h2">'+labels[kind]+'</h2>'+(kind==='places'?places:kind==='voices'?voices:publications)+'</section></div>';
}
function projectPage(){
 return '<div class="page">'+heading('projects','Параллельное чтение и родной язык')+
 '<section class="content-wrap project-layout"><div class="project-intro">'+kicker('01','ЯЗЫК ПОЭЗИИ')+'<h2>Одно слово.<br><i>Целый мир.</i></h2><p>Небольшой словарь помогает понять текст на родном языке. Значения уточняются в контексте стихотворений.</p>'+action('works/roads','Читать на двух языках')+'</div>'+
 '<div class="word-lab"><div class="word-lab-top"><span>Словарь поэзии</span>'+ico('layers')+'</div><div class="word-current"><h3 id="word-current" lang="krc">Тау</h3><p id="word-translation">Гора</p><small id="word-comment">Образ горного мира.</small></div>'+
 '<div class="word-selector">'+words.map(([w],i)=>'<button type="button" data-word="'+i+'" class="'+(i===0?'selected':'')+'" aria-pressed="'+(i===0)+'">'+w+'</button>').join('')+'</div></div>'+
 '</section></div>';
}
function projectDetail(kind){
 const titles={dictionary:'Словарь поэзии',parallel:'Параллельное чтение',education:'Образовательные материалы'};
 if(!titles[kind])return missing();
 const body=kind==='dictionary'?'<p>Словарь находится на странице проектов. Перейдите к интерактивному выбору слов.</p>'+action('projects','Открыть словарь'):
 kind==='parallel'?'<p>Первый фрагмент можно читать в оригинале и с предварительным русским подстрочником.</p>'+action('works/roads','Открыть читальный зал'):
 '<p>Начните со стихотворения и хронологии поэта, затем исследуйте значения слов.</p>'+action('works','Открыть библиотеку');
 return '<div class="page">'+heading('projects',titles[kind])+'<div class="content-wrap detail-content">'+breadcrumb('projects',titles[kind])+'<div class="quiet-panel"><h2>'+titles[kind]+'</h2>'+body+'</div></div></div>';
}
function eventsPage(){
 return '<div class="page">'+heading('events','Проверенные анонсы литературных мероприятий')+
 '<section class="content-wrap events-layout"><div class="event-intro">'+kicker('01','КАЛЕНДАРЬ')+'<h2>Встречаемся<br><i>у слова.</i></h2></div>'+
 '<div class="events-sidebar"><div class="month-row"><button type="button" class="round-icon" data-action="month-prev" aria-label="Предыдущий месяц">'+ico('left')+'</button><span id="selected-month"></span><button type="button" class="round-icon" data-action="month-next" aria-label="Следующий месяц">'+ico('right')+'</button></div>'+
 '<div class="event-empty">'+ico('calendar')+'<h3>События пока<br>не объявлены.</h3><p>Здесь появятся встречи, чтения и выставки с подтверждёнными датой и местом.</p></div>'+
 '<a href="#/events/example" class="event-sample">Как будет выглядеть страница события '+ico('arrow')+'</a></div></section></div>';
}
function eventDetail(id){
 if(id!=='example')return missing();
 return '<div class="page">'+heading('events','Пример страницы мероприятия')+
 '<section class="content-wrap detail-content">'+breadcrumb('events','Пример')+
 '<div class="quiet-panel">'+kicker('—','ДЕМОНСТРАЦИЯ / НЕ АНОНС')+'<h2>Литературный<br><i>вечер.</i></h2><p>Страница показывает структуру будущего мероприятия. Дата, место и организатор не указаны, поскольку реальное событие не объявлено.</p>'+action('events','Вернуться к афише')+'</div></section></div>';
}
function sourcesPage(){
 const refs=[
 ['Биография','Портал СМИ Кабардино-Балкарии',sources.life],
 ['Стихотворение «Сокъур болур эдим»','Эльбрусоид · оригинал',sources.poem],
 ['Архивный портрет','Кабардино-Балкарская правда',sources.portrait],
 ['Наследие и новые издания','Газета «Горянка»',sources.press],
 ['Отаровские литературные чтения','Кабардино-Балкарская правда',sources.readings]
 ];
 return '<div class="page sources-page"><div class="page-head"><div class="page-head-top">'+kicker('07','ОБ АРХИВЕ')+'</div><div class="page-heading"><div><h1 class="page-title">Источники</h1><p>Материалы, на которые опирается цифровой архив.</p></div></div></div>'+
 '<div class="content-wrap detail-content"><div class="quiet-panel sources-note"><h2>Подлинное.<br><i>Бережно.</i></h2><p>Мы отделяем подтверждённые документы от материалов, которые ещё готовятся к публикации. Полные тексты, аудио и воспоминания появятся после сверки и проверки прав.</p></div>'+
 '<div class="publication-list sources-list">'+refs.map(([title,label,url],i)=>'<a class="publication" href="'+url+'" target="_blank" rel="noopener noreferrer"><span>0'+(i+1)+'</span><strong>'+title+'</strong><small>'+label+'</small>'+ico('arrow')+'</a>').join('')+'</div></div></div>';
}
function missing(){return '<div class="page">'+
 '<section class="content-wrap missing"><span class="eyebrow">404 / НЕ НАЙДЕНО</span><h1>Страница ещё<br>не написана.</h1>'+action('','На главную')+'</section></div>';}
function path(){try{return decodeURIComponent(location.hash.replace(/^#\/?/,'')).replace(/\/+$/,'').split('?')[0];}catch{return '404';}}
function route(){
 const [key,sub]=path().split('/').filter(Boolean);
 if(!key)return home();
 switch(key){
 case 'life':return sub?lifeSub(sub):life();
 case 'works':return sub?workDetail(sub):worksPage();
 case 'media':return sub?mediaDetail(sub):mediaPage();
 case 'memory':return sub?memoryDetail(sub):memoryPage();
 case 'projects':return sub?projectDetail(sub):projectPage();
 case 'events':return sub?eventDetail(sub):eventsPage();
 case 'sources':return sourcesPage();
 default:return missing();
 }
}
let lastPath=null;
let month=new Date(2026,9,1);
function toast(t){const el=$('#status-toast');el.textContent=t;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),2600);}
function localGet(key){try{return localStorage.getItem(key);}catch{return null;}}
function localSet(key,value){try{localStorage.setItem(key,value);return true;}catch{return false;}}
function updateReader(){
 if(!$('#reader-note'))return;
 $('#reader-note').value=localGet('otarov-note-roads')||'';
 const saved=localGet('otarov-bookmark-roads')==='yes';
 const btn=$('#bookmark');
 btn.setAttribute('aria-label',saved?'Убрать из избранного':'Добавить в избранное');
 btn.innerHTML=ico(saved?'check':'bookmark')+'<span>'+(saved?'Сохранено':'Сохранить')+'</span>';
}
function updateMonth(){
 const label=$('#selected-month');
 if(label)label.textContent=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(month).replace(' г.','');
}
function paint(force=false){
 const p=path();if(p===lastPath&&!force)return;lastPath=p;
 main.innerHTML=route();
 const key=p.split('/')[0];
 document.title=(sections.find(s=>s.key===key)?.name||'Керим Отаров')+' — литературное наследие';
 $$('[data-nav]').forEach(a=>a.setAttribute('aria-current',a.dataset.nav===key?'page':'false'));
 $('#topbar').classList.toggle('on-light',!!key && key!=='home');
 updateReader();updateMonth();bindVisuals();updateSceneProgress();
 main.focus({preventScroll:true});
 if(!location.hash.match(/^#(home|library|about|dictionary|voice)$/))scrollTo({top:0,behavior:'instant'});
}
let pendingCover=null;
function openPath(href,origin){
 if(href===location.hash){closeMenu();closeSearch();return;}
 const rect=origin?.getBoundingClientRect();
 const clickX=rect?rect.left+rect.width/2:innerWidth/2;
 const clickY=rect?rect.top+rect.height/2:innerHeight/2;
 document.documentElement.style.setProperty('--reveal-x',((clickX/innerWidth)*100).toFixed(2)+'%');
 document.documentElement.style.setProperty('--reveal-y',((clickY/innerHeight)*100).toFixed(2)+'%');
 const card=origin?.closest('.work-card');
 if(card && href.startsWith('#/works/')){pendingCover=card.querySelector('.cover-visual');pendingCover.style.viewTransitionName='cover-flight';}
 closeMenu();closeSearch();
 const action=()=>{history.pushState({},'',href);paint();};
 if(document.startViewTransition&&!reduce.matches){
   const v=document.startViewTransition(action);
   v.finished.finally(()=>{if(pendingCover){pendingCover.style.removeProperty('view-transition-name');pendingCover=null;}});
 }else{
   action();if(pendingCover){pendingCover.style.removeProperty('view-transition-name');pendingCover=null;}
 }
}
function closeMenu(){
 const symbol=$('#menu-trigger use');if(symbol)symbol.setAttribute('href','./assets/lucide-sprite.svg#menu');
 menu.classList.remove('is-open');menu.setAttribute('aria-hidden','true');menu.inert=true;
 trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','Открыть меню');
 document.body.classList.remove('menu-open');
}
function toggleMenu(){
 if(menu.classList.contains('is-open')){closeMenu();return;}
 closeSearch();menu.inert=false;menu.setAttribute('aria-hidden','false');menu.classList.add('is-open');
 const symbol=$('#menu-trigger use');if(symbol)symbol.setAttribute('href','./assets/lucide-sprite.svg#x');
 trigger.setAttribute('aria-expanded','true');trigger.setAttribute('aria-label','Закрыть меню');
 document.body.classList.add('menu-open');
 $('.menu-list a',menu).focus();
}
function closeSearch(){
 search.classList.remove('is-open');search.setAttribute('aria-hidden','true');search.inert=true;
 document.body.classList.remove('search-open');
}
function openSearch(){
 closeMenu();search.inert=false;search.setAttribute('aria-hidden','false');search.classList.add('is-open');
 document.body.classList.add('search-open');$('#global-search').value='';updateSearch();$('#global-search').focus();
}
const searchIndex=[
 ...sections.map(s=>({title:s.name,desc:s.lead,href:'#/'+s.key})),
 ...works.map(w=>({title:w.title,desc:w.kind+' '+w.line,href:'#/works/'+w.id})),
 {title:'Словарь поэзии',desc:'Тау Жюрек Жол Тил Жарыкъ',href:'#/projects'},
 {title:'Гюрхожан',desc:'Родина поэта',href:'#/life/places'},
 {title:'Хронология',desc:'1912 1938 1944 1956 1974',href:'#/life/chronology'},
 {title:'Фотоархив',desc:'Портрет поэта',href:'#/media/photos'}
];
function updateSearch(){
 const q=$('#global-search').value.trim().toLocaleLowerCase('ru');
 const matches=searchIndex.filter(r=>(r.title+' '+r.desc).toLocaleLowerCase('ru').includes(q)).slice(0,8);
 $('#search-results').innerHTML=matches.length?matches.map(r=>'<a href="'+r.href+'"><span><strong>'+esc(r.title)+'</strong><small>'+esc(r.desc)+'</small></span>'+ico('arrow')+'</a>').join(''):'<p class="search-zero">Совпадений не найдено.</p>';
}
function filterWorks(){
 const q=($('#work-query')?.value||'').trim().toLocaleLowerCase('ru');
 const t=$('[data-filter].chosen')?.dataset.filter||'all';let n=0;
 $$('.work-card').forEach(el=>{
 const w=works.find(x=>x.id===el.dataset.work);
 const show=w&&(t==='all'||w.type===t)&&(w.title+' '+w.line).toLocaleLowerCase('ru').includes(q);
 el.hidden=!show;if(show)n++;
 });
 if($('#work-count'))$('#work-count').textContent=String(n).padStart(2,'0');
 if($('#works-empty'))$('#works-empty').hidden=n>0;
}
function bindVisuals(){
 const hero=$('.hero');
 if(hero && reduce.matches)hero.classList.add('motion-reduced');
 if(fine.matches&&!reduce.matches){
   $$('[data-magnetic]').forEach(el=>{
     el.addEventListener('pointermove',e=>{
       const r=el.getBoundingClientRect();
       const x=((e.clientX-r.left)/r.width-.5)*13;
       const y=((e.clientY-r.top)/r.height-.5)*13;
       el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';
     },{passive:true});
     el.addEventListener('pointerleave',()=>el.style.removeProperty('transform'));
   });
   // Lusion v3-inspired inertia, adapted to a restrained archival portrait.
   // A damped spring keeps the photo moving briefly after the pointer stops.
   if(hero){
     const target={x:0,y:0},position={x:0,y:0},velocity={x:0,y:0};
     let ticking=false;
     const tick=()=>{
       if(!hero.isConnected){ticking=false;return;}
       velocity.x=(velocity.x+(target.x-position.x)*.08)*.72;
       velocity.y=(velocity.y+(target.y-position.y)*.08)*.72;
       position.x+=velocity.x;position.y+=velocity.y;
       hero.style.setProperty('--mx',position.x.toFixed(2)+'px');
       hero.style.setProperty('--my',position.y.toFixed(2)+'px');
       const unsettled=Math.abs(velocity.x)+Math.abs(velocity.y)+Math.abs(target.x-position.x)+Math.abs(target.y-position.y)>.09;
       if(unsettled)requestAnimationFrame(tick);else ticking=false;
     };
     const start=()=>{if(!ticking){ticking=true;requestAnimationFrame(tick);}};
     hero.addEventListener('pointermove',e=>{
       const rect=hero.getBoundingClientRect();
       const x=(e.clientX-rect.left)/rect.width-.5;
       const y=(e.clientY-rect.top)/rect.height-.5;
       target.x=x*24;target.y=y*18;
       hero.style.setProperty('--light-x',Math.round((x+.5)*100)+'%');
       hero.style.setProperty('--light-y',Math.round((y+.5)*100)+'%');
       start();
     },{passive:true});
     hero.addEventListener('pointerleave',()=>{target.x=0;target.y=0;start();});
   }
   $$('.work-card').forEach(el=>{
     el.addEventListener('pointermove',e=>{
       const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
       el.style.setProperty('--rot-x',(-y*5).toFixed(2)+'deg');el.style.setProperty('--rot-y',(x*6).toFixed(2)+'deg');
       el.style.setProperty('--glow-x',Math.round((x+.5)*100)+'%');
       el.style.setProperty('--glow-y',Math.round((y+.5)*100)+'%');
     },{passive:true});
     el.addEventListener('pointerleave',()=>{el.style.setProperty('--rot-x','0deg');el.style.setProperty('--rot-y','0deg');});
   });
 }
 const observer=('IntersectionObserver' in window)&&new IntersectionObserver(entries=>{
   for(const e of entries)if(e.isIntersecting){e.target.classList.add('in');observer.unobserve(e.target);}
 },{rootMargin:'0px 0px -10px 0px',threshold:.06});
 $$('.discover-card, .work-card, .life-layout, .media-links, .three-feature article, .publication, .line-item').forEach((el,i)=>{
   el.classList.add('reveal');el.style.setProperty('--stagger',Math.min(i,5)*70+'ms');
   if(!observer||reduce.matches)el.classList.add('in');else observer.observe(el);
 });
}
// A one-pixel editorial progress indicator and a depth-aware hero camera.
// Scroll updates are rAF-throttled and never block native scrolling.
const progressBar=$('.scene-progress');
function updateSceneProgress(){
 if(!progressBar)return;
 const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
 const progress=max?Math.max(0,Math.min(1,scrollY/max)):0;
 progressBar.style.transform='scaleX('+progress.toFixed(4)+')';
 const hero=$('.hero');
 if(hero&&!reduce.matches){
   const depth=Math.max(0,Math.min(1,scrollY/Math.max(1,innerHeight)));
   hero.style.setProperty('--depth-scale',(1+depth*.14).toFixed(3));
   hero.style.setProperty('--scroll-lift',(-depth*35).toFixed(1)+'px');
   hero.style.setProperty('--title-shift',(-depth*17).toFixed(1)+'px');
 }
}
let progressTick=false;
addEventListener('scroll',()=>{
 if(progressTick)return;
 progressTick=true;
 requestAnimationFrame(()=>{progressTick=false;updateSceneProgress();});
},{passive:true});
addEventListener('resize',updateSceneProgress,{passive:true});
$$('#site-menu .menu-list a').forEach((link,index)=>{
 link.addEventListener('pointerenter',()=>{
   const label=$('#menu-chapter-number');
   if(label)label.textContent=String(index+1).padStart(2,'0');
   menu.style.setProperty('--menu-depth',((index-2.5)*-9)+'px');
 },{passive:true});
});
document.addEventListener('click',e=>{
 const anchor=e.target.closest('a[href^="#/"]');
 if(anchor){
   e.preventDefault();openPath(anchor.getAttribute('href'),anchor);return;
 }
 const a=e.target.closest('[data-action]');if(a){
   if(a.dataset.action==='menu')toggleMenu();
   if(a.dataset.action==='search')openSearch();
   if(a.dataset.action==='close-search')closeSearch();
   if(a.dataset.action==='month-prev'){month.setMonth(month.getMonth()-1);updateMonth();}
   if(a.dataset.action==='month-next'){month.setMonth(month.getMonth()+1);updateMonth();}

   if(a.dataset.action==='share'){
     if(navigator.clipboard?.writeText)navigator.clipboard.writeText(location.href).then(()=>toast('Ссылка скопирована')).catch(()=>toast('Скопируйте адрес из браузера'));
     else toast('Скопируйте адрес из браузера');
   }
 }
 const time=e.target.closest('[data-time]');
 if(time){
   $$('.time-chip').forEach(b=>{const yes=b===time;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});
   const found=timeline.find(x=>x[0]===time.dataset.time);
   if(found){$('#time-year').textContent=found[0];$('#time-title').textContent=found[1];$('#time-description').textContent=found[2];}
 }
 const filter=e.target.closest('[data-filter]');
 if(filter){$$('[data-filter]').forEach(b=>{const yes=b===filter;b.classList.toggle('chosen',yes);b.setAttribute('aria-pressed',String(yes));});filterWorks();}
 const word=e.target.closest('[data-word]');
 if(word){
   $$('.word-selector button').forEach(b=>{const yes=b===word;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes));});
   const row=words[Number(word.dataset.word)];
   if(row){$('#word-current').textContent=row[0];$('#word-translation').textContent=row[1];$('#word-comment').textContent=row[2];}
 }
 const original=e.target.closest('#toggle-original');
 if(original){
   const node=$('.reading-original'),hidden=!node.hidden;node.hidden=hidden;
   original.setAttribute('aria-label',hidden?'Показать оригинал':'Скрыть оригинал');
   original.querySelector('span').textContent=hidden?'Один язык':'Два языка';
   $('#reading-grid').classList.toggle('single',hidden);
 }
 if(e.target.closest('#bookmark')){
   const button=$('#bookmark');
   const was=localGet('otarov-bookmark-roads')==='yes';
   if(!localSet('otarov-bookmark-roads',was?'no':'yes')){toast('Браузер запретил сохранение');return;}
   updateReader();
 }
 if(e.target.closest('#save-note')){
   const ok=localSet('otarov-note-roads',$('#reader-note').value.slice(0,800));
   $('#reader-note-status').textContent=ok?'Заметка сохранена в этом браузере.':'Не удалось сохранить заметку.';
 }
});
$('#global-search').addEventListener('input',updateSearch);
document.addEventListener('input',e=>{if(e.target.id==='work-query')filterWorks();});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){closeMenu();closeSearch();}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}
 if(e.key==='Enter'&&document.activeElement===$('#global-search')){
   const first=$('#search-results a');if(first)openPath(first.getAttribute('href'),first);
 }
});
search.addEventListener('click',e=>{if(e.target===search)closeSearch();});
addEventListener('popstate',()=>{closeMenu();closeSearch();paint();});
addEventListener('hashchange',()=>{closeMenu();closeSearch();paint();});
paint(true);
})();
