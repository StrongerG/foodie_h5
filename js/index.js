/**
 * 去除iOS橡皮筋效果
 */
document.body.addEventListener('touchmove', function (e) {
  e.preventDefault(); 
}, {passive: false});

/**
 * 信息提示
 */
var Core = window['Core'] || {};
Core.CONFIG = {
    TwinkTime: 70, //提示框闪烁时长
    TwinkCount: 3, //提示框闪烁次数
    MsgTimeout: 1000, //minmessage 自动隐藏时间
};

Core.Center = function(box, setting) {
    var mainBox = $(window);;
    var cut = 0,
        t = 0,
        l = 0;
    var cssT = (mainBox.height() - box.height()) / 2.2 + cut + t;
    var cssL = (mainBox.width() - box.width()) / 2 + cut + l;
    if (cssT < 0) {
        cssT = 0;
    }
    if (cssL < 0) {
        cssL = 0;
    }
    var st = document.documentElement.scrollTop || document.body.scrollTop;
    if (st) {
        cssT += st;
    }
    box.css({
        top: cssT,
        left: cssL
    });
}

Core.MinMessage = (function() {
    var _temp = '<div class="popup-hint" style="background-color:rgba(0,0,0,0.7);border-radius:0.3rem;position:fixed;top:9999px;lefe:9999px;z-index:9999999999;display:none;">' +
        '<i class="" rel="type"></i>' +
        '<em class="sl"><b></b></em>' +
        '<span class="desc" style="color:#fff;font-size: 0.8rem;padding: 0.3rem 1rem; line-height: 1.5rem; display:block;" rel="con"></span>' +
        '<em class="sr"><b></b></em>' +
        '</div>';
    var _cache = {
            Type: {
                "suc": "hint-icon hint-suc-m",
                "war": "hint-icon hint-war-m",
                "err": "hint-icon hint-err-m",
                "load": "hint-loader",
            }
        },
        _dom, _timer, timeout = 3000;

    //创建消息DOM
    var create = function(obj) {
        if (!_dom) {
            _dom = $(_temp);
            $(document.body).append(_dom);
        }
        _dom.find("[rel='con']").html(obj.text);
        var icon = _dom.find("[rel='type']");
        for (var k in _cache.Type) {
            icon.removeClass(_cache.Type[k]);
        }
        icon.addClass(_cache.Type[obj.type]);
        _dom.fadeIn(300);
        Core.Center(_dom);
    }

    //隐藏
    var hide = function() {
        if (_timer) {
            window.clearTimeout(_timer);
        }
        if (_dom) {
            _dom.fadeOut(300);
        }
    }

    return {
        Show: function(obj) {
            if (!obj.type) {
                obj.type = "war";
            }
            create(obj);
            if (_timer) {
                window.clearTimeout(_timer);
            }
            if (!obj.timeout) return;
            if (timeout) {
                _timer = window.setTimeout(hide, timeout);
            }
        },
        Hide: function() {
            if (_dom) {
                _dom.fadeOut(300);
            }
        }
    }
})();

/**
 *提示弹窗
 */
(function($, window, undefined) {
    $.extend($, {
        alertTip: function(text, container, timer) {
            if ($.isNumeric(container)) {
                timer = container;
                container = null;
            }
            if (top.window.Core && top.window.Core.MinMessage) {
                top.window.Core.MinMessage.Show({
                    text: text,
                    type: "war",
                    window: container ? { warp: container } : null,
                    timeout: timer || 2000
                });
            } else {
                alert(text);
            }
        },
        showTip: function (text, container) {
            top.window.Core.MinMessage.Show({
                text: text,
                type: "war",
                window: container ? { warp: container } : null
            });
        },
        closeTip: function() {
            top.window.Core.MinMessage.Hide();
        }
    });
}(jQuery, window));

/**
 * 判断横屏还是竖屏
 */
function orient() {
    if (window.orientation == 90 || window.orientation == -90) {
        //ipad、iphone竖屏；Andriod横屏
        $("body").attr("id", "landscape");
        return false;
    } else if (window.orientation == 0 || window.orientation == 180) {
        //ipad、iphone横屏；Andriod竖屏
        $("body").attr("id", "portrait");
        return false;
    }
}

