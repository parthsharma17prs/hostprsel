const express=require('express');
const router=express.Router();
const Review=require('../models/review.model');

/* ── Public: submit a new review (unapproved by default) ── */
router.post('/', async (req, res) =>
{
    try
    {
        const {name, role, rating, text}=req.body;
        const review=new Review({name, role, rating, text, approved: false});
        await review.save();
        res.status(201).json({message: 'Review submitted! It will be visible after admin approval.', review});
    } catch (error)
    {
        res.status(400).json({message: error.message});
    }
});

/* ── Public: get approved reviews (latest 6) ── */
router.get('/approved', async (req, res) =>
{
    try
    {
        const reviews=await Review.find({approved: true}).sort({createdAt: -1}).limit(6);
        res.json(reviews);
    } catch (error)
    {
        res.status(500).json({message: error.message});
    }
});

module.exports=router;
