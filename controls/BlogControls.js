const db = require("../dbUtiles/dbConfig");

module.exports = {
  //获取全部数据
  getBlogs: function (req, res, next) {
    //调用数据库的查询方法
    const sql = "select * from blog";
    const sqlArr = [];

    db.sqlConnect(sql, sqlArr, (err, rs) => {
      if (err) {
        return;
      }
      res.send({ data: rs });
    });

    // res.render('index', { title: 'Express' });
  },
  //获取对应分类的blog
  getBlogType: function (req, res) {
    let { id } = req.query;
    const sql = `SELECT * from blog WHERE post_classify_id = '${id}'`;
    console.log(sql);
    console.log(req.query);
    const sqlArr = [];
    const callback = (err, rs) => {
      if (err) {
        console.log("查询出错。。。:", err);
        return;
      }
      res.send({ list: rs });
    };
    //最后要记得建立连接
    db.sqlConnect(sql, sqlArr, callback);
  },
};
