// ── HERO VIDEO ──
function playHeroVideo(){
  const wrap = document.getElementById('heroVideoWrap');
  wrap.style.cursor = 'default';
  wrap.onclick = null;
  wrap.innerHTML = '<iframe src="https://player.vimeo.com/video/1193523732?h=a78c1b6f57&badge=0&autopause=0&autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:none;display:block"></iframe>';
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
  document.getElementById('hattDots').innerHTML = Array.from({length:hattCount}).map((_,i) =>
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
  {q:"Så... hvem er du da?", type:"video", text:"Jeg er Randi – grafisk designer, og \"markedsperson\" med 20 års erfaring fra mediebransjen, og en bred kompetanse innen visuell kommunikasjon. Jeg liker å lage innhold som faktisk blir lagt merke til (og brukt), og jeg er også veldig glad i å skrive.<br><br>Dessuten er jeg kreativ, sosial, leken og ganske glad i tempo og mange baller i luften – uten at det går på bekostning av mitt behov for god orden, struktur og overblikk. 🎨 ✅<br><br>Og så er jeg mamma, kjæreste, hundeeier og en ivrig konsert- og teatergjenger. 🎵 Mer om meg i denne animasjonsfilmen jeg har laget:", media:[{type:"video",vimeoId:"1187345684",vimeoHash:"f8b46e121d"}]},
  {q:"Hvorfor søker du på denne jobben?", type:"text", text:"WWF er en organisasjon jeg har respektert lenge – dere jobber kunnskapsbasert og målrettet med noen av de viktigste sakene vi har, og det er akkurat den typen arbeid jeg har lyst til å bidra til.<br><br>Jeg har alltid vært opptatt av hvordan godt innhold kan engasjere mennesker og få dem til å bry seg – enten det er tekst, video, illustrasjoner eller digitale opplevelser. Gjennom 20 år i mediebransjen har jeg lært meg å skrive og formidle på måter som treffer ulike målgrupper, og jeg har lyst til å bruke den erfaringen på noe som faktisk gjør en forskjell for natur og klima.<br><br>Jeg liker også tanken på å samarbeide tett med fagfolk – natur- og klimaavdelingen hos dere – for å sikre at innholdet både engasjerer og er faglig korrekt. Det er akkurat den kombinasjonen av kreativitet og presisjon jeg trives best med. Jeg har ikke fagbakgrunn innen klimapolitikk eller naturvern selv, men jeg har oppriktig lyst til å lære mer om dette, dersom jeg er aktuell for denne stillingen.", media:[]},
  {q:"Hva mener du er det viktigste du kan bidra med hos oss?", type:"text", text:"Jeg tror det viktigste jeg kan bidra med er å skrive og formidle gode, engasjerende tekster på tvers av kanaler – sosiale medier, nettsider og annonser – samtidig som jeg har et godt øye for visuelt innhold som støtter opp under budskapet. Å finne riktig tone og de riktige ordene for en sak er noe jeg bruker mye tid på, og jeg liker godt å redigere og finpusse helt til teksten sitter.<br><br>Jeg har bred erfaring med innholdsproduksjon, som gjør at jeg kan se helheten og produsere mye selv: skrive, illustrere, redigere bilder og video, og bidra på tvers av flater og formater.<br><br>Jeg er strukturert og vant til å levere på flere prosjekter samtidig, og jeg liker godt å samarbeide tett med fagpersoner for å sikre at innholdet er både engasjerende og korrekt – noe jeg vet er sentralt i denne rollen.", media:[]},
  {q:"Få høre litt om innhold du har produsert da!", type:"text", text:"Jeg har produsert innhold for mange ulike målgrupper gjennom de siste 20 årene, men målet har alltid vært det samme: å få folk til å stoppe opp, lese, klikke eller komme tilbake.<br><br>I Egmont var jeg nettredaktør for Julia og jobbet også med donald.no. Jeg skrev artikler, laget quizzer og konkurranser, modererte forum og utviklet innhold for barn og unge. Mye av jobben handlet om å finne riktig tone for en ung målgruppe, og skrive tekster som faktisk ble lest til siste ord.<br><br>I VG jobbet jeg i et in-house-byrå, der vi utviklet kreative annonsekonsepter med animasjoner, spill og interaktive løsninger.<br><br>I Allente produserte jeg blant annet landingssider, nyhetsbrev, innhold til sosiale medier og video, og jobbet mye med A/B-testing for å finne de løsningene som fungerte best.", media:[]},
  {q:"Alle snakker om AI. Hva er dine tanker om det?", type:"text", text:"Jeg var skeptisk til AI i starten. De første AI-bildene av folk med seks fingre gjorde meg ikke akkurat overbevist. 😅<br><br>I dag bruker jeg AI hver eneste dag. Det er et verktøy som hjelper meg med idéutvikling, research, korrektur og raske prototyper, slik at jeg kan bruke mer tid på kreativitet og historiefortelling.<br><br>Denne nettsiden er laget med hjelp av Claude, etter mange runder med prompting og finjustering.", media:[]},
  {q:"Hvilke programmer jobber du i?", type:"text", text:"Jeg jobber i de fleste av de store programmene i Adobe CC: Photoshop, InDesign, Illustrator, Premiere og After Effects. Mer om dette ser dere i en egen blokk lengre ned på denne siden.<br><br>Jeg er også glad i å lære nye programmer og verktøy, og har bidratt til å implementere både Monday.com (prosjektstyring) og Bannerflow (annonseproduksjon) på min siste arbeidsplass.", media:[]},
  {q:"Er det noe du synes er spesielt gøy å jobbe med?", type:"text", text:"Jeg trives med en variert hverdag, men innrømmer gjerne at jeg blir litt ekstra glad når jeg får illustrere eller animere.<br><br>Som et lite eksempel lagde jeg nylig en liten maskot-figur, «Cappi» – en capybara – bare for å teste ut en idé og vise hvordan jeg jobber fra konsept til ferdig animasjon. Se mer av Cappi under Arbeider. 😉<br><br>Jeg er dessuten glad i dyr og opptatt av dyrevelferd – noe som nok skinner gjennom når jeg lager denne typen figurer. Hjemme har jeg både høner i hagen og en vilter Boxer, så jeg har alltid noen dyr rundt meg.", media:[]},
  {q:"Hva med det sosiale?", type:"text", text:"Jeg bidrar med humor, godt humør, tørre ordspill, musikktips og engasjement.<br><br>I min forrige jobb satt jeg mange år i sosialkomitéen, og bidro til at miljøet på jobb var godt – og at det ble både sommerfest og julebord. 🎉", media:[]},
  {q:"Når kan du eventuelt starte i ny jobb?", type:"text", text:"Jeg er veldig fleksibel og kan starte allerede i august! 👋😊<br><br>Etter en større nedbemanning i Allente er jeg nå på jakt etter nye utfordringer. I mellomtiden fyller jeg dagene med å lære nye ting, blant annet AI og animasjon. Har dere lyst til å se en arbeidsprøve på noe spesielt, lager jeg gjerne det. 💻", media:[]},
  {q:"Hvordan kontakter vi deg?", type:"text", text:"Ring meg gjerne på 97 72 03 15, eller send en mail til backmarkrandi@gmail.com 📩", media:[]}
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
    thumbImg: "https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/video/Showcase.jpg"
  },
  {
    tag: "Konsept",
    title: "Maskot-konsept – Cappi",
    desc: "En liten personlig testcase, bare for å vise fram hvordan jeg jobber fra idé til ferdig animasjon.",
    problem: "Jeg ville teste ut en idé: hvordan bygge en enkel, søt figur som kan brukes til å skape gjenkjennelse og litt ekstra liv i kommunikasjon.<br><br>Valget falt på en Capybara – flodsvin er visst in for tiden.",
    body: "Jeg har utviklet figuren, tegnet den i Illustrator, og animert den i After Effects. En slik enkel figur har utallige muligheter for å spilles ut i ulike situasjoner.",
    results: ["Maskot","Illustrator","After Effects"],
    chips: ["Historiefortelling","Animasjon","Konsept"],
    mediaType: "multi",
    media: [
      {type:"vimeo", src:"https://player.vimeo.com/video/1212105008?h=aff3049ef9&badge=0&autopause=0&title=0&byline=0&portrait=0"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/cappelendamm/images/Cappi_dumpe.png", label:"Cappi dumper"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/cappelendamm/images/Cappi_jobber.png", label:"Cappi jobber"}
    ],
    thumbBg: "#d0efe7",
    thumbImg: "https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/cappi/Cappi_thumb.png"
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
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente1.png", label:"Allente 1"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente2.jpg", label:"Allente 2"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente3.jpg", label:"Allente 3"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente4.jpg", label:"Allente 4"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente5.png", label:"Allente 5"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente6.jpg", label:"Allente 6"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente7.jpg", label:"Allente 7"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente8.jpg", label:"Allente 8"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente9.png", label:"Allente 9"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente10.jpg", label:"Allente 10"}
    ],
    thumbBg: "#b8e5d9",
    thumbImg: "https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/allente/Allente_thumb.jpg"
  },
  {
    tag: "Illustrasjon",
    title: "Illustrasjoner – Finn roen",
    desc: "En liten serie med illustrasjoner laget i Illustrator. Målet var å lage bilder som utstråler ro og mindfulness.",
    problem: "Hvordan skape en serie med illustrasjoner som utstråler ro og mindfulness i ulike situasjoner. Jeg ønsket å utforske en tegnestil med rene flater og skygger, og også en fargebruk som gjør at uttrykket føles «nedpå» og ekte.",
    body: "Illustrasjonene er laget i Illustrator med fokus på enkle former, rolige farger og en stemning som inviterer til å puste ut.",
    results: ["Utforsket ny tegnestil med rene flater og skygger","Bygget en sammenhengende serie med felles uttrykk"],
    chips: ["Illustrator"],
    mediaType: "multi",
    media: [
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/illustrasjon/Sacco.jpg", label:"Sacco"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/illustrasjon/Te.jpg", label:"Te"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/illustrasjon/Yoga.jpg", label:"Yoga"}
    ],
    thumbBg: "#ffffff",
    thumbImg: "https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/illustrasjon/Sacco_thumb.jpg"
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
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Peter_Pan.jpg", label:"Peter Pan"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Peter_Pan_980x300px.jpg", label:"Peter Pan banner"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Peter_pan_barn.JPG", label:"Peter Pan – barn"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Fortapte_gutter.jpg", label:"Fortapte gutter"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Bukk.JPG", label:"Bukkene Bruse"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/PR.JPG", label:"PR-arbeid"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Fotografering.jpeg", label:"Fotografering"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Plakater.jpg", label:"Plakater"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Alladin_Earlybird_Insta.jpg", label:"Aladdin Earlybird"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Programmer.png", label:"Programmer"},
      {type:"image", src:"https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/ULVEN_Trollskogen_teater_skjermer_1920x1080.jpg", label:"Skjermvisning"}
    ],
    thumbBg: "#e3f4f0",
    thumbImg: "https://raw.githubusercontent.com/randback-design/meet-randi/main/site/portfolio/teater/Peter_Pan_thumb.jpg"
  },
  {
    tag: "Annonsering",
    title: "Kreativ annonse – MIX",
    desc: "Interaktiv annonse og lite «spill» for MIX, der brukerne laget sin egen milkshake de også kunne gå og lage seg i nærmeste MIX-kiosk.",
    problem: "MIX hadde en sommer med mye fokus på sin milkshake laget av ekte kuleis, og at man kunne velge smaker og ingredienser selv. Vår jobb var å få dette budskapet ut på en kreativ måte, slik at folk oppsøkte MIX-butikkene. Løsningen ble flere typer display-annonser, og en landingsside med et «spill».",
    body: "Jeg fikk ansvar med å svare på brief, og utarbeidet både illustrasjoner og forslag til uttak på VG. Selve spillet ble laget i tett samarbeid med en av utviklerne på teamet, og resultatet fløy skikkelig godt!",
    results: ["Deling på SoMe","Konkurranse","Interaksjon"],
    chips: ["Illustrasjon","Konsept","Gamification","Utvikling"],
    mediaType: "multi",
    media: [
      {type:"image", src:"/portfolio/milkshake/Mix1.png", label:"Mix 1"},
      {type:"image", src:"/portfolio/milkshake/Mix2.png", label:"Mix 2"},
      {type:"image", src:"/portfolio/milkshake/Mix3.png", label:"Mix 3"},
      {type:"vimeo", portrait:true, src:"https://player.vimeo.com/video/1192205368?h=ddd6a990cf&badge=0&autopause=0&title=0&byline=0&portrait=0"},
      {type:"image", src:"/portfolio/milkshake/Mix6.png", label:"Mix 6"},
      {type:"image", src:"/portfolio/milkshake/Mix7.png", label:"Mix 7"},
      {type:"vimeo", portrait:true, src:"https://player.vimeo.com/video/1192205370?h=9278ed34e1&badge=0&autopause=0&title=0&byline=0&portrait=0"}
    ],
    thumbBg: "#d0efe7",
    thumbImg: "/portfolio/milkshake/Mix_thumb.jpg"
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
    tag: "SoMe / Instagram",
    title: "Lanseringstekst – bakemikser",
    context: "Skrevet som del av en kreativ case-oppgave for en anonymisert barnematmerkevare, i forbindelse med lansering av en ny produktlinje.",
    excerpt: "Vi vokser! Og det har jo vært planen hele veien. 🌱",
    fullText: "Vi vokser! Og det har jo vært planen hele veien. 🌱\n\nVi vil være det sunne, økologiske og allergivennlige alternativet i barnemathylla – med produkter laget av rene råvarer og ingredienser man faktisk kjenner igjen.\n\nSamtidig håper vi å inspirere flere til å tenke litt annerledes om barnemat. Derfor deler vi også oppskrifter, tips og kunnskap underveis.\n\nOg nå har det kommet noe nytt i hylla fra oss 👀\n\nNemlig bakemikser! De fås i de fleste dagligvarebutikker, samt hos utvalgte nettbutikker.\n\nMed bare 2–3 ekstra ingredienser hjemme kan du lage sunn og smakfull bakst på under 30 minutter. Enklere for de voksne, skikkelig godt for mini – og perfekt både til frokost, matpakke og fest. 🎉"
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
      <div class="text-sample-excerpt">${t.excerpt}</div>
      <span class="text-sample-see-more">Les hele teksten</span>
    </div>
  `).join('');
}

function openTextModal(i){
  const t = textSamples[i];
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-tag">${t.tag}</div>
    <div class="modal-title">${t.title}</div>
    <div class="modal-problem"><div class="modal-problem-label">Kontekst</div><div class="modal-problem-text">${t.context}</div></div>
    <div class="text-sample-modal-body">${t.fullText}</div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
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
