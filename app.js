//总路由入口

//引入库
const Koa = require('koa')//koa
    , Router = require('koa-router')//koa路由
    , render = require('koa-art-template')//渲染模板
    , path = require('path')//路径
    , statics = require('koa-static')//静态web服务[加载css等]
    , session = require('koa-session')//session
    , bodyParser = require('koa-bodyparser')//接受post数据
    ;


//引入子路由模块
const admin = require('./routes/admin');//后台
const api = require('./routes/api');//接口
const index = require('./routes/index');//前端


//初始化
var app = new Koa(),
    router = new Router();

//配置template渲染模板引擎
render(app,{
    root:path.join(__dirname, 'views'),         //模板路径
    extname:'.html',                            //模板文件类型
    debug:process.env.NODE_EVN !== 'production' //是否调试模式
});

//配置静态资源中间件
app.use(statics(__dirname + '/public'));

//配置session
app.keys = ['some secret hurr'];//默认一定一定要加
const CONFIG =
    {
      key:'koa:sess',
      maxAge:86400,
      overwrite:true,
      httpOnly:true,
      signed:true,
      rolling:false,
      renew:true,
    };
app.use(session(CONFIG, app));

//配置bodyParser用于读取post过来的数据
app.use(bodyParser());


/* ----------------配置子路由---------------------------- */

//配置层级子路由
router.use('/admin',admin);
router.use('/api',api);
router.use(index);//默认加载页面


//启动监听
app.use(router.routes()).use(router.allowedMethods()).listen(8080);