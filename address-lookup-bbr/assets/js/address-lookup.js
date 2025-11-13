document.addEventListener('DOMContentLoaded', function () {

// Get WordPress settings or use defaults
const settings = typeof addressLookupSettings !== 'undefined' ? addressLookupSettings : {
    redirectUrl: '/beregner/',
    autoSubmit: 'yes',
    autoSubmitDelay: '2000',
    minChars: '10'
};

class AddressAutoComplete {

  constructor() {
    this.inputId = 'dawa-autocomplete1';
    this.listClass = 'autocomplete1';
    this.buttonId = 'search-roof1';
    this.addressId = null;
    this.addressText = '';
    this.bbrData = null;
    this.settings = settings;
    this.setupAutocomplete();
    this.bindSearchButton();
  }


  setupAutocomplete() {
    const input = document.getElementById(this.inputId);
    const list = document.querySelector(`.${this.listClass}`);

    if (!input || !list) {
      console.error('Address lookup: Required elements not found');
      return;
    }

    input.addEventListener('input', () => this.handleInputChange(input, list));
    document.addEventListener('click', (e) => this.handleClickOutside(e, list, input));

    input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const button = document.getElementById(this.buttonId);
        const query = input.value.trim();
        if (!query) return;

        if (!button.classList.contains('disabled')) {
          this.requestForm();
        } else {
          const items = list.querySelectorAll('li');
          if (items.length === 0) {
            const data = await this.fetchSuggestions(query);
            this.renderSuggestions(data, list, input);
          }

          const match = this.findMatch(query, list);
          if (match) {
            input.value = match;
            list.innerHTML = '';
            this.addressText = match;

            const addressId = await this.fetchAddressIdFromText(match);
            if (addressId) {
              await this.setAddressId(addressId);
              await this.fetchAndDisplayBBR();
              this.enableSearchButton();
              this.requestForm();
            }
          }
        }
      }
    });
  }


  async handleInputChange(input, list) {
    const query = input.value.trim();

    // Reset BBR info when user starts typing again
    this.hideBBRInfo();

    if (!query) {
      list.innerHTML = '';
      this.disableSearchButton();
      return;
    }

    const data = await this.fetchSuggestions(query);
    this.renderSuggestions(data, list, input);
  }


  async fetchSuggestions(query) {
    try {
      const res = await fetch(`https://api.dataforsyningen.dk/autocomplete?q=${encodeURIComponent(query)}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      return [];
    }
  }


  renderSuggestions(data, list, input) {
    list.innerHTML = '';

    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.tekst;
      li.setAttribute('role', 'option');

      li.addEventListener('click', async () => {
        input.value = item.tekst;
        list.innerHTML = '';
        this.addressText = item.tekst;

        const addressId = await this.fetchAddressIdFromText(item.tekst);
        if (!addressId) return;

        await this.setAddressId(addressId);
        await this.fetchAndDisplayBBR();
        this.enableSearchButton();
      });

      list.appendChild(li);
    });
  }


  findMatch(query, list) {
    const items = list.querySelectorAll('li');
    for (const item of items) {
      if (item.textContent.trim().toLowerCase() === query.toLowerCase()) {
        return item.textContent.trim();
      }
    }
    return null;
  }


  handleClickOutside(e, list, input) {
    if (!list.contains(e.target) && e.target !== input) {
      list.innerHTML = '';
    }
  }


  enableSearchButton() {
    const button = document.getElementById(this.buttonId);
    if (button) {
      button.classList.remove('disabled');
    }
  }


  disableSearchButton() {
    const button = document.getElementById(this.buttonId);
    if (button) {
      button.classList.add('disabled');
    }
  }


  bindSearchButton() {
    const button = document.getElementById(this.buttonId);
    if (!button) return;

    button.addEventListener('click', async () => {
      if (button.classList.contains('disabled')) return;
      this.requestForm();
    });
  }


  async fetchAddressIdFromText(address) {
    if (!address) return null;
    try {
      const res = await fetch(`https://api.dataforsyningen.dk/adresser?q=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (!data.length || !data[0].id) return null;
      return data[0].id;
    } catch (err) {
      console.error('Failed to fetch addressId:', err);
      return null;
    }
  }


  setAddressId(addressId) {
    this.addressId = addressId;
  }


  async fetchAndDisplayBBR() {
    if (!this.addressId) {
      console.error('No addressId available');
      return;
    }

    this.showBBRLoading();

    try {
      // Hent adresse data med BBR reference
      const addressRes = await fetch(`https://api.dataforsyningen.dk/adresser/${this.addressId}`);
      const addressData = await addressRes.json();

      // Tjek om der er BBR data tilgængelig
      if (!addressData.adgangsadresse || !addressData.adgangsadresse.husnummer) {
        this.showBBRError('Ingen BBR data tilgængelig for denne adresse');
        return;
      }

      const husnummer = addressData.adgangsadresse.husnummer;

      // Hent bygninger på denne adresse
      const bygningerRes = await fetch(
        `https://api.dataforsyningen.dk/bbr/bygninger?husnummer=${husnummer.id}`
      );
      const bygninger = await bygningerRes.json();

      if (!bygninger || bygninger.length === 0) {
        this.showBBRError('Ingen bygningsdata fundet');
        return;
      }

      // Tag første bygning (normalt vil der kun være én)
      const bygning = bygninger[0];

      // Hent boligareal og tagmateriale
      const boligareal = this.getBoligAreal(bygning);
      const tagmateriale = this.getTagMateriale(bygning);

      this.bbrData = {
        boligareal,
        tagmateriale
      };

      this.displayBBRData(boligareal, tagmateriale);

    } catch (err) {
      console.error('Failed to fetch BBR data:', err);
      this.showBBRError('Kunne ikke hente BBR data');
    }
  }


  getBoligAreal(bygning) {
    // BBR data kan have forskellige felter for boligareal
    if (bygning.samletBoligAreal) {
      return `${bygning.samletBoligAreal} m²`;
    } else if (bygning.boligAreal) {
      return `${bygning.boligAreal} m²`;
    } else if (bygning.bebyggetAreal) {
      return `${bygning.bebyggetAreal} m² (bebygget areal)`;
    }
    return 'Ikke oplyst';
  }


  getTagMateriale(bygning) {
    // Tagdækningsmateriale kan være i forskellige felter
    if (bygning.tagdækningsmateriale) {
      return this.formatTagMateriale(bygning.tagdækningsmateriale);
    } else if (bygning.tagdaekningsmateriale) {
      return this.formatTagMateriale(bygning.tagdaekningsmateriale);
    }
    return 'Ikke oplyst';
  }


  formatTagMateriale(materiale) {
    // DAWA BBR returner koder, så vi mapper dem til læsbare navne
    const materialeMap = {
      '1': 'Built-up',
      '2': 'Tagpap med enkelt lag',
      '3': 'Tagpap med dobbelt lag',
      '4': 'Cementsten',
      '5': 'Tegl',
      '6': 'Metalplader',
      '7': 'Fibercement (asbest)',
      '8': 'Fibercement (asbestfri)',
      '9': 'Stråtag',
      '10': 'Grønt tag',
      '80': 'Andet tagdækningsmateriale'
    };

    // Hvis det er en kode, map den
    if (typeof materiale === 'string' && materialeMap[materiale]) {
      return materialeMap[materiale];
    }

    // Ellers returner som det er
    return materiale;
  }


  showBBRLoading() {
    const bbrInfo = document.getElementById('bbr-info');
    const boligArealEl = document.getElementById('bbr-boligareal');
    const tagMaterialeEl = document.getElementById('bbr-tagmateriale');

    if (!bbrInfo || !boligArealEl || !tagMaterialeEl) return;

    bbrInfo.classList.remove('hidden');
    boligArealEl.textContent = 'Henter';
    boligArealEl.classList.add('loading');
    tagMaterialeEl.textContent = 'Henter';
    tagMaterialeEl.classList.add('loading');
  }


  displayBBRData(boligareal, tagmateriale) {
    const bbrInfo = document.getElementById('bbr-info');
    const boligArealEl = document.getElementById('bbr-boligareal');
    const tagMaterialeEl = document.getElementById('bbr-tagmateriale');

    if (!bbrInfo || !boligArealEl || !tagMaterialeEl) return;

    bbrInfo.classList.remove('hidden');
    boligArealEl.textContent = boligareal;
    boligArealEl.classList.remove('loading');
    tagMaterialeEl.textContent = tagmateriale;
    tagMaterialeEl.classList.remove('loading');
  }


  showBBRError(message) {
    const bbrInfo = document.getElementById('bbr-info');
    const boligArealEl = document.getElementById('bbr-boligareal');
    const tagMaterialeEl = document.getElementById('bbr-tagmateriale');

    if (!bbrInfo || !boligArealEl || !tagMaterialeEl) return;

    bbrInfo.classList.remove('hidden');
    boligArealEl.textContent = message;
    boligArealEl.classList.remove('loading');
    tagMaterialeEl.textContent = '-';
    tagMaterialeEl.classList.remove('loading');
  }


  hideBBRInfo() {
    const bbrInfo = document.getElementById('bbr-info');
    if (!bbrInfo) return;

    bbrInfo.classList.add('hidden');
    this.bbrData = null;
  }


  requestForm() {
    // Redirect til URL fra indstillinger
    if (!this.addressText) {
      console.error('No address text available');
      return;
    }

    const encodedAddress = encodeURIComponent(this.addressText);
    let redirectUrl = this.settings.redirectUrl || '/beregner/';

    // Support for {address} placeholder i URL
    if (redirectUrl.includes('{address}')) {
      redirectUrl = redirectUrl.replace('{address}', encodedAddress);
    } else {
      // Fallback: tilføj adressen til URL
      redirectUrl = redirectUrl.endsWith('/') ? redirectUrl + encodedAddress : redirectUrl + '/' + encodedAddress;
    }

    window.location.href = redirectUrl;
  }

}

