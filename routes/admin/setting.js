//设置

const Router = require('koa-router');
const router = new Router();

//引入自定义模块
const db = require('../../model/db');
const cfg = require('../../model/config');
const tools = require('../../model/tools');

router.get('/',async (ctx)=>{
    // ctx.body = "设置";

    let result = await db.find(cfg.setting,{});

    await ctx.render('admin/setting/index',{
        list : result[0]
    });
});

router.post('/doEdit', tools.multerSingle(cfg.logoDir,'logo'), async (ctx)=>{
    // ctx.body = "设置";

    //console.log(ctx.req.body);

    let title = ctx.req.body.title;
    let qq = ctx.req.body.qq;
    let email = ctx.req.body.email;
    let phone = ctx.req.body.phone;
    let ICP = ctx.req.body.ICP;
    let keywords = ctx.req.body.keywords;
    let desc = ctx.req.body.desc;
    let status = ctx.req.body.status;
    let logo = ctx.req.file ? cfg.logoDir + ctx.req.file.filename : '';//文章图片
    let add_time = new Date();

    let json = {};

    let result = await db.find(cfg.setting,{});

    if(result.length <= 0)
    {
        json =
        {
            title, qq, email, phone, ICP, keywords, desc, status, logo, add_time
        };
        await db.insert(cfg.setting,json);
    }
    else
    {
        json =
        {
            title, qq, email, phone, ICP, keywords, desc, status, logo
        };
        await db.update(cfg.setting,{"_id":result[0]._id},json);
    }

    await ctx.redirect(ctx.state.__HOST__ + '/admin/setting');
});

//暴露出模块
module.exports = router.routes();