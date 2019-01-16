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
      article = require('./admin/article');

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

    //配置全局对象
    ctx.state.G =
        {
            url:splitUrl,
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


//配置子路由 [必须放在全局中间件之后]
router.use('/user',user);
router.use('/focus',focus);
router.use('/login',login);
router.use('/manager', manager);
router.use('/articlecate', articlecate);//分类管理
router.use('/article', article);//内容管理
router.use(index);


/* -----------------------------------------------------*/

router.get('/',async (ctx)=>{
    //ctx.body = "后台管理首页";
    await ctx.render('admin/index');
});

router.get('/user',async (ctx)=>{
    ctx.body = "用户管理";
});

router.get('/focus',async (ctx)=>{
    ctx.body = "轮播图管理";
});

router.get('/news',async (ctx)=>{
    ctx.body = "新闻管理";
});


//暴露子路由
module.exports = router.routes();