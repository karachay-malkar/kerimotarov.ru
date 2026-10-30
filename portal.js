/* Kerim Otarov literary portal — independent hash-routed pages.
   Hash routes work on GitHub Pages in a repository subdirectory. */
(function () {
  'use strict';
  const doc = document;
  const main = doc.querySelector('main');
  if (!main) return;
  const view = doc.createElement('section');
  view.id = 'portal-view';
  view.className = 'portal-view';
  view.tabIndex = -1;
  view.hidden = true;
  main.append(view);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = './assets/otarov-portrait-kbp.jpg';
  const source = {
    poem: 'https://www.elbrusoid.net/articles/abiyat/358978/',
    life: 'https://www.smikbr.ru/node/12223',
    book: 'https://gvardiya.ru/books/zhizn-zamechatelnyh-lyudey/kerim-otarov',
    news: 'https://www.kbpravda.ru/node/2225',
    poems: 'https://www.goryankakbr.ru/node/679'
  };
  const sections = [
    {id:'life',title:'Жизнь',num:'01',sub:'Человек и время',desc:'Биография, судьба, хронология и места, с которыми была связана жизнь Керима Отарова.'},
    {id:'works',title:'Творчество',num:'02',sub:'Поэзия и переводы',desc:'Библиотека произведений, сборников и переводов. Родной язык — рядом с русским.'},
    {id:'media',title:'Медиа',num:'03',sub:'Голос и образ',desc:'Фотографии, записи голоса поэта, современные чтения и материалы для просмотра.'},
    {id:'memory',title:'Память',num:'04',sub:'След в истории',desc:'Места памяти, воспоминания, исследования и публикации о поэте.'},
    {id:'projects',title:'Проекты',num:'05',sub:'Слово продолжается',desc:'Образовательные материалы, словарь, параллельное чтение и специальные подборки.'},
    {id:'events',title:'Афиша',num:'06',sub:'Литературная жизнь',desc:'Анонсы встреч и литературных мероприятий, когда они будут подтверждены.'}
  ];
  const books = [
    {id:'roads',title:'Сокъур болур эдим',label:'Стихотворение · 1955',type:'poetry',cover:'roads',by:'ОТАРЛАНЫ КЕРИМ',headline:'Сокъур<br>болур<br><em>эдим</em>',desc:'Родная земля и память о ней. Доступен короткий фрагмент оригинала с предварительным подстрочником.',source:source.poem},
    {id:'land',title:'Родная земля',label:'Поэтический сборник',type:'poetry',cover:'land',by:'КЕРИМ ОТАРОВ',headline:'Родная<br><em>земля</em>',desc:'Поэтическое издание. Оцифрованный полный текст пока не опубликован.',source:source.life},
    {id:'star',title:'Моя утренняя звезда',label:'Поэтический сборник',type:'poetry',cover:'star',by:'КЕРИМ ОТАРОВ',headline:'Моя утренняя<br><em>звезда</em>',desc:'Поэтическое издание. Оцифрованный полный текст пока не опубликован.',source:source.life},
    {id:'hero',title:'Герой нашего времени',label:'Раздел переводов · каталог',type:'translation',cover:'hero',by:'МИХАИЛ ЛЕРМОНТОВ',headline:'Герой<br>нашего<br><em>времени</em>',desc:'Каталожная запись для параллельного чтения перевода. Текст и библиографические данные издания требуют сверки.',source:'https://www.elbrusoid.net/library/'}
  ];
  const moments = [
    {year:'1912',title:'У истоков',text:'Керим Отаров родился в балкарском ауле Гюрхожан, у подножия Эльбруса.'},
    {year:'1938',title:'Литературное признание',text:'Вышел сборник «Стихи и песни». Поэт возглавил Союз писателей Кабардино-Балкарии.'},
    {year:'1944',title:'Изгнание',text:'Депортация балкарского народа стала одной из определяющих трагедий его жизни. Годы ссылки он провёл в Киргизии.'},
    {year:'1956',title:'Возвращение',text:'Вернулся в Нальчик. Вышел сборник «Дороги», начался новый этап его творческой жизни.'},
    {year:'1974',title:'Наследие',text:'Керим Отаров ушёл из жизни. Его стихи и переводы продолжают жить в культуре и памяти читателей.'}
  ];
  const entries = [
    {name:'Тау',translation:'Гора',note:'Одно из ключевых слов горного мира.'},
    {name:'Жюрек',translation:'Сердце',note:'Слово внутреннего чувства и переживания.'},
    {name:'Жол',translation:'Дорога, путь',note:'В поэзии путь нередко становится образом судьбы.'},
    {name:'Тил',translation:'Язык',note:'Родная речь как часть культурной памяти.'},
    {name:'Жарыкъ',translation:'Светлый, свет',note:'Значение зависит от контекста.'}
  ];
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const arrow = '<span class="portal-arrow" aria-hidden="true">↗</span>';
  function link(path,label,cls){return '<a class="'+(cls||'portal-line-link')+'" href="#/'+path+'">'+label+arrow+'</a>';}
  function external(url,label){return '<a class="portal-source-link" target="_blank" rel="noopener noreferrer" href="'+url+'">'+label+' '+arrow+'</a>';}
  function kicker(num,title){return '<div class="portal-kicker"><span>КО / ЛИТЕРАТУРНОЕ НАСЛЕДИЕ</span><span>'+num+' — '+title+'</span></div>';}
  function pageIntro(section,title,description,dark){
    return '<div class="portal-intro'+(dark?' portal-intro-dark':'')+'">'+kicker(section.num,section.title)+
      '<div class="portal-intro-inner"><div><span class="portal-overline">'+esc(section.sub)+'</span><h1>'+title+'</h1></div>'+
      '<p>'+esc(description||section.desc)+'</p></div><div class="portal-intro-end"><span>КЕРИМ ОТАРОВ / 1912–1974</span><span>↓ &nbsp; ИССЛЕДОВАТЬ РАЗДЕЛ</span></div></div>';
  }
  function crumb(section,detail){return '<nav class="portal-breadcrumbs" aria-label="Путь"><a href="#/">Главная</a><span>/</span><a href="#/'+section.id+'">'+section.title+'</a><span>/</span><span aria-current="page">'+esc(detail)+'</span></nav>';}
  function chapter(items){
    return '<div class="portal-chapter-list">'+items.map((item,i)=>
      '<a class="portal-chapter" href="#/'+item.path+'"><span class="chapter-count">'+String(i+1).padStart(2,'0')+'</span>'+
      '<span class="chapter-main"><strong>'+item.title+'</strong><small>'+item.desc+'</small></span><span class="portal-circle">'+arrow+'</span></a>').join('')+'</div>';
  }
  function cover(book,large){
    return '<div class="book-cover cover-'+book.cover+' '+(large?'portal-cover-large':'')+'"><span class="cover-author">'+esc(book.by)+'</span>'+
      '<span class="cover-title">'+book.headline+'</span><span class="portal-cover-symbol" aria-hidden="true">'+(book.cover==='star'?'✳':book.cover==='roads'?'◎':book.cover==='land'?'⌁':'✦')+'</span>'+
      '<span class="cover-year">'+esc(book.label)+'</span><span class="cover-open">Открыть ↗</span></div>';
  }
  function workCard(book){
    return '<a class="portal-book-card" href="#/works/'+book.id+'" data-portal-book="'+book.id+'">'+cover(book,false)+
      '<div class="portal-book-meta"><span>'+esc(book.label)+'</span><span>↗</span></div><h3>'+esc(book.title)+'</h3><p>'+esc(book.desc)+'</p></a>';
  }
  function landingLife(){
    const section=sections[0];
    return pageIntro(section,'Жизнь <i>и судьба.</i>','История одного поэта — и история века, через который ему пришлось пройти.')+
      '<div class="portal-body"><div class="portal-feature"><div class="portal-feature-photo"><img src="'+portrait+'" alt="Архивный портрет Керима Отарова" loading="lazy"><span>АРХИВНЫЙ ПОРТРЕТ</span></div><div class="portal-feature-copy"><span class="portal-overline">1912 — 1974</span><h2>За строками<br><i>стоит человек.</i></h2><p>Поэт, переводчик, свидетель тяжёлой эпохи. Родная земля, война, депортация и возвращение стали частью его жизни и творчества.</p>'+link('life/chronology','Изучить хронологию')+'</div></div>'+
      '<div class="portal-section-caption"><span>ПУТИ К ИСТОРИИ</span><span>ТРИ ГЛАВЫ</span></div>'+
      chapter([{path:'life/chronology',title:'Хронология',desc:'Ключевые даты жизни и творчества'},{path:'life/places',title:'География жизни',desc:'Гюрхожан, Нальчик, Киргизия'},{path:'life/family',title:'Семья и окружение',desc:'Раздел архивных свидетельств'}])+'</div>';
  }
  function landingWorks(){
    const section=sections[1];
    return pageIntro(section,'Слово <i>и вечность.</i>','Оригиналы, сборники и переводы — там, где текст уже доступен, читайте его рядом с пояснением.')+
    '<div class="portal-body"><div class="portal-section-caption"><span>БИБЛИОТЕКА</span><span id="portal-count">04 ЗАПИСИ</span></div>'+
    '<div class="portal-work-toolbar"><div class="portal-pills" role="group" aria-label="Фильтр по типу"><button class="selected" data-portal-filter="all" aria-pressed="true">Все</button><button data-portal-filter="poetry" aria-pressed="false">Поэзия</button><button data-portal-filter="translation" aria-pressed="false">Переводы</button></div><label><span class="sr-only">Поиск по произведениям</span><input type="search" id="portal-work-search" placeholder="Найти произведение…" autocomplete="off"></label></div>'+
    '<div class="portal-book-grid" id="portal-book-grid">'+books.map(workCard).join('')+'</div><p class="portal-empty" id="portal-work-empty" hidden>По вашему запросу ничего не найдено.</p>'+
    '<div class="portal-editorial"><span>ОБ АРХИВЕ</span><p>Полные тексты публикуются после проверки источников и прав. Неподтверждённые произведения не выдаются за доступные издания.</p></div></div>';
  }
  function workDetail(id){
    const book=books.find(b=>b.id===id);
    if(!book)return notFound();
    const section=sections[1];
    const reading=id==='roads';
    return '<div class="portal-detail-top">'+crumb(section,book.title)+'<div class="portal-work-hero"><div class="portal-work-titles"><span class="portal-overline">'+esc(book.label)+'</span><h1>'+esc(book.title)+'</h1><p>'+esc(book.desc)+'</p><div class="portal-detail-actions">'+
      '<a class="portal-outline-action" href="#/works">← &nbsp; В библиотеку</a><button class="portal-outline-action" id="portal-share" type="button">Скопировать ссылку ↗</button></div></div>'+
      '<div class="portal-work-cover">'+cover(book,true)+'</div></div></div>'+
      (reading?readerMarkup():'<div class="portal-body portal-unavailable"><span class="portal-overline">БИБЛИОГРАФИЧЕСКАЯ ЗАПИСЬ</span><h2>Текст <i>готовится.</i></h2><p>Для этого произведения проверенный электронный текст пока недоступен. Открывайте сведения об издании и возвращайтесь к библиотеке за новыми материалами.</p>'+external(book.source,'Перейти к источнику')+'</div>')+
      '<div class="portal-body portal-after"><span>ДАЛЬШЕ В БИБЛИОТЕКЕ</span>'+link('works','Все произведения')+'</div>';
  }
  function readerMarkup(){
    return '<div class="portal-reader"><div class="portal-reader-head"><div><span class="portal-overline">ЧИТАЛЬНЫЙ ЗАЛ</span><h2>Два языка.<br><i>Одна память.</i></h2><p>Фрагмент оригинала и предварительный пояснительный подстрочник. Публикация сверяется с источником.</p></div><div class="portal-reader-controls"><button id="portal-parallel" type="button" aria-pressed="true">Два языка <span>⇄</span></button><button id="portal-notes" type="button" aria-pressed="true">Поля <span>＋</span></button><button id="portal-save" type="button" aria-pressed="false">Сохранить ♧</button></div></div>'+
      '<div class="portal-reader-grid" id="portal-reader-grid"><div class="portal-original"><span class="portal-lang">01 / КАРАЧАЕВО-БАЛКАРСКИЙ</span><p class="portal-poem" lang="krc">Туугъан жерим! Сени кёрмей къалырда,<br>Бушуудан къара сокъур болур эдим.</p><p class="portal-footnote">Оригинал: короткий фрагмент стихотворения 1955 года.</p></div>'+
      '<div class="portal-translation"><span class="portal-lang">02 / РУССКИЙ ПОДСТРОЧНИК</span><p class="portal-poem">Родная земля! Если бы я<br>больше тебя не увидел,<br>от горя я бы ослеп.</p><p class="portal-footnote">Предварительный подстрочник, не литературный перевод. Требует редакционной сверки.</p></div>'+
      '<aside class="portal-margins" id="portal-margins"><span class="portal-lang">НА ПОЛЯХ</span><h3>За каждой строкой — время.</h3><p>Стихотворение опубликовано с датировкой 1955 годом — периодом изгнания балкарского народа.</p>'+
      '<div class="portal-reader-note"><label for="portal-note-input">Ваша заметка</label><textarea id="portal-note-input" rows="4" maxlength="800" placeholder="Что вам запомнилось?"></textarea><button type="button" id="portal-note-save">Сохранить заметку ↗</button><small id="portal-note-status" role="status">Заметка хранится только в вашем браузере.</small></div></aside></div>'+
      '<div class="portal-reader-source">'+external(source.poem,'Открыть текст в источнике')+'</div></div>';
  }
  function timelineMarkup(){
    return '<div class="portal-timeline">'+moments.map((m,i)=>
      '<div class="portal-timeline-item"><span class="portal-timeline-year">'+m.year+'</span><div><span class="portal-overline">'+String(i+1).padStart(2,'0')+' / ЭПОХА</span><h3>'+m.title+'</h3><p>'+m.text+'</p></div></div>').join('')+'</div>';
  }
  function detailText(section,title,kickerText,body,extra){
    return '<div class="portal-detail-top">'+crumb(section,title)+'<div class="portal-detail-intro"><span class="portal-overline">'+kickerText+'</span><h1>'+title+'</h1><p>'+body+'</p></div></div>'+
    '<div class="portal-body">'+extra+'</div>';
  }
  function lifeDetail(kind){
    const s=sections[0];
    if(kind==='chronology') return detailText(s,'Хронология','ГОДЫ И СОБЫТИЯ','Вехи биографии Керима Отарова, связанные с историей балкарской литературы.',timelineMarkup()+'<div class="portal-editorial"><span>ИСТОЧНИК</span>'+external(source.life,'Биографические материалы')+'</div>');
    if(kind==='places')return detailText(s,'География жизни','МЕСТА И ПАМЯТЬ','География поэта — от родного горного аула до мест изгнания и возвращения.',chapter([
      {path:'memory/places',title:'Гюрхожан',desc:'Родной аул у подножия Эльбруса'},
      {path:'memory/places',title:'Киргизия',desc:'Годы депортации балкарского народа'},
      {path:'memory/places',title:'Нальчик',desc:'Возвращение и литературная жизнь'}
    ])+'<div class="portal-editorial"><span>УТОЧНЕНИЕ</span><p>Точные адреса мемориальных объектов публикуются только после документальной проверки.</p></div>');
    if(kind==='family')return detailText(s,'Семья и окружение','ЛЮДИ РЯДОМ','Документы о семье, современниках и литературном круге требуют сверки с архивными свидетельствами.',
      '<div class="portal-paper-panel"><span class="portal-overline">ФОРМИРУЕМ КОЛЛЕКЦИЮ</span><h2>Лица, голоса, <i>истории.</i></h2><p>В этом разделе будут семейные фотографии, воспоминания близких и материалы об окружении поэта. Непроверенные сведения не публикуются.</p>'+external(source.book,'Биографическое издание')+'</div>');
    return notFound();
  }
  function mediaLanding(){
    const s=sections[2];
    return pageIntro(s,'Голос <i>остаётся.</i>','Услышать интонацию. Рассмотреть фотографию. Вернуться к живому присутствию поэта.',true)+
      '<div class="portal-body"><div class="portal-media-feature"><div><span class="portal-overline">АРХИВНАЯ ФОНОТЕКА</span><h2>Слова, у которых<br><i>есть голос.</i></h2><p>Подлинные аудиозаписи будут доступны после получения архивных файлов и проверки прав. Пока раздел открыт как каталог.</p>'+link('media/author','Голос автора')+'</div><div class="portal-audio-art"><span>ОТАРЛАНЫ КЕРИМ</span><div class="portal-record"><div></div></div><span>АУДИОАРХИВ / ОЖИДАЕТ ОЦИФРОВКИ</span></div></div>'+
      '<div class="portal-section-caption"><span>КОЛЛЕКЦИИ</span><span>04 РАЗДЕЛА</span></div>'+chapter([
        {path:'media/author',title:'Голос автора',desc:'Авторские чтения · архив формируется'},
        {path:'media/readers',title:'Современные чтения',desc:'Исполнения произведений · записи ожидаются'},
        {path:'media/photos',title:'Фотоархив',desc:'Портреты, свидетельства, снимки'},
        {path:'media/video',title:'Видео',desc:'Документальное кино и встречи'}
      ])+'</div>';
  }
  function mediaDetail(kind){
    const s=sections[2];
    const data={
      author:['Голос автора','ЗВУКОВОЙ АРХИВ','Записи стихов в исполнении Керима Отарова. Архивные файлы пока не загружены.'],
      readers:['Современные чтения','АУДИОБИБЛИОТЕКА','Произведения поэта в исполнении современных чтецов. Коллекция ожидает материалы.'],
      photos:['Фотоархив','ВИЗУАЛЬНАЯ ПАМЯТЬ','Подтверждённый архивный портрет из публикации «Кабардино-Балкарской правды».'],
      video:['Видеоархив','КИНО И ДОКУМЕНТЫ','Материалы о поэте, записи выступлений и документальные фильмы будут добавлены после проверки источников.']
    }[kind];if(!data)return notFound();
    return detailText(s,data[0],data[1],data[2],(kind==='photos'?
      '<div class="portal-photo-detail"><figure><img src="'+portrait+'" alt="Архивный портрет Керима Отарова"><figcaption>Керим Отаров · архивный снимок</figcaption></figure><div><span class="portal-overline">ПЕРВЫЙ ЭКСПОНАТ</span><h2>Один портрет.<br><i>Целая эпоха.</i></h2><p>Фотография опубликована в материале о Кериме Отарове. Другие изображения появятся после проверки происхождения и разрешений.</p>'+external(source.news,'Источник фотографии')+'</div></div>':
      '<div class="portal-paper-panel"><span class="portal-overline">АРХИВ ПОПОЛНЯЕТСЯ</span><h2>Сохранить<br><i>подлинное.</i></h2><p>Здесь нет имитации воспроизведения: пока реальные файлы не предоставлены, плеер не показывается.</p>'+link('media','Другие коллекции')+'</div>'));
  }
  function memoryLanding(){
    const s=sections[3];
    return pageIntro(s,'Память <i>живёт.</i>','Не только в книгах — в местах, рассказах и новых исследованиях.',true)+
      '<div class="portal-body"><div class="portal-memory-quote"><span>1912 — 1974</span><p>История поэта принадлежит не только литературе. Она — часть культурной памяти народа.</p></div>'+
      '<div class="portal-section-caption"><span>АРХИВ ПАМЯТИ</span><span>03 НАПРАВЛЕНИЯ</span></div>'+chapter([
       {path:'memory/places',title:'Памятные места',desc:'География и мемориальные объекты'},
       {path:'memory/voices',title:'Воспоминания',desc:'Личные истории и свидетельства'},
       {path:'memory/publications',title:'Публикации о поэте',desc:'Биографии, статьи и исследования'}
      ])+'</div>';
  }
  function memoryDetail(kind){
    const s=sections[3];
    if(kind==='places')return detailText(s,'Памятные места','ГЕОГРАФИЯ ПАМЯТИ','Места, связанные с биографией поэта. Точное положение мемориальных объектов требует архивного подтверждения.',
      '<div class="portal-place-grid"><article><span>01 / РОДИНА</span><h3>Гюрхожан</h3><p>Родной аул поэта у подножия Эльбруса.</p></article><article><span>02 / ИЗГНАНИЕ</span><h3>Киргизия</h3><p>Страна, где поэт прожил годы депортации.</p></article><article><span>03 / ВОЗВРАЩЕНИЕ</span><h3>Нальчик</h3><p>Город, с которым связан послевоенный этап литературной жизни.</p></article></div>'+external(source.life,'Материалы биографии'));
    if(kind==='voices')return detailText(s,'Воспоминания','ЛЮДИ И СВИДЕТЕЛЬСТВА','Место для воспоминаний современников, близких и читателей.',
      '<div class="portal-paper-panel"><span class="portal-overline">АРХИВ СОБИРАЕТСЯ</span><h2>Истории, которые<br><i>нужно услышать.</i></h2><p>До получения проверенных воспоминаний раздел не публикует вымышленных свидетельств.</p></div>');
    if(kind==='publications')return detailText(s,'Публикации','ИССЛЕДОВАНИЯ И СТАТЬИ','Подборка источников, с которых можно начать знакомство с биографией поэта.',
      '<div class="portal-publication-list"><article><span>БИОГРАФИЯ</span><h3>Керим Отаров</h3><p>Материал портала СМИ Кабардино-Балкарии.</p>'+external(source.life,'Читать публикацию')+'</article><article><span>КНИГА</span><h3>Керим Отаров</h3><p>Биографическое издание серии «Жизнь замечательных людей».</p>'+external(source.book,'Об издании')+'</article><article><span>АРХИВНОЕ ФОТО</span><h3>Я свято верил…</h3><p>Публикация «Кабардино-Балкарской правды» с портретом поэта.</p>'+external(source.news,'Читать публикацию')+'</article></div>');
    return notFound();
  }
  function projectLanding(){
    const s=sections[4];
    return pageIntro(s,'Язык <i>будущего.</i>','Наследие становится ближе, когда его можно не только читать, но и исследовать.')+
      '<div class="portal-body"><div class="portal-project-feature"><div><span class="portal-overline">ЦИФРОВАЯ ГУМАНИТАРИСТИКА</span><h2>Читать. Понимать.<br><i>Передавать.</i></h2><p>Инструменты для изучения стихов на карачаево-балкарском языке, поиска значений и работы с переводом.</p>'+link('projects/parallel','Открыть параллельное чтение')+'</div><div class="portal-project-glyph" aria-hidden="true">Тил<span>СЛОВО / ЯЗЫК</span></div></div>'+
      '<div class="portal-section-caption"><span>СПЕЦИАЛЬНЫЕ ПРОЕКТЫ</span><span>03 РАЗДЕЛА</span></div>'+chapter([
        {path:'projects/dictionary',title:'Словарь поэзии',desc:'Значения слов и контекст'},
        {path:'projects/parallel',title:'Параллельное чтение',desc:'Оригинал и пояснение рядом'},
        {path:'projects/education',title:'Образовательные материалы',desc:'Подборки и маршруты чтения'}
      ])+'</div>';
  }
  function projectDetail(kind){
    const s=sections[4];
    if(kind==='dictionary')return detailText(s,'Словарь поэзии','РОДНАЯ РЕЧЬ','Небольшой интерактивный словарь слов, встречающихся в поэтическом мире Керима Отарова.',
      '<div class="portal-dictionary-tool"><div><span class="portal-overline">ВЫБЕРИТЕ СЛОВО</span><div class="portal-word-buttons">'+entries.map((e,i)=>'<button type="button" data-portal-word="'+i+'" class="'+(i===0?'selected':'')+'">'+esc(e.name)+'</button>').join('')+'</div></div><div class="portal-word-preview"><span>КАРАЧАЕВО-БАЛКАРСКИЙ / РУССКИЙ</span><h2 lang="krc" id="portal-word-name">Тау</h2><strong id="portal-word-meaning">Гора</strong><p id="portal-word-note">Одно из ключевых слов горного мира.</p></div></div><div class="portal-editorial"><span>О СЛОВАРЕ</span><p>Это ознакомительные пояснения, не полная лексикографическая база. Значения в контексте конкретных строк требуют сверки.</p></div>');
    if(kind==='parallel')return detailText(s,'Читать на двух языках','ОРИГИНАЛ И ПОДСТРОЧНИК','Сравнивайте язык поэта с пояснительным переводом — не теряя исходного звучания.',
      '<div class="portal-paper-panel"><span class="portal-overline">ПЕРВЫЙ ТЕКСТ</span><h2>Сокъур<br><i>болур эдим.</i></h2><p>Фрагмент произведения 1955 года с пояснением на русском языке и местом для личных заметок.</p>'+link('works/roads','Перейти в читальный зал')+'</div>');
    if(kind==='education')return detailText(s,'Образовательные материалы','УЧИТЬСЯ НАСЛЕДИЮ','Тематические маршруты по стихам, биографии и родному языку.',
      '<div class="portal-chapter-list">'+chapter([{path:'works',title:'Начать с поэзии',desc:'Выбрать текст из библиотеки'},{path:'life/chronology',title:'Увидеть исторический контекст',desc:'Ключевые вехи жизни поэта'},{path:'projects/dictionary',title:'Разобрать слова',desc:'Короткий словарь для читателя'}])+'</div>');
    return notFound();
  }
  function eventLanding(){
    const s=sections[5];
    return pageIntro(s,'Встречи <i>и события.</i>','Календарь литературных мероприятий и отдельные страницы будущих встреч.')+
      '<div class="portal-body"><div class="portal-events-title"><div><span class="portal-overline">АФИША / КАЛЕНДАРЬ</span><h2>Слово объединяет<br><i>людей.</i></h2></div><div class="portal-month-picker"><button id="portal-month-prev" type="button" aria-label="Предыдущий месяц">←</button><span id="portal-month-label"></span><button id="portal-month-next" type="button" aria-label="Следующий месяц">→</button></div></div>'+
      '<div class="portal-event-empty"><span class="portal-overline">АНОНСЫ ОЖИДАЮТСЯ</span><h3>Подтверждённых событий на выбранный месяц нет.</h3><p>Событие появится в афише только после подтверждения даты, организатора и места проведения.</p></div>'+
      '<div class="portal-section-caption"><span>КАК ВЫГЛЯДИТ СТРАНИЦА МЕРОПРИЯТИЯ</span><span>ДЕМОНСТРАЦИЯ</span></div>'+
      chapter([{path:'events/example',title:'Литературный вечер',desc:'Пример карточки мероприятия, не реальный анонс'}])+'</div>';
  }
  function eventDetail(kind){
    if(kind!=='example')return notFound();
    return detailText(sections[5],'Литературный вечер','ПРИМЕР / НЕ АНОНС','Демонстрация структуры будущей страницы события. Дата, место и организатор не указаны, потому что реальной встречи не объявлено.',
      '<div class="portal-paper-panel"><span class="portal-overline">ПРИМЕР СОБЫТИЯ</span><h2>Когда слово<br><i>звучит вслух.</i></h2><p>На реальной странице здесь будут программа, участники, точный адрес, время, организатор и ссылка на регистрацию.</p>'+link('events','Вернуться к афише')+'</div>');
  }
  function notFound(){
    return '<div class="portal-detail-top"><div class="portal-detail-intro"><span class="portal-overline">404 / СТРАНИЦА НЕ НАЙДЕНА</span><h1>Эта страница<br><i>ещё не написана.</i></h1><p>Возможно, адрес изменился. Найдите нужный материал в разделах портала.</p>'+link('','На главную')+'</div></div>';
  }
  function render(path){
    const parts=path.split('/').filter(Boolean);
    const id=parts[0], item=parts[1];
    switch(id){
      case 'life':return item?lifeDetail(item):landingLife();
      case 'works':return item?workDetail(item):landingWorks();
      case 'media':return item?mediaDetail(item):mediaLanding();
      case 'memory':return item?memoryDetail(item):memoryLanding();
      case 'projects':return item?projectDetail(item):projectLanding();
      case 'events':return item?eventDetail(item):eventLanding();
      default:return notFound();
    }
  }
  function route(){return decodeURIComponent(location.hash.replace(/^#\//,'')).replace(/\/+$/,'');}
  let routeLast = null;
  let homeScroll = 0;
  let selectedMonth = new Date(2026,9,1);
  function applyRoute(fromHistory){
    const isPortal=location.hash.startsWith('#/');
    const path=isPortal?route():'';
    if(routeLast===path && (isPortal===doc.body.classList.contains('portal-mode')))return;
    routeLast=path;
    if(!isPortal || !path){
      doc.body.classList.remove('portal-mode');
      view.hidden=true;view.replaceChildren();
      doc.title='Керим Отаров — литературное наследие';
      requestAnimationFrame(()=>window.scrollTo({top:fromHistory?homeScroll:0,behavior:'instant'}));
      setNavigation('');
      return;
    }
    doc.body.classList.add('portal-mode');
    view.hidden=false;
    view.innerHTML=render(path);
    const sec=sections.find(s=>s.id===path.split('/')[0]);
    doc.title=(sec?sec.title:'Страница')+' — Керим Отаров';
    setNavigation(sec?sec.id:'');
    if(path==='events'){selectedMonth=new Date(2026,9,1);updateMonth();}
    if(path==='works/roads')loadNoteState();
    view.focus({preventScroll:true});
    requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));
  }
  function setNavigation(id){
    doc.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(a=>{
      const active=Boolean(id)&&a.getAttribute('href')==='#/'+id;
      if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
  }
  function closeOverlay(){
    const menu=doc.getElementById('mobile-nav');
    const toggle=doc.getElementById('menu-toggle');
    menu.classList.remove('open');menu.inert=true;
    toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');
    doc.body.style.overflow='';
    doc.getElementById('portal-search-panel').classList.remove('open');
    doc.getElementById('portal-search-panel').inert=true;
  }
  function navigate(hash,origin){
    if(!hash.startsWith('#/'))return;
    if(location.hash===hash){closeOverlay();return;}
    if(!doc.body.classList.contains('portal-mode'))homeScroll=window.scrollY;
    const oldCover=origin&&origin.closest('.book-card, .portal-book-card')?.querySelector('.book-cover');
    if(oldCover)oldCover.style.viewTransitionName='selected-book';
    closeOverlay();
    const change=()=>{
      history.pushState({},'',hash);
      applyRoute(false);
    };
    if(doc.startViewTransition&&!reduce.matches){
      const transition=doc.startViewTransition(change);
      transition.finished.finally(()=>{if(oldCover)oldCover.style.removeProperty('view-transition-name');});
    }else{change();if(oldCover)oldCover.style.removeProperty('view-transition-name');}
  }
  const search=doc.createElement('div');
  search.id='portal-search-panel';
  search.className='portal-search-panel';
  search.inert=true;
  search.innerHTML='<div class="portal-search-box" role="dialog" aria-modal="true" aria-label="Поиск по порталу"><div class="portal-search-head"><span>ПОИСК / ЛИТЕРАТУРНЫЙ ПОРТАЛ</span><button type="button" id="portal-search-close" aria-label="Закрыть поиск">✕</button></div><label><span class="sr-only">Поисковый запрос</span><input id="portal-search-input" type="search" placeholder="Поиск по наследию…" autocomplete="off"></label><div class="portal-search-results" id="portal-search-results" aria-live="polite"></div><p>Начните вводить название, имя, тему или раздел.</p></div>';
  doc.body.append(search);
  function searchItems(){
    const items = sections.map(s=>({title:s.title,desc:s.desc,path:s.id}));
    books.forEach(b=>items.push({title:b.title,desc:b.label+' · '+b.desc,path:'works/'+b.id}));
    ['life/chronology|Хронология|Даты и события','life/places|География жизни|Гюрхожан Нальчик Киргизия','memory/publications|Публикации|Биография исследования книга','projects/dictionary|Словарь поэзии|Тау Жюрек Тил Жол','projects/parallel|Параллельное чтение|Сокъур болур эдим'].forEach(x=>{const p=x.split('|');items.push({path:p[0],title:p[1],desc:p[2]});});
    return items;
  }
  const searchIndex=searchItems();
  function renderSearch(){
    const q=doc.getElementById('portal-search-input').value.toLocaleLowerCase('ru').trim();
    const matches=searchIndex.filter(item=>(item.title+' '+item.desc).toLocaleLowerCase('ru').includes(q)).slice(0,9);
    doc.getElementById('portal-search-results').innerHTML=matches.length?matches.map(item=>
      '<a href="#/'+item.path+'"><strong>'+esc(item.title)+'</strong><small>'+esc(item.desc)+'</small><span>↗</span></a>').join(''):'<div class="portal-no-results">Совпадений не найдено.</div>';
  }
  function openSearch(){
    closeOverlay();
    search.classList.add('open');search.inert=false;
    renderSearch();
    doc.getElementById('portal-search-input').focus();
  }
  function updateMonth(){
    const label=doc.getElementById('portal-month-label');if(!label)return;
    label.textContent=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(selectedMonth).replace(' г.','');
  }
  function loadNoteState(){
    const box=doc.getElementById('portal-note-input');
    try{box.value=localStorage.getItem('otarov-portal-note-roads')||'';}catch{}
    try{const saved=localStorage.getItem('otarov-saved-poem')==='true';doc.getElementById('portal-save').setAttribute('aria-pressed',String(saved));doc.getElementById('portal-save').textContent=saved?'Сохранено ✓':'Сохранить ♧';}catch{}
  }
  function readerAction(event){
    const id=event.target.id;
    if(id==='portal-parallel'){
      const pressed=event.target.getAttribute('aria-pressed')!=='true';
      event.target.setAttribute('aria-pressed',String(pressed));
      doc.querySelector('.portal-original').hidden=!pressed;
      doc.getElementById('portal-reader-grid').classList.toggle('solo',!pressed);
    }else if(id==='portal-notes'){
      const pressed=event.target.getAttribute('aria-pressed')!=='true';
      event.target.setAttribute('aria-pressed',String(pressed));
      doc.getElementById('portal-margins').hidden=!pressed;
    }else if(id==='portal-save'){
      const pressed=event.target.getAttribute('aria-pressed')!=='true';
      event.target.setAttribute('aria-pressed',String(pressed));
      event.target.textContent=pressed?'Сохранено ✓':'Сохранить ♧';
      try{localStorage.setItem('otarov-saved-poem',JSON.stringify(pressed));}catch{}
    }else if(id==='portal-note-save'){
      try{localStorage.setItem('otarov-portal-note-roads',doc.getElementById('portal-note-input').value.slice(0,800));doc.getElementById('portal-note-status').textContent='Заметка сохранена на этом устройстве.';}
      catch{doc.getElementById('portal-note-status').textContent='Не удалось сохранить заметку в браузере.';}
    }else if(id==='portal-share'){
      const button=event.target;
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(location.href).then(()=>{button.textContent='Ссылка скопирована ✓';}).catch(()=>{button.textContent='Скопируйте адрес страницы';});}
      else button.textContent='Скопируйте адрес из строки браузера';
    }
  }
  doc.addEventListener('click',function(event){
    const trigger=event.target.closest('[data-book], [data-media]');
    if(trigger){
      event.preventDefault();event.stopImmediatePropagation();
      const path=trigger.dataset.book?'works/'+trigger.dataset.book:'media/'+trigger.dataset.media;
      navigate('#/'+path,trigger);return;
    }
    const anchor=event.target.closest('a[href^="#/"]');
    if(anchor){
      event.preventDefault();event.stopImmediatePropagation();
      navigate(anchor.getAttribute('href'),anchor);return;
    }
    if(event.target.closest('#search-open')){
      event.preventDefault();event.stopImmediatePropagation();openSearch();return;
    }
  },true);
  doc.addEventListener('click',function(event){
    if(event.target.closest('#portal-search-close')||event.target===search){closeOverlay();return;}
    const word=event.target.closest('[data-portal-word]');
    if(word){
      const index=Number(word.dataset.portalWord),item=entries[index];if(!item)return;
      doc.querySelectorAll('[data-portal-word]').forEach(b=>b.classList.toggle('selected',b===word));
      doc.getElementById('portal-word-name').textContent=item.name;
      doc.getElementById('portal-word-meaning').textContent=item.translation;
      doc.getElementById('portal-word-note').textContent=item.note;
    }
    const filter=event.target.closest('[data-portal-filter]');
    if(filter){doc.querySelectorAll('[data-portal-filter]').forEach(b=>{const active=b===filter;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});filterWorks();}
    if(event.target.id==='portal-month-prev'){selectedMonth.setMonth(selectedMonth.getMonth()-1);updateMonth();}
    if(event.target.id==='portal-month-next'){selectedMonth.setMonth(selectedMonth.getMonth()+1);updateMonth();}
    if(event.target.id.startsWith('portal-'))readerAction(event);
  });
  function filterWorks(){
    const field=doc.getElementById('portal-work-search');if(!field)return;
    const q=field.value.trim().toLocaleLowerCase('ru');
    const selected=doc.querySelector('[data-portal-filter].selected')?.dataset.portalFilter||'all';
    let count=0;
    doc.querySelectorAll('.portal-book-card').forEach(card=>{
      const book=books.find(b=>b.id===card.dataset.portalBook);
      const show=Boolean(book)&&(selected==='all'||book.type===selected)&&(book.title+' '+book.desc+' '+book.label).toLocaleLowerCase('ru').includes(q);
      card.hidden=!show;if(show)count++;
    });
    doc.getElementById('portal-work-empty').hidden=count>0;
    doc.getElementById('portal-count').textContent=String(count).padStart(2,'0')+' ЗАПИСИ';
  }
  doc.addEventListener('input',function(event){
    if(event.target.id==='portal-search-input')renderSearch();
    if(event.target.id==='portal-work-search')filterWorks();
  });
  doc.addEventListener('keydown',function(event){
    if(event.key==='Escape'){closeOverlay();}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}
  });
  window.addEventListener('popstate',()=>applyRoute(true));
  window.addEventListener('hashchange',()=>applyRoute(true));
  applyRoute(false);
})();