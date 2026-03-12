require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');

const hostelRoutes=require('./routes/hostel.routes');
const contactRoutes=require('./routes/contact.routes');
const adminRoutes=require('./routes/admin.routes');
const reviewRoutes=require('./routes/review.routes');
const siteSettingsRoutes=require('./routes/siteSettings.routes');

const app=express();
const PORT=process.env.PORT||3000;
const MONGODB_URI=process.env.MONGODB_URI||'mongodb://localhost:27017/gurukul_hostel';

const allowedOrigins=process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  :['http://localhost:5173', 'http://localhost:5174'];

const corsOptions={
  origin: allowedOrigins,
  methods: 'GET,POST,PUT,DELETE,PATCH,HEAD,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/hostels', hostelRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/reviews', reviewRoutes);
app.use('/site-settings', siteSettingsRoutes);

app.get('/', (req, res) =>
{
  res.json({message: 'Gurukul House API is running'});
});

mongoose.connect(MONGODB_URI)
  .then(() =>
  {
    console.log('Connected to MongoDB');
    app.listen(PORT, () =>
    {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) =>
  {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
