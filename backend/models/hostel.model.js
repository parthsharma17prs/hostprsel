const mongoose=require('mongoose');

const hostelSchema=new mongoose.Schema({
  name: {type: String, required: true},
  location: {type: String, required: true},
  rating: {type: Number, default: 0},
  price: {type: Number, required: true},
  discountedPrice: {type: Number, default: 0},
  gender: {type: String, required: true},
  established: {type: Number},
  description: {type: String},
  propertyType: {type: String, enum: ['hostel', 'flat'], default: 'hostel'},
  /* Hostel-specific */
  totalRemainingBeds: {type: Number, default: 0},
  capacity: {type: Number, default: 0},
  occupancy: {type: Number, default: 0},
  hostelType: {type: String},
  /* Flat-specific */
  flatType: {type: String, enum: ['1 BHK', '2 BHK', '3 BHK', 'Studio', ''], default: ''},
  popular: {type: Boolean, default: false},
  comming_soon: {type: Boolean, default: false},
  images: [{type: String}],
  features: [{type: String}],
  usps: [{type: String}],
  nearby1: {type: String},
  nearby1distance: {type: String},
  nearby2: {type: String},
  nearby2distance: {type: String},
  nearby3: {type: String},
  nearby3distance: {type: String},
  locationLink: {type: String}
}, {timestamps: true});

module.exports=mongoose.model('Hostel', hostelSchema);
