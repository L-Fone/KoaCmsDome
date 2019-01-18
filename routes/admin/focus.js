//轮播图的增删改查

const Router = require('koa-router');
const router = new Router();

//引入自定义模块
const db = require('../../model/db');
const cfg = require('../../model/config');
const tools = require('../../model/tools');

/* ---------------------------------------- */


router.get('/',async (ctx)=>{
    // ctx.body = "轮播图首页";
    await ctx.render('admin/focus/index');
});

router.get('/add',async (ctx)=>{
    // ctx.body = "轮播图增加";
    await ctx.render('admin/focus/add');
});

router.get('/edit',async (ctx)=>{
    // ctx.body = "编辑轮播图";
    await ctx.render('admin/focus/edit');
});


//暴露出模块
module.exports = router.routes();