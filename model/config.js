//配置文件


var app =
    {
        dbUrl : 'mongodb://localhost:27017',//数据库地址
        dbName : 'koa',//数据库名称
        admin:'admin',//[管理员]表单名称
        articlecate:'articlecate',//[分类列表]表单名
        article:'article'//[文章内容]表单名
    };


//暴露模块
module.exports = app;