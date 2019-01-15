//后台轮播图的增删改查



//引入
const Router = require('koa-router');
const router = new Router();

router.get('/',async (ctx)=>{
    // ctx.body = "轮播图首页";
    await ctx.render('admin/focus/index');
});

router.get('/add',async (ctx)=>{
    // ctx.body = "增加轮播图";
    await ctx.render('admin/focus/add');
});

router.get('/edit',async (ctx)=>{
    // ctx.body = "编辑轮播图";
    await ctx.render('admin/focus/edit');
});

router.get('/delete',async (ctx)=>{
    ctx.body = "删除轮播图";
});


//暴露子路由
module.exports = router.routes();