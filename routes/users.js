var express = require("express");
var router = express.Router();
const user = require("../controls/UserControls");
const multer = require("multer");
const { fstat } = require("fs");
const db = require("../dbUtiles/dbConfig");
const upload = multer({ dest: "./public/upload/" }).single("file");
const fs = require("fs");
const { log } = require("console");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//用户实现验证码登录
router.get("/sendCodeLogin", user.sendCodeLogin);
router.post("/sendCodeLogin", user.sendCodeLogin);
//用阿里大鱼实现发送验证码
router.post("/sendCore", user.sendCore);
router.get("/sendCore", user.sendCore);
//实现账号密码登录，返回用户信息
router.get("/passwordLogin", user.passwordLogin);
router.post("/passwordLogin", user.passwordLogin);
//用户头像的修改 实现文件的上传
router.post("/editAvatarImg", upload, user.editAvatarImg);
//实现视频的上传
router.all("/publlish", user.publlish);
module.exports = router;
