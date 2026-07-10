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

function buildRefCarousel(){
  const track = document.getElementById('refTrack');
  const isMobile = window.innerWidth <= 640;
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
  document.getElementById('refDots').innerHTML = referanser.map((_,i) =>
    `<button class="car-nav-dot${i===refIdx?' active':''}" onclick="goRef(${i})"></button>`
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
function stepRef(dir){ goRef(refIdx + dir); }

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
  {q:"Hvorfor søker du på denne jobben?", type:"text", text:"For en «gammel» lesehest gir navnet Cappelen Damm gode assosiasjoner med én gang. Jeg leste masse under oppveksten, og er fortsatt glad i det, men akkurat som for målgruppene dere vil nå, har andre medier overtatt en del av tiden jeg tidligere brukte på bøker.<br><br>Jeg har alltid vært opptatt av hvordan godt innhold kan engasjere mennesker – enten det er gjennom tekst, video, illustrasjoner eller digitale opplevelser. Tiden jeg jobbet i Egmont som nettredaktør for Julia og innholdsprodusent for donald.no, lærte meg mye om å finne historier som treffer målgruppen og skaper lyst til å komme tilbake.<br><br>Jeg er også nysgjerrig på hvordan teknologi kan gjøre gode produkter enda mer relevante og tilgjengelige. AI, gamification og smarte digitale løsninger åpner stadig nye muligheter for å formidle innhold på en måte som skaper engasjement.<br><br>Det er nettopp derfor denne stillingen traff meg. Jeg har lyst til å bruke erfaringen min til å fortelle historiene rundt de digitale produktene deres, skape innhold som engasjerer, og bidra til at enda flere lærere og elever får øynene opp for alt det Skolen fra Cappelen Damm har å tilby.", media:[]},
  {q:"Hva mener du er det viktigste du kan bidra med hos oss?", type:"text", text:"Det viktigste jeg kan bidra med er å gjøre de digitale produktene deres synlige, relevante og engasjerende for lærere og elever. Jeg liker å finne historiene som viser hvorfor et produkt er nyttig, og formidle dem gjennom tekst, video, foto, illustrasjon og sosiale medier.<br><br>Jeg har bred erfaring med innholdsproduksjon, noe som gjør at jeg kan se helheten og produsere mye selv. Jeg kan skrive, illustrere, redigere bilder, lage landingssider, klippe video og animere – og trives aller best når disse fagområdene spiller sammen for å skape kommunikasjon som faktisk fungerer.<br><br>Jeg har også studert PPU og fått prøve meg som lærer både i barneskolen og på videregående. Det har gitt meg en nyttig forståelse for målgruppen deres, men det er først og fremst som innholdsprodusent og historieforteller jeg tror jeg kan gjøre den største forskjellen.", media:[]},
  {q:"Få høre litt om innhold du har produsert da!", type:"text", text:"Jeg har produsert innhold for mange ulike målgrupper gjennom de siste 20 årene, men fellesnevneren har alltid vært den samme: å skape engasjement og få folk til å stoppe opp, lese, klikke eller komme tilbake.<br><br>I Egmont var jeg nettredaktør for Julia og jobbet også med donald.no. (Fun fact: Redaktøren for bladet var Kirsti Kristoffersen, som senere har gitt ut flere flotte ungdomsbøker hos dere.) Jeg skrev artikler, laget quizzer og konkurranser, modererte forum og utviklet innhold som skulle treffe barn og unge der de var. Vi jobbet kontinuerlig med å skape engasjement og bygge en lojal brukergruppe.<br><br>I VG jobbet jeg i et in-house-byrå der vi utviklet kreative annonsekonsepter for annonsører. Målet var alltid å få folk til å stoppe opp og samhandle med innholdet – enten gjennom animasjoner, spill eller interaktive løsninger.<br><br>I Allente jobbet jeg med landingssider, nyhetsbrev, SoMe, videoinnhold og A/B-testing. Jeg var opptatt av hvordan små justeringer i budskap, design og innhold kunne gjøre kommunikasjonen tydeligere og gi bedre resultater.<br><br><div style='background:var(--t3);border-radius:16px;padding:20px'><img src='https://raw.githubusercontent.com/randback-design/meet-randi/main/site/cappelendamm/images/Eksempler.png' alt='Eksempler på innhold' style='width:100%;border-radius:8px;display:block'></div>", media:[]},
  {q:"Alle snakker om AI. Hva er dine tanker om det?", type:"text", text:"Jeg skal innrømme at jeg lenge var skeptisk til AI. De første bildene som dukket opp på nettet, med folk som hadde seks fingre og andre rare detaljer, gjorde meg ikke akkurat overbevist. 😅<br><br>I dag bruker jeg AI hver eneste dag. For meg er det først og fremst et verktøy som gjør meg til en bedre innholdsprodusent. Jeg bruker det til idéutvikling, research, korrektur, strukturering av tekst og raske prototyper, slik at jeg kan bruke mer tid på historiefortelling, kreativitet og kvalitet.<br><br>Denne nettsiden er faktisk laget med hjelp av Claude, etter mange runder med prompting og finjustering.<br><br>Jeg har også laget en liten app til datteren min, som trenger litt ekstra hjelp med spisingen. Der blir måltider til poeng som får en liten hage til å vokse. Appen er et godt eksempel på hvordan jeg liker å kombinere kreativitet, teknologi og brukerinnsikt for å skape løsninger som engasjerer.<br><br>Ta gjerne en titt, og test den ut (dette er bare en kopi): <a href='https://mat-motivator.vercel.app/' target='_blank' style='color:var(--t1);font-weight:700'>mat-motivator.vercel.app →</a>", media:[]},
  {q:"Hvilke programmer jobber du i?", type:"text", text:"Jeg jobber i de fleste av de store programmene i Adobe CC: Photoshop, InDesign, Illustrator, Premiere og After Effects. Mer om dette ser dere i en egen blokk lengre ned på denne siden. 👇<br><br>Jeg er også glad i å lære nye programmer og verktøy, og har bidratt til å implementere både Monday.com (prosjektstyring) og Bannerflow (annonseproduksjon) på min siste arbeidsplass.", media:[]},
  {q:"Er det noe du synes er spesielt gøy å jobbe med?", type:"text", text:"Jeg liker som nevnt en variert hverdag med en god miks av arbeidsoppgaver, men kan også sitte flere uker i strekk med kun tekstarbeid.<br><br>MEN, jeg blir litt ekstra glad om det er behov for litt illustrasjon/animasjon av og til. Dere skulle ikke hatt en maskot til selve Cappelen Damm Skole for eks? Capybaraer er populære blant barn for tiden. Hva med en liten Cappy? 😉", media:[]},
  {q:"Hva med det sosiale?", type:"text", text:"Jeg bidrar med humor, godt humør, tørre ordspill, musikktips og engasjement.<br><br>I min forrige jobb satt jeg mange år i sosialkomitéen, og bidro til at miljøet på jobb var godt – og at det ble både sommerfest og julebord. 🎉", media:[]},
  {q:"Når kan du eventuelt starte i ny jobb?", type:"text", text:"Her er jeg veldig fleksibel, og kan også starte allerede i august! 👋😊<br><br>Grunnet et eierskifte og en påfølgende stor nedbemanning i Allente, der jeg har jobbet de siste sju årene, søker jeg nå aktivt etter ny jobb.<br><br>Jeg bruker tiden godt, til å tilegne meg nye ferdigheter, som for eksempel å lære meg god bruk av AI, og bli bedre til å animere. Så skulle det være noe spesielt dere ønsker å se en arbeidsprøve på, så har jeg tid til å fikse det også. Bare si ifra. 💻", media:[]},
  {q:"Hvordan kontakter vi deg?", type:"text", text:"Jeg sier som Gabrielle... <em>«Riiing meg»</em>. 97 72 03 15. Eller send en mail til backmarkrandi@gmail.com 📩<br><br><a href='https://open.spotify.com/track/5YMptWDgTevTRMyKGtR4Gv' target='_blank' style='display:inline-flex;align-items:center;gap:8px;background:#1DB954;color:#fff;text-decoration:none;padding:8px 16px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:.04em'><svg width='16' height='16' viewBox='0 0 24 24' fill='white'><path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z'/></svg> Ring meg – Gabrielle</a>", media:[]}
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
    tag: "Illustrasjon",
    title: "Maskot-illustrasjoner",
    desc: "Under arbeid – maskot-illustrasjoner kommer snart på plass her.",
    problem: "Denne arbeidsprøven er under produksjon.",
    body: "Kommer tilbake med ferdige illustrasjoner så snart de er klare.",
    results: [],
    chips: ["Illustrasjon"],
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
      {type:"vimeo", src:"https://player.vimeo.com/video/1192205368?h=ddd6a990cf&badge=0&autopause=0&title=0&byline=0&portrait=0"},
      {type:"image", src:"/portfolio/milkshake/Mix6.png", label:"Mix 6"},
      {type:"image", src:"/portfolio/milkshake/Mix7.png", label:"Mix 7"},
      {type:"vimeo", src:"https://player.vimeo.com/video/1192205370?h=9278ed34e1&badge=0&autopause=0&title=0&byline=0&portrait=0"}
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
    return `<div class="portfolio-card fade-in" onclick="openModal(${i})">
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
}

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
      return `<div class="modal-carousel-slide">${inner}</div>`;
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
