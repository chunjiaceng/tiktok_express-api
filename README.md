# 基于本地express搭建的api

### 目前该项目只完成了以下api

1. //用户实现验证码登录 parme (phone,code)

>router.get("/sendCodeLogin", user.sendCodeLogin);
>
>router.post("/sendCodeLogin", user.sendCodeLogin);

2. //用阿里大鱼实现发送验证码 parme (phone)

>router.post("/sendCore", user.sendCore);
>
>router.get("/sendCore", user.sendCore);

3. //实现账号密码登录，返回用户信息 parme (username,password)

>router.get("/passwordLogin", user.passwordLogin);
>
>router.post("/passwordLogin", user.passwordLogin);

4. //实现用户头像的修改，基于multer.js parme(file,id)

>router.post("/editAvatarImg", upload, user.editAvatarImg);

5. //实现视频的上传 parme(user_id, title, url, address, isopen, posting)

>router.all("/publlish", user.publlish);

6. //关注用户 parme(follow_id, user_id)

>router.all("/Follow", follow.Follow);

### 启动项目

~ 请确保自己安装了node.js和npm

**进入项目目录后**

>npm install

端口为3000

>npm run start

### 数据库文件在sql文件夹下

## 学习ing。。。期待后续完善