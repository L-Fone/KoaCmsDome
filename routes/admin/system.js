//设置

const Router = require('koa-router');
const router = new Router();


//引入自定义模块
const db = require('../../model/db');
const cfg = require('../../model/config');
const tools = require('../../model/tools');


router.get('/',async (ctx)=>{
    // ctx.body = "设置";

    let result = await db.find(cfg.system,{});

    //获取文件目录下所有图片
    let dir1 = "public/upload";
    let list = tools.GetallFileByPath(dir1);

    await ctx.render('admin/setting/system',{
        list : result[0],
        imglist : list
    });
});

router.post('/doEdit', async (ctx)=>{
    // ctx.body = "设置";

    let debug = ctx.request.body.debug;

    let result = await db.find(cfg.system,{});

    if(result.length <= 0)
    {
        json =
            {
                debug
            };
        await db.insert(cfg.system,json);
    }
    else
    {
        json =
            {
                debug
            };
        await db.update(cfg.system,{"_id":result[0]._id},json);
    }

    await ctx.redirect(ctx.state.__HOST__ + '/admin/system');
});

router.get('/delete',async (ctx)=>{

    //console.log('删除');
    // ctx.body = '删除';

    //获取文件目录下所有图片
    let dir1 = "public/upload";
    let list = tools.GetallFileByPath(dir1);
    //console.log("list ==> " + list.length);

    //对比文章
    let acrticle = await db.find(cfg.article,{"img":{$ne:''}});
    let arr = tools.RemoveUsePath(list, acrticle);

    //对比轮播图
    let focus = await db.find(cfg.focus,{"img":{$ne:''}});
    arr = await tools.RemoveUsePath(arr, focus);

    // 对比友情连接
    let friendlink = await db.find(cfg.friendlink,{"img":{$ne:''}});
    arr = tools.RemoveUsePath(arr, friendlink);

    // 对比好友
    let logo = await db.find(cfg.setting,{"img":{$ne:''}});
    arr = tools.RemoveUsePath(arr, logo);

    tools.DeleteCacheImage(arr);


    await ctx.redirect(ctx.state.__HOST__ + '/admin/system');
});


//暴露出模块
module.exports = router.routes();