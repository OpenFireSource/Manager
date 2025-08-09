# Zertifikate für die Entwicklung
Passwort: `12345678`

## Zertifikate generieren

### Root-Zertifikat anlegen

```bash
openssl genrsa -des3 -out rootCA.key 4096
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.crt
```

### Server Zertifikat anlegen

In den Datei `keycloak.cnf` und `frontend.cnf` sind die Konfigurationen für das Zertifikat hinterlegt.
Diese Datei kann bei Bedarf angepasst werden.
Im letzten Konfigurationsblock können noch weitere SANs (Subject Alternative Names) hinzugefügt werden, falls benötigt.

#### Keycloak
```bash
openssl genrsa -out keycloak.key 2048
openssl req -new -key keycloak.key -out keycloak.csr -config keycloak.cnf
openssl x509 -req -in keycloak.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out keycloak.crt -days 365 -sha256 -extfile keycloak.cnf -extensions req_ext
```
#### Frontend
```bash
openssl genrsa -out frontend.key 2048
openssl req -new -key frontend.key -out frontend.csr -config frontend.cnf
openssl x509 -req -in frontend.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out frontend.crt -days 365 -sha256 -extfile frontend.cnf -extensions req_ext
```