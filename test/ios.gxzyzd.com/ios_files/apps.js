/*=======================================数据加载==============================================*/
var state = 0;
var boxIdName = 'applist_wrap';
var boxId = document.getElementById(boxIdName);
var apploading = false;
var appnomore = false;
window.onload = function() {
    setTimeout(function() {
        var iconbar = document.getElementById('iconbar');
        //加载动画
        var mo = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
                (function(a) {
                    setTimeout(function() {
                        animateCss3(mutations[a].addedNodes[0]);
                    }, a * 50)
                })(i);
            }
        });

        mo.observe(boxId, {
            target: true,
            addedNodes: true,
            childList: true,
        });

        function animateCss3(obj) {
            if (obj) {
                obj.style.opacity = 1;
            }
        }

        if (typeof appData != "undefined") {
            //加载数据
            PromiseData();
            //调用加载数据提示
            common.loadingState(appData.pageno || 1, "tabbar_main_top");
        }

    }, 100);

};


//获取数据
function getData() {
    if (apploading) {
        return false;
    }
    if (appnomore) {
        return false;
    }
    apploading = true;
    common.loadingState(appData.pageno || 1, "tabbar_main_top");
    var P = new Promise(function(resolve, reject) {
        window.appsss = function(result) {
            resolve(result);
        }
        common.jsonp(appData, appsURL, 'appsss');
    });
    return P;
};
//超时重载
function nodeData() {
    var P = new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject('超时啦！');
        }, 4000);
    });
    return P;
};

// 创建 APP item
function createAppItem(appinfo) {

    var ISON = ['app_install_source_i4 std', 'app_install_source_i4'];
    var STON = ['app_install_source_ap std', 'app_install_source_ap'];
    var btnTxt = '';
    var ison = '';
    var ston = '';
    var gift = '';
    appinfo.wish = 0;
    //判断按钮显示价格还是安装
    if (appinfo.appstoreprice !== '' && appinfo.appstoreprice !== '0') {
        btnTxt = appinfo.appstoreprice;
    } else {
        btnTxt = '安装';
    }
    if (appinfo.itemid == 0) {
        //必有共享包
        ison = ISON[0];
        ston = STON[1];
        appinfo.wish = 0;
    } else {
        //判断是否有共享包
        if (appinfo.haveipa == 1 || ((appinfo.toappstore || appinfo.toappStore) == -1 && appinfo.onlyshare == 1)) {
            ison = ISON[0];
            appinfo.wish = 0;
        } else {
            ison = ISON[1];
            appinfo.wish = 1;
        }
        //判断是否有aap store包
        if ((appinfo.toappstore || appinfo.toappStore) == -1) {
            ston = STON[1];
        } else {
            ston = STON[0];
        }
    }
    // 有价格 可以免费下载的

    if ((appinfo.apppriceflag == 0 || appinfo.apppriceflag == 2 || appinfo.priceline == 1) && btnTxt != "安装") {
        btnTxt = '<span class="app_install_button_free">' + btnTxt + '</span>';
    }

    //判断是否有礼包
    if (appinfo.gift == '1') {
        gift = '<img src = "../img/me_head_icon_gift.png"/*tpa=https://ios.gxzyzd.com/img/me_head_icon_gift.png*/>';
    }

    appURLhref = 'https://ios.gxzyzd.com/channels/apps/app_content.html';

    var oDiv = document.createElement('div');
    oDiv.className = 'applist';
    //ProhibitToJump=0;
    //禁止url跳转
    var installPackageURL = '';
    if (appinfo.plist_s) {
        installPackageURL = appinfo.plist_s;
    } else {
        installPackageURL = appinfo.plist;
    }
    oDiv.innerHTML = '<a class="applist_main" href="' +
        appURLhref + '?id=' + (appinfo.id || appinfo.AppId) +
        '"><div class="applist_main_icon">' +
        '<img src="' + appinfo.icon + '" width="120" height="120" alt=""/>' +
        '</div><dl class="applist_main_text"><dt class="textover">' + gift + appinfo.appname + '</dt>' +
        '<dd>' + appinfo.title3.split("|").join("<span>|</span>") + '</dd>' +
        '<dd><p class="textover">' + appinfo.slogan + '</p></dd></dl></a>' +
        '<a class="app_install" href="javascript:;">' +
        '<div data-id="' + (appinfo.id || appinfo.AppId) + '" class="app_install_button">' + btnTxt + '</div>' +
        '<div class="app_install_source">' +
        '<span class="' + ison + '"></span>' +
        '<span class="' + ston + '"></span></div></a>'
    boxId.appendChild(oDiv);
    // 加载到缓存
    if (!common.loadedApps) {
        common.loadedApps = {};
    }
    common.loadedApps[appinfo.id || appinfo.AppId] = appinfo;
};

