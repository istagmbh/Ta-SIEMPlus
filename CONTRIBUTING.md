# Beitragen zu Ta-SIEMPlus

Danke, dass du zum Managed SIEM (Wazuh) Runbook & Checklisten Repository beitragen möchtest!

## Wie man beiträgt

Alle Änderungen müssen via Pull Request (PR) eingereicht werden. Dies sichert die Qualität und erhält die Konsistenz im Repository.

### Pull-Request-Prozess

1. **Erstelle einen Feature-Branch** vom Main-Branch
2. **Mache deine Änderungen** nach den unten stehenden Richtlinien
3. **Reiche einen Pull Request ein** mit klarer Beschreibung (Was? Warum?)
4. **Warte auf Review** - mindestens ein Reviewer muss zustimmen
5. **Behebe Feedback** falls Änderungen gefordert sind
6. **Merge** nach Approval

### Richtlinien für Änderungen

#### Beim Ändern von Runbooks
- **Begründe jede Änderung** (z.B. „Aktualisiert für Wazuh 4.12.0 Änderungen")
- **Dokumentiere Risiken**, die durch die Änderung entstehen
- **Bereitschaft Rollback-Anweisungen**, wenn es kritische Prozesse beeinflusst
- **Teste Befehle** in Non-Production vor dem Commit
- **Aktualisiere zugehörige Checklisten**, wenn Runbook-Schritte sich ändern

#### Beim Ändern von Checklisten
- **Halte Checklisten und Runbooks synchron** – wenn du einen änderst, überprüfe den anderen
- **Behalte das Checkbox-Format** für einfaches Tracking
- **Dupliziere keine Befehle** – referenziere das Runbook stattdessen
- **Aktualisiere Versionsnummern** in Metadaten, falls nötig

#### Beim Ändern von Templates
- **Behalte Platzhalter-Format** (z.B. `{{variable_name}}`)
- **Dokumentiere neue Felder**, die hinzugefügt werden
- **Gewährleiste Rückwärts-Kompatibilität**, wo möglich

#### Beim Aktualisieren des Kunden-Katalogs
- **Committe NIE Secrets direkt** – verwende Referenzen zu deinem Secret-Store (z.B. `vault://...`)
- **Validiere YAML-Syntax** vor dem Commit
- **Nutze das bereitgestellte Template** für Konsistenz

### Datei-Namenskonventionen

- Runbooks: `RUNBOOK_<BESCHREIBUNG>_<PLATFORM>.md`
- Checklisten: `CHECKLIST_<BESCHREIBUNG>.md`
- Templates: `<TYP>_TEMPLATE.md`
- Verwende GROSSBUCHSTABEN für Dateinamen
- Verwende Unterstriche zum Trennen von Wörtern

### Commit-Nachricht-Format

Verwende klare, aussagekräftige Commit-Nachrichten:
```
<type>: <short description>

<optionale längere Beschreibung>
<optional: Warum diese Änderung nötig ist>
<optional: Referenz zu zugehörigem Issue/Ticket>
```

Beispiele:
- `fix: Korrekte Indexer-Startbefehl im Upgrade-Runbook`
- `docs: Fehlende Voraussetzungen zur AIO-Checkliste hinzufügen`
- `feat: Neues Runbook für Agent-Upgrade`

### Code-Review-Standards

Reviewer sollten prüfen:
- **Genauigkeit** – Sind Befehle und Prozesse korrekt?
- **Vollständigkeit** – Sind alle notwendigen Schritte dokumentiert?
- **Klarheit** – Ist die Dokumentation leicht zu verstehen?
- **Sicherheit** – Gibt es angemessene Warnungen und Rollback-Prozeduren?
- **Konsistenz** – Folgt es bestehenden Mustern und Konventionen?

### Fragen oder Probleme?

Wenn du dir über eine Änderung unsicher bist oder Fragen hast, öffne bitte ein Issue zur Diskussion, bevor du einen PR einreichst.
