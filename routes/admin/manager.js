//后台管理员页面增删改查
const Router = require('koa-router');
const router = new Router();

//引入DB库 该路径是相对本脚本存放路径
//上一级路径用../
const db = require('../../model/db');

router.get('/',async (ctx)=>{
    // ctx.body = "用户首页";
    let result = await db.find('admin',{});
    //渲染数据
    await ctx.render('admin/manager/list',{
        list:result
    });
});

router.get('/add',async (ctx)=>{
    // ctx.body = "用户增加";
    await ctx.render('admin/manager/add');
});

router.get('/edit',async (ctx)=>{
    // ctx.body = "编辑用户";
    await ctx.render('admin/manager/edit');
});

router.get('/delete',async (ctx)=>{
    ctx.body = "删除用户";
});

//暴露出模块
module.exports = router.routes();