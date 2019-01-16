//文章内容管理


//引入
const Router = require('koa-router');
const router = new Router();

//引入自定义模块
const db = require('../../model/db');
const cfg = require('../../model/config');
const tools = require('../../model/tools');


/* ----------------------------------------- */


router.get('/',async (ctx)=>{
     //ctx.body = "文章内容首页";

    let page = 2;
    let pageSize = 1;

    let result = await db.find(cfg.admin,{},{},{page,pageSize});

    //console.log(result);

    await ctx.render('admin/article/index',{
        //传输数据到页面显示
        list : result,
    });
});

router.get('/add',async (ctx)=>{
     ctx.body = "增加文章内容";
    //await ctx.render('admin/article/add');
});

router.get('/edit',async (ctx)=>{
    // ctx.body = "编辑文章内容";
    await ctx.render('admin/article/edit');
});

router.get('/delete',async (ctx)=>{
    ctx.body = "删除文章内容";
});


//暴露子路由
module.exports = router.routes();