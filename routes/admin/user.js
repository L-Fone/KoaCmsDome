//管理用户的增删改查
const Router = require('koa-router');
const router = new Router();

router.get('/',async (ctx)=>{
    // ctx.body = "用户首页";
    await ctx.render('admin/user/index');
});

router.get('/add',async (ctx)=>{
    // ctx.body = "用户增加";
    await ctx.render('admin/user/add');
});

router.get('/edit',async (ctx)=>{
    // ctx.body = "编辑用户";
    await ctx.render('admin/user/edit');
});

router.get('/delete',async (ctx)=>{
    ctx.body = "删除用户";
});

//暴露出模块
module.exports = router;