//mongodb封装库

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const Config = require('./config.js');

class DB
{
    static GetInstance()
    {
        if(!DB._instence)
        {
            DB._instence = new DB();
        }
        return DB._instence;
    }

    constructor()
    {
        //储存DB对象
        this._dbclient = '';
        //初始化时，连接数据库
        this.connect();
    }

    //连接数据库
    connect()
    {
        return new Promise((resolve, reject)=>{
            //如果db对象不存在 避免数据库多次连接
            if(!this._dbclient)
            {
                //执行连接数据库
                MongoClient.connect(Config.dbUrl,{useNewUrlParser: true},(err, client)=>{
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        this._dbclient = client.db(Config.dbName);
                        resolve(this._dbclient);
                    }
                });
            }
            else
            {
                resolve(this._dbclient);
            }
        });
    }

    /*
    *  db.find('user',{}) //返回所有数据
    *  db.find('user',{},{'title':1})//返回所有数据，只返回指定的这一列
    *  db.find('user',{},{'title':1},{ page:n, pageSize:m }) //返回第n页开始的m个数据，并且是指定列
    *
    *  js中实参和形参可以不一样
    *  arguments对象接收实参传过来的数据
    *
    * */

    //查找数据传入：表名，查找条件
    find(collectionName, json1, json2, json3)
    {
        let attr = {};
        let slipNum = 0;
        let pageSize = 0;
        if(arguments.length === 2)
        {
        }
        else if(arguments.length === 3)
        {
            attr = json2;
        }
        else if(arguments.length === 4)
        {
            attr = json2;
            let starPage = json3.page || 1;
            pageSize = json3.pageSize || 20;
            slipNum = (starPage-1)*pageSize;
        }
        else
        {
            console.log('传入参数错误');
        }

        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                //db.collection(collectionName).find(json,(error,result)=>{
                let result = db.collection(collectionName).find(json1,{files:attr}).skip(slipNum).limit(pageSize);

                result.toArray((err, doc)=>
                {
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        resolve(doc);
                    }
                });
            });
        });
    }

    update(collectionName,oldJson,newJson)
    {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
               db.collection(collectionName).updateOne(oldJson,
                   {
                        $set:newJson
                   },
                   (err,result)=>{
                        if(err)
                        {
                            reject(err);
                        }
                        else
                        {
                            resolve(result);
                        }
                   }
               );
            });
        });
    }

    insert(collectionName,json)
    {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                //增加数据
                db.collection(collectionName).insertOne(json,(err,result)=>{
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        resolve(result);
                    }
                });
            });
        });
    }

    remove(collectionName, json)
    {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json, (err,result)=>{
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        resolve(result);
                    }
                });
            });
        });
    }

    count(collectionName, json)
    {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).countDocuments(json, (err,result)=>{
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        resolve(result);
                    }
                });
            });
        });
    }

    GetObjectID(id)
    {
        //把字符串ID转换成objectID
        return new ObjectID(id);
    }

}

//暴露接口
module.exports = DB.GetInstance();

//测试
// var mydb = DB.GetInstance();
//
// setTimeout(()=>{
//     console.time('time1');
//     mydb.find('user',{}).then((data)=>{
//         //console.log(data);
//         console.timeEnd('time1');
//     });
// },3000);
//
// setTimeout(()=>{
//     console.time('time2');
//     mydb.find('user',{}).then((data)=>{
//         //console.log(data);
//         console.timeEnd('time2');
//     });
// },5000);
//
// setTimeout(()=>{
//     console.time('time3');
//     mydb.find('user',{}).then((data)=>{
//         //console.log(data);
//         console.timeEnd('time3');
//     });
// },7000);
//
// setTimeout(()=>{
//     console.time('time4');
//     mydb.find('user',{}).then((data)=>{
//         //console.log(data);
//         console.timeEnd('time4');
//     });
// },9000);