const mongoose=require('mongoose');

const siteSettingsSchema=new mongoose.Schema({
    /* ── Home Page ── */
    heroBg: {type: String, default: ''},  // hero background image
    heroMain: {type: String, default: ''},  // hero main arch image
    heroSub: {type: String, default: ''},  // hero small circle image
    aboutImage: {type: String, default: ''},  // about section image
    exploreImages: {type: [String], default: []}, // 3 arch images in "Explore Our Spaces"
    homeFeelImage: {type: String, default: ''},  // "Your Aura, Your Space" image

    /* ── Hostel Page ── */
    hostelHeroBg: {type: String, default: ''},  // hostel page hero bg (if different)
    hostelArchImages: {type: [String], default: []}, // 3 arch images on hostel page hero
}, {timestamps: true});

module.exports=mongoose.model('SiteSettings', siteSettingsSchema);
