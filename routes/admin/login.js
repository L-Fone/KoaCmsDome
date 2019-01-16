//登录界面

const Router = require('koa-router');
const router = new Router();

//引入验证码
const capthcha = require('svg-captcha');

//引入自定义模块
const md5 = require('../../model/tools');
const db = require('../../model/db');
const cfg = require('../../model/config');


router.get('/',async (ctx)=>{
    //ctx.body = "用户登录";
    await ctx.render('admin/login');
});

router.get('/loginOut',async (ctx)=>{
    //ctx.body = "退出登录";
    //console.log('推出登录');
    ctx.session.userinfo = null;
    await ctx.redirect(ctx.state.__HOST__ + '/admin/login');
});

//接收登录传来的值
router.post('/doLogin',async (ctx)=>{

    //利用bodyParser中间件接收登录post过来的数据
    //console.log(ctx.request.body);
    //做登录
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let code = ctx.request.body.code;//验证码

    //验证码：https://www.npmjs.com/package/svg-captcha
    //1.验证密码是否合法
    //code.toLocaleLowerCase() 转换成小写
    if(code.toLocaleLowerCase() === ctx.session.code.toLocaleLowerCase())
    {
        //必须首先验证用户名和密码是否合法，防止sql注入

        let pass = md5.MD5(password);
        //console.log("加密MD5 => "+pass);

        //2.去数据库匹配
        //md5.MD5();
        let result = await db.find(cfg.admin,{"username":username, "password":md5.MD5(password)});

        //3.成功后，把用户写入session
        if(result.length > 0)
        {
            //console.log('成功');
            ctx.session.userinfo = result[0];
            //更新用户表，改变用户登录时间
            await db.update(cfg.admin,{"_id":db.GetObjectID(result[0]._id)},
                {
                    last_time : new Date()
                }
            );

            await ctx.redirect(ctx.state.__HOST__ + '/admin');
        }
        else
        {
            //console.log('失败');
            //await ctx.redirect('/admin/login');
            await ctx.render('admin/error',{
                wait:3,
                message:'用户名或者密码错误',
                redirect:ctx.state.__HOST__ + '/admin/login'
            });
        }
    }
    else
    {
        // console.log('验证码失败');
        // await ctx.redirect('/admin/login');
        await ctx.render('admin/error',{
            wait:3,
            message:'验证码失败',
            redirect:ctx.state.__HOST__ + '/admin/login'
        });
    }

});

//验证码：https://www.npmjs.com/package/svg-captcha
//生成验证码路由
router.get('/code',async (ctx)=>{
    //ctx.body = '验证码';
    //生成验证码内容 生成方式1
    // let svg = capthcha.create
    // ({
    //     //参数
    //     size: 4, //验证码长度
    //     fontSize:50,//字体大小
    //     width:120,//宽度
    //     height:34,//高度
    //     background:"#cc9966"//背景颜色
    // });
    //加法验证码 生成方式2
    let svg = capthcha.createMathExpr
    ({
        //参数
        size: 4, //验证码长度
        fontSize:50,//字体大小
        width:120,//宽度
        height:34,//高度
        background:"#cc9966"//背景颜色
    });
    //console.log(svg.text);//后端文字
    //保存生成的验证码
    ctx.session.code = svg.text;
    ctx.response.type = 'image/svg+xml'; //固定格式响应头
    ctx.body =svg.data;//前端图片
});



//暴露出模块
module.exports = router.routes();