#!/bin/bash
set -e


psql -U ${POSTGRES_USER} -d maindb -c "CREATE USER manager WITH PASSWORD '${POSTGRES_MANAGER_PASSWORD}';"
psql -U ${POSTGRES_USER} -d maindb -c "CREATE USER keycloak WITH PASSWORD '${POSTGRES_KEYCLOAK_PASSWORD}';"

# Erstelle zusätzliche Datenbanken
psql -U ${POSTGRES_USER} -d maindb -c "CREATE DATABASE manager WITH OWNER = manager;"
psql -U ${POSTGRES_USER} -d maindb -c "CREATE DATABASE keycloak WITH OWNER = keycloak;"

# Erstelle Benutzer für jede Datenbank und weise Berechtigungen zu
psql -U ${POSTGRES_USER} -d manager -c "GRANT ALL PRIVILEGES ON DATABASE manager TO manager;"
psql -U ${POSTGRES_USER} -d manager -c "GRANT ALL PRIVILEGES ON SCHEMA public TO manager;"

psql -U ${POSTGRES_USER} -d keycloak -c "GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;"
psql -U ${POSTGRES_USER} -d keycloak -c "GRANT ALL PRIVILEGES ON SCHEMA public TO keycloak;"