var localStorages = {
    Get: function(key){
        if (window.localStorage && window.localStorage['getItem']) {
            if(key){
                return window.localStorage.getItem(key);
            }
        }
    },
    Set: function(key, value){
        if (window.localStorage && window.localStorage['setItem']) {
            if (value && value) {
                return window.localStorage.setItem(key, value);
            }               
        }

    },
    Clear: function(name) {
        if(name){
            window.localStorage.removeItem(name);
        }else{
            window.localStorage.clear();
        }
    }
};

//获取 url 的参数
function getQueryString (name) {
  //获取url中的参数
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
}

/**
 * 判断是否是安卓
 */
function _isAndroid() {
  var u = navigator.userAgent,
      isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端 
      isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
  if (isAndroid) return true;
  else return false;
}

/**
 * 图片加载处理
 */
function _loadImages(pics, callback, len) {
  len = len || pics.length;
  if (pics.length) {
      var IMG = new Image(),
          picelem = pics.shift();

      if (window._pandaImageLoadArray) {
          window._pandaImageLoadArray = window._pandaImageLoadArray
      } else {
          window._pandaImageLoadArray = [];
      }
      window._pandaImageLoadArray.push(picelem);
      IMG.src = picelem;
      // 从数组中取出对象的一刻，就开始变化滚动条
      _drawLoadProgress(window._pandaImageLoadArray.length / (len * len));
      // 缓存处理
      if (IMG.complete) {
          window._pandaImageLoadArray.shift();
          return _loadImages(pics, callback, len);
      } else {
          // 加载处理
          IMG.onload = function () {
              window._pandaImageLoadArray.shift();
              IMG.onload = null; // 解决内存泄漏和GIF图多次触发onload的问题
          }
          // 容错处理 todo 应该如何处理呢?
          // 目前是忽略这个错误，不影响正常使用
          IMG.onerror = function () {
              window._pandaImageLoadArray.shift();
              IMG.onerror = null;
          }
          return _loadImages(pics, callback, len);
      }
      return;
  }
  if (callback) _loadProgress(callback, window._pandaImageLoadArray.length, len);
}

/**
 * 监听实际的加载情况
 */
function _loadProgress(callback, begin, all) {
  var loadinterval = setInterval(function () {
      if (window._pandaImageLoadArray.length != 0 && window._pandaImageLoadArray.length != begin) {
          _drawLoadProgress((begin - window._pandaImageLoadArray.length) / all);
      } else if (window._pandaImageLoadArray.length == 0) {
          _drawLoadProgress(1)
          setTimeout(function () {
              callback.call(window);
          }, 500);
          clearInterval(loadinterval);
      }
  }, 300);
}

/**
 * 进度条百分比
 */
