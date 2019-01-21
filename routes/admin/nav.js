//导航管理

const Router = require('koa-router');
const router = new Router();

//引入自定义模块
const db = require('../../model/db');
const cfg = require('../../model/config');
const tools = require('../../model/tools');

/* ---------------------------------------- */

router.get('/',async (ctx)=>{
     ctx.body = "导航管理首页";

    //查询导航
    let result = await db.find(cfg.nav, {});

    await ctx.render('admin/nav/index',{
        list : result,
        cfg:cfg.nav,
    });

});

router.get('/add',async (ctx)=>{
    //ctx.body = "导航增加";

    let result = await db.find(cfg.articlecate,{"pid":"0"});
    let cate = tools.cateToList(result);

    await ctx.render('admin/nav/add',{
        list : cate
    });
});


//执行增加操作
router.post('/doAdd', async (ctx)=>{

    //接收过来的数据
    let title = ctx.request.body.title || '';
    let linkurl = ctx.request.body.linkurl || '';
    let catename = ctx.request.body.catename;
    let catepid = ctx.request.body.pid;
    let sort = ctx.request.body.sort || '0';
    let status = ctx.request.body.status;
    console.log(catepid);
    console.log(catename);

    let add_time = new Date();
    let edit_time = new Date();

    let json =
        {
            catename, catepid, title, linkurl, sort, status, add_time, edit_time
        };

    //写入数据
    let result = await db.insert(cfg.nav, json);

    await ctx.redirect(ctx.state.__HOST__ + '/admin/nav');


});




router.get('/edit',async (ctx)=>{
    // ctx.body = "编辑轮播图";
    //获取传值
    let id = ctx.query.id;

    let articlecate = await db.find(cfg.articlecate,{"pid":"0"});
    let cate = tools.cateToList(articlecate);

    cate.unshift({
        "_id":"0",
        "title":"--不关联--",
        "pid":"0"
    });

    let result = await db.findByID(cfg.nav, id);


    await ctx.render('admin/nav/edit',{
        list : result[0],
        articlecate:cate,
        prevPage: ctx.state.G.prevPage,//保存上一次打开的页面
    });
});


//执行编辑数据
router.post('/doEdit', async (ctx)=>{

    //接收过来的数据
    let id = ctx.request.body.id;
    let catename = ctx.request.body.catename;
    let catepid = ctx.request.body.catepid;
    let title = ctx.request.body.title || '';
    let linkurl = ctx.request.body.linkurl || '';
    let sort = ctx.request.body.sort || '0';
    let status = ctx.request.body.status;

    let edit_time = new Date();

    let json =
        {
            title, catename, catepid, linkurl, sort, status,  edit_time
        };

    //写入数据
    let result = await db.update(cfg.nav,{"_id": db.GetObjectID(id)}, json);

    await ctx.redirect(ctx.request.body.prevPage ? ctx.request.body.prevPage : ctx.state.__HOST__ + '/admin/nav');

});



//暴露出模块
module.exports = router.routes();