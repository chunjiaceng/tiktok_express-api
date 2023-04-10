const mysql = require("mysql");
module.exports = {
  config: {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "123456",
    database: "myblog",
  },
  //连接池对象
  sqlConnect(sql, sqlArr, callback) {
    var pool = mysql.createPool(this.config);
    // var conn = mysql.createConnection(this.config);
    // conn.query
    pool.getConnection((error, result) => {
      if (error) {
        console.log("连接出错：", error);
        return;
      } else {
        //事件驱动回调
        result.query(sql, sqlArr, callback);
        //释放资源
        result.release();
      }
    });
  },

  //promise回调 成功则返回查询的对象
  sySqlConnect(sySql, sqlArr) {
    return new Promise((resolve, reject) => {
      var pool = mysql.createPool(this.config);
      // var conn = mysql.createConnection(this.config);
      // conn.query
      pool.getConnection((error, result) => {
        if (error) {
          console.log("数据库连接出错：");
          reject(error);
        } else {
          //事件驱动回调
          result.query(sySql, sqlArr, (err, data) => {
            if (err) {
              console.log("查询出错：", err);
              return;
            }
            console.log("查询成功！data：" + JSON.stringify(data));

            resolve(JSON.stringify(data));
          });
        }
        result.release();
      });
      //释放资源
    });
  },
};
