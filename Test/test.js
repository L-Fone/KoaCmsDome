
var Koa = require('koa'),
    Router = require('koa-router'),
    db = require('../model/db'),
    render = require('koa-art-template'),
    bp = require('koa-bodyparser'),//获取post数据
    path = require('path');

const dirpath = __dirname.replace('Test','views');

var app = new Koa(),
    router = new Router();

render(app,
    {
        root: path.join(dirpath),//模板路径
        extname:'.html',//文件后缀名
        debug:process.env.NODE_EVN !== 'production'//是否开启调试模式
    });

//配置bodyparser提交的中间件
app.use(bp());


router.get('/',async (ctx)=>{
    let result = await db.find('user',{});
    await ctx.render('index',{
        list:result
    });
    //ctx.body = "这是首页";
});

router.get('/add',async (ctx)=>{
    // let result = await db.insert('user',{"name":'zhaoliu666'});
    // ctx.body = "这是首页";
    await ctx.render('add');
});

router.post('/doadd',async (ctx)=>{
   //获取表单提交的数据
    let res = await db.insert('user',ctx.request.body);
    try {
        if(res.result.ok){
            //跳转到首页
            ctx.redirect('/');
        }
    }
    catch (e) {
        console.log(e);
        ctx.redirect('/add');
    }
});

router.get('/edit', async (ctx)=>{
   // let result = await  db.update('user',{'name':'zhaoliu666'},{'name':'666666666'});
   // ctx.body = '更新';
    //通过get传过来的id获取用户信息
    let id = ctx.query.id;
    let data = await db.find('user',{"_id":db.GetObjectID(id)});
    await ctx.render('edit',
        {
            list:data[0]
        });
});

router.post('/doedit',async (ctx)=>{

    let id = db.GetObjectID(ctx.request.body._id);
    let data = await db.find('user',{"_id":id});

    let res = await db.update('user',
        {
            "_id":id
        },
        {
            name:ctx.request.body.name,
            age:ctx.request.body.age,
            sex:ctx.request.body.sex,
        });

    try {
        if(res.result.ok){
            //跳转到首页
            ctx.redirect('/');
        }
    }
    catch (e) {
        console.log(e);
        ctx.redirect('/edit');
    }
});



router.get('/delete', async (ctx)=>{
    // let result = await  db.remove('user',{'name':'666666666'});
    // ctx.body = '删除';
    let id = db.GetObjectID(ctx.query.id);
    let data = await db.remove('user', {"_id":id});
    try {
        if(data.result.ok){
            //跳转到首页
            ctx.redirect('/');
        }
    }
    catch (e) {
        console.log(e);
        ctx.redirect('/');
    }
});







app.use(router.routes()).use(router.allowedMethods()).listen(8080);



