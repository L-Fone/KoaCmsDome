//后台主页面逻辑

const Router = require('koa-router');
const router = new Router();

//引入自定义库
const db = require('../../model/db');


//后台主页
router.get('/',async (ctx)=>{
    // ctx.body = "后台首页";
    await ctx.render('admin/index');
});

//子路由公共改变状态方法
router.get('/changeStatus',async (ctx)=>{
    // ctx.body = "改变状态";
    //console.log(ctx.query);
    //用koa-jsonp请求的接口 浏览器测试访问加 ?callback=xxx

    //更新数据
    let collectionName = ctx.query.collectionName;
    let attr = ctx.query.attr;
    let id = ctx.query.id;

    let data = await db.find(collectionName, {"_id":db.GetObjectID(id)});
    if(data.length>0)
    {
        //查找到数据
        if(data[0][attr]==1)
        {
            //es6 属性名表达式
            var json = {
                [attr]:0
            }
        }
        else
        {
            var json = {
                [attr]:1
            }
        }
        let update = await db.update(collectionName, {'_id':db.GetObjectID(id)}, json);
        if(update)
        {
            ctx.body = {'message:':'更新成功','success':true};
        }
        else
        {
            ctx.body = {'message:':'更新失败','success':false};
        }
    }
    else
    {
        ctx.body = {'message:':'更新失败,参数错误','success':false};
    }



});


//子路由公共删除数据
router.get('/delete',async (ctx)=>{

    let collection = ctx.query.collection;
    let id = ctx.query.id;

    var result = await db.remove(collection,{"_id":db.GetObjectID(id)});

    if(result.result.ok === 1)
    {
        //删除成功
        //返回之前打开的页面
        await ctx.redirect(ctx.state.G.prevPage);
    }
    else
    {
        await ctx.render('admin/error',{
            wait:3,
            message:'错误:删除失败了....',
            //返回之前打开的页面
            redirect:ctx.state.G.prevPage,
        });
    }
});




//暴露出模块
module.exports = router.routes();