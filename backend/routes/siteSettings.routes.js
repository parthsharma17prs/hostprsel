const express=require('express');
const router=express.Router();
const SiteSettings=require('../models/siteSettings.model');

/* ── Helper: get or create the single settings doc ── */
const getSettings=async () =>
{
    let settings=await SiteSettings.findOne();
    if (!settings) settings=await SiteSettings.create({});
    return settings;
};

/* ── PUBLIC: Get site images ── */
router.get('/', async (req, res) =>
{
    try
    {
        const settings=await getSettings();
        res.json(settings);
    } catch (err)
    {
        res.status(500).json({message: 'Failed to fetch site settings', error: err.message});
    }
});

/* ── ADMIN: Update site images (auth handled by admin routes, but also exposed here) ── */
router.put('/', async (req, res) =>
{
    try
    {
        const settings=await getSettings();
        const fields=['heroBg', 'heroMain', 'heroSub', 'aboutImage', 'exploreImages', 'homeFeelImage', 'hostelHeroBg', 'hostelArchImages'];
        fields.forEach(f => {if (req.body[f]!==undefined) settings[f]=req.body[f];});
        await settings.save();
        res.json(settings);
    } catch (err)
    {
        res.status(500).json({message: 'Failed to update site settings', error: err.message});
    }
});

module.exports=router;
