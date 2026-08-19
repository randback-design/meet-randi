// ── HERO VIDEO ──
function playHeroVideo(){
  const wrap = document.getElementById('heroVideoWrap');
  wrap.style.cursor = 'default';
  wrap.onclick = null;
  wrap.innerHTML = '<iframe src="https://player.vimeo.com/video/1193523729?h=470ebb30d0&badge=0&autopause=0&autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:none;display:block"></iframe>';
}

// ── REFERANSER ──
const referanser = [
  {type:"quote",text:"Jeg har hatt den store gleden av å samarbeide med Randi, som utvikler i VG i 4 år. Randi er faglig sterk, kreativ, produktiv og en særdeles trivelig person å jobbe med. Hun forstår det tekniske innen webutvikling og har derfor vært en meget god samarbeidspartner.",name:"Simen Lysebo",role:"Fullstack-utvikler, TV 2 – Tidligere kollega fra VG"},
  {type:"quote",text:"Randi er en man alltid er glad for å være på lag med, og jeg var så heldig at jeg var med på hennes i tre år i Allente. Snakk om driv og gjennomføringsevne, men også en helt egen evne til å stille opp for kollegaer. Randi deler raust, både av kunnskap, personlighet og omsorg.",name:"Benedicte Norderhaug",role:"Content Producer, Allente – Tidligere kollega i Allente"},
  {type:"quote",text:"Hvis jeg må velge meg én favorittkollega gjennom tidene ... da velger jeg Randi. Åpent, løsningsorientert hode med idésterk, kreativ kraft som alltid leverer over forventet – og en nydelig, omtenksom og varm personlighet som alle bare elsker å jobbe med.",name:"Trine Grann",role:"Tekstforfatter – Tidligere kollega i Allente"},
  {type:"quote",text:"Randi er en person et hvert team bør ha på laget! Hun er løsningsorientert og leverer alltid som planlagt. Hun er god på å se nye muligheter og leverer kreative løsninger som blir lagt merke til! Hun er en lagspiller som bidrar både til å skape resultater og til god stemning på kontoret. 😊",name:"Andreas Hautau",role:"Marketing Manager – Tidligere kollega i Allente"}
];

let refIdx = 0;
function visibleCount(){ return window.innerWidth <= 640 ? 1 : 2; }

function applyRefGridColumns(){
  const track = document.getElementById('refTrack');
  const isMobile = window.innerWidth <= 640;
  track.style.gridTemplateColumns = isMobile
    ? `repeat(${referanser.length},100%)`
    : `repeat(${referanser.length},calc(50% - 8px))`;
}

function buildRefCarousel(){
  const track = document.getElementById('refTrack');
  const isMobile = window.innerWidth <= 640;
  applyRefGridColumns();
  track.innerHTML = referanser.map(r => {
    const txt = (isMobile && r.textMobile) ? r.textMobile : r.text;
    const inner = r.type === 'quote'
      ? `<div class="quote-card"><div class="quote-mark">"</div><div class="quote-text">${txt}</div><div class="quote-footer"><div><div class="quote-name">${r.name}</div><div class="quote-role">${r.role}</div></div></div></div>`
      : `<div class="video-card"><iframe src="${r.vimeoUrl}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe><div class="video-card-footer"><div class="video-card-name">${r.name}</div><div class="video-card-role">${r.role}</div></div></div>`;
    return `<div class="ref-slide">${inner}</div>`;
  }).join('');
  renderRefDots();
  track.addEventListener('scroll', onRefScroll, {passive:true});
}

function renderRefDots(){
  const vc = visibleCount();
  const pages = Math.max(1, Math.ceil(referanser.length / vc));
  const activePage = Math.floor(refIdx / vc);
  document.getElementById('refDots').innerHTML = Array.from({length:pages}).map((_,i) =>
    `<button class="car-nav-dot${i===activePage?' active':''}" onclick="goRef(${i*vc})"></button>`
  ).join('');
}

function maxRefIdx(){
  const vc = visibleCount();
  return Math.max(0, referanser.length - vc);
}

function onRefScroll(){
  const track = document.getElementById('refTrack');
  const vc = visibleCount();
  const slideW = track.scrollWidth / referanser.length;
  const idx = Math.round(track.scrollLeft / (slideW * vc)) * vc;
  if(idx !== refIdx){ refIdx = Math.min(idx, maxRefIdx()); renderRefDots(); }
}

function goRef(i){
  refIdx = Math.max(0, Math.min(i, maxRefIdx()));
  const track = document.getElementById('refTrack');
  const vc = visibleCount();
  const slideW = track.scrollWidth / referanser.length;
  track.scrollTo({left: refIdx * slideW, behavior:'smooth'});
  renderRefDots();
}
function stepRef(dir){ goRef(refIdx + dir*visibleCount()); }

// ── HATT-KARUSELL ──
let hattIdx = 0;
const hattCount = 5;
function buildHattNav(){
  const dotsEl = document.getElementById('hattDots');
  if(!dotsEl) return;
  dotsEl.innerHTML = Array.from({length:hattCount}).map((_,i) =>
    `<button class="car-nav-dot${i===0?' active':''}" onclick="goHatt(${i})"></button>`
  ).join('');
}
function goHatt(idx){
  hattIdx = idx;
  const scroll = document.getElementById('hattScroll');
  if(!scroll) return;
  const imgW = scroll.querySelector('img').offsetWidth + 24;
  scroll.scrollTo({left: idx * imgW, behavior:'smooth'});
  document.querySelectorAll('#hattDots .car-nav-dot').forEach((d,i) => d.classList.toggle('active', i===idx));
}
function stepHatt(dir){
  goHatt((hattIdx + dir + hattCount) % hattCount);
}
// Sync prikker ved manuell scroll
(function(){
  const s = document.getElementById('hattScroll');
  if(s) s.addEventListener('scroll', ()=>{
    const imgW = s.querySelector('img') ? s.querySelector('img').offsetWidth + 24 : 1;
    const idx = Math.round(s.scrollLeft / imgW);
    if(idx !== hattIdx){ hattIdx=idx; document.querySelectorAll('#hattDots .car-nav-dot').forEach((d,i)=>d.classList.toggle('active',i===idx)); }
  }, {passive:true});
})();
buildHattNav();

