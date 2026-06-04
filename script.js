const SUPABASE_URL = "https://cnxqwwzankopplenfzvq.supabase.co";
const SUPABASE_KEY = "sb_publishable_dGW_UHdhGkctVaowDyVUvQ_dscIaM0i";

// Sobald du einen echten Unterstützungslink hast, hier eintragen.
// Beispiel später: const DONATION_URL = "https://...";
const DONATION_URL = "";

let alleNews = [];
let aktiverFilter = "alle";
let aktiveEbene = "bund";
let aktiveQuelle = "alle";
let zitateAusblenden = false;
let aktiveAnsicht = "journal";
let aktiverBereich = "journal";
let zielMeldungId = null;
let zielJournalId = null;

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
      Was ist passiert, was bedeutet es ungefähr und welche offizielle Quelle belegt es?
    </p>

    <h3>Die drei Grundprinzipien</h3>
    <ol>
      <li>
        <b>Offizielle Quellen</b><br>
        PIQu arbeitet mit offiziellen politischen Quellen wie Bundestag, Bundesrat,
        Bundesregierung und später weiteren amtlichen Ebenen.
      </li>
      <li>
        <b>Verständliche Erklärung</b><br>
        PIQu übersetzt amtliche Sprache in normale Sprache, ohne politische Meinung zu erzeugen.
      </li>
      <li>
        <b>Original bleibt sichtbar</b><br>
        Jede Meldung soll zur Originalquelle führen, damit Nutzerinnen und Nutzer selbst nachprüfen können.
      </li>
    </ol>

    <p>
      PIQu bewertet keine Parteien, keine Personen und keine politischen Positionen.
      Ausführliche Hinweise zu Haftung, Datenschutz und Nutzung stehen in den entsprechenden Bereichen unten auf der Seite.
    </p>

    <p>
      Ziel ist ein Gegenpol zu Fakenews, Ragebait und überdrehter Empörung.
    </p>
  `,

  ki: `
    <h2>KI-Hinweis</h2>

    <p>
      PIQu nutzt KI unterstützend, um offizielle politische Meldungen verständlicher zu erklären.
      Die KI soll keine eigene Meinung hinzufügen und keine politische Bewertung erzeugen.
    </p>

    <p>
      Die Erklärungen sollen helfen, typische Fragen schneller zu verstehen:
      Was ist passiert? Warum ist es relevant? Wen betrifft es? Was könnte als Nächstes folgen?
    </p>

    <p>
      Wenn etwas aus den offiziellen Quellen nicht eindeutig ableitbar ist,
      soll PIQu vorsichtig bleiben und keine Spekulation als Tatsache darstellen.
    </p>

    <p>
      KI-Erklärungen können trotzdem Fehler enthalten.
      Deshalb bleiben Originalquellen, Faktenbereich und Quellenbereich bei jeder Meldung sichtbar.
    </p>
  `,

  quellen: `
    <h2>Quellen & Transparenz</h2>

    <p>
      PIQu nutzt offizielle Quellen, zum Beispiel Bundestag, Bundesrat,
      Bundesregierung und später offizielle Stellen der Länder, Landkreise und Gemeinden.
    </p>

    <p>
      In der aktuellen Alpha sind Bundestag, Bundesrat und Bundesregierung im Bundesbereich angebunden.
      Jede Meldung soll direkt zum Original oder zu den genutzten offiziellen Quellen führen.
    </p>

    <h3>Was PIQu mit Quellen macht</h3>
    <p>
      PIQu übernimmt Daten aus offiziellen Quellen, ordnet sie technisch ein
      und erstellt daraus verständlichere Erklärungen.
      Wenn zusätzliche Quellen genutzt werden, sollen sie im Quellenbereich sichtbar sein.
    </p>

    <p>
      Die Quellenansicht soll nachvollziehbar machen, woher eine Meldung stammt
      und welche Grundlage für die Erklärung verwendet wurde.
    </p>

    <p>
      Ausführliche Hinweise zu externen Links und Verantwortung externer Anbieter
      stehen im Bereich „Haftung & Hinweise“.
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
    </p>

    <p>
      <b>Wichtig:</b> Nutzerinnen und Nutzer sollten prüfen,
      ob sie sich tatsächlich auf dieser offiziellen PIQu-Adresse befinden.
    </p>

    <p>
      Nutzerinnen und Nutzer sind selbst dafür verantwortlich zu prüfen,
      ob sie sich tatsächlich auf der offiziellen PIQu-Seite befinden.
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
      PIQu arbeitet deshalb mit Quellenhinweisen, Originalverlinkungen,
      Statusangaben und Sicherheitsmarkierungen.
    </p>

    <h3>Externe Links</h3>
    <p>
      PIQu verlinkt nach Möglichkeit auf offizielle Quellen, zum Beispiel Seiten von Bundestag,
      Bundesrat, Bundesregierung oder anderen amtlichen Stellen.
      Beim Anklicken externer Links verlassen Nutzerinnen und Nutzer die PIQu-Seite.
    </p>

    <p>
      Für Inhalte, Sicherheit, Verfügbarkeit, spätere Änderungen oder technische Probleme
      externer Webseiten ist der jeweilige Anbieter verantwortlich.
      PIQu kontrolliert externe Webseiten nicht dauerhaft und kann nicht garantieren,
      dass verlinkte Seiten jederzeit unverändert, fehlerfrei oder sicher erreichbar sind.
    </p>

    <p>
      Nutzerinnen und Nutzer sollten vor der Eingabe persönlicher Daten,
      vor Downloads oder vor wichtigen Entscheidungen immer selbst prüfen,
      ob sie sich auf einer echten offiziellen Zielseite befinden.
      Besonders wichtig ist die Prüfung der Internetadresse im Browser.
    </p>

    <h3>Nutzung auf eigene Verantwortung</h3>
    <p>
      Nutzerinnen und Nutzer sollten wichtige Informationen immer anhand der Originalquelle prüfen,
      besonders wenn sie daraus rechtliche, finanzielle, berufliche oder sonstige wichtige Entscheidungen ableiten möchten.
      Bei Bedarf sollte fachkundiger Rat eingeholt werden.
    </p>

    <p>
      Die Nutzung von PIQu erfolgt auf eigene Verantwortung.
    </p>
  `,

  agb: `
    <h2>Nutzungsbedingungen / AGB</h2>

    <p>
      Diese Nutzungsbedingungen gelten für die Nutzung der PIQu-Webplattform.
      PIQu befindet sich derzeit in einer Alpha-Phase.
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
      PIQu wird vorerst über Vercel veröffentlicht.
    </p>

    <p>
      <b>Wichtig:</b> Nutzerinnen und Nutzer sollten prüfen,
      ob sie sich tatsächlich auf dieser offiziellen PIQu-Adresse befinden.
    </p>

    <p>
      Nutzerinnen und Nutzer sind selbst dafür verantwortlich zu prüfen,
      ob sie sich auf der offiziellen PIQu-Seite befinden.
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
      PIQu verlinkt nach Möglichkeit auf offizielle Quellen, zum Beispiel Webseiten von Bundestag,
      Bundesrat, Bundesregierung oder anderen amtlichen Stellen.
      Beim Anklicken solcher Links verlassen Nutzerinnen und Nutzer die PIQu-Webplattform.
    </p>

    <p>
      Für Inhalte, Sicherheit, Verfügbarkeit, spätere Änderungen oder technische Probleme
      externer Webseiten ist der jeweilige Anbieter verantwortlich.
      PIQu macht sich externe Inhalte nicht automatisch zu eigen und kontrolliert externe Seiten nicht dauerhaft.
    </p>

    <p>
      Nutzerinnen und Nutzer sind selbst dafür verantwortlich,
      die Adresse der Zielseite zu prüfen, bevor sie dort Daten eingeben,
      Dokumente herunterladen oder Entscheidungen auf Grundlage der dortigen Inhalte treffen.
    </p>

    <h3>7. Hinweise auf problematische Links oder Inhalte</h3>
    <p>
      Wenn Nutzerinnen oder Nutzer fehlerhafte, veraltete, problematische oder verdächtige Links entdecken,
      können sie PIQu darüber informieren.
      PIQu wird entsprechende Hinweise prüfen und betroffene Links oder Inhalte bei Bedarf korrigieren,
      entfernen oder kennzeichnen.
    </p>

    <h3>8. Änderungen</h3>
    <p>
      PIQu kann diese Nutzungsbedingungen anpassen, wenn sich Funktionen,
      rechtliche Anforderungen oder der Betrieb der Plattform ändern.
    </p>

    <p>
      <b>Hinweis:</b> Diese Nutzungsbedingungen gelten für die erste PIQu-Alpha auf Vercel unter https://piqu.vercel.app. Die Kontakt-E-Mail und die Anbieterangaben sind im Impressum angegeben.
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

    <h3>Aktueller Alpha-Stand</h3>
    <p>
      In der aktuellen Alpha werden politische Informationen aus offiziellen Quellen angezeigt.
      Es sind keine Nutzerkonten, keine Kommentarfunktion, kein Newsletter,
      kein Kontaktformular, kein Tracking und keine Analysewerkzeuge vorgesehen.
    </p>

    <h3>Hosting über Vercel</h3>
    <p>
      PIQu soll vorerst über Vercel veröffentlicht werden.
      Beim Aufruf der Website können technisch notwendige Zugriffsdaten verarbeitet werden,
      zum Beispiel IP-Adresse, Datum und Uhrzeit des Zugriffs, Browserinformationen,
      Geräteinformationen, angeforderte Dateien und Server-Logdaten.
    </p>

    <p>
      Diese Verarbeitung ist technisch erforderlich, damit die Website ausgeliefert,
      geschützt und betrieben werden kann.
      Die offizielle PIQu-Adresse lautet: https://piqu.vercel.app.
    </p>

    <h3>Datenquelle und Backend über Supabase</h3>
    <p>
      PIQu nutzt Supabase zur Speicherung und Bereitstellung der politischen Meldungen.
      In Supabase werden nach aktuellem Stand keine Nutzerkonten, keine Kommentare
      und keine von Besucherinnen und Besuchern eingegebenen personenbezogenen Daten gespeichert.
    </p>

    <p>
      Die öffentlich sichtbaren Inhalte stammen aus politischen Quellen und aus der technischen Verarbeitung dieser Quellen.
      Beim Abruf der Meldungen können technisch notwendige Verbindungsdaten an Supabase übertragen werden.
    </p>

    <h3>Keine Cookies, kein Tracking, keine Nutzerprofile</h3>
    <p>
      PIQu setzt in dieser Alpha nach aktuellem Stand keine Tracking-Cookies,
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

    <h3>Hinweis zum Stand dieser Datenschutzerklärung</h3>
    <p>
      Diese Datenschutzerklärung gilt für die erste PIQu-Alpha auf Vercel unter https://piqu.vercel.app. PIQu verwendet nach aktuellem Stand keine Nutzerkonten, kein Kontaktformular, kein Tracking und keine Analysewerkzeuge. Die Kontakt-E-Mail und die Anbieterangaben sind im Impressum angegeben.
    </p>
  `,

  kontakt: `
    <h2>Kontakt</h2>

    <p>
      PIQu soll für Hinweise, Fehler, Quellenvorschläge und Rückfragen
      zunächst ausschließlich per E-Mail erreichbar sein.
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
      Gleichzeitig entstehen bereits jetzt laufende Kosten,
      zum Beispiel für technische Dienste und KI-gestützte Verarbeitung.
    </p>

    <p>
      Wer PIQu sinnvoll findet, kann das Projekt später freiwillig unterstützen.
      Die Unterstützung soll beim Betrieb und bei der Weiterentwicklung helfen.
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
              Unterstützung bald möglich
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
    <h2>Was kommt demnächst?</h2>

    <div class="roadmap-grid roadmap-modal-grid">
      <div class="roadmap-card done">
        <h3>Bereits aktiv</h3>
        <ul>
          <li>Bundestag, Bundesregierung und Bundesrat als Bundesquellen</li>
          <li>automatische Datenaktualisierung</li>
          <li>Journalansicht mit Fakten- und Quellenreitern</li>
          <li>Status-, Quellen- und Zitatfilter</li>
          <li>geprüfte öffentliche Bundesrat-Ansicht</li>
        </ul>
      </div>

      <div class="roadmap-card progress">
        <h3>In Arbeit</h3>
        <ul>
          <li>Website-Darstellung weiter vereinfachen</li>
          <li>Berichtskarten optisch verbessern</li>
          <li>KI-Erklärungen kontrolliert weiter verbessern</li>
          <li>Impressum, Datenschutz, Haftung und AGB finalisieren</li>
        </ul>
      </div>

      <div class="roadmap-card later">
        <h3>Später geplant</h3>
        <ul>
          <li>Bundesländer, Landkreise und Gemeinden</li>
          <li>Teilen-Funktion / Kurz-Karten</li>
          <li>Einstellungen für Standardansicht</li>
          <li>freiwilliger Unterstützungsbereich</li>
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
          <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHTML(link.label)}
          </a>
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

        const label = escapeHTML(q.label || q.title || q.name || "Zusatzquelle");
        const url = q.url ? escapeHTML(q.url) : "";

        return `
          <li>
            ${
              url
                ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`
                : label
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
                <a href="${escapeHTML(n.quelle_url)}" target="_blank" rel="noopener noreferrer">
                  öffnen
                </a>
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
            ? `<a href="${escapeHTML(n.quelle_url)}" target="_blank" rel="noopener noreferrer">öffnen</a>`
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
          Der Fokus der Alpha liegt zuerst auf dem Bundesbereich.
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

          const title = escapeHTML(q.title || q.label || "Offizielle Quelle");
          const url = q.url ? escapeHTML(q.url) : "";
          const grund = escapeHTML(q.grund || q.reason || "");

          return `
            <li>
              ${
                url
                  ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`
                  : `<b>${title}</b>`
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

  if (zielJournalId) {
    setTimeout(() => {
      const ziel = document.getElementById(`journal-${safeDomId(zielJournalId)}`);

      if (ziel) {
        ziel.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        ziel.classList.add("journal-expanded");

        const preview = ziel.querySelector(".report-journal-preview");
        if (preview) {
          preview.classList.remove("is-collapsed");
          preview.classList.add("is-expanded");
        }

        const readBtn = ziel.querySelector(".journal-read-more-btn");
        if (readBtn) {
          readBtn.textContent = "Weniger anzeigen";
        }
      }

      zielJournalId = null;
    }, 50);
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

function renderNews() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = "";
  aktualisiereLevelInfo();

  if (aktiverBereich === "gesetzesmonitor") {
    app.innerHTML = `
      <div class="empty-state">
        <h3>⚖️ Gesetzesmonitor</h3>
        <p>
          Dieser Bereich ist geplant.
          Hier sollen politische Vorhaben später als Verlauf sichtbar werden:
          von der ersten Erwähnung über Beratungen bis zum Beschluss und Inkrafttreten.
        </p>
      </div>
    `;
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
    renderJournalAnsicht(app, news);
  } else {
    renderOriginalAnsicht(app, news);
  }
}

