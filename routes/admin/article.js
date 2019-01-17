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
    let pageSize = 1;
    let visiblePage = 3;

    let result = await db.find(cfg.admin,{},{},{curPage,pageSize});

    //console.log(result);
    let count = await db.count(cfg.admin,{});

    await ctx.render('admin/article/index',{
        //传输数据到页面显示
        list : result,
        visiblePage:visiblePage,//显示条数
        curPage:curPage,//当前页
        totalPages:Math.ceil(count/pageSize),//总页数 向上取整

    });
});

router.get('/add',async (ctx)=>{
     //ctx.body = "增加文章内容";
    await ctx.render('admin/article/add');
});

//upload对应中间件 pic对应视图的name
router.post('/doAdd', upload.single('pic') , async (ctx)=>{
    ctx.body={
        //返回的文件名 判断ctx.req.file是否存在
        filename:ctx.req.file ? ctx.req.file.filename : '',
        body:ctx.req.body,
    }
});



router.get('/edit',async (ctx)=>{
    // ctx.body = "编辑文章内容";
    await ctx.render('admin/article/edit');
});

//测试路由
router.get('/ueditor',async (ctx)=>{
    ctx.render('admin/article/ueditor');
});


//暴露子路由
module.exports = router.routes();