function _drawLoadProgress(w) {
  var num = Math.floor(w * 100) >= 100 ? 100 : Math.floor(w * 100) + 1;
  $('').html(num);    //加载页百分比文字
  $('').css({'width': (num)+'%' });   //加载页进度条百分比
}
  var cdnurl='https://img.xhangjia.com/h5/2018/10/foodie/';     //图片地址链接
  var pics = [
      cdnurl + 'loading.png',
      cdnurl + 'loading-icon.png',
      cdnurl + 'music-on.png',
      cdnurl + 'music-off.png',

      cdnurl + 'arrow.png',
      cdnurl + 'background.png',
      cdnurl + 'balloon-blue.png',
      cdnurl + 'balloon-orange.png',
      cdnurl + 'balloon-purple.png',
      cdnurl + 'cat.png',
      cdnurl + 'light.png',
      cdnurl + 'machine.png',
      cdnurl + 'people-EAT.png',
      cdnurl + 'people-red.png',
      cdnurl + 'rocker.png',
      cdnurl + 'tip.png',

      cdnurl + 'p2-background.png',
      cdnurl + 'p2-btn.png',
      cdnurl + 'p2-close.png',
      cdnurl + 'p2-rocker-tip1.png',
      cdnurl + 'p2-rocker.png',
      cdnurl + 'p2-selected.png',
      cdnurl + 'p2-tableware-ceramics1.png',
      cdnurl + 'p2-tableware-silver1.png',
      cdnurl + 'p2-tableware-wood1.png',
      cdnurl + 'p2-tip1.png',

      cdnurl + 'p3-background.png',
      cdnurl + 'p3-balloon-blue.png',
      cdnurl + 'p3-balloon-orange.png',
      cdnurl + 'p3-balloon-purple.png',
      cdnurl + 'p3-bottomimg1.png',
      cdnurl + 'p3-bottomimg2.png',
      cdnurl + 'p3-bottomimg3.png',
      cdnurl + 'p3-btn.png',
      cdnurl + 'p3-lv1.png',
      cdnurl + 'p3-lv2.png',
      cdnurl + 'p3-lv3.png',
      cdnurl + 'p3-lv4.png',
      cdnurl + 'p3-lv5.png',
      cdnurl + 'p3-lv6.png',
      cdnurl + 'p3-result-tip1.png',
      cdnurl + 'p3-result.png',
      cdnurl + 'p3-rim.png',
      cdnurl + 'p3-story-btn1.png',
      cdnurl + 'p3-story-tip.png',
      cdnurl + 'p3-story.png',
      cdnurl + 'p3-text.png',
      cdnurl + 'p3-title.png',

      cdnurl + 'ReportImg.png',
      cdnurl + 'story-food-s-hhj.png',
      cdnurl + 'story-food-s-hjbc.png',
      cdnurl + 'story-food-s-hslxr.png',
      cdnurl + 'story-food-s-jzym.png',
      cdnurl + 'story-food-s-qtdth.png',
      cdnurl + 'story-food-s-sfjzs.png',
      cdnurl + 'story-food-s-tgjjrg.png',
      cdnurl + 'story-food-s-wsgyt.png',
      cdnurl + 'story-food-s-xbmhlm.png',
      cdnurl + 'story-food-s-xhky.png',
      cdnurl + 'story-food-s-ymdg1.png',
      cdnurl + 'tablewareimg-ceramics.png',
      cdnurl + 'tablewareimg-silver.png',
      cdnurl + 'tablewareimg-wood.png',

      cdnurl + 'food-cf.png',
      cdnurl + 'food-chf.png',
      cdnurl + 'food-gqmx.png',
      cdnurl + 'food-hmj.png',
      cdnurl + 'food-kc.png',
      cdnurl + 'food-klm.png',
      cdnurl + 'food-krbf.png',
      cdnurl + 'food-lp.png',
      cdnurl + 'food-rgm.png',
      cdnurl + 'food-rjm.png',
      cdnurl + 'food-s-hhj.png',
      cdnurl + 'food-s-hjbc.png',
      cdnurl + 'food-s-hslxr.png',
      cdnurl + 'food-s-jzym.png',
      cdnurl + 'food-s-qtdth.png',
      cdnurl + 'food-s-sfjzs.png',
      cdnurl + 'food-s-tgjjrg.png',
      cdnurl + 'food-s-wsgyt.png',
      cdnurl + 'food-s-xbmhlm.png',
      cdnurl + 'food-s-xhky.png',
      cdnurl + 'food-s-ymdg.png',
      cdnurl + 'food-sjb.png',
      cdnurl + 'food-slf.png',
      cdnurl + 'food-szb.png',
      cdnurl + 'food-yxfs.png',
      cdnurl + 'food-zcbf.png',
      cdnurl + 'food-zjp.png',

      cdnurl + 'logo-cova.png',
      cdnurl + 'logo-hjyy.png',
      cdnurl + 'logo-hsz.png',
      cdnurl + 'logo-jtwe.png',
      cdnurl + 'logo-mzdp.png',
      cdnurl + 'logo-tg.png',
      cdnurl + 'logo-wsg.png',
      cdnurl + 'logo-xb.png',
      cdnurl + 'logo-xbmh.png',
      cdnurl + 'logo-xh.png',
      cdnurl + 'logo-xng.png',
      cdnurl + 'bgmusic.mp3',

      cdnurl + 'lv1.png',
      cdnurl + 'lv2.png',
      cdnurl + 'lv3.png',
      cdnurl + 'lv4.png',
      cdnurl + 'lv5.png',
      cdnurl + 'lv6.png',


      cdnurl + 'p3-story-logo1.png',
      cdnurl + 'p3-story-logo2.png',
      cdnurl + 'p3-story-logo3.png',
      cdnurl + 'p3-story-logo4.png',
      cdnurl + 'p3-story-logo5.png',
      cdnurl + 'p3-story-logo6.png',
      cdnurl + 'p3-story-logo7.png',
      cdnurl + 'p3-story-logo8.png',
      cdnurl + 'p3-story-logo9.png',
      cdnurl + 'p3-story-logo10.png',
      cdnurl + 'p3-story-logo11.png'
      
  ];

/**
 * 音乐播放
 */
