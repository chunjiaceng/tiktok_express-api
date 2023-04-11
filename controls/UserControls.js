//模拟验证码发送接口
const SMSClient = require("@alicloud/sms-sdk");
const config = require("../dbUtiles/aliConfig");
const { sySqlConnect } = require("../dbUtiles/dbConfig");
const dbConfig = require("../dbUtiles/dbConfig");
const db = require("../dbUtiles/dbConfig");
const smsClient = new SMSClient({
  accessKeyId: "填上阿里云的accessKey",
  secretAccessKey: "填上阿里云的accessKey",
});
//配置阿里短信验证

//存储发送的手机号与对应的验证码
let validatePhone = [];

//生成4位的一个验证码
function rand(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//验证是否已向该手机号发送验证码
let isSendCodeP = function (phone) {
  validatePhone.forEach((item) => {
    if (item.phone == phone) {
      console.log("已经向该手机号发送过验证码，请稍后。。。");
      return true;
    }
    return false;
  });
};

//模拟对手机发送验证码
sendCode = (req, res) => {
  let phone = req.query.phone;
  if (isSendCodeP(phone)) {
    res.send({ code: 400, msg: "已经向该手机号发送过验证码，请稍后。。。" });
    return;
  } else {
    let code = rand(1000, 9999);
    validatePhone.push({
      phone,
      code,
    });
    res.send({
      code: 200,
      msg: "发送成功",
    });
    console.log(validatePhone);
  }
};

//检测验证码登录是否是第一次登录防止反复注册表
//ture 为首次注册并且注册成功 false为已有账号可以直接登录
phoneLoginBind = async (phone) => {
  //检查用户是否是第一次注册
  let sql = `select * from user where username=? or phone=?`;
  let sqlArr = [phone, phone];
  let res = await db.sySqlConnect(sql, sqlArr);
  if (res.length) {
    console.log("该用户已经注册过了。。");
    // 应该提示直接用验证码登录
    return false;
  } else {
    //则用户是第一次祖册
    //实现用户注册
    console.log("用户是第一次祖册");
    console.log("查询结果：", res);
    //实现注册功能
    const id = registerUser(phone);
    //获取用户详情
    console.log("用户注册成功，id为：" + id);
    return true;
  }
};

//则用户是第一次祖册
registerUser = async (phone) => {
  //检验用户是否是第一次注册
  //设置默认的用户信息
  let avatar_pic =
    "https://i2.hdslb.com/bfs/face/e2db528e634ef0db9a186d49cadea1c286b10976.jpg@240w_240h_1c_1s.webp";
  let sql = `insert into user(id,username,avater_pic,phone,create_time) value(?,?,?,?,?)`;
  sqlArr = [
    phone,
    phone,
    avatar_pic,
    phone,
    new Date().toISOString().slice(0, 19).replace("T", " "),
  ];
  let res = await db.sySqlConnect(sql, sqlArr);
  console.log("插入结果：", res);

  if (res.affectedRows == 1) {
    //查询成功
    //获取对应的用户信息
  } else {
    console.log("用户添加失败");
  }
};

//返回指定用户的个人信息
getUser = async (id) => {
  let sql = `select * from userinfo where id = ` + id;
  let sqlArr = [];
  //返回的是结果集的json，记得转为对象
  let data = await db.sySqlConnect(sql, sqlArr);
  if (data) {
    console.log("该用户的信息是：", data);
    return data;
  } else {
    return "查无该用户信息";
  }
};

//验证手机号和验证码是否对应
findPhoneAndCode = (phone, code) => {
  for (let item of validatePhone) {
    if (item.phone == phone && item.code == code) {
      return "login";
    } else {
      return "error";
    }
  }
};

//利用阿里短信验证发送验证码
sendCore = (req, res) => {
  let phone = req.query.phone;
  console.log(req.query.phone);
  let code = rand(1000, 9999);
  smsClient
    .sendSMS({
      PhoneNumbers: phone,
      SignName: "阿里云短信测试", //签名名称 前面提到要准备的
      TemplateCode: "SMS_154950909", //模版CODE  前面提到要准备的
      // TemplateParam: `{"code":'${str}'}`, // 短信模板变量对应的实际值，JSON格式
      TemplateParam: JSON.stringify({ code: code }), // 短信模板变量对应的实际值，JSON格式
    })
    .then((result) => {
      console.log(result);
      if (result.Code == "OK") {
        res.send({
          code: "200",
          msg: "发送成功",
        });
        validatePhone.push({
          phone,
          code,
        });
        console.log(code);
      }
    })
    .catch((err) => {
      console.log("报错：", err);
      res.send({
        code: 400,
        msg: "发送失败",
      });
    });
};

//将sendCore和phoneLoginBind结合实现用户的验证码登录
sendCodeLogin = (req, res) => {
  let { phone, code } = req.query;
  let status = findPhoneAndCode(phone, code);
  if (status == "login") {
    let phone = req.query.phone;
    phoneLoginBind(phone);
    console.log("req.query.phone:", phone);
    res.send({ code: 200, msg: "登录成功" });
    console.log("登录成功");
    return true;
  } else {
    res.send({ code: 400, msg: "验证码错误，登录失败" });
    return false;
  }
};

//账号密码登录
passwordLogin = async (req, res) => {
  let { username, password } = req.query;
  //使用正则表达式验证
  let phoneReg =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (phoneReg.test(username)) {
    let sql = `select * from user where username = ? and password = ?`;
    let sqlArr = [username, password];
    let data = await db.sySqlConnect(sql, sqlArr);
    let user = JSON.parse(data);
    console.log(user.length);
    if (user.length) {
      let id = user[0].id;
      let rs = await getUser(id);
      res.send({
        code: 200,
        msg: "登录成功！",
        data: JSON.parse(rs),
      });
    } else {
      res.send({
        code: 200,
        msg: "密码错误，登录失败！请重新输入密码",
      });
    }
  } else {
    res.send({
      code: 200,
      msg: "手机号码错误，请重新输入手机号码",
    });
  }
};

//利用文件系统实现对用户头像的修改
editAvatarImg = function (req, res) {
  console.log(req.file.length);
  if (req.file.length === 0) {
    res.render("error", { msg: "文件为空请上传文件" });
  } else {
    let file = req.file;
    fs.renameSync(
      "./public/upload/" + file.filename,
      "./public/upload/" + req.query.id + "_" + file.originalname
    );
    res.set({
      "content-type": "application/JSON; charset=utf-8",
    });
    let { id } = req.query;
    let imgUrl =
      "http://localhost:3000/upload/" + req.query.id + "_" + file.originalname;
    let sql = `update user set avater_pic = ? where id = ?`;
    let sqlArr = [imgUrl, id];
    db.sqlConnect(sql, sqlArr, (err, data) => {
      if (err) {
        res.send({
          code: 200,
          msg: "数据库连接失败",
        });
        return;
      } else {
        if (data.affectedRows == 1) {
          res.send({
            code: 200,
            msg: "上传成功",
            data,
          });
        } else {
          res.send({
            code: 200,
            msg: "头像上传失败",
          });
        }
      }
    });
  }
};

//实现用户视频的发布
let publlish = async (req, res) => {
  let { user_id, title, url, address, isopen, posting } = req.query;
  let sql =
    "insert into video (id,user_id,title,url,address,isopen,posting,create_time) values (?,?,?,?,?,?,?,?)";
  let sqlArr = [
    user_id,
    user_id,
    title,
    url,
    address,
    isopen,
    posting,
    new Date().toISOString().slice(0, 19).replace("T", " "),
  ];
  let result = await db
    .sySqlConnect(sql, sqlArr)
    .then((resu) => {
      console.log("res:", resu);
      let res = JSON.parse(resu);
      return res;
    })
    .catch((err) => {
      return false;
    });
  if (result.affectedRows) {
    res.send({
      code: 200,
      msg: "发布成功",
    });
  } else {
    res.send({
      code: 400,
      msg: "发布失败",
    });
  }
};

module.exports = {
  //发送验证码压入数组中
  sendCore,
  //验证码登录
  sendCodeLogin,
  //账号密码登录
  passwordLogin,
  //利用文件系统实现对用户头像的修改
  editAvatarImg,
  //实现视频的发布
  publlish,
};
