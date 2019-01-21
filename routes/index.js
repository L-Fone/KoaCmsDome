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

router.use(async (ctx, next)=>{

    let navlist = await db.find(cfg.nav,{'status':'1'},{},{
        //要排序
        sort:{'sort':1}
    });

    ctx.state.G = {
      navlist:navlist
    };

    await next();

});

router.get('/',async (ctx)=>{
    //ctx.body = "前端首页";

    let curPage = ctx.query.page || 1;
    let pageSize = 8;
    let visiblePage = 5;

    //查找轮播图 只显示状态为1的图片
    let count = await db.count(cfg.article,{});

    let result = await db.find(cfg.article,{},{},
        {
            page:curPage,
            pageSize:pageSize,
            sort:{ "catename":1,"edit_time":-1 }
        });

    let focus = await db.find(cfg.focus,{'status':'1'});

    await ctx.render('default/index',{
        list:result,
        focus:focus,
        visiblePage:visiblePage,//显示条数
        curPage:curPage,//当前页
        totalPages:Math.ceil(count/pageSize),//总页数 向上取整
    });
});

router.get('/show',async (ctx)=>{
    //ctx.body = "前端案例";

    await ctx.render('default/show');
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





router.get('/list/:id',async (ctx)=>{
    //ctx.body = "前端案例";

    let id = ctx.params.id;
    console.log(id);

    await ctx.render('default/list');
});





//暴露子路由
module.exports = router.routes();