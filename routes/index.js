var express = require("express");
var router = express.Router();
const blogs = require("../controls/BlogControls");
/* GET home page. */

router.get("/", blogs.getBlogs);
router.get("/blog_type", blogs.getBlogType);

module.exports = router;
