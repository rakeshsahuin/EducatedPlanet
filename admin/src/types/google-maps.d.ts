declare global {
  interface Window {
    google: {
      maps: {
        importLibrary(name: string): Promise<any>;
        Map: any;
        Marker: any;
        Geocoder: any;
        GeocoderStatus: any;
        MapMouseEvent: any;
        PlacesServiceStatus: any;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}

export {};