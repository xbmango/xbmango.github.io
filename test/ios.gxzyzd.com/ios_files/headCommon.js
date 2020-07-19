// 依赖JQUERY
var common = {
    /**
     * 数据服务器地址
     */
    // dataServers:"http://114.55.33.209/",
    dataServers: "https://m.i4.cn",
    /**
     * httpbox地址
     */
    httpboxUrl: "http://d.image.i4.cn/pages/httpbox/httpbox.html",
    // httpboxUrl: "https://ios.gxzyzd.com/httpbox/httpbox.html",
    /**
     * 底部弹出菜单 Popbom 2017.11.22
     * @type 1为id，2为body
     * var obj = { 
     *      n:3,
     *      target:{ name:'body', type:2 },
     *		list:[
     *          { name:'保存到相册', url:"" },
     *			{ name:'查看壁纸教程', url:"" },
     *			{ name:'发送到微信', url:"" },
     *			{ name:'发送到QQ', url:"" }
     *		]
     *	}
     */
    Popbom: function(obj) {

        var bg_mask = document.createElement('div');
        var menu_bottom = document.createElement('div');
        bg_mask.className = 'bg_mask';
        menu_bottom.className = 'menu_bottom';
        var _this = this;

        // 移除方法
        this.remove = function() {
            $(bg_mask).css("opacity", 0);
            setTimeout(function() {
                $(bg_mask).remove();
            }, 600);
        }

        // 操作按钮
        for (var i = 0; i < obj.list.length; i++) {
            var oA = document.createElement('a');
            oA.href = obj.list[i].url;
            oA.innerHTML = obj.list[i].name;
            if (obj.list[i].clickFunc) {
                oA.onclick = obj.list[i].clickFunc;
            }
            menu_bottom.appendChild(oA);
        }
        // 取消按钮
        var continueButton = document.createElement('a');
        continueButton.innerHTML = "取消";
        menu_bottom.appendChild(continueButton);
        continueButton.onclick = this.remove;

        bg_mask.appendChild(menu_bottom);
        switch (obj.target.type) {
            case 1:
                document.getElementById(obj.target.name).appendChild(bg_mask);
            case 2:
                document.body.appendChild(bg_mask);
        }
        bg_mask.style.display = "block";

        return this;
    },

    /**
     * 初始化一个日期选择器
     * @options         日期选择器初始化参数
     */
    datepicker: function(options) {
        var _this = this;
        this.timer = null;

        this.defaultOptions = {
            defaultDate: {
                year: 1990,
                month: 1,
                day: 1,
            },
            okCallback: null
        };
        this.options = $.extend({}, this.defaultOptions, options);
        this.date = {
            year: this.options.defaultDate.year,
            month: this.options.defaultDate.month,
            day: this.options.defaultDate.day,
        };

        // HTML
        this.dom = $('<div class="bg_mask">' +
            '<div class="datepicker">' +
            '<div class="datepicker-title">' +
            '<a href="javascript:;" class="datepicker-close">取消</a>' +
            '<a href="javascript:;" class="datepicker-ok">确定</a>' +
            '</div>' +
            '<div class="datepicker-body">' +
            '<div class="datepicker-body-group datepicker-body-year"><div class="datepicker-body-select"></div></div>' +
            '<div class="datepicker-body-group datepicker-body-month"><div class="datepicker-body-select"></div></div>' +
            '<div class="datepicker-body-group datepicker-body-day"><div class="datepicker-body-select"></div></div>' +
            '<div class="datepicker-body-view"></div>' +
            '</div>' +
            '</div>' +
            '</div>');
        for (var i = 1901; i <= 2049; ++i) {
            this.dom.find('.datepicker-body-year .datepicker-body-select').append('<div class="datepicker-body-item">' + i + '</div>');
        }
        for (var j = 1; j <= 12; ++j) {
            this.dom.find('.datepicker-body-month .datepicker-body-select').append('<div class="datepicker-body-item">' + (j < 10 ? "0" + j : j) + '</div>');
        }
        for (var k = 1; k <= 31; ++k) {
            this.dom.find('.datepicker-body-day .datepicker-body-select').append('<div class="datepicker-body-item">' + (k < 10 ? "0" + k : k) + '</div>');
        }
        $('body').append(this.dom);
        // 禁止背景滚动
        // document.getElementsByClassName('bg_mask')[0].addEventListener('touchmove', function(event) {
        //     event.preventDefault();
        // });
        this.dom.show();

        // 判断指定年份是否为闰年
        this.isleap = function(year) {
            year = parseInt(year);
            return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
        }

        // 移除事件
        this.remove = function() {
            _this.dom.css("opacity", 0);
            setTimeout(function() {
                _this.dom.remove();
            }, 600);
        };

        // console.log($('.datepicker-body-year').find('.datepicker-body-item').length);
        // $dom     需要滚动的盒子
        // childY   滚动到第几个元素 0为第一个元素
        this.moveTo = function($dom, childY) {
            if ($dom.hasClass('datepicker-body-year')) {
                childY = Math.min(Math.max(childY, 0), 148);
                _this.date.year = childY + 1901 + "";
                _this.leap = this.isleap(_this.date.year);
                if (_this.date.month == "02") {
                    if (_this.date.day == "29" ||
                        _this.date.day == "30" ||
                        _this.date.day == "31") {
                        _this.moveTo($(".datepicker-body-day"), _this.leap ? 28 : 27);
                    }
                }
            } else if ($dom.hasClass('datepicker-body-month')) {
                childY = Math.min(Math.max(childY, 0), 11);
                _this.date.month = childY < 9 ? "0" + (childY + 1) : childY + 1 + "";
                if (_this.date.month == "02") {
                    if (_this.date.day == "29" ||
                        _this.date.day == "30" ||
                        _this.date.day == "31") {
                        _this.moveTo($(".datepicker-body-day"), _this.leap ? 28 : 27);
                    }
                }
                if (_this.date.month == "04" ||
                    _this.date.month == "06" ||
                    _this.date.month == "09" ||
                    _this.date.month == "11") {
                    if (_this.date.day == "31") {
                        _this.moveTo($(".datepicker-body-day"), 29);
                    }
                }
            } else if ($dom.hasClass('datepicker-body-day')) {
                childY = Math.min(Math.max(childY, 0), 30);
                if (_this.date.month == "02") {
                    childY = Math.min(childY, _this.leap ? 28 : 27);
                }
                if (_this.date.month == "04" ||
                    _this.date.month == "06" ||
                    _this.date.month == "09" ||
                    _this.date.month == "11") {
                    childY = Math.min(childY, 29);
                }
                _this.date.day = childY < 9 ? "0" + (childY + 1) : childY + 1 + "";
            }
            var top = Math.min(Math.max(childY, 0), $dom.find('.datepicker-body-item').length - 1) * 84 + 162;
            // $dom.animate({ "scrollTop": top }, 100);
            $dom.scrollTop(top);
        };

        // 校准位置
        this.calibration = function($dom) {
            var $this = $(this);
            if ($this.timer) {
                clearTimeout($this.timer);
            }
            $this.timer = setTimeout(function() {
                var t = $dom.scrollTop() - 162;
                _this.moveTo($dom, parseInt(t / 84) + (t % 84 > 42 ? 1 : 0));
            }, 100);
        }

        // 关闭事件
        $('.datepicker-close').click(function() {
            _this.remove();
        });

        $('.datepicker-ok').click(function() {
            _this.options.okCallback && _this.options.okCallback();
            _this.remove();
        });

        // 默认值
        this.moveTo($(".datepicker-body-year"), parseInt(this.options.defaultDate.year) - 1901);
        this.moveTo($(".datepicker-body-month"), parseInt(this.options.defaultDate.month) - 1);
        this.moveTo($(".datepicker-body-day"), parseInt(this.options.defaultDate.day) - 1);

        this.touchings = [false, false, false];
        // 滚动事件
        $(".datepicker-body-group").scroll(function() {
            if (!_this.touchings[$(this).index()]) {
                _this.calibration($(this));
            }
        });

        // 触摸事件
        $('.datepicker-body-group').on("touchstart", function() {
            _this.touchings[$(this).index()] = true;
        }).on("touchend", function() {
            _this.touchings[$(this).index()] = false;
            _this.calibration($(this));
        });

        return this;
    },


    /**
     * 读Cookie
     * @name    要读取的COOKIE的名称
     */
    getCookie: function(name) { //获取指定名称的cookie的值
        var arrStr = document.cookie.split("; ");
        for (var i = 0; i < arrStr.length; i++) {
            var temp = arrStr[i].split("=");
            if (temp[0] == name) return unescape(temp[1]);
        }
        return null;
    },

    /**
     * 设置cookie的值
     * @cname       需要设定的COOKIE的名称
     * @cvalue      需要设定的COOKIE的值
     * @exsecond    COOKIE多长时间后过期 单位秒 默认关闭浏览器后无效
     */
    setCookie: function(cname, cvalue, exsecond) {
        var expires = '';
        if (exsecond) {
            var d = new Date();
            d.setTime(d.getTime() + ((exsecond || 3600) * 1000));
            expires = "expires=" + d.toGMTString() + ";";
        }
        document.cookie = cname + "=" + escape(cvalue) + "; " + expires + "path=/;";
    },

    /**
     * 删除某个COOKIE
     * @name        要删除的COOKIE的名称
     */
    deleteCookie: function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
        var cval = common.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + escape(cval) + ";expires=" + exp.toGMTString() + ";path=/;";
        }
    },

    /**
     * 提示消息
     * @msg         提示文字
     */
    comPopTips: function(msg) {
        common.removeAllLoad();
        $('.prompt_txt').remove();
        var html = $('<div class="prompt_txt">' + '<span>' + msg + '</span></div>');
        $('body').append(html);

        setTimeout(function() {
            html.fadeOut(500);
            setTimeout(function() {
                html.remove();
            }, 1000);
        }, 1000);
    },

    /**
     * 加载中 提示消息
     * @msg         提示文字
     */
    loadingPopTips: function(msg) {

        common.removeAllLoad();
        var html = '<div class="prompt_txt loadingPopTips">' + '<span><div class="rotateImg">&nbsp;</div>' + msg + '</span></div>';
        $('body').append(html);
        return $(html);
    },

    /**
     * 加载中 提示页面
     */
    loadPage: function(msg) {
        common.removeAllLoad();
        var html = '<img class="loading_png" src="../img/ringtones_list_downloading.png"/*tpa=https://ios.gxzyzd.com/img/ringtones_list_downloading.png*/ width="104" height="104" alt="" />';
        $('body').append(html);
        return $(html);
    },

    /**
     * 加载中 提示页面 黑块方式
     * @notRemoveLoad       不移除其它加载状态
     */
    loadPageBlock: function(notRemoveLoad) {
        if (!notRemoveLoad) {
            common.removeAllLoad();
        }
        var html = '<div class="loadPageBlock">' +
            '<img class="loading_png" src="../img/ringtones_list_downloading_white.png"/*tpa=https://ios.gxzyzd.com/img/ringtones_list_downloading_white.png*/ />' +
            '</div>';
        $('body').append(html);
        return $(html);
    },

    /**
     * 加载数据中 自动判断使用全屏LOADING还是底部LOADING
     * @page            当前页数
     * @obj             当使用底部加载提示时，可能会用到的参数
     */
    loadingState: function(page, tarObj) {
        common.removeAllLoad();
        if (page == 1) {
            common.loadPageBlock();
        } else {
            common.getFooter(tarObj || null, 3);
        }
    },

    /**
     * 显示没有数据界面
     * @context         提示文字
     * @imgSrc          提示图像
     * @top             距离顶部位置
     */
    nodata: function(context, imgSrc, top) {
        common.removeAllLoad();
        setTimeout(function() {
            // 禁止背景滚动
            document.getElementsByClassName('nodata')[0].addEventListener('touchmove', function(event) {
                event.preventDefault();
            });
        }, 100);
        return '<div class="nodata" style="' + (top ? 'top:' + top + 'px' : '') + '"><img src="' + (imgSrc || "/img/nodate_default.png") + '" /><p>' + (context || "暂无数据") + '</p></div>';
    },

    /**
     *  调用  tarObj  插入状态的目标dom的id，以及状态码
     * @errorClickEvent     加载失败的点击事件
     * @n                   类型
     * @txt                 提示文字
     */
    getFooter: function(tarObj, n, errorClickEvent, txt) {
        common.removeAllLoad();
        var footer = document.createElement('div');
        footer.className = 'footer';
        if (n == 2) {
            var btn = document.createElement('a');
            btn.href = "javascript:;";
            btn.className = "loading";
            btn.setAttribute('onclick', errorClickEvent);
            // btn.onclick = errorClickEvent;
            btn.innerHTML = txt || "网络不给力，请点击重试";
            footer.appendChild(btn);
            // footer.innerHTML = '<a href="javascript:;" class="loading" onclick="rePromiseData()"></a>';
        } else if (n == 3) {
            footer.innerHTML = '<p class="loading" href="javascript:;">' + (txt || "正在加载数据...") + '</p>';
        } else if (n == 4) {
            footer.innerHTML = '<p class="theend"><span style="background-color:' + ($('body').css('backgroundColor')) + '">' + (txt || "没有更多数据了") + '</span></p>';
        }

        if (tarObj !== null) {
            var objId = document.getElementById(tarObj);
            document.body.insertBefore(footer, objId);
        } else {
            document.body.appendChild(footer);
        }
    },

    /**
     * 移除所有加载相关的元素
     */
    removeAllLoad: function() {
        $('.loadPageBlock').remove();
        $('.loading_png').remove();
        $('.prompt_txt').remove();
        $('.footer').remove();
        $('.nodata').remove();

    },

    /**
     * 提示窗
     * @options         参数
     */
    popWindow: function(options) {
        var $html = $('<div class="bg_mask">' +
            '<div class="popups">' +
            '<div class="popups_txt">' +
            (options.title ? '<h3 class="tit">' + options.title + '</h3>' : '') +
            (options.content ? '<p class="content">' + options.content + '</p>' : '') +
            '</div>' +
            '</div>' +
            '</div>');
        $('body').append($html);

        if (options.buttons && options.buttons.length > 0) {
            for (var i = 0; i < options.buttons.length; ++i) {
                var $btn = $('<a href="' + (options.buttons[i].href || "javascript:;") + '" class="' + (options.buttons[i].className || "popups_btn_focus") + '">' + (options.buttons[i].txt || "") + '</a>');
                $html.find('.popups').append($btn);
                if (options.buttons[i].clickEvent) {
                    $btn.on('click', options.buttons[i].clickEvent);
                }
            }
        }
        $html.show();
        return $html;
    },

    /**
     * 带一个确定按钮的提示窗
     * @title         标题
     * @content       内容
     * @okClickEvent  确定按钮点击事件
     */
    popWindowOk: function(title, content, okClickEvent) {
        if (typeof title == "string") {
            options = {
                title: title,
                content: content,
                okClickEvent: okClickEvent,
            };
        } else {
            options = title;
        }
        var pw = common.popWindow({
            title: options.title || "",
            content: options.content || "",
            buttons: [{
                className: "ok popups_btn_focus button_skin",
                txt: options.btnTxt || "确定",
                clickEvent: function() {
                    pw.remove();
                    options.okClickEvent && options.okClickEvent();
                },
            }],
        });
        return pw;
    },

    /**
     * 文字提示窗
     * 带取消与确定按钮
     */
    PopTxt: function(obj) {
        var bg_mask = document.createElement('div');
        var popups = document.createElement('div');
        var popups_txt = document.createElement('div');
        var popups_btn = document.createElement('div');
        bg_mask.className = 'bg_mask';
        bg_mask.id = 'bg_mask';
        popups.className = 'popups';
        popups_txt.className = 'popups_txt';
        popups_btn.className = 'popups_btn';

        if (obj.tit !== undefined && obj.tit !== '') {
            var H3 = document.createElement('h3');
            H3.innerHTML = obj.tit;
            popups_txt.appendChild(H3);
        }

        if (obj.content !== undefined && obj.content !== '') {
            var P = document.createElement('p');
            P.className = 'popups_txt_left';
            P.innerHTML = obj.content;
            popups_txt.appendChild(P);
        }

        if (obj.btnD !== undefined && obj.btnD !== '') {
            var A = document.createElement('a');
            A.className = 'popups_btn_banner popups_btn_disab';
            A.href = obj.btnD['href'];
            A.innerHTML = obj.btnD['txt'];
            popups_btn.appendChild(A);
        }

        if (obj.btnL !== undefined && obj.btnL !== '') {
            var A = document.createElement('a');
            A.className = 'popups_btn_left';
            A.innerHTML = obj.btnL || "取消";
            if (obj.btnLClickCallback) {
                $(A).on('click', function() {
                    obj.btnLClickCallback();
                    close_bg_mask();
                });
            } else {
                A.setAttribute('onclick', 'close_bg_mask()');
            }
            popups_btn.appendChild(A);
        }

        if (obj.btnR !== undefined && obj.btnR !== '') {
            var A = document.createElement('a');
            A.className = 'popups_btn_focus';
            A.innerHTML = obj.btnR['txt'] || "确定";

            if (obj.btnR['callback'] == undefined || obj.btnR['callback'] == "" || obj.btnR['callback'] == null) {
                // console.log("无回调函数");
            } else {
                A.setAttribute(obj.btnR['event'], obj.btnR['callback']);
            }
            if (obj.btnR['clickCallback']) {
                $(A).click(obj.btnR['clickCallback']);
            }

            if (obj.btnR['url'] == undefined || obj.btnR['url'] == "" || obj.btnR['url'] == null) {
                // console.log("无href");
            } else {
                A.href = obj.btnR['url'];
            }
            popups_btn.appendChild(A);
        }

        popups.appendChild(popups_txt);
        popups.appendChild(popups_btn);
        bg_mask.appendChild(popups);
        document.body.appendChild(bg_mask);

        bg_mask.style.display = "block";

        /*关闭弹窗*/
        close_bg_mask = function() {
            var o = document.getElementById('bg_mask');
            o.remove();
        }

        function jt(event) {
            event.preventDefault();
        }
        /*监听弹窗 添加屏幕禁止滑动滑动事件*/
        bg_mask.addEventListener('touchmove', jt);
        return $(bg_mask);
    },

    /**
     * 需要登录提示窗
     */
    loginPopTxt: function() {
        common.PopTxt({
            tit: '你还未登录或登录超时',
            btnL: '取消',
            btnR: {
                txt: "确定",
                url: "javascript:;",
                clickCallback: function() {
                    common.toLogin();
                }
            }
        });
    },

    /**
     * 验证码弹窗框
     */
    captchaPopWindow: function(source, username, okCallback) {
        $('.bg_mask').remove();
        var $html = $(`<div class="bg_mask">
            <div class="popups">
                <div class="popups_txt">
                    <h3>请输入图片中的验证码</h3>
                </div>
                <form id="captchaPopWindowForm" action="">
                    <div class="popups_captcha">
                        <img class="imageCode" src="" />
                        <a href="javascript:;" class="captchaRefresh">&nbsp;</a>
                    </div>
                    <div class="form-box">
                        <div class="form-item">
                            <input type="text" maxlength="4" name="captcha" />
                        </div>
                    </div>
                    <div class="popups_btn">
                        <a href="javascript:;" class="popups_btn_left">取消</a>
                        <a href="javascript:;" class="popups_btn_focus disable">确定</a>
                    </div>
                </form>
            </div>
        </div>`);

        var captchaUrl = common.dataServers + "/member_verifyCode.action?member.source=" + source + '&member.username=' + username;

        var checkCaptchaInterval = null;

        $html.find('.popups_captcha img').attr('src', captchaUrl + '&_=' + Math.random());

        $('body').append($html);
        $html.show();

        // 刷新验证码事件
        $html.find('.captchaRefresh').click(function() {
            $html.find('.popups_captcha img').attr('src', captchaUrl + '&_=' + Math.random());
        });

        // 取消事件
        $html.find('.popups_btn_left').click(function() {
            clearInterval(checkCaptchaInterval);
            $html.remove();
        });

        // 输入键盘被唤起时，需要移动弹窗位置 否则部分机型点击位置会错误
        $html.find('input[name="captcha"]').on('click', function(e) {
            setTimeout(function() {
                // $html.find('input[name="captcha"]').blur().focus();
                $html.find('.popups');
            }, 200);
        })

        // 提交
        $html.find('.popups_btn_focus').on('click', function() {
            if ($(this).hasClass('disable')) {
                return false;
            }
            okCallback && okCallback();
        });
        $html.find('input[name="captcha"]').on('keypress', function(e) {
            if (e.keyCode == 13) {
                if ($html.find('.popups_btn_focus').hasClass('disable')) {
                    return false;
                }
                okCallback && okCallback();
                return false;
            }
        });
        // 绑定form表单提交事件
        document.getElementById('captchaPopWindowForm').addEventListener('submit', function(e) {
            // 收回弹出的软键盘
            document.activeElement.blur();
            // 阻止默认事件
            e.preventDefault();

            if ($html.find('.popups_btn_focus').hasClass('disable')) {
                return false;
            }
            okCallback && okCallback();
        });

        // 检查验证码是否正确
        checkCaptchaInterval = setInterval(function() {
            var isDisable = $html.find('.popups_btn_focus').hasClass('disable');
            if (!common.checkImageCaptcha(document.getElementsByName('captcha')[0].value)) {
                isDisable && $html.find('.popups_btn_focus').removeClass('disable');
            } else {
                !isDisable && $html.find('.popups_btn_focus').addClass('disable');
            }
        }, 200);
    },

    /**
     * 验证码表单
     */
    captchaFormItem: function(source, username) {
        $html = $(`<div class="form-item">
            <input type="text" maxlength="4" name="captcha" data-type="imageCaptcha" placeholder="验证码" />
            <img class="imageCode" src="" />
        </div>`);
        var captchaUrl = common.dataServers + "/member_verifyCode.action?member.source=" + source + '&member.username=' + username;

        $html.find('.imageCode').attr('src', captchaUrl + '&_=' + Math.random()).on('click', function() {
            $html.find('.imageCode').attr('src', captchaUrl + '&_=' + Math.random());
        });

        return $html;
    },

    /**
     * 到登录页面
     * @url             REFERER地址 默认为当前地址
     */
    toLogin: function(url) {
        common.setCookie("loginReferer", url || window.location.href);
        window.location.href = "https://ios.gxzyzd.com/channels/me/login.html";
    },

    /**
     * 到应用详情页面
     * @appOptions      应用参数
     * @url             REFERER地址 默认为当前地址
     */
    toAppDetails: function(appOptions, url) {
        var refererName = "appDetailsReferer";
        if (appOptions && appOptions.id) {
            refererName += appOptions.id;
        }
        common.setCookie(refererName, url || window.location.href);
        var aos = [];
        for (var key in appOptions) {
            aos.push(key + "=" + appOptions[key]);
        }
        var aosStr = aos.length > 0 ? "?" + aos.join("&") : "";
        window.location.href = "https://ios.gxzyzd.com/channels/apps/app_content.html" + aosStr;
    },

    /**
     * 到 积分商城 商品详情 页面
     * @mallOptions     商品参数
     * @url             REFERER地址 默认为当前地址
     */
    toMallDetails: function(mallOptions, url) {
        common.setCookie("mallDetailsReferer", url || window.location.href);
        var mos = [];
        for (var key in mallOptions) {
            mos.push(key + "=" + mallOptions[key]);
        }
        var mosStr = mos.length > 0 ? "?" + mos.join("&") : "";
        window.location.href = "https://ios.gxzyzd.com/channels/mall/details.html" + mosStr;
    },

    /**
     * 到绑定手机号页面
     * @url             REFERER地址 默认为当前地址
     */
    toBindPhone: function(url) {
        common.setCookie("bindPhoneReferer", url || window.location.href);
        window.location.href = "https://ios.gxzyzd.com/channels/me/checkPassword.html";
    },

    /**
     * 跳转到一个指定页面
     * @url             要跳转到的页面地址
     * @urlOptions      页面地址的参数
     * @refererName     要设置COOKIE的 REFERER 名称
     * @refererUrl      REFERER地址 默认为当前地址
     */
    goToPage: function(url, urlOptions, refererName, refererUrl) {
        common.setCookie(refererName, refererUrl || window.location.href);
        var gos = [];
        for (var key in urlOptions) {
            gos.push(key + "=" + urlOptions[key]);
        }
        var gosStr = gos.length > 0 ? "?" + gos.join("&") : "";
        window.location.href = url + gosStr;
    },

    /**
     * 跳转到httpbox
     * @title       页面标题
     * @iframeUrl   要打开的页面地址
     */
    goToHttpbox: function(title, iframeUrl) {
        var nowurl = window.location.href;
        window.location.href = common.httpboxUrl + '?title=' + title + '&reurl=' + iframeUrl + '&backurl=' + nowurl;
    },

    /**
     * 获取当前链接参数
     */
    getRequest: function(key) {
        var url = window.location.href;
        // if (location.hash.indexOf("#") != -1) {
        //     url = "?" + location.hash.split("?")[1];
        // } else {
        //     url = location.search;
        // }

        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.split("?")[1];
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                var index = strs[i].indexOf("=");
                var strKey = strs[i].substr(0, index).replace(/amp;/, "")
                theRequest[strKey] = strs[i].substr(index + 1);
            }
        }
        if (key) {
            return theRequest[key] || "";
        }
        return theRequest;
    },


    /**
     * 检查手机号
     */
    checkPhone: function(phone) {
        if (!phone) {
            return "不能为空";
        }
        if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(phone)) {
            return "无效";
        }
        return 0;
    },

    /**
     * 检查邮箱
     */
    checkEmail: function(email) {
        if (!email) {
            return "不能为空";
        }
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
            return "无效";
        }
        return 0;
    },

    /**
     * 检查QQ号码
     */
    checkQQ: function(qq) {
        if (!qq) {
            return "不能为空";
        }
        if (!/^\d{5,12}$/.test(qq)) {
            return "无效";
        }
        return 0;
    },

    /**
     * 检查密码
     * @paaasowd        密码串
     * @isOld           是否是旧密码
     */
    checkPassword: function(password, isOld) {
        var minLength = isOld ? 6 : 8;
        var maxLength = 30;
        if (!password) {
            return "不能为空";
        }
        if (password.length < minLength || password.length > maxLength) {
            return "为" + minLength + "-" + maxLength + "个字符";
        }
        if (common.isEmojiCharacter(password)) {
            return "不能包含emoji表情符号";
        }
        if (!isOld) { // 旧密码不进行该验证
            if (!/^[a-zA-Z0-9]+$/.test(password)) {
                return "必须是字母和数字的组合";
            }
            var hasAZ = _hasAZ = hasNumber = 0;
            for (var i = 0; i < password.length; ++i) {
                var char = password.charAt(i);
                if (/^[a-z]$/.test(char)) {
                    hasAZ = 1;
                    continue;
                }
                if (/^[A-Z]$/.test(char)) {
                    _hasAZ = 1;
                    continue;
                }
                if (/^[0-9]$/.test(char)) {
                    hasNumber = 1;
                    continue;
                }
            }
            if (hasAZ + _hasAZ + hasNumber < 2) {
                return "需要至少包含大小写字母及数字中的两种";
            }
        }
        return 0;
    },

    /**
     * 检查帐号
     */
    checkAccount: function(account) {
        if (!account) {
            return "不能为空";
        }
        if (account.length < 3 || account.length > 20) {
            return "必须是3-20个字符";
        }
        if (common.isEmojiCharacter(account)) {
            return "不能包含emoji表情符号";
        }
        if (!/^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\~\`\!\@\#\$\^\*\(\)\_\-\[\]\;\,\.\/\{\}\:\<\>\|]+$/.test(account)) {
            return "格式错误";
        }
        return 0;
    },

    /**
     * 检查手机验证码
     */
    checkPhoneCaptcha: function(phoneCaptcha) {
        if (!phoneCaptcha) {
            return "不能为空";
        }
        // if (phoneCaptcha.length != 6) {
        //     return "不能少于6位";
        // }
        if (!/^\d{6}$/.test(phoneCaptcha)) {
            return "为6位数字";
        }
        return 0;
    },

    /**
     * 检查图片验证码
     */
    checkImageCaptcha: function(imageCaptcha) {
        if (!imageCaptcha) {
            return "不能为空";
        }
        if (imageCaptcha.length != 4) {
            return "为4位";
        }
        if (!/^[a-zA-Z0-9]{4}$/.test(imageCaptcha)) {
            return "格式错误";
        }
        return 0;
    },

    /**
     * 检查用户昵称
     */
    checkNickName: function(nickName) {
        if (!nickName) {
            return "不能为空";
        }
        if (nickName.length > 20) {
            return "长度不能超20个字符";
        }
        // if (common.isEmojiCharacter(nickName)) {
        //     return "不能包含emoji表情符号";
        // }
        // if (!/^\d{6}$/.test(nickName)) {
        //     return "";
        // }
        return 0;
    },

    /**
     * 检查性别
     */
    checkSex: function(sex) {
        sex = parseInt(sex);
        if (sex != 2 && sex != 1) {
            return "错误";
        }
        return 0;
    },

    /**
     * 检查地址
     */
    checkAddress: function(address) {
        if (!address) {
            return "不能为空";
        }
        if (common.isEmojiCharacter(address)) {
            return "不能包含emoji表情符号";
        }
        if (address.length > 100) {
            return "长度不能超过100个字符";
        }
        return 0;
    },

    /**
     * 检查联系人
     */
    checkContacts: function(contacts) {
        if (!contacts) {
            return "不能为空";
        }
        if (common.isEmojiCharacter(contacts)) {
            return "不能包含emoji表情符号";
        }
        if (contacts.length > 20) {
            return "长度不能超过20个字符";
        }
        return 0;
    },

    /**
     * 检查是否包含emoji表情符号
     */
    isEmojiCharacter: function(substring) {
        if (/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig.test(substring)) {
            return true;
        }
        return false;
        // for (var i = 0; i < substring.length; i++) {
        //     var hs = substring.charCodeAt(i);
        //     if (0xd800 <= hs && hs <= 0xdbff) {
        //         if (substring.length > 1) {
        //             var ls = substring.charCodeAt(i + 1);
        //             var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        //             if (0x1d000 <= uc && uc <= 0x1f77f) {
        //                 return true;
        //             }
        //         }
        //     } else if (substring.length > 1) {
        //         var ls = substring.charCodeAt(i + 1);
        //         if (ls == 0x20e3) {
        //             return true;
        //         }
        //     } else {
        //         if (0x2100 <= hs && hs <= 0x27ff) {
        //             return true;
        //         } else if (0x2B05 <= hs && hs <= 0x2b07) {
        //             return true;
        //         } else if (0x2934 <= hs && hs <= 0x2935) {
        //             return true;
        //         } else if (0x3297 <= hs && hs <= 0x3299) {
        //             return true;
        //         } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
        //             hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
        //             hs == 0x2b50) {
        //             return true;
        //         }
        //     }
        // }
    },

    /**
     * JSONP 请求
     */
    jsonp: function(data, URL, callback) {
        var str = "";
        for (x in data) {
            str += x + "=" + data[x] + '&'
        }
        var jps = document.createElement('script');
        jps.id = "jsonp";
        jps.src = URL + '?' + str + 'jsonp=' + callback;
        // console.log(JSONP.src);
        document.getElementsByTagName('head')[0].appendChild(jps);
        document.getElementById('jsonp').remove();
    },

    /**
     * 获取数据 使用JSONP的方式
     */
    getDataJSONP: function(url, data, successCallback, errorCallbback, requestEndCallback) {
        var jsonpCallbackName = "jsonp" + (new Date()).getTime() + parseInt(Math.random() * 100000)
        window[jsonpCallbackName] = function() {};
        var ops = [];
        for (var i in data) {
            ops.push(i + "=" + data[i]);
        }
        url += (url.indexOf("?") == -1 ? "?" : "&") + ops.join("&");
        $.ajax({
            url: url,
            type: "get",
            data: {},
            async: true,
            timeout: 30000,
            dataType: "jsonp",
            jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: jsonpCallbackName,
            success: function(rs) {
                requestEndCallback && requestEndCallback(rs);
                successCallback && successCallback(rs);
            },
            error: function(e1, e2, e3) {
                requestEndCallback && requestEndCallback(e2);
                if (e2 == "timeout") {
                    e2 = "请求超时";
                    common.removeAllLoad();
                    common.popWindowOk({
                        title: "网络连接超时",
                        btnTxt: "重试",
                        okCallback: function() {
                            common.getDataJSONP(url, data, successCallback, errorCallbback, requestEndCallback);
                        },
                    });
                } else {
                    if (e1.readyState == 0) {
                        return;
                    }
                    common.comPopTips(e2);
                }
            },
        });
    },

}


// 获取手机相关信息
common.appleDeviceSystemVersion = '10.0';
if (/iphone|iPad/gi.test(navigator.userAgent)) {
    // 系统版本
    // Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1
    var matchs = navigator.userAgent.match(/(iPhone|iPad)\s(\w+\s)?([\d|_]+)/i);
    if (matchs && matchs[matchs.length - 1]) {
        common.appleDeviceSystemVersion = (matchs[matchs.length - 1] || "").replace(/_/ig, ".");
    }
}
// 手机型号
common.appleDeviceModel = "iPhone7,2";
common.appleDeviceScreenSize = '750x1334';
if ((screen.height == 812 && screen.width == 375) || (screen.width == 812 && screen.height == 375)) { // iPhone X
    common.appleDeviceModel = "iPhone10,3";
    common.appleDeviceScreenSize = '1125x2436';
} else if ((screen.height == 736 && screen.width == 414) || (screen.width == 736 && screen.height == 414)) { // iPhone 6 Plus
    common.appleDeviceModel = "iPhone7,1";
    common.appleDeviceScreenSize = '1080x1920';
} else if ((screen.height == 667 && screen.width == 375) || (screen.width == 667 && screen.height == 375)) { // iPhone 6
    common.appleDeviceModel = "iPhone7,2";
    common.appleDeviceScreenSize = '750x1334';
} else if ((screen.height == 568 && screen.width == 320) || (screen.width == 568 && screen.height == 320)) { // iPhone 5
    common.appleDeviceModel = "iPhone5,1";
    common.appleDeviceScreenSize = '640x1136';
} else if ((screen.height == 480 && screen.width == 320) || (screen.width == 480 && screen.height == 320)) { // iPhone 4
    common.appleDeviceModel = "iPhone3,1";
    common.appleDeviceScreenSize = '640x960';
} else if ((screen.height == 1024 && screen.width == 768) || (screen.width == 1024 && screen.height == 768)) { // iPad mini
    common.appleDeviceModel = "iPad3,1";
    common.appleDeviceScreenSize = '2048x2048';
} else if ((screen.height == 1366 && screen.width == 1024) || (screen.width == 1366 && screen.height == 1024)) { // iPad Pro
    common.appleDeviceModel = "iPad6,3";
    common.appleDeviceScreenSize = '2732x2732';
    // 由于该设备浏览器缺少系统方法支持（window.sessionStorage），无法使用应用相关内容，暂时跳转到pc官网
    window.location.href = "https://pc.i4.cn/";
}
common.toolversion = 100;


// 获取设备当前连接的网络类型   无效。。2017.12.11.22
// H5 plus事件处理
// function plusReady() {
//     var types = {};
//     types[plus.networkinfo.CONNECTION_UNKNOW] = "Unknown connection";
//     types[plus.networkinfo.CONNECTION_NONE] = "None connection";
//     types[plus.networkinfo.CONNECTION_ETHERNET] = "Ethernet connection";
//     types[plus.networkinfo.CONNECTION_WIFI] = "WiFi connection";
//     types[plus.networkinfo.CONNECTION_CELL2G] = "Cellular 2G connection";
//     types[plus.networkinfo.CONNECTION_CELL3G] = "Cellular 3G connection";
//     types[plus.networkinfo.CONNECTION_CELL4G] = "Cellular 4G connection";

//     // alert("Network: " + types[plus.networkinfo.getCurrentType()]);
// }
// if (window.plus) {
//     alert(window.plus.networkinfo.getCurrentType());
//     plusReady();
// } else {
//     document.addEventListener("plusready", plusReady, false);
// }