var music = document.getElementById("Music");
function autoPlayMusic() {
  // 自动播放音乐效果，解决浏览器或者APP自动播放问题
  function musicInBrowserHandler() {
      musicPlay(true);
      document.body.removeEventListener('touchstart', musicInBrowserHandler);
  }
  document.body.addEventListener('touchstart', musicInBrowserHandler);
  // 自动播放音乐效果，解决微信自动播放问题
  function musicInWeixinHandler() {
      musicPlay(true);
      document.addEventListener("WeixinJSBridgeReady", function () {
          musicPlay(true);
      }, false);
      document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
  }
  document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
  musicInBrowserHandler();
  musicInWeixinHandler();
}
function musicPlay(isPlay) {
  if (isPlay && music.paused) {
      music.play();
  }
  if (!isPlay && !music.paused) {
      music.pause();
  }
}
autoPlayMusic();

/**
 * 手动点击音乐播放与关闭
 */
$(".music_icon").on("touchstart", function () {
    if ($(this).hasClass("mute")) {
        $(this).removeClass("mute");
        music.play();
    } else {
        $(this).addClass("mute");
        music.pause();
    }
    return false;
});

/**
 * [微信分享]
 * @param  {[type]} shareTitle [分享标题及朋友圈文案]
 * @param  {[type]} shareDesc  [分享描述]
 * @param  {[type]} link       [分享链接]
*/
function wxShare(shareTitle,shareDesc,link){
  if(!link){ var link = location.href; }
  var uri = window.location.href.split("#")[0];
  $.post("//h5.xhangjia.com/wxapi.php", {   //微信api
    uri: uri
  }, function (data) {
      data = eval("(" + data + ")");
      var apilist = [
          'onMenuShareTimeline',
          'onMenuShareAppMessage'
      ];
      wx.config({
          debug: false,
          appId: data.appid,
          timestamp: data.timestamp,
          nonceStr: data.noncestr,
          signature: data.signature,
          jsApiList: apilist
      });

      wx.ready(function () {

        // var scores = $('.p3-story-btn').attr('scores');
        // if (scores <= 25) {
        //   var shareTitle = '原来我是一个洒脱型吃货'
        //   var shareDesc = '人生得意须尽欢，冷热酸甜啥都来。'
        // }if (scores >= 35 && scores <= 40) {
        //   var shareTitle = '原来我是一个执念型吃货'
        //   var shareDesc = '喜欢的歌就要单曲循环，喜欢的菜就要吃到腻。'
        // }if (scores >= 50 && scores <= 65) {
        //   var shareTitle = '原来我是一个反转型吃货'
        //   var shareDesc = '美食铁律：那些不敢轻易尝试的美食， 尝过之后都会爱上！'
        // }if (scores >= 70 && scores <= 85) {
        //   var shareTitle = '原来我是一个养生型吃货'
        //   var shareDesc = '红枣枸杞养生餐，从不轻易尝试路边摊。'
        // }if (scores == 95) {
        //   var shareTitle = '原来我是一个安利型吃货'
        //   var shareDesc = '自带安利体质，终极目标就是带动周围人一起胖。'
        // }if (scores == 100) {
        //   var shareTitle = '原来我是一个精致型吃货'
        //   var shareDesc = '吃不是生理需求，是一日三餐的生活仪式。'
        // }

        // 分享给朋友事件绑定
        wx.onMenuShareAppMessage({
            title: shareTitle,
            desc: shareDesc,
            link: link,
            imgUrl: 'https://img.xhangjia.com/h5/2018/10/foodie/wximg.jpg',   //分享的缩略图
            success: function () { 

            }
        });

        // 分享到朋友圈
        wx.onMenuShareTimeline({
            title:shareTitle,
            link: link,
            imgUrl: 'https://img.xhangjia.com/h5/2018/10/foodie/wximg.jpg',   //分享的缩略图
            success: function () { 

            }
        });
      })
  });
}
// var redirect_uri = 'https://h5.xhangjia.com/2018/10/foodie/index.html';

//获取openid
var OPENID = getQueryString('openid'); 

