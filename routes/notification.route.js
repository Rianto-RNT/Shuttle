const router = require('express').Router();
const { showAllNotification } = require('../controller/notificationController');

router.get('/', showAllNotification);

module.exports = router;
