import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axios/axiosinstance';

export const    fetchPlans = createAsyncThunk('subscriptions/fetchPlans', async () => {
    const response = await axiosInstance.get('subscription/plans/');
    return response.data;
    });

    export const createCheckoutSession = createAsyncThunk(
        'subscriptions/createCheckoutSession',
        async (planId) => {
            const response = await axiosInstance.post('subscription/checkout-session/', { plan_id: planId });
            return response.data;
        }
    );
    

    const subscriptionSlice = createSlice({
    name: 'subscriptions',
    initialState: {
        plans: [],
        checkoutSessionId: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchPlans.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchPlans.fulfilled, (state, action) => {
            state.loading = false;
            state.plans = action.payload;
        })
        .addCase(fetchPlans.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(createCheckoutSession.fulfilled, (state, action) => {
            state.checkoutSessionId = action.payload.id;
        });
    },
});

export default subscriptionSlice.reducer;
