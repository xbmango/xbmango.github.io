/*阻止冒泡*/
function canclBull() {
    var e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}
/*禁止默认*/
function pd(event) {
    event.preventDefault();
}
/*监听弹窗 添加屏幕禁止滑动滑动事件*/
function addListenPop() {
    document.body.addEventListener('touchmove', pd);
}
/*移除弹窗监听 移除屏幕禁止滑动滑动事件*/
function removeLisitenPop() {
    document.body.removeEventListener('touchmove', pd);
}

/*获取点击位置的定位*/
function show_coords(event) {
    x = event.clientX
    y = event.clientY
    return [x, y];
}
/*弹窗*/
var mP = 0;
var mp2 = 0;

function pop() {
    if (mP == 0) {
        try {
            var btn = null;
            if (event.target.className == 'app_install_button_free') {
                btn = event.target.parentNode;
            } else {
                btn = event.target;
            }
            var pTxtAS = '';
            var pTxtST = '';
            var ISpIo = ['../img/applist_source_i4_menu.png'/*tpa=https://ios.gxzyzd.com/img/applist_source_i4_menu.png*/, '../img/applist_source_i4_menu_default.png'/*tpa=https://ios.gxzyzd.com/img/applist_source_i4_menu_default.png*/];
            var STpIo = ['../img/applist_source_ap_menu.png'/*tpa=https://ios.gxzyzd.com/img/applist_source_ap_menu.png*/, '../img/applist_source_ap_menu_default.png'/*tpa=https://ios.gxzyzd.com/img/applist_source_ap_menu_default.png*/];
            var isIco = '';
            var stIco = '';
            var appinfo = {};
            if (btn.className == 'app_install_button') {
                appinfo = common.loadedApps[btn.getAttribute("data-id")];
                btn.className = 'app_install_button std';
                if (appinfo.wish == 0) {
                    pTxtAS = '从爱思服务器免费安装';
                    isIco = ISpIo[0];
                } else {
                    sessionStorage.removeItem('appinfo');
                    sessionStorage.setItem('appinfo', JSON.stringify(appinfo));
                    pTxtAS = '<span  style="color:rgba(255,255,255,0.5)">爱思服务器暂未提供</span><a href="https://ios.gxzyzd.com/channels/apps/wish.html" onclick="rmpop()">许愿</a>';
                    isIco = ISpIo[1];
                }
                // toappStore
                // 1：应用内打开 AppStore 
                // 2：外部跳转 AppStore 
                // 3：内部跳普通链接 
                // 4： 外部跳链接 
                // 5：内部跳接口并外部跳转AppStore 
                // 6： 内部跳接口并内部打开 AppStore 
                // -1：AppStore 已下架
                if ((appinfo.toappstore || appinfo.toappStore) == -1) {
                    pTxtST = '<span style="color:rgba(255,255,255,0.5)">App Store 暂不提供</span>';
                    stIco = STpIo[1];
                } else {
                    if (appinfo.apppriceflag == 1 && appinfo != 0) {
                        pTxtST = "去 App Store 付费安装";
                    } else {
                        pTxtST = "去 App Store 免费安装";
                    }
                    stIco = STpIo[0];
                }


                var zhe = document.createElement('div');
                zhe.className = 'zhe';
                zhe.id = 'zhe2';
                zhe.setAttribute('onclick', 'rmpop()');

                /*获取事件的点击位置*/
                var xy = show_coords(event);
                var pop = document.createElement('div');
                var wH = window.screen.height;
                // console.log(xy);
                // console.log(wH);
                if (xy[1] > wH) {
                    pop.className = 'ist_btn_pop2';
                } else {
                    pop.className = 'ist_btn_pop';
                }
                pop.id = 'ist_btn_pop';

                /* 弹窗html*/

                pop.innerHTML = '<dl><dt data-id="' + (appinfo.id || appinfo.AppId) + '" onclick="aisiInstall(this)"><img src="' + isIco + '" alt=""><span>' + pTxtAS + '</span></dt><dt data-id="' + (appinfo.id || appinfo.AppId) + '" onclick="storeInstall(this)"><img src="' + stIco + '" alt=""><span>' +
                    pTxtST + '</span></dt></dl>'




                btn.appendChild(pop);
                btn.appendChild(zhe);
                mP = 1;
            }
        } catch (err) {
            console.log(err);
        }
    }
}

//进入许愿页面
function wish() {
    window.location = 'https://ios.gxzyzd.com/channels/apps/wish.html';
}

/*
取消弹窗 
*/
function rmpop() {
    var ist_btn_pop = document.getElementById('ist_btn_pop');
    var zhe2 = document.getElementById('zhe2');
    ist_btn_pop.parentNode.className = 'app_install_button';
    zhe2.parentNode.className = 'app_install_button';
    ist_btn_pop.remove();
    zhe2.remove();
    mP = 0;
    mp2 = 0;
    // canclBull(); // 此处阻止冒泡会影响全局A标签跳转
}

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

