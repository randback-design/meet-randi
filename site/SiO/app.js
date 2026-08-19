// ── HERO VIDEO ──
function playHeroVideo(){
  const wrap = document.getElementById('heroVideoWrap');
  wrap.style.cursor = 'default';
  wrap.onclick = null;
  wrap.innerHTML = '<iframe src="https://player.vimeo.com/video/1206746454?h=a2432c89bf&badge=0&autopause=0&autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:none;display:block"></iframe>';
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
  {q:"Så... hvem er du da?", type:"video", text:"Jeg er Randi – grafisk designer, og «markedsperson» med 20 års erfaring fra mediebransjen, og en bred kompetanse innen visuell og tekstlig kommunikasjon. Jeg liker å lage innhold som faktisk blir lagt merke til (og brukt), og jeg er også veldig glad i å skrive. 🎨<br><br>Dessuten er jeg kreativ, sosial, leken og ganske glad i tempo og mange baller i luften – uten at det går på bekostning av mitt behov for god orden, struktur og overblikk. ✅<br><br>Og så er jeg mamma, kjæreste, hundeeier og en ivrig konsert- og teatergjenger. 🎵 Mer om meg i denne animasjonsfilmen jeg har laget:", media:[{type:"video",vimeoId:"1187345684",vimeoHash:"f8b46e121d"}]},
  {q:"Hvorfor søker du på denne jobben?", type:"text", text:"Å få jobbe med studentene i Oslo som målgruppe høres rett og slett gøy ut – en stor, levende gruppe som stadig fornyer seg, i en fase av livet der de faktisk er åpne for nye tjenester og tilbud. Jeg liker rollen fordi den kombinerer nettopp det jeg trives best med: eierskap til en nettside over tid, tydelig og engasjerende innhold, og SoMe som faktisk treffer.<br><br>Jeg har alltid vært opptatt av hvordan godt innhold og en godt driftet nettside kan gjøre en tjeneste synlig og attraktiv, og jeg trives godt i skjæringspunktet mellom det kreative og det strukturerte/analytiske – akkurat den kombinasjonen dere ber om.", media:[]},
  {q:"Hva er din erfaring med nettsider, CMS og analyse?", type:"text", text:"Som nettredaktør for julia.no i Egmont hadde jeg ansvar for videreutvikling av siden og trafikken dit over flere år, i tett samarbeid med redaktøren – så jeg er vant til å eie et nettsted over tid, ikke bare produsere innhold til det.<br><br>I Allente jobbet jeg mye med landingssider og A/B-testing, og fulgte trafikk og resultater fortløpende for å se hva som faktisk fungerte. Jeg har god erfaring med Episerver som CMS, og har grunnleggende kjennskap til Google Analytics og SEO – og følger med på hvordan søk endrer seg nå som AI-søk (AEO) blir en stadig viktigere kanal for synlighet.<br><br>Jeg har ikke jobbet direkte i Enonic, Contentful eller Sanity, men jeg setter meg raskt inn i nye systemer, og har erfaring med flere ulike CMS-er fra tidligere stillinger.", media:[]},
  {q:"Hvordan er erfaringen din med sosiale medier?", type:"text", text:"Jeg har jobbet mye med innhold til sosiale medier – både i Allente og for Trollskogen teater, der jeg lager alt av SoMe-innhold i forbindelse med hver forestilling. Jeg liker å tilpasse budskap til plattformen det skal leve i, og har erfaring med både planlegging og produksjon av innhold, fra idé til ferdig post.<br><br>Jeg har ikke jobbet med Business Manager eller Snap Ads manager spesifikt ennå, men har god erfaring med Bannerflow til annonseproduksjon, og setter meg raskt inn i nye annonseplattformer.", media:[]},
  {q:"Hvilke programmer jobber du i?", type:"text", text:"Jeg jobber i de fleste av de store programmene i Adobe CC: Photoshop, InDesign, Illustrator, Premiere og After Effects. Mer om dette ser dere i en egen blokk lengre ned på denne siden. 👇<br><br>Jeg er også glad i å lære nye programmer og verktøy, og har bidratt til å implementere både Monday.com (prosjektstyring) og Bannerflow (annonseproduksjon) på min siste arbeidsplass.", media:[]},
  {q:"Når kan du eventuelt starte i ny jobb?", type:"text", text:"Jeg er fleksibel og kan starte på veldig kort varsel!<br><br>Etter en større nedbemanning i Allente er jeg nå på jakt etter nye utfordringer. I mellomtiden fyller jeg dagene med å lære nye ting, blant annet AI og animasjon. Har dere lyst til å se en arbeidsprøve på noe spesielt, lager jeg gjerne det. 😊", media:[]},
  {q:"Hvordan kontakter vi deg?", type:"text", text:"Ring meg på 97 72 03 15 📱<br><br>... eller send en mail til backmarkrandi@gmail.com 📩<br><br>Jeg håper veldig på å høre fra dere.", media:[]}
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
    tag: "Illustrasjon",
    title: "Illustrasjoner – Finn roen",
    desc: "En liten serie med illustrasjoner laget i Illustrator. Målet var å lage bilder som utstråler ro og mindfulness.",
    problem: "Hvordan skape en serie med illustrasjoner som utstråler ro og mindfulness i ulike situasjoner. Jeg ønsket å utforske en tegnestil med rene flater og skygger, og også en fargebruk som gjør at uttrykket føles «nedpå» og ekte.",
    body: "Illustrasjonene er laget i Illustrator med fokus på enkle former, rolige farger og en stemning som inviterer til å puste ut.",
    results: ["Utforsket ny tegnestil med rene flater og skygger","Bygget en sammenhengende serie med felles uttrykk"],
    chips: ["Illustrator"],
    mediaType: "multi",
    media: [
      {type:"image", src:"/portfolio/illustrasjon/Sacco.jpg", label:"Sacco"},
      {type:"image", src:"/portfolio/illustrasjon/Te.jpg", label:"Te"},
      {type:"image", src:"/portfolio/illustrasjon/Yoga.jpg", label:"Yoga"}
    ],
    thumbBg: "#ffffff",
    thumbImg: "/portfolio/illustrasjon/Sacco_thumb.jpg"
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
  },
  {
    tag: "Annonsering",
    title: "Kreative annonser – VG",
    desc: "Mange annonser laget for VG sine annonsører, ofte laget i samarbeid med utvikler.",
    problem: "Mange av VG (og Schibsted sine) annonsører ønsket annonser med «noe ekstra» – for eksempel on-scroll-funksjon, animasjon eller interaksjon.",
    body: "Jeg jobbet med å svare på briefer, skisse ut konsepter, og lage annonsene enten alene eller i samarbeid med en frontend-utvikler på teamet.",
    results: ["Animasjon","Koding","Kreativitet"],
    chips: ["Illustrasjon","Konsept","Utvikling","Innsalg"],
    mediaType: "multi",
    media: [
      {type:"image", src:"/portfolio/annonser/CirlcleK_VG.jpg", label:"Circle K"},
      {type:"image", src:"/portfolio/annonser/Norefjell_1920x1080_pauseplakat.jpg", label:"Norefjell – pauseplakat"},
      {type:"image", src:"/portfolio/annonser/Norefjell_580x400_1.jpg", label:"Norefjell"},
      {type:"image", src:"/portfolio/annonser/Norefjell_hestesko_wallpaper.jpg", label:"Norefjell – hestesko"},
      {type:"image", src:"/portfolio/annonser/Norwegian_netboard_Bodo.jpg", label:"Norwegian – Bodø"},
      {type:"vimeo", src:"https://player.vimeo.com/video/1213866188?h=21a240459e&badge=0&autopause=0&title=0&byline=0&portrait=0", label:"Norwegian", ratio:"1992/1236"},
      {type:"vimeo", src:"https://player.vimeo.com/video/1213866189?h=566c5fe5fa&badge=0&autopause=0&title=0&byline=0&portrait=0", label:"Norwegian", portrait:true, ratio:"750/1334"},
      {type:"image", src:"/portfolio/annonser/Obs_bygg_wallpaper.png", label:"Obs Bygg"},
      {type:"image", src:"/portfolio/annonser/Thon_valg_wallpaper_comfort.jpg", label:"Thon"},
      {type:"image", src:"/portfolio/annonser/Toyota_wallpaper.png", label:"Toyota"},
      {type:"vimeo", src:"https://player.vimeo.com/video/1213865713?h=b8b31390a9&badge=0&autopause=0&title=0&byline=0&portrait=0", label:"Babylife Clinic", ratio:"580/400", maxWidth:380},
      {type:"vimeo", src:"https://player.vimeo.com/video/1213865714?h=5e4b406454&badge=0&autopause=0&title=0&byline=0&portrait=0", label:"Babylife Clinic", ratio:"580/400", maxWidth:380},
      {type:"vimeo", src:"https://player.vimeo.com/video/1213865712?h=26ca1dc6eb&badge=0&autopause=0&title=0&byline=0&portrait=0", label:"Serla", ratio:"1920/1300"},
      {type:"vimeo", src:"https://player.vimeo.com/video/1208078682?badge=0&autopause=0&title=0&byline=0&portrait=0", label:"Norli", portrait:true, ratio:"750/1334"},
      {type:"vimeo", src:"https://player.vimeo.com/video/1213865715?h=5e75488883&badge=0&autopause=0&title=0&byline=0&portrait=0", label:"Axo Finans", ratio:"580/398", maxWidth:380}
    ],
    thumbBg: "#e3f4f0",
    thumbImg: "/portfolio/annonser/Annonser_thumb.jpg"
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
      if(m.type==='vimeo')      inner = `<iframe src="${m.src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen${(m.ratio||m.maxWidth)?` style="${m.ratio?`aspect-ratio:${m.ratio};`:''}${m.maxWidth?`max-width:${m.maxWidth}px;`:''}"`:''}></iframe>`;
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
