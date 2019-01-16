//后台管理员页面增删改查
const Router = require('koa-router');
const router = new Router();

//引入DB库 该路径是相对本脚本存放路径
//上一级路径用../
const db = require('../../model/db');
const tools = require('../../model/tools');
const cfg = require('../../model/config');

/* ---------------------------------------------- */

router.get('/',async (ctx)=>{
    // ctx.body = "用户首页";
    let result = await db.find(cfg.admin,{});
    //渲染数据
    await ctx.render('admin/manager/list',
        {
            list : result,
            cfg : cfg.admin
        }
    );
});

router.get('/add',async (ctx)=>{
    // ctx.body = "用户增加";
    await ctx.render('admin/manager/add');
});

//执行添加管理员
router.post('/doAdd', async (ctx)=>{
    //1.获取表单提交过来的数据
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;



    //ctx.request.body必须配置bodyParser中间键
    //console.log(ctx.request.body);

    //2.验证表单数据是否合法
    //正则判断[ 4-20 位长度]
    if(!/^\w{4,20}$/.test(username))
    {
        await ctx.render('admin/error',{
            wait:3,
            message:'错误:用户名长度必须为4-20位',
            redirect:ctx.state.__HOST__ + '/admin/manager/add',
        });
        return;
    }
    if(password === '')
    {
        await ctx.render('admin/error',{
            wait:3,
            message:'错误:密码不能为空',
            redirect:ctx.state.__HOST__ + '/admin/manager/add',
        });
        return;
    }
    if(password !== rpassword)
    {
        await ctx.render('admin/error',{
            wait:3,
            message:'错误:两次密码输入不一致',
            redirect:ctx.state.__HOST__ + '/admin/manager/add',
        });
        return;
    }
    if(password.length < 6)
    {
        await ctx.render('admin/error',{
            wait:3,
            message:'错误:密码长度至少6位数',
            redirect:ctx.state.__HOST__ + '/admin/manager/add',
        });
        return;
    }

    //3.查询数据库是否存在
    let result = await db.find(cfg.admin,{'username':username});
    if(result.length > 0)
    {
        //如果用户名存在
        await ctx.render('admin/error',{
            wait:3,
            message:'错误:已经存在的管理员ID',
            redirect:ctx.state.__HOST__ + '/admin/manager/add',
        });
        return;
    }
    else
    {
        //4.增加
        let addResult = await db.insert(cfg.admin,
            {
                'username':username,            //用户名
                'password':tools.MD5(password), //密码
                'status':1,                     //状态
                'last_time':'',                 //最后登录时间
                'create_time':new Date()        //创建时间
            }
        );

        //跳转管理员界面
        await ctx.redirect(ctx.state.__HOST__ + '/admin/manager');
    }
});


router.get('/edit',async (ctx)=>{
    // ctx.body = "编辑用户";
    let id = ctx.query.id;
    let result = await db.find(cfg.admin,{"_id":db.GetObjectID(id)});

    if(result.length>0)
    {
        await ctx.render('admin/manager/edit',{
            list : result[0]
        });
    }
    else
    {
        await ctx.render('admin/error',{
            wait:3,
            message:'错误:管理员不存在',
            redirect:ctx.state.__HOST__ + '/admin/manager',
        });
    }
});

//执行编辑管理员
router.post('/doEdit',async (ctx)=>{
    //获取post过来的数据
    //ctx.body = "执行编辑管理员" + ctx.request.body;

    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;
    let id = ctx.request.body.id;//隐藏域的id

    try {


        if(password !== '')
        {
            if(password !== rpassword)
            {
                await ctx.render('admin/error',{
                    wait:3,
                    message:'错误:两次密码输入不一致',
                    redirect:ctx.state.__HOST__ + '/admin/manager/edit?id='+id,
                });
                return;
            }
            if(password.length < 6)
            {
                await ctx.render('admin/error',{
                    wait:3,
                    message:'错误:密码长度至少6位数',
                    redirect:ctx.state.__HOST__ + '/admin/manager/edit?id='+id,
                });
                return;
            }

            //修改密码
            let addResult = await db.update(cfg.admin,
                {
                    "_id":db.GetObjectID(id)
                },
                {
                    'password':tools.MD5(password), //密码
                }
            );
            if(addResult.result.ok === 1)
            {
                await ctx.render('admin/error',{
                    wait:1,
                    message:'成功:完成密码修改,等待跳转......',
                    redirect:ctx.state.__HOST__ + '/admin/manager',
                });
                return;
            }
        }

        //跳转管理员界面
        await ctx.redirect(ctx.state.__HOST__ + '/admin/manager');

    }catch (e) {
        await ctx.render('admin/error',{
            wait:3,
            message:'错误:'+e,
            redirect:ctx.state.__HOST__ + '/admin/manager/edit?id='+id,
        });
    }



});



//暴露出模块
module.exports = router.routes();