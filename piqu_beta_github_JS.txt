const SUPABASE_URL = "https://cnxqwwzankopplenfzvq.supabase.co";
const SUPABASE_KEY = "sb_publishable_dGW_UHdhGkctVaowDyVUvQ_dscIaM0i";

// Sobald du einen echten Unterstützungslink hast, hier eintragen.
// Beispiel später: const DONATION_URL = "https://...";
const DONATION_URL = "https://paypal.me/piqunews";
const FEHLER_EMAIL = "kontakt.piqu@gmail.com";

let alleNews = [];
let monitorVorhaben = [];
let monitorEreignisse = [];
let monitorJournalLinks = [];
let aktiverFilter = "alle";
let aktiveEbene = "bund";
let aktiveQuelle = "alle";
let zitateAusblenden = false;
let aktiveAnsicht = "journal";
let aktiverBereich = "journal";
let aktiverMonitorBereich = "entwicklung";
let zielMeldungId = null;
let zielJournalId = null;
let zielJournalIdAlternativen = [];
let startKurzinfo = null;

const filterListe = [
  { key: "alle", label: "Alle" },
  { key: "beschluss", label: "Beschlüsse" },
  { key: "anhoerung", label: "Anhörungen" },
  { key: "termin", label: "Termine" },
  { key: "reise", label: "Reisen" },
  { key: "bericht", label: "Berichte" },
  { key: "in_planung", label: "In Planung" },
  { key: "sonstiges", label: "Sonstiges" }
];

const quellenListe = [
  { key: "alle", label: "Alle Quellen" },
  { key: "bundestag", label: "Bundestag" },
  { key: "bundesrat", label: "Bundesrat" },
  { key: "bundesregierung", label: "Bundesregierung" }
];

const infoTexte = {
  qpi: `
    <h2>Was ist PIQu?</h2>

    <p>
      PIQu sammelt politische Informationen aus offiziellen Quellen
      und stellt sie verständlicher dar.
    </p>

    <p>
      Ziel ist eine ruhige Orientierung:
      Was ist passiert? Worum geht es? Welche Quelle belegt es?
      Und wo steht ein politisches oder gesetzgeberisches Vorhaben aktuell?
    </p>

    <h3>Die drei Grundprinzipien</h3>
    <ol>
      <li>
        <b>Offizielle Quellen</b><br>
        PIQu arbeitet mit offiziellen politischen Quellen wie Bundestag, Bundesrat,
        Bundesregierung, DIP/Bundestag und Bundesgesetzblatt/recht.bund.de.
      </li>
      <li>
        <b>Verständliche Erklärung</b><br>
        PIQu übersetzt amtliche Sprache in normale Sprache,
        ohne daraus eine politische Bewertung zu machen.
      </li>
      <li>
        <b>Original bleibt sichtbar</b><br>
        Quellen, Fakten und Verfahrensstand bleiben sichtbar,
        damit Nutzerinnen und Nutzer selbst nachprüfen können.
      </li>
    </ol>

    <p>
      PIQu bewertet keine Parteien, keine Personen und keine politischen Positionen.
      Die Plattform soll helfen, politische Vorgänge besser zu verfolgen,
      ohne Meinung, Empörung oder künstliche Zuspitzung in den Vordergrund zu stellen.
    </p>

    <p>
      PIQu ist kein amtliches Angebot. Maßgeblich bleiben immer die verlinkten Originalquellen.
    </p>
  `,



  ki: `
    <h2>KI-Hinweis</h2>

    <p>
      PIQu nutzt KI unterstützend, um offizielle politische Meldungen verständlicher zu erklären.
    </p>

    <p>
      Die KI soll keine eigene Meinung hinzufügen, keine politische Bewertung erzeugen
      und keine Parteien oder Personen einordnen.
      Sie hilft vor allem dabei, amtliche Texte kürzer, verständlicher und strukturierter darzustellen.
    </p>

    <p>
      Die Erklärungen sollen typische Fragen schneller beantworten:
      Was ist passiert? Warum ist es relevant? Wen betrifft es? Was könnte als Nächstes folgen?
    </p>

    <p>
      Wenn etwas aus den offiziellen Quellen nicht eindeutig ableitbar ist,
      soll PIQu vorsichtig bleiben und keine Spekulation als Tatsache darstellen.
    </p>

    <p>
      KI-Erklärungen können trotzdem Fehler enthalten.
      Deshalb bleiben Originalquellen, Faktenbereich und Quellenbereich sichtbar.
    </p>
  `,



  quellen: `
    <h2>Quellen & Transparenz</h2>

    <p>
      PIQu nutzt offizielle Quellen, zum Beispiel Bundestag, Bundesrat,
      Bundesregierung, DIP/Bundestag und Bundesgesetzblatt/recht.bund.de.
    </p>

    <p>
      In der aktuellen Beta liegt der Schwerpunkt auf Bundespolitik und dem Gesetzesmonitor.
      Journalmeldungen, politische Termine und Monitor-Einträge werden aus offiziellen Quellen geladen,
      technisch verarbeitet und verständlicher dargestellt.
    </p>

    <h3>Was PIQu mit Quellen macht</h3>
    <p>
      PIQu übernimmt Daten aus offiziellen Quellen, ordnet sie technisch ein
      und erstellt daraus verständlichere Erklärungen.
    </p>

    <p>
      Im Gesetzesmonitor werden Vorhaben zusätzlich über offizielle Verfahrensquellen verfolgt,
      zum Beispiel über Bundesratsdrucksachen, DIP-Vorgänge und Veröffentlichungen im Bundesgesetzblatt.
    </p>

    <p>
      Die Quellenansicht soll nachvollziehbar machen, woher eine Meldung stammt
      und welche Grundlage für die Erklärung verwendet wurde.
      Maßgeblich bleiben immer die Originalquellen.
    </p>
  `,



  haftung: `
    <h2>Haftung & Nutzungshinweis</h2>

    <p>
      PIQu dient der allgemeinen Information und Orientierung.
      Die Plattform sammelt politische Informationen aus offiziellen Quellen
      und bereitet sie verständlicher auf.
    </p>

    <h3>Offizielle PIQu-Adresse</h3>
    <p>
      Die offizielle PIQu-Adresse lautet:
    </p>

    <p>
      <b>https://piqu.vercel.app</b>
    </p>

    <p>
      PIQu wird vorerst über Vercel veröffentlicht.
      Nutzerinnen und Nutzer sollten prüfen,
      ob sie sich tatsächlich auf dieser offiziellen PIQu-Adresse befinden.
    </p>

    <p>
      PIQu übernimmt keine Haftung für Schäden, Irrtümer oder Datenverluste,
      die dadurch entstehen, dass jemand eine gefälschte Webseite,
      eine Phishing-Seite, eine manipulierte Weiterleitung oder eine fremde Kopie von PIQu nutzt.
    </p>

    <h3>Keine verbindliche Auskunft</h3>
    <p>
      PIQu ist keine amtliche Bekanntmachung, keine Rechtsberatung,
      keine politische Beratung, keine Steuerberatung und keine verbindliche Auskunft.
      Maßgeblich bleiben immer die verlinkten Originalquellen.
    </p>

    <p>
      PIQu übernimmt keine Gewähr für Richtigkeit, Vollständigkeit,
      Aktualität, dauerhafte Verfügbarkeit oder Eignung der dargestellten Informationen
      für einen bestimmten Zweck.
    </p>

    <h3>Fehler in Quellen und Verarbeitung</h3>
    <p>
      Auch offizielle Quellen können Fehler, spätere Änderungen,
      unvollständige Angaben oder missverständliche Formulierungen enthalten.
      PIQu kann solche Fehler übernehmen, wenn sie in den verwendeten Quellen enthalten sind.
    </p>

    <p>
      Die technische Verarbeitung und KI-gestützte Erklärung erfolgen mit Sorgfalt,
      können aber ebenfalls Fehler enthalten.
    </p>

    <h3>Externe Links</h3>
    <p>
      PIQu verlinkt nach Möglichkeit auf offizielle Quellen.
      Beim Anklicken externer Links verlassen Nutzerinnen und Nutzer die PIQu-Seite.
      Für Inhalte, Sicherheit, Verfügbarkeit, spätere Änderungen oder technische Probleme
      externer Webseiten ist der jeweilige Anbieter verantwortlich.
    </p>

    <h3>Nutzung auf eigene Verantwortung</h3>
    <p>
      Nutzerinnen und Nutzer sollten wichtige Informationen immer anhand der Originalquelle prüfen,
      besonders wenn sie daraus rechtliche, finanzielle, berufliche oder sonstige wichtige Entscheidungen ableiten möchten.
      Die Nutzung von PIQu erfolgt auf eigene Verantwortung.
    </p>
  `,



  agb: `
    <h2>Nutzungsbedingungen / AGB</h2>

    <p>
      Diese Nutzungsbedingungen gelten für die Nutzung der PIQu-Webplattform.
      PIQu befindet sich derzeit in einer Beta-Phase.
      Funktionen, Darstellung, Datenbestand und Inhalte können sich ändern.
    </p>

    <h3>1. Zweck der Plattform</h3>
    <p>
      PIQu stellt politische Informationen aus offiziellen Quellen übersichtlicher und verständlicher dar.
      Die Plattform ist ein Informations- und Orientierungsangebot.
    </p>

    <h3>2. Offizielle Adresse und Schutz vor Verwechslung</h3>
    <p>
      Die offizielle PIQu-Adresse lautet:
    </p>

    <p>
      <b>https://piqu.vercel.app</b>
    </p>

    <p>
      Nutzerinnen und Nutzer sind selbst dafür verantwortlich zu prüfen,
      ob sie sich auf der offiziellen PIQu-Seite befinden.
    </p>

    <p>
      PIQu übernimmt keine Haftung für Schäden, Irrtümer, Datenverluste oder sonstige Nachteile,
      die durch gefälschte Webseiten, Phishing-Seiten, manipulierte Weiterleitungen,
      fremde Kopien oder missbräuchliche Nachahmungen von PIQu entstehen.
    </p>

    <h3>3. Keine verbindliche Beratung</h3>
    <p>
      Die Inhalte auf PIQu sind keine Rechtsberatung, keine Steuerberatung,
      keine politische Beratung und keine verbindliche amtliche Auskunft.
      Maßgeblich bleiben immer die Originalquellen.
    </p>

    <h3>4. Keine Gewähr</h3>
    <p>
      PIQu übernimmt keine Gewähr für Richtigkeit, Vollständigkeit,
      Aktualität oder dauerhafte Verfügbarkeit der Inhalte.
      Fehler in offiziellen Quellen, technische Fehler oder KI-Fehler können sich auf die Darstellung auswirken.
    </p>

    <h3>5. Nutzung auf eigene Verantwortung</h3>
    <p>
      Nutzerinnen und Nutzer verwenden PIQu auf eigene Verantwortung.
      Wer wichtige Entscheidungen auf Grundlage politischer Informationen treffen möchte,
      sollte die jeweilige Originalquelle prüfen und bei Bedarf fachkundigen Rat einholen.
    </p>

    <h3>6. Externe Links</h3>
    <p>
      PIQu verlinkt nach Möglichkeit auf offizielle Quellen.
      Beim Anklicken solcher Links verlassen Nutzerinnen und Nutzer die PIQu-Webplattform.
      Für Inhalte, Sicherheit, Verfügbarkeit, spätere Änderungen oder technische Probleme
      externer Webseiten ist der jeweilige Anbieter verantwortlich.
    </p>

    <h3>7. Hinweise auf Fehler oder problematische Inhalte</h3>
    <p>
      Wenn Nutzerinnen oder Nutzer fehlerhafte, veraltete, problematische oder verdächtige Inhalte oder Links entdecken,
      können sie PIQu darüber informieren.
      PIQu wird entsprechende Hinweise prüfen und betroffene Inhalte bei Bedarf korrigieren,
      entfernen oder kennzeichnen.
    </p>

    <h3>8. Änderungen</h3>
    <p>
      PIQu kann diese Nutzungsbedingungen anpassen,
      wenn sich Funktionen, rechtliche Anforderungen oder der Betrieb der Plattform ändern.
    </p>

    <p>
      <b>Hinweis:</b> Diese Nutzungsbedingungen gelten für die PIQu-Beta auf Vercel unter https://piqu.vercel.app.
      Die Kontakt-E-Mail und die Anbieterangaben stehen im Impressum.
    </p>
  `,



  impressum: `
    <h2>Impressum</h2>

    <div class="piqu-legal-card-grid">
      <section class="piqu-legal-card">
        <h3>Diensteanbieter</h3>
        <p class="piqu-legal-note">
          Angaben gemäß gesetzlicher Anbieterkennzeichnung.
        </p>
        <p>
          Johann Eitlhuber<br>
          Weiherweg 13<br>
          96199 Zapfendorf<br>
          Deutschland
        </p>
      </section>

      <section class="piqu-legal-card">
        <h3>Kontakt</h3>
        <p>
          E-Mail:
          <a href="mailto:kontakt.piqu@gmail.com">kontakt.piqu@gmail.com</a><br>
          Telefon: 01520 5139739
        </p>
      </section>

      <section class="piqu-legal-card">
        <h3>Verantwortlich für Inhalte</h3>
        <p class="piqu-legal-note">
          Verantwortlich für journalistisch-redaktionelle Inhalte nach § 18 Abs. 2 MStV.
        </p>
        <p>
          Johann Eitlhuber<br>
          Weiherweg 13<br>
          96199 Zapfendorf<br>
          Deutschland
        </p>
      </section>

      <section class="piqu-legal-card">
        <h3>Offizielle PIQu-Adresse</h3>
        <p>
          <a href="https://piqu.vercel.app" target="_blank" rel="noopener noreferrer">
            https://piqu.vercel.app
          </a>
        </p>
      </section>
    </div>
  `,

  datenschutz: `
    <h2>Datenschutz</h2>

    <p>
      PIQu ist als datensparsame Plattform geplant.
      Ziel ist, so wenig personenbezogene Daten wie möglich zu verarbeiten.
    </p>

    <h3>Aktueller Beta-Stand</h3>
    <p>
      In der aktuellen Beta werden politische Informationen aus offiziellen Quellen angezeigt.
      Es sind keine Nutzerkonten, keine Kommentarfunktion, kein Newsletter,
      kein Kontaktformular, kein Tracking und keine Analysewerkzeuge vorgesehen.
    </p>

    <p>
      Die Funktion „Fehler melden“ öffnet lediglich eine vorbereitete E-Mail
      im E-Mail-Programm der Nutzerin oder des Nutzers.
      PIQu speichert dadurch kein Formular und legt kein Nutzerkonto an.
    </p>

    <h3>Hosting über Vercel</h3>
    <p>
      PIQu wird vorerst über Vercel veröffentlicht.
      Beim Aufruf der Website können technisch notwendige Zugriffsdaten verarbeitet werden,
      zum Beispiel IP-Adresse, Datum und Uhrzeit des Zugriffs, Browserinformationen,
      Geräteinformationen, angeforderte Dateien und Server-Logdaten.
    </p>

    <p>
      Diese Verarbeitung ist technisch erforderlich,
      damit die Website ausgeliefert, geschützt und betrieben werden kann.
      Die offizielle PIQu-Adresse lautet: https://piqu.vercel.app.
    </p>

    <h3>Datenquelle und Backend über Supabase</h3>
    <p>
      PIQu nutzt Supabase zur Speicherung und Bereitstellung politischer Meldungen,
      Termine und Monitor-Daten.
      In Supabase werden nach aktuellem Stand keine Nutzerkonten, keine Kommentare
      und keine von Besucherinnen und Besuchern eingegebenen personenbezogenen Daten gespeichert.
    </p>

    <p>
      Beim Abruf der Meldungen können technisch notwendige Verbindungsdaten an Supabase übertragen werden.
    </p>

    <h3>Keine Cookies, kein Tracking, keine Nutzerprofile</h3>
    <p>
      PIQu setzt in dieser Beta nach aktuellem Stand keine Tracking-Cookies,
      keine Werbe-Cookies, keine Analytics-Werkzeuge und keine Nutzerprofile ein.
      Es gibt keine Anmeldung und keine personalisierte Auswertung des Nutzungsverhaltens.
    </p>

    <h3>Kontakt per E-Mail</h3>
    <p>
      Wenn Nutzerinnen und Nutzer per E-Mail Kontakt aufnehmen,
      werden die dabei übermittelten Daten ausschließlich zur Bearbeitung der Anfrage verarbeitet.
      Dazu können insbesondere E-Mail-Adresse, Name, Inhalt der Nachricht und technische Mail-Kopfdaten gehören.
    </p>

    <p>
      Nutzerinnen und Nutzer sollten keine vertraulichen oder besonders sensiblen Daten senden,
      sofern dies für die Anfrage nicht erforderlich ist.
    </p>

    <h3>Freiwillige Unterstützung über PayPal</h3>
    <p>
      PIQu bietet einen freiwilligen Unterstützungslink über PayPal.Me an.
      Beim Anklicken des Unterstützungslinks verlassen Nutzerinnen und Nutzer die PIQu-Seite
      und werden zu PayPal weitergeleitet.
      Für die Zahlungsabwicklung ist PayPal verantwortlich.
    </p>

    <p>
      Dabei gelten zusätzlich die Datenschutz- und Nutzungsbedingungen von PayPal.
      PIQu erhält keine Zahlungsdaten direkt über die Website.
      Eine Unterstützung ist freiwillig und ohne Gegenleistung.
    </p>

    <h3>Externe Links</h3>
    <p>
      PIQu verlinkt auf externe Webseiten, insbesondere auf offizielle politische Quellen.
      Beim Öffnen dieser Links gelten die Datenschutzregeln der jeweiligen externen Anbieter.
      PIQu hat keinen Einfluss darauf, welche Daten dort verarbeitet werden.
    </p>

    <h3>KI-Verarbeitung</h3>
    <p>
      PIQu nutzt KI zur Verarbeitung und verständlicheren Erklärung offizieller politischer Inhalte.
      Nach aktuellem Konzept werden dafür keine personenbezogenen Nutzerdaten verwendet,
      weil PIQu keine Nutzerkonten, Kommentare oder Kontaktformulare bereitstellt.
    </p>

    <p>
      <b>Hinweis:</b> Diese Datenschutzerklärung gilt für die PIQu-Beta auf Vercel unter https://piqu.vercel.app.
      Die Kontakt-E-Mail und die Anbieterangaben stehen im Impressum.
    </p>
  `,



  kontakt: `
    <h2>Kontakt</h2>

    <p>
      PIQu ist für Hinweise, Fehler, Quellenvorschläge und Rückfragen per E-Mail erreichbar.
    </p>

    <p>
      <b>E-Mail:</b> <a href="mailto:kontakt.piqu@gmail.com">kontakt.piqu@gmail.com</a>
    </p>

    <p>
      Es gibt bewusst kein Kontaktformular, keine Nutzerkonten und keine Kommentarfunktion.
      Dadurch bleibt PIQu datensparsam und technisch einfacher.
    </p>

    <p>
      Bitte sende keine vertraulichen oder besonders sensiblen Daten,
      sofern dies für die Anfrage nicht erforderlich ist.
    </p>
  `,



  spenden: `
    <h2>PIQu freiwillig unterstützen</h2>

    <p>
      PIQu soll kostenlos nutzbar bleiben.
      Gleichzeitig entstehen laufende Kosten,
      zum Beispiel für technische Dienste und KI-gestützte Verarbeitung.
    </p>

    <p>
      Wer PIQu sinnvoll findet, kann das Projekt freiwillig unterstützen.
      Die Unterstützung hilft beim Betrieb und bei der Weiterentwicklung.
    </p>

    <div class="support-box">
      <p>
        <b>Wichtig:</b> Eine Unterstützung ist freiwillig.
        Es gibt keine Gegenleistung, keinen Premiumzugang, kein Abo-Modell
        und keine steuerlich absetzbare Spendenquittung.
      </p>

      ${
        DONATION_URL
          ? `
            <a class="support-button" href="${DONATION_URL}" target="_blank" rel="noopener noreferrer">
              PIQu freiwillig unterstützen
            </a>
          `
          : `
            <button class="support-button support-button-disabled" type="button" disabled>
              Unterstützung wird vorbereitet
            </button>
          `
      }

      <p class="support-smallprint">
        Sobald ein Unterstützungslink eingebunden wird, läuft der Zahlungsprozess
        über einen externen Anbieter. Dann gelten zusätzlich dessen Datenschutz-
        und Nutzungsbedingungen.
      </p>
    </div>

    <p>
      Der Begriff „Spende“ wird bewusst vermieden, solange keine Gemeinnützigkeit besteht.
      PIQu verspricht keine Spendenquittung und keine steuerliche Absetzbarkeit.
    </p>
  `,



  roadmap: `
    <h2>Stand der Beta & Ausblick</h2>

    <div class="roadmap-grid roadmap-modal-grid">
      <div class="roadmap-card done">
        <h3>Bereits aktiv in der Beta</h3>
        <ul>
          <li>Journal mit offiziellen Bundesquellen</li>
          <li>politische Termine im Bundesbereich</li>
          <li>Gesetzesmonitor mit Entwicklung, Fertig / In Kraft und Archiv</li>
          <li>Bundestag/DIP, Bundesrat und BGBl/recht.bund.de als Monitor-Quellen</li>
          <li>verständliche Erklärtexte mit Fakten- und Quellenbereich</li>
          <li>Datumsbalken für Tagesmeldungen</li>
          <li>Fehler melden per vorbereiteter E-Mail</li>
          <li>freiwilliger Unterstützungsbereich</li>
        </ul>
      </div>

      <div class="roadmap-card progress">
        <h3>Wird laufend verbessert</h3>
        <ul>
          <li>Datenqualität und automatische Zuordnung</li>
          <li>verständlichere Erklärtexte</li>
          <li>Quellenprüfung und Statuslogik im Gesetzesmonitor</li>
          <li>Admin-Kontrolle im Hintergrund</li>
          <li>Bedienkomfort auf Handy und Desktop</li>
          <li>rechtliche Hinweise und Transparenztexte</li>
        </ul>
      </div>

      <div class="roadmap-card later">
        <h3>Später geplant</h3>
        <ul>
          <li>Bundesländer</li>
          <li>Landkreise</li>
          <li>Gemeinden</li>
          <li>Teilen-Funktion / Kurz-Karten</li>
          <li>persönliche Einstellungen für Standardansicht</li>
        </ul>
      </div>
    </div>
  `


};

/* =========================
   BASIS-HELFER
========================= */

