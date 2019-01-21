//配置文件


var app =
    {
        dbUrl : 'mongodb://localhost:27017',//数据库地址
        dbName : 'koa',//数据库名称
        admin:'admin',//[管理员]表单名称
        articlecate:'articlecate',//[分类列表]表单名
        article:'article',//[文章内容]表单名
        focus:'focus',//[轮播图]表单名
        friendlink:'friendlink',//[友情连接]表单名
        nav:'nav',//[导航标题]表单名
        setting:'setting',//[系统设置]表单名

        articleDir:'upload/article/',//[文章内容]文件存放路径
        focusDir:'upload/focus/',//[轮播图]文件存放路径
        friendlinkDir:'upload/friendlink/',//[友情连接]文件存放路径
        logoDir:'upload/logo/',//[网站logo]文件存放路径

        multerPath:'',
    };


//暴露模块
module.exports = app;