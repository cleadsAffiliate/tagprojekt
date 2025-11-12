# Backend - Adresse Opslag API

Node.js Express backend til at håndtere Dataforsyningen API calls.

## Teknologier

- Node.js
- Express
- TypeScript
- Axios
- CORS

## Opsætning

1. Installer dependencies:
```bash
npm install
```

2. Opret `.env` fil baseret på `.env.example`:
```bash
cp .env.example .env
```

3. Opdater `.env` med dine Dataforsyningen credentials:
```
PORT=3001
DATAFORSYNINGEN_USERNAME=dit_brugernavn
DATAFORSYNINGEN_PASSWORD=din_kode
```

4. Start development server:
```bash
npm run dev
```

Backend vil være tilgængelig på `http://localhost:3001`

## API Endpoints

### GET /api/address/search
Søg efter adresser med autocomplete.

**Query Parameters:**
- `q` (required): Søgetekst
- `limit` (optional): Antal resultater (default: 10)

**Eksempel:**
```
GET http://localhost:3001/api/address/search?q=Vesterbro&limit=10
```

### GET /api/address/:id
Hent detaljer for en specifik adresse.

**Eksempel:**
```
GET http://localhost:3001/api/address/0a3f5095-45b5-32b8-e044-0003ba298018
```

### GET /health
Health check endpoint.

## Build

For at bygge til produktion:
```bash
npm run build
npm start
```
