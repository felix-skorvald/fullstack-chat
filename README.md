# Fullstack Chat App

Detta är en enkel chattapplikation byggd som ett fullstackprojekt med Node/Express, TypeScript, React och DynamoDB. Appen låter användare registrera sig, logga in, skicka meddelanden i öppna eller låsta kanaler och skicka DM till andra användare. Gäster kan läsa öppna kanaler samt skriva, men inloggning krävs för allt annat.

Projektet följer en monorepostruktur och använder modern validering, säkra lösenord och JWT-baserad autentisering.

## Funktioner

Registrering och inloggning

JWT-autentisering

Öppna och låsta kanaler

Skicka och läsa meddelanden i kanaler

Skicka DM mellan användare

Skapa och ta bort kanaler (endast skaparen)

Ta bort sitt konto

(Ingen realtid, meddelanden hämtas via API calls. Men det är TODO att fixa a s a p)

## Tech Stack

### Backend

Node.js + Express

TypeScript

Zod (request-validering)

JWT (autentisering)

bcrypt (hashade lösenord)

DynamoDB

### Frontend

React

React Router

Zustand

Vite

### Struktur

Monorepo

REST API

## Scripts

npm run

        "dev"
        "build-frontend"
        "build-server"
        "start-server"
        "restart-server"
        "predeploy"
