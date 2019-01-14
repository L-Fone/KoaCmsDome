//新闻分类的增删改查



//引入
const Router = require('koa-router');
const router = new Router();

router.get('/',async (ctx)=>{
    ctx.body = "新闻分类首页";
});

router.get('/add',async (ctx)=>{
    ctx.body = "增加新闻分类";
});

router.get('/edit',async (ctx)=>{
    ctx.body = "编辑新闻分类";
});

router.get('/delete',async (ctx)=>{
    ctx.body = "删除新闻分类";
});


//暴露子路由
module.exports = router;