function escapeHTML(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function zeigeText(value) {
  return escapeHTML(value || "Noch nicht verfügbar");
}

function hatText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function safeDomId(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function domainAusUrl(urlRaw) {
  try {
    const url = new URL(String(urlRaw || ""));
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function slugAusUrl(urlRaw) {
  try {
    const url = new URL(String(urlRaw || ""));
    const teile = url.pathname
      .split("/")
      .map(x => x.trim())
      .filter(Boolean);

    let letzterTeil = teile[teile.length - 1] || "";

    letzterTeil = decodeURIComponent(letzterTeil)
      .replace(/\.html?$/i, "")
      .replace(/\.pdf$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!letzterTeil) return "";

    return kuerzePlainText(letzterTeil, 70);
  } catch {
    return "";
  }
}

function kurzQuellenLabel(urlRaw, fallbackLabel) {
  const domain = domainAusUrl(urlRaw);
  const slug = slugAusUrl(urlRaw);

  if (hatText(fallbackLabel) && fallbackLabel !== "Originalquelle öffnen") {
    return fallbackLabel;
  }

  if (domain && slug) {
    return `${domain} · ${slug}`;
  }

  if (domain) {
    return domain;
  }

  return fallbackLabel || "Quelle öffnen";
}

function linkZielHinweis(urlRaw) {
  const domain = domainAusUrl(urlRaw);
  if (!domain) return "";

  return `<span class="qpi-link-target">(führt zu: ${escapeHTML(domain)})</span>`;
}

function renderQuellenLink(urlRaw, labelRaw, klasseRaw = "") {
  if (!hatText(urlRaw)) return "";

  const klasse = hatText(klasseRaw) ? ` class="${escapeHTML(klasseRaw)}"` : "";
  const label = escapeHTML(labelRaw || "Quelle öffnen");

  return `<a${klasse} href="${escapeHTML(urlRaw)}" target="_blank" rel="noopener noreferrer">${label}</a> ${linkZielHinweis(urlRaw)}`;
}

function kuerzePlainText(text, max) {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max).trim();
  const lastStop = Math.max(
    cut.lastIndexOf("."),
    cut.lastIndexOf("!"),
    cut.lastIndexOf("?")
  );

  if (lastStop > 80) {
    return cut.slice(0, lastStop + 1);
  }

  return cut + "…";
}

function textAbsatz(text) {
  if (!hatText(text)) return "";
  return `<p>${escapeHTML(text.trim())}</p>`;
}

function ersterText(...werte) {
  for (const wert of werte) {
    if (hatText(wert)) return wert.trim();
  }

  return "";
}

function textWirktUnfertig(value) {
  const text = String(value || "").trim().toLowerCase();

  if (!text) return true;

  const muster = [
    "keine verarbeitbaren informationen",
    "nicht verarbeitbar",
    "noch kein zusammenhängender journaltext",
    "noch nicht verfügbar",
    "noch keine kurzfassung verfügbar",
    "noch keine konkrete piqu-erklärung",
    "nicht eindeutig erkennbar",
    "noch nicht eindeutig erkannt",
    "noch nicht sicher erkennbar",
    "wird vorbereitet"
  ];

  return muster.some(m => text.includes(m));
}

function istGuterText(value) {
  return hatText(value) && !textWirktUnfertig(value);
}

function renderNachreichHinweis(titel, bereich) {
  return `
    <div class="piqu-pending-box">
      <h4>${escapeHTML(titel || "Dieser Bereich wird noch ergänzt")}</h4>
      <p>
        PIQu konnte den Bereich „${escapeHTML(bereich || "Inhalt")}“ zu dieser Meldung noch nicht vollständig aus den offiziellen Quellen aufbereiten.
        Die vorhandenen Fakten und Quellen bleiben sichtbar.
        Der fehlende Inhalt wird nachgetragen, sobald die Verarbeitung abgeschlossen ist.
      </p>
    </div>
  `;
}

function formatDatum(datumString) {
  const d = new Date(datumString);

  if (isNaN(d.getTime())) {
    return "ohne Datum";
  }

  return d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function formatDatumKurz(datumString) {
  const d = new Date(datumString);

  if (isNaN(d.getTime())) {
    return "ohne Datum";
  }

  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function formatDatumLangMitWochentag(datumString) {
  const d = new Date(datumString);

  if (isNaN(d.getTime())) {
    return "ohne Datum";
  }

  return d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function lokalesDatumsObjekt(datumString) {
  if (!datumString) return null;

  const teile = String(datumString).split("T")[0].split("-").map(Number);
  if (teile.length !== 3 || teile.some(Number.isNaN)) return null;

  return new Date(teile[0], teile[1] - 1, teile[2]);
}

function istZukuenftigesDatum(datumString) {
  const datum = lokalesDatumsObjekt(datumString);
  if (!datum) return false;

  const heute = new Date();
  const heuteNurDatum = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate());

  return datum.getTime() > heuteNurDatum.getTime();
}

function istZukuenftigerBundesratTop(n) {
  return Boolean(n && n.ist_bundesrat_top && istZukuenftigesDatum(n.datum));
}

function bereinigeTopTitel(titelRaw) {
  return String(titelRaw || "")
    .replace(/^TOP\s+\d+\s*[:.-]?\s*/i, "")
    .trim();
}

function baueZukunftsBundesratEinleitung(n) {
  const datum = formatDatumLangMitWochentag(n.datum);
  const titel = bereinigeTopTitel(n.top_titel || n.title || "diesem Tagesordnungspunkt");
  const statusText = statusBundesratLabel(n.status_normiert);

  const saetze = [
    `Laut Tagesordnung wird sich der Bundesrat in seiner Sitzung am ${datum} mit ${titel} befassen.`,
    n.top_nummer ? `Der Vorgang steht dort als TOP ${n.top_nummer}.` : "",
    statusText ? `Der sichtbare Verfahrensstand lautet: ${statusText}.` : "",
    "Da die Sitzung noch bevorsteht, ist das noch kein abgeschlossener Beschluss. Die Tagesordnung und der genaue Ablauf können sich bis zur Sitzung noch ändern."
  ];

  return saetze.filter(Boolean).join(" ");
}

function baueZukunftsJournalArtikel(n, gespeicherterArtikel) {
  const abschnitte = [];
  abschnitte.push(baueZukunftsBundesratEinleitung(n));

  const vorhandeneAbschnitte = String(gespeicherterArtikel || "")
    .split(/\n+/)
    .map(absatz => absatz.trim())
    .filter(Boolean);

  // Den ersten gespeicherten Absatz lassen wir bewusst weg, weil er bei zukünftigen
  // Bundesrat-Sitzungen oft fälschlich in der Vergangenheitsform formuliert ist
  // („hat sich befasst“, „hat überwiesen“). Die folgenden Absätze enthalten meist
  // die eigentliche Sachinformation und bleiben erhalten.
  const sachAbschnitte = vorhandeneAbschnitte.slice(1);

  if (sachAbschnitte.length > 0) {
    sachAbschnitte.forEach(absatz => abschnitte.push(absatz));
  } else {
    const ziel = ersterText(n.ki_ziel, n.ki_warum);
    const betroffen = ersterText(n.ki_betroffen);
    const buerger = ersterText(n.ki_buergerauswirkung);

    if (istGuterText(ziel)) abschnitte.push(ziel);
    if (istGuterText(betroffen)) abschnitte.push(betroffen);
    if (istGuterText(buerger)) abschnitte.push(buerger);
  }

  return abschnitte
    .filter(istGuterText)
    .map(absatz => textAbsatz(absatz))
    .join("");
}

function formatUhrzeit(timestamp) {
  if (!timestamp) return "noch nicht verfügbar";

  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return "noch nicht verfügbar";

  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function istHeute(datumString) {
  const heute = new Date().toISOString().split("T")[0];
  return datumString === heute;
}

function istInnerhalb30Tage(datumString) {
  if (!datumString) return false;

  const datum = new Date(datumString);
  if (isNaN(datum.getTime())) return false;

  const grenze = new Date();
  grenze.setDate(grenze.getDate() - 30);

  return datum >= grenze;
}

function normalisiereArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (err) {
      return value.split(",").map(x => x.trim()).filter(Boolean);
    }
  }

  return [];
}

function normalisiereThemen(value) {
  return normalisiereArray(value);
}

/* =========================
   QUELLEN / STATUS
========================= */

function ermittleQuelleTyp(n) {
  if (n.quelle_typ) {
    return String(n.quelle_typ).toLowerCase();
  }

  const text = `${n.quelle || ""} ${n.quelle_url || ""}`.toLowerCase();

  if (text.includes("bundesrat")) return "bundesrat";
  if (text.includes("bundesregierung")) return "bundesregierung";
  if (text.includes("bundestag")) return "bundestag";

  return "unbekannt";
}

function quelleLabel(key) {
  if (key === "bundestag") return "Bundestag";
  if (key === "bundesrat") return "Bundesrat";
  if (key === "bundesregierung") return "Bundesregierung";
  return "Unbekannte Quelle";
}

function statusLabel(key) {
  if (key === "beschluss") return "Beschluss";
  if (key === "anhoerung") return "Anhörung";
  if (key === "termin") return "Termin";
  if (key === "reise") return "Reise";
  if (key === "bericht") return "Bericht";
  if (key === "in_planung") return "In Planung";
  if (key === "sonstiges") return "Sonstiges";
  return key || "Unbekannt";
}

function statusBundesratLabel(key) {
  if (key === "zugestimmt") return "Zugestimmt";
  if (key === "keine_mehrheit") return "Keine Mehrheit / Zustimmung versagt";
  if (key === "kein_vermittlungsausschuss") return "Kein Vermittlungsausschuss";
  if (key === "keine_einwendungen") return "Keine Einwendungen";
  if (key === "stellungnahme") return "Stellungnahme";
  if (key === "ausschusszuweisung") return "Ausschusszuweisung";
  if (key === "angenommen") return "Angenommen";
  if (key === "angenommen_geaendert") return "Angenommen mit Änderungen";
  if (key === "abgesetzt") return "Abgesetzt";
  if (key === "einbringung") return "Einbringung";
  if (key === "einbringung_abgelehnt") return "Einbringung abgelehnt";
  if (key === "antragsgemaess") return "Antragsgemäß";
  if (key === "entschliessung") return "Entschließung";
  return key || "Unbekannt";
}

function statusKlasse(n) {
  const status = n.ist_bundesrat_top ? n.status_normiert : n.status;

  if (
    status === "zugestimmt" ||
    status === "angenommen" ||
    status === "angenommen_geaendert" ||
    status === "keine_einwendungen" ||
    status === "antragsgemaess"
  ) {
    return "status-positive";
  }

  if (
    status === "keine_mehrheit" ||
    status === "abgelehnt" ||
    status === "einbringung_abgelehnt"
  ) {
    return "status-negative";
  }

  if (status === "abgesetzt") {
    return "status-neutral";
  }

  if (
    status === "ausschusszuweisung" ||
    status === "einbringung" ||
    status === "kein_vermittlungsausschuss" ||
    status === "vermittlungsausschuss"
  ) {
    return "status-process";
  }

  if (status === "stellungnahme" || status === "entschliessung") {
    return "status-info";
  }

  return "status-default";
}

function istUnsicher(n) {
  return (
    n.needs_review === true ||
    n.extraction_method === "ai_failed" ||
    n.extraction_method === "ai_needs_review"
  );
}

/* =========================
   TAGS / QUELLENANZEIGE
========================= */

function renderTags(n) {
  const themen = normalisiereThemen(n.darum_gehts);

  if (themen.length === 0) {
    return `<span class="tag tag-default">Keine Themen erkannt</span>`;
  }

  return themen.map(themaRaw => {
    const thema = String(themaRaw);
    let klasse = "tag-default";

    if (thema.includes("Gesundheit")) klasse = "tag-health";
    else if (thema.includes("Wirtschaft")) klasse = "tag-economy";
    else if (thema.includes("Verteidigung") || thema.includes("Bundeswehr")) klasse = "tag-defense";
    else if (thema.includes("Bildung")) klasse = "tag-education";
    else if (thema.includes("Umwelt") || thema.includes("Klima")) klasse = "tag-environment";
    else if (thema.includes("Gesetzgebung") || thema.includes("Recht")) klasse = "tag-law";
    else if (thema.includes("Parlamentarismus")) klasse = "tag-politics";
    else if (thema.includes("Bundesrat")) klasse = "tag-politics";

    return `<span class="tag ${klasse}">${escapeHTML(thema)}</span>`;
  }).join(" ");
}

function renderQuellenInfo(n) {
  const teile = [];

  if (n.quelle) {
    teile.push(escapeHTML(n.quelle));
  } else {
    teile.push(escapeHTML(quelleLabel(ermittleQuelleTyp(n))));
  }

  if (n.quelle_typ === "bundesrat" && n.sitzung) {
    teile.push(`${escapeHTML(n.sitzung)}. Sitzung`);
  }

  if (n.quelle_typ === "bundesrat" && n.top_nummer) {
    teile.push(`TOP ${escapeHTML(n.top_nummer)}`);
  }

  return teile.join(" · ");
}

function renderOffizielleQuellen(n) {
  const links = [];

  if (n.quelle_url) {
    links.push({
      label: kurzQuellenLabel(
        n.quelle_url,
        n.ist_bundesrat_top
          ? `Bundesrat · TOP ${n.top_nummer || ""}`
          : n.title || "Originalquelle"
      ),
      url: n.quelle_url
    });
  }

  if (n.dip_url) {
    links.push({
      label: kurzQuellenLabel(n.dip_url, "DIP · Vorgang"),
      url: n.dip_url
    });
  }

  if (n.plenarprotokoll_url) {
    links.push({
      label: kurzQuellenLabel(n.plenarprotokoll_url, "Bundesrat · Plenarprotokoll"),
      url: n.plenarprotokoll_url
    });
  }

  if (links.length === 0) {
    return `<p class="muted-text">Keine Originalquelle vorhanden.</p>`;
  }

  return `
    <ul class="qpi-source-list">
      ${links.map(link => `
        <li>
          ${renderQuellenLink(link.url, link.label)}
          <br>
          <span class="source-url-short">${escapeHTML(domainAusUrl(link.url))}</span>
        </li>
      `).join("")}
    </ul>
  `;
}

function renderZusatzquellen(n) {
  const quellen = normalisiereArray(n.ki_quellen);

  if (quellen.length === 0) {
    return "";
  }

  return `
    <h4>Zusatzquellen</h4>
    <p class="muted-text">
      Diese Quellen sind zusätzliche Hinweise. Maßgeblich bleiben die offiziellen Originalquellen.
    </p>
    <ul class="qpi-source-list">
      ${quellen.map(q => {
        if (typeof q === "string") {
          return `<li>${escapeHTML(q)}</li>`;
        }

        const label = q.label || q.title || q.name || "Zusatzquelle";
        const url = q.url || "";

        return `
          <li>
            ${
              url
                ? renderQuellenLink(url, label)
                : escapeHTML(label)
            }
          </li>
        `;
      }).join("")}
    </ul>
  `;
}

function renderZusatzinfos(n) {
  const infos = normalisiereArray(n.ki_zusatzinfos);

  if (infos.length === 0) {
    return "";
  }

  return `
    <h4>Zusatzinfos</h4>
    <ul class="qpi-info-list">
      ${infos.map(info => {
        if (typeof info === "string") {
          return `<li>${escapeHTML(info)}</li>`;
        }

        return `<li>${escapeHTML(JSON.stringify(info))}</li>`;
      }).join("")}
    </ul>
  `;
}

/* =========================
   TEXTFALLBACKS
========================= */

function renderKurztext(n) {
  if (istUnsicher(n)) {
    return "Dieser Kurztext wird noch ergänzt.";
  }

  const text = ersterText(n.ki_kurz, n.kurz, n.ki_erklaerung);

  if (!istGuterText(text)) {
    return "Dieser Kurztext wird noch ergänzt.";
  }

  return text;
}

function renderOriginalAuszug(n) {
  if (istUnsicher(n)) {
    return "";
  }

  return n.original_text || "Kein Originalauszug verfügbar";
}

function renderStatusText(n, statusTextRaw) {
  const text = ersterText(n.ki_status_erklaerung, n.ki_status_text);

  if (text) return text;

  if (n.ist_bundesrat_top) {
    return `Offizieller Bundesrat-Status: ${statusTextRaw}. Eine ausführlichere Erklärung wird vorbereitet.`;
  }

  return `PIQu ordnet diese Meldung aktuell als „${statusTextRaw}“ ein. Eine genauere Erklärung wird vorbereitet.`;
}

function renderKIQualitaetsHinweis(n) {
  const detailStatus = n.ki_detail_status || n.ki_enriched_status || "";

  if (detailStatus === "ok" || detailStatus === "done") {
    return `
      <div class="safe-box">
        Diese Erklärung wurde KI-gestützt aus offiziellen Quellen erzeugt.
        PIQu bewertet keine Parteien und erzeugt keine Meinung.
        Maßgeblich bleibt immer die Originalquelle.
      </div>
    `;
  }

  if (detailStatus === "needs_review") {
    return `
      <div class="warning-box">
        ⚠ Eingeschränkte Erklärung<br>
        Die offiziellen Ausgangsdaten enthalten nur wenige Details.
        PIQu zeigt deshalb eine vorsichtige Erklärung und markiert diese Meldung zur Prüfung.
      </div>
    `;
  }

  if (n.ist_bundesrat_top && n.ki_enriched_at) {
    return `
      <div class="safe-box">
        Bundesrat-TOP aus offizieller Quelle. Die Erklärung basiert auf gespeicherten PIQu-Zusatzinformationen.
        Maßgeblich bleiben die verlinkten Originalquellen.
      </div>
    `;
  }

  return `
    <div class="warning-box">
      Diese Meldung wurde noch nicht vollständig nach dem neuen PIQu-Erklärschema angereichert.
      PIQu zeigt deshalb vorhandene Basisdaten und vorsichtige Hinweise.
    </div>
  `;
}

function renderSicherheitsHinweis(n) {
  if (n.ist_bundesrat_top) {
    return `
      <div class="safe-box">
        Bundesrat-TOP aus offizieller Tagesordnung/Beschlussübersicht · nur geprüfte TOPs sichtbar
      </div>
    `;
  }

  if (!istUnsicher(n)) {
    if (n.extraction_method === "ai") {
      return `
        <div class="safe-box">
          KI-Auszug geprüft · Sicherheit: ${escapeHTML(n.extraction_confidence || "-")}%
        </div>
      `;
    }

    return `
      <div class="safe-box">
        Originalmeldung aus offizieller Quelle · keine unsichere Auswertung markiert
      </div>
    `;
  }

  return `
    <div class="warning-box">
      ⚠ Auszug unsicher<br>
      PIQu konnte diese Meldung noch nicht zuverlässig auswerten.
      Bitte öffne bei Bedarf die Originalquelle.
    </div>
  `;
}

/* =========================
   PIQU-ERKLÄRSCHEMA
========================= */

function holeErklaerText(n, feld) {
  if (feld === "kurz") {
    return ersterText(n.ki_kurz, n.kurz, n.ki_erklaerung);
  }

  if (feld === "was_passiert") {
    return ersterText(
      n.ki_was_passiert,
      n.ist_bundesrat_top
        ? `Der Bundesrat hat TOP ${n.top_nummer || "-"} in der ${n.sitzung || "-"}. Sitzung behandelt. Der gemeldete Status lautet: ${statusBundesratLabel(n.status_normiert)}.`
        : ""
    );
  }

  if (feld === "warum") return ersterText(n.ki_warum);
  if (feld === "ziel") return ersterText(n.ki_ziel);
  if (feld === "betroffen") return ersterText(n.ki_betroffen);
  if (feld === "buerger") return ersterText(n.ki_buergerauswirkung);
  if (feld === "naechster_schritt") return ersterText(n.ki_naechster_schritt);

  return "";
}

function renderKIFeld(titel, text, fallback) {
  const hatInhalt = istGuterText(text);

  if (!hatInhalt) {
    return renderNachreichHinweis(
      `${titel} wird noch ergänzt`,
      titel
    );
  }

  return `
    <div class="qpi-ai-field qpi-ai-field-filled">
      <h4>${escapeHTML(titel)}</h4>
      <p>${escapeHTML(text)}</p>
    </div>
  `;
}

function renderEinheitsErklaerung(n, statusTextRaw) {
  return `
    <div class="bundesrat-explain-box qpi-explain-box">
      ${renderKIFeld("Kurz erklärt", holeErklaerText(n, "kurz"), "Für diese Meldung ist noch keine Kurzfassung verfügbar.")}
      ${renderKIFeld("Was ist konkret passiert?", holeErklaerText(n, "was_passiert"), "Für diese Meldung wurde noch keine konkrete PIQu-Erklärung erstellt.")}
      ${renderKIFeld("Warum passiert das?", holeErklaerText(n, "warum"), "Aus der offiziellen Quelle ist der Hintergrund noch nicht eindeutig erkennbar.")}
      ${renderKIFeld("Was soll es bewirken?", holeErklaerText(n, "ziel"), "Die beabsichtigte Wirkung wird in der gespeicherten Quelle noch nicht eindeutig erklärt.")}
      ${renderKIFeld("Wen betrifft das?", holeErklaerText(n, "betroffen"), "Noch nicht eindeutig erkannt, welche Gruppen, Behörden, Bürger oder Bereiche betroffen sind.")}
      ${renderKIFeld("Hat das Auswirkungen auf Bürger?", holeErklaerText(n, "buerger"), "Noch nicht sicher erkennbar, ob Bürger direkt betroffen sind oder ob es zunächst nur ein politischer Verfahrensschritt ist.")}

      <div class="qpi-ai-field qpi-ai-status-field">
        <h4>Aktueller Stand</h4>
        <div class="bundesrat-status-explain ${statusKlasse(n)}">
          ${escapeHTML(renderStatusText(n, statusTextRaw))}
        </div>
      </div>

      ${renderKIFeld("Was passiert als Nächstes?", holeErklaerText(n, "naechster_schritt"), "Der nächste Schritt geht aus der bisher gespeicherten Quelle noch nicht eindeutig hervor.")}

      <h4>Offizielle Quellen</h4>
      ${renderOffizielleQuellen(n)}
      ${renderZusatzquellen(n)}
      ${renderZusatzinfos(n)}
      ${renderKIQualitaetsHinweis(n)}
    </div>
  `;
}

/* =========================
   BASISDATEN LINKS
========================= */

function renderEinheitsBasisdaten(n, datumText, statusTextRaw, quelleTyp, drucksachen, originalText, unsicher, enthaeltZitat) {
  if (n.ist_bundesrat_top) {
    return `
      <div class="bundesrat-facts-box qpi-facts-box">
        <h4>Harte Basisdaten</h4>

        <p><b>Quelle:</b> Bundesrat</p>
        <p><b>Sitzung:</b> ${escapeHTML(n.sitzung || "-")}</p>
        <p><b>TOP:</b> ${escapeHTML(n.top_nummer || "-")}</p>
        <p><b>Datum:</b> ${datumText}</p>
        <p><b>Titel:</b> ${zeigeText(n.top_titel || n.title || "Ohne Titel")}</p>
        <p><b>Status:</b> ${escapeHTML(statusTextRaw)}</p>

        ${n.beschlusstenor ? `<p><b>Beschlusstenor:</b> ${zeigeText(n.beschlusstenor)}</p>` : ""}

        ${
          drucksachen.length > 0
            ? `<p><b>Drucksachen:</b> ${escapeHTML(drucksachen.join(", "))}</p>`
            : `<p><b>Drucksachen:</b> nicht erkannt</p>`
        }

        ${
          n.quelle_url
            ? `
              <p>
                <b>Originalquelle:</b>
                ${renderQuellenLink(n.quelle_url, "öffnen")}
              </p>
            `
            : `<p><b>Originalquelle:</b> nicht vorhanden</p>`
        }

        <div class="original-text-box qpi-original-visible">
          <b>Originalauszug / Basistext:</b><br>
          ${originalText}
        </div>
      </div>
    `;
  }

  return `
    <div class="bundesrat-facts-box qpi-facts-box">
      <h4>Harte Basisdaten</h4>

      <p><b>Quelle:</b> ${escapeHTML(quelleLabel(quelleTyp))}</p>
      <p><b>Datum:</b> ${datumText}</p>
      <p><b>Titel:</b> ${zeigeText(n.title || "Ohne Titel")}</p>
      <p><b>Typ/Status:</b> ${escapeHTML(statusTextRaw)}</p>

      <p>
        <b>Originalquelle:</b>
        ${
          n.quelle_url
            ? renderQuellenLink(n.quelle_url, "öffnen")
            : "nicht vorhanden"
        }
      </p>

      ${renderSicherheitsHinweis(n)}

    </div>
  `;
}

/* =========================
   ORIGINALDATEN-KARTE
========================= */

function renderEinheitskarte(n) {
  const quelleTyp = ermittleQuelleTyp(n);

  const titel = zeigeText(n.title || "Ohne Titel");
  const kurz = zeigeText(renderKurztext(n));
  const originalText = zeigeText(renderOriginalAuszug(n));

  const statusTextRaw = n.ist_bundesrat_top
    ? statusBundesratLabel(n.status_normiert)
    : statusLabel(n.status);

  const status = zeigeText(statusTextRaw);

  const datumText = n.ist_bundesrat_top
    ? zeigeText(formatDatumKurz(n.datum))
    : zeigeText(n.datum || "-");

  const enthaeltZitat = Boolean(n.enthaelt_zitat);
  const unsicher = istUnsicher(n);
  const drucksachen = normalisiereArray(n.drucksachen);

  const card = document.createElement("article");
  card.className = "card qpi-unified-card";
  card.id = `meldung-${safeDomId(n.id || n.title)}`;

  if (unsicher) {
    card.classList.add("card-unsafe");
  }

  if (n.ist_bundesrat_top) {
    card.classList.add("card-bundesrat-top");
  }

  const top = document.createElement("div");
  top.className = "card-top";

  top.innerHTML = `
    <button class="card-journal-top-btn" type="button">
      📰 Journal
    </button>

    <h3>${titel}</h3>

    <p class="source-line">${renderQuellenInfo(n)}</p>

    <div class="card-meta">
      <span class="meta-pill source-pill">${escapeHTML(quelleLabel(quelleTyp))}</span>
      <span class="meta-pill status-pill ${statusKlasse(n)}">${status}</span>
      <span class="meta-pill">${datumText}</span>
    </div>

    <div>${renderTags(n)}</div>

    ${unsicher ? `<div class="mini-warning">⚠ Auszug unsicher</div>` : ""}

    <p class="summary-label">Was ist passiert?</p>
    <p class="card-summary">${kurz}</p>
  `;

  const details = document.createElement("div");
  details.className = "card-details";

  details.innerHTML = `
    <div class="bundesrat-two-column qpi-two-column">
      ${renderEinheitsBasisdaten(
        n,
        datumText,
        statusTextRaw,
        quelleTyp,
        drucksachen,
        originalText,
        unsicher,
        enthaeltZitat
      )}

      ${renderEinheitsErklaerung(n, statusTextRaw)}
    </div>

    <div class="qpi-detail-actions">
      <button class="journal-link-btn" type="button">
        📰 Im Journal lesen
      </button>
    </div>

    <p>
      <small>
        PIQu trennt harte Originaldaten von verständlicher Erklärung.
        Links stehen die Basisdaten und Originalquellen, rechts die neutrale Erklärung.
      </small>
    </p>
  `;

  const originalButton = details.querySelector(".original-toggle-btn");
  const originalBox = details.querySelector(".original-text-box");
  const journalButton = details.querySelector(".journal-link-btn");
  const journalTopButton = top.querySelector(".card-journal-top-btn");

  if (journalTopButton) {
    journalTopButton.addEventListener("click", event => {
      event.stopPropagation();

      zielJournalId = n.id || n.title;
      zielMeldungId = null;
      aktiveAnsicht = "journal";

      baueAnsichtsUmschalter();
      renderNews();
    });
  }

  if (journalButton) {
    journalButton.addEventListener("click", event => {
      event.stopPropagation();

      zielJournalId = n.id || n.title;
      zielMeldungId = null;
      aktiveAnsicht = "journal";

      baueAnsichtsUmschalter();
      renderNews();
    });
  }

  if (originalButton && originalBox) {
    originalButton.addEventListener("click", event => {
      event.stopPropagation();

      const istOffen = originalBox.style.display === "block";
      originalBox.style.display = istOffen ? "none" : "block";
      originalButton.textContent = istOffen
        ? "Originalauszug anzeigen"
        : "Originalauszug ausblenden";
    });
  }

  top.onclick = () => {
    const istOffen = details.style.display === "block";

    details.style.display = istOffen ? "none" : "block";

    if (istOffen) {
      card.classList.remove("card-open");
    } else {
      card.classList.add("card-open");
    }
  };

  card.appendChild(top);
  card.appendChild(details);

  return card;
}

/* =========================
   FILTER / NAVIGATION
========================= */

function baueAnsichtsUmschalter() {
  const container = document.getElementById("view-filters");
  if (!container) return;

  container.querySelectorAll(".view-btn").forEach(btn => {
    const view = btn.dataset.view || "journal";

    btn.classList.toggle("active", view === aktiveAnsicht);

    btn.onclick = () => {
      aktiveAnsicht = view;
      zielMeldungId = null;
      zielJournalId = null;
      zielJournalIdAlternativen = [];
      baueAnsichtsUmschalter();
      renderNews();
    };
  });
}

function baueEbenenNavigation() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.onclick = () => {
      aktiveEbene = btn.dataset.ebene || "bund";

      document.querySelectorAll(".nav-btn").forEach(b => {
        b.classList.remove("active");
      });

      btn.classList.add("active");
      renderNews();
    };
  });
}

function baueQuellenFilter() {
  const container = document.getElementById("source-filters");
  if (!container) return;

  container.innerHTML = "";

  quellenListe.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "source-btn";

    if (q.key === aktiveQuelle) {
      btn.classList.add("active");
    }

    btn.textContent = q.label;

    btn.onclick = () => {
      aktiveQuelle = q.key;
      baueQuellenFilter();
      renderNews();
    };

    container.appendChild(btn);
  });
}

