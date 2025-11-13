# Adresse Lookup Plugin med BBR Integration

Et JavaScript plugin til adresse autocomplete med automatisk hentning af BBR data (boligareal og tagmateriale).

## Funktionalitet

- Autocomplete adressesøgning via DAWA API
- Automatisk hentning af BBR data når adresse vælges
- Viser boligareal og tagmateriale
- Auto-submit efter 2 sekunders inaktivitet (ved 10+ karakterer)
- Videresender til `/beregner/[URL-encoded-adresse]`

## Filer

- `index.html` - HTML struktur
- `styles.css` - Styling
- `address-autocomplete.js` - Plugin logik

## Brug som Plugin

### Metode 1: Direkte inkludering

```html
<!DOCTYPE html>
<html lang="da">
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="roof-search">
        <div class="search-container">
            <h2>Søg din adresse</h2>
            <div class="input-wrapper">
                <input
                    type="text"
                    id="dawa-autocomplete1"
                    class="address1"
                    placeholder="Indtast adresse..."
                    autocomplete="off"
                />
                <button id="search-roof1" class="disabled">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <ul class="autocomplete1"></ul>
            <div id="bbr-info" class="bbr-info hidden">
                <h3>BBR Oplysninger</h3>
                <div class="bbr-data">
                    <div class="bbr-item">
                        <span class="bbr-label">Boligareal:</span>
                        <span id="bbr-boligareal" class="bbr-value">-</span>
                    </div>
                    <div class="bbr-item">
                        <span class="bbr-label">Tagmateriale:</span>
                        <span id="bbr-tagmateriale" class="bbr-value">-</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="address-autocomplete.js"></script>
</body>
</html>
```

### Metode 2: Widget/Snippet integration

For integration i eksisterende widget system (som dit JTW setup):

```javascript
// I din snippet.js eller lignende
function loadAddressPlugin(containerId) {
    const container = document.getElementById(containerId);

    // Indsæt HTML
    container.innerHTML = `
        <div class="roof-search">
            <!-- HTML struktur fra index.html -->
        </div>
    `;

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'path/to/styles.css';
    document.head.appendChild(link);

    // Load og initialiser JS
    const script = document.createElement('script');
    script.src = 'path/to/address-autocomplete.js';
    document.body.appendChild(script);
}

// Brug
loadAddressPlugin('address-container');
```

## API Endpoints

Pluginnet bruger følgende DAWA API endpoints:

1. **Autocomplete**: `https://api.dataforsyningen.dk/autocomplete?q={query}`
2. **Adresse lookup**: `https://api.dataforsyningen.dk/adresser?q={adresse}`
3. **BBR data**: `https://api.dataforsyningen.dk/bbr/bygninger?husnummer={husnummer_id}`

## Konfiguration

### Tilpas Element IDs

I `address-autocomplete.js` kan du ændre element IDs i konstruktøren:

```javascript
constructor() {
    this.inputId = 'dawa-autocomplete1';      // Input felt ID
    this.listClass = 'autocomplete1';         // Autocomplete liste class
    this.buttonId = 'search-roof1';           // Søg knap ID
    // ...
}
```

### Tilpas Redirect URL

For at ændre hvor brugeren sendes hen efter valg af adresse, rediger `requestForm()` metoden:

```javascript
requestForm() {
    const encodedAddress = encodeURIComponent(this.addressText);
    window.location.href = `/beregner/${encodedAddress}`;
}
```

### Tilpas Auto-submit Timer

I bunden af `address-autocomplete.js`:

```javascript
if (inputValue.length >= 10) {  // Minimum karakterer før auto-submit
    autoSubmitTimer = setTimeout(() => {
        autoSubmitFirstSuggestion();
    }, 2000);  // Millisekunder at vente (2000 = 2 sekunder)
}
```

## Styling

CSS bruger CSS variabler for nem tilpasning:

```css
* {
  --form-primary: #1e73be;      /* Primær farve */
  --neutral-110: #5e6a82;       /* Tekst farve */
  --light-yellow: #fff7ea;      /* Baggrund */
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Kræver:
- ES6 (async/await, classes)
- Fetch API
- CSS Grid/Flexbox

## Eksempel

Prøv det ved at åbne `index.html` i en browser og søg efter en adresse som:

```
Spinkebjerg 22, Gjellerup, 7400 Herning
```

Når adressen vælges:
1. BBR data hentes automatisk
2. Boligareal og tagmateriale vises
3. Efter evt. auto-submit sendes brugeren til `/beregner/Spinkebjerg%2022%2C%20Gjellerup%2C%207400%20Herning`

## Fejlhåndtering

Pluginnet håndterer følgende fejlscenarier:

- Ingen internetforbindelse
- DAWA API utilgængelig
- Ingen BBR data for adresse
- Ugyldige API svar

Fejl logges til console og der vises brugervenlige beskeder.