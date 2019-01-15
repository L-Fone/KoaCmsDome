
var md5 = require('md5');

let tools =
    {
        getPostData(ctx) {
            //异步获取数据
            return new Promise(function (resolve, reject) {
                try {
                    let str = '';
                    ctx.req.on('data', (chuck) => {
                        str += chuck;
                    });
                    ctx.req.on('end', () => {
                        resolve(str);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        },

        MD5(str)
        {
            return md5(str);
        },
    };

//暴露出方法
module.exports = tools;