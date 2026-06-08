import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    countries: [
      'Belarus',
      'Poland',
      'Germany',
      'France',
      'Italy',
      'Spain',
      'United Kingdom',
      'United States',
      'Canada',
      'Japan',
    ],
};

const countriesSlice = createSlice({
    name: 'countries',
    initialState,
    reducers: {},
});

export const selectCountries = (state: { countries: typeof initialState}) =>
    state.countries.countries;

export default countriesSlice.reducer;