/* =========================
   DATEN LADEN
========================= */

function aktualisiereUpdateAnzeige(data) {
  const updateInfo = document.getElementById("update-info");
  if (!updateInfo) return;

  const zeiten = data
    .map(n => new Date(n.updated_at).getTime())
    .filter(t => !isNaN(t));

  if (zeiten.length === 0) {
    updateInfo.textContent = "Letztes Datenupdate: noch nicht verfügbar";
    return;
  }

  const neuesteZeit = Math.max(...zeiten);
  updateInfo.textContent = "Letztes Datenupdate: " + formatUhrzeit(neuesteZeit);
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
        id: `bundesrat-${top.sitzung}-${top.top_nummer}`,

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
   MODAL / EVENTS
========================= */

function oeffneInfo(key) {
  const modalLayer = document.getElementById("modal-layer");
  const modalContent = document.getElementById("modal-content");

  if (!modalLayer || !modalContent) return;

  modalContent.innerHTML = infoTexte[key] || "<h2>Info</h2><p>Keine Information gefunden.</p>";
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

      const app = document.getElementById("app");
      if (!app) return;

      if (aktiverBereich === "gesetzesmonitor") {
        app.innerHTML = `
          <div class="empty-state">
            <h3>⚖️ Gesetzesmonitor</h3>
            <p>
              Dieser Bereich ist geplant.
              Hier sollen politische Vorhaben später als Verlauf sichtbar werden:
              von der ersten Erwähnung über Beratungen bis zum Beschluss und Inkrafttreten.
            </p>
          </div>
        `;
      }
    });
  });

  aktualisiereAnzeige();
}

initialisiereBereichsNavigation();