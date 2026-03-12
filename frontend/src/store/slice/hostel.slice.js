import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getHostelById, getHostels} from '../../api/hostel.api';

export const fetchHostels=createAsyncThunk(
    'hostels/fetchHostels',
    async () =>
    {
        const response=await getHostels();
        return response.data;
    }
);

export const fetchHostelById=createAsyncThunk(
    'hostels/fetchHostelById',
    async (id) =>
    {
        const response=await getHostelById(id);
        return response.data;
    }
);

const hostelSlice=createSlice({
    name: 'hostels',
    initialState: {
        hostels: [],
        selectedHostel: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) =>
    {
        builder
            // 🔹 FETCH ALL HOSTELS
            .addCase(fetchHostels.pending, (state) =>
            {
                state.status='loading';
            })
            .addCase(fetchHostels.fulfilled, (state, action) =>
            {
                state.status='succeeded';
                state.hostels=action.payload;
            })
            .addCase(fetchHostels.rejected, (state, action) =>
            {
                state.status='failed';
                state.error=action.error.message;
            })

            // 🔹 FETCH HOSTEL BY ID
            .addCase(fetchHostelById.pending, (state) =>
            {
                state.status='loading';
            })
            .addCase(fetchHostelById.fulfilled, (state, action) =>
            {
                state.status='succeeded';
                state.selectedHostel=action.payload;
            })
            .addCase(fetchHostelById.rejected, (state, action) =>
            {
                state.status='failed';
                state.error=action.error.message;
            });
    },
});

export default hostelSlice.reducer;
