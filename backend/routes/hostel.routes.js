const express=require('express');
const router=express.Router();
const Hostel=require('../models/hostel.model');

router.get('/', async (req, res) =>
{
  try
  {
    const hostels=await Hostel.find();
    res.json(hostels);
  } catch (error)
  {
    res.status(500).json({message: error.message});
  }
});

router.get('/popular', async (req, res) =>
{
  try
  {
    const hostels=await Hostel.find({popular: true}).sort({createdAt: -1}).limit(3);
    res.json(hostels);
  } catch (error)
  {
    res.status(500).json({message: error.message});
  }
});

router.get('/:id', async (req, res) =>
{
  try
  {
    const hostel=await Hostel.findById(req.params.id);
    if (!hostel)
    {
      return res.status(404).json({message: 'Hostel not found'});
    }
    res.json(hostel);
  } catch (error)
  {
    res.status(500).json({message: error.message});
  }
});

module.exports=router;
