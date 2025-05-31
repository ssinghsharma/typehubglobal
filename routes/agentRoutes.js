// const express = require('express');
// const agentController = require('../controllers/agentController');
// const authController = require('../controllers/authController');

// const router = express.Router();

// router.use(authController.protect);

// router.post('/log-contact', agentController.logAgentContact);

// module.exports = router;
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login); // This should already exist

module.exports = router;