const express = require('express');
const router = express.Router();
const Contact = require('../models/contact.model');

router.post('/send/message', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
