# Installation af Adresse Lookup med BBR Plugin

Dette dokument beskriver hvordan du installerer og konfigurerer WordPress pluginnet.

## Download Plugin

Plugin filen: `address-lookup-bbr.zip` (12KB)

## Installation i WordPress

### Metode 1: Upload via WordPress Admin (Anbefalet)

1. Log ind i WordPress admin
2. Gå til **Plugins > Tilføj ny**
3. Klik på knappen **"Upload Plugin"** øverst på siden
4. Klik **"Vælg fil"** og vælg `address-lookup-bbr.zip`
5. Klik **"Installer nu"**
6. Når installationen er færdig, klik **"Aktiver plugin"**

### Metode 2: FTP Upload

1. Pak `address-lookup-bbr.zip` ud på din computer
2. Upload hele `address-lookup-bbr` mappen til `/wp-content/plugins/` via FTP
3. Log ind i WordPress admin
4. Gå til **Plugins**
5. Find "Adresse Lookup med BBR" i listen og klik **Aktiver**

## Konfiguration

Efter aktivering skal du konfigurere pluginnet:

1. Gå til **Indstillinger > Adresse Lookup** i WordPress admin
2. Konfigurer følgende indstillinger:

### Redirect URL
- **Standard**: `/beregner/`
- **Med placeholder**: `/beregner/{address}`
- Adressen vil automatisk blive URL-encoded

**Eksempler:**
- `/beregner/{address}` → `/beregner/Spinkebjerg%2022%2C%20Gjellerup%2C%207400%20Herning`
- `/beregner/` → `/beregner/Spinkebjerg%2022%2C%20Gjellerup%2C%207400%20Herning`

### Auto-submit
- ✅ Aktiver for automatisk at vælge første forslag
- ⬜ Deaktiver hvis brugeren selv skal klikke på "Søg"

### Auto-submit forsinkelse
- **Standard**: 2000ms (2 sekunder)
- **Anbefalet**: 1500-3000ms
- Tid brugeren skal vente efter sidste tastetryk

### Minimum karakterer for auto-submit
- **Standard**: 10 karakterer
- **Anbefalet**: 8-15 karakterer
- Antal karakterer før auto-submit starter

## Brug på Sider/Indlæg

### Shortcode (Simpelt)

Indsæt denne shortcode på en side eller i et indlæg:

```
[address_lookup]
```

### Shortcode (Med parametre)

```
[address_lookup title="Find din adresse" placeholder="Indtast din adresse her..."]
```

**Tilgængelige parametre:**
- `title` - Overskrift over søgefeltet
- `placeholder` - Placeholder tekst i inputfeltet
- `button_text` - Tekst på søgeknappen (hvis tom, vises søgeikon)

### Eksempler

**Uden overskrift:**
```
[address_lookup title=""]
```

**Med custom knap tekst:**
```
[address_lookup button_text="Søg"]
```

**Komplet eksempel:**
```
[address_lookup title="Beregn dit tag" placeholder="Skriv din adresse" button_text="Beregn"]
```

## Page Builder Integration

### Elementor

1. Tilføj en **Shortcode Widget**
2. Indsæt `[address_lookup]`
3. Stil efter behov med Elementor's styling options

### Gutenberg Block Editor

1. Tilføj en **Shortcode Block**
2. Indsæt `[address_lookup]`
3. Preview for at se resultatet

### Classic Editor

1. Indsæt shortcoden direkte i editor
2. Shortcoden vil blive erstattet med adressesøgningen

## Styling Tilpasning

### Via CSS Variabler

Tilføj dette i dit tema's CSS (Appearance > Customize > Additional CSS):

```css
:root {
  --form-primary: #1e73be;      /* Primær farve (knapper, focus) */
  --neutral-110: #5e6a82;       /* Tekst farve */
  --light-yellow: #fff7ea;      /* Baggrund farve */
}
```

### Eksempel på farvetilpasning

**Blå tema:**
```css
:root {
  --form-primary: #0066cc;
  --neutral-110: #333333;
  --light-yellow: #f0f8ff;
}
```

**Grøn tema:**
```css
:root {
  --form-primary: #28a745;
  --neutral-110: #2c3e50;
  --light-yellow: #f0fff4;
}
```

### Custom CSS Klasser

Pluginnet bruger følgende CSS klasser som kan styles:

- `.roof-search` - Hovedcontainer
- `.search-container` - Indre container
- `.address1` - Input felt
- `.autocomplete1` - Dropdown liste
- `.bbr-info` - BBR data container
- `.bbr-label` - BBR labels
- `.bbr-value` - BBR værdier

## Test Installation

Efter installation, test følgende:

1. ✅ Gå til en side med shortcoden
2. ✅ Start med at skrive en adresse (f.eks. "Spinkebjerg 22")
3. ✅ Verificer at autocomplete dropdown vises
4. ✅ Vælg en adresse fra listen
5. ✅ Verificer at BBR data vises (boligareal og tagmateriale)
6. ✅ Klik på søgeknappen (eller vent på auto-submit)
7. ✅ Verificer at du bliver sendt til korrekt URL

## Fejlfinding

### Shortcode vises som tekst

**Problem:** `[address_lookup]` vises direkte på siden
**Løsning:** Pluginnet er ikke aktiveret. Gå til Plugins og aktiver det.

### Ingen autocomplete forslag

**Problem:** Dropdown viser ingen resultater
**Mulige årsager:**
- Ingen internetforbindelse
- DAWA API er nede (sjældent)
- JavaScript fejl i browser console

**Løsning:**
1. Åbn browser console (F12)
2. Tjek for fejl
3. Prøv at genindlæse siden

### BBR data vises ikke

**Problem:** Efter valg af adresse vises ingen BBR data
**Mulige årsager:**
- Adressen har ingen BBR data i systemet
- API request fejler

**Løsning:**
1. Prøv en anden adresse
2. Tjek browser console for fejl
3. Nogle adresser har ikke BBR data (nybyggede, specielle adresser)

### Redirect virker ikke

**Problem:** Efter valg sendes jeg ikke videre
**Løsning:**
1. Tjek at redirect URL er konfigureret i Indstillinger
2. Verificer at URL'en eksisterer på dit website
3. Tjek browser console for JavaScript fejl

## Support

For support:
- GitHub: https://github.com/cleadsAffiliate/tagprojekt
- Check browser console (F12) for fejlbeskeder
- Verificer at WordPress og tema er opdateret

## Krav

### Server
- WordPress 5.0 eller nyere
- PHP 7.2 eller nyere

### Browser (Besøgende)
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Moderne browser med JavaScript aktiveret

## Sikkerhed

Pluginnet:
- ✅ Sanitizer alle inputs
- ✅ Escaper alle outputs
- ✅ Bruger WordPress nonces (planlagt)
- ✅ Følger WordPress coding standards
- ✅ Ingen eksterne dependencies

## API Information

Pluginnet bruger Danmarks Adressers Web API (DAWA):
- **API**: Gratis og åben
- **Begrænsninger**: Ingen rate limits
- **Data**: Officielle danske adresser og BBR data
- **Privacy**: Ingen persondata sendes til API
