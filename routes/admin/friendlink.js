//友情连接的增删改查

const Router = require('koa-router');
const router = new Router();

//引入自定义模块
const db = require('../../model/db');
const cfg = require('../../model/config');
const tools = require('../../model/tools');

/* --------------已经封装到tools里面-------------------------- */
//配置图片上传
// const multer = require('koa-multer');//文件上传模块
// const storage = multer.diskStorage({
//     destination:function (req, file, cb) {
//         //配置上传文件的目录[上传的目录必须存在]
//         cb(null,'public/upload/friendlink/');
//     } ,
//     filename: function (req,file,cb) {
//         //上传的文件重命名 Date.now()当前时间戳
//         let fileFormat = (file.originalname).split('.');
//         cb(null, Date.now() + '.' + fileFormat[fileFormat.length-1]);
//     }
// });
// const upload = multer({storage:storage});



/* ---------------------------------------- */

router.get('/',async (ctx)=>{
    // ctx.body = "友情连接首页";

    //查询轮播图
    let curPage = ctx.query.page || 1;
    let pageSize = 8;
    let visiblePage = 5;

    let result = await db.find(cfg.friendlink,{},{},
        {
            page:curPage,
            pageSize:pageSize,
            sort:{ "add_time":-1, }
        });

    //console.log(result);
    let count = await db.count(cfg.friendlink,{});

    await ctx.render('admin/friendlink/index',{
        list:result,
        cfg:cfg.friendlink,
        visiblePage:visiblePage,//显示条数
        curPage:curPage,//当前页
        totalPages:Math.ceil(count/pageSize),//总页数 向上取整
    });
});

router.get('/add',async (ctx)=>{
    // ctx.body = "友情连接增加";
    await ctx.render('admin/friendlink/add');
});


//配置上传图片
router.post('/doAdd', tools.multerSingle(cfg.friendlinkDir,'imgFile') , async (ctx)=>{

    /* 注意： 要上传文件，必须要在模板html文件中配置 class */

    //接收过来的数据
    // ctx.body={
    //     filename:ctx.req.file? ctx.req.file.filename:'',
    //     body:ctx.req.body
    // }

    //{"filename":"1547816256064.jpg","body":{"title":"312321","imgurl":"3213","sort":"21312","status":"1"}}
    let title = ctx.req.body.title || '';
    let linkurl = ctx.req.body.linkurl || '';
    let sort = ctx.req.body.sort || '0';
    let status = ctx.req.body.status;
    let img = ctx.req.file ? cfg.friendlinkDir+ctx.req.file.filename : '';//文章图片

    let add_time = new Date();

    let json =
        {
            title, linkurl, img, sort, status, add_time
        };

    //写入数据
    let result = await db.insert(cfg.friendlink, json);

    await ctx.redirect(ctx.state.__HOST__ + '/admin/friendlink');
});




router.get('/edit',async (ctx)=>{
    // ctx.body = "编辑友情连接";
    //获取传值
    let id = ctx.query.id;

    let result = await db.findByID(cfg.friendlink, id);


    await ctx.render('admin/friendlink/edit',{
        list : result[0],
        prevPage: ctx.state.G.prevPage,//保存上一次打开的页面
    });
});


//执行编辑数据
router.post('/doEdit', tools.multerSingle(cfg.friendlinkDir, 'imgFile') ,async (ctx)=>{

    let id = ctx.req.body.id;
    let title = ctx.req.body.title || '';
    let linkurl = ctx.req.body.linkurl || '';
    let sort = ctx.req.body.sort || '0';
    let status = ctx.req.body.status;
    let img = ctx.req.file ? cfg.friendlinkDir + ctx.req.file.filename : '';//文章图片


    let json = {};
    if(img)
    {
        json = { title, linkurl, img, sort, status }
    }
    else
    {
        json = { title, linkurl, sort, status }
    }

    //写入数据
    let result = await db.update(cfg.friendlink,{"_id": db.GetObjectID(id)}, json);

    await ctx.redirect(ctx.req.body.prevPage ? ctx.req.body.prevPage : ctx.state.__HOST__ + '/admin/friendlink');


});



//暴露出模块
module.exports = router.routes();