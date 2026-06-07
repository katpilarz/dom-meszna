
export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SingleFamilyResidence',

    name: 'Dom w Mesznej',
    description:
      'Dom o powierzchni całkowitej 402 m² (170,75 m² powierzchni użytkowej) w Mesznej u stóp Beskidu Śląskiego. Trzy kondygnacje, działka 1 600 m². Projekt Studio Atrium, oddany do użytku w 2018 r. 300 m do lasu, 600 m do szlaków górskich na Klimczok.',

    url: 'https://www.dom-meszna.pl',

    image: [
      'https://www.dom-meszna.pl/images/house/house-01.jpg',
      'https://www.dom-meszna.pl/images/house/house-02.jpg',
      'https://www.dom-meszna.pl/images/house/house-03.jpg',
    ],

    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Energetyków',
      addressLocality: 'Meszna',
      addressRegion: 'śląskie',
      postalCode: '43-365',
      addressCountry: 'PL',
    },

    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.7393,
      longitude: 19.0473,
    },

    // Schema.org floorSize = powierzchnia użytkowa (konwencja polskiego rynku
    // dla porównań cenowych — tak liczą Otodom, Sprzedajemy, akty notarialne)
    floorSize: {
      '@type': 'QuantitativeValue',
      value: 170.75,
      unitCode: 'MTK',
      name: 'Powierzchnia użytkowa',
    },

    // additionalProperty — drugorzędne ale równie istotne dane mierzalne
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Powierzchnia całkowita',
        value: 402.35,
        unitCode: 'MTK',
        description:
          'Całkowita powierzchnia budynku łącznie z piwnicą, garażem i pomieszczeniami gospodarczymi.',
      },
      {
        '@type': 'PropertyValue',
        name: 'Powierzchnia działki',
        value: 1600,
        unitCode: 'MTK',
      },
      {
        '@type': 'PropertyValue',
        name: 'Liczba kondygnacji',
        value: 3,
      },
    ],

    numberOfRooms: 7,
    numberOfBathroomsTotal: 2,
    yearBuilt: 2018,

    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Architekt',
        value: 'Studio Atrium, Bielsko-Biała',
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Materiały konstrukcyjne',
        value: 'Keramzyt, wełna mineralna 20 cm, ceramiczna dachówka',
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Forma własności',
        value: 'Współwłasność',
      },
    ],

    offers: {
      '@type': 'Offer',
      price: '1899000',
      priceCurrency: 'PLN',
      availability: 'https://schema.org/InStock',
      url: 'https://www.dom-meszna.pl',
      seller: {
        '@type': 'Person',
        name: 'Sprzedaż bezpośrednia',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}