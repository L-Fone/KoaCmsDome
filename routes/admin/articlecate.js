//后台分类管理的增删改查



//引入
const Router = require('koa-router');
const router = new Router();

//引入自定义库
const db = require('../../model/db');
const cfg = require('../../model/config');
const tools = require('../../model/tools');

/* ---------------------------------------- */

//配置路由
router.get('/',async (ctx)=>{

    //ctx.body = "分类首页";

    //获取所有数据
    let result = await db.find(cfg.articlecate,{});

    let data = tools.cateToList(result);
    await ctx.render('admin/articlecate/index',{
        //放数据
        cfg : cfg.articlecate,
        list : data
    });
});

router.get('/add',async (ctx)=>{
    //ctx.body = "增加分类";

    //要先获取一级分类供选择
    let result = await db.find(cfg.articlecate,{"pid":'0'});

    await ctx.render('admin/articlecate/add',{
        catelist : result
    });

});

//执行增加操作
router.post('/doAdd',async (ctx)=>{

    //通过bodyParser拿到post过来的数据
    //console.log(ctx.request.body);

    let addData = ctx.request.body;

    let cb = await db.insert(cfg.articlecate, addData);

    if(cb.result.ok === 1)
    {
        //添加成功
        await ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate');
    }


});



router.get('/edit',async (ctx)=>{
    //一定要注意 get  传值是 query
    //一定要注意 post 传值中 request.body

    //ctx.body = "编辑分类" + ctx.query.id;
    //console.log(ctx.query.id);

    let id = ctx.query.id;
    let result = await db.find(cfg.articlecate,{"_id":db.GetObjectID(id)});

    let allData = await db.find(cfg.articlecate,{});

    let data = tools.cateToList(allData);

    if(result.length>0)
    {
        //成功获取
        await ctx.render('admin/articlecate/edit',{
            list: result[0],
            catelist: data
        });
    }




    //await ctx.render('admin/articlecate/edit');
});


//执行编辑提交过来的数据
router.post('/doEdit',async (ctx)=>{

    //console.log(ctx.request.body);
    let id = ctx.request.body.id;
    let pid = ctx.request.body.pid;
    let title = ctx.request.body.title;
    let keywords = ctx.request.body.keywords;
    let status = ctx.request.body.status;
    let desc = ctx.request.body.description;

    let result = await db.update(cfg.articlecate,
        {
            "_id":db.GetObjectID(id)
        },
        {
            title:title,
            pid: pid,
            keywords:keywords,
            status:status,
            desc:desc,
        });

    if(result.result.ok == 1)
    {
        //更新成功
        await ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate');
    }
    else
    {
        await ctx.render('admin/error',{
            wait:3,
            message:'错误:数据更新失败了....',
            redirect:ctx.state.__HOST__ + '/admin/articlecate/edit',
        });
    }


});


//暴露子路由
module.exports = router.routes();