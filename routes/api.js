//api接口路由

//引入
const Router = require('koa-router');
const router = new Router();

router.get('/',async (ctx)=>{
    ctx.body = "API接口";
});

router.get('/newslist',async (ctx)=>{
    ctx.body = "这是一个新闻列表接口";
});

router.get('/focus',async (ctx)=>{
    ctx.body = "这是一个轮播图Api";
});



//暴露子路由
module.exports = router.routes();