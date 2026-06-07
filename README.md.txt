# PIQu

PIQu zeigt politische Informationen aus offiziellen Quellen verständlich erklärt.

## Dateien

- `index.html` – Seitenstruktur
- `style.css` – Gestaltung
- `script.js` – Logik, Supabase-Abfragen und UI
- `vercel.json` – einfache Vercel-Konfiguration für statische Auslieferung

## Veröffentlichung über Vercel

1. Repository bei GitHub anlegen.
2. Diese Dateien in das Repository hochladen.
3. In Vercel das Repository importieren.
4. Framework Preset: `Other` oder statische Website.
5. Build Command leer lassen.
6. Output Directory leer lassen oder `.` verwenden.

## Sicherheitshinweis

Der im Frontend sichtbare Supabase Publishable Key ist für öffentliche Webseiten vorgesehen.
Schreibrechte und Admin-Aktionen müssen serverseitig über Supabase RLS, Grants und Edge Functions geschützt bleiben.
