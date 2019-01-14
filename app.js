
//引入库
const Koa = require('koa')
    , Router = require('koa-router')
    , render = require('koa-art-template')
    , path = require('path');


//引入子模块
const admin = require('./routes/admin');//后台
const api = require('./routes/api');//接口
const index = require('./routes/index');//前端


//初始化
var app = new Koa(),
    router = new Router();

//配置模板引擎
render(app,{
    root:path.join(__dirname, 'views'),
    extname:'.html',
    debug:process.env.NODE_EVN !== 'production'
});


//配置子路由
router.use('/', index.routes());
//配置启动子路由
router.use('/admin',admin.routes());
//配置启动子路由
router.use('/api',api.routes());



app.use(router.routes()).use(router.allowedMethods()).listen(8080);