function baueFilter() {
  const filters = document.getElementById("filters");
  if (!filters) return;

  filters.innerHTML = "";

  filterListe.forEach(f => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";

    if (f.key === aktiverFilter) {
      btn.classList.add("active");
    }

    btn.textContent = f.label;

    btn.onclick = () => {
      aktiverFilter = f.key;
      baueFilter();
      renderNews();
    };

    filters.appendChild(btn);
  });
}

/* =========================
   SORTIERUNG / DARSTELLUNG
========================= */

function gruppiereNachDatum(news) {
  const gruppen = {};

  news.forEach(n => {
    const datum = n.datum || "ohne-datum";
    if (!gruppen[datum]) gruppen[datum] = [];
    gruppen[datum].push(n);
  });

  return gruppen;
}

function sortiereNewsListe(news) {
  return [...news].sort((a, b) => {
    const datumA = new Date(a.datum || 0).getTime();
    const datumB = new Date(b.datum || 0).getTime();

    if (datumB !== datumA) return datumB - datumA;

    const sitzungA = Number(a.sitzung || 0);
    const sitzungB = Number(b.sitzung || 0);

    if (sitzungB !== sitzungA) return sitzungB - sitzungA;

    const topA = Number(a.top_nummer || 9999);
    const topB = Number(b.top_nummer || 9999);

    if (topA !== topB) return topA - topB;

    return String(a.title || "").localeCompare(String(b.title || ""), "de");
  });
}

function aktualisiereLevelInfo() {
  const info = document.getElementById("level-info");
  if (!info) return;

  if (aktiveEbene === "bund") {
    info.innerHTML = `
      <b>Ebene:</b> Bund<br>
      <b>Aktive Quellenstruktur:</b> Bundestag, Bundesrat, Bundesregierung<br>
      <b>Aktuell verarbeitet:</b> offizielle Bundesquellen der letzten 30 Tage
    `;
  } else if (aktiveEbene === "land") {
    info.innerHTML = `
      <b>Ebene:</b> Land<br>
      Diese Ebene ist vorbereitet, aber noch nicht aktiv.
      Später sollen hier offizielle Informationen der Bundesländer erscheinen.
    `;
  } else if (aktiveEbene === "landkreis") {
    info.innerHTML = `
      <b>Ebene:</b> Landkreis<br>
      Diese Ebene ist vorbereitet, aber noch nicht aktiv.
      Später sollen hier regionale politische Informationen erscheinen.
    `;
  } else if (aktiveEbene === "gemeinde") {
    info.innerHTML = `
      <b>Ebene:</b> Gemeinde<br>
      Diese Ebene ist vorbereitet, aber noch nicht aktiv.
      Später sollen hier lokale politische Informationen erscheinen.
    `;
  }
}

function zeigeBundesratVertrauensHinweis(app) {
  if (!app) return;

  const bundesratSichtbar =
    aktiveEbene === "bund" &&
    (aktiveQuelle === "alle" || aktiveQuelle === "bundesrat");

  if (!bundesratSichtbar) return;

  const box = document.createElement("div");
  box.className = "bundesrat-trust-box";

  box.innerHTML = `
    <b>Bundesrat-Hinweis:</b><br>
    PIQu zeigt hier nur Tagesordnungspunkte, die automatisch eindeutig aus offiziellen Bundesrat-Daten ausgelesen wurden.
    Unsichere oder unvollständige Einträge werden nicht öffentlich angezeigt.
  `;

  app.appendChild(box);
}

function zeigeLeerenZustand(app) {
  if (aktiveEbene !== "bund") {
    app.innerHTML = `
      <div class="empty-state">
        <h3>Diese Ebene ist vorbereitet.</h3>
        <p>
          Aktuell verarbeitet PIQu noch keine Meldungen für diese Ebene.
          Der Fokus der Beta liegt zuerst auf dem Bundesbereich.
        </p>
      </div>
    `;
    return;
  }

  if (aktiveQuelle !== "alle") {
    app.innerHTML = `
      <div class="empty-state">
        <h3>Keine Meldungen für ${quelleLabel(aktiveQuelle)} gefunden.</h3>
        <p>
          Für diese Auswahl sind aktuell keine Meldungen sichtbar.
          Prüfe einen anderen Filter oder aktualisiere die Daten später erneut.
        </p>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="empty-state">
      <h3>Keine Meldungen gefunden.</h3>
      <p>
        Für die aktuelle Auswahl sind keine Meldungen verfügbar.
        Prüfe später erneut oder wähle einen anderen Filter.
      </p>
    </div>
  `;
}

function istZukunftsMeldung(n) {
  if (!n || !n.datum) return false;
  return istZukuenftigesDatum(n.datum);
}


function journalZielIdsAktiv() {
  return [zielJournalId, ...zielJournalIdAlternativen]
    .map(x => String(x || "").trim())
    .filter(Boolean);
}

function journalMeldungPasstZuZiel(n, zielIdsRaw) {
  const zielIds = (zielIdsRaw || [])
    .map(x => String(x || "").trim())
    .filter(Boolean);

  if (!n || zielIds.length === 0) return false;

  const kandidaten = [
    n.id,
    n.title,
    n.news_id,
    n.bundesrat_top_id,
    n.top_id,
    n.top_nummer,
    n.bundesrat_top_id ? `bundesrat-db-${n.bundesrat_top_id}` : "",
    n.top_id ? `bundesrat-db-${n.top_id}` : "",
    n.top_nummer ? `bundesrat-${n.sitzung || ""}-${n.top_nummer}` : ""
  ]
    .map(x => String(x || "").trim())
    .filter(Boolean);

  return zielIds.some(zielId => kandidaten.includes(zielId));
}

function ergaenzeZielmeldungWennGefiltert(news) {
  const zielIds = journalZielIdsAktiv();
  if (zielIds.length === 0) return news;

  const istSchonDrin = news.some(n => journalMeldungPasstZuZiel(n, zielIds));
  if (istSchonDrin) return news;

  const ziel = alleNews.find(n =>
    n &&
    n.ebene === aktiveEbene &&
    journalMeldungPasstZuZiel(n, zielIds)
  );

  if (!ziel) return news;

  return [ziel, ...news];
}

function ermittleGefilterteNews() {
  let news = alleNews.filter(n =>
    istInnerhalb30Tage(n.datum) &&
    n.ebene === aktiveEbene
  );

  // Bereichslogik:
  // Journal = heute + Vergangenheit
  // Politische Termine = echte Zukunft
  if (aktiverBereich === "journal") {
    news = news.filter(n => !istZukunftsMeldung(n));
  }

  if (aktiverBereich === "termine") {
    news = news.filter(n => istZukunftsMeldung(n));
  }

  if (aktiveEbene === "bund" && aktiveQuelle !== "alle") {
    news = news.filter(n => ermittleQuelleTyp(n) === aktiveQuelle);
  }

  if (aktiverFilter !== "alle") {
    news = news.filter(n => n.status === aktiverFilter);
  }

  // Wenn der Gesetzesmonitor gezielt zu einer verknüpften Journalmeldung springt,
  // muss diese Meldung auch dann mitgerendert werden, wenn sie durch die normale
  // 30-Tage- oder Bereichsfilterung gerade nicht in der Liste wäre.
  news = ergaenzeZielmeldungWennGefiltert(news);

  return sortiereNewsListe(news);
}

/* =========================
   JOURNAL
========================= */

function baueJournalHeadline(n) {
  if (hatText(n.journal_headline)) return n.journal_headline.trim();
  if (hatText(n.ki_journal_headline)) return n.ki_journal_headline.trim();

  const zusatzinfosText = normalisiereArray(n.ki_zusatzinfos).join(" ");

  if (
    /entlastungsprämie/i.test(zusatzinfosText) &&
    /(1\.000|1000)/i.test(zusatzinfosText)
  ) {
    return "Keine Mehrheit für 1.000-Euro-Entlastungsprämie";
  }

  let titel = ersterText(n.top_titel, n.title, "Meldung ohne Titel");
  titel = titel.replace(/^TOP\s+\d+\s*:\s*/i, "").trim();

  if (titel.length > 95) {
    titel = kuerzePlainText(titel, 95);
  }

  return titel;
}

function baueJournalArtikel(n) {
  const gespeicherterArtikel = ersterText(n.journal_text, n.ki_journal_text);

  if (istGuterText(gespeicherterArtikel)) {
    if (istZukuenftigerBundesratTop(n)) {
      return baueZukunftsJournalArtikel(n, gespeicherterArtikel);
    }

    return gespeicherterArtikel
      .split(/\n+/)
      .map(absatz => textAbsatz(absatz))
      .join("");
  }

  const absatz1 = ersterText(n.ki_was_passiert, renderKurztext(n));

  const absatz2Teile = [
    ersterText(n.ki_ziel),
    ersterText(n.ki_betroffen)
  ].filter(istGuterText);

  const absatz3Teile = [
    ersterText(n.ki_buergerauswirkung),
    ersterText(n.ki_status_erklaerung),
    ersterText(n.ki_naechster_schritt)
  ].filter(istGuterText);

  const html = [
    istGuterText(absatz1) ? textAbsatz(absatz1) : "",
    absatz2Teile.length > 0 ? textAbsatz(absatz2Teile.join(" ")) : "",
    absatz3Teile.length > 0 ? textAbsatz(absatz3Teile.join(" ")) : ""
  ].filter(Boolean).join("");

  return `
    ${renderNachreichHinweis("Journaltext wird noch ergänzt", "Journal")}
    ${html}
  `;
}

function renderJournalQuellen(n) {
  const quellen = normalisiereArray(n.journal_sources);

  if (quellen.length === 0) {
    return renderNachreichHinweis(
      "Journalquellen werden noch ergänzt",
      "Quellen"
    );
  }

  return `
    <div class="journal-official-sources">
      <h4>Genutzte offizielle Quellen</h4>

      <p class="journal-source-help">
        Diese Quellen wurden für den verständlichen Journaltext genutzt.
        Maßgeblich bleiben die offiziellen Originalquellen.
      </p>

      <ul>
        ${quellen.map(q => {
          if (typeof q === "string") {
            return `<li>${escapeHTML(q)}</li>`;
          }

          const title = q.title || q.label || "Offizielle Quelle";
          const url = q.url || "";
          const grund = escapeHTML(q.grund || q.reason || "");

          return `
            <li>
              ${
                url
                  ? renderQuellenLink(url, title)
                  : `<b>${escapeHTML(title)}</b>`
              }
              ${grund ? `<br><span>${grund}</span>` : ""}
            </li>
          `;
        }).join("")}
      </ul>
    </div>
  `;
}

function renderReportFakten(n) {
  const quelleTyp = ermittleQuelleTyp(n);

  const statusTextRaw = n.ist_bundesrat_top
    ? statusBundesratLabel(n.status_normiert)
    : statusLabel(n.status);

  const datumText = n.ist_bundesrat_top
    ? zeigeText(formatDatumKurz(n.datum))
    : zeigeText(n.datum || "-");

  const originalText = zeigeText(renderOriginalAuszug(n));
  const enthaeltZitat = Boolean(n.enthaelt_zitat);
  const unsicher = istUnsicher(n);
  const drucksachen = normalisiereArray(n.drucksachen);

  return `
    <div class="report-facts-grid">
      ${renderEinheitsBasisdaten(
        n,
        datumText,
        statusTextRaw,
        quelleTyp,
        drucksachen,
        originalText,
        unsicher,
        enthaeltZitat
      )}

      <div class="bundesrat-explain-box qpi-explain-box report-facts-explain">
        ${renderKIFeld(
          "Was ist konkret passiert?",
          holeErklaerText(n, "was_passiert"),
          "Für diese Meldung wurde noch keine konkrete PIQu-Erklärung erstellt."
        )}

        ${renderKIFeld(
          "Warum passiert das?",
          holeErklaerText(n, "warum"),
          "Aus der offiziellen Quelle ist der Hintergrund noch nicht eindeutig erkennbar."
        )}

        ${renderKIFeld(
          "Was soll es bewirken?",
          holeErklaerText(n, "ziel"),
          "Die beabsichtigte Wirkung wird in der gespeicherten Quelle noch nicht eindeutig erklärt."
        )}

        ${renderKIFeld(
          "Wen betrifft das?",
          holeErklaerText(n, "betroffen"),
          "Noch nicht eindeutig erkannt, welche Gruppen, Behörden, Bürger oder Bereiche betroffen sind."
        )}

        ${renderKIFeld(
          "Hat das Auswirkungen auf Bürger?",
          holeErklaerText(n, "buerger"),
          "Noch nicht sicher erkennbar, ob Bürger direkt betroffen sind oder ob es zunächst nur ein politischer Verfahrensschritt ist."
        )}

        <div class="qpi-ai-field qpi-ai-status-field">
          <h4>Aktueller Stand</h4>
          <div class="bundesrat-status-explain ${statusKlasse(n)}">
            ${escapeHTML(renderStatusText(n, statusTextRaw))}
          </div>
        </div>

        ${renderKIFeld(
          "Was passiert als Nächstes?",
          holeErklaerText(n, "naechster_schritt"),
          "Der nächste Schritt geht aus der bisher gespeicherten Quelle noch nicht eindeutig hervor."
        )}

        ${renderKIQualitaetsHinweis(n)}
      </div>
    </div>
  `;
}

function renderReportQuellen(n) {
  return `
    <div class="report-sources-box">
      ${renderJournalQuellen(n)}

      <div class="report-original-sources">
        <h4>Original- und Basisquellen</h4>
        <p class="journal-source-help">
          Diese Links führen zu den offiziellen Ausgangsquellen, Drucksachen oder Vorgängen.
        </p>

        ${renderOffizielleQuellen(n)}
        ${renderZusatzquellen(n)}
      </div>
    </div>
  `;
}

function renderJournalKarte(n) {
  const headline = baueJournalHeadline(n);
  const artikel = baueJournalArtikel(n);

  const card = document.createElement("article");
  card.className = "report-card";
  card.id = `journal-${safeDomId(n.id || n.title)}`;

  card.innerHTML = `
    <div class="report-header">
      <h2 class="report-headline">${escapeHTML(headline)}</h2>
    </div>

    <div class="report-layout">
      <nav class="report-tabs" aria-label="Berichtsbereiche">
        <button class="report-tab-btn active" type="button" data-tab="journal">Journal</button>
        <button class="report-tab-btn" type="button" data-tab="fakten">Fakten</button>
        <button class="report-tab-btn" type="button" data-tab="quellen">Quellen</button>
      </nav>

      <div class="report-content">
        <section class="report-panel active" data-panel="journal">
          <div class="report-journal-preview is-collapsed">
            <div class="report-journal-text">
              ${artikel}
            </div>
          </div>

          <button class="journal-read-more-btn" type="button">
            Mehr lesen
          </button>
        </section>

        <section class="report-panel" data-panel="fakten">
          ${renderReportFakten(n)}
        </section>

        <section class="report-panel" data-panel="quellen">
          ${renderReportQuellen(n)}
        </section>
      </div>
    </div>
  `;

  const tabButtons = card.querySelectorAll(".report-tab-btn");
  const panels = card.querySelectorAll(".report-panel");
  const journalPreview = card.querySelector(".report-journal-preview");
  const readMoreButton = card.querySelector(".journal-read-more-btn");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", event => {
      event.stopPropagation();

      const zielTab = btn.dataset.tab;

      tabButtons.forEach(b => {
        b.classList.toggle("active", b === btn);
      });

      panels.forEach(panel => {
        panel.classList.toggle("active", panel.dataset.panel === zielTab);
      });
    });
  });

  if (readMoreButton && journalPreview) {
    readMoreButton.addEventListener("click", event => {
      event.stopPropagation();

      const wirdGeoeffnet = !card.classList.contains("journal-expanded");

      card.classList.toggle("journal-expanded", wirdGeoeffnet);
      journalPreview.classList.toggle("is-collapsed", !wirdGeoeffnet);
      journalPreview.classList.toggle("is-expanded", wirdGeoeffnet);

      readMoreButton.textContent = wirdGeoeffnet
        ? "Weniger anzeigen"
        : "Mehr lesen";
    });
  }

  return card;
}

