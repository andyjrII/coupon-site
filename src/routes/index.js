const express = require('express');
const router = express.Router();

// Landing Page
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/properties', (req, res) => {
  res.render('properties');
});

router.get('/property-details', (req, res) => {
  res.render('property-details');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

module.exports = router;
