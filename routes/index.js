//前端首页


//引入
const Router = require('koa-router');
const router = new Router();

router.get('/',async (ctx)=>{
    //ctx.body = "前端首页";
    await ctx.render('default/index');
});

router.get('case',async (ctx)=>{
    ctx.body = "前端案例";
});

router.get('about',async (ctx)=>{
    // ctx.body = "前端关于我们";
    await ctx.render('default/about');
});



//暴露子路由
module.exports = router;