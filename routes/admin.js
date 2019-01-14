

//引入
const Router = require('koa-router');
const router = new Router();

//引入子路由
const user = require('./admin/user');
const focus = require('./admin/focus');
const newscate = require('./admin/newscate');

//配置子路由
router.use('/user',user.routes());
router.use('/focus',focus.routes());
router.use('/newscate',newscate.routes());

/* -----------------------------------------------------*/

router.get('/',async (ctx)=>{
    ctx.body = "后台管理首页";
});

router.get('/user',async (ctx)=>{
    ctx.body = "用户管理";
});

router.get('/focus',async (ctx)=>{
    ctx.body = "轮播图管理";
});

router.get('/news',async (ctx)=>{
    ctx.body = "新闻管理";
});


//暴露子路由
module.exports = router;