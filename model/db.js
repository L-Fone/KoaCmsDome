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

    //查找数据传入：表名，查找条件
    find(collectionName, json)
    {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                var result = db.collection(collectionName).find(json);
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