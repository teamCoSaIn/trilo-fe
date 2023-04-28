const searchPlacesByText = (
  searchText: string,
  placesService: google.maps.places.PlacesService
) => {
  return new Promise<google.maps.places.PlaceResult[]>(
    (textSearchResolve, textSearchReject) => {
      const textSearchRequest: google.maps.places.TextSearchRequest = {
        query: `${searchText}`,
      };

      const textSearchCallback = (
        places: google.maps.places.PlaceResult[] | null,
        textSearchStatus: google.maps.places.PlacesServiceStatus
      ) => {
        if (
          textSearchStatus === google.maps.places.PlacesServiceStatus.OK &&
          places
        ) {
          const placesWithOpeningHours = places.map(place => {
            return new Promise<google.maps.places.PlaceResult>(
              getDetailsResolve => {
                const getDetailsRequest: google.maps.places.PlaceDetailsRequest =
                  {
                    placeId: place.place_id || '',
                    fields: ['opening_hours', 'url'],
                  };

                const getDetailsCallback = (
                  details: google.maps.places.PlaceResult | null,
                  getDetailsStatus: google.maps.places.PlacesServiceStatus
                ) => {
                  if (
                    getDetailsStatus ===
                      google.maps.places.PlacesServiceStatus.OK &&
                    details
                  ) {
                    getDetailsResolve(details);
                  } else {
                    getDetailsResolve({
                      opening_hours: undefined,
                      url: undefined,
                    });
                  }
                };

                placesService.getDetails(getDetailsRequest, getDetailsCallback);
              }
            );
          });

          Promise.all(placesWithOpeningHours)
            .then(detailsArr => {
              const resultWithDetails = places.map((place, idx) => {
                return {
                  ...place,
                  opening_hours: detailsArr[idx].opening_hours,
                  url: detailsArr[idx].url,
                };
              });
              textSearchResolve(resultWithDetails);
            })
            .catch(error => console.log(error));
        } else if (
          textSearchStatus ===
          google.maps.places.PlacesServiceStatus.ZERO_RESULTS
        ) {
          textSearchResolve([]);
        } else {
          textSearchReject(textSearchStatus);
        }
      };

      placesService.textSearch(textSearchRequest, textSearchCallback);
    }
  );
};

export default searchPlacesByText;