function renderJournalAnsicht(app, news) {
  zeigeBundesratVertrauensHinweis(app);

  const gruppen = gruppiereNachDatum(news);
  const daten = Object.keys(gruppen).sort((a, b) => new Date(b) - new Date(a));

  daten.forEach(datum => {
    const gruppe = document.createElement("div");
    gruppe.className = "journal-day-group";

    const header = document.createElement("h3");
    header.className = "journal-day-header";

    if (istZukuenftigesDatum(datum)) {
      header.textContent = `Am ${formatDatumLangMitWochentag(datum)} wird Folgendes passieren (${gruppen[datum].length})`;
    } else {
      header.textContent = `${formatDatum(datum)} (${gruppen[datum].length})`;
    }

    gruppe.appendChild(header);

    gruppen[datum].forEach(n => {
      gruppe.appendChild(renderJournalKarte(n));
    });

    app.appendChild(gruppe);
  });

  if (zielJournalId || zielJournalIdAlternativen.length > 0) {
    const zielIds = [zielJournalId, ...zielJournalIdAlternativen]
      .map(x => String(x || "").trim())
      .filter(Boolean);

    const findeUndOeffneZiel = (versuch = 0) => {
      let ziel = null;

      for (const zielId of zielIds) {
        ziel = document.getElementById(`journal-${safeDomId(zielId)}`);
        if (ziel) break;
      }

      if (!ziel && versuch < 8) {
        setTimeout(() => findeUndOeffneZiel(versuch + 1), 120);
        return;
      }

      if (ziel) {
        ziel.classList.add("journal-expanded");

        const tabButtons = ziel.querySelectorAll(".report-tab-btn");
        const panels = ziel.querySelectorAll(".report-panel");

        tabButtons.forEach(btn => {
          btn.classList.toggle("active", btn.dataset.tab === "journal");
        });

        panels.forEach(panel => {
          panel.classList.toggle("active", panel.dataset.panel === "journal");
        });

        const preview = ziel.querySelector(".report-journal-preview");
        if (preview) {
          preview.classList.remove("is-collapsed");
          preview.classList.add("is-expanded");
        }

        const readBtn = ziel.querySelector(".journal-read-more-btn");
        if (readBtn) {
          readBtn.textContent = "Weniger anzeigen";
        }

        setTimeout(() => {
          ziel.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 60);
      } else {
        console.warn("PIQu-Zielmeldung wurde nicht gefunden:", zielIds);
      }

      zielJournalId = null;
      zielJournalIdAlternativen = [];
    };

    setTimeout(() => findeUndOeffneZiel(), 80);
  }
}

function renderOriginalAnsicht(app, news) {
  zeigeBundesratVertrauensHinweis(app);

  const gruppen = gruppiereNachDatum(news);
  const daten = Object.keys(gruppen).sort((a, b) => new Date(b) - new Date(a));

  daten.forEach(datum => {
    const gruppe = document.createElement("div");
    gruppe.className = "day-group";

    const header = document.createElement("div");
    header.className = "day-header";
    header.textContent = `${formatDatum(datum)} (${gruppen[datum].length})`;

    const content = document.createElement("div");
    content.className = "day-content";

    const enthaeltZiel = zielMeldungId
      ? gruppen[datum].some(n => String(n.id || n.title) === String(zielMeldungId))
      : false;

    if (!istHeute(datum) && !enthaeltZiel) {
      content.style.display = "none";
    }

    header.onclick = () => {
      content.style.display = content.style.display === "none" ? "block" : "none";
    };

    gruppen[datum].forEach(n => {
      const card = renderEinheitskarte(n);
      content.appendChild(card);
    });

    gruppe.appendChild(header);
    gruppe.appendChild(content);
    app.appendChild(gruppe);
  });

  if (zielMeldungId) {
    setTimeout(() => {
      const ziel = document.getElementById(`meldung-${safeDomId(zielMeldungId)}`);

      if (ziel) {
        ziel.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        const top = ziel.querySelector(".card-top");
        if (top && !ziel.classList.contains("card-open")) {
          top.click();
        }
      }

      zielMeldungId = null;
    }, 50);
  }
}


/* =========================
   GESETZESMONITOR
========================= */

function monitorStatusIcon(statusRaw) {
  const status = String(statusRaw || "").toLowerCase();

  if (status.includes("kraft")) return "🟢";
  if (status.includes("verkündung") || status.includes("verkuendung") || status.includes("verkuendet")) return "🟢";
  if (status.includes("bundesrat")) return "🟣";
  if (status.includes("bundestag")) return "🔵";
  if (status.includes("anhörung") || status.includes("anhoerung")) return "🟡";
  if (status.includes("ausschuss")) return "🟠";
  if (status.includes("planung") || status.includes("prüfung") || status.includes("pruefung")) return "🟡";
  if (status.includes("abgelehnt") || status.includes("gescheitert")) return "⚫";
  if (status.includes("gericht")) return "⚖️";

  return "⚖️";
}


const MONITOR_STUFEN = [
  { key: "anfrage", label: "Anfrage" },
  { key: "antrag", label: "Antrag" },
  { key: "ausschuss", label: "Ausschuss" },
  { key: "anhoerung", label: "Anhörung" },
  { key: "bundestag", label: "Bundestag" },
  { key: "bundesrat", label: "Bundesrat" },
  { key: "verkuendung", label: "Verkündung" },
  { key: "inkraft", label: "In Kraft" }
];

function monitorNormalisiereStatus(statusRaw) {
  return String(statusRaw || "")
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replace(/\s+/g, "_")
    .trim();
}


function monitorStatusAnzeigeText(statusRaw) {
  const status = monitorNormalisiereStatus(statusRaw);

  if (status.includes("angekuendigt")) return "Angekündigt";
  if (status.includes("regierungsentwurf")) return "Regierungsentwurf";
  if (status.includes("im_bundestag") || status.includes("bundestag_eingebracht")) return "Im Bundestag";
  if (status.includes("ausschuss")) return "Ausschussberatung";
  if (status.includes("anhoerung")) return "Anhörung";
  if (status.includes("bundestag_beschlossen")) return "Bundestag beschlossen";
  if (status.includes("im_bundesrat") || status.includes("bundesrat_befassung")) return "Im Bundesrat";
  if (status.includes("bundesrat_abgeschlossen")) return "Bundesrat abgeschlossen";
  if (status.includes("vermittlung")) return "Vermittlungsausschuss";
  if (status.includes("verkuendet") || status.includes("verkuendung")) return "Verkündet";
  if (status.includes("in_kraft") || status.includes("inkraft")) return "In Kraft";
  if (status.includes("abgelehnt")) return "Abgelehnt";
  if (status.includes("gescheitert")) return "Gescheitert";
  if (status.includes("zurueckgezogen")) return "Zurückgezogen";
  if (status.includes("archiviert")) return "Archiviert";
  if (status.includes("erledigt")) return "Erledigt";

  return statusRaw || "Status offen";
}

function monitorEreignisLabel(typRaw) {
  const typ = monitorNormalisiereStatus(typRaw);

  if (typ.includes("ankuendigung") || typ.includes("fruehphase")) return "Ankündigung";
  if (typ.includes("referentenentwurf") || typ.includes("entwurf")) return "Entwurf";
  if (typ.includes("kabinett")) return "Kabinett";
  if (typ.includes("eingebracht") || typ.includes("bundestag")) return "Bundestag";
  if (typ.includes("ausschuss")) return "Ausschussberatung";
  if (typ.includes("anhoerung")) return "Anhörung";
  if (typ.includes("bundesrat")) return "Bundesrat";
  if (typ.includes("vermittlung")) return "Vermittlung";
  if (typ.includes("verkuendet") || typ.includes("verkuendung") || typ.includes("bgbl")) return "Verkündung";
  if (typ.includes("in_kraft") || typ.includes("inkraft")) return "In Kraft";
  if (typ.includes("archiv")) return "Archiv";
  if (typ.includes("abgelehnt") || typ.includes("gescheitert")) return "Beendet";

  return typRaw || "Ereignis";
}

function monitorBereiche() {
  return [
    {
      key: "entwicklung",
      label: "In Entwicklung",
      leerTitel: "Keine laufenden Vorhaben sichtbar.",
      leerText: "Sobald PIQu ein laufendes Gesetzes- oder Reformvorhaben erkennt, erscheint es hier."
    },
    {
      key: "fertig",
      label: "Fertig / In Kraft",
      leerTitel: "Keine fertigen Vorhaben sichtbar.",
      leerText: "Abgeschlossene, verkündete oder geltende Vorhaben erscheinen hier."
    },
    {
      key: "archiv",
      label: "Archiv",
      leerTitel: "Keine Archiv-Einträge sichtbar.",
      leerText: "Ältere, erledigte oder nicht weiter verfolgte Vorhaben erscheinen später hier."
    }
  ];
}

function monitorStatusIndex(statusRaw) {
  const status = monitorNormalisiereStatus(statusRaw);

  if (status.includes("inkraft") || status.includes("in_kraft")) return 7;
  if (status.includes("verkuendung") || status.includes("verkuendet")) return 6;
  if (status.includes("bundesrat")) return 5;
  if (status.includes("bundestag")) return 4;
  if (status.includes("anhoerung")) return 3;
  if (status.includes("ausschuss")) return 2;
  if (status.includes("antrag") || status.includes("entwurf")) return 1;
  if (status.includes("anfrage") || status.includes("planung") || status.includes("pruefung")) return 0;

  return -1;
}

function monitorErreichteStufenAusEreignissen(ereignisse) {
  const erreicht = new Set();

  (ereignisse || []).forEach(e => {
    const text = monitorNormalisiereStatus(
      `${e.ereignis_typ || ""} ${e.ereignis_label || ""} ${e.status_nach_ereignis || ""}`
    );

    if (text.includes("anfrage")) erreicht.add("anfrage");
    if (text.includes("antrag") || text.includes("entwurf")) erreicht.add("antrag");
    if (text.includes("ausschuss")) erreicht.add("ausschuss");
    if (text.includes("anhoerung")) erreicht.add("anhoerung");
    if (text.includes("bundestag")) erreicht.add("bundestag");
    if (text.includes("bundesrat")) erreicht.add("bundesrat");
    if (text.includes("verkuendung")) erreicht.add("verkuendung");
    if (text.includes("inkraft") || text.includes("in_kraft")) erreicht.add("inkraft");
  });

  return erreicht;
}

function renderMonitorFortschritt(v, ereignisse) {
  const current = monitorStatusIndex(v.status || v.status_label);
  const erreicht = monitorErreichteStufenAusEreignissen(ereignisse);

  return `
    <div class="monitor-progress-wrap">
      <div class="monitor-progress-title">Verfahrensstand</div>

      <div class="monitor-progress">
        ${MONITOR_STUFEN.map((stufe, index) => {
          const istAktuell = index === current;
          const istErreicht = current >= 0
            ? index <= current
            : erreicht.has(stufe.key);

          return `
            <div class="monitor-step ${istErreicht ? "done" : ""} ${istAktuell ? "current" : ""}">
              <div class="monitor-step-icon">
                ${istErreicht ? "✓" : "○"}
              </div>

              <div class="monitor-step-label">
                ${escapeHTML(stufe.label)}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}


function monitorEreignisIcon(typRaw, labelRaw) {
  const text = `${typRaw || ""} ${labelRaw || ""}`.toLowerCase();

  if (text.includes("anfrage")) return "❔";
  if (text.includes("antrag")) return "📄";
  if (text.includes("ausschuss")) return "🟠";
  if (text.includes("anhörung") || text.includes("anhoerung")) return "🟡";
  if (text.includes("bundestag")) return "🔵";
  if (text.includes("bundesrat")) return "🟣";
  if (text.includes("verkündung") || text.includes("verkuendung")) return "📜";
  if (text.includes("kraft")) return "🟢";
  if (text.includes("gericht")) return "⚖️";

  return "•";
}

function monitorVorhabenEreignisse(vorhabenId) {
  return monitorEreignisse
    .filter(e => e.vorhaben_id === vorhabenId)
    .sort((a, b) => {
      const sortA = Number(a.sort_order || 0);
      const sortB = Number(b.sort_order || 0);

      if (sortA !== sortB) return sortA - sortB;

      const datumA = new Date(a.datum || 0).getTime();
      const datumB = new Date(b.datum || 0).getTime();

      return datumA - datumB;
    });
}

function renderMonitorEreignis(e) {
  const datum = e.datum ? formatDatumKurz(e.datum) : "ohne Datum";
  const quelleUrl = e.quelle_url || "";
  const journalZiel = e.news_id || e.bundesrat_top_id || "";

  return `
    <li class="monitor-event">
      <div class="monitor-event-dot">${monitorEreignisIcon(e.ereignis_typ, e.ereignis_label)}</div>

      <div class="monitor-event-body">
        <div class="monitor-event-head">
          <strong>${escapeHTML(e.ereignis_label || e.ereignis_typ || "Ereignis")}</strong>
          <span>${escapeHTML(datum)}</span>
        </div>

        <h4>${escapeHTML(e.titel || "Ereignis ohne Titel")}</h4>

        ${
          e.beschreibung
            ? `<p>${escapeHTML(e.beschreibung)}</p>`
            : ""
        }

        <div class="monitor-event-actions">
          ${
            quelleUrl
              ? renderQuellenLink(quelleUrl, "Originalquelle öffnen")
              : ""
          }

          ${
            journalZiel
              ? `<button class="monitor-journal-link" type="button" data-journal-id="${escapeHTML(journalZiel)}">Zugehörige PIQu-Meldung</button>`
              : ""
          }
        </div>
      </div>
    </li>
  `;
}


function monitorStatusBedeutung(statusRaw) {
  const status = monitorNormalisiereStatus(statusRaw);

  if (status.includes("anhoerung")) {
    return {
      titel: "Bedeutung: Anhörung",
      text: "Der Vorgang befindet sich aktuell in der Phase der Anhörung. Bei einer Anhörung werden Fachleute, Verbände, Wissenschaftler, Behörden oder andere betroffene Gruppen öffentlich befragt. Ziel ist es, Chancen, Risiken und mögliche Probleme des Vorhabens besser zu verstehen. Für Bürger bedeutet das: Das Vorhaben ist noch nicht beschlossen. Die Stellungnahmen können aber Einfluss darauf haben, ob der Entwurf später geändert, ergänzt oder sogar gestoppt wird."
    };
  }

  if (status.includes("ausschuss")) {
    return {
      titel: "Bedeutung: Ausschussberatung",
      text: "Der Vorgang wird aktuell in einem Fachausschuss behandelt. Ausschüsse sind die Arbeitsgruppen des Parlaments für bestimmte Themenbereiche. Dort prüfen Abgeordnete die Unterlagen im Detail, bewerten Auswirkungen und bereiten die weiteren Beratungen vor. Für Bürger bedeutet das: Es ist noch nichts endgültig beschlossen. Das Vorhaben befindet sich jedoch bereits in einem fortgeschrittenen parlamentarischen Verfahren und wird fachlich geprüft."
    };
  }

  if (status.includes("bundestag")) {
    return {
      titel: "Bedeutung: Bundestag",
      text: "Der Bundestag ist die zentrale Station für die parlamentarische Beratung und Entscheidung. Erst nach den vorgesehenen Beratungen und Abstimmungen ist klar, ob der Bundestag dem Vorhaben zustimmt."
    };
  }

  if (status.includes("bundesrat")) {
    return {
      titel: "Bedeutung: Bundesrat",
      text: "Der Bundesrat prüft, ob die Länder dem Vorhaben zustimmen müssen oder Stellung nehmen. Je nach Gesetz kann der Bundesrat zustimmen, Einwände erheben oder den Vermittlungsausschuss anrufen."
    };
  }

  if (status.includes("verkuendung") || status.includes("verkuendet")) {
    return {
      titel: "Bedeutung: Verkündung",
      text: "Verkündung bedeutet: Das Gesetz ist formal beschlossen und wird offiziell veröffentlicht. Erst danach kann es zu dem festgelegten Zeitpunkt wirksam werden."
    };
  }

  if (status.includes("inkraft") || status.includes("in_kraft")) {
    return {
      titel: "Bedeutung: In Kraft",
      text: "In Kraft bedeutet: Die Regelung gilt ab dem angegebenen Zeitpunkt. Ab dann kann sie Bürger, Unternehmen, Behörden oder andere betroffene Gruppen tatsächlich betreffen."
    };
  }

  return {
    titel: "Bedeutung des aktuellen Status",
    text: "PIQu ordnet diesen Vorgang als laufenden politischen Verfahrensschritt ein. Was daraus genau folgt, hängt vom weiteren Verfahren und den offiziellen Entscheidungen ab."
  };
}

function monitorNaechsterSchritt(v, statusRaw) {
  const gespeicherterSchritt = ersterText(v?.naechster_schritt);
  const gespeichertesDatum = v?.naechster_schritt_datum
    ? formatDatumKurz(v.naechster_schritt_datum)
    : "";

  const schrittKey = monitorNormalisiereStatus(gespeicherterSchritt);
  const statusKey = monitorNormalisiereStatus(statusRaw || v?.status || v?.status_label);

  const erklaerungen = {
    antrag:
      "Ein Antrag oder Gesetzentwurf ist ein konkreter Vorschlag, der politisch weiterbehandelt werden kann. Ab diesem Punkt geht es nicht mehr nur um eine allgemeine Idee, sondern um einen Text oder eine Forderung, über die beraten werden kann.",

    ausschuss:
      "Ein Ausschuss ist eine Arbeitsgruppe des Parlaments für ein bestimmtes Thema. Dort schauen Abgeordnete genauer auf den Vorschlag, holen Informationen ein und bereiten vor, was später im Bundestag beraten oder entschieden werden kann.",

    anhoerung:
      "Bei einer Anhörung werden Fachleute, Verbände oder betroffene Stellen öffentlich befragt. Sie erklären, welche Folgen der Entwurf haben könnte, wo Risiken liegen und welche Änderungen sinnvoll wären. Für Bürger bedeutet das: Das Gesetz ist noch nicht beschlossen, aber wichtige Argumente und Kritikpunkte werden jetzt gesammelt.",

    bundestag:
      "Im Bundestag beraten und entscheiden die Abgeordneten über das Vorhaben. Dort kann der Entwurf geändert, angenommen oder abgelehnt werden. Erst nach den vorgesehenen Beratungen und Abstimmungen ist klar, ob der Bundestag das Vorhaben wirklich weiterträgt.",

    bundesrat:
      "Im Bundesrat prüfen die Bundesländer das Vorhaben. Je nach Art des Gesetzes kann der Bundesrat zustimmen müssen, Einwände erheben oder weitere Vermittlung verlangen. Diese Station ist wichtig, weil viele Gesetze auch die Länder oder deren Verwaltung betreffen.",

    verkuendung:
      "Die Verkündung ist die offizielle Veröffentlichung des beschlossenen Gesetzes. Erst dadurch wird verbindlich festgehalten, was beschlossen wurde und ab wann die Regelung gelten soll.",

    inkraft:
      "In Kraft bedeutet: Die Regelung gilt ab dem angegebenen Zeitpunkt tatsächlich. Erst dann können sich konkrete Pflichten, Rechte oder Änderungen für Bürger, Unternehmen, Behörden oder andere betroffene Gruppen ergeben."
  };

  function erklaerungFuer(key) {
    if (key.includes("anhoerung")) return erklaerungen.anhoerung;
    if (key.includes("ausschuss")) return erklaerungen.ausschuss;
    if (key.includes("antrag") || key.includes("entwurf")) return erklaerungen.antrag;
    if (key.includes("bundestag")) return erklaerungen.bundestag;
    if (key.includes("bundesrat")) return erklaerungen.bundesrat;
    if (key.includes("verkuendung")) return erklaerungen.verkuendung;
    if (key.includes("inkraft") || key.includes("in_kraft")) return erklaerungen.inkraft;

    return "Der nächste Schritt wird sichtbar, sobald PIQu ihn eindeutig aus einer offiziellen Quelle ableiten kann. Bis dahin sollte der Vorgang als laufendes Verfahren verstanden werden, bei dem noch keine endgültige Wirkung sicher ist.";
  }

  if (gespeicherterSchritt) {
    const datumTeil = gespeichertesDatum
      ? ` Geplant ist dieser Schritt nach den aktuell gespeicherten Daten für den ${gespeichertesDatum}.`
      : " Ein konkretes Datum ist in PIQu dafür noch nicht gespeichert.";

    return {
      titel: `Nächster geplanter Schritt: ${gespeicherterSchritt}`,
      text: `${erklaerungFuer(schrittKey)}${datumTeil}`
    };
  }

  const current = monitorStatusIndex(statusRaw || v?.status || v?.status_label);

  if (current < 0 || current >= MONITOR_STUFEN.length - 1) {
    return {
      titel: "Nächster Schritt",
      text: "Der nächste Schritt ist aus den aktuell gespeicherten Daten noch nicht eindeutig ableitbar. PIQu zeigt deshalb nur den aktuellen Stand und die bisher belegten Ereignisse."
    };
  }

  const next = MONITOR_STUFEN[current + 1];

  return {
    titel: `Nächster Schritt: ${next.label}`,
    text: erklaerungFuer(next.key || statusKey)
  };
}

function monitorAktuellesEreignis(ereignisse) {
  const list = Array.isArray(ereignisse) ? [...ereignisse] : [];

  return list.sort((a, b) => {
    const datumA = new Date(a.datum || 0).getTime();
    const datumB = new Date(b.datum || 0).getTime();

    if (datumB !== datumA) return datumB - datumA;

    return Number(b.sort_order || 0) - Number(a.sort_order || 0);
  })[0] || null;
}

function renderMonitorKlappBox(titel, inhaltHtml, extraClass = "", standardOffen = false) {
  if (!inhaltHtml || !String(inhaltHtml).trim()) return "";

  return `
    <details class="monitor-detail-box monitor-klapp-box ${extraClass}" ${standardOffen ? "open" : ""}>
      <summary>${escapeHTML(titel)}</summary>
      <div class="monitor-klapp-content">
        ${inhaltHtml}
      </div>
    </details>
  `;
}

function renderMonitorPiquMeldung(e, v = null) {
  if (!e) return "";

  let journalMeldung = null;

  if (e?.news_id) {
    journalMeldung = alleNews.find(n => String(n.id) === String(e.news_id));
  }

  if (!journalMeldung && e?.bundesrat_top_id) {
    journalMeldung = alleNews.find(n =>
      n.ist_bundesrat_top === true &&
      (
        String(n.bundesrat_top_id || "") === String(e.bundesrat_top_id) ||
        String(n.top_id || "") === String(e.bundesrat_top_id) ||
        String(n.id || "") === String(`bundesrat-db-${e.bundesrat_top_id}`) ||
        String(n.id || "") === String(`bundesrat-${n.sitzung}-${n.top_nummer}`)
      )
    );
  }

  // Keine verknüpfte Journalmeldung = keinen Ersatztext anzeigen.
  // Der Gesetzesmonitor bleibt dann reine Akten-/Statusansicht.
  if (!journalMeldung) return "";

  const headline = baueJournalHeadline(journalMeldung);
  const zielBereich = istZukunftsMeldung(journalMeldung) ? "termine" : "journal";
  const typText = journalMeldung.ist_bundesrat_top
    ? "Zu diesem Monitor-Ereignis gibt es eine passende PIQu-Meldung aus dem Bundesrat-Bereich."
    : "Zu diesem Monitor-Ereignis gibt es eine passende Journalmeldung.";
  const buttonText = zielBereich === "termine"
    ? "Zugehörigen Terminbericht öffnen"
    : "Zugehörige Journalmeldung öffnen";

  return renderMonitorKlappBox(
    zielBereich === "termine" ? "Zugehöriger Terminbericht" : "Zugehörige Journalmeldung",
    `
      <p>${escapeHTML(typText)}</p>
      <p><b>${escapeHTML(headline)}</b></p>

      <div class="monitor-link-row">
        <button
          class="monitor-journal-link"
          type="button"
          data-journal-id="${escapeHTML(journalMeldung.id || "")}" 
          data-news-id="${escapeHTML(e.news_id || "")}" 
          data-bundesrat-top-id="${escapeHTML(e.bundesrat_top_id || journalMeldung.bundesrat_top_id || journalMeldung.top_id || "")}" 
          data-target-area="${escapeHTML(zielBereich)}"
        >
          ${escapeHTML(buttonText)}
        </button>
      </div>
    `,
    "monitor-current-report"
  );
}
function renderMonitorBuergerErklaerung(v) {
  const text = ersterText(v.einfach_erklaert_text);

  if (!istGuterText(text)) return "";

  return renderMonitorKlappBox(
    "Einfach erklärt",
    `<p>${escapeHTML(text)}</p>`,
    "monitor-simple-explain"
  );
}

function renderMonitorKarte(v) {
  const card = document.createElement("article");
  card.className = "monitor-card monitor-file-card";
  card.id = `monitor-${safeDomId(v.id || v.titel)}`;

  const ereignisse = monitorVorhabenEreignisse(v.id);
  const aktuellesEreignis = monitorAktuellesEreignis(ereignisse);
  const statusLabel = v.status_label || monitorStatusAnzeigeText(v.status) || "Status offen";
  const statusIcon = monitorStatusIcon(statusLabel);
  const letzteAktivitaet = ersterText(
    v.letzte_aktivitaet,
    v.letzte_aktivitaet_text,
    aktuellesEreignis?.ereignis_label,
    "Noch keine Aktivität gespeichert"
  );

  const letzteAktivitaetDatum = v.letzte_aktivitaet_datum
    ? formatDatumKurz(v.letzte_aktivitaet_datum)
    : aktuellesEreignis?.datum
      ? formatDatumKurz(aktuellesEreignis.datum)
      : "ohne Datum";

  const statusBedeutung = istGuterText(v.status_bedeutung_text)
    ? {
        titel: "Statusbedeutung",
        text: v.status_bedeutung_text
      }
    : monitorStatusBedeutung(v.status || v.status_label);

  const naechsterSchritt = istGuterText(v.naechster_schritt_text || v.naechster_schritt)
    ? {
        titel: "Nächster Schritt",
        text: v.naechster_schritt_text || v.naechster_schritt
      }
    : monitorNaechsterSchritt(v, v.status || v.status_label);

  card.innerHTML = `
    <button class="monitor-file-row" type="button" aria-expanded="false">
      <span class="monitor-file-title">
        ${escapeHTML(v.titel || "Vorhaben ohne Titel")}
      </span>

      <span class="monitor-file-status">
        ${statusIcon} ${escapeHTML(statusLabel)}
      </span>

      <span class="monitor-file-toggle" aria-hidden="true">▼</span>
    </button>

    <div class="monitor-card-details">
      ${
        v.redaktionell_korrigiert
          ? `<div class="monitor-admin-note">${escapeHTML(v.admin_hinweis_text || "Redaktionell korrigiert")}</div>`
          : ""
      }

      ${renderMonitorFortschritt(v, ereignisse)}

      ${renderMonitorKlappBox(
        "Letzte Aktivität",
        `
          <p>
            <b>${escapeHTML(letzteAktivitaet)}</b>
            <span>${escapeHTML(letzteAktivitaetDatum)}</span>
          </p>
        `,
        "monitor-activity-box",
        true
      )}

      ${renderMonitorKlappBox(
        statusBedeutung.titel,
        `<p>${escapeHTML(statusBedeutung.text)}</p>`,
        "monitor-status-meaning"
      )}

      ${renderMonitorBuergerErklaerung(v)}

      ${renderMonitorPiquMeldung(aktuellesEreignis, v)}

      ${renderMonitorKlappBox(
        "Hauptquelle",
        v.hauptquelle_url
          ? `<div class="monitor-link-row">${renderQuellenLink(v.hauptquelle_url, v.hauptquelle_label || "Hauptquelle öffnen")}</div>`
          : `<p class="muted-text">Keine Hauptquelle gespeichert.</p>`,
        "monitor-main-source-row"
      )}

      ${renderMonitorKlappBox(
        naechsterSchritt.titel,
        `<p>${escapeHTML(naechsterSchritt.text)}</p>`,
        "monitor-next-step"
      )}
    </div>
  `;

  const row = card.querySelector(".monitor-file-row");
  const details = card.querySelector(".monitor-card-details");
  const toggle = card.querySelector(".monitor-file-toggle");

  if (row && details) {
    row.addEventListener("click", () => {
      const offen = card.classList.toggle("monitor-open");
      details.style.display = offen ? "block" : "none";
      row.setAttribute("aria-expanded", offen ? "true" : "false");

      if (toggle) {
        toggle.textContent = offen ? "▲" : "▼";
      }
    });
  }

  card.querySelectorAll(".monitor-journal-link").forEach(btn => {
    btn.addEventListener("click", event => {
      event.stopPropagation();

      const journalId = btn.dataset.journalId;
      const newsId = btn.dataset.newsId;
      const bundesratTopId = btn.dataset.bundesratTopId;
      const targetArea = btn.dataset.targetArea === "termine" ? "termine" : "journal";

      const zielIds = [
        journalId,
        newsId,
        bundesratTopId ? `bundesrat-db-${bundesratTopId}` : "",
        bundesratTopId ? `bundesrat-${bundesratTopId}` : ""
      ].filter(Boolean);

      if (zielIds.length === 0) return;

      zielJournalId = zielIds[0];
      zielJournalIdAlternativen = zielIds.slice(1);

      aktiverBereich = targetArea;
      aktiveAnsicht = "journal";
      aktiveEbene = "bund";
      aktiveQuelle = "alle";
      aktiverFilter = "alle";
      zielMeldungId = null;

      baueEbenenNavigation();
      baueQuellenFilter();
      baueFilter();

      const current = document.getElementById("piqu-toggle-current");
      if (current) {
        current.textContent = bereichLabel(targetArea);
        current.classList.remove("area-journal-text", "area-termine-text", "area-gesetzesmonitor-text");
        current.classList.add(targetArea === "termine" ? "area-termine-text" : "area-journal-text");
      }

      document.querySelectorAll(".piqu-area-btn").forEach(areaBtn => {
        areaBtn.classList.toggle("active", areaBtn.dataset.area === targetArea);
      });

      renderNews();
    });
  });

  return card;
}

function piquEnsureMonitorKlappStyles() {
  if (document.getElementById("piqu-monitor-klapp-styles")) return;

  const style = document.createElement("style");
  style.id = "piqu-monitor-klapp-styles";
  style.textContent = `
    .monitor-klapp-box {
      margin: 12px 0;
      padding: 0;
      overflow: hidden;
      border: 1px solid rgba(45, 72, 110, 0.16);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.78);
      box-shadow: 0 6px 18px rgba(20, 40, 80, 0.05);
    }

    .monitor-klapp-box summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 14px;
      cursor: pointer;
      font-weight: 800;
      color: #1c2940;
      list-style: none;
      user-select: none;
    }

    .monitor-klapp-box summary::-webkit-details-marker {
      display: none;
    }

    .monitor-klapp-box summary::after {
      content: "▼";
      flex: 0 0 auto;
      font-size: 0.8rem;
      opacity: 0.65;
      transition: transform 0.16s ease;
    }

    .monitor-klapp-box[open] summary::after {
      transform: rotate(180deg);
    }

    .monitor-klapp-content {
      padding: 0 14px 14px;
      color: #25324a;
      line-height: 1.65;
    }

    .monitor-klapp-content > :first-child {
      margin-top: 0;
    }

    .monitor-klapp-content > :last-child {
      margin-bottom: 0;
    }

    .monitor-klapp-content h3 {
      margin: 2px 0 10px;
      font-size: 1.05rem;
      line-height: 1.35;
    }

    .monitor-card-details > .monitor-klapp-box:first-of-type {
      margin-top: 14px;
    }

    .monitor-simple-explain {
      background: rgba(235, 244, 255, 0.86);
    }

    .monitor-current-report {
      background: rgba(255, 255, 255, 0.9);
    }

    .monitor-status-meaning,
    .monitor-next-step {
      background: rgba(248, 250, 255, 0.9);
    }

    .monitor-activity-box {
      background: rgba(255, 255, 255, 0.92);
    }


    .monitor-area-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 14px 0 18px;
    }

    .monitor-area-tab {
      border: 1px solid rgba(45, 72, 110, 0.16);
      border-radius: 999px;
      padding: 9px 13px;
      background: rgba(255, 255, 255, 0.82);
      color: #25324a;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(20, 40, 80, 0.05);
    }

    .monitor-area-tab.active {
      background: rgba(28, 41, 64, 0.94);
      color: #ffffff;
      border-color: rgba(28, 41, 64, 0.94);
    }

    .monitor-area-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.6em;
      margin-left: 6px;
      padding: 1px 6px;
      border-radius: 999px;
      background: rgba(45, 72, 110, 0.12);
      font-size: 0.88em;
    }

    .monitor-area-tab.active .monitor-area-count {
      background: rgba(255, 255, 255, 0.2);
    }

    .monitor-section-title {
      margin: 8px 0 12px;
      color: #1c2940;
    }

    .monitor-admin-note {
      display: inline-flex;
      align-items: center;
      margin: 14px 0 4px;
      padding: 7px 10px;
      border-radius: 999px;
      background: rgba(255, 245, 214, 0.95);
      border: 1px solid rgba(180, 135, 35, 0.28);
      color: #5f4212;
      font-size: 0.92rem;
      font-weight: 800;
    }

    .qpi-link-target {
      margin-left: 6px;
      font-size: 0.88em;
      color: #5f6f89;
      font-weight: 600;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);
}

function renderGesetzesmonitor(app) {
  piquEnsureMonitorKlappStyles();
  if (!app) return;

  app.innerHTML = "";

  if (aktiveEbene !== "bund") {
    app.innerHTML = `
      <div class="empty-state">
        <h3>⚖️ Gesetzesmonitor</h3>
        <p>
          Der Gesetzesmonitor ist aktuell für die Bundesebene vorbereitet.
          Länder, Landkreise und Gemeinden folgen später.
        </p>
      </div>
    `;
    return;
  }

  const bereiche = monitorBereiche();
  const bereichKeys = bereiche.map(b => b.key);

  if (!bereichKeys.includes(aktiverMonitorBereich)) {
    aktiverMonitorBereich = "entwicklung";
  }

  const alleVorhaben = monitorVorhaben
    .filter(v => v && v.archiviert !== true);

  const zaehler = {};
  bereiche.forEach(b => {
    zaehler[b.key] = alleVorhaben.filter(v => (v.monitor_bereich || "entwicklung") === b.key).length;
  });

  const aktiveBereichInfo = bereiche.find(b => b.key === aktiverMonitorBereich) || bereiche[0];

  const aktiveVorhaben = alleVorhaben
    .filter(v => (v.monitor_bereich || "entwicklung") === aktiveBereichInfo.key)
    .sort((a, b) => {
      const datumA = new Date(a.letzte_aktivitaet_datum || a.letzte_aenderung || a.start_datum || 0).getTime();
      const datumB = new Date(b.letzte_aktivitaet_datum || b.letzte_aenderung || b.start_datum || 0).getTime();

      if (datumB !== datumA) return datumB - datumA;

      return String(a.titel || "").localeCompare(String(b.titel || ""), "de");
    });

  const header = document.createElement("section");
  header.className = "monitor-header";
  header.innerHTML = `
    <h2>⚖️ Gesetzesmonitor</h2>
    <p>
      PIQu zeigt hier politische Vorhaben als Akten:
      mit aktuellem Stand, letzter Aktivität und belegten Stationen aus offiziellen Quellen.
    </p>
  `;
  app.appendChild(header);

  const tabs = document.createElement("div");
  tabs.className = "monitor-area-tabs";
  tabs.setAttribute("aria-label", "Bereiche im Gesetzesmonitor");

  tabs.innerHTML = bereiche.map(b => `
    <button class="monitor-area-tab ${b.key === aktiveBereichInfo.key ? "active" : ""}" type="button" data-monitor-bereich="${escapeHTML(b.key)}">
      ${escapeHTML(b.label)}
      <span class="monitor-area-count">${escapeHTML(String(zaehler[b.key] || 0))}</span>
    </button>
  `).join("");

  tabs.querySelectorAll(".monitor-area-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      aktiverMonitorBereich = btn.dataset.monitorBereich || "entwicklung";
      renderGesetzesmonitor(app);
    });
  });

  app.appendChild(tabs);

  const sectionTitle = document.createElement("h3");
  sectionTitle.className = "monitor-section-title";
  sectionTitle.textContent = aktiveBereichInfo.label;
  app.appendChild(sectionTitle);

  if (aktiveVorhaben.length === 0) {
    app.insertAdjacentHTML("beforeend", `
      <div class="empty-state">
        <h3>⚖️ ${escapeHTML(aktiveBereichInfo.leerTitel)}</h3>
        <p>${escapeHTML(aktiveBereichInfo.leerText)}</p>
      </div>
    `);
    return;
  }

  const grid = document.createElement("section");
  grid.className = "monitor-grid";

  const monitorDatumZaehler = {};
  aktiveVorhaben.forEach(v => {
    const datumKey = String(
      v.letzte_aktivitaet_datum ||
      v.letzte_aktivitaet_am ||
      v.letzte_aenderung ||
      v.start_datum ||
      "ohne-datum"
    ).split("T")[0];

    monitorDatumZaehler[datumKey] = (monitorDatumZaehler[datumKey] || 0) + 1;
  });

  let letztesMonitorDatum = null;

  aktiveVorhaben.forEach(v => {
    const datumKey = String(
      v.letzte_aktivitaet_datum ||
      v.letzte_aktivitaet_am ||
      v.letzte_aenderung ||
      v.start_datum ||
      "ohne-datum"
    ).split("T")[0];

    if (datumKey !== letztesMonitorDatum) {
      const datumHeader = document.createElement("h3");
      datumHeader.className = "journal-day-header monitor-day-header";

      datumHeader.textContent = datumKey === "ohne-datum"
        ? `Ohne Datum (${monitorDatumZaehler[datumKey] || 0})`
        : `${formatDatum(datumKey)} (${monitorDatumZaehler[datumKey] || 0})`;

      grid.appendChild(datumHeader);
      letztesMonitorDatum = datumKey;
    }

    grid.appendChild(renderMonitorKarte(v));
  });

  app.appendChild(grid);
}
function renderJournalBetaHinweis(app) {
  if (!app || aktiverBereich !== "journal" || aktiveAnsicht !== "journal") return;

  const box = document.createElement("div");
  box.className = "journal-beta-hinweis";
  box.innerHTML = `
    <strong>Journal 2.1 Beta</strong><br>
    Seit 21.06.2026 werden neue Journalmeldungen nach erweiterten Recherche- und Qualitätsregeln erstellt.
    Ältere Meldungen können noch aus dem bisherigen Journal-System stammen.
  `;

  app.appendChild(box);
}
function renderNews() {
  const app = document.getElementById("app");
  if (!app) return;

  document.body.classList.toggle(
    "piqu-area-gesetzesmonitor-active",
    aktiverBereich === "gesetzesmonitor"
  );

  app.innerHTML = "";
  aktualisiereLevelInfo();

  if (aktiverBereich === "gesetzesmonitor") {
    renderGesetzesmonitor(app);
    return;
  }

  const news = ermittleGefilterteNews();

  if (news.length === 0) {
    if (aktiverBereich === "termine") {
      app.innerHTML = `
        <div class="empty-state">
          <h3>📅 Keine politischen Termine gefunden.</h3>
          <p>
            Für die aktuelle Auswahl sind derzeit keine zukünftigen politischen Termine sichtbar.
            Prüfe einen anderen Filter oder aktualisiere die Daten später erneut.
          </p>
        </div>
      `;
      return;
    }

    zeigeLeerenZustand(app);
    return;
  }

  if (aktiveAnsicht === "journal") {
  renderJournalBetaHinweis(app);
  renderJournalAnsicht(app, news);
} else {
  renderOriginalAnsicht(app, news);
}
}

/* =========================
   DATEN LADEN
========================= */

async function ladeStartKurzinfo() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/piqu_start_kurzinfo_public_v2?select=datum,journalmeldungen_heute,politische_termine,monitor_aenderungen_heute,kurztext,termine_heute,kommende_termine,ausblick_text&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("piqu_start_kurzinfo_public_v2 konnte nicht geladen werden:", data);
      return null;
    }

    return data[0];
  } catch (err) {
    console.warn("Startseiten-Kurzinfo konnte nicht geladen werden:", err);
    return null;
  }
}

function aktualisiereUpdateAnzeige(data, kurzinfo = startKurzinfo) {
  const updateInfo = document.getElementById("update-info");
  if (!updateInfo) return;

  const zeiten = data
    .map(n => new Date(n.updated_at).getTime())
    .filter(t => !isNaN(t));

  const updateText = zeiten.length === 0
    ? "Letztes Datenupdate: noch nicht verfügbar"
    : "Letztes Datenupdate: " + formatUhrzeit(Math.max(...zeiten));

  const kurztext = kurzinfo && hatText(kurzinfo.kurztext)
    ? String(kurzinfo.kurztext).trim()
    : "";

  const ausblickText = kurzinfo && hatText(kurzinfo.ausblick_text)
    ? String(kurzinfo.ausblick_text).trim()
    : "";

  const kurzinfoHtml = (kurztext || ausblickText)
    ? `
      <div class="piqu-start-kurzinfo-card">
        ${
          kurztext
            ? `<strong class="piqu-start-kurzinfo-line">${escapeHTML(kurztext)}</strong>`
            : ""
        }
        ${
          ausblickText
            ? `<span class="piqu-start-ausblick-line">${escapeHTML(ausblickText)}</span>`
            : ""
        }
      </div>
    `
    : "";

  updateInfo.innerHTML = `
    <span class="piqu-start-update-line">${escapeHTML(updateText)}</span>
    ${kurzinfoHtml}
  `;
}


function baueBundesratJournalHeadline(top, statusText) {
  const titel = String(top.titel || "").trim();
  if (!titel) {
    return `Bundesrat behandelt TOP ${top.top_nummer || "-"}`;
  }

  const clean = titel
    .replace(/^TOP\s+\d+\s*[:.-]?\s*/i, "")
    .trim();

  if (/^antrag (des|der) /i.test(clean)) {
    const ausRawText = String(top.raw_text || "")
      .split("\n")
      .map(x => x.trim())
      .find(x =>
        x &&
        !/^TOP\s/i.test(x) &&
        !/^\d+[:\s]/.test(x) &&
        !/^Länderbeteiligung$/i.test(x) &&
        !/^Ausschusszuweisung$/i.test(x) &&
        !/^Vorgang in DIP$/i.test(x) &&
        !/^Link$/i.test(x) &&
        !/^Drucksachen$/i.test(x)
      );

    if (ausRawText && ausRawText.length > 8) {
      return kuerzePlainText(`Bundesrat berät: ${ausRawText}`, 110);
    }
  }

  if (/gesetz|entwurf|änderung|versorgung|steuer|schutz|förderung/i.test(clean)) {
    return kuerzePlainText(`Bundesrat berät über ${clean}`, 110);
  }

  if (/entschließung/i.test(clean)) {
    return kuerzePlainText(`Bundesrat berät Entschließung: ${clean}`, 110);
  }

  return kuerzePlainText(`Bundesrat behandelt ${clean}`, 110);
}

function baueBundesratJournalTeaser(top, statusText) {
  const buerger = String(top.ki_buergerauswirkung || "").trim();
  const ziel = String(top.ki_ziel || "").trim();
  const was = String(top.ki_was_passiert || "").trim();

  if (istGuterText(buerger)) {
    return kuerzePlainText(buerger, 190);
  }

  if (istGuterText(ziel)) {
    return kuerzePlainText(ziel, 190);
  }

  if (istGuterText(was)) {
    return kuerzePlainText(was, 190);
  }

  return `Der Bundesrat behandelt diesen Punkt in Sitzung ${top.sitzung || "-"} als TOP ${top.top_nummer || "-"}. Status: ${statusText}.`;
}

function baueBundesratJournalText(top, statusText) {
  const abschnitte = [];

  if (istGuterText(top.ki_was_passiert)) {
    abschnitte.push(top.ki_was_passiert);
  } else {
    abschnitte.push(
      `Der Bundesrat behandelt diesen Vorgang in Sitzung ${top.sitzung || "-"} als TOP ${top.top_nummer || "-"}. Der sichtbare Status lautet: ${statusText}.`
    );
  }

  const inhalt = [
    istGuterText(top.ki_warum) ? top.ki_warum : "",
    istGuterText(top.ki_ziel) ? top.ki_ziel : "",
    istGuterText(top.ki_betroffen) ? top.ki_betroffen : ""
  ].filter(Boolean).join(" ");

  if (inhalt) {
    abschnitte.push(inhalt);
  }

  if (istGuterText(top.ki_buergerauswirkung)) {
    abschnitte.push(top.ki_buergerauswirkung);
  } else {
    abschnitte.push(
      "Für Bürgerinnen und Bürger ist aus den öffentlich verfügbaren PIQu-Daten noch keine unmittelbare Änderung sicher erkennbar. Es handelt sich zunächst um einen politischen Verfahrensschritt."
    );
  }

  const naechsterSchritt = [
    istGuterText(top.ki_status_erklaerung) ? top.ki_status_erklaerung : "",
    istGuterText(top.ki_naechster_schritt) ? top.ki_naechster_schritt : ""
  ].filter(Boolean).join(" ");

  if (naechsterSchritt) {
    abschnitte.push(naechsterSchritt);
  }

  return abschnitte.join("\n\n");
}

async function ladeBundesratTops() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/Bundesrat_TOPs_Public?select=id,sitzung,sitzungsdatum,top_nummer,top_url,titel,beschlusstenor,status_normiert,drucksachen,dip_url,plenarprotokoll_url,quality_status,quality_notes,raw_text,updated_at,ki_erklaerung,ki_quellen,ki_zusatzinfos,ki_status_text,ki_enriched_at,ki_enriched_status,ki_was_passiert,ki_warum,ki_ziel,ki_betroffen,ki_buergerauswirkung,ki_naechster_schritt,ki_status_erklaerung,ki_detail_status,ki_detail_confidence,ki_detail_checked_at,ki_detail_error,journal_headline,journal_teaser,journal_text,journal_status,journal_confidence,journal_error,journal_updated_at,journal_sources,journal_research_status,journal_research_note&order=sitzungsdatum.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.warn("Bundesrat_TOPs_Public konnte nicht geladen werden:", data);
    return [];
  }

  return data
    .map(top => {
      const drucksachen = normalisiereArray(top.drucksachen);
      const statusText = statusBundesratLabel(top.status_normiert);

      return {
        id: `bundesrat-db-${top.id}`,
bundesrat_top_id: Number(top.id),
top_id: Number(top.id),
        bundesrat_top_id: top.id,
        top_id: top.id,

        title: `TOP ${top.top_nummer}: ${top.titel}`,
        top_titel: top.titel || "",

        status: "beschluss",
        status_normiert: top.status_normiert,

        beschlusstenor: top.beschlusstenor || "",
        original_beschlusstenor: top.beschlusstenor || "",

        kurz: `Bundesrat · ${top.sitzung}. Sitzung · TOP ${top.top_nummer}. Ergebnis: ${statusText}.`,
        ki_kurz: top.ki_erklaerung
          ? top.ki_erklaerung
          : `Bundesrat · ${top.sitzung}. Sitzung · TOP ${top.top_nummer}. Ergebnis: ${statusText}.`,

        original_text: [
          top.raw_text ? `Originaltext / Rohtext:\n${top.raw_text}` : "",
          `Sitzung: ${top.sitzung}`,
          `TOP: ${top.top_nummer}`,
          `Titel: ${top.titel}`,
          `Beschlusstenor: ${top.beschlusstenor}`,
          drucksachen.length > 0 ? `Drucksachen: ${drucksachen.join(", ")}` : ""
        ].filter(Boolean).join("\n\n"),

        enthaelt_zitat: false,
        darum_gehts: ["Bundesrat"],

        ebene: "bund",
        quelle_typ: "bundesrat",
        quelle: "Bundesrat",

        quelle_url: top.top_url,
        dip_url: top.dip_url,
        plenarprotokoll_url: top.plenarprotokoll_url,
        drucksachen,

        datum: top.sitzungsdatum,
        updated_at: top.updated_at,
        sitzung: top.sitzung,
        top_nummer: top.top_nummer,

        ki_erklaerung: top.ki_erklaerung || "",
        ki_quellen: normalisiereArray(top.ki_quellen),
        ki_zusatzinfos: normalisiereArray(top.ki_zusatzinfos),
        ki_status_text: top.ki_status_text || "",
        ki_enriched_at: top.ki_enriched_at || null,
        ki_enriched_status: top.ki_enriched_status || "offen",

        ki_was_passiert: top.ki_was_passiert || "",
        ki_warum: top.ki_warum || "",
        ki_ziel: top.ki_ziel || "",
        ki_betroffen: top.ki_betroffen || "",
        ki_buergerauswirkung: top.ki_buergerauswirkung || "",
        ki_naechster_schritt: top.ki_naechster_schritt || "",
        ki_status_erklaerung: top.ki_status_erklaerung || "",
        ki_detail_status: top.ki_detail_status || top.ki_enriched_status || "offen",
        ki_detail_confidence: top.ki_detail_confidence || null,
        ki_detail_checked_at: top.ki_detail_checked_at || null,
        ki_detail_error: top.ki_detail_error || "",

        // Bevorzugt werden die fertig gespeicherten Journalfelder aus Supabase.
        // Nur wenn sie fehlen, baut PIQu einen vorsichtigen Fallback aus KI-/Basisfeldern.
        journal_headline: top.journal_headline || baueBundesratJournalHeadline(top, statusText),
        journal_teaser: top.journal_teaser || baueBundesratJournalTeaser(top, statusText),
        journal_text: top.journal_text || baueBundesratJournalText(top, statusText),
        journal_status: top.journal_status || top.ki_detail_status || top.ki_enriched_status || top.quality_status || "",
        journal_confidence: top.journal_confidence || top.ki_detail_confidence || null,
        journal_error: top.journal_error || top.ki_detail_error || "",
        journal_updated_at: top.journal_updated_at || top.ki_detail_checked_at || top.ki_enriched_at || top.updated_at || null,

        journal_sources: normalisiereArray(top.journal_sources).length > 0
          ? normalisiereArray(top.journal_sources)
          : [
              {
                typ: "official_used_source",
                url: top.top_url,
                title: `Bundesrat · Sitzung ${top.sitzung} · TOP ${top.top_nummer}`,
                grund: "Offizielle Bundesrat-Tagesordnung / TOP-Seite."
              },
              top.dip_url
                ? {
                    typ: "official_used_source",
                    url: top.dip_url,
                    title: "DIP · Vorgang",
                    grund: "Parlamentarischer Vorgang zur Drucksache."
                  }
                : null
            ].filter(Boolean),
        journal_research_status: top.journal_research_status || "official_sources_used",
        journal_research_note: top.journal_research_note || "Journaltext wurde aus den öffentlichen Bundesrat- und PIQu-KI-Feldern erzeugt.",

        ist_bundesrat_top: true
      };
    })
    .sort((a, b) => {
      const datumVergleich = new Date(b.datum) - new Date(a.datum);
      if (datumVergleich !== 0) return datumVergleich;

      return Number(a.top_nummer || 0) - Number(b.top_nummer || 0);
    });
}


async function ladeMonitorDaten() {
  try {
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    };

    const select = [
      "id",
      "bereich_key",
      "bereich_label",
      "bereich_sortierung",
      "status",
      "titel",
      "kurztitel",
      "beschreibung_offiziell",
      "einfach_erklaert_text",
      "fortschritt_text",
      "letzte_aktivitaet_text",
      "status_bedeutung_text",
      "piqu_meldung_text",
      "naechster_schritt_text",
      "hauptquelle_label",
      "hauptquelle_url",
      "gilt_ab",
      "erledigt_am",
      "letzte_aktivitaet_am",
      "dip_vorgang_id",
      "bundestag_drucksache",
      "bundesrat_drucksache",
      "bgbl_fundstelle",
      "redaktionell_korrigiert",
      "admin_hinweis_text",
      "ereignisse",
      "ereignisse_anzahl",
      "created_at",
      "updated_at"
    ].join(",");

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/piqu_monitor_frontend_kompakt_v2?select=${select}&order=bereich_sortierung.asc,letzte_aktivitaet_am.desc.nullslast,created_at.desc`,
      { headers }
    );

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.warn("piqu_monitor_frontend_kompakt_v2 konnte nicht geladen werden:", data);
      monitorVorhaben = [];
      monitorEreignisse = [];
      monitorJournalLinks = [];
      return;
    }

    const journalLinkMap = new Map();
    monitorJournalLinks = [];

    try {
      const linkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/piqu_monitor_journal_links_public_v2?select=ereignis_id,news_id,bundesrat_top_id,journal_typ`,
        { headers }
      );

      const linkData = await linkRes.json();

      if (Array.isArray(linkData)) {
        monitorJournalLinks = linkData;

        linkData.forEach(link => {
          if (link && link.ereignis_id) {
            journalLinkMap.set(String(link.ereignis_id), link);
          }
        });
      } else {
        console.warn("piqu_monitor_journal_links_public_v2 konnte nicht geladen werden:", linkData);
      }
    } catch (linkErr) {
      console.warn("Journal-Verknüpfungen für den Monitor konnten nicht geladen werden:", linkErr);
    }

    monitorVorhaben = data.map(row => {
      const bereichKey = row.bereich_key || "entwicklung";

      return {
        id: row.id,

        titel: row.titel || row.kurztitel || "Vorhaben ohne Titel",
        kurztitel: row.kurztitel || row.titel || "Vorhaben ohne Titel",
        kurzbeschreibung: row.beschreibung_offiziell || row.einfach_erklaert_text || "",

        status: row.status || "unbekannt",
        status_label: monitorStatusAnzeigeText(row.status),

        monitor_bereich: bereichKey,
        bereich_label: row.bereich_label || (
          bereichKey === "fertig"
            ? "Fertig / In Kraft"
            : bereichKey === "archiv"
              ? "Archiv"
              : "In Entwicklung"
        ),
        bereich_sortierung: row.bereich_sortierung || 1,

        betroffen: "",
        themen: [],

        start_datum: row.created_at,
        letzte_aenderung: row.updated_at,
        inkrafttreten_datum: row.gilt_ab,
        archiv_ab: bereichKey === "archiv" ? row.erledigt_am : null,

        aktiv: bereichKey !== "archiv",
        archiviert: false,

        hauptquelle_label: row.hauptquelle_label || "Hauptquelle",
        hauptquelle_url: row.hauptquelle_url || "",
        originalquelle_url: row.hauptquelle_url || "",

        confidence: null,
        needs_review: false,

        letzte_aktivitaet: row.letzte_aktivitaet_text || "",
        letzte_aktivitaet_text: row.letzte_aktivitaet_text || "",
        letzte_aktivitaet_datum: row.letzte_aktivitaet_am,

        naechster_schritt: row.naechster_schritt_text || "",
        naechster_schritt_text: row.naechster_schritt_text || "",
        naechster_schritt_datum: null,

        fortschritt_text: row.fortschritt_text || "",
        status_bedeutung_text: row.status_bedeutung_text || "",
        piqu_meldung_text: row.piqu_meldung_text || "",

        beschreibung_offiziell: row.beschreibung_offiziell || "",
        buergerlicher_monitor_text: row.einfach_erklaert_text || "",
        einfach_erklaert_text: row.einfach_erklaert_text || "",

        dip_vorgang_id: row.dip_vorgang_id || "",
        bundestag_drucksache: row.bundestag_drucksache || "",
        bundesrat_drucksache: row.bundesrat_drucksache || "",
        bgbl_fundstelle: row.bgbl_fundstelle || "",

        redaktionell_korrigiert: row.redaktionell_korrigiert === true,
        admin_hinweis_text: row.admin_hinweis_text || "",

        ereignisse_anzahl: row.ereignisse_anzahl || 0,
        created_at: row.created_at,
        updated_at: row.updated_at,

        _monitor_v2_raw: row
      };
    });

    monitorEreignisse = data.flatMap(row => {
      const ereignisse = Array.isArray(row.ereignisse) ? row.ereignisse : [];

      return ereignisse.map((e, index) => {
        const sortOrder = 1000 - index;
        const journalLink = journalLinkMap.get(String(e.id)) || {};

        return {
          id: e.id,
          vorhaben_id: row.id,

          ereignis_typ: e.ereignis_typ || "ereignis",
          ereignis_label: monitorEreignisLabel(e.ereignis_typ),
          datum: e.ereignis_datum,

          titel: e.titel || "Ereignis ohne Titel",
          beschreibung: e.einfach_erklaert_text || e.beschreibung || "",

          status_nach_ereignis: e.ereignis_typ || "",
          quelle: e.quelle_titel || e.quelle_typ || "",
          quelle_url: e.quelle_url || "",

          news_id: journalLink.news_id || "",
          bundesrat_top_id: journalLink.bundesrat_top_id || "",
          journal_typ: journalLink.journal_typ || "",

          sort_order: sortOrder,
          created_at: e.created_at,
          updated_at: e.updated_at,

          redaktionell_korrigiert: e.redaktionell_korrigiert === true,
          admin_hinweis_text: e.admin_hinweis_text || ""
        };
      });
    });
  } catch (err) {
    console.warn("Gesetzesmonitor v2 konnte nicht geladen werden:", err);
    monitorVorhaben = [];
    monitorEreignisse = [];
    monitorJournalLinks = [];
  }
}

async function ladeNews() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `<div class="loading-state">Lade Nachrichten...</div>`;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/News_Public?select=id,title,status,kurz,original_text,ki_kurz,enthaelt_zitat,extraction_confidence,extraction_method,needs_review,darum_gehts,ebene,quelle_typ,quelle,quelle_url,datum,updated_at,sitzung,top_nummer,ki_was_passiert,ki_warum,ki_ziel,ki_betroffen,ki_buergerauswirkung,ki_naechster_schritt,ki_status_erklaerung,ki_detail_status,ki_detail_confidence,ki_detail_checked_at,ki_detail_error,journal_headline,journal_teaser,journal_text,journal_status,journal_confidence,journal_error,journal_updated_at,journal_sources,journal_research_status,journal_research_note&order=datum.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await res.json();

    if (!Array.isArray(data)) {
      app.innerHTML = `
        <div class="error-state">
          <h3>Supabase-Antwort konnte nicht verarbeitet werden.</h3>
          <pre>${escapeHTML(JSON.stringify(data, null, 2))}</pre>
        </div>
      `;
      return;
    }

    const newsOhneAlteBundesratMeldungen = data.filter(n => {
      return ermittleQuelleTyp(n) !== "bundesrat";
    });

    const bundesratTops = await ladeBundesratTops();
    await ladeMonitorDaten();
    startKurzinfo = await ladeStartKurzinfo();

    alleNews = [
      ...newsOhneAlteBundesratMeldungen,
      ...bundesratTops
    ];

    aktualisiereUpdateAnzeige(alleNews);
    baueEbenenNavigation();
    baueAnsichtsUmschalter();
    baueQuellenFilter();
    baueFilter();
    renderNews();

  } catch (err) {
    app.innerHTML = `
      <div class="error-state">
        <h3>Fehler beim Laden</h3>
        <p>${escapeHTML(err.message)}</p>
      </div>
    `;
  }
}


/* =========================
   FEHLER MELDEN
========================= */

function ermittleAktuellenFehlerBereich() {
  if (aktiveAnsicht === "monitor") {
    const bereichLabel =
      aktiverMonitorBereich === "entwicklung" ? "In Entwicklung" :
      aktiverMonitorBereich === "fertig" ? "Fertig / In Kraft" :
      aktiverMonitorBereich === "archiv" ? "Archiv" :
      aktiverMonitorBereich;

    return `Gesetzesmonitor / ${bereichLabel}`;
  }

  if (aktiverBereich === "termine") {
    return "Politische Termine";
  }

  return "Journal";
}

function baueFehlerMeldenMailto() {
  const betreff = "PIQu Fehler melden";
  const zeitpunkt = new Date().toLocaleString("de-DE");
  const bereich = ermittleAktuellenFehlerBereich();
  const url = window.location.href;

  const text = [
    "Hallo PIQu,",
    "",
    "ich habe einen Fehler gefunden:",
    "",
    `Bereich: ${bereich}`,
    `Seite: ${url}`,
    `Zeitpunkt: ${zeitpunkt}`,
    "",
    "Was ist falsch?",
    "",
    "",
    "Welche Meldung oder welcher Monitor-Eintrag ist betroffen?",
    "",
    "",
    "Was hätte ich erwartet?",
    "",
    ""
  ].join("\n");

  return `mailto:${FEHLER_EMAIL}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
}

