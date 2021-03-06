const router = require('express').Router();
const helpController = require('./../controller/helpController');
const auth = require('./../helpers/auth');

router.route('/')
    .get(auth, helpController.gpage)
    .post(auth, helpController.sendComment);

module.exports = router;
