
const md5 = require('md5');

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

        //MD5加密
        MD5(str)
        {
            return md5(str);
        },

        //把json串转成固定格式的list
        cateToList(data)
        {
            //console.log(result);

            //获取一级分类
            let firstArr=[];
            for (var i=0; i<data.length; i++)
            {
                if(data[i].pid === '0')
                {
                    //取到1级分类
                    firstArr.push(data[i]);
                }
            }

            //获取二级分类
            for (var i=0; i<firstArr.length; i++)
            {
                firstArr[i].list = [];

                for (j=0; j<data.length; j++)
                {
                    if(data[j].pid == firstArr[i]._id)
                    {
                        firstArr[i].list.push(data[j]);
                    }
                }
            }
            return firstArr;
        },

    };

//暴露出方法
module.exports = tools;