function baueFehlerMeldenInfo() {
  return `
    <h2>Fehler melden</h2>

    <p>
      Wenn dir bei PIQu etwas auffällt, kannst du es kurz per E-Mail melden.
      Der Link bereitet eine Nachricht mit Seite, Bereich und Zeitpunkt vor.
    </p>

    <div class="support-box">
      <p>
        <b>Bitte kurz beschreiben:</b><br>
        Was ist falsch? Welche Meldung oder welcher Monitor-Eintrag ist betroffen?
        Was hättest du erwartet?
      </p>

      <a class="support-button" href="${escapeHTML(baueFehlerMeldenMailto())}">
        Fehler per E-Mail melden
      </a>

      <p class="support-smallprint">
        Es wird kein Formular gespeichert und kein Nutzerkonto angelegt.
        Die Meldung läuft über dein eigenes E-Mail-Programm.
      </p>
    </div>
  `;
}

function piquInstallFehlerMeldenStyle() {
  if (document.getElementById("piqu-fehler-melden-style")) return;

  const style = document.createElement("style");
  style.id = "piqu-fehler-melden-style";
  style.textContent = `
    .piqu-fehler-melden-btn {
      position: fixed;
      right: 16px;
      top: 92px;
      z-index: 900;
      border: none;
      border-radius: 999px;
      padding: 10px 14px;
      background: #9a5a1f;
      color: #ffffff;
      font-weight: 900;
      font-size: 13px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 10px 24px rgba(120, 53, 15, 0.22);
    }

    .piqu-fehler-melden-btn:hover {
      background: #7c3f12;
    }

    .piqu-fehler-melden-btn:active {
      transform: translateY(1px);
    }

    @media (max-width: 720px) {
      .piqu-fehler-melden-btn {
        right: 12px;
        top: 76px;
        padding: 9px 12px;
        font-size: 12px;
      }
    }
  `;

  document.head.appendChild(style);
}

