const db = require("../dbUtiles/dbConfig");

//判断是否已经关注过了。防止重复关注
isFollow = async (follow_id, user_id) => {
  let sql = "select * from follows where follow_id = ? and user_id = ?";
  let sqlArr = [follow_id, user_id];
  let data = await db.sySqlConnect(sql, sqlArr);
  let res = JSON.parse(data);
  if (!res.length) {
    return false;
  } else {
    return true;
  }
};

//关注用户
let Follow = async (req, res) => {
  let { follow_id, user_id } = req.query;
  if (follow_id == user_id) {
    res.send({
      code: 200,
      msg: "您不能自己关注自己哦",
    });
  }
  let rsl = await isFollow(follow_id, user_id);
  if (rsl) {
    res.send({
      code: 200,
      msg: "亲，您已经注册过了哦",
    });
  } else {
    let sql =
      "insert into follows(follow_id,user_id,create_time) values(?,?,?)";
    let sqlArr = [
      follow_id,
      user_id,
      new Date().toISOString().slice(0, 19).replace("T", " "),
    ];
    let data = await db.sySqlConnect(sql, sqlArr);
    if (JSON.parse(data).affectedRows) {
      res.send({
        code: 200,
        msg: "注册成功",
        data,
      });
    } else {
      res.send({
        code: 200,
        msg: "注册失败",
      });
    }
  }
};

module.exports = {
  Follow,
};