// 获取用户授权信息
$(function() {

  // 测试用的
  var wxInfo = {
      "openid": "o47Fa0mp9SRTf3eiKmqWm69BjG_8",
      "nickname": "十分大胆",
      "sex": 0,
      "language": "zh_CN",
      "city": "梅州",
      "province": "广东",
      "country": "CN",
      "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/vjMMw0U3GlNSO6jrGCviaj57pBYM6fkaLO5rIkHBibsdrON9iaTkkYaVxBo9Btib2VQR6P9rFu2nia42eTVZFiaQNic2w/132",
      // "headimgurl":"images/wximg.jpeg",
      "privilege": []
  };
  allStartFun(wxInfo);
  return;


  // 获取微信用户信息
  // if( OPENID ){
  //     var redirect_uri = 'https://h5.xhangjia.com/2018/10/foodie/index.html?openid=' + OPENID;
  // } else{
  //     var redirect_uri = 'https://h5.xhangjia.com/2018/10/foodie/index.html';
  // }
  // var wxurl = 'weixin://https://h5.xhangjia.com/2018/10/foodie/index.html'
  // var oauth2Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd950f35d1f20806a&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
  // if(localStorages.Get("nlpUserInfo")){
  //     var info = JSON.parse(localStorages.Get("nlpUserInfo"));
  //     if(info && info.headimgurl){
  //       allStartFun(info);
  //     }else{
  //       window.location.href = oauth2Url;
  //     }
  // }else{
  //     if (getQueryString("code")) {
  //         var code = getQueryString("code");
  //         $.ajax({
  //             url: 'api/user.php',
  //             type: 'GET',
  //             dataType: 'json',
  //             data: { code: code },
  //             success: function(res) {
  //               if(res.headimgurl){
  //                 localStorages.Set("nlpUserInfo",JSON.stringify(res));
  //                 allStartFun(res);
  //               }else{
  //                 window.location.href = oauth2Url;
  //               }
  //             }                
  //         });
  //     }else{
  //       var info = JSON.parse(localStorages.Get("nlpUserInfo"));
  //       if(info && info.headimgurl){
  //         allStartFun(info);
  //       }else{
  //         window.location.href = oauth2Url;
  //       }
  //     }
  // }

});


var fArr = [];

