
//用户管理界面成员列表状态按钮事件


//前台jq声明
var app =
    {
        //参数1：元素; 参数2：表名; 参数3：要改变的属性; 参数4：表单查询id
        toggle:function (el, collectionName, attr, id)
        {
            //Ajax 请求
            $.get('/admin/changeStatus', {collectionName:collectionName, attr:attr, id:id},
                function (data)
                {
                    if(data.success)
                    {
                        if(el.src.indexOf('yes') != -1)
                        {
                            el.src = '/admin/images/no.gif';
                        }
                        else
                        {
                            el.src = '/admin/images/yes.gif';
                        }
                    }
                }
            )
        }
    };