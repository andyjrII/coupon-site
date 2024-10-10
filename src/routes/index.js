const express = require('express');
const router = express.Router();

// Landing Page
router.get('/', (req, res) => {
  res.render('index');
});

router.post('/submit-details', async (req, res) => {
  const { name, email, phone, location } = req.body;
  try {
    // Add logic to save user details to your database with Prisma
    // await prisma.user.create({ data: { name, email, phone, location } });

    res.send({ success: true, message: "Details submitted successfully!" });
  } catch (error) {
    console.error("Error saving details:", error);
    res.status(500).send({ success: false, message: "Failed to submit details." });
  }
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
