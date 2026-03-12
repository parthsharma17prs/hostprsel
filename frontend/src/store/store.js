import hostelReducer from './slice/hostel.slice';
import {configureStore} from '@reduxjs/toolkit';
const store=configureStore({
    reducer: {
        hostels: hostelReducer,
    },
});
export default store;