
const md5 = require('md5');
const multer = require('koa-multer');//文件上传模块
const fs = require('fs');
const path = require('path');

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

        GetAllParentObj(list)
        {
            let arr = [];
            for (var i = 0; i < list.length; i++) {
                let json = {'_id':list[i]._id.toString()};
                let json2 = {'pid':list[i]._id.toString()};
                arr.push(json);
                arr.push(json2);
            }
            return arr;
        },


        //图片上传的公共方法
        myMulter(dir)
        {
            const storage = multer.diskStorage({
                destination:function (req, file, cb)
                {
                    let targetDir = 'public/' + dir;
                    if(!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir);
                    }
                    //配置上传文件的目录[上传的目录必须存在]
                    cb(null,targetDir);
                } ,
                filename: function (req,file,cb) {
                    //上传的文件重命名 Date.now()当前时间戳
                    let fileFormat = (file.originalname).split('.');
                    cb(null, Date.now() + '.' + fileFormat[fileFormat.length-1]);
                }
            });
            const upload = multer({storage:storage});
            return upload;
        },

        multerSingle(dir,str)
        {
            return this.myMulter(dir).single(str);
        },

        //递归查找目录下所有图片文件
        GetallFileByPath(dir)
        {
            return walk(dir);
        },

        RemoveUsePath(arr, list)
        {
            for (var i = 0; i < list.length; i++) {
                for (var j = 0; j < arr.length; j++) {
                    //如果是id相同的，那么a[ j ].id == b[ i ].id
                    if (arr[ j ] == list[ i ].img || arr[ j ] == list[ i ].logo) {
                        arr.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
            return arr;
        },

        //删除缓存的图片文件
        DeleteCacheImage(arr)
        {
            for (var i = 0; i < arr.length; i++) {
                let path = './public/' +arr[i];
                fs.unlinkSync(path);
            }
        },

    };


var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(walk(file));
        else results.push(file.replace('public/',''))
    });
    return results;
};

//暴露出方法
module.exports = tools;