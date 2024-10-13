const express = require('express');
const router = express.Router();
const index = require('../controllers/indexController');

// Landing Page
router.get('/', (req, res) => {
  res.render('index');
});

router.post('/submit-details', index.postDetails);

router.post('/select-door', index.postSelect);

module.exports = router;
