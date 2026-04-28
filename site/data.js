// ============================================================
//  data.js — Alt innhold for Randi Bäckmark sin porteføljeside
//  Rediger via admin/index.html — ikke direkte her
// ============================================================

const SITE_DATA = {

  // ── Grunninfo ──────────────────────────────────────────────
  name: "Randi Bäckmark",
  title: "Grafisk designer",
  location: "Oslo",
  email: "din@epost.no",
  phone: "+47 000 00 000",
  linkedin: "https://linkedin.com/in/dittprofilnavn",
  portfolioUrl: "https://dinportefolje.no",
  contactImage: "",   // eks: "images/randi.jpg"

  // ── YouTube video-IDer ────────────────────────────────────
  heroVideoId: "",
  showcaseVideoId: "uXaAgf8j-MI",

  // ── Kategorier og spørsmål ────────────────────────────────
  categories: [
    {
      title: "Om meg",
      desc: "Hvem er jeg og hva driver meg",
      questions: [
        { q: "Hvem er du, og hva er din designfilosofi?", type: "text", text: "Skriv svaret ditt her...", media: [] },
        { q: "Hva skiller deg fra andre designere?", type: "text", text: "Skriv svaret ditt her...", media: [] }
      ]
    },
    {
      title: "Prosjekter",
      desc: "Arbeidsprøver og case studies",
      questions: [
        { q: "Kan du vise et prosjekt du er stolt av?", type: "sample", text: "Beskriv prosjektet her...", media: [
          { type: "placeholder", label: "Legg til bilder eller video", bg: "#E3F4F0" }
        ]}
      ]
    },
    {
      title: "Erfaring",
      desc: "Tidligere arbeidsplasser",
      questions: [
        { q: "Hva lærte du av din forrige arbeidsplass?", type: "text", text: "Skriv svaret ditt her...", media: [] }
      ]
    },
    {
      title: "Samarbeid",
      desc: "Hvordan jeg jobber i team",
      questions: [
        { q: "Hvordan jobber du i team?", type: "text", text: "Skriv svaret ditt her...", media: [] },
        { q: "Hva sier kollegaer om deg?", type: "video", text: "Her er noen ord fra folk jeg har jobbet med:", media: [
          { type: "placeholder", label: "Legg til referansevideoer", bg: "#E3F4F0" }
        ]}
      ]
    },
    {
      title: "Verktøy",
      desc: "Programvare og prosess",
      questions: [
        { q: "Hvilke verktøy bruker du daglig?", type: "text", text: "Skriv svaret ditt her...", media: [] }
      ]
    }
  ],

  // ── Utvalgte arbeid ───────────────────────────────────────
  selectedWork: [
    { title: "Prosjekt 1", desc: "Kort beskrivelse", image: "", bg: "#E3F4F0", url: "" },
    { title: "Prosjekt 2", desc: "Kort beskrivelse", image: "", bg: "#D0EFE7", url: "" },
    { title: "Prosjekt 3", desc: "Kort beskrivelse", image: "", bg: "#B8E5D9", url: "" }
  ],

  // ── Tidslinje ─────────────────────────────────────────────
  timeline: [
    { year: "2022 — nå", role: "Din stilling", place: "Firma, By", desc: "" },
    { year: "2019 — 2022", role: "Din stilling", place: "Firma, By", desc: "" },
    { year: "2016 — 2019", role: "Bachelor grafisk design", place: "Skole, By", desc: "" }
  ],

  // ── Ferdigheter ───────────────────────────────────────────
  skills: [
    { name: "Adobe Illustrator", pct: 95 },
    { name: "Adobe InDesign",    pct: 92 },
    { name: "Adobe Photoshop",   pct: 88 },
    { name: "Figma",             pct: 85 },
    { name: "After Effects",     pct: 70 }
  ]

};
