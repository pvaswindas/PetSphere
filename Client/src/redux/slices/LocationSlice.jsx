import { createSlice } from '@reduxjs/toolkit';

const LocationSlice = createSlice({
    name: 'location',
    initialState: {
        latitude: null,
        longitude: null,
        address: null,
    },
    reducers: {
        setLocation: (state, action) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.address = action.payload.address;
        },
        clearLocation: (state) => {
            state.latitude = null;
            state.longitude = null;
            state.address = null;
        },
    },
});

export const { setLocation, clearLocation } = LocationSlice.actions;
export default LocationSlice.reducer;