// 所有逻辑函数
var allStartFun = function(wxInfo){
  wxShare('吃货鉴定所','快来发现你内心隐藏的吃货属性。')
  /**
   * 图片预加载完成后载入的页面
   */
  _loadImages(pics, function(){
    console.log('加载完毕...');
    $('.loading').fadeOut(800);
    $('.page1').fadeIn(800);
    setTimeout(function() {
      $('.music').css('animation', 'rotation 5s linear infinite');
    }, 700);
  });

  //手动点击音乐播放与关闭
  $(".music").on("touchstart", function () {
      if ($(this).hasClass("mute")) {
          $(this).removeClass("mute");
          $(".music-on").removeClass("music-off")
          music.play();
      } else {
          $(this).addClass("mute");
          $(".music-on").addClass("music-off")
          music.pause();
      }
      return false;
  });

  // page1
  $('.Start').on('click',function() {
    $('.rocker').addClass('rocker-animation');
    setTimeout(function(){
      $('.page1').fadeOut(1000);
      $('.page2').fadeIn(1500);
    },300)
    setTimeout(function(){
      $('.rocker').removeClass('rocker-animation');
    },1300)
  });



  // page2

  // 换一组
  $('.p2-rocker').bind('click',function() {
    $('.p2-rocker').css('top', '5rem');
    $('.p2-rocker-tip').fadeOut(300);
    setTimeout(function(){
      $('.p2-rocker').css('top', '0.8rem');
      $('.p2-rocker-tip').fadeIn(500)
    },300);

    var number = $(this).attr('data-number');

    if (number >= 27) {
      $(this).attr('data-number', 4);

      $('.food-list').hide();
      $('.food-list:lt(4)').show();
      return false;
    } else {
      var newnumber = parseInt(number)+4;
      $(this).attr('data-number', newnumber);
      $('.food-list:lt('+newnumber+')').show();
      $('.food-list:lt('+number+')').hide();
    }
  });


  $('.p2-tableware').on('click', 'li', function() {

    var number = $(this).attr('number');
    var tablewarecdn = null;
    $(".p2-tableware ul li .p2-tableware-inner").css('transform',"scale(1)");
    $(this).find('.p2-tableware-inner').css('transform','scale(1.2)');

    // if (mode == "yes") {
    //   $(this).addClass('p2-tableware-animation')
    // } else {
    //   $(this).removeClass('p2-tableware-animation')
    // }
    $(".activation-tableware").attr("pid",number);
    if (number == "1") {
      $('.tableware-icon').addClass('tableware-icon-ceramics');
      $('.tableware-icon').addClass('tableware-icon-animation');

      setTimeout(function(){
        $('.tableware-icon').removeClass('tableware-icon-animation');
      },500)
      $('.tableware-icon').removeClass('tableware-icon-silver');
      $('.tableware-icon').removeClass('tableware-icon-wood');
      tablewarecdn = 'https://img.xhangjia.com/h5/2018/10/foodie/tablewareimg-ceramics.png';
    }
    if (number == "2") {
      $('.tableware-icon').addClass('tableware-icon-silver');
      $('.tableware-icon').addClass('tableware-icon-animation');
      setTimeout(function(){
        $('.tableware-icon').removeClass('tableware-icon-animation');
      },500)
      $('.tableware-icon').removeClass('tableware-icon-ceramics');
      $('.tableware-icon').removeClass('tableware-icon-wood');
      tablewarecdn = 'https://img.xhangjia.com/h5/2018/10/foodie/tablewareimg-silver.png';
    }
    if (number == "3") {
      $('.tableware-icon').addClass('tableware-icon-wood');
      $('.tableware-icon').addClass('tableware-icon-animation');
      setTimeout(function(){
        $('.tableware-icon').removeClass('tableware-icon-animation');
      },500)
      $('.tableware-icon').removeClass('tableware-icon-ceramics');
      $('.tableware-icon').removeClass('tableware-icon-silver');
      tablewarecdn = 'https://img.xhangjia.com/h5/2018/10/foodie/tablewareimg-wood.png';
    }

    // var imgSrc = $(".activation-tableware .tableware-icon").css("background-image");
    $(".tablewareimg img").attr('src',tablewarecdn);
  });

  // 数据乱序方法
  function arrayRandomSort(array) {
      var index = array.length;
      //开始遍历
      for (var i = array.length; i > 0; i--) {
          var random = parseInt(Math.random() * index);
          index--;
          //交换位置
          var last = array[index];
          array[index] = array[random];
          array[random] = last;
      }
      return array;
  }

  //判断数组是否存在
  function isInArray(arr,value){
      for(var i = 0; i < arr.length; i++){
          if(value === arr[i]){
              return true;
          }
      }
      return false;
  }

  //生成从minNum到maxNum的随机数
  function randomNum(minNum,maxNum){ 
      switch(arguments.length){ 
          case 1: 
              return parseInt(Math.random()*minNum+1,10); 
          break; 
          case 2: 
              return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
          break; 
              default: 
                  return 0; 
              break; 
      } 
  }

  $(function () {
    $('.p2-food-box ul').html(arrayRandomSort($('.food-list')));
    $('.food-list:lt(4)').show();
  })   


  
  $('.p2-food-box').on('click', 'li', function() {
      var dataId = $(this).attr("data-id");
      if(fArr.length >=4){return false;}
      if(!isInArray(fArr,dataId)){
        $(this).find(".selected").show();
        var imgSrc = $(this).find(".food-icon img").attr("src");
        var html = '<li class="activation-item fdp_item" data-id="'+dataId+'"><div class="close"></div><div class="food-icon"><img src="'+imgSrc+'" alt=""></div></div></li>';    
        $(".p2-activation-box ul").append(html);
        fArr.push(dataId);
      }
      
  });

  $(".p2-activation-box").on("click",'.close',function(){
      var dataId = $(this).parents("li").attr("data-id");
      $(this).parents('li').remove();
      var index = fArr.indexOf(dataId);
      fArr.splice(index, 1);
      $(".p2-food-box li[data-id="+dataId+"]").find(".selected").hide();
      // console.log(fArr);
  })

  
  // 确认选餐
  $('#Done').on('click',function() {
    window.location.href = 'https://baidu.com'

    var pid = $(".activation-tableware").attr("pid");
    var isStar = false;
    var fArrIndex = 0;
    var score = 0;
    var imgArr = [];
    var rnd = randomNum(1,11);
    var tablecloth = randomNum(1,3);

    if (!fArr.length) {
      $.alertTip('请先选择您喜欢的餐具和菜品')
      return false;
    } else {
      if (fArr.length < 4 || pid == '') {
        $.alertTip('请先选择足够的餐具和菜品')
        return false;
      }
    }

    $('.page2').fadeOut(1000);
    $('.loading2').fadeIn(1500);

    // setTimeout(function(){
      
    //   makePhoto();
    // },2000)
    // var pid = $(".activation-tableware").attr("pid");

    if(pid == 1){
      score += 20
    }else if(pid == 2){
      score += 15
    }else if(pid == 3) {
      score += 5
    }

    $(".p3-story-food .sf_icon_item").hide();
    $(".p3-story-text .sf_text_item").hide();
    $(".p3-story-food .sf_icon_item[data-id="+rnd+"]").show();
    $(".p3-story-text .sf_text_item[data-id="+rnd+"]").show();
    
    $.each(fArr,function(index,item){
      var imgSrc = $(".p2-food-box li[data-id="+item+"]").find(".food-icon img").attr("src");
      if($(".p2-food-box li[data-id="+item+"]").hasClass('star')){
        score += 20;
        if(!isStar){
          fArrIndex = index;
          isStar = true;
        }else{
          imgArr.push(imgSrc);
        }
      }else{
        score += 5;
        imgArr.push(imgSrc);
      }
      
    })

    
    if(isStar){
      var starSrc = $(".p2-food-box li[data-id="+fArr[fArrIndex]+"]").find(".food-icon img").attr("src");
      $(".page3 .p3-bottomimg .foodimg-big img").attr('src',starSrc);
      $('.p3-story-logo img').attr('src','https://img.xhangjia.com/h5/2018/10/foodie/p3-story-logo'+fArr[fArrIndex]+'.png')
      $(".p3-story-food .sf_icon_item").hide();
      $(".p3-story-text .sf_text_item").hide();
      $(".p3-story-food .sf_icon_item[data-id="+fArr[fArrIndex]+"]").show();
      $(".p3-story-text .sf_text_item[data-id="+fArr[fArrIndex]+"]").show();
    }else{
      $(".page3 .p3-bottomimg .foodimg-big img").attr('src',imgArr[3]);
    }

    $(".page3 .p3-bottomimg").attr('class', 'p3-bottomimg p3-bottomimg'+tablecloth);

    $.each(imgArr,function(index,item){
      $(".page3 .fr_small_item img").eq(index).attr('src',item);
    })

    $('.p3-story-btn').attr('scores', score);
    // var scores = $('.p3-story-btn').attr('scores');
    // console.log(scores);
    if (score <= 25) {
      console.log("洒脱");
      $('.p3-lv1').show();
      wxShare('原来我是一个洒脱型吃货， “人生得意须尽欢，冷热酸甜啥都来。“','快来发现你内心隐藏的吃货属性。')
    }if (score >= 35 && score <= 40) {
      console.log("执念");
      $('.p3-lv2').show();
      wxShare('原来我是一个执念型吃货，“喜欢的歌就要单曲循环，喜欢的菜就要吃到腻。“','快来发现你内心隐藏的吃货属性。')
    }if (score >= 50 && score <= 65) {
      console.log("反转");
      $('.p3-lv3').show();
      wxShare('原来我是一个反转型吃货，“美食铁律：那些不敢轻易尝试的美食， 尝过之后都会爱上！“','快来发现你内心隐藏的吃货属性。')
    }if (score >= 70 && score <= 85) {
      console.log("养生");
      $('.p3-lv4').show();
      wxShare('原来我是一个养生型吃货，“红枣枸杞养生餐，从不轻易尝试路边摊。“','快来发现你内心隐藏的吃货属性。')
    }if (score == 95) {
      console.log("安利");
      $('.p3-lv5').show();
      wxShare('原来我是一个安利型吃货，“自带安利体质，终极目标就是带动周围人一起胖。”','快来发现你内心隐藏的吃货属性。')
    }if (score == 100) {
      console.log("精致");
      $('.p3-lv6').show();
      wxShare('原来我是一个精致型吃货，“吃不是生理需求，是一日三餐的生活仪式。“','快来发现你内心隐藏的吃货属性。')
    }
    makePhoto(tablecloth);
  });

  function makePhoto(cloth){
    // 场景
    var Scene = spritejs.Scene;
    // 分组容器
    var Group = spritejs.Group;
    // 一般
    var Sprite = spritejs.Sprite;
    // 文字
    var Label = spritejs.Label;
    // 微信信息
    var name = wxInfo.nickname;

    var scene = new Scene('#container', {
      resolution: [550, 892],
    });

    var layer = scene.layer();

    var group = new Group();

    var foodbig = $('.foodimg-big img').attr("src")
    var food1 = $('.foodimg-1 img').attr("src")
    var food2 = $('.foodimg-2 img').attr("src")
    var food3 = $('.foodimg-3 img').attr("src")
    var tableware = $('.tablewareimg img').attr("src")

    // 主图与等级文案
    var scores = $('.p3-story-btn').attr('scores');
    if (scores <= 25) {
      var imgUrl = 'https://img.xhangjia.com/h5/2018/10/foodie/lv1.png'
    }if (scores >= 35 && scores <= 40) {
      var imgUrl = 'https://img.xhangjia.com/h5/2018/10/foodie/lv2.png'
    }if (scores >= 50 && scores <= 65) {
      var imgUrl = 'https://img.xhangjia.com/h5/2018/10/foodie/lv3.png'
    }if (scores >= 70 && scores <= 85) {
      var imgUrl = 'https://img.xhangjia.com/h5/2018/10/foodie/lv4.png'
    }if (scores == 95) {
      var imgUrl = 'https://img.xhangjia.com/h5/2018/10/foodie/lv5.png'
    }if (scores == 100) {
      var imgUrl = 'https://img.xhangjia.com/h5/2018/10/foodie/lv6.png'
    }
    var photoImg = new Sprite(imgUrl);
    photoImg.attr({
      pos: [0,0],
      scale: 1,
    });
    //桌布
    var tableCloth = new Sprite('https://img.xhangjia.com/h5/2018/10/foodie/p3-bottomimg'+cloth+'.png');
    tableCloth.attr({
      pos: [26,149],
      scale: 1,
    });


    // 名字
    var wxName = new Label(name);
    wxName.attr({
      pos:[111,25],
      font: 'bold 46px Arial',
      width:400,
      lineHeight: 58,
      lineBreak:'none',
      fillColor: '#6f737a',
    });

    // 星选菜
    var foodbigImg = new Sprite(foodbig);
    foodbigImg.attr({
      size: [215, 215],
      pos: [142,272],
      scale: 1,
    });

    // 普通菜1
    var food1Img = new Sprite(food1);
    food1Img.attr({
      size: [88, 101],
      pos: [52,222],
      scale: 1,
    });

    // 普通菜2
    var food2Img = new Sprite(food2);
    food2Img.attr({
      size: [124, 124],
      pos: [129,160],
      scale: 1,
    });

    // 普通菜3
    var food3Img = new Sprite(food3);
    food3Img.attr({
      size: [125, 125],
      pos: [284,160],
      scale: 1,
    });

    // 餐具
    var tablewareImg = new Sprite(tableware);
    tablewareImg.attr({
      size: [83, 183],
      pos: [364,286],
      scale: 1,
    });

    //所有图片合成
    group.append(photoImg,tableCloth,wxName,food1Img,food2Img,food3Img,tablewareImg,foodbigImg);
    // 拼合 end

    // 生成
    setTimeout(function(){
      layer.append(group);
    },1500)

    // 赋予地址
    setTimeout(function(){
      var img = new Image();
      img.src = layer.canvas.toDataURL('image/jpeg', 1);
      img.onload = function(){
        $('#ReportImg').attr('src', img.src);
        $('.loading2').fadeOut(1000);
        $('.page3').fadeIn(1500);
      }
    },3000)
  }



  // page3
  // 关闭浮层
  $('#Close').bind('click', function() {
    $('.p3-story').addClass('story-animation');
    setTimeout(function(){
      $('.p3-story').hide();
    },1000)
  });

  // 关闭浮层
  $('#Close2').bind('click', function() {
    $('.p3-story').addClass('story-animation');
    setTimeout(function(){
      $('.p3-story').hide();
    },1000)
  });

  // 名字
  var name = wxInfo.nickname
  $('#UserName').html(name);

  // 再测一次
  $('#Reset').bind('click', function() {
    fArr = [];
    // score = 0;
    // imgArr = [];
    $(".activation-tableware").attr("pid","");
    $(".p2-food-box li .selected").hide();
    $(".p2-activation-box .fdp_item").remove();
    $('.tableware-icon').removeClass('tableware-icon-silver');
    $('.tableware-icon').removeClass('tableware-icon-wood');
    $('.tableware-icon').removeClass('tableware-icon-ceramics');
    $(".p2-tableware ul li .p2-tableware-inner").css('transform',"scale(1)");
    $('.page3').fadeOut(1000,function(){
      $('.p3-rim').find('div').hide();
      $('.p3-story-logo img').attr('src','');
    });
    $('.page2').fadeIn(1500);
  });
}
