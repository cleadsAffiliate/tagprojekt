=== Adresse Lookup med BBR ===
Contributors: jydsktagteknik
Tags: address, lookup, autocomplete, bbr, dawa, denmark
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
Requires PHP: 7.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Autocomplete adressesøgning med BBR data (boligareal og tagmateriale) fra DAWA API.

== Description ==

Adresse Lookup med BBR er et WordPress plugin der giver dig mulighed for at tilføje en adressesøgning med autocomplete til din hjemmeside. Når brugeren vælger en adresse, hentes BBR data automatisk fra Danmarks Adressers Web API (DAWA).

= Funktioner =

* Autocomplete adressesøgning via DAWA API
* Automatisk hentning af BBR data når adresse vælges
* Viser boligareal og tagmateriale
* Auto-submit funktionalitet (kan slås fra)
* Konfigurerbar redirect URL
* Simpel shortcode integration
* Responsive design

= Shortcode =

Brug shortcoden `[address_lookup]` til at indsætte adressesøgningen på en side eller i et indlæg.

**Shortcode parametre:**

* `title` - Overskrift (standard: "Søg din adresse")
* `placeholder` - Placeholder tekst (standard: "Indtast adresse...")
* `button_text` - Knap tekst (standard: søgeikon)

**Eksempler:**

`[address_lookup]`
`[address_lookup title="Find din adresse"]`
`[address_lookup title="Søg" placeholder="Skriv adresse her" button_text="Søg"]`

= API Data =

Pluginnet bruger følgende DAWA API endpoints:

* Autocomplete: https://api.dataforsyningen.dk/autocomplete
* Adresser: https://api.dataforsyningen.dk/adresser
* BBR bygninger: https://api.dataforsyningen.dk/bbr/bygninger

Ingen API-nøgle er påkrævet.

== Installation ==

1. Upload `address-lookup-bbr` mappen til `/wp-content/plugins/` mappen
2. Aktiver pluginnet gennem 'Plugins' menuen i WordPress
3. Gå til Indstillinger > Adresse Lookup for at konfigurere pluginnet
4. Indsæt shortcoden `[address_lookup]` på en side eller i et indlæg

== Frequently Asked Questions ==

= Hvordan ændrer jeg redirect URL? =

Gå til Indstillinger > Adresse Lookup og indtast din ønskede redirect URL. Du kan bruge `{address}` som placeholder for adressen.

Eksempler:
* `/beregner/{address}`
* `/beregner/` (adressen tilføjes automatisk til slut)

= Hvordan slår jeg auto-submit fra? =

Gå til Indstillinger > Adresse Lookup og fjern fluebenet ved "Auto-submit".

= Hvilke browsere understøttes? =

Pluginnet understøtter alle moderne browsere:
* Chrome/Edge 90+
* Firefox 88+
* Safari 14+

= Er der nogen API begrænsninger? =

DAWA API er gratis at bruge og har ingen begrænsninger på antal opkald. Dog anbefales det at bruge APIet ansvarligt.

== Screenshots ==

1. Adressesøgning med autocomplete
2. BBR data visning
3. Plugin indstillinger

== Changelog ==

= 1.0.0 =
* Første version
* Autocomplete adressesøgning
* BBR data integration
* Konfigurerbare indstillinger
* Shortcode support

== Upgrade Notice ==

= 1.0.0 =
Første version af pluginnet.
