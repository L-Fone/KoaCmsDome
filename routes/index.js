//前端首页路由

//引入
const Router = require('koa-router');
const router = new Router();
const url = require('url');

//引入自定义模块
const db = require('../model/db');
const cfg = require('../model/config');
const tools = require('../model/tools');

/* ---------------------------------------------- */

//公共部分的中间件
router.use(async (ctx, next)=>{

    //在这里写公共功能

    //获取url传入的值
    let pathname = url.parse(ctx.request.url).pathname;

    console.log();

    //查找导航列表 只显示状态为1的图片
    let navlist = await db.find(cfg.nav,{'status':'1'},{},{
        //要排序
        sort:{'sort':1}
    });

    //模板引擎配置全局的变量
    ctx.state.nav = navlist;
    ctx.state.pathname = pathname;


    await next();
});



/* ------------------------------------------------ */

router.get('/',async (ctx)=>{
    //ctx.body = "前端首页";

    //查找轮播图 只显示状态为1的图片
    let focuslist = await db.find(cfg.focus,{'status':'1'},{},{
        //要排序
        sort:{'sort':1}
    });

    await ctx.render('default/index',{
        focus:focuslist,
    });
});

router.get('/news',async (ctx)=>{
    //ctx.body = "前端案例";

    await ctx.render('default/news');
});

router.get('/service',async (ctx)=>{
    //ctx.body = "前端案例";

    let pathname = url.parse(ctx.request.url).pathname;

    let serlist = await db.find(cfg.nav,{"linkurl":pathname});

    if(serlist.length>0)
    {
        let list = await db.find(cfg.article,{"pid":serlist[0].catepid});

        await ctx.render('default/service',{
            list:list
        });
    }
});

//内容详情 动态路由
router.get('/content/:id',async (ctx)=>{

    let id = ctx.params.id;

    let result = await db.findByID(cfg.article,id);

    await ctx.render('default/content',{
        list:result[0]
    });
});





router.get('/case',async (ctx)=>{
    //ctx.body = "前端案例";

    await ctx.render('default/case');
});

router.get('/connect',async (ctx)=>{
    //ctx.body = "前端案例";

    await ctx.render('default/connect');
});

router.get('/about',async (ctx)=>{
    // ctx.body = "前端关于我们";
    await ctx.render('default/about');
});



//暴露子路由
module.exports = router.routes();