# Tagprojekt - Adresse Opslag

Dansk adresse opslag applikation med autocomplete funktionalitet. Bruger data fra Dataforsyningen API.

## Projekt Struktur

```
tagprojekt/
├── frontend/          # React SPA (Vite + TypeScript + Tailwind)
├── backend/           # Node.js Express API
└── README.md         # Denne fil
```

## Teknologier

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- Axios
- CORS

## Hurtig Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Opret `.env` fil:
```bash
cp .env.example .env
```

Opdater `.env` med dine Dataforsyningen credentials:
```
PORT=3001
DATAFORSYNINGEN_USERNAME=dit_brugernavn
DATAFORSYNINGEN_PASSWORD=din_kode
```

Start backend:
```bash
npm run dev
```

Backend kører nu på `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend kører nu på `http://localhost:5173`

## Features

- **Autocomplete**: Realtids adresse søgning med debounce
- **Keyboard Navigation**: Brug piletaster til at navigere i forslag
- **Responsive Design**: Fungerer på alle devices
- **Type Safety**: Fuldt TypeScript support
- **Error Handling**: Brugervenlige fejlmeddelelser

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

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "adresse",
      "tekst": "Vesterbrogade 1, 1620 København V",
      "forslagstekst": "Vesterbrogade 1, 1620 København V",
      "data": {
        "id": "...",
        "vejnavn": "Vesterbrogade",
        "husnr": "1",
        "postnr": "1620",
        "postnrnavn": "København V"
      }
    }
  ]
}
```

### GET /health
Health check endpoint.

## Data Kilde

Projektet bruger [Dataforsyningen](https://dataforsyningen.dk/) API til at hente danske adressedata.

## Udvikling

### Backend Development
```bash
cd backend
npm run dev    # Start med hot-reload
npm run build  # Build til produktion
npm start      # Start produktion server
```

### Frontend Development
```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build til produktion
npm run preview # Preview production build
```

## License

ISC
