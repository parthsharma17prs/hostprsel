const mongoose=require('mongoose');

const reviewSchema=new mongoose.Schema({
    name: {type: String, required: true},
    role: {type: String, required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    text: {type: String, required: true},
    approved: {type: Boolean, default: false},
}, {timestamps: true});

module.exports=mongoose.model('Review', reviewSchema);
