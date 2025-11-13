# Adresse Lookup med BBR - WordPress Plugin

Et WordPress plugin til adresse autocomplete med automatisk hentning af BBR data (boligareal og tagmateriale).

## Funktionalitet

- Autocomplete adressesøgning via DAWA API
- Automatisk hentning af BBR data når adresse vælges
- Viser boligareal og tagmateriale
- Auto-submit efter konfigurerbar forsinkelse
- Konfigurerbar redirect URL
- Simpel shortcode integration
- Responsive design
- WordPress admin indstillinger

## Installation

### Fra ZIP fil

1. Download plugin zip filen
2. Gå til WordPress admin > Plugins > Tilføj ny
3. Klik på "Upload Plugin"
4. Vælg zip filen og klik "Installer nu"
5. Aktiver pluginnet
6. Gå til Indstillinger > Adresse Lookup for at konfigurere

### Manuel installation

1. Upload `address-lookup-bbr` mappen til `/wp-content/plugins/`
2. Aktiver pluginnet gennem 'Plugins' menuen i WordPress
3. Konfigurer indstillinger under Indstillinger > Adresse Lookup

## Brug

### Shortcode

Indsæt shortcoden på en side eller i et indlæg:

```
[address_lookup]
```

### Shortcode parametre

```
[address_lookup title="Find din adresse" placeholder="Indtast adresse..." button_text="Søg"]
```

Tilgængelige parametre:
- `title` - Overskrift (standard: "Søg din adresse")
- `placeholder` - Placeholder tekst (standard: "Indtast adresse...")
- `button_text` - Knap tekst (standard: søgeikon)

### Indstillinger

Gå til **Indstillinger > Adresse Lookup** for at konfigurere:

#### Redirect URL
- URL hvor brugeren sendes hen efter valg af adresse
- Brug `{address}` som placeholder for adressen
- Eksempel: `/beregner/{address}` eller `/beregner/`

#### Auto-submit
- Aktiver/deaktiver automatisk valg af første forslag
- Konfigurerbar forsinkelse (standard: 2000ms)
- Konfigurerbart minimum antal karakterer (standard: 10)

## API Endpoints

Pluginnet bruger følgende DAWA API endpoints:

1. **Autocomplete**: `https://api.dataforsyningen.dk/autocomplete?q={query}`
2. **Adresse lookup**: `https://api.dataforsyningen.dk/adresser?q={adresse}`
3. **BBR data**: `https://api.dataforsyningen.dk/bbr/bygninger?husnummer={husnummer_id}`

Ingen API-nøgle er påkrævet.

## Udvikling

### Filstruktur

```
address-lookup-bbr/
├── address-lookup-bbr.php      # Main plugin fil
├── assets/
│   ├── css/
│   │   └── address-lookup.css  # Styling
│   └── js/
│       └── address-lookup.js   # JavaScript logik
├── readme.txt                  # WordPress readme
└── README.md                   # Dette dokument
```

### JavaScript API

Pluginnet eksponerer en global variabel `addressAutocomplete` som kan bruges til at interagere med funktionaliteten:

```javascript
// Hent den aktuelle adresse
console.log(window.addressAutocomplete.addressText);

// Hent BBR data
console.log(window.addressAutocomplete.bbrData);
```

### Tilpasning

#### CSS Variabler

Pluginnet bruger CSS variabler som kan overskrives i dit tema:

```css
:root {
  --form-primary: #1e73be;      /* Primær farve */
  --neutral-110: #5e6a82;       /* Tekst farve */
  --light-yellow: #fff7ea;      /* Baggrund */
}
```

#### Filter Hooks

Du kan tilføje dine egne filter hooks ved at udvide `address-lookup-bbr.php`:

```php
// Eksempel på filter for redirect URL
apply_filters('address_lookup_redirect_url', $redirect_url, $address);
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

Når en bruger søger efter en adresse som:

```
Spinkebjerg 22, Gjellerup, 7400 Herning
```

Vil pluginnet:
1. Vise autocomplete forslag
2. Hente BBR data når adressen vælges
3. Vise boligareal og tagmateriale
4. Sende brugeren til `/beregner/Spinkebjerg%2022%2C%20Gjellerup%2C%207400%20Herning`

## Fejlhåndtering

Pluginnet håndterer følgende fejlscenarier:

- Ingen internetforbindelse
- DAWA API utilgængelig
- Ingen BBR data for adresse
- Ugyldige API svar

Fejl logges til browser console og der vises brugervenlige beskeder.

## Support

For hjælp og support:
- GitHub Issues: https://github.com/cleadsAffiliate/tagprojekt

## License

GPL v2 or later

## Credits

Udviklet af Jydsk Tagteknik
Data leveret af Danmarks Adressers Web API (DAWA)