// Initialiser autocomplete
const autocomplete = new AddressAutoComplete();

// Auto-submit funktionalitet (kun hvis aktiveret i indstillinger)
if (settings.autoSubmit === 'yes') {
  setTimeout(() => {
    const input = document.getElementById('dawa-autocomplete1');
    const list = document.querySelector('.autocomplete1');
    const searchButton = document.getElementById('search-roof1');

    if (!input || !list || !searchButton) {
      console.error('Kunne ikke finde nødvendige elementer');
      return;
    }

    let autoSubmitTimer;

    async function autoSubmitFirstSuggestion() {
      const suggestions = list.querySelectorAll('li');

      if (suggestions.length > 0) {
        const firstSuggestion = suggestions[0];
        console.log('Auto-vælger første forslag:', firstSuggestion.textContent);

        // Klik på første forslag
        firstSuggestion.click();

        // Vent på BBR data bliver hentet
        setTimeout(() => {
          if (!searchButton.classList.contains('disabled')) {
            console.log('Sender automatisk videre til formular');
            autocomplete.requestForm();
          }
        }, 1000); // Øget til 1 sekund for at give tid til BBR fetch
      }
    }

    // Lyt efter input og start timer
    input.addEventListener('input', function() {
      const inputValue = input.value.trim();

      // Clear eksisterende timer
      clearTimeout(autoSubmitTimer);

      // Kun start timer hvis der er nok tekst
      const minChars = parseInt(settings.minChars) || 10;
      if (inputValue.length >= minChars) {
        console.log('Starter auto-submit timer for:', inputValue);

        // Start timer
        const delay = parseInt(settings.autoSubmitDelay) || 2000;
        autoSubmitTimer = setTimeout(() => {
          autoSubmitFirstSuggestion();
        }, delay);
      }
    });

    // Stop timer hvis brugeren klikker på et forslag manuelt
    list.addEventListener('click', function() {
      clearTimeout(autoSubmitTimer);
    });

    // Stop timer hvis brugeren klikker på knappen manuelt
    searchButton.addEventListener('click', function() {
      clearTimeout(autoSubmitTimer);
    });

  }, 100);
}

// Gør autocomplete instansen tilgængelig globalt
window.addressAutocomplete = autocomplete;

});
