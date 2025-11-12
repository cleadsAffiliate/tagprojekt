import axios, { AxiosInstance } from 'axios';

interface AutocompleteResponse {
  type: string;
  tekst: string;
  forslagstekst: string;
  data?: {
    id?: string;
    vejnavn?: string;
    husnr?: string;
    postnr?: string;
    postnrnavn?: string;
  };
}

interface AddressDetails {
  id: string;
  vejnavn: string;
  husnr: string;
  postnr: string;
  postnrnavn: string;
  adressebetegnelse: string;
}

class DataforsyningenService {
  private client: AxiosInstance;
  private username: string;
  private password: string;

  constructor() {
    this.username = process.env.DATAFORSYNINGEN_USERNAME || 'COKSIGWPKT';
    this.password = process.env.DATAFORSYNINGEN_PASSWORD || 'CKode91!';

    this.client = axios.create({
      baseURL: 'https://api.dataforsyningen.dk',
      auth: {
        username: this.username,
        password: this.password,
      },
      timeout: 10000,
    });
  }

  /**
   * Search for addresses using autocomplete
   * @param query - The search query
   * @param limit - Maximum number of results (default: 10)
   * @returns Array of autocomplete suggestions
   */
  async autocomplete(query: string, limit: number = 10): Promise<AutocompleteResponse[]> {
    try {
      const response = await this.client.get('/autocomplete', {
        params: {
          q: query,
          type: 'adresse',
          caretpos: query.length,
          fuzzy: true,
          startfra: 'adresse',
          supplerendebynavn: true,
        },
      });

      // Limit results
      return response.data.slice(0, limit);
    } catch (error) {
      console.error('Error fetching autocomplete data:', error);
      throw new Error('Failed to fetch address suggestions');
    }
  }

  /**
   * Get full address details by address ID
   * @param addressId - The address ID
   * @returns Full address details
   */
  async getAddressById(addressId: string): Promise<AddressDetails> {
    try {
      const response = await this.client.get(`/adresser/${addressId}`);

      const data = response.data;
      return {
        id: data.id,
        vejnavn: data.vejnavn,
        husnr: data.husnr,
        postnr: data.postnr,
        postnrnavn: data.postnrnavn,
        adressebetegnelse: data.adressebetegnelse,
      };
    } catch (error) {
      console.error('Error fetching address details:', error);
      throw new Error('Failed to fetch address details');
    }
  }
}

export default new DataforsyningenService();
