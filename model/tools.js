


//暴露出方法
exports.getPostData = function (ctx)
{
    //异步获取数据
    return new Promise(function (resolve, reject)
    {
        try {
            let str = '';
            ctx.req.on('data',(chuck)=> {
                str+=chuck;
            });
            ctx.req.on('end',()=>{
                resolve(str);
            });
        }catch (e) {
            reject(e);
        }
    });
};