window.addEventListener('resize', () => { refIdx = 0; renderRefDots(); buildRefCarousel(); });

// ── VIDEO CAROUSEL (FAQ) ──
const carState = {};
function makeCarousel(items, id){
  carState[id] = {total:items.length, current:0};
  const slides = items.map(item => {
    const hash = item.vimeoHash ? `&h=${item.vimeoHash}` : '';
    if(item.type==='video') return `<div class="carousel-slide"><iframe src="https://player.vimeo.com/video/${item.vimeoId}?${hash}&badge=0&autopause=0&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    if(item.type==='image') return `<div class="carousel-slide"><img src="${item.src}" alt="${item.label||''}"></div>`;
    return `<div class="carousel-slide"><div style="width:100%;height:100%;background:var(--t3);display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--t2)">${item.label||''}</div></div>`;
  }).join('');
  const dots = items.map((_,i) => `<button class="car-nav-dot${i===0?' active':''}" onclick="goSlide('${id}',${i})" aria-label="Side ${i+1}"></button>`).join('');
  const arrows = items.length > 1 ? `
    <button class="carousel-arrow carousel-arrow-left" onclick="stepSlide('${id}',-1)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button class="carousel-arrow carousel-arrow-right" onclick="stepSlide('${id}',1)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` : '';
  const nav = items.length > 1 ? `<div class="car-nav">
    <button class="car-nav-btn" onclick="stepSlide('${id}',-1)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <div class="car-nav-dots" id="${id}dots">${dots}</div>
    <button class="car-nav-btn" onclick="stepSlide('${id}',1)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  </div>` : '';
  return `<div class="carousel-wrap"><div class="carousel" id="${id}"><div class="carousel-track" id="${id}track">${slides}</div>${arrows}</div>${nav}</div>`;
}
function goSlide(id,idx){
  carState[id].current=idx;
  document.getElementById(id+'track').style.transform=`translateX(-${idx*100}%)`;
  document.querySelectorAll(`#${id}dots .car-nav-dot`).forEach((d,i)=>d.classList.toggle('active',i===idx));
}
function stepSlide(id,dir){ const s=carState[id]; goSlide(id,(s.current+dir+s.total)%s.total); }

function addSwipe(el, onLeft, onRight){
  let sx=0;
  el.addEventListener('touchstart', e=>{ sx=e.touches[0].clientX; }, {passive:true});
  el.addEventListener('touchend', e=>{
    const dx = e.changedTouches[0].clientX - sx;
    if(Math.abs(dx)>40){ dx<0 ? onLeft() : onRight(); }
  }, {passive:true});
}
function initSwipe(){
  Object.keys(carState).forEach(id=>{
    const el = document.getElementById(id);
    if(el) addSwipe(el, ()=>stepSlide(id,1), ()=>stepSlide(id,-1));
  });
}

// ── FAQ ──
const mainQA = [
  {q:"Så... hvem er du da?", type:"video", text:"Jeg er Randi – grafisk designer og innholdsprodusent med 20 års erfaring fra mediebransjen, og en bred kompetanse innen visuell og tekstlig kommunikasjon. Jeg liker å lage innhold som faktisk blir lagt merke til (og brukt), og jeg er også veldig glad i å skrive.<br><br>Dessuten er jeg kreativ, strukturert og glad i tempo og mange baller i luften. Og så er jeg mamma, kjæreste og hundeeier. Mer om meg i denne animasjonsfilmen jeg har laget:", media:[{type:"video",vimeoId:"1187345684",vimeoHash:"f8b46e121d"}]},
  {q:"Hvorfor søker du på denne jobben?", type:"text", text:"Å få jobbe med å fortelle historiene bak et fagmiljø som redder liv hver eneste dag, er noe jeg synes høres dypt meningsfullt ut. Jeg har alltid vært opptatt av hvordan godt innhold kan gjøre kompliserte temaer forståelige og engasjerende, og jeg liker godt tanken på å jobbe tett med fagfolk for å finne og formidle de gode historiene – fra forskning og innovasjon til enkeltmenneskers møte med akuttmedisin.<br><br>Jeg trives med bredden rollen legger opp til: artikler, nettsider, sosiale medier, og muligheten til å bidra inn i noe så spennende som en fagpodkast. Kombinasjonen av redaksjonelt arbeid og kommunikasjonsrådgivning er akkurat den typen variasjon jeg liker best.", media:[]},
  {q:"Få høre litt om innhold du har produsert da!", type:"text", text:"Jeg har produsert innhold for mange ulike målgrupper gjennom de siste 20 årene, men målet har alltid vært det samme: å få folk til å stoppe opp, lese, klikke eller komme tilbake.<br><br>I Egmont var jeg nettredaktør for Julia og jobbet også med donald.no. Jeg skrev artikler, laget quizzer og konkurranser, modererte forum og utviklet innhold for barn og unge. Mye av jobben handlet om å finne riktig tone for målgruppen, og skrive tekster som faktisk ble lest til siste ord.<br><br>I VG jobbet jeg i et in-house-byrå, der vi utviklet kreative annonsekonsepter med animasjoner, spill og interaktive løsninger.<br><br>I Allente produserte jeg blant annet landingssider, nyhetsbrev, innhold til sosiale medier og video, og jobbet mye med A/B-testing for å finne de løsningene som fungerte best.", media:[]},
  {q:"Hva mener du er det viktigste du kan bidra med hos oss?", type:"text", text:"Jeg tror det viktigste jeg kan bidra med er evnen til å ta et komplisert tema og gjøre det forståelig og engasjerende, uten å miste presisjonen – noe jeg vet er avgjørende når man formidler fagstoff innen akuttmedisin. Å finne riktig tone og de riktige ordene for en sak er noe jeg bruker mye tid på.<br><br>Jeg har bred erfaring med innholdsproduksjon, som gjør at jeg kan se helheten og produsere mye selv: skrive, redigere bilder og video, og bidra på tvers av flater og formater – fra kortere SoMe-innhold til lengre artikler.<br><br>Jeg er strukturert og vant til å levere på flere prosjekter samtidig, og jeg liker godt å samarbeide tett med fagpersoner for å sikre at innholdet er både engasjerende og faglig korrekt.", media:[]},
  {q:"Har du erfaring med foto, video eller podkast?", type:"text", text:"Video har jeg god erfaring med – jeg klipper selv, og har blant annet ansvar for video- og fotoproduksjon til Trollskogen teater, der jeg dokumenterer og lager innhold rundt hver forestilling. Jeg er også vant til å jobbe i Adobe Premiere og After Effects.<br><br>Podkast har jeg ikke produsert selv ennå, men jeg er nysgjerrig og lærer raskt nye systemer og arbeidsflyter. Jeg tenker at researcharbeidet og historiejakten bak en episode – å finne den gode vinkelen og de rette kildene – ligner mye på det jeg allerede gjør i annen innholdsproduksjon, så det kunne vært spennende å sette meg mer inn i det tekniske rundt lyd.", media:[]},
  {q:"Hvordan er erfaringen din med pressearbeid?", type:"text", text:"Jeg har begrenset erfaring med direkte pressekontakt, men har samarbeidet tett med en rekke eksterne partnere og levert kommunikasjonsmateriell til flere flater og kampanjer. Jeg er komfortabel med å ta kontakt med mennesker, enten det er på telefon eller e-post, og ser på relasjonsbygging som en naturlig del av kommunikasjonsarbeidet – noe jeg gjerne vil bygge videre på i denne rollen.", media:[]},
  {q:"Hvilke programmer jobber du i?", type:"text", text:"Jeg jobber i de fleste av de store programmene i Adobe CC: Photoshop, InDesign, Illustrator, Premiere og After Effects. Mer om dette ser dere i en egen blokk lengre ned på denne siden.<br><br>Jeg er også glad i å lære nye programmer og verktøy, og har bidratt til å implementere både Monday.com (prosjektstyring) og Bannerflow (annonseproduksjon) på min siste arbeidsplass.", media:[]},
  {q:"Når kan du eventuelt starte i ny jobb?", type:"text", text:"Jeg er fleksibel og kan starte på kort varsel.<br><br>Etter en større nedbemanning i Allente er jeg nå på jakt etter nye utfordringer. I mellomtiden fyller jeg dagene med å lære nye ting, blant annet AI og animasjon. Har dere lyst til å se en arbeidsprøve på noe spesielt, lager jeg gjerne det.", media:[]},
  {q:"Hvordan kontakter vi deg?", type:"text", text:"Ring meg på 97 72 03 15, eller send en mail til backmarkrandi@gmail.com", media:[]}
];

const typeIcons = {
  video: `<div class="faq-type-icon"><svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7" fill="#409f89" stroke="none"/><rect x="1" y="5" width="15" height="14" rx="2" fill="#409f89" stroke="none"/></svg></div>`,
  text:  `<div class="faq-type-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg></div>`
};

function buildFaq(){
  const list = document.getElementById('faqList');
  list.innerHTML = mainQA.map(item => {
    const cid = 'c'+Math.random().toString(36).slice(2,7);
    let content = `<div class="faq-a-inner">${item.text||''}`;
    if(item.media && item.media.length) content += makeCarousel(item.media, cid);
    content += '</div>';
    return `<div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">
        <div class="faq-q-left">${typeIcons[item.type]||''}<span class="faq-q-text">${item.q}</span></div>
        <div class="faq-chevron"><svg viewBox="0 0 12 12"><path d="M2 4l4 4 4-4"/></svg></div>
      </div>
      <div class="faq-a">${content}</div>
    </div>`;
  }).join('');
}
function toggleFaq(btn){ btn.parentElement.classList.toggle('open') }

// ── PORTEFØLJE ──
const portfolioCases = [
  {
    tag: "Video",
    title: "Showcase video – Allente",
    desc: "Video for inspirasjon og deling av resultater etter gjennomført kampanje med nytt konsept.",
    problem: "I Allente hadde vi kjørt kampanje med nytt konsept – King of Entertainment. For å dele de gode resultatene ble jeg bedt om å lage en presentasjonsvideo som viste bredden av innhold, sammen med viktig info som skulle være lett å huske.<br><br>(Denne videoen skal ikke deles av hensyn til rettighetshavere, og er satt som «embed only» på Vimeo, slik at den bare vises på denne siden)",
    body: "Jeg klippet hele videoen og la på elementer og musikk.",
    results: ["Videoredigering","Deling av resultater","Premiere Pro"],
    chips: ["Video","Historiefortelling"],
    mediaType: "vimeo",
    mediaSrc: "https://player.vimeo.com/video/1208066919?badge=0&autopause=0&title=0&byline=0&portrait=0",
    thumbBg: "#e3f4f0",
    thumbImg: "/portfolio/video/Showcase.jpg"
  },
  {
    tag: "Visuell profil",
    title: "Merkevarebygging – Allente",
    desc: "Da Canal Digital og Viasat slo seg sammen og ble Allente, begynte en stor jobb med å bygge et helt nytt brand.",
    problem: "Da Allente ble lansert i 2020, måtte vi i markedsavdelingen bygge kjennskap til et helt nytt brand. Hvordan få folk til å skjønne at Canal Digital og Viasat nå er Allente?",
    body: "Jeg jobbet som en av flere grafiske designere i markedsavdelingen gjennom hele merkevarebyggingen – og omsatte den nye visuelle profilen som ble til i tett samarbeid med byrå, til kampanjer, SoMe, nyhetsbrev, landingssider og partnermateriell. Det tok tid, prøving og justering, men i dag står Allente sterkt i markedet, som en av de store aktørene innen TV-distribusjon.",
    results: ["Bidro til konsistent visuelt uttrykk på tvers av alle kanaler","Bygget opp maler og systemer som team bruker den dag i dag"],
    chips: ["InDesign","Photoshop","Illustrator","SoMe","Kampanje"],
    mediaType: "multi",
    media: [
      {type:"image", src:"/portfolio/allente/Allente1.png", label:"Allente 1"},
      {type:"image", src:"/portfolio/allente/Allente2.jpg", label:"Allente 2"},
      {type:"image", src:"/portfolio/allente/Allente3.jpg", label:"Allente 3"},
      {type:"image", src:"/portfolio/allente/Allente4.jpg", label:"Allente 4"},
      {type:"image", src:"/portfolio/allente/Allente5.png", label:"Allente 5"},
      {type:"image", src:"/portfolio/allente/Allente6.jpg", label:"Allente 6"},
      {type:"image", src:"/portfolio/allente/Allente7.jpg", label:"Allente 7"},
      {type:"image", src:"/portfolio/allente/Allente8.jpg", label:"Allente 8"},
      {type:"image", src:"/portfolio/allente/Allente9.png", label:"Allente 9"},
      {type:"image", src:"/portfolio/allente/Allente10.jpg", label:"Allente 10"}
    ],
    thumbBg: "#b8e5d9",
    thumbImg: "/portfolio/allente/Allente_thumb.jpg"
  },
  {
    tag: "PR og markedsføring",
    title: "PR for teater – Trollskogen",
    desc: "Jeg engasjerer meg veldig i Trollskogen teater, der jeg har to barn som spiller, og lager alt av grafisk materiell.",
    problem: "Trollskogen teater har eksistert i over 40 år, og ble startet av «Trollmor» Mona Danielsen, som har mottatt både Kongens Fortjenstmedalje og Børreprisen for sitt arbeid med barneteater. For hver forestilling som settes opp, forsøker vi å fylle teatersalen med folk – og til det trengs det mye arbeid med markedsføringen, noe jeg bidrar sterkt til.",
    body: "For Trollskogen teater lager jeg så å si alt det grafiske i forbindelse med hver nye forestilling; plakater, flyers, SoMe-innhold, programmer, annonser, fotografering.",
    results: ["Helhetlig grafisk uttrykk","Sterkt bidrag til billettsalg","Ofte fulle saler på forestilling"],
    chips: ["Teater","Markedsføring","Fotografering","PR"],
    mediaType: "multi",
    media: [
      {type:"image", src:"/portfolio/teater/Peter_Pan.jpg", label:"Peter Pan"},
      {type:"image", src:"/portfolio/teater/Peter_Pan_980x300px.jpg", label:"Peter Pan banner"},
      {type:"image", src:"/portfolio/teater/Peter_pan_barn.JPG", label:"Peter Pan – barn"},
      {type:"image", src:"/portfolio/teater/Fortapte_gutter.jpg", label:"Fortapte gutter"},
      {type:"image", src:"/portfolio/teater/Bukk.JPG", label:"Bukkene Bruse"},
      {type:"image", src:"/portfolio/teater/PR.JPG", label:"PR-arbeid"},
      {type:"image", src:"/portfolio/teater/Fotografering.jpeg", label:"Fotografering"},
      {type:"image", src:"/portfolio/teater/Plakater.jpg", label:"Plakater"},
      {type:"image", src:"/portfolio/teater/Alladin_Earlybird_Insta.jpg", label:"Aladdin Earlybird"},
      {type:"image", src:"/portfolio/teater/Programmer.png", label:"Programmer"},
      {type:"image", src:"/portfolio/teater/ULVEN_Trollskogen_teater_skjermer_1920x1080.jpg", label:"Skjermvisning"}
    ],
    thumbBg: "#e3f4f0",
    thumbImg: "/portfolio/teater/Peter_Pan_thumb.jpg"
  }
];

function buildPortfolio(){
  const grid = document.getElementById('portfolioGrid');
  grid.innerHTML = portfolioCases.map((c,i) => {
    let thumb = '';
    if(c.thumbImg){
      thumb = `<img src="${c.thumbImg}" alt="${c.title}">`;
    } else if(c.mediaType==='vimeo'){
      thumb = `<div class="portfolio-thumb-placeholder" style="background:${c.thumbBg}"><svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg><span>${c.tag}</span></div>`;
    } else {
      thumb = `<div class="portfolio-thumb-placeholder" style="background:${c.thumbBg}"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>${c.tag}</span></div>`;
    }
    return `<div class="portfolio-card" onclick="openModal(${i})">
      <div class="portfolio-thumb">
        ${thumb}
      </div>
      <div class="portfolio-body">
        <div class="portfolio-title">${c.title}</div>
        <div class="portfolio-desc">${c.desc}</div>
        <span class="portfolio-see-more">Se mer</span>
      </div>
    </div>`;
  }).join('');
  buildPortfolioNav();
}

// ── PORTEFØLJE-KARUSELL (mobil) ──
let portfolioIdx = 0;
function buildPortfolioNav(){
  const dotsEl = document.getElementById('portfolioDots');
  if(!dotsEl) return;
  dotsEl.innerHTML = portfolioCases.map((_,i) =>
    `<button class="car-nav-dot${i===0?' active':''}" onclick="goPortfolio(${i})"></button>`
  ).join('');
  portfolioIdx = 0;
}
function goPortfolio(idx){
  portfolioIdx = Math.max(0, Math.min(idx, portfolioCases.length-1));
  const grid = document.getElementById('portfolioGrid');
  const card = grid.querySelector('.portfolio-card');
  if(!card) return;
  const cardW = card.offsetWidth + 16;
  grid.scrollTo({left: portfolioIdx * cardW, behavior:'smooth'});
  document.querySelectorAll('#portfolioDots .car-nav-dot').forEach((d,i) => d.classList.toggle('active', i===portfolioIdx));
}
function stepPortfolio(dir){
  goPortfolio((portfolioIdx + dir + portfolioCases.length) % portfolioCases.length);
}
(function(){
  const grid = document.getElementById('portfolioGrid');
  if(!grid) return;
  grid.addEventListener('scroll', ()=>{
    const card = grid.querySelector('.portfolio-card');
    const cardW = card ? card.offsetWidth + 16 : 1;
    const idx = Math.round(grid.scrollLeft / cardW);
    if(idx !== portfolioIdx){ portfolioIdx=idx; document.querySelectorAll('#portfolioDots .car-nav-dot').forEach((d,i)=>d.classList.toggle('active',i===idx)); }
  }, {passive:true});
})();

let modalCarIdx = 0;
function openModal(i){
  const c = portfolioCases[i];
  let mediaHtml = '';
  if(c.mediaType === 'multi' && c.media && c.media.length > 1){
    modalCarIdx = 0;
    const slides = c.media.map(m => {
      let inner = '';
      if(m.type==='vimeo')      inner = `<iframe src="${m.src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      else if(m.type==='image') inner = `<img src="${m.src}" alt="${m.label||''}">`;
      else                      inner = `<div class="placeholder-slide" style="background:${m.bg||'var(--t3)'}">${m.label||'Bilde/video kommer'}</div>`;
      return `<div class="modal-carousel-slide${m.type==='vimeo'?' video-slide':''}${m.portrait?' portrait-video':''}">${inner}</div>`;
    }).join('');
    const dots = c.media.map((_,si) => `<button class="car-nav-dot${si===0?' active':''}" onclick="goModalSlide(${si})" aria-label="Side ${si+1}"></button>`).join('');
    mediaHtml = `<div class="modal-carousel-wrap">
      <div class="modal-carousel-track-outer">
        <div class="modal-carousel-track-clip">
          <div class="modal-carousel-track" id="modalCarTrack">${slides}</div>
        </div>
      </div>
      <div class="car-nav">
        <button class="car-nav-btn" onclick="stepModalSlide(-1)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="car-nav-dots" id="modalCarDots">${dots}</div>
        <button class="car-nav-btn" onclick="stepModalSlide(1)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
    </div>`;
  } else if(c.mediaType==='vimeo'){
    mediaHtml = `<div class="modal-media" style="aspect-ratio:16/9;background:var(--bg);border-radius:12px;overflow:hidden;margin-bottom:24px"><iframe src="${c.mediaSrc}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:none"></iframe></div>`;
  } else {
    mediaHtml = `<div class="modal-media" style="aspect-ratio:16/9;background:${c.thumbBg};border-radius:12px;overflow:hidden;margin-bottom:24px;display:flex;align-items:center;justify-content:center"><span style="font-size:13px;color:var(--t2);letter-spacing:.1em;text-transform:uppercase">Bilde / video kommer</span></div>`;
  }

  document.getElementById('modalContent').innerHTML = `
    ${mediaHtml}
    <div class="modal-tag">${c.tag}</div>
    <div class="modal-title">${c.title}</div>
    <div class="modal-problem"><div class="modal-problem-label">Utfordringen</div><div class="modal-problem-text">${c.problem}</div></div>
    <div class="modal-desc">${c.body}</div>
    ${c.results.map(r=>`<div class="modal-result">${r}</div>`).join('')}
    <div class="modal-chips">${c.chips.map(ch=>`<span class="portfolio-chip">${ch}</span>`).join('')}</div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  const mct = document.getElementById('modalCarTrack');
  if(mct) addSwipe(mct.parentElement, ()=>stepModalSlide(1), ()=>stepModalSlide(-1));
}

// ── TEKSTPRØVER ──
const textSamples = [
  {
    tag: "Filmanmeldelser",
    title: "Anmeldelser – Ready Player One & Wonder Park",
    context: "To filmanmeldelser skrevet i en mer resonnerende, personlig tone enn den kommersielle SoMe-teksten – viser en annen side av skrivestilen min.",
    excerpt: "En film signert Steven Spielberg er ofte verdt en kikk. Og her blir man ikke skuffet.",
    channels: [
      {
        label: "Ready Player One (2018)",
        text: "<span class='text-title-lg'>Ready Player One (2018)</span>\n\n<strong>Regissør:</strong> Steven Spielberg | IMDb: 7.5\n\nVirtuell virkelighet. Fremtid. Spill. Retro. Action. Vennskap\n\nEn film signert Steven Spielberg er ofte verdt en kikk. Og her blir man ikke skuffet. Det at handlingen er lagt litt fram i tid, til 2045, og at over halve filmens forløp foregår i en virtuell virkelighet plasserer den i Sci-fi-kategorien. Men vi er et godt stykke fra både Star Wars og X-Men her, altså. I bunn og grunn handler det om spillglede, ekte mennesker og ekte følelser.\n\n<strong>En virtuell virkelighetsflukt</strong>\nDet har ikke gått så bra med verden fram til 2045. Folk bor nå i brakker, det er mye bråk og kriminalitet – i det hele tatt er livet ganske stusslig. Derfor rømmer menneskene så ofte de kan inn i den virtuelle verdenen Oasis, skapt av spill-geniene James Halliday og Ogden Morrow. I Oasis kan man være akkurat den man vil, og det er der man treffer venner, kjøper seg kule ting, og går på diskotek. Halliday var selve hjernen bak spillet. Han var ung på 80-tallet, og har bygget inn drøssevis av referanser fra sin ungdomstid i Oasis. Når den eksentriske grunnleggeren blir syk og dør, testamenterer han livsverket sitt til vinneren av et episk spill i Oasis.\n\n<strong>Jakten på en arvtager</strong>\nEn av dem som lever livet sitt i Oasis, og elsker hver minste bit av spillets univers, er Wade Watts. Han er en foreldreløs ungdom som bor under dårlige kår hos tanten sin og hennes voldelige kjæreste. Han har flere venner i Oasis, og er blant de ivrigste når det gjelder kunnskap om spillet, dets grunnlegger, og 80-talls kultur. Wade, eller Parzival som han kaller seg i Oasis, drømmer selvfølgelig om å bli den som arver Hallidays livsverk. Han tilbringer så mye tid som mulig alene i et skur med VR-brillene og bodysuiten på. Men det er mange som ønsker å bli Oasis nye eier, og slett ikke alle har gode hensikter.\n\n<strong>Proppfull av henvisninger</strong>\nDenne filmen er en actionfylt godtepose for den som liker gamle PC-spill, ikoniske filmer som «The Shining» og «Back to the Future», action og spenning. Det dukker opp kjente filmfigurer som Jernkjempen og King Kong, og spillkarakterer fra klassiske Street Fighter og nyere Overwatch.\n\nDet er ganske tøft egentlig, hvordan denne filmen evner å blande VR og framtidens teknologi, med 80- og 90-tallsklær, Duran Duran, og gamle PC-spill med pixlete grafikk, og få det hele til å framstå så helhetlig. Filmen er også mesterlig produsert, og animasjon, grafikk og ekte bilder er mikset sammen så sømløst at man knapt ofrer overgangene en tanke."
      },
      {
        label: "Wonder Park (2019)",
        text: "<span class='text-title-lg'>Wonder Park (2019)</span>\n\n<strong>Regissør:</strong> Dylan Brown | IMDb: 5.8\n\nAnimasjon. Fantasi. Barndom. Eventyr. Sorg. Følelser\n\nWonder Park ser kanskje ut som en berg-og-dalbane med latter og moro på coveret, men den er så mye mer enn det, og langt fra så lystig som en skulle tro. Fornøyelsesparker har gjerne attraksjoner for både store og små, for den fartsgale, og for den som helst bare vil spise sukkerspinn og se seg rundt. Det samme kan man si om denne filmen. Den treffer godt både hos femåringen, 10-åringen, og mor og far – på ulike plan.\n\n<strong>Ablegøyer, action og alvor</strong>\nJune er en fantasifull, livlig og kreativ jente. Det hun elsker mest her i verden er å leke fornøyelsespark sammen med mammaen sin, som er like full av ideer og påfunn som henne selv. De klipper, limer, monterer og finner på historier. Hele huset er fullt av deres karuseller, boder og vannsklier. Og i Junes hode blir parken og dyrene som driver den sprell levende og helt så ekte som det går an. Men så blir Junes mamma syk. Så alvorlig syk blir hun at hun er nødt til å reise fra June og pappaen i lang tid for å få behandling.\n\n<strong>Vakkert om fantasi og følelser</strong>\nNår mammaen reiser, skjønner den voksne tilskuer at denne filmen ikke bare er en morsom tegnefilm, men at den har en alvorligere undertone. Og det blir mørkere – både i Junes sinn og i fornøyelsesparken. June klarer ikke komme på en eneste ny idé, og en dag pakker hun vekk alle modellene og utklippene som fyller huset. Hun vil passe på pappaen sin isteden. Bekymring og tungsinn har dyttet bort fantasien og skapetrangen. Det hjelper ikke hvor mye barna i gata maser om å bygge berg-og-dalbane i hagen.\n\n<strong>Trøbbel i liksomland</strong>\nUten Junes påfunn går det dårlig med fornøyelsesparken. Den er faktisk i ferd med å bli revet i fillebiter av onde skapninger. Heldigvis oppdager den lille jenta det i siste sekund og får ryddet opp, slik at dette blir en film som ender godt på alle vis.\n\nFor de minste barna er dette kanskje bare en film som er morsom og spennende, men de litt større vil nok også få med seg budskapet; følelsene våre virker inn på alt, og noen ganger må man selv gå grundig til verks for å få finne igjen gleden når livet byr på utfordringer."
      }
    ]
  },
  {
    tag: "Barnematmerkevare (case)",
    title: "Lanseringstekst – bakemikser",
    context: "Skrevet som del av en kreativ case-oppgave for en anonymisert barnematmerkevare, i forbindelse med lansering av en ny produktlinje.",
    excerpt: "Vi vokser! Og det har jo vært planen hele veien. 🌱",
    channels: [
      {
        label: "LinkedIn",
        text: "Vi vokser! Og det har jo vært planen hele veien. 🌱\n\nVi vil være det sunne, økologiske og allergivennlige alternativet i barnemathylla – med produkter laget av rene råvarer og ingredienser man faktisk kjenner igjen.\n\nSamtidig håper vi å inspirere flere til å tenke litt annerledes om barnemat. Derfor deler vi også oppskrifter, tips og kunnskap underveis.\n\nOg nå har det kommet noe nytt i hylla fra oss 👀\n\nNemlig bakemikser! De fås i de fleste dagligvarebutikker, samt hos utvalgte nettbutikker.\n\nMed bare 2–3 ekstra ingredienser hjemme kan du lage sunn og smakfull bakst på under 30 minutter. Enklere for de voksne, skikkelig godt for mini – og perfekt både til frokost, matpakke og fest. 🎉"
      },
      {
        label: "Nyhetsbrev (før lansering)",
        text: "<strong>Sunne, velsmakede nyheter på vei!</strong>\n\nDu kan tro vi gleder oss til noe som skal skje om bare noen få uker … Da lanserer vi nemlig en helt ny produktserie i barnemathylla!\n\nKan du gjette hva det er? 🔍🤗\n\nVi ville holdt et øye med innboksen framover, om vi var deg. Kanskje feirer vi nyheten med en konkurranse?"
      },
      {
        label: "Nyhetsbrev (etter lansering)",
        text: "<strong>Noen nyheter er så bra at de fortjener konfetti! 🎉</strong>\n\nEndelig kan vi slippe katta ut av sekken … eller rettere sagt bakemiksen ut av posen!\n\nNå er våre sunne, velsmakende og festlige nyheter å finne i barnemathylla, og du kan lage havremuffins, speltvafler og grøtpinner til mini (og resten av familien) på rekordtid.\n\nPosene er like fargerike og glade som alle våre andre produkter – og selvfølgelig like fulle av næring og smak. Du finner dem i de fleste dagligvarebutikker, samt hos utvalgte nettbutikker.\n\nVinn en fest-pakke 🥳\nHar du lyst til å teste bakemiksene, og nyte resultatet mens du har party-hatt på hodet og konfetti i sofaen?\n\nTipp på hvor lang tid det tar fra du åpner en pakke speltvafler til du kan servere den første vaffelplaten, og bli med i trekningen av denne supre fest-pakka.\n\n⚪ Ca 5 minutter ⚪ Ca 25 minutter ⚪ Ca 40 minutter\n\nSvar sendes til oss på e-post. Vi trekker 5 heldige vinnere, som blir kontaktet på e-post 18. september."
      },
      {
        label: "SoMe (korte varianter)",
        text: "<strong>Variant 1</strong>\nEndelig kan vi slippe katta... eller snarere bakemiksen ut av posen! Det er nemlig nyheten vi har gledet oss til å dele; bakemiks for sunn, enkel og ikke minst velsmakende snacks til de små (og store)\n\n<strong>Variant 2</strong>\nEndelig kan vi slippe nyheten! Vi lanserer bakemikser, og snart kan du finne denne freshe pakken med muffinsmiks i barnemathyllen!"
      }
    ]
  },
  {
    tag: "Allente (reell tekst)",
    title: "Allente-stipendet",
    context: "Skrevet i forbindelse med Allente-stipendet, en støtteordning for breddeidrett i Norge. Ikke anonymisert – dette er egne tekster skrevet i jobb hos Allente.",
    excerpt: "De to store TV-distributørene Canal Digital og Viasat Consumer slo seg sammen i fjor, og har blitt til Allente.",
    channels: [
      {
        label: "Programtekst (norsk)",
        text: "<strong>De to store TV-distributørene Canal Digital og Viasat Consumer slo seg sammen i fjor, og har blitt til Allente. All Entertainment. De samler all underholdning på ett sted og tilbyr TV, streaming og bredbånd til over en million mennesker i hele Norden.</strong>\n\nI sommer startet de opp et helt nytt stipend, Allente-stipendet, med formål om å dele ut kjærkomne bidrag til breddeidretten i Norge.\n\nAlle idrettslag og klubber kan søke midler fra stipendet, uavhengig av idrettsgren, alder på utøvere eller funksjonsevne. Et lag drømmer kanskje om en varmepumpe til klubbhuset, et annet trenger nye drakter, eller ønsker å reise sammen på den cupen som vil bli et minne for livet. Behovene i idrettsnorge er mange.\n\nFørste frist for å søke Allente-stipendet var 1. september, og det kom inn massevis av gode søknader. En jury har valgt ut flere gode vinnere og her i (navn på program) vil vi følge opp disse og se hvordan midlene fra Allente vil bidra til å spre litt ekstra idrettsglede rundt om i Norge."
      },
      {
        label: "Intranett (engelsk)",
        text: "<strong>🏀👟ALLENTE-STIPENDET – Update ⚽🎾</strong>\n\nThe six winners of the first round of our new scholarship are now starting to get their projects going. It's so exciting to see! We will keep you posted about how Allente has supported the winners with tournament contributions, sports equipment, team building and even a brand new kitchen in the club house. Amedia is producing content articles and videos about the winners distributed in the local newspapers.\n\nHere's the first winner; Romerike Kyokushin Karateklubb. They had lost a lot of members during the pandemic, and needed some help with the recruiting. 🥋🥋🥋\n\nhttps://www.rb.no/vis/annonse/allente-romerike-karateklubb/"
      }
    ]
  }
];

function buildTextSamples(){
  const grid = document.getElementById('textSampleGrid');
  if(!grid) return;
  grid.innerHTML = textSamples.map((t,i) => `
    <div class="text-sample-card" onclick="openTextModal(${i})">
      <div class="text-sample-tag">${t.tag}</div>
      <div class="text-sample-title">${t.title}</div>
      <div class="text-sample-context">${t.context}</div>
      <div class="text-sample-excerpt"><span class="text-sample-excerpt-inner">${t.excerpt}</span></div>
      <span class="text-sample-see-more">${t.channels.length > 1 ? `Se ${t.channels.length} kanalvarianter` : 'Les hele teksten'}</span>
    </div>
  `).join('');
}

function openTextModal(i){
  const t = textSamples[i];
  let mediaHtml = '';
  if(t.channels.length > 1){
    modalCarIdx = 0;
    const slides = t.channels.map(c =>
      `<div class="modal-carousel-slide text-slide"><div class="text-channel-label">${c.label}</div><div class="text-sample-modal-body">${c.text}</div><div class="scroll-hint hidden"><svg viewBox="0 0 12 12"><path d="M2 4l4 4 4-4"/></svg>Scroll for mer</div></div>`
    ).join('');
    const dots = t.channels.map((_,si) => `<button class="car-nav-dot${si===0?' active':''}" onclick="goModalSlide(${si})" aria-label="Side ${si+1}"></button>`).join('');
    mediaHtml = `<div class="modal-carousel-wrap">
      <div class="modal-carousel-track-outer">
        <div class="modal-carousel-track-clip">
          <div class="modal-carousel-track" id="modalCarTrack">${slides}</div>
        </div>
      </div>
      <div class="car-nav">
        <button class="car-nav-btn" onclick="stepModalSlide(-1)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="car-nav-dots" id="modalCarDots">${dots}</div>
        <button class="car-nav-btn" onclick="stepModalSlide(1)"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
    </div>`;
  } else {
    mediaHtml = `<div class="text-channel-label">${t.channels[0].label}</div><div class="text-sample-modal-body">${t.channels[0].text}</div><div class="scroll-hint hidden"><svg viewBox="0 0 12 12"><path d="M2 4l4 4 4-4"/></svg>Scroll for mer</div>`;
  }
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-tag">${t.tag}</div>
    <div class="modal-title">${t.title}</div>
    <div class="modal-problem"><div class="modal-problem-label">Kontekst</div><div class="modal-problem-text">${t.context}</div></div>
    ${mediaHtml}
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  const mct = document.getElementById('modalCarTrack');
  if(mct) addSwipe(mct.parentElement, ()=>stepModalSlide(1), ()=>stepModalSlide(-1));
  initScrollHints();
}

function initScrollHints(){
  document.querySelectorAll('#modalContent .text-sample-modal-body').forEach(box => {
    const hint = box.nextElementSibling;
    if(!hint || !hint.classList.contains('scroll-hint')) return;
    const update = () => {
      const overflowing = box.scrollHeight > box.clientHeight + 4;
      const atBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 4;
      hint.classList.toggle('hidden', !overflowing || atBottom);
    };
    update();
    box.addEventListener('scroll', update, {passive:true});
  });
}

function goModalSlide(idx){
  modalCarIdx = idx;
  const track = document.getElementById('modalCarTrack');
  if(track) track.style.transform = `translateX(-${idx*100}%)`;
  document.querySelectorAll('#modalCarDots .car-nav-dot').forEach((d,i) => d.classList.toggle('active', i===idx));
}
function stepModalSlide(dir){
  const total = document.querySelectorAll('#modalCarTrack .modal-carousel-slide').length;
  if(total) goModalSlide((modalCarIdx + dir + total) % total);
}
function closeModal(e){ if(e.target===document.getElementById('modalOverlay')) closeModalBtn(); }
function closeModalBtn(){ document.getElementById('modalOverlay').classList.remove('open'); document.body.style.overflow=''; }
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModalBtn(); });

// ── KONTAKTINFO ──
function buildHeroContact(){
  const c = document.getElementById('heroContact');
  if(!c) return;
  const links = [];
  if(SITE_DATA.email)        links.push(`<span class="hero-contact-link"><div class="hero-contact-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>${SITE_DATA.email}</span>`);
  if(SITE_DATA.phone)        links.push(`<span class="hero-contact-link"><div class="hero-contact-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.59 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l1.42-1.42a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>${SITE_DATA.phone}</span>`);
  if(SITE_DATA.linkedin)     links.push(`<a class="hero-contact-link" href="${SITE_DATA.linkedin}" target="_blank"><div class="hero-contact-icon"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></div>LinkedIn</a>`);
  c.innerHTML = links.join('');
}

// ── TIDSLINJE + SKILLS ──
function buildTimeline(){
  document.getElementById('timeline').innerHTML = SITE_DATA.timeline.map(t =>
    `<div class="tl-item fade-in"><div class="tl-dot"></div><div class="tl-year">${t.year}</div><div class="tl-role">${t.role}</div><div class="tl-place">${t.place}</div><div class="tl-desc">${t.desc}</div></div>`
  ).join('');
}
function buildSkills(){
  document.getElementById('skillsGrid').innerHTML = SITE_DATA.skills.map(s =>
    `<div class="skill-row"><div class="skill-name">${s.name}</div><div class="skill-track"><div class="skill-fill" data-p="${s.pct}"></div></div></div>`
  ).join('');
}

// ── INIT ──
buildFaq();
buildHeroContact();
buildTimeline();
buildSkills();
buildPortfolio();
buildTextSamples();
buildRefCarousel();
initSwipe();

(function(){
  const numEl = document.getElementById('ideerTall');
  if(!numEl) return;
  let current = 8, direction = 1;
  function step(){
    current += direction;
    numEl.textContent = current;
    if(current >= 26) direction = -1;
    if(current <= 8)  direction = 1;
    setTimeout(step, 80);
  }
  setTimeout(step, 1500);
})();

const io = new IntersectionObserver(e => e.forEach(x => { if(x.isIntersecting) x.target.classList.add('visible') }), {threshold:.15});
document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
const so = new IntersectionObserver(e => { e.forEach(x => { if(x.isIntersecting){ x.target.querySelectorAll('.skill-fill').forEach(b => b.style.width=b.dataset.p+'%'); so.unobserve(x.target) } }) }, {threshold:.3});
so.observe(document.getElementById('skillsWrap'));
