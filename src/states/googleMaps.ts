import { atom } from 'recoil';
import { LatLng } from 'use-places-autocomplete';

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

export const GoogleMarkerLatLng = atom<LatLng | undefined>({
  key: 'googleMarkerLatLng',
  default: undefined,
});

export const InfoBoxVisible = atom<boolean>({
  key: 'infoBoxVisible',
  default: false,
});
