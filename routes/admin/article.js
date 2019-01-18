//文章内容管理


//引入
const Router = require('koa-router');
const router = new Router();
const multer = require('koa-multer');//文件上传模块

//引入自定义模块
const db = require('../../model/db');
const cfg = require('../../model/config');
const tools = require('../../model/tools');

/* ----------------配置文件上传中间件--------------------------- */
const storage = multer.diskStorage({
   destination:function (req, file, cb) {
       //配置上传文件的目录[上传的目录必须存在]
       cb(null,'public/upload');
   } ,
    filename: function (req,file,cb) {
        //上传的文件重命名 Date.now()当前时间戳
       let fileFormat = (file.originalname).split('.');
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length-1]);
    }
});
const upload = multer({storage:storage});



/* ----------------------------------------- */


router.get('/',async (ctx)=>{
     //ctx.body = "文章内容首页";

    let curPage = ctx.query.page || 1;
    let pageSize = 8;
    let visiblePage = 5;

    let result = await db.find(cfg.article,{},{},
        {
            page:curPage,
            pageSize:pageSize,
            sort:{ "edit_time":-1, }
        });

    //console.log(result);
    let count = await db.count(cfg.article,{});

    await ctx.render('admin/article/index',{
        //传输数据到页面显示
        list : result,
        cfg:cfg.article,
        visiblePage:visiblePage,//显示条数
        curPage:curPage,//当前页
        totalPages:Math.ceil(count/pageSize),//总页数 向上取整

    });
});

router.get('/add',async (ctx)=>{
     //ctx.body = "增加文章内容";

    //1.查询分类数据
    let articlelist = await db.find(cfg.articlecate,{});


    await ctx.render('admin/article/add',{
        //把查询到的文章分类数据渲染到前台
        articlelist : tools.cateToList(articlelist)
    });
});

//upload对应中间件 pic对应视图的name
router.post('/doAdd', upload.single('img_url') , async (ctx)=>{
    //获取到的所有文章数据
    // ctx.body={
    //     //返回的文件名 判断ctx.req.file是否存在
    //     filename:ctx.req.file ? ctx.req.file.filename : '',
    //     body:ctx.req.body,
    // };
    let pid = ctx.req.body.pid;//pid
    let catename = ctx.req.body.catename;//文章分类名
    let title = ctx.req.body.title || '';//文章标题
    let author = ctx.req.body.author || 'L-Fone';//文章作者
    let status = ctx.req.body.status;//审核状态
    let isbest = ctx.req.body.isbest;//是否精品
    let ishot = ctx.req.body.ishot;//是否热销
    let isnew = ctx.req.body.isnew;//是否新品
    let keywords = ctx.req.body.keywords || '';//搜索关键字
    let desc = ctx.req.body.desc || '';//文章描述
    let content = ctx.req.body.content || '';//正文内容
    let img = ctx.req.file ? "upload/"+ctx.req.file.filename : '';//文章图片
    let add_time = new Date();
    let edit_time = new Date();

    //属性的简写
    let json =
        {
            pid, catename, title, author, status, isbest, ishot, isnew, keywords, desc, content, img, add_time, edit_time
        };
    //ctx.body=json;

    //写入数据
    let result = await db.insert(cfg.article, json);

    await ctx.redirect(ctx.state.__HOST__ + '/admin/article');
});


//编辑
router.get('/edit',async (ctx)=>{

    //编辑
    let id = ctx.query.id;

    let catelist = await db.find(cfg.articlecate,{});

    //获取当前要编辑的数据
    let articlelist = await db.find(cfg.article,{"_id":db.GetObjectID(id)});

    await ctx.render('admin/article/edit',{
        articlelist:tools.cateToList(catelist),
        list:articlelist[0],
        prevPage: ctx.state.G.prevPage,//保存上一次打开的页面
    })

});


//保存编辑内容
router.post('/doEdit', upload.single('img_url') , async (ctx)=>{
    //获取到的所有文章数据
    // ctx.body={
    //     //返回的文件名 判断ctx.req.file是否存在
    //     filename:ctx.req.file ? ctx.req.file.filename : '',
    //     body:ctx.req.body,
    // };
    let id = ctx.req.body.id;
    let pid = ctx.req.body.pid;//pid
    let catename = ctx.req.body.catename;//文章分类名
    let title = ctx.req.body.title || '';//文章标题
    let author = ctx.req.body.author || 'L-Fone';//文章作者
    let status = ctx.req.body.status;//审核状态
    let isbest = ctx.req.body.isbest;//是否精品
    let ishot = ctx.req.body.ishot;//是否热销
    let isnew = ctx.req.body.isnew;//是否新品
    let keywords = ctx.req.body.keywords || '';//搜索关键字
    let desc = ctx.req.body.desc || '';//文章描述
    let content = ctx.req.body.content || '';//正文内容
    let img = ctx.req.file ? "upload/"+ctx.req.file.filename : '';//文章图片
    let edit_time = new Date();

    if(img)
    {
        var json =
            {
                //属性的简写
                pid, catename, title, author, status, isbest, ishot, isnew, keywords, desc, content, img, edit_time
            };
    }
    else
    {
        var json =
            {
                //属性的简写
                pid, catename, title, author, status, isbest, ishot, isnew, keywords, desc, content, edit_time
            };
    }

    //ctx.body=json;

    //写入数据
    let result = await db.update(cfg.article, {"_id":db.GetObjectID(id)}, json);

    await ctx.redirect(ctx.req.body.prevPage ? ctx.req.body.prevPage : ctx.state.__HOST__ + '/admin/article');
});





//暴露子路由
module.exports = router.routes();