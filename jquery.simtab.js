/**
 * Created by Administrator on 2017/7/20.
 */


(function(win, $){
    'use strict';

    var _DEFAULTS = {
        defaultTab: null,
        onOpen: null,
        onClose: null,
        onCloseAll: null,
        onActive: null,
        moveDistance: 120,
        displayRightMenu: true
    };

    var Tabs = function(el, options){
        this.$container = $(el);
        this.$tabHeader = null;
        this.$tabNavbar = null;
        this.$tabList = null;
        this.options = {};
        this.activeId = null;
        this.activeList = [];
        this.tabNavOffset = 0;
        this.rightSelectId = null;
        this.init(options);
    };

    Tabs.prototype.init = function(options) {
        $.extend(this.options, _DEFAULTS, options);
        this.createTemplate();

        if(this.options.defaultTab != null){
            this.openTab(this.options.defaultTab.id, this.options.defaultTab.url, this.options.defaultTab.name);
        }
    };

    Tabs.prototype.createTemplate = function(){
        var that = this;
        var _html = '<div class="tabs">' +
            '<div class="tab-header">' +
            '<div class="tab-menu"><ul class="menu-list"><li id="menu-closeThis">关闭标签页</li><li id="menu-closeAll">关闭所有标签页</li><li id="menu-closeOther">关闭其他标签页</li></ul></div>' +
            '<div class="nav-arraw"><i class="arraw prev disabled"></i><i class="arraw next disabled"></i></div>' +
            '<div class="tab-nav"><ul class="nav-list"></ul></div>' +
            '</div>' +
            '<div class="tab-content">' +
            '<ul class="tab-list"></ul>' +
            '</div>' +
            '</div>';

        this.$container.append(_html);
        this.$tabHeader = this.$container.find(".tab-header");
        this.$tabNavbar = this.$container.find(".nav-list");
        this.$tabList = this.$container.find(".tab-list");
        this.$tabMenu = this.$container.find(".tab-menu");

        bindEvent.call(this);
    };

    Tabs.prototype.openTab = function(id, url, name){
        if(typeof id != 'string' || typeof url != 'string' || typeof name != 'string') return;

        if(this.activeList.indexOf(id) == -1){

            this.$tabNavbar.append("<li class='nav-item' tabid='" + id + "'><a>" + name + "<i class='tab-close'>×</i></a></li>");
            this.$tabList.append('<li class="tab-item" tabid="' + id +'"><iframe frameborder="0" scrolling="auto" seamless src="' + url +'"></li>');

            //触发tab打开事件。。。
            this.options.onOpen && this.options.onOpen.call(this, id, url, name);
        }

        this.activeTab(id);
    };

    Tabs.prototype.closeTab = function(id){
        if(typeof id != 'string') return;

        this.$tabNavbar.find("li.nav-item[tabid='" + id + "']").remove();
        this.$tabList.find("li.tab-item[tabid='" + id + "']").remove();

        if(this.activeList.indexOf(id) != -1){
            this.activeList.splice(this.activeList.indexOf(id), 1);

            //触发tab关闭事件。。。
            this.options.onClose && this.options.onClose.call(this, id);
        }

        //如果关闭的是当前actvie的tab
        if(this.activeId == id && this.activeList.length > 0){
            this.activeTab(this.activeList[this.activeList.length - 1]);
        }
        //如果关闭的是最后一个tab
        else if(this.activeList.length == 0)
        {
            this.openTab(this.options.defaultTab.id, this.options.defaultTab.url, this.options.defaultTab.name);
        }
    };

    Tabs.prototype.activeTab = function(id){
        if(typeof id != 'string') return;

        var objNav = this.$tabNavbar.find("li.nav-item[tabid='" + id + "']"),
            objTab = this.$tabList.find("li.tab-item[tabid='" + id + "']");

        if(objNav.size() > 0 && objTab.size() > 0){
            if(this.activeList.indexOf(id) != -1){
                this.activeList.splice(this.activeList.indexOf(id),1)
            }
            this.activeList.push(id);
            this.activeId = id;

            this.$tabNavbar.find("li.nav-item").removeClass("active");
            this.$tabList.find("li.tab-item").removeClass("active");

            objNav.addClass("active");
            objTab.addClass("active");

            //触发active事件。。。
            this.options.onActive && this.options.onActive.call(this, id);
        }

        dispNavArrow.call(this);
        adjustTabNav.call(this);
    };

    Tabs.prototype.closeRightMenu = function(){
        this.$tabMenu.css({ height:"0", top:"0", left:0 });
        this.rightSelectId = null;
    };

    var bindEvent = function(){
        var that = this;

        //标签栏tab页点击事件
        this.$tabNavbar.on("click", "li.nav-item", function(){
            that.activeTab($(this).attr("tabid"));
        });

        //标签栏tab页点击close事件
        this.$tabNavbar.on("click", "i.tab-close", function(){
            that.closeTab($(this).closest("li.nav-item").attr("tabid"));
        });

        //标签栏箭头事件
        this.$tabHeader.on("click", ".nav-arraw i.arraw", function(){
            if($(this).hasClass("disabled")) return;
            if($(this).hasClass("prev")){
                that.tabNavOffset = that.tabNavOffset + that.options.moveDistance > 0 ? 0 : that.tabNavOffset + that.options.moveDistance;
                that.$tabNavbar.css("left", that.tabNavOffset + "px");
            }
            else {
                var lastNav = that.$tabNavbar.find("li.nav-item").last()[0];
                if(lastNav.offsetLeft + lastNav.clientWidth - Math.abs(that.tabNavOffset) > that.$tabHeader.width()){
                    that.tabNavOffset = that.tabNavOffset - that.options.moveDistance;
                    that.$tabNavbar.css("left", that.tabNavOffset + "px");
                }
            }
        });

        bindRightMenuEvent.call(this);

    };

    var bindRightMenuEvent = function(){
        if(!this.options.displayRightMenu){ return; }

        var that = this;
        //标签栏右键菜单事件
        this.$tabHeader.on("contextmenu", function(event){
            var srcEl = event.target||event.srcElement;

            that.$tabMenu.css({
                height:"auto",
                left: event.clientX + "px",
                top: event.clientY +"px"
            });

            if(!$(srcEl).hasClass("nav-item") && !$(srcEl).parents().hasClass("nav-item"))
            {
                that.$tabMenu.find("#menu-closeThis").addClass("disabled");
                that.$tabMenu.find("#menu-closeOther").addClass("disabled");
            }else{
                that.$tabMenu.find("#menu-closeThis").removeClass("disabled");
                that.$tabMenu.find("#menu-closeOther").removeClass("disabled");
                that.rightSelectId = $(srcEl).hasClass("nav-item") ?  $(srcEl).attr("tabid") : $(srcEl).closest(".nav-item").attr("tabid");
            }

            return false;
        });

        $(document).on("click contextmenu", function(e){
            that.closeRightMenu();
        });

        //清除当前tab
        this.$tabMenu.find("#menu-closeThis").click(function(){
            if($(this).hasClass("disabled")){return;}

            that.closeTab(that.rightSelectId);
            that.rightSelectId = null;
        });

        //清除其他tab
        this.$tabMenu.find("#menu-closeOther").click(function(){
            if($(this).hasClass("disabled")){return;}

            var tabidList = that.activeList.slice();
            $.each(tabidList, function(){
                if(this == that.rightSelectId){return true;}

                that.closeTab(this);
            });

            that.rightSelectId = null;
        });

        //清除所有tab
        this.$tabMenu.find("#menu-closeAll").click(function(){
            if($(this).hasClass("disabled")){return;}

            var tabidList = that.activeList.slice();
            $.each(tabidList, function(){
                that.closeTab(this);
            });

            that.rightSelectId = null;
            that.options.onCloseAll && that.options.onCloseAll.call(that);
        });
    };

    var adjustTabNav = function(){
        if(this.activeList.length == 0) return;

        var activeNav = this.$tabNavbar.find("li.nav-item[tabid='" + this.activeId + "']")[0];
        var activeOffsetR = (activeNav.offsetLeft + activeNav.clientWidth - Math.abs(this.tabNavOffset)) - this.$tabHeader.width();
        var activeOffsetL = activeNav.offsetLeft - Math.abs(this.tabNavOffset);

        //当前显示tab超出容器右侧显示范围
        if(activeOffsetR > 0){
            this.tabNavOffset = this.tabNavOffset - activeOffsetR;
            this.$tabNavbar.css("left", this.tabNavOffset + "px");
        }

        //当前显示tab超出容器左侧显示范围
        if(activeOffsetL < 0){
            this.tabNavOffset = this.tabNavOffset - activeOffsetL;
            this.$tabNavbar.css("left", this.tabNavOffset + "px");
        }


        var lastNav = this.$tabNavbar.find("li.nav-item").last()[0];
        var lastOffsetR = (lastNav.offsetLeft + lastNav.clientWidth - Math.abs(this.tabNavOffset)) - this.$tabHeader.width();

        //最后一个tab在容器显示范围内，并且nav栏存在偏移
        if(lastOffsetR < (0 - this.options.moveDistance) && this.tabNavOffset != 0){
            this.tabNavOffset = this.tabNavOffset - lastOffsetR > 0 ? 0 : this.tabNavOffset - lastOffsetR;
            this.$tabNavbar.css("left", this.tabNavOffset + "px");
        }
    };

    var dispNavArrow = function(){
        if(this.activeList.length == 0) return;

        var lastNav = this.$tabNavbar.find("li.nav-item").last()[0];

        //如果最后一个tab超出容器显示范围则显示箭头
        if(lastNav.offsetLeft + lastNav.clientWidth > this.$tabHeader.width()){
            this.$tabHeader.find(".nav-arraw i.arraw").removeClass("disabled");
        }else
        {
            this.$tabHeader.find(".nav-arraw i.arraw").addClass("disabled");
        }
    };

    win.SimTab = Tabs;
})(window, jQuery);