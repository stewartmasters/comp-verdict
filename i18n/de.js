// German locale
const de = {
  code:     'de',
  htmlLang: 'de',

  salarySection:    'gehalt',
  negotiateSection: 'verhandlung',
  salarySlugWord:   'gehalt',
  negSlugWord:      'verhandlung',

  salaryHubTitle: 'Tech-Gehälter nach Stelle und Stadt (2025)',
  salaryHubDesc:  'Aktuelle Gehalts-Benchmarks für Software Engineers, Product Manager, Data Scientists und mehr. Deckt die wichtigsten deutschen und europäischen Städte sowie wichtige globale Märkte ab.',
  salaryHubLead:  'Aktuelle Vergütungsdaten für Tech-Stellen in Deutschland und Europa. Alle Zahlen sind Jahresbruttogehalt in Landeswährung, basierend auf Daten aus Q1 2025.',
  negHubTitle:    'Gehaltsverhandlungs-Ratgeber für den Tech-Bereich (2025)',
  negHubDesc:     'Gehaltsverhandlungs-Ratgeber für Software Engineers, Product Manager und mehr in Berlin, München, Amsterdam und San Francisco. Kenne deinen Markt, dann verhandele.',
  negHubLead:     'Marktspezifische Verhandlungsratgeber für Tech-Stellen. Die Kenntnis der Marktspanne ist die Grundlage jeder erfolgreichen Gehaltsverhandlung.',

  salaryTitleTpl:       (role, city) => `${role} Gehalt in ${city} (2025) — Benchmarks nach Erfahrung`,
  salaryDescTpl:        (role, city, p25, p50, p75, sym) => `${role} Gehalt in ${city}: P25 ${sym}${Math.round(p25/1000)}k, Median ${sym}${Math.round(p50/1000)}k, P75 ${sym}${Math.round(p75/1000)}k für Mid-Level (3–5 Jahre). Vollständige Aufschlüsselung nach Erfahrungsniveau.`,
  salaryH1Tpl:          (role, city) => `${role} Gehalt in ${city} (2025)`,
  salaryBreadcrumb1:    'Gehalts-Benchmarks',
  salaryTableTitle:     (role, city) => `Gehalt nach Erfahrungsniveau — ${city}`,
  salaryContextTitle:   (city) => `Marktkontext: ${city}`,
  salaryCTATitle:       (role) => `Ist dein ${role}-Angebot wettbewerbsfähig?`,
  salaryCTABody:        (role) => `Gib dein Angebot in CompVerdict ein und erhalte sofort ein Urteil — fair, stark oder unter Marktniveau — basierend auf deiner genauen Stelle, Stadt und Berufserfahrung.`,
  salaryCTABtn:         'Angebot prüfen →',
  salaryNegTitle:       (role, city) => `Dein ${role}-Angebot in ${city} verhandeln`,
  salaryNegBody:        (role, city) => `Stelle sicher, dass du aus einer Position des Wissens heraus verhandelst. Unser Ratgeber behandelt die marktspezifischen Hebel, die du einsetzen solltest.`,
  salaryNegLink:        (role, city) => `${role}-Gehalt in ${city} verhandeln →`,
  salaryFaqTitle:       'Häufig gestellte Fragen',
  salaryRelCitiesTitle: (role) => `${role} Gehalt in anderen Städten`,
  salaryRelRolesTitle:  (city) => `Andere Tech-Gehälter in ${city}`,
  salaryTableHeaders:   ['Erfahrungsniveau', '25. Perzentil', 'Median', '75. Perzentil'],
  footerNote:           'Daten basieren auf aggregierten Gehaltsumfragen aus Q1 2025. Alle Zahlen sind Jahresbruttogehalt (vor Steuern) in Landeswährung.',
  footerLinkTool:       'CompVerdict Tool',
  footerLinkSalary:     'Gehalts-Benchmarks',
  footerLinkNeg:        'Verhandlungsratgeber',

  negTitleTpl:        (role, city) => `${role} Gehalt in ${city} verhandeln (2025)`,
  negDescTpl:         (role, city, p25, p50, p75, sym) => `Schritt-für-Schritt-Ratgeber zur ${role}-Gehaltsverhandlung in ${city}. Marktspanne: ${sym}${Math.round(p25/1000)}k–${sym}${Math.round(p75/1000)}k für Mid-Level.`,
  negH1Tpl:           (role, city) => `${role} Gehalt in ${city} verhandeln`,
  negBreadcrumb1:     'Verhandlungsratgeber',
  negLead:            (city) => `Die meisten Kandidaten in ${city} lassen Geld liegen — nicht weil Arbeitgeber nicht mehr zahlen würden, sondern weil sie den Markt nicht kennen oder einfach nicht fragen. Dieser Ratgeber gibt dir beides: die Daten und das Skript.`,
  negLeverageTitle:   (city) => `Deine Verhandlungshebel in ${city}`,
  negTableTitle:      (role, city) => `${role} Gehaltsspannen — ${city}`,
  negTableHeaders:    ['Erfahrungsniveau', 'Untergrenze (P25)', 'Median (P50)', 'Stark (P75)'],
  negPlaybookTitle:   'Das Verhandlungs-Playbook',
  negContextTitle:    (city) => `Marktkontext: ${city}`,
  negCTATitle:        'Zuerst das Angebot prüfen, dann verhandeln',
  negCTABody:         'Gib die Angebotsdetails in CompVerdict ein, um genau zu sehen, wo es im Markt steht — bevor du entscheidest, ob du nachverhandelst.',
  negCTABtn:          'Angebot prüfen →',
  negSalaryLink:      (role, city) => `Vollständige ${role}-Gehalts-Benchmarks für ${city} →`,
  negRelRolesTitle:   (city) => `Weitere Verhandlungsratgeber — ${city}`,
  negRelRoleLink:     (role, city) => `${role} in ${city} verhandeln`,
  negRelCitiesTitle:  (role) => `${role} in anderen Städten verhandeln`,
  negRelCityLink:     (role, city) => `Verhandeln in ${city}`,
  negStatFloor:       'Marktuntergrenze',
  negStatMedian:      'Marktmedian',
  negStatStrong:      'Starkes Angebot',
  negStatFloorSub:    'Mid-Level P25',
  negStatMedianSub:   'Mid-Level P50',
  negStatStrongSub:   'Mid-Level P75',

  faqQ1: (role, city) => `Was ist das Durchschnittsgehalt für ${role} in ${city}?`,
  faqA1: (role, city, junP25, midP50, senP50, sym) =>
    `Das Mediangehalt für ${role} in ${city} beträgt ${sym}${Math.round(midP50/1000)}k pro Jahr für Mid-Level (3–5 Jahre Erfahrung). Junior-Gehälter beginnen bei rund ${sym}${Math.round(junP25/1000)}k, während Senior-Level typischerweise ${sym}${Math.round(senP50/1000)}k oder mehr verdient.`,
  faqQ2: (role, city) => `Was gilt als gutes ${role}-Gehalt in ${city}?`,
  faqA2: (role, city, midP50, midP75, senP50, sym) =>
    `Ein Gehalt über dem 75. Perzentil gilt als stark. Für einen ${role} auf Mid-Level in ${city} bedeutet das mehr als ${sym}${Math.round(midP75/1000)}k pro Jahr. Senior-Kandidaten, die ${sym}${Math.round(senP50/1000)}k+ anstreben, befinden sich in der oberen Hälfte des Marktes.`,
  faqQ3: (role, city) => `Wie steigt das ${role}-Gehalt in ${city} mit der Erfahrung?`,
  faqA3: (role, city, jump) =>
    jump
      ? `Der Wechsel von Mid-Level zu Senior als ${role} in ${city} entspricht einem Anstieg von ${jump}% beim Median.`
      : `Das Erfahrungsniveau ist der stärkste Treiber der ${role}-Vergütung in ${city}. Jede Stufe entspricht typischerweise einem Anstieg von 30–50% beim Median.`,
  faqQ4: (role, city) => `Ist ${city} ein guter Markt für ${role}-Stellen?`,
  faqA4: (role, city, midP50, sym, firstSentence) =>
    `${firstSentence} Für ${role}-Profile ist die Mediankompensation von ${sym}${Math.round(midP50/1000)}k ${midP50 > 60000 ? 'wettbewerbsfähig im Verhältnis zu den Lebenshaltungskosten' : 'repräsentativ für das lokale Marktniveau'}.`,
  faqQ5: (role, city) => `Woran erkenne ich, ob mein ${role}-Angebot in ${city} gut ist?`,
  faqA5: (role, city, midP75, sym) =>
    `Der zuverlässigste Weg ist ein Vergleich mit Marktdaten. Ein ${role}-Angebot in ${city} ist stark, wenn es das 75. Perzentil für dein Erfahrungsniveau erreicht — das bedeutet ${sym}${Math.round(midP75/1000)}k oder mehr auf Mid-Level (3–5 Jahre). Nutze CompVerdict, um dein genaues Angebot einzugeben und sofort eine Perzentil-Bewertung basierend auf deiner Stelle, Stadt und Erfahrung zu erhalten.`,

  negSteps: (role, city, midP50, midP25, midP75, senP50, sym) => [
    {
      title: 'Kenne deine Marktspanne',
      body:  `Der Median-${role} in ${city} verdient ${sym}${Math.round(midP50/1000)}k auf Mid-Level und ${sym}${Math.round((senP50||0)/1000)}k auf Senior-Level. Stelle fest, welches Erfahrungsband für dich gilt, bevor du ein Gehaltsgespräch beginnst.`,
    },
    {
      title: 'Verankere über deinem eigentlichen Ziel',
      body:  `Steige 10–15% über deinem tatsächlichen Ziel ein. Das schafft Spielraum zum Nachgeben und trotzdem dein Ziel zu erreichen. Nutze das 75. Perzentil deiner Erfahrungsstufe — ${sym}${Math.round(midP75/1000)}k für Mid-Level — als Ankerpunkt.`,
    },
    {
      title: 'Argumentiere mit Marktdaten, nicht mit persönlichem Bedarf',
      body:  `Sage: "Basierend auf Markt-Benchmarks für ${role}s in ${city} mit meiner Erfahrung liegt die Spanne bei ${sym}${Math.round(midP25/1000)}k–${sym}${Math.round(midP75/1000)}k. Ich orientiere mich an der oberen Hälfte dieser Spanne." Begründe deine Forderung niemals mit Miete oder Lebenshaltungskosten.`,
    },
    {
      title: 'Verhandle das Gesamtpaket',
      body:  'Das Grundgehalt ist nur eine Komponente. Frage nach der Jahresbonusstruktur, Aktienoptionen, Signing Bonus, Remote-Flexibilität und Weiterbildungsbudget. Jede Komponente ist eine eigene Verhandlung mit eigenem Spielraum.',
    },
    {
      title: 'Verlange alles schriftlich vor der Zusage',
      body:  'Mündliche Angebote sind nichts wert. Bitte um das schriftliche Angebotsschreiben, bevor du deine Entscheidung mitteilst. Überprüfe Startdatum, Vesting-Zeitplan, Kündigungsfristen und etwaige Wettbewerbsverbote vor der Unterschrift.',
    },
  ],

  salaryLinkLabel: (role, city) => `${role} Gehalt — ${city}`,
  negLinkLabel:    (role, city) => `${role}-Gehalt in ${city} verhandeln`,

  SALARY_CITIES: [
    'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Remote (Germany)',
    'Amsterdam', 'Zurich', 'London', 'San Francisco', 'New York',
  ],
  NEGOTIATE_CITIES: [
    'Berlin', 'Munich', 'Amsterdam', 'Zurich', 'London', 'San Francisco',
  ],

  BAND_LABELS: {
    junior: 'Junior (0–2 Jahre)',
    mid:    'Mid-Level (3–5 Jahre)',
    senior: 'Senior (6–10 Jahre)',
    staff:  'Staff / Lead (11+ Jahre)',
  },

  CITY_DESC: {
    'Berlin':            "Berlin ist Deutschlands Startup-Hauptstadt und zieht internationales Talent durch vergleichsweise niedrige Lebenshaltungskosten und ein starkes Visa-Ökosystem an. Die Gehälter liegen 10–15% unter München, aber das Startup-Equity-Ökosystem ist stark ausgeprägt.",
    'Munich':            "München ist Deutschlands bestbezahlter Tech-Markt, angetrieben durch Automotive-Tech, Enterprise-Software und eine Gruppe großer multinationaler Konzerne. Jahresbonusstrukturen schaffen Spielraum für Verhandlungen über das Grundgehalt hinaus.",
    'Hamburg':           "Hamburg ist ein starker Markt für E-Commerce, Medien und Logistik-Tech. Die Gehälter liegen leicht über Berlin, und die Lebensqualität kombiniert mit einer internationalen Unternehmenslandschaft macht die Stadt attraktiv.",
    'Frankfurt':         "Frankfurt ist Deutschlands Finanzzentrum mit starker Nachfrage nach Tech-Stellen aus Banking und Fintech. Die Gehälter sind bei finanznahen Positionen mit München vergleichbar.",
    'Cologne':           "Köln hat eine wachsende Tech-Szene mit starker Präsenz in Medien, E-Commerce und Gaming. Die Gehälter sind etwas niedriger als in München oder Frankfurt, dafür sind Lebenshaltungskosten und Lebensqualität attraktiv.",
    'Stuttgart':         "Stuttgart ist geprägt von Automotive-Tech und Ingenieurwesen, mit starker Präsenz großer Industriekonzerne. Die Gehälter in der Tech-Branche sind solide, besonders in industrienahen Rollen.",
    'Remote (Germany)': "Remote-Stellen in Deutschland nutzen typischerweise nationale Arbeitsverträge mit Bezug auf Münchner oder Berliner Benchmarks. Gehaltsanpassungen nach Wohnort des Mitarbeiters sind weniger verbreitet als in den USA.",
    'Amsterdam':         "Amsterdam übertrifft seine Größe mit einer Konzentration von EMEA-Hauptsitzen internationaler Tech-Konzerne und einem vollständig englischsprachigen professionellen Umfeld. Niederländische Arbeitgeber sind in der Regel transparent über Gehaltsbänder.",
    'Zurich':            "Zürich bietet einige der höchsten Tech-Gehälter in Europa, getrieben durch Finanzdienstleister, Pharmakonzerne und globale Tech-Unternehmen. Die Lebenshaltungskosten sind jedoch entsprechend hoch.",
    'London':            "London bleibt Europas bestbezahlter Tech-Hub mit starker Nachfrage aus Finanzdienstleistungen, E-Commerce und Enterprise-Software. Initiale Angebote haben fast immer Verhandlungsspielraum.",
    'San Francisco':     "San Francisco und die Bay Area bleiben der globale Benchmark für Software-Vergütung. Die Gesamtkompensation einschließlich Equity übersteigt häufig das Grundgehalt — verhandle immer das gesamte Paket.",
    'New York':          "New York ist der zweitgrößte Tech-Hub der USA mit besonderer Stärke in Finanzen, Medien und E-Commerce. Der Wettbewerbsdruck des Finanzsektors hebt Tech-Gehälter in der gesamten Stadt.",
  },

  ROLE_DESC: {
    'Software Engineer':         "Software Engineers entwerfen, entwickeln und warten Softwaresysteme. Die Vergütung spiegelt die konstante Nachfrage nahezu aller Tech-Unternehmen und die Breite der technischen Tiefe wider, die die Stelle erfordert.",
    'Product Manager':           "Product Manager verantworten Produktstrategie und Roadmap-Umsetzung und arbeiten teamübergreifend mit Engineering, Design und Business-Stakeholdern. Die hohe PM-Nachfrage in Wachstumsunternehmen schiebt die Vergütung über den Tech-Median.",
    'Data Scientist':            "Data Scientists erstellen Modelle und statistische Analysen zur Entscheidungsunterstützung. Die Nachfrage ist am stärksten in Consumer Internet, Finanzen und Großunternehmen, wo datengestützte Entscheidungen direkt Umsatz generieren.",
    'Engineering Manager':       "Engineering Manager leiten Ingenieurteams und verbinden technische Aufsicht mit Personalführung. Die Management-Prämie — typischerweise 20–40% über Senior-IC-Gehältern — spiegelt den echten Mangel an effektiven technischen Führungskräften wider.",
    'Frontend Engineer':         "Frontend Engineers entwickeln die nutzerorientierte Schicht von Webanwendungen, hauptsächlich mit JavaScript- und TypeScript-Frameworks. Die Vergütung liegt meist etwas unter Backend aufgrund eines höheren Kandidatenangebots.",
    'Backend Engineer':          "Backend Engineers entwickeln und warten serverseitige Systeme, APIs und Datenpipelines. Die konstante Nachfrage in praktisch allen Tech-Unternehmen macht dies zu einer der meistgefragten Stellen.",
    'Full Stack Engineer':       "Full Stack Engineers arbeiten sowohl an Frontend als auch Backend — ein generalistisches Profil mit hoher Nachfrage bei Startups und kleineren Unternehmen. Die Vergütung liegt etwas unter spezialisierten Rollen bei größeren Firmen.",
    'DevOps Engineer':           "DevOps Engineers verantworten Infrastruktur, CI/CD-Pipelines und Deployment-Automatisierung. Da Cloud-Infrastruktur für alle Tech-Unternehmen geschäftskritisch wird, ist die DevOps-Vergütung in den letzten fünf Jahren stark gestiegen.",
    'Machine Learning Engineer': "Machine Learning Engineers entwickeln und deployen ML-Systeme im großen Maßstab, an der Schnittstelle von Software Engineering und Data Science. Die Nachfrage von KI-nativen Unternehmen und Konzernen treibt eine konstante Vergütungsprämie.",
    'UX Designer':               "UX Designer verantworten den gesamten User-Experience-Designprozess von der Nutzerforschung bis zum Interface-Design. Die Vergütung liegt unter Engineering-Stellen, aber Senior-UX-Talent bei produktgeführten Unternehmen erzielt starke Pakete.",
  },

  CITY_LEVERAGE: {
    'Berlin': [
      "Die Startup-Kultur macht Equity zu einem echten und verhandelbaren Hebel über das Grundgehalt hinaus",
      "Remote-Arbeit bedeutet, dass Berliner Arbeitgeber mit München und London um dieselben Kandidaten konkurrieren",
      "Visa-Sponsoring-Kosten sind real — nutze das als Hebel, wenn du internationaler Kandidat bist",
      "Verweise in der Verhandlung auf Münchner Benchmarks — Berlin liegt 10–15% darunter, und Arbeitgeber wissen das",
    ],
    'Munich': [
      "München ist Deutschlands bestbezahlter Markt — Arbeitgeber erwarten und respektieren Verhandlungen",
      "Automotive- und Enterprise-Tech-Firmen haben strukturierte Gehaltsbänder mit echtem Spielraum an den Rändern",
      "Jahresbonusstrukturen bedeuten, dass das Grundgehalt nicht der einzige Hebel ist — verhandle das Gesamtpaket",
      "Umzugspakete sind für Kandidaten, die aus anderen Städten nach München ziehen, verhandelbar",
    ],
    'Amsterdam': [
      "Niederländische Arbeitgeber sind transparent über Gehaltsbänder — frage direkt, bevor du verhandelst",
      "Die 30%-Regelung für Expatriate-Kandidaten ist ein echter und verhandelbarer Bestandteil der Gesamtvergütung",
      "Internationaler Talentpool bedeutet, dass Arbeitgeber routinemäßig mit Londoner und deutschen Benchmarks vergleichen",
      "Das starke Startup- und Scaleup-Ökosystem erzeugt echten Wettbewerbsdruck bei Senior-Stellen",
    ],
    'Zurich': [
      "Zürich zahlt europaweit Spitzengehälter — Arbeitgeber erwarten fundierte Verhandlungen",
      "Finanz- und Pharmaunternehmen haben strukturierte aber flexible Vergütungsrahmen",
      "Börsenkotierte Unternehmen bieten oft Aktienoptionsprogramme als zusätzlichen Verhandlungshebel",
      "Umzugspakete sind bei Zürich-Arbeitgebern standard — verhandle auch das explizit",
    ],
    'London': [
      "Londoner Arbeitgeber erwarten Verhandlungen — Erstangebote lassen routinemäßig 10–20% Spielraum",
      "Finanzdienstleistungsunternehmen zahlen 30–50% Aufschläge für bestimmte technische Skills",
      "Ein Konkurrenzangebot ist der stärkste Verhandlungshebel im Londoner Markt",
      "Das Lebenshaltungskosten-Argument funktioniert in beide Richtungen — nutze es, aber bereite dich auf erfahrene Arbeitgeber vor",
    ],
    'San Francisco': [
      "Verhandle immer die Gesamtkompensation als eine Zahl: Grundgehalt, RSUs, Signing Bonus und Vesting Cliff",
      "Ein Konkurrenzangebot ist der stärkste Hebel im SF Tech — Unternehmen werden es routinemäßig matchen oder übertreffen",
      "RSU-Vesting-Zeitpläne und Cliff-Perioden sind bei vielen mittelgroßen Unternehmen verhandelbar",
      "Signing Boni werden routinemäßig genutzt, um Lücken bei unvestetem Equity aus einem vorherigen Job zu überbrücken",
    ],
  },
};
export default de;
