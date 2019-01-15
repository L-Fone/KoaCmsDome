//后台管理路由

//引入
const Router = require('koa-router');
const router = new Router();
const url = require('url');

//引入子路由
const user = require('./admin/user');
const focus = require('./admin/focus');
const newscate = require('./admin/newscate');
const login = require('./admin/login');


/* -----------------------------------------------------*/

//配置中间件 获取URL的地址
router.use(async (ctx, next)=>{
    //模板引擎配置全局的变量
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;

    //过滤URL
    let pathName = url.parse(ctx.url).pathname;


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
        if(pathName === '/admin/login' || pathName === '/admin/login/doLogin' || pathName === '/admin/login/code')
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
router.use('/newscate',newscate);
router.use('/login',login);


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