import { atom } from 'recoil';

export const PlacesService = atom<google.maps.places.PlacesService | null>({
  key: 'placesService',
  default: null,
  dangerouslyAllowMutability: true,
});

export const MapInstance = atom<google.maps.Map | null>({
  key: 'mapInstance',
  default: null,
  dangerouslyAllowMutability: true,
});

export const AutocompleteService =
  atom<google.maps.places.AutocompleteService | null>({
    key: 'autocompleteService',
    default: null,
    dangerouslyAllowMutability: true,
  });
