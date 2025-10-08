# OFS Manager

> [!IMPORTANT]
> Das Projekt ist gerade in der Entwicklung und noch nicht für den Produktiveinsatz geeignet.

⭐ Hilf uns, mehr Entwickler zu erreichen und die OpenFireSource-Community zu vergrößern.
Gib dem Repo einen Stern!

Manager ist eine Open-Source-Software für den Einsatz in BOS-Organisationen.
Sie bietet eine Vielzahl von Funktionen zur Unterstützung von Einsatzkräften und der Organisation.

# Warum OFS-Manager?

Es gibt eine vielzahl von Softwarelösungen, die für den Einsatz in BOS-Organisationen entwickelt wurden.
Die meisten dieser Lösungen sind jedoch proprietär und kostenpflichtig.
Das OFS-Manager-Projekt zielt darauf ab, eine Open-Source-Alternative zu bieten, die kostenlos und anpassbar ist.

- **keine Abhängigkeit** von Anbietern und deren Geschäftsmodellen
- **anpassbar an die Bedürfnisse** der Organisation
- **Sicherheit durch Transparenz**
- **offene API**
- **einfache Integration** in bestehende Systeme
- Betrieb in der **eigenen Umgebung**

## Vergleich

| 🌟 **Aspekt**        | 🚀 **OFS-Manager**             | 🌐 **Andere Lösungen**  |
|----------------------|--------------------------------|-------------------------|
| 💰 **Preis**         | Kostenlos 🆓                   | Kostenpflichtig 💵      |
| 🔧 **Anpassbarkeit** | Hoch 🔝                        | Gering ⚠️               |
| 🔒 **Sicherheit**    | Hoch 🔐                        | Unklar ❓                |
| 🔗 **Integration**   | Hoch 🛠️                       | Gering - Mittel 📉      |
| 📊 **Transparenz**   | Hoch 🪟                        | Gering 🚫               |
| 📡 **API**           | Ja ✅                           | selten 🚫               |
| 🖥️ **Betrieb**      | Self-Hosted 🏠                 | Cloud ☁️                |
| 🤝 **Support**       | Community / Premium Support 🥇 | Anbieter 🏢             |
| 🛠️ **Entwicklung**  | Community / Anbieter 🤖        | Anbieter 🏢             |
| 📚 **Dokumentation** | Ja 📖                          | Anbieter Abhängigkeit ❓ |
| 💾 **Backup**        | Ja 💾                          | Anbieter Abhängigkeit ❓ |
| 🧩 **Abhängigkeit**  | Unabhängig 🌟                  | Abhängigkeit 🔗         |

# Entwicklung

## Tech-Stack

- Angular
- openapi
- NestJS
- PostgreSQL
- Keycloak
- Minio
- nginx

## Umgebung aufsetzten

Die Entwicklung des OFS-Managers erfolgt in einer **Docker**-Umgebung.

### Voraussetzungen

Bevor das ```docker-compose.dev.yml```-File ausgeführt werden kann, muss eine ```.env``` Datei angelegt werden.
Dafür gibt es eine ```dev.env``` Datei, die als Vorlage dient.

Die Umgebungsvariablen **KEYCLOAK_DB_PASSWORD** und **POSTGRES_KEYCLOAK_PASSWORD** müssen den gleichen Wert haben.

Im anschluss kann die Umgebung gestartet werden.

```
docker compose -f docker-compose.dev.yml up -d
```

Im Anschluss sind alle Dienste für das Frontend und Backend verfügbar.

| Dienst     | Port                       | Beschreibung      |
|------------|----------------------------|-------------------|
| Minio      | 9000 (API), 9001 (Console) | S3-Objektspeicher |
| Keycloak   | 20443 (über nginx)         | Authentifizierung |
| PostgreSQL | 5432                       | Datenbank         |
| Nginx      | 20443                      | Reverse Proxy     |

### Keycloak

Damit das Frontend und das Backend sich über Keycloak authentifizieren können, muss ein Realm und ein Client angelegt
werden.

1. Realm erstellen mit dem Namen **openfiresource**
2. Client erstellen mit dem Namen **manager-backend** und den folgenden Einstellungen:
    - Client ID: **manager-backend**
    - Client-Authentication: **On**
    - Authentication flow: nur **Service accounts roles**
3. In den Details des Clients Folgende Service-Account-Roles hinzufügen:
    - view-applications
    - manage-account-links
    - manage-account
    - delete-account
    - manage-authorization
    - impersonation
    - view-profile
    - view-groups
    - create-client
    - view-users
    - view-realm
    - view-identity-providers
    - view-events
    - view-clients
    - view-authorization" "realm-admin
    - query-users
    - query-realms
    - query-groups
    - impersonation
    - query-clients
    - manage-users
    - manage-realm
    - manage-identity-providers
    - manage-events
    - manage-clients
4. Die Credentials des Service-Accounts brauchst du im nächsten Abschnitt für die Konfiguration des Backends

### Backend

Das Backend wird auch über die Datei  ```backend/.env``` Datei konfiguriert.
Ein Beispiel ist in der Datei ```backend/sample.env``` zu finden.

Das Backend kann mit dem folgenden Befehl gestartet werden.

```
cd backend/
npm run start:dev
```

### Frontend

Das Frontend kann ohne weitere Konfiguration über den Folgdenen Befehl gestartet werden.

```
cd frontend/
npm run start
```
