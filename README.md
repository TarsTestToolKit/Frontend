# 代码说明

整体代码采用nodejs + vue3 + Element Plus实现, 分两部分:
- 客户端部分: 客户端表示vue页面这部分, 在client目录下
- 服务器端部分: 服务器代码在src目录下

# 如何调试

启动client:
- 进入client目录

```
npm install
npm run serve
```

启动server:
- 源码目录: npm install
- npm run dev

Client-npm run build:

http://localhost:3001

Client-npm run serve:

http://localhost:6001

开发时修改任何代码, 服务器和客户端都会自动编译和更新.

# 源码如何发布

编译client
- 进入client目录
- npm run build
- 运行后, 生成所有client的页面和js等

编译server
- 由于server采用的typescript实现, 因此需要编译
- 在源码目录, npm run build

完成以上工作后, 代码都编译并准备好(这个也是提交到git的状态), 需要运行时, 采用pm来控制服务, 先安装pm:
```
npm install pm2
```

npm run prd

**注意默认开启的是6080端口!!(config/config.json中修改)**


# 如何添加命令
- 修改 src/config/tars.conf 指定主控地址, 如果要部署在tars框架上这里可能还得修改!
- src/app/index.ts中添加路由
- src/controller/TestController.ts 中添加调用后台的代码逻辑


# 本地远程开发常见问题

## 提示[vue/no-multiple-template-root] The template root requires exactly one element.eslint-plugin-vue
- 安装Vetur
- vscode-首选项-设置-搜索"eslint",去掉选项Vetur:Validation:Template