/*爱思商店安装弹窗*/
function aisiInstall(obj) {

    var appinfo = common.loadedApps[obj.getAttribute("data-id")];

    if (appinfo.wish == 0) {
        if (!parseInt(appinfo.itemid || 0) && !common.getCookie('xinrenqiye')) {
            var xinrenPopWindow = common.popWindow({
                title: "信任企业级开发者",
                content: '如果打开安装的游戏出现“未受信任的企业级开发者”提示，请进入“设置->通用->设备管理（描述文件）”里面选择相应的企业开发者然后点击“信任...”，再重新打开该游戏即可。',
                buttons: [{
                    className: "popups_btn_big popups_btn_focus",
                    txt: "查看详情",
                    href: "javascript:common.goToHttpbox('信任企业级开发者','https://url2.i4.cn/YZJjaiaa');",
                }, {
                    className: "popups_btn_small popups_btn_left",
                    txt: "不再提醒",
                    clickEvent: function() {
                        common.setCookie('xinrenqiye', "1", 18921600); // 30天
                        xinrenPopWindow.remove();
                    },
                }, {
                    className: "popups_btn_small popups_btn_right",
                    txt: "好的",
                    clickEvent: function() {
                        // 关闭后，10分钟之内不再提示
                        common.setCookie('xinrenqiye', "1", 600);
                        xinrenPopWindow.remove();
                    },
                }],
            });
        } else if (parseInt(appinfo.itemid || 0) && appinfo.haveipa) {
            // APP STORE 共享包，弹窗提示到移动端下载
            var installI4PopWindow = common.popWindow({
                title: "请使用“爱思助手移动端”安装当前应用或游戏",
                // content: '',
                buttons: [{
                    className: "popups_btn_small popups_btn_left",
                    txt: "安装教程",
                    clickEvent: function() {
                        common.goToPage("https://ios.gxzyzd.com/channels/html/install.html", null, "installI4Refferer");
                        installI4PopWindow.remove();
                    },
                }, {
                    className: "popups_btn_small popups_btn_right popups_btn_focus",
                    txt: "我知道了",
                    clickEvent: function() {
                        installI4PopWindow.remove();
                    },
                }],
            });
            rmpop();
            return;
        }
        common.loadPageBlock(true);
        setTimeout(function() {
            $(".loadPageBlock").remove();
        }, 500)
        rmpop();

        window.location = "https://ios.gxzyzd.com/ios_files/itms-services://?action=download-manifest&url=" + (appinfo.plist_s || appinfo.plist);

    }
}

/*appStore 安装弹窗*/
function storeInstall(obj) {


    var appinfo = common.loadedApps[obj.getAttribute("data-id")];
    // console.log(appinfo.toappstore)
    if ((appinfo.toappstore || appinfo.toappStore) != -1) {
        common.loadPageBlock(true);
        //第一次访问，提示设置
        // atFirst();
        setTimeout(function() {
            $(".loadPageBlock").remove();
        }, 500)
        rmpop();
        if (appinfo.toappstore == 0) {
            window.location = "https://itunes.apple.com/app/id" + appinfo.itemid;
        } else {
            window.location = appinfo.linkurl;
        }
    }
}

//第一次访问，提示开启AppStore访问网络的权限
// function atFirst() {
if (!common.getCookie('appstorewangluo')) {
    // 暂时不显示
    // var content = '<p class="tit">溫馨提示<p>' +
    //     '<p class="txt">为了加快应用和游戏的下载速度，请先开启AppStore访问网络的权限，否则安装应用和游戏的过程中会一直提示“等待中...”</p>' +
    //     '<a href="https://itunes.apple.com/cn/genre/ios-zhi-bo/id6007?mt=8" class="btn_set">现在去设置</a>'
    // var t = 3;
    // var tips = common.popWindow({
    //     content: content,
    //     buttons: [{
    //         href: '',
    //         id: 'setting',
    //         className: 'btn_cancel btn_a',
    //         txt: '我已设置(' + t + ')',
    //         clickEvent: haveSet
    //     }, {
    //         href: "javascript:common.goToHttpbox('开启安装说明','https://url2.i4.cn/bUjaAbaa');",
    //         className: 'btn_define2 btn_a',
    //         txt: '查看详情'
    //     }],
    // });
    // if (tips && tips != 'undefined') {

    //     var _this = $('.popups>.btn_cancel ');
    //     _this.addClass('disabled');
    //     _this.unbind('click');
    //     _this.timer = setInterval(function() {
    //         t--;
    //         if (t == 0) {
    //             _this.removeClass('disabled');
    //             _this.on('click', haveSet);
    //             _this.text('我已设置');
    //             clearTimeout(_this.timer);
    //         } else {
    //             var text = '我已设置' + '(' + t + ')';
    //             _this.text(text);
    //         }


    //     }, 1000);

    // }

    // function haveSet() {
    //     common.setCookie('appstorewangluo', "1", 18921600);
    //     $('.bg_mask').remove();
    // }

    // return false;
}
// return true;
// }