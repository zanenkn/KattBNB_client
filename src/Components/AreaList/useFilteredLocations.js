import LOCATION_OPTIONS from '../../Modules/locationData.json';

const useFilteredLocations = (search) => {
  if (search === '') {
    return LOCATION_OPTIONS;
  } else {
    return LOCATION_OPTIONS.filter((option) => option.name.toLowerCase().includes(search.toLowerCase()));
  }
};

export default useFilteredLocations;
