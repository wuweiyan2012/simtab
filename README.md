# simtab
一个基于jquery开发的tab页插件。

## 支持以下功能：

- 支持手动打开和关闭tab页。
- 支持右键菜单功能。
- 支持tab栏左右滚动。
- 支持tab打开历史记录追溯功能。
- 支持添加tab页打开/关闭/切换事件监听器。
- 兼容chrome、Firefox、IE10+....


## 初始化方法：
```
<!-- 引用代码包 -->
<link rel="stylesheet" href="../jquery.simtab.css"/>
    <script src="../jquery.js"></script>
    <script src="../jquery.simtab.js"></script>


<!-- HTML结构 -->
<header>
    <h3>tab标签页测试</h3>
</header>

<aside>
<ul class="menu">
    <li><a taburl="a.html" tabid="aaaaaaa" tabname="A标签页">A标签页</a></li>
    <li><a taburl="b.html" tabid="bbbbbbb" tabname="B标签页">B标签页</a></li>
    <li><a taburl="c.html" tabid="ccccccc" tabname="C标签页">C标签页</a></li>
    <li><a taburl="c.html" tabid="ddddddd" tabname="D标签页">D标签页</a></li>
</ul>
</aside>

<article>
    <div id="tabs"></div>
</article>

<!-- js代码 -->
<script>
    //初始化调用
    var menutabs = new SimTab("#tabs",{
        defaultTab: { id:"aaaaaaa", name:"A标签页", url:"a.html"},
        onClose: function(){alert("close");},
        onOpen: function(){alert("open");},
        onCloseAll: function(){alert("close all");},
        onActive: function(){alert("active");},
    });

    //点击菜单手动打开tab页
    $(".menu").on("click", "li a", function(){
        menutabs.openTab($(this).attr("tabid"), $(this).attr("taburl"),$(this).attr("tabname"));
    });
</script>


```