//所有返回数据
function allDataApp(result) {
    if (result.count !== 0) {
        //上面是否有分类的icon
        if (result.bannerMenuItem && result.ad && appData.pageno == 1) {

            $('.banner').show();
            var swiperWrapper = document.getElementById('swiperWrapper');
            var str = '';
            var hrefATypeId = '';
            var hrefAType = '';
            for (var i = 0; i < result.ad.length; i++) {
                if (result.ad[i].type == 1) {
                    //应用内打开appStore
                } else if (result.ad[i].type == 2) {
                    //外部跳转AppStore
                } else if (result.ad[i].type == 3) {
                    //内部跳普通链接
                } else if (result.ad[i].type == 4) {
                    //外部跳链接
                } else if (result.ad[i].type == 5) {
                    //内部跳接口并并外部跳转appstore
                } else if (result.ad[i].type == 6) {
                    //内部跳转接口并内部打开appStore
                } else if (result.ad[i].type == 7) {
                    //应用详情
                    hrefAType = "javascript:common.goToPage('https://ios.gxzyzd.com/channels/apps/app_content.html', { id: " + result.ad[i].url + " }, 'appDetailsReferer', null);";
                } else if (result.ad[i].type == 8) {
                    //专题
                    hrefAType = 'channels/apps/series_applist.html?id=' + result.ad[i].url;
                }
                str += '<div class="swiper-slide"><a href="' + hrefAType + '"><img src="' + result.ad[i].image + '"></a></div>';
            }
            swiperWrapper.innerHTML = str;
            $('#iconbar').show();
            var iconbar = document.getElementById('iconbar');
            var iconbarHref = [
                'https://ios.gxzyzd.com/channels/wallpapers/wallpapers.html?remd=1',
                // 'https://ios.gxzyzd.com/ios_files/channels/emote/emote.html?remd=1',
                'javascript:gotoEmil();',
                "javascript:common.goToHttpbox('彩铃','http://iring.diyring.cc/friend/4302eb91687d11cd#');",
                'https://ios.gxzyzd.com/channels/ringtones/ringtones.html?remd=1'
            ];
            for (var i = 0; i < result.bannerMenuItem.length; i++) {
                var oA = document.createElement('a');
                oA.href = iconbarHref[i];
                oA.innerHTML = '<img src="' + result.bannerMenuItem[i].icon + '"/><span>' + result.bannerMenuItem[i].name + '</span>';
                iconbar.appendChild(oA);
            }
            try {
                var mySwiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    autoplay: 4000,
                    autoplayDisableOnInteraction: false,
                    loop: true,
                    grabCursor: true,
                    paginationClickable: true
                });
            } catch (err) {
                console.log(err);
            }
        } else if (result.bannerMenuItem && appData.pageno == 1) {
            var str = '';
            var iconbar = document.getElementById('iconbar');
            iconbar.className = 'iconbar';
            // 省钱安装 app_sheng.html
            //限时免费 app_sheng.html
            //单机游戏 category_applist.html
            //网络游戏 category_applist.html
            //咨询测评 news.html
            //游戏专题 app_series.html
            var urlID12 = ['app_sheng.html?', 'category_applist.html?', 'app_series.html?', 'news.html?type=40&', 'activit.html?', 'i4_exclusively.html?'];
            var urlID12Sel = '';
            $('#iconbar').show();
            if (result.bannerMenuItem.length > 4) {

                var remdNub = 3;
                for (var i = 0; i < result.bannerMenuItem.length; i++) {
                    if (i == 0 || i == 1) {
                        urlID12Sel = urlID12[0];
                        remdNub = 3;
                    } else if (i == 3) {
                        urlID12Sel = urlID12[2];
                        remdNub = 3;
                    } else if (i == 4 || i == 5) {
                        urlID12Sel = urlID12[1];
                        remdNub = 3;
                    } else if (i == 6) {
                        urlID12Sel = urlID12[3];
                        remdNub = 3;
                    } else if (i == 7) {
                        urlID12Sel = urlID12[4];
                        remdNub = 3;
                    } else if (i == 2) {
                        urlID12Sel = urlID12[5];
                        remdNub = 30601;
                    }
                    str += '<a href="' + urlID12Sel + 'remd=' + remdNub + '&ID12=' + result.bannerMenuItem[i].id + '&page=1">' +
                        '<img src="' + result.bannerMenuItem[i].icon + '" width="84" height="84" alt=""/>' +
                        '<span>' + result.bannerMenuItem[i].name + '</span></a>';
                }
            } else {
                for (var i = 0; i < result.bannerMenuItem.length; i++) {
                    if (i == 0 || i == 1) {
                        urlID12Sel = urlID12[0];
                    } else if (i == 2) {
                        urlID12Sel = urlID12[1];
                    } else if (i == 3) {
                        urlID12Sel = urlID12[2];
                    }
                    str += '<a href="' + urlID12Sel + 'remd=3&ID12=' + result.bannerMenuItem[i].id + '&page=1">' +
                        '<img src="' + result.bannerMenuItem[i].icon + '" width="84" height="84" alt=""/>' +
                        '<span>' + result.bannerMenuItem[i].name + '</span></a>';
                }
            }
            iconbar.innerHTML = str;
        }

        //插入应用数据
        if (result.app && result.app.length) {
            for (var i = 0; i < result.app.length; i++) {

                if (result.app[i].id == '-100') {
                    appnomore = true;
                    common.getFooter("tabbar_main_top", 4);
                    break;
                } else {
                    createAppItem(result.app[i]);
                }
            }
            n = 1;
        } else {
            common.getFooter("tabbar_main_top", 4);
        }


    } else if (result.count == 0) {
        common.getFooter("tabbar_main_top", 4);
    }
}

//判断获得数据还是超时重载
function PromiseData() {
    Promise.race([getData(), nodeData()])
        .then(function(result) {
            apploading = false;
            common.removeAllLoad();
            // console.log(result);
            state = 0;
            //调用返回数据
            allDataApp(result);
        })
        .catch(function(result) {
            apploading = false;
            // alert("超时啦！");
            appData.pageno -= 1;
            state = 0;
            common.getFooter("tabbar_main_top", 2, 'PromiseData()');
        });
}

// 点击网路重载
function rePromiseData() {
    if (state == 0) {
        common.loadingState(appData.pageno || 1, "tabbar_main_top");
        PromiseData();
        state = 1;
    } else {
        alert("正在为您加载数据");
    }
}
// scroll
window.onscroll = function() {
    if (typeof appData != "undefined") {
        var Top = $(window).scrollTop() + 1000;
        var wH = $(window).height();
        var tH = $(document).height();
        var zH = Top + wH;
        if ((zH >= tH) && (n == 1)) {
            appData.pageno += 1;
            PromiseData();
            n = 2;
        }
    }
};