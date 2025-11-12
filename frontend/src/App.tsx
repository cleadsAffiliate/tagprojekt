import { useState } from 'react';
import AddressAutocomplete from './components/AddressAutocomplete';

interface AddressData {
  vejnavn: string;
  husnr: string;
  postnr: string;
  postnrnavn: string;
}

function App() {
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);

  const handleAddressSelect = (address: AddressData) => {
    setSelectedAddress(address);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Adresse Opslag
            </h1>
            <p className="text-gray-600 mb-8">
              Søg efter en dansk adresse med autocomplete
            </p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Søg adresse
              </label>
              <AddressAutocomplete
                onAddressSelect={handleAddressSelect}
                placeholder="Indtast vejnavn, husnummer eller postnummer..."
              />
            </div>

            {selectedAddress && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Valgt adresse
                </h2>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-32">Vejnavn:</span>
                    <span className="text-gray-900">{selectedAddress.vejnavn}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-32">Husnummer:</span>
                    <span className="text-gray-900">{selectedAddress.husnr}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-32">Postnummer:</span>
                    <span className="text-gray-900">{selectedAddress.postnr}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-32">By:</span>
                    <span className="text-gray-900">{selectedAddress.postnrnavn}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Data fra Dataforsyningen API</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
