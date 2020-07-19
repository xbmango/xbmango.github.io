;
(function() {
    // 红点显示相关
    $.ajax({
        url: common.dataServers + "/me_islogin.action",
        data: {},
        dataType: "json",
        type: "POST",
        xhrFields: {
            withCredentials: true // 允许跨域请求时携带COOKIE
        },
        success: function(rs) {
            if (!rs.code) {
                common.isLogin = rs.data[0].isLogin;
                common.isBindPhone = rs.data[0].isBindPhone;
                common.isMeinfo = rs.data[0].isMeinfo;
                if (common.isMeinfo) {
                    $('.tabbar_main .tabbar_main_me').append('<div class="red_dot"></div>');
                }
            } else {
                common.comPopTips(rs.message);
            }
        }
    });

    // 点击需要登录才能操作的按钮，没有登录的话就跳转到登录页面
    $('body').on('click', '.needLogin', function() {
        if (!common.isLogin) {
            common.toLogin();
            return false;
        }
    });

    // 跳转到应用详情界面
    $('body').on('click', '.applist_main,.list_recommend_app a', function() {
        // /channels/apps/app_content.html?id=1013683"
        var appHref = $(this).attr('href');
        var matchs = appHref.match(/[\&\?]id\=(\d+)/);
        var refUrl = window.search ? `/channels/html/search.html?type=${window.search.type}&keyword=${window.search.keyword}` : null;
        if (matchs && matchs.length > 0) {
            common.toAppDetails({
                id: matchs[1],
            }, refUrl);
            return false;
        }
    });

    // 跳转到表情详情
    $('body').on('click', '.emote_list a', function() {
        var mallHref = $(this).attr('href');
        common.goToPage(mallHref, null, 'emoteContentReferer', null);
        return false;
    });

    // 跳转到 积分商城 商品详情 界面
    $('body').on('click', '.goodsItemA', function() {
        // /channels/apps/app_content.html?id=1013683"
        if ($(this).attr('data-goodsStatus') && $(this).attr('data-goodsStatus') != "0") {
            common.comPopTips("此商品已下架");
            return false;
        }
        var mallHref = $(this).attr('href');
        var matchs = mallHref.match(/[\&\?]id\=(\d+)/);
        if (matchs && matchs.length > 0) {
            common.toMallDetails({
                id: matchs[1]
            });
            return false;
        }
    });

    // 跳转到礼包详情界面
    $('body').on('click', '.giftItem', function() {
        // /channels/apps/app_content.html?id=1013683"
        var mallHref = $(this).attr('href');
        var matchs = mallHref.match(/[\&\?]id\=(\d+)/);
        if (matchs && matchs.length > 0) {
            common.goToPage("https://ios.gxzyzd.com/channels/me/gameGiftInfo.html", { id: matchs[1] }, "giftDetailReferer", null);
            return false;
        }
    });


    //解决iOS Web APP中点击链接跳转到Safari 浏览器新标签页的问题 devework.com
    //stanislav.it/how-to-prevent-ios-standalone-mode-web-apps-from-opening-links-in-safari
    if (("standalone" in window.navigator) && window.navigator.standalone) {
        var noddy, remotes = false;
        document.addEventListener('click', function(event) {
            noddy = event.target;
            while (noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
                noddy = noddy.parentNode;
            }
            if ('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes)) {
                event.preventDefault();
                document.location.href = noddy.href;
            }
        }, false);
    }

    // 滚动过程中，顶部菜单自动位置
    // var scrollTop = $(window).scrollTop();
    // var navBar = document.getElementsByClassName("navbar")[0];
    // var sub_navbar = null;
    // if (document.getElementsByClassName("sub_navbar").length > 0) {
    //     sub_navbar = document.getElementsByClassName("sub_navbar")[0];
    // } else if (document.getElementsByClassName("header").length > 0) {
    //     sub_navbar = document.getElementsByClassName("header")[0];
    // }
    // if (navBar) {
    //     navBar.style.top = 0;
    // }
    // if (sub_navbar) {
    //     sub_navbar.style.top = "88px";
    // }
    // var navBarHeight = 178;
    // var downTotal = 0;
    // var t = 0;
    // $(window).scroll(function() {
    //     var nt = $(window).scrollTop();
    //     var nbt = parseInt(navBar.style.top);
    //     if (nt > scrollTop) {
    //         downTotal += nt - scrollTop;
    //         if (downTotal > 300) { // 向下拉动一定的距离后才开始隐藏顶部菜单
    //             // 向上拉，隐藏顶部菜单
    //             if (nbt > -navBarHeight) {
    //                 t = Math.max(nbt - (nt - scrollTop), -navBarHeight);
    //                 navBar.style.top = t + "px"; // 顶部导航菜单位置Y减小
    //                 sub_navbar.style.top = t + 88 + "px";
    //             }
    //         }
    //         scrollTop = nt;
    //     } else {
    //         // 向下拉，显示顶部菜单
    //         if (nbt < 0) {
    //             t = Math.min(nbt + (scrollTop - nt), 0);
    //             navBar.style.top = t + "px"; // 顶部导航菜单位置Y增加
    //             sub_navbar.style.top = t + 88 + "px";
    //         }
    //         scrollTop = nt;
    //         downTotal = 0;
    //     }

    //     // if (scrollTop > 0) {
    //     //     $("#tabbar_main_top").css('height', '148px');
    //     // } else {
    //     //     $("#tabbar_main_top").css('height', '108px');
    //     // }
    // });

    // 在iphoneX中，底部菜单自动高度
    if (common.appleDeviceScreenSize == "1125x2436") {
        var tabbarMainReposTimer = null;
        $(window).resize(function() {
            clearTimeout(tabbarMainReposTimer);
            tabbarMainReposTimer = setTimeout(function() {
                if (document.getElementsByClassName("tabbar_main").length > 0) {
                    if (window.innerHeight > 1270) {
                        document.getElementsByClassName("tabbar_main")[0].style.paddingBottom = "44px";
                    } else {
                        document.getElementsByClassName("tabbar_main")[0].style.paddingBottom = "0px";
                    }
                }
            }, 100);
        });
    }

    // 将当前设备信息以类名的方式，添加到BODY中
    $('body').addClass('p' + common.appleDeviceScreenSize);
    // 检查是否是横屏
    var checkScreenHengTimer = null;
    checkScreenHeng();
    $(window).resize(function() {
        checkScreenHeng();
    });

    function checkScreenHeng() {
        if (checkScreenHengTimer) {
            clearTimeout(checkScreenHengTimer);
        }
        checkScreenHengTimer = setTimeout(function() {
            // console.log(screen.width, screen.height);
            if (screen.width > screen.height) {
                $('body').addClass('heng');
            } else {
                $('body').removeClass('heng');
            }
        }, 200);
    }

    // 摇一摇
    // if (window.DeviceMotionEvent) {
    //     //运动事件监听
    //     window.addEventListener('devicemotion', deviceMotionHandler, false);

    //     common.devicemotion = {
    //         SHAKE_THRESHOLD: 8000,
    //         last_update: 0,
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //         last_x: 0,
    //         last_y: 0,
    //         last_z: 0,
    //         execFunc: null,
    //     };

    //     //获取加速度信息
    //     //通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
    //     //而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
    //     function deviceMotionHandler(eventData) {
    //         var acceleration = eventData.accelerationIncludingGravity;
    //         var curTime = new Date().getTime();
    //         if ((curTime - common.devicemotion.last_update) > 10) {
    //             var diffTime = curTime - common.devicemotion.last_update;
    //             common.devicemotion.last_update = curTime;
    //             common.devicemotion.x = acceleration.x;
    //             common.devicemotion.y = acceleration.y;
    //             common.devicemotion.z = acceleration.z;
    //             var speed = Math.abs(common.devicemotion.x +
    //                 common.devicemotion.y +
    //                 common.devicemotion.z -
    //                 common.devicemotion.last_x -
    //                 common.devicemotion.last_y -
    //                 common.devicemotion.last_z) / diffTime * 10000;
    //             if (speed > common.devicemotion.SHAKE_THRESHOLD) {
    //                 if (common.devicemotion.execFunc) {
    //                     common.devicemotion.execFunc();
    //                 }
    //             }
    //             common.devicemotion.last_x = common.devicemotion.x;
    //             common.devicemotion.last_y = common.devicemotion.y;
    //             common.devicemotion.last_z = common.devicemotion.z;
    //         }
    //     }
    // }

})();