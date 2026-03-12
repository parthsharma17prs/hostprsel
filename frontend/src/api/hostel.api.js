import axios from './axios.config';

/* ── Public: get approved reviews (latest 6) ── */
export const getApprovedReviews=async () =>
{
    const response=await axios.get('/reviews/approved');
    return response.data;
};

/* ── Public: submit a new review ── */
export const submitReview=async (data) =>
{
    const response=await axios.post('/reviews', data);
    return response.data;
};
export const getHostels=async () => await axios.get('/hostels');
export const getPopularHostels=async () => {const res=await axios.get('/hostels/popular'); return res.data;};
export const getHostelById=async (id) => await axios.get(`/hostels/${id}`);

/* ── Public: get site images/settings ── */
export const getSiteSettings=async () =>
{
    const response=await axios.get('/site-settings');
    return response.data;
};