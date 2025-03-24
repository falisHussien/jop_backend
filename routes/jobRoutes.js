const express = require('express');
const { applyForJob } = require('../controllers/jobController');

const router = express.Router();

router.post('/apply', applyForJob);

module.exports = router;
