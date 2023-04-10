var express = require("express");
var router = express.Router();
const follow = require("../controls/FollowControls");

router.all("/Follow", follow.Follow);

module.exports = router;
