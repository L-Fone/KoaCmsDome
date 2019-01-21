//后台管理路由

//引入
const Router = require('koa-router');
const router = new Router();
const url = require('url');

//引入子路由
const user = require('./admin/user'),
      focus = require('./admin/focus'),
      login = require('./admin/login'),
      manager = require('./admin/manager'),
      index = require('./admin/index'),
      articlecate = require('./admin/articlecate'),
      article = require('./admin/article'),
      friendlink = require('./admin/friendlink'),
      nav = require('./admin/nav');
      setting = require('./admin/setting');

//文本编辑器
const ueditor = require('koa2-ueditor');
//引入自定义模块
const db = require('../model/db');
const cfg = require('../model/config');
const tools = require('../model/tools');

/* -----------------------------------------------------*/

//配置中间件 获取URL的地址
router.use(async (ctx, next)=>{
    //模板引擎配置全局的变量
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;

    //过滤URL
    let pathName = url.parse(ctx.url).pathname;

    if(pathName.endsWith('/'))
    {
        pathName = pathName.substring(0,pathName.length-1);
    }
    if(pathName.startsWith('/'))
    {
        pathName = pathName.substring(1);
    }

    let splitUrl = pathName.split('/');

    let setting = await db.find(cfg.setting,{});

    let debug = setting[0].debug === "1";

    //配置全局对象
    ctx.state.G =
        {
            url:splitUrl,
            debug:debug,
            userinfo:ctx.session.userinfo,
            prevPage:ctx.request.header['referer'],//记录上一个打开的页面
        };


    //登录权限判断
    if(ctx.session.userinfo)
    {
        //已经登录

        //继续向下匹配[中间件必须加]
        await next();
    }
    else
    {
        //如果当前页面是登录页面
        if(pathName === 'admin/login' || pathName === 'admin/login/doLogin' || pathName === 'admin/login/code')
        {
            //向下匹配
            await next();
        }
        else
        {
            //否则 返回渲染显示登录界面
            ctx.redirect('/admin/login');
        }
    }
});


//配置文本编辑器
//'public'为储存目录 要修改ueditor.config
router.all('/editor/controller',ueditor(['public',{
    //支持的格式
    "imageAllowFiles":[".png",".jpg",".jpeg"],
    //保存为原文件名
    "imagePathFormat":"/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}",
}]));



//配置子路由 [必须放在全局中间件之后]
router.use('/user',user);
router.use('/login',login);
router.use('/manager', manager);
router.use('/articlecate', articlecate);//分类管理
router.use('/article', article);//内容管理
router.use('/focus', focus);//轮播图管理
router.use('/friendlink', friendlink);//友情连接管理
router.use('/nav', nav);//友情连接管理
router.use('/setting', setting);//友情连接管理
router.use(index);


/* -----------------------------------------------------*/


//暴露子路由
module.exports = router.routes();