function piquInstallFehlerMeldenButton() {
  if (document.getElementById("piqu-fehler-melden-btn")) return;

  piquInstallFehlerMeldenStyle();

  const btn = document.createElement("button");
  btn.id = "piqu-fehler-melden-btn";
  btn.className = "piqu-fehler-melden-btn";
  btn.type = "button";
  btn.textContent = "Fehler melden";
  btn.setAttribute("aria-label", "Fehler melden");

  btn.addEventListener("click", () => {
    oeffneInfo("fehler");
  });

  document.body.appendChild(btn);
}

function piquBootFehlerMelden() {
  piquInstallFehlerMeldenButton();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", piquBootFehlerMelden);
} else {
  piquBootFehlerMelden();
}

/* =========================
   MODAL / EVENTS
========================= */

function oeffneInfo(key) {
  const modalLayer = document.getElementById("modal-layer");
  const modalContent = document.getElementById("modal-content");

  if (!modalLayer || !modalContent) return;

  if (key === "fehler") {
    modalContent.innerHTML = baueFehlerMeldenInfo();
  } else {
    modalContent.innerHTML = infoTexte[key] || "<h2>Info</h2><p>Keine Information gefunden.</p>";
  }
  modalLayer.classList.remove("hidden");

  document.body.classList.add("modal-open");
}

function schliesseInfo() {
  const modalLayer = document.getElementById("modal-layer");

  if (modalLayer) {
    modalLayer.classList.add("hidden");
  }

  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-info]").forEach(btn => {
  btn.addEventListener("click", () => {
    oeffneInfo(btn.dataset.info);
  });
});

document.getElementById("modal-close")?.addEventListener("click", schliesseInfo);

document.getElementById("modal-layer")?.addEventListener("click", event => {
  if (event.target.id === "modal-layer") {
    schliesseInfo();
  }
});

function aktualisierePageJumpButtons() {
  const footer = document.getElementById("footer");
  const buttonGruppe = document.getElementById("page-jump-buttons");
  const topButton = document.getElementById("top-jump-btn");

  if (!footer || !buttonGruppe) return;

  const footerRect = footer.getBoundingClientRect();
  const viewportHoehe = window.innerHeight || document.documentElement.clientHeight;
  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

  const footerIstSichtbar =
    footerRect.top < viewportHoehe &&
    footerRect.bottom > 0;

  const istOben = scrollY < 160;

  buttonGruppe.classList.toggle("page-jump-hidden", footerIstSichtbar);

  if (topButton) {
    topButton.classList.toggle("top-jump-hidden", istOben || footerIstSichtbar);
  }
}

document.getElementById("top-jump-btn")?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  setTimeout(aktualisierePageJumpButtons, 350);
});

document.getElementById("footer-jump-btn")?.addEventListener("click", () => {
  const footer = document.getElementById("footer");

  if (footer) {
    footer.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  setTimeout(aktualisierePageJumpButtons, 350);
});

window.addEventListener("scroll", aktualisierePageJumpButtons, { passive: true });
window.addEventListener("resize", aktualisierePageJumpButtons);
aktualisierePageJumpButtons();

document.getElementById("refresh-btn")?.addEventListener("click", () => {
  ladeNews();
});

document.getElementById("donate-btn")?.addEventListener("click", () => {
  if (DONATION_URL) {
    window.open(DONATION_URL, "_blank", "noopener,noreferrer");
  } else {
    oeffneInfo("spenden");
  }
});

document.getElementById("hide-quotes-toggle")?.addEventListener("change", event => {
  zitateAusblenden = event.target.checked;
  renderNews();
});

ladeNews();
/* =========================
   PIQU-BEREICHSNAVIGATION
========================= */

function bereichLabel(key) {
  if (key === "journal") return "📰 Journal";
  if (key === "termine") return "📅 Politische Termine";
  if (key === "gesetzesmonitor") return "⚖️ Gesetzesmonitor";
  return "📰 Journal";
}

function initialisiereBereichsNavigation() {
  const toggle = document.getElementById("piqu-area-toggle");
  const menu = document.getElementById("piqu-area-menu");
  const current = document.getElementById("piqu-toggle-current");
  const buttons = document.querySelectorAll(".piqu-area-btn");

  if (!toggle || !menu || !current) return;

  function aktualisiereAnzeige() {
    const offen = !menu.classList.contains("hidden");

    current.textContent = bereichLabel(aktiverBereich);

    current.classList.remove(
      "area-journal-text",
      "area-termine-text",
      "area-gesetzesmonitor-text"
    );

    if (aktiverBereich === "journal") {
      current.classList.add("area-journal-text");
    }

    if (aktiverBereich === "termine") {
      current.classList.add("area-termine-text");
    }

    if (aktiverBereich === "gesetzesmonitor") {
      current.classList.add("area-gesetzesmonitor-text");
    }

    toggle.classList.toggle("area-open", offen);
    toggle.setAttribute("aria-expanded", offen ? "true" : "false");

    buttons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.area === aktiverBereich);
    });
  }

  toggle.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    aktualisiereAnzeige();
  });

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      aktiverBereich = btn.dataset.area || "journal";

      menu.classList.add("hidden");
      aktualisiereAnzeige();

      if (aktiverBereich === "journal") {
        aktiveAnsicht = "journal";
        renderNews();
        return;
      }

      if (aktiverBereich === "termine") {
        aktiveAnsicht = "journal";
        renderNews();
        return;
      }

      if (aktiverBereich === "gesetzesmonitor") {
        renderNews();
        return;
      }
    });
  });

  aktualisiereAnzeige();
}

initialisiereBereichsNavigation();
/* ============================================================
   PIQu versteckter Admin-Login + eingebetteter Adminbereich
   Voraussetzung:
   - qpi-monitor-admin Edge Function v2 ist deployt.
   - Supabase Auth User existiert.
   - QPI_ADMIN_EMAILS enthält die erlaubte Admin-Mail.
   - 5x auf ⚖️ im Gesetzesmonitor klicken/tippen.
   - Login bleibt nur in diesem Browser-Tab aktiv.
   - Logout löscht die Admin-Session und lädt die Seite neu.
============================================================ */

const PIQU_ADMIN_FUNCTION_URL =
  `${SUPABASE_URL}/functions/v1/qpi-monitor-admin`;

let piquAdminTapCount = 0;
let piquAdminLastTap = 0;
let piquAdminVorhaben = [];
let piquAdminSuggestions = [];
let piquAdminLoginIsRunning = false;

function piquAdminToken() {
  return sessionStorage.getItem("piqu_admin_access_token") || "";
}

function piquAdminEmail() {
  return sessionStorage.getItem("piqu_admin_email") || "";
}

function piquAdminExpiresAt() {
  return Number(sessionStorage.getItem("piqu_admin_expires_at") || 0);
}

function piquAdminClearSession() {
  const keys = [
    "piqu_admin_access_token",
    "piqu_admin_refresh_token",
    "piqu_admin_email",
    "piqu_admin_expires_at",

    // alte Test-/CodePen-Reste vorsichtshalber ebenfalls entfernen
    "qpi_admin_url",
    "qpi_admin_secret",
    "piqu_admin_url",
    "piqu_admin_secret"
  ];

  keys.forEach(key => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

function piquAdminIsLoggedIn() {
  const token = piquAdminToken();

  if (!token) return false;

  const expiresAt = piquAdminExpiresAt();

  if (expiresAt && Date.now() > expiresAt) {
    piquAdminClearSession();
    return false;
  }

  return true;
}

function piquAdminSetMessage(text, type) {
  const el = document.getElementById("piqu-secret-admin-message");
  if (!el) return;

  el.textContent = text || "";
  el.classList.remove("error", "ok");

  if (type) {
    el.classList.add(type);
  }
}

async function piquAdminLogin(email, password) {
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data?.error_description || data?.msg || data?.message || "Login fehlgeschlagen.");
  }

  const expiresInMs = Number(data.expires_in || 3600) * 1000;
  const expiresAt = Date.now() + expiresInMs - 30000;

  sessionStorage.setItem("piqu_admin_access_token", data.access_token);
  sessionStorage.setItem("piqu_admin_refresh_token", data.refresh_token || "");
  sessionStorage.setItem("piqu_admin_email", data.user?.email || email);
  sessionStorage.setItem("piqu_admin_expires_at", String(expiresAt));

  return data;
}

function piquAdminLogout() {
  piquAdminClearSession();

  const overlay = document.getElementById("piqu-admin-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }

  piquAdminRenderSecretArea();

  const area = document.getElementById("piqu-secret-admin-area");
  if (area) {
    area.classList.remove("hidden");
  }

  piquAdminSetMessage("Abgemeldet. Seite wird neu geladen...", "");

  window.setTimeout(() => {
    window.location.reload();
  }, 450);
}

async function piquAdminCall(action, payload = {}) {
  const token = piquAdminToken();

  if (!token) {
    throw new Error("Nicht eingeloggt.");
  }

  const response = await fetch(PIQU_ADMIN_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      action,
      ...payload,
    }),
  });

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Admin-Function antwortet nicht mit JSON: " + text);
  }

  if (!response.ok || data.ok === false) {
    if (response.status === 401 || response.status === 403) {
      piquAdminClearSession();
      piquAdminRenderSecretArea();
    }

    throw new Error(data.error || "Admin-Aktion fehlgeschlagen.");
  }

  return data;
}

function piquAdminEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function piquAdminDate(value) {
  if (!value) return "ohne Datum";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("de-DE");
}

function piquAdminInstallHiddenEntry() {
  const header = document.querySelector(".monitor-header");
  if (!header) return;

  const h2 = header.querySelector("h2");
  if (!h2) return;

  // Sicherheits-/Tarnregel:
  // Der Admin-Einstieg verändert die sichtbare Überschrift NICHT erkennbar.
  // Gezählt werden nur Klicks direkt auf das Waage-Symbol, nicht auf die Zeile.
  // Kein Tooltip, kein sichtbarer Button, kein Cursor-Hinweis, kein Feedback.
  if (!h2.querySelector(".piqu-admin-secret-scale")) {
    const rawTitle = (h2.textContent || "⚖️ Gesetzesmonitor").trim();
    const cleanTitle = rawTitle
      .replace(/^⚖️?\s*/u, "")
      .replace(/^⚖\s*/u, "")
      .trim() || "Gesetzesmonitor";

    h2.innerHTML = `<span class="piqu-admin-secret-scale" aria-hidden="true">⚖️</span> ${escapeHTML(cleanTitle)}`;
  }

  const scale = h2.querySelector(".piqu-admin-secret-scale");
  if (!scale) return;

  if (!document.getElementById("piqu-secret-admin-area")) {
    const area = document.createElement("span");
    area.id = "piqu-secret-admin-area";
    area.className = "piqu-secret-admin-inline hidden";
    h2.insertAdjacentElement("afterend", area);
  }

  if (!scale.classList.contains("piqu-admin-secret-scale-ready")) {
    scale.classList.add("piqu-admin-secret-scale-ready");

    scale.addEventListener("pointerdown", event => {
      event.preventDefault();
      event.stopPropagation();
    });

    scale.addEventListener("click", piquAdminHandleSecretTap);
  }

  piquAdminRenderSecretArea();
}

function piquAdminHandleSecretTap(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();

    if (!event.currentTarget || !event.currentTarget.classList.contains("piqu-admin-secret-scale")) {
      piquAdminTapCount = 0;
      return;
    }
  }

  const now = Date.now();

  // 5 Klicks müssen innerhalb von 5 Sekunden direkt auf der Waage passieren.
  if (now - piquAdminLastTap > 5000) {
    piquAdminTapCount = 0;
  }

  piquAdminLastTap = now;
  piquAdminTapCount += 1;

  // Bewusst KEIN sichtbares Feedback.
  // Kein Puls, keine Markierung, kein Hinweis.
  // Der Adminzugang soll nicht auffallen.

  if (piquAdminTapCount >= 5) {
    piquAdminTapCount = 0;
    piquAdminLastTap = 0;
    piquAdminShowSecretArea();
  }
}

function piquAdminShowSecretArea() {
  const area = document.getElementById("piqu-secret-admin-area");
  if (!area) return;

  piquAdminRenderSecretArea();
  area.classList.remove("hidden");

  const emailInput = document.getElementById("piqu-admin-email");
  if (emailInput && !piquAdminIsLoggedIn()) {
    emailInput.focus();
  }
}

function piquAdminRenderSecretArea() {
  const area = document.getElementById("piqu-secret-admin-area");
  if (!area) return;

  if (piquAdminIsLoggedIn()) {
    area.innerHTML = `
      <span class="piqu-secret-admin-message ok">
        Admin aktiv: ${piquAdminEscape(piquAdminEmail())}
      </span>
      <button class="piqu-admin-open-btn" type="button" id="piqu-admin-open-panel-btn">
        Admin öffnen
      </button>
      <button class="piqu-admin-logout-btn" type="button" id="piqu-admin-logout-btn">
        Logout
      </button>
    `;

    document
      .getElementById("piqu-admin-open-panel-btn")
      ?.addEventListener("click", piquAdminOpenOverlay);

    document
      .getElementById("piqu-admin-logout-btn")
      ?.addEventListener("click", piquAdminLogout);

    return;
  }

  area.innerHTML = `
    <input id="piqu-admin-email" type="email" autocomplete="username" placeholder="Admin-E-Mail" />
    <input id="piqu-admin-password" type="password" autocomplete="current-password" placeholder="Passwort" />
    <button id="piqu-admin-login-btn" type="button">Login</button>
    <span id="piqu-secret-admin-message" class="piqu-secret-admin-message"></span>
  `;

  document
    .getElementById("piqu-admin-login-btn")
    ?.addEventListener("click", piquAdminSubmitLogin);

  document
    .getElementById("piqu-admin-password")
    ?.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        piquAdminSubmitLogin();
      }
    });
}

async function piquAdminSubmitLogin() {
  if (piquAdminLoginIsRunning) return;

  const email = document.getElementById("piqu-admin-email")?.value?.trim() || "";
  const password = document.getElementById("piqu-admin-password")?.value || "";
  const loginBtn = document.getElementById("piqu-admin-login-btn");

  if (!email || !password) {
    piquAdminSetMessage("E-Mail und Passwort eingeben.", "error");
    return;
  }

  try {
    piquAdminLoginIsRunning = true;

    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = "Prüfe...";
    }

    piquAdminSetMessage("Login läuft...", "");

    piquAdminClearSession();
    await piquAdminLogin(email, password);

    const probe = await piquAdminCall("probe");

    piquAdminRenderSecretArea();
    piquAdminSetMessage(probe.message || "Login erfolgreich.", "ok");
  } catch (err) {
    piquAdminClearSession();
    piquAdminRenderSecretArea();

    const area = document.getElementById("piqu-secret-admin-area");
    if (area) {
      area.classList.remove("hidden");
    }

    piquAdminSetMessage(err.message || String(err), "error");
  } finally {
    piquAdminLoginIsRunning = false;

    const freshLoginBtn = document.getElementById("piqu-admin-login-btn");
    if (freshLoginBtn) {
      freshLoginBtn.disabled = false;
      freshLoginBtn.textContent = "Login";
    }
  }
}

function piquAdminEnsureOverlay() {
  let overlay = document.getElementById("piqu-admin-overlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "piqu-admin-overlay";
  overlay.className = "hidden";

  overlay.innerHTML = `
    <div class="piqu-admin-window" role="dialog" aria-modal="true" aria-label="PIQu Adminbereich">
      <div class="piqu-admin-window-head">
        <div>
          <h3>PIQu Admin – Gesetzesmonitor</h3>
          <p>Vorschläge prüfen, übernehmen, zuordnen oder ablehnen.</p>
        </div>
        <button class="piqu-admin-close" type="button" id="piqu-admin-close-btn">×</button>
      </div>

      <div class="piqu-admin-toolbar">
        <label>
          Status
          <select id="piqu-admin-status-filter">
            <option value="offen">offen</option>
            <option value="alle">alle</option>
            <option value="abgelehnt">abgelehnt</option>
            <option value="zugeordnet">zugeordnet</option>
            <option value="uebernommen">uebernommen</option>
          </select>
        </label>

        <label>
          Suche
          <input id="piqu-admin-search" type="text" placeholder="Titel suchen..." />
        </label>

        <label>
          Anzahl
          <select id="piqu-admin-limit">
            <option value="10">10</option>
            <option value="25" selected>25</option>
            <option value="50">50</option>
          </select>
        </label>

        <button class="piqu-admin-primary" type="button" id="piqu-admin-load-btn">Laden</button>
        <button class="piqu-admin-safe" type="button" id="piqu-admin-stats-btn">Statistik</button>
      </div>

      <div class="piqu-admin-body">
        <div id="piqu-admin-status" class="piqu-admin-status">Bereit.</div>
        <div id="piqu-admin-list" class="piqu-admin-list"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("piqu-admin-close-btn")?.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      overlay.classList.add("hidden");
    }
  });

  document.getElementById("piqu-admin-load-btn")?.addEventListener("click", piquAdminLoadSuggestions);
  document.getElementById("piqu-admin-stats-btn")?.addEventListener("click", piquAdminLoadStats);
  document.getElementById("piqu-admin-search")?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      piquAdminLoadSuggestions();
    }
  });

  return overlay;
}

async function piquAdminOpenOverlay() {
  const overlay = piquAdminEnsureOverlay();
  overlay.classList.remove("hidden");

  await piquAdminLoadVorhaben();
  await piquAdminLoadSuggestions();
}

function piquAdminSetOverlayStatus(text, isError) {
  const el = document.getElementById("piqu-admin-status");
  if (!el) return;

  el.textContent = text || "";
  el.classList.toggle("error", Boolean(isError));
}

async function piquAdminLoadVorhaben() {
  try {
    const data = await piquAdminCall("list_vorhaben", { limit: 500 });
    piquAdminVorhaben = Array.isArray(data.rows) ? data.rows : [];
    return piquAdminVorhaben;
  } catch (err) {
    piquAdminSetOverlayStatus(err.message || String(err), true);
    throw err;
  }
}

async function piquAdminLoadStats() {
  try {
    const data = await piquAdminCall("stats");
    piquAdminSetOverlayStatus(JSON.stringify(data, null, 2), false);
  } catch (err) {
    piquAdminSetOverlayStatus(err.message || String(err), true);
  }
}

async function piquAdminLoadSuggestions() {
  try {
    piquAdminSetOverlayStatus("Vorschläge werden geladen...", false);

    if (piquAdminVorhaben.length === 0) {
      await piquAdminLoadVorhaben();
    }

    const status = document.getElementById("piqu-admin-status-filter")?.value || "offen";
    const search = document.getElementById("piqu-admin-search")?.value?.trim() || "";
    const limit = Number(document.getElementById("piqu-admin-limit")?.value || 25);

    const data = await piquAdminCall("list_suggestions", {
      status,
      search,
      limit,
      offset: 0
    });

    piquAdminSuggestions = Array.isArray(data.rows) ? data.rows : [];
    piquAdminRenderSuggestions();
    piquAdminSetOverlayStatus(`Geladen: ${piquAdminSuggestions.length} Vorschläge.`, false);
  } catch (err) {
    piquAdminSetOverlayStatus(err.message || String(err), true);
  }
}

function piquAdminVorhabenOptions() {
  if (!piquAdminVorhaben.length) {
    return `<option value="">Keine Vorhaben geladen</option>`;
  }

  return [
    `<option value="">Vorhaben auswählen...</option>`,
    ...piquAdminVorhaben.map(v => {
      const label = `${v.titel || "Ohne Titel"} (${v.status_label || v.status || "Status offen"})`;
      return `<option value="${piquAdminEscape(v.id)}">${piquAdminEscape(label)}</option>`;
    })
  ].join("");
}

function piquAdminRenderSuggestions() {
  const list = document.getElementById("piqu-admin-list");
  if (!list) return;

  if (!piquAdminSuggestions.length) {
    list.innerHTML = `<div class="piqu-admin-card"><p>Keine Vorschläge gefunden.</p></div>`;
    return;
  }

  list.innerHTML = piquAdminSuggestions.map(row => {
    const dopplung = Number(row.offene_dopplungen_anzahl || 0) > 1
      ? `<span class="piqu-admin-badge red">Dopplung: ${piquAdminEscape(row.offene_dopplungen_anzahl)}</span>`
      : "";

    const quelle = row.quelle_url
      ? `<a href="${piquAdminEscape(row.quelle_url)}" target="_blank" rel="noopener noreferrer">Quelle öffnen</a> <span class="qpi-link-target">(führt zu: ${piquAdminEscape(domainAusUrl(row.quelle_url))})</span>`
      : "keine Quelle";

    return `
      <article class="piqu-admin-card" id="piqu-admin-card-${piquAdminEscape(row.id)}">
        <h4>${piquAdminEscape(row.vorgeschlagener_titel)}</h4>

        <div class="piqu-admin-meta">
          <span class="piqu-admin-badge">${piquAdminEscape(row.vorschlag_typ || "Typ offen")}</span>
          <span class="piqu-admin-badge">${piquAdminEscape(row.status_hint_label || row.status_hint || "Status offen")}</span>
          <span class="piqu-admin-badge">Confidence: ${piquAdminEscape(row.confidence ?? "?")}</span>
          <span class="piqu-admin-badge">${piquAdminEscape(row.event_label || "Ereignis offen")}</span>
          ${dopplung}
        </div>

        <p><b>Begründung:</b> ${piquAdminEscape(row.begruendung || "Keine Begründung.")}</p>
        <p><b>Quelle:</b> ${piquAdminEscape(row.quelle_name || "Unbekannt")} · ${piquAdminEscape(piquAdminDate(row.quelle_datum))} · ${quelle}</p>

        <div class="piqu-admin-actions">
          <div class="piqu-admin-actions-row">
            <input class="piqu-admin-note" id="piqu-admin-note-${piquAdminEscape(row.id)}" type="text" placeholder="Admin-Notiz optional..." />
          </div>

          <div class="piqu-admin-actions-row">
            <button class="piqu-admin-danger" type="button" onclick="piquAdminReject('${piquAdminEscape(row.id)}')">
              Ablehnen
            </button>

            <button class="piqu-admin-safe" type="button" onclick="piquAdminCreateNew('${piquAdminEscape(row.id)}')">
              Neu übernehmen
            </button>
          </div>

          <div class="piqu-admin-actions-row">
            <select id="piqu-admin-assign-${piquAdminEscape(row.id)}">
              ${piquAdminVorhabenOptions()}
            </select>

            <label>
              <input id="piqu-admin-update-${piquAdminEscape(row.id)}" type="checkbox" />
              Status aktualisieren
            </label>

            <button class="piqu-admin-warn" type="button" onclick="piquAdminAssign('${piquAdminEscape(row.id)}')">
              Zuordnen
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function piquAdminGetNote(id) {
  return document.getElementById("piqu-admin-note-" + id)?.value?.trim() || "";
}

function piquAdminRemoveCard(id) {
  const card = document.getElementById("piqu-admin-card-" + id);
  if (card) card.remove();

  piquAdminSuggestions = piquAdminSuggestions.filter(row => row.id !== id);

  if (piquAdminSuggestions.length === 0) {
    piquAdminRenderSuggestions();
  }
}

async function piquAdminReject(id) {
  if (!confirm("Diesen Vorschlag wirklich ablehnen?")) return;

  try {
    await piquAdminCall("reject", {
      vorschlag_id: id,
      notiz: piquAdminGetNote(id)
    });

    piquAdminSetOverlayStatus("Vorschlag abgelehnt.", false);
    piquAdminRemoveCard(id);
  } catch (err) {
    piquAdminSetOverlayStatus(err.message || String(err), true);
  }
}

async function piquAdminCreateNew(id) {
  if (!confirm("Aus diesem Vorschlag wirklich ein neues Vorhaben erstellen?")) return;

  try {
    piquAdminSetOverlayStatus("Übernahme läuft...", false);

    const result = await piquAdminCall("create_new", {
      vorschlag_id: id,
      notiz: piquAdminGetNote(id)
    });

    console.log("PIQu Admin create_new Ergebnis:", result);
    alert("Übernahme erfolgreich.");

    piquAdminSetOverlayStatus("Vorschlag als neues Vorhaben übernommen.", false);
    piquAdminRemoveCard(id);
    await piquAdminLoadVorhaben();
    await piquAdminLoadSuggestions();

  } catch (err) {
    console.error("PIQu Admin create_new Fehler:", err);
    alert("Fehler bei Übernahme:\n" + (err.message || String(err)));
    piquAdminSetOverlayStatus(err.message || String(err), true);
  }
}

async function piquAdminAssign(id) {
  const select = document.getElementById("piqu-admin-assign-" + id);
  const vorhabenId = select?.value || "";

  if (!vorhabenId) {
    alert("Bitte zuerst ein bestehendes Vorhaben auswählen.");
    return;
  }

  const label = select.options[select.selectedIndex]?.textContent || "Vorhaben";

  if (!confirm(`Diesen Vorschlag wirklich zuordnen zu:\n${label}`)) return;

  try {
    await piquAdminCall("assign", {
      vorschlag_id: id,
      vorhaben_id: vorhabenId,
      update_vorhaben: document.getElementById("piqu-admin-update-" + id)?.checked === true,
      notiz: piquAdminGetNote(id)
    });

    piquAdminSetOverlayStatus("Vorschlag zugeordnet.", false);
    piquAdminRemoveCard(id);
    await piquAdminLoadVorhaben();
  } catch (err) {
    piquAdminSetOverlayStatus(err.message || String(err), true);
  }
}

/* Bestehende Monitor-Renderfunktion erweitern, ohne deinen Hauptcode umzuschreiben. */
(function piquPatchRenderGesetzesmonitor() {
  const originalRender = window.renderGesetzesmonitor;

  if (typeof originalRender === "function" && !window.__piquAdminPatchInstalled) {
    window.__piquAdminPatchInstalled = true;

    window.renderGesetzesmonitor = function patchedRenderGesetzesmonitor(app) {
      originalRender(app);

      window.setTimeout(() => {
        piquAdminInstallHiddenEntry();
      }, 0);
    };
  }

  window.setTimeout(() => {
    piquAdminInstallHiddenEntry();
  }, 300);
})();

/* ============================================================
   PIQu Admin v4 – Vergleichsansicht + Scroll-Lock
   Zweck:
   - Admin-Overlay sperrt Hintergrund-Scroll.
   - Beim Auswählen eines bestehenden Vorhabens erscheint ein Vergleich:
     links neuer Vorschlag, rechts bestehende Akte.
   - Zuordnung wird verständlicher und sicherer.
============================================================ */

function piquAdminLockPageScroll() {
  document.body.classList.add("piqu-admin-scroll-lock");

  if (!document.body.dataset.piquAdminPreviousOverflow) {
    document.body.dataset.piquAdminPreviousOverflow = document.body.style.overflow || "__empty__";
  }

  document.body.style.overflow = "hidden";
}

function piquAdminUnlockPageScroll() {
  document.body.classList.remove("piqu-admin-scroll-lock");

  const previous = document.body.dataset.piquAdminPreviousOverflow;

  if (previous === "__empty__") {
    document.body.style.overflow = "";
  } else if (previous !== undefined) {
    document.body.style.overflow = previous;
  }

  delete document.body.dataset.piquAdminPreviousOverflow;
}

function piquAdminCloseOverlay() {
  const overlay = document.getElementById("piqu-admin-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }
  piquAdminUnlockPageScroll();
}


function piquAdminEnsureHelperStyles() {
  if (document.getElementById("piqu-admin-helper-styles")) return;

  const style = document.createElement("style");
  style.id = "piqu-admin-helper-styles";
  style.textContent = `
    .piqu-admin-scroll-lock { overflow: hidden !important; }
    .piqu-admin-decision-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin: 10px 0;
    }
    .piqu-admin-big-answer {
      display: inline-block;
      margin-top: 4px;
      font-size: 1.25rem;
      font-weight: 800;
    }
    .piqu-admin-ki-box.bad {
      border-color: rgba(160, 45, 45, 0.45);
      background: rgba(160, 45, 45, 0.08);
    }
    .piqu-admin-main-explain {
      margin: 10px 0;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.72);
      border: 1px solid rgba(70, 55, 35, 0.12);
    }
    .piqu-admin-details {
      margin: 10px 0;
      padding: 8px 10px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.55);
    }
    .piqu-admin-details summary {
      cursor: pointer;
      font-weight: 700;
    }
    @media (max-width: 760px) {
      .piqu-admin-decision-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

function piquAdminEnsureOverlay() {
  piquAdminEnsureHelperStyles();
  let overlay = document.getElementById("piqu-admin-overlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "piqu-admin-overlay";
  overlay.className = "hidden";

  overlay.innerHTML = `
    <div class="piqu-admin-window" role="dialog" aria-modal="true" aria-label="PIQu Adminbereich">
      <div class="piqu-admin-window-head">
        <div>
          <h3>PIQu Admin – Gesetzesmonitor</h3>
          <p>Vorschläge prüfen, vergleichen, übernehmen, zuordnen oder ablehnen.</p>
        </div>
        <button class="piqu-admin-close" type="button" id="piqu-admin-close-btn">×</button>
      </div>

      <div class="piqu-admin-toolbar">
        <label>
          Status
          <select id="piqu-admin-status-filter">
            <option value="offen">offen</option>
            <option value="alle">alle</option>
            <option value="abgelehnt">abgelehnt</option>
            <option value="zugeordnet">zugeordnet</option>
            <option value="uebernommen">uebernommen</option>
          </select>
        </label>

        <label>
          Suche
          <input id="piqu-admin-search" type="text" placeholder="Titel suchen..." />
        </label>

        <label>
          Anzahl
          <select id="piqu-admin-limit">
            <option value="10">10</option>
            <option value="25" selected>25</option>
            <option value="50">50</option>
          </select>
        </label>

        <button class="piqu-admin-primary" type="button" id="piqu-admin-load-btn">Laden</button>
        <button class="piqu-admin-safe" type="button" id="piqu-admin-stats-btn">Statistik</button>
      </div>

      <div class="piqu-admin-body">
        <div id="piqu-admin-status" class="piqu-admin-status">Bereit.</div>
        <div id="piqu-admin-list" class="piqu-admin-list"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("piqu-admin-close-btn")?.addEventListener("click", piquAdminCloseOverlay);

  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      piquAdminCloseOverlay();
    }
  });

  document.getElementById("piqu-admin-load-btn")?.addEventListener("click", piquAdminLoadSuggestions);
  document.getElementById("piqu-admin-stats-btn")?.addEventListener("click", piquAdminLoadStats);
  document.getElementById("piqu-admin-search")?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      piquAdminLoadSuggestions();
    }
  });

  return overlay;
}

async function piquAdminOpenOverlay() {
  const overlay = piquAdminEnsureOverlay();
  overlay.classList.remove("hidden");
  piquAdminLockPageScroll();

  await piquAdminLoadVorhaben();
  await piquAdminLoadSuggestions();
}

function piquAdminNormText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function piquAdminWordSet(text) {
  const stop = new Set([
    "und", "oder", "der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "eines",
    "mit", "für", "fuer", "zur", "zum", "von", "vom", "aus", "auf", "bei", "im", "in", "am",
    "an", "ist", "sind", "wird", "werden", "wurde", "wurden", "dass", "dieser", "diese",
    "dieses", "ueber", "über", "konkreten", "konkretes", "vorgang", "verfahren", "status",
    "bundesrat", "bundestag", "ausschuss", "ausschusszuweisung", "stellungnahme", "beschluss",
    "gesetz", "entwurf", "antrag", "thema", "bereich"
  ]);

  return new Set(
    piquAdminNormText(text)
      .split(" ")
      .map(x => x.trim())
      .filter(x => x.length >= 4 && !stop.has(x))
  );
}

function piquAdminFindSuggestion(id) {
  return piquAdminSuggestions.find(row => String(row.id) === String(id)) || null;
}

function piquAdminFindVorhaben(id) {
  return piquAdminVorhaben.find(v => String(v.id) === String(id)) || null;
}

function piquAdminVorhabenEvents(vorhabenId) {
  if (!Array.isArray(monitorEreignisse)) return [];

  return monitorEreignisse
    .filter(e => String(e.vorhaben_id) === String(vorhabenId))
    .sort((a, b) => {
      const dateA = new Date(a.datum || 0).getTime();
      const dateB = new Date(b.datum || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return Number(b.sort_order || 0) - Number(a.sort_order || 0);
    });
}

function piquAdminSuggestionText(row) {
  return [
    row?.vorgeschlagener_titel,
    row?.vorschlag_typ,
    row?.admin_verfahrensart,
    row?.admin_monitor_wuerdig,
    row?.admin_empfehlung,
    row?.status_hint_label,
    row?.event_label,
    row?.begruendung,
    row?.admin_empfehlung_begruendung,
    row?.admin_offizielle_beschreibung,
    row?.admin_waldbewohner_beschreibung,
    row?.admin_moegliche_zuordnung,
    row?.quelle_titel,
    row?.quelle_name
  ].filter(Boolean).join(" ");
}

function piquAdminVorhabenText(v) {
  const events = piquAdminVorhabenEvents(v?.id)
    .map(e => [e.ereignis_label, e.titel, e.beschreibung, e.quelle].filter(Boolean).join(" "));

  return [
    v?.titel,
    v?.status,
    v?.status_label,
    v?.kurzbeschreibung,
    v?.letzte_aktivitaet,
    v?.naechster_schritt,
    ...events
  ].filter(Boolean).join(" ");
}

function piquAdminCompareSuggestionWithVorhaben(row, v) {
  const suggestionNorm = piquAdminNormText(row?.vorgeschlagener_titel || "");
  const vorhabenNorm = piquAdminNormText(v?.titel || "");

  const suggestionText = piquAdminSuggestionText(row);
  const vorhabenText = piquAdminVorhabenText(v);

  const sWords = piquAdminWordSet(suggestionText);
  const vWords = piquAdminWordSet(vorhabenText);

  const gemeinsame = [...sWords].filter(w => vWords.has(w));

  const directTitleMatch =
    suggestionNorm && vorhabenNorm &&
    (suggestionNorm === vorhabenNorm || suggestionNorm.includes(vorhabenNorm) || vorhabenNorm.includes(suggestionNorm));

  let stufe = "niedrig";
  let empfehlung = "Eher nicht zuordnen";
  let klasse = "bad";

  if (directTitleMatch || gemeinsame.length >= 5) {
    stufe = "hoch";
    empfehlung = "Zuordnung wahrscheinlich sinnvoll";
    klasse = "good";
  } else if (gemeinsame.length >= 2) {
    stufe = "mittel";
    empfehlung = "Manuell prüfen";
    klasse = "warn";
  }

  const begruendung = directTitleMatch
    ? "Titel oder Kernthema überschneiden sich deutlich. Trotzdem Quelle und Inhalt kurz prüfen."
    : gemeinsame.length > 0
      ? `Gemeinsame Begriffe: ${gemeinsame.slice(0, 8).join(", ")}. Das kann auf thematische Nähe hinweisen, beweist aber nicht automatisch dieselbe Akte.`
      : "Es wurden kaum gemeinsame inhaltliche Begriffe gefunden. Das spricht eher gegen eine Zuordnung.";

  return {
    stufe,
    empfehlung,
    klasse,
    gemeinsame,
    begruendung
  };
}

function piquAdminCleanAdminValue(value) {
  const text = String(value ?? "").trim();
  if (!text || text.toLowerCase() === "null" || text.toLowerCase() === "undefined") return "";
  return text;
}

function piquAdminNormAdminValue(value) {
  return piquAdminCleanAdminValue(value)
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replace(/\s+/g, "_")
    .trim();
}

function piquAdminLabelMonitorWuerdig(value) {
  const key = piquAdminNormAdminValue(value);

  if (key === "ja") return "JA";
  if (key === "nein") return "NEIN";
  if (key === "unklar") return "UNKLAR";

  return "UNKLAR";
}

function piquAdminKlasseMonitorWuerdig(value) {
  const key = piquAdminNormAdminValue(value);

  if (key === "ja") return "good";
  if (key === "nein") return "bad";

  return "warn";
}

function piquAdminLabelEmpfehlung(value) {
  const key = piquAdminNormAdminValue(value);

  if (key === "neu_uebernehmen") return "neu übernehmen";
  if (key === "zuordnen_pruefen") return "Zuordnung prüfen";
  if (key === "ablehnen") return "ablehnen";
  if (key === "pruefen" || key === "prüfen") return "prüfen";

  return piquAdminCleanAdminValue(value) || "prüfen";
}

function piquAdminLabelVerfahrensart(value) {
  const key = piquAdminNormAdminValue(value);

  const labels = {
    gesetz: "Gesetz",
    gesetzesaenderung: "Gesetzesänderung",
    reform: "Reform",
    verordnung: "Verordnung",
    antrag: "Antrag",
    foerderprogramm: "Förderprogramm",
    beschluss: "Beschluss",
    steuer: "Steuer",
    abgabe: "Abgabe",
    sozialleistung: "Sozialleistung",
    gericht: "Gericht",
    bericht: "Bericht",
    termin: "Termin",
    sonstiges: "Sonstiges"
  };

  return labels[key] || piquAdminCleanAdminValue(value) || "unklar";
}

function piquAdminVorgangErklaerung(row) {
  const adminText = piquAdminCleanAdminValue(row?.admin_waldbewohner_beschreibung);
  if (adminText) return adminText;

  const officialText = piquAdminCleanAdminValue(row?.admin_offizielle_beschreibung);
  if (officialText) return officialText;

  const typ = String(row?.vorschlag_typ || row?.admin_verfahrensart || "").toLowerCase();
  const event = String(row?.event_label || "").toLowerCase();
  const status = String(row?.status_hint_label || row?.status_hint || "").toLowerCase();

  if (typ.includes("gesetz") || typ.includes("verordnung") || typ.includes("steuer") || typ.includes("abgabe")) {
    return "Das kann normalerweise ein echter Monitorfall sein, weil daraus Regeln, Pflichten, Rechte, Steuern oder Abgaben entstehen oder geändert werden können.";
  }

  if (typ.includes("reform")) {
    return "Das sieht nach einem verfolgbaren Reformthema aus. Wichtig ist, ob es schon ein offizielles Verfahren gibt oder nur eine politische Ankündigung.";
  }

  if (typ.includes("foerder") || typ.includes("förder")) {
    return "Das betrifft vermutlich ein Förderprogramm. Monitorwürdig ist es, wenn das Programm konkret gestartet, geändert, verlängert, gestoppt oder finanziell beschlossen wird.";
  }

  if (event.includes("anhörung") || event.includes("anhoerung") || status.includes("ausschuss")) {
    return "Das ist ein parlamentarischer Prüfschritt. Wichtig ist, ob dahinter ein konkretes Gesetz, eine Reform oder ein Förderprogramm steckt.";
  }

  if (event.includes("kleine anfrage")) {
    return "Eine Kleine Anfrage ist erstmal nur eine Frage an die Regierung. Monitorwürdig wird sie nur, wenn darin ein konkretes Gesetz, eine Reform, eine Verordnung oder ein anderer verfolgbarer Vorgang sichtbar wird.";
  }

  if (typ.includes("bericht")) {
    return "Ein Bericht ist meistens nur Information. Für den Monitor reicht das normalerweise nicht, außer aus dem Bericht folgt ein konkretes Vorhaben.";
  }

  if (typ.includes("termin") || event.includes("besuch") || event.includes("reise")) {
    return "Das ist eher ein Termin oder politischer Austausch. Für den Monitor normalerweise nicht geeignet, wenn daraus kein eigener Beschluss oder kein neues Verfahren entsteht.";
  }

  return "Der Vorgang ist nicht eindeutig klassifiziert. Prüfe vor allem: Kann daraus normalerweise ein Gesetz, eine Verordnung, ein Beschluss, ein Förderprogramm oder ein anderer verfolgbarer Vorgang werden?";
}

function piquAdminEmpfehlungFuerSuggestion(row) {
  const wuerdig = piquAdminNormAdminValue(row?.admin_monitor_wuerdig);
  const empfehlung = piquAdminNormAdminValue(row?.admin_empfehlung);
  const begruendung = piquAdminCleanAdminValue(row?.admin_empfehlung_begruendung);
  const doppelt = Number(row?.offene_dopplungen_anzahl || 0) > 1;

  if (doppelt) {
    return {
      klasse: "warn",
      titel: "Erst Zuordnung prüfen",
      text: "Es gibt ähnliche offene Vorschläge. Prüfe zuerst, ob dieser Vorschlag zu einer bestehenden Akte gehört."
    };
  }

  if (empfehlung === "ablehnen" || wuerdig === "nein") {
    return {
      klasse: "bad",
      titel: "Eher ablehnen",
      text: begruendung || "Die KI sieht daraus normalerweise keinen verfolgbaren Monitorfall."
    };
  }

  if (empfehlung === "zuordnen_pruefen") {
    return {
      klasse: "warn",
      titel: "Zuordnung prüfen",
      text: begruendung || "Der Vorgang wirkt monitorwürdig, könnte aber zu einer bestehenden Akte gehören."
    };
  }

  if (empfehlung === "neu_uebernehmen" || wuerdig === "ja") {
    return {
      klasse: "good",
      titel: "Eher übernehmen",
      text: begruendung || "Die KI sieht daraus wahrscheinlich einen verfolgbaren Monitorfall."
    };
  }

  return {
    klasse: "warn",
    titel: "Manuell prüfen",
    text: begruendung || "Die KI ist unsicher. Entscheidend ist, ob daraus normalerweise ein verfolgbares Vorhaben wird."
  };
}

function piquAdminRenderEventList(events) {
  if (!events.length) {
    return `<p class="piqu-admin-muted">Noch keine Ereignisse sichtbar.</p>`;
  }

  return `
    <ul class="piqu-admin-compare-events">
      ${events.slice(0, 5).map(e => `
        <li>
          <b>${piquAdminEscape(e.ereignis_label || e.ereignis_typ || "Ereignis")}</b>
          <span>${piquAdminEscape(piquAdminDate(e.datum))}</span><br>
          ${piquAdminEscape(e.titel || "Ohne Titel")}
        </li>
      `).join("")}
    </ul>
  `;
}

function piquAdminRenderAssignmentComparison(row, v) {
  const vergleich = piquAdminCompareSuggestionWithVorhaben(row, v);
  const events = piquAdminVorhabenEvents(v.id);

  return `
    <div class="piqu-admin-compare-box">
      <div class="piqu-admin-compare-head ${piquAdminEscape(vergleich.klasse)}">
        <strong>Vergleich: ${piquAdminEscape(vergleich.empfehlung)}</strong>
        <span>Ähnlichkeit: ${piquAdminEscape(vergleich.stufe)}</span>
      </div>

      <div class="piqu-admin-compare-grid">
        <section class="piqu-admin-compare-col new">
          <h5>Neuer Vorschlag</h5>
          <p><b>Titel:</b> ${piquAdminEscape(row.vorgeschlagener_titel || "Ohne Titel")}</p>
          <p><b>Monitor-würdig:</b> ${piquAdminEscape(piquAdminLabelMonitorWuerdig(row.admin_monitor_wuerdig))}</p>
          <p><b>Verfahrensart:</b> ${piquAdminEscape(piquAdminLabelVerfahrensart(row.admin_verfahrensart || row.vorschlag_typ))}</p>
          <p><b>Status/Ereignis:</b> ${piquAdminEscape(row.status_hint_label || row.status_hint || "offen")} · ${piquAdminEscape(row.event_label || "offen")}</p>
          <p><b>Quelle:</b> ${piquAdminEscape(row.quelle_name || "Unbekannt")} · ${piquAdminEscape(piquAdminDate(row.quelle_datum))}</p>
          <p><b>Für Waldbewohner:</b><br>${piquAdminEscape(piquAdminVorgangErklaerung(row))}</p>
          ${
            row.admin_offizielle_beschreibung
              ? `<p><b>Offiziell/technisch:</b><br>${piquAdminEscape(row.admin_offizielle_beschreibung)}</p>`
              : ""
          }
          ${
            row.admin_moegliche_zuordnung
              ? `<p><b>KI-Zuordnungshinweis:</b><br>${piquAdminEscape(row.admin_moegliche_zuordnung)}</p>`
              : ""
          }
        </section>

        <section class="piqu-admin-compare-col existing">
          <h5>Bestehende Akte</h5>
          <p><b>Titel:</b> ${piquAdminEscape(v.titel || "Ohne Titel")}</p>
          <p><b>Aktueller Status:</b> ${piquAdminEscape(v.status_label || v.status || "offen")}</p>
          <p><b>Letzte Aktivität:</b> ${piquAdminEscape(v.letzte_aktivitaet || "nicht gespeichert")} · ${piquAdminEscape(piquAdminDate(v.letzte_aktivitaet_datum))}</p>
          <p><b>Nächster Schritt:</b> ${piquAdminEscape(v.naechster_schritt || "nicht gespeichert")} ${v.naechster_schritt_datum ? "· " + piquAdminEscape(piquAdminDate(v.naechster_schritt_datum)) : ""}</p>
          <p><b>Kurzbeschreibung:</b><br>${piquAdminEscape(v.kurzbeschreibung || "Keine Kurzbeschreibung gespeichert.")}</p>
          <div><b>Bisherige Ereignisse:</b>${piquAdminRenderEventList(events)}</div>
        </section>
      </div>

      <div class="piqu-admin-compare-reason ${piquAdminEscape(vergleich.klasse)}">
        <b>PIQu-Vergleich:</b> ${piquAdminEscape(vergleich.begruendung)}
      </div>
    </div>
  `;
}

function piquAdminShowAssignmentComparison(id) {
  const row = piquAdminFindSuggestion(id);
  const select = document.getElementById("piqu-admin-assign-" + id);
  const box = document.getElementById("piqu-admin-compare-" + id);
  const vorhabenId = select?.value || "";

  if (!box) return;

  if (!row || !vorhabenId) {
    box.innerHTML = `
      <div class="piqu-admin-compare-empty">
        Wähle eine bestehende Akte aus. Danach zeigt PIQu den neuen Vorschlag und die vorhandene Akte direkt gegenüber.
      </div>
    `;
    return;
  }

  const v = piquAdminFindVorhaben(vorhabenId);

  if (!v) {
    box.innerHTML = `<div class="piqu-admin-compare-empty">Ausgewählte Akte konnte nicht geladen werden.</div>`;
    return;
  }

  box.innerHTML = piquAdminRenderAssignmentComparison(row, v);
}

function piquAdminRenderSuggestions() {
  const list = document.getElementById("piqu-admin-list");
  if (!list) return;

  if (!piquAdminSuggestions.length) {
    list.innerHTML = `<div class="piqu-admin-card"><p>Keine Vorschläge gefunden.</p></div>`;
    return;
  }

  list.innerHTML = piquAdminSuggestions.map(row => {
    const dopplung = Number(row.offene_dopplungen_anzahl || 0) > 1
      ? `<span class="piqu-admin-badge red">Dopplung: ${piquAdminEscape(row.offene_dopplungen_anzahl)}</span>`
      : "";

    const quelle = row.quelle_url
      ? `<a href="${piquAdminEscape(row.quelle_url)}" target="_blank" rel="noopener noreferrer">Quelle öffnen</a> <span class="qpi-link-target">(führt zu: ${piquAdminEscape(domainAusUrl(row.quelle_url))})</span>`
      : "keine Quelle";

    const empfehlung = piquAdminEmpfehlungFuerSuggestion(row);
    const wuerdigLabel = piquAdminLabelMonitorWuerdig(row.admin_monitor_wuerdig);
    const wuerdigKlasse = piquAdminKlasseMonitorWuerdig(row.admin_monitor_wuerdig);
    const verfahrensart = piquAdminLabelVerfahrensart(row.admin_verfahrensart || row.vorschlag_typ);
    const empfehlungLabel = piquAdminLabelEmpfehlung(row.admin_empfehlung);
    const adminGrund = piquAdminCleanAdminValue(row.admin_empfehlung_begruendung);
    const offizielleBeschreibung = piquAdminCleanAdminValue(row.admin_offizielle_beschreibung);
    const waldbewohnerBeschreibung = piquAdminVorgangErklaerung(row);
    const zuordnungHinweis = piquAdminCleanAdminValue(row.admin_moegliche_zuordnung);

    return `
      <article class="piqu-admin-card" id="piqu-admin-card-${piquAdminEscape(row.id)}">
        <h4>${piquAdminEscape(row.vorgeschlagener_titel)}</h4>

        <div class="piqu-admin-decision-grid">
          <div class="piqu-admin-ki-box ${piquAdminEscape(wuerdigKlasse)}">
            <b>Monitor-würdig?</b><br>
            <span class="piqu-admin-big-answer">${piquAdminEscape(wuerdigLabel)}</span>
          </div>

          <div class="piqu-admin-ki-box">
            <b>Was wird daraus eher?</b><br>
            ${piquAdminEscape(verfahrensart)}
          </div>

          <div class="piqu-admin-ki-box ${piquAdminEscape(empfehlung.klasse)}">
            <b>Empfehlung</b><br>
            ${piquAdminEscape(empfehlungLabel)}
          </div>
        </div>

        <div class="piqu-admin-ki-box ${piquAdminEscape(empfehlung.klasse)}">
          <b>${piquAdminEscape(empfehlung.titel)}</b><br>
          ${piquAdminEscape(adminGrund || empfehlung.text)}
        </div>

        <div class="piqu-admin-main-explain">
          <p><b>Für Waldbewohner:</b><br>${piquAdminEscape(waldbewohnerBeschreibung)}</p>

          ${
            zuordnungHinweis
              ? `<p><b>Zuordnungshinweis:</b><br>${piquAdminEscape(zuordnungHinweis)}</p>`
              : ""
          }
        </div>

        <details class="piqu-admin-details">
          <summary>Offizielle Details / Rohdaten anzeigen</summary>

          <div class="piqu-admin-meta">
            <span class="piqu-admin-badge">${piquAdminEscape(row.vorschlag_typ || "Typ offen")}</span>
            <span class="piqu-admin-badge">${piquAdminEscape(row.status_hint_label || row.status_hint || "Status offen")}</span>
            <span class="piqu-admin-badge">Confidence: ${piquAdminEscape(row.confidence ?? "?")}</span>
            <span class="piqu-admin-badge">${piquAdminEscape(row.event_label || "Ereignis offen")}</span>
            ${dopplung}
          </div>

          ${
            offizielleBeschreibung
              ? `<p><b>Offiziell/technisch:</b><br>${piquAdminEscape(offizielleBeschreibung)}</p>`
              : ""
          }

          <p><b>KI-Begründung:</b><br>${piquAdminEscape(row.begruendung || "Keine Begründung.")}</p>
          <p><b>Quelle:</b> ${piquAdminEscape(row.quelle_name || "Unbekannt")} · ${piquAdminEscape(piquAdminDate(row.quelle_datum))} · ${quelle}</p>
        </details>

        <div class="piqu-admin-actions">
          <div class="piqu-admin-actions-row">
            <input class="piqu-admin-note" id="piqu-admin-note-${piquAdminEscape(row.id)}" type="text" placeholder="Admin-Notiz optional..." />
          </div>

          <div class="piqu-admin-actions-row">
            <button class="piqu-admin-danger" type="button" onclick="piquAdminReject('${piquAdminEscape(row.id)}')">
              Ablehnen
            </button>

            <button class="piqu-admin-safe" type="button" onclick="piquAdminCreateNew('${piquAdminEscape(row.id)}')">
              Als neues Vorhaben anlegen
            </button>
          </div>

          <div class="piqu-admin-assign-area">
            <div class="piqu-admin-actions-row">
              <select id="piqu-admin-assign-${piquAdminEscape(row.id)}" onchange="piquAdminShowAssignmentComparison('${piquAdminEscape(row.id)}')">
                ${piquAdminVorhabenOptions()}
              </select>

              <label>
                <input id="piqu-admin-update-${piquAdminEscape(row.id)}" type="checkbox" />
                Status aktualisieren
              </label>

              <button class="piqu-admin-warn" type="button" onclick="piquAdminAssign('${piquAdminEscape(row.id)}')">
                Zu bestehender Akte hinzufügen
              </button>
            </div>

            <div id="piqu-admin-compare-${piquAdminEscape(row.id)}" class="piqu-admin-compare-slot">
              <div class="piqu-admin-compare-empty">
                Wähle eine bestehende Akte aus. Danach zeigt PIQu den neuen Vorschlag und die vorhandene Akte direkt gegenüber.
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

async function piquAdminAssign(id) {
  const select = document.getElementById("piqu-admin-assign-" + id);
  const vorhabenId = select?.value || "";

  if (!vorhabenId) {
    alert("Bitte zuerst ein bestehendes Vorhaben auswählen. Danach erscheint der Vergleich.");
    return;
  }

  const row = piquAdminFindSuggestion(id);
  const v = piquAdminFindVorhaben(vorhabenId);
  const vergleich = row && v ? piquAdminCompareSuggestionWithVorhaben(row, v) : null;
  const label = select.options[select.selectedIndex]?.textContent || "Vorhaben";

  const warnText = vergleich
    ? `\n\nPIQu-Vergleich: ${vergleich.empfehlung}\nÄhnlichkeit: ${vergleich.stufe}\n${vergleich.begruendung}`
    : "";

  if (!confirm(`Diesen Vorschlag wirklich zuordnen zu:\n${label}${warnText}`)) return;

  try {
    await piquAdminCall("assign", {
      vorschlag_id: id,
      vorhaben_id: vorhabenId,
      update_vorhaben: document.getElementById("piqu-admin-update-" + id)?.checked === true,
      notiz: piquAdminGetNote(id)
    });

    piquAdminSetOverlayStatus("Vorschlag zugeordnet.", false);
    piquAdminRemoveCard(id);
    await piquAdminLoadVorhaben();
  } catch (err) {
    piquAdminSetOverlayStatus(err.message || String(err), true);
  }
}
/* ============================================================
   PIQu Admin-Dashboard v2 – geheimes Q-Login
   - 5x Klick direkt auf das Q im Startlogo
   - Supabase Auth Magic-Link
   - Dashboard über Edge Function: piqu-admin-monitor-dashboard
   - keine sichtbare Änderung für normale Nutzer
============================================================ */

const PIQU_ADMIN_DASHBOARD_FUNCTION_NAME = "piqu-admin-monitor-dashboard";
const PIQU_ADMIN_REDIRECT_URL = "https://codepen.io/Joale689/pen/OPbMmpe";
const PIQU_ADMIN_DEFAULT_EMAIL = "black_diamond689@yahoo.de";

let piquSecretAdminTapCount = 0;
let piquSecretAdminLastTap = 0;
let piquSecretAdminClientPromise = null;
let piquSecretAdminIsLoading = false;

/* Alte Monitor-Waage-Geheimlogik deaktivieren.
   Der neue Einstieg läuft nur über das Q im Startlogo. */
try {
  if (typeof piquAdminInstallHiddenEntry === "function") {
    piquAdminInstallHiddenEntry = function piquAdminInstallHiddenEntryDisabled() {};
  }
} catch (err) {
  console.warn("Alte Admin-Einstiegslogik konnte nicht deaktiviert werden:", err);
}

function piquSecretAdminEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function piquSecretAdminGetClient() {
  if (piquSecretAdminClientPromise) {
    return piquSecretAdminClientPromise;
  }

  piquSecretAdminClientPromise = import("https://esm.sh/@supabase/supabase-js@2")
    .then(({ createClient }) => {
      return createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce"
        }
      });
    });

  return piquSecretAdminClientPromise;
}

function piquSecretAdminInstallQTrigger() {
  const logoSecondPart = document.querySelector(".hero-compact-main h1 .qpi-pi");

  if (logoSecondPart && !document.getElementById("piqu-admin-q-trigger")) {
    const text = logoSecondPart.textContent || "";

    if (text.startsWith("Q")) {
      const rest = text.slice(1);
      logoSecondPart.innerHTML = `<span id="piqu-admin-q-trigger" class="piqu-admin-q-trigger" aria-hidden="true">Q</span>${piquSecretAdminEscape(rest)}`;
    }
  }

  const trigger = document.getElementById("piqu-admin-q-trigger");
  if (!trigger || trigger.dataset.piquAdminReady === "1") return;

  trigger.dataset.piquAdminReady = "1";

  trigger.addEventListener("pointerdown", event => {
    event.stopPropagation();
  });

  trigger.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    piquSecretAdminHandleQClick();
  });
}

function piquSecretAdminHandleQClick() {
  const now = Date.now();

  if (now - piquSecretAdminLastTap > 5000) {
    piquSecretAdminTapCount = 0;
  }

  piquSecretAdminLastTap = now;
  piquSecretAdminTapCount += 1;

  // Bewusst kein sichtbares Feedback.
  if (piquSecretAdminTapCount >= 5) {
    piquSecretAdminTapCount = 0;
    piquSecretAdminLastTap = 0;
    piquSecretAdminOpen();
  }
}

function piquSecretAdminEnsureOverlay() {
  let overlay = document.getElementById("piqu-secret-admin-dashboard-overlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "piqu-secret-admin-dashboard-overlay";
  overlay.className = "piqu-secret-admin-dashboard-overlay hidden";

  overlay.innerHTML = `
    <div class="piqu-secret-admin-dashboard-window" role="dialog" aria-modal="true" aria-label="PIQu Admin-Dashboard">
      <div class="piqu-secret-admin-dashboard-head">
        <div>
          <h2>PIQu Admin</h2>
          <p>Geheimer Monitor-v2-Adminbereich</p>
        </div>
        <button id="piqu-secret-admin-close" class="piqu-secret-admin-close" type="button" aria-label="Adminbereich schließen">×</button>
      </div>

      <div id="piqu-secret-admin-login-box" class="piqu-secret-admin-box">
        <h3>Login</h3>
        <p class="piqu-secret-admin-muted">Nur freigegebene Admin-Konten erhalten Zugriff.</p>
        <input id="piqu-secret-admin-email" type="email" autocomplete="email" placeholder="Admin-E-Mail" value="${piquSecretAdminEscape(PIQU_ADMIN_DEFAULT_EMAIL)}" />
        <button id="piqu-secret-admin-send-login" type="button">Login-Link senden</button>
        <button id="piqu-secret-admin-check-session" class="piqu-secret-admin-secondary" type="button">Login prüfen</button>
      </div>

      <div id="piqu-secret-admin-user-box" class="piqu-secret-admin-box hidden">
        <p>Angemeldet als: <strong id="piqu-secret-admin-user-email">-</strong></p>
        <button id="piqu-secret-admin-load-dashboard" type="button">Dashboard laden</button>
        <button id="piqu-secret-admin-logout" class="piqu-secret-admin-secondary" type="button">Abmelden</button>
      </div>

      <p id="piqu-secret-admin-message" class="piqu-secret-admin-message"></p>

      <div id="piqu-secret-admin-dashboard" class="piqu-secret-admin-dashboard hidden">
        <div class="piqu-secret-admin-status-row">
          <span id="piqu-secret-admin-ampel" class="piqu-secret-admin-ampel">-</span>
          <p id="piqu-secret-admin-status-text">-</p>
        </div>

        <h3 class="piqu-secret-admin-section-title">Monitor</h3>
        <div class="piqu-secret-admin-grid">
          <div class="piqu-secret-admin-stat"><span>Öffentliche Akten</span><strong id="piqu-secret-admin-akten">-</strong></div>
          <div class="piqu-secret-admin-stat"><span>Ereignisse</span><strong id="piqu-secret-admin-ereignisse">-</strong></div>
          <div class="piqu-secret-admin-stat"><span>Geparkte Eingänge</span><strong id="piqu-secret-admin-geparkt">-</strong></div>
          <div class="piqu-secret-admin-stat"><span>Alte Vorschläge</span><strong id="piqu-secret-admin-alt">-</strong></div>
          <div class="piqu-secret-admin-stat"><span>Bundesrat-TOPs</span><strong id="piqu-secret-admin-br">-</strong></div>
          <div class="piqu-secret-admin-stat"><span>Fehler</span><strong id="piqu-secret-admin-fehler">-</strong></div>
          <div class="piqu-secret-admin-stat"><span>Prüfung fällig</span><strong id="piqu-secret-admin-pruefung">-</strong></div>
          <div class="piqu-secret-admin-stat"><span>Bald verwerfen</span><strong id="piqu-secret-admin-bald">-</strong></div>
        </div>

        <h3 class="piqu-secret-admin-section-title">DIP / Bundestag</h3>
        <div class="piqu-secret-admin-grid">
          <div class="piqu-secret-admin-stat piqu-secret-admin-stat-good"><span>DIP offen</span><strong id="piqu-secret-admin-dip-offen">-</strong></div>
          <div class="piqu-secret-admin-stat"><span>DIP erledigt</span><strong id="piqu-secret-admin-dip-erledigt">-</strong></div>
          <div class="piqu-secret-admin-stat piqu-secret-admin-stat-good"><span>Bundesrat ohne DIP</span><strong id="piqu-secret-admin-dip-br-offen">-</strong></div>
          <div class="piqu-secret-admin-stat piqu-secret-admin-stat-good"><span>Titel ohne DIP</span><strong id="piqu-secret-admin-dip-titel-offen">-</strong></div>
        </div>

        <h3 class="piqu-secret-admin-section-title">BGBl / recht.bund</h3>
        <div class="piqu-secret-admin-grid">
          <div class="piqu-secret-admin-stat"><span>BGBl beobachten</span><strong id="piqu-secret-admin-bgbl-beobachten">-</strong></div>
          <div class="piqu-secret-admin-stat"><span>BGBl nicht relevant</span><strong id="piqu-secret-admin-bgbl-nicht-relevant">-</strong></div>
          <div class="piqu-secret-admin-stat piqu-secret-admin-stat-good"><span>BGBl Prüfung nötig</span><strong id="piqu-secret-admin-bgbl-pruefung">-</strong></div>
          <div class="piqu-secret-admin-stat piqu-secret-admin-stat-good"><span>BGBl Sonderfälle</span><strong id="piqu-secret-admin-bgbl-sonderfaelle">-</strong></div>
        </div>

        <details class="piqu-secret-admin-raw-details">
          <summary>Rohdaten anzeigen</summary>
          <pre id="piqu-secret-admin-raw"></pre>
        </details>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("piqu-secret-admin-close")?.addEventListener("click", piquSecretAdminClose);
  document.getElementById("piqu-secret-admin-send-login")?.addEventListener("click", piquSecretAdminSendLoginLink);
  document.getElementById("piqu-secret-admin-check-session")?.addEventListener("click", piquSecretAdminRefreshSessionView);
  document.getElementById("piqu-secret-admin-load-dashboard")?.addEventListener("click", piquSecretAdminLoadDashboard);
  document.getElementById("piqu-secret-admin-logout")?.addEventListener("click", piquSecretAdminLogout);

  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      piquSecretAdminClose();
    }
  });

  return overlay;
}

function piquSecretAdminSetMessage(text, type = "") {
  const msg = document.getElementById("piqu-secret-admin-message");
  if (!msg) return;

  msg.textContent = text || "";
  msg.classList.remove("ok", "error");

  if (type) {
    msg.classList.add(type);
  }
}

function piquSecretAdminSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "-";
}

async function piquSecretAdminOpen() {
  const overlay = piquSecretAdminEnsureOverlay();
  overlay.classList.remove("hidden");
  document.body.classList.add("piqu-secret-admin-scroll-lock");
  await piquSecretAdminRefreshSessionView();
}

function piquSecretAdminClose() {
  const overlay = document.getElementById("piqu-secret-admin-dashboard-overlay");
  if (overlay) overlay.classList.add("hidden");
  document.body.classList.remove("piqu-secret-admin-scroll-lock");
}

async function piquSecretAdminRefreshSessionView() {
  piquSecretAdminEnsureOverlay();

  try {
    const client = await piquSecretAdminGetClient();
    const { data, error } = await client.auth.getSession();

    const loginBox = document.getElementById("piqu-secret-admin-login-box");
    const userBox = document.getElementById("piqu-secret-admin-user-box");
    const userEmail = document.getElementById("piqu-secret-admin-user-email");

    if (error || !data.session) {
      loginBox?.classList.remove("hidden");
      userBox?.classList.add("hidden");
      if (error) piquSecretAdminSetMessage("Noch nicht eingeloggt: " + error.message, "error");
      return false;
    }

    loginBox?.classList.add("hidden");
    userBox?.classList.remove("hidden");
    if (userEmail) userEmail.textContent = data.session.user.email || "unbekannt";

    piquSecretAdminSetMessage("Login aktiv. Dashboard kann geladen werden.", "ok");
    return true;
  } catch (err) {
    piquSecretAdminSetMessage(err instanceof Error ? err.message : String(err), "error");
    return false;
  }
}

async function piquSecretAdminSendLoginLink() {
  if (piquSecretAdminIsLoading) return;

  const email = document.getElementById("piqu-secret-admin-email")?.value?.trim() || "";

  if (!email) {
    piquSecretAdminSetMessage("Bitte Admin-E-Mail eingeben.", "error");
    return;
  }

  try {
    piquSecretAdminIsLoading = true;
    piquSecretAdminSetMessage("Login-Link wird gesendet...", "");

    const client = await piquSecretAdminGetClient();
    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: PIQU_ADMIN_REDIRECT_URL
      }
    });

    if (error) throw error;

    piquSecretAdminSetMessage("Login-Link wurde gesendet. Bitte E-Mail prüfen.", "ok");
  } catch (err) {
    piquSecretAdminSetMessage(err instanceof Error ? err.message : String(err), "error");
  } finally {
    piquSecretAdminIsLoading = false;
  }
}

async function piquSecretAdminLogout() {
  try {
    const client = await piquSecretAdminGetClient();
    await client.auth.signOut();
  } finally {
    document.getElementById("piqu-secret-admin-dashboard")?.classList.add("hidden");
    await piquSecretAdminRefreshSessionView();
    piquSecretAdminSetMessage("Abgemeldet.", "ok");
  }
}

async function piquSecretAdminLoadDashboard() {
  if (piquSecretAdminIsLoading) return;

  try {
    piquSecretAdminIsLoading = true;
    piquSecretAdminSetMessage("Dashboard wird geladen...", "");

    const client = await piquSecretAdminGetClient();
    const { data: sessionData } = await client.auth.getSession();

    if (!sessionData.session) {
      await piquSecretAdminRefreshSessionView();
      piquSecretAdminSetMessage("Nicht eingeloggt.", "error");
      return;
    }

    const { data, error } = await client.functions.invoke(PIQU_ADMIN_DASHBOARD_FUNCTION_NAME, {
      method: "GET"
    });

    if (error) throw error;

    if (!data || data.ok !== true) {
      throw new Error(data?.message || data?.error || "Admin-Abruf wurde abgelehnt.");
    }

    const payload = data.payload || {};
    const dashboard = payload.dashboard || {};

    piquSecretAdminSetText("piqu-secret-admin-akten", dashboard.akten_oeffentlich);
    piquSecretAdminSetText("piqu-secret-admin-ereignisse", dashboard.ereignisse_oeffentlich);
    piquSecretAdminSetText("piqu-secret-admin-geparkt", dashboard.geparkt_gesamt);
    piquSecretAdminSetText("piqu-secret-admin-alt", dashboard.alte_monitor_vorschlaege);
    piquSecretAdminSetText("piqu-secret-admin-br", dashboard.bundesrat_tops);
    piquSecretAdminSetText("piqu-secret-admin-fehler", dashboard.fehler);
    piquSecretAdminSetText("piqu-secret-admin-pruefung", dashboard.pruefung_faellig);
    piquSecretAdminSetText("piqu-secret-admin-bald", dashboard.bald_verwerfen);

    piquSecretAdminSetText("piqu-secret-admin-dip-offen", dashboard.dip_offen);
    piquSecretAdminSetText("piqu-secret-admin-dip-erledigt", dashboard.dip_erledigt);
    piquSecretAdminSetText("piqu-secret-admin-dip-br-offen", dashboard.dip_bundesrat_offen);
    piquSecretAdminSetText("piqu-secret-admin-dip-titel-offen", dashboard.dip_titel_offen);

    piquSecretAdminSetText("piqu-secret-admin-bgbl-beobachten", dashboard.bgbl_beobachten);
    piquSecretAdminSetText("piqu-secret-admin-bgbl-nicht-relevant", dashboard.bgbl_nicht_relevant);
    piquSecretAdminSetText("piqu-secret-admin-bgbl-pruefung", dashboard.bgbl_pruefung_noetig);
    piquSecretAdminSetText("piqu-secret-admin-bgbl-sonderfaelle", dashboard.bgbl_sonderfaelle);

    const ampel = document.getElementById("piqu-secret-admin-ampel");
    if (ampel) {
      ampel.textContent = dashboard.admin_ampel || "-";
      ampel.dataset.ampel = dashboard.admin_ampel || "";
    }

    piquSecretAdminSetText("piqu-secret-admin-status-text", dashboard.admin_status_text || "-");

    const raw = document.getElementById("piqu-secret-admin-raw");
    if (raw) raw.textContent = JSON.stringify(data, null, 2);

    document.getElementById("piqu-secret-admin-dashboard")?.classList.remove("hidden");
    piquSecretAdminSetMessage("Dashboard geladen.", "ok");
  } catch (err) {
    piquSecretAdminSetMessage(err instanceof Error ? err.message : String(err), "error");
  } finally {
    piquSecretAdminIsLoading = false;
  }
}

async function piquSecretAdminAutoHandleReturnFromLogin() {
  const hasAuthReturn =
    window.location.hash.includes("access_token=") ||
    window.location.search.includes("code=") ||
    window.location.hash.includes("error=");

  if (!hasAuthReturn) return;

  piquSecretAdminEnsureOverlay();
  const ok = await piquSecretAdminRefreshSessionView();

  if (ok) {
    await piquSecretAdminOpen();
    await piquSecretAdminLoadDashboard();
  } else {
    await piquSecretAdminOpen();
  }
}

function piquSecretAdminBoot() {
  piquSecretAdminInstallQTrigger();

  // Falls das Logo später neu gerendert wird.
  window.setTimeout(piquSecretAdminInstallQTrigger, 500);
  window.setTimeout(piquSecretAdminInstallQTrigger, 1500);

  piquSecretAdminAutoHandleReturnFromLogin();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", piquSecretAdminBoot);
} else {
  piquSecretAdminBoot();
}
