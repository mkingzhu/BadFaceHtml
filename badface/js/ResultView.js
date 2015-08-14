/**
 * Created by guoshencheng on 7/9/15.
 */
/**
*Url format
*http://localhost:8080/ResultView.html?backgroundId=4&imageUrl=url
 * background can be nil
 * if background is nil we get a random number for bakgroundImage
**/
var backgroundImageUrlsArray = ["img/result_view_background_image1.png",
                                "img/result_view_background_image2.png",
                                "img/result_view_background_image3.png",
                                "img/result_view_background_image4.png",
                                "img/result_view_background_image5.png",
                                "img/result_view_background_image6.png",
                                "img/result_view_background_image7.png"];
var titleArray = ['颜值爆表！恋爱时！我靠"脸"征服男神！',
                  '才华爆表！恋爱时！我靠"才华"征服男神！',
                  '善良爆表！恋爱时！我靠"善良"征服男神！',
                  '萌值爆表！恋爱时！我靠"卖萌"征服男神！',
                  '性感爆表！恋爱时！我靠"性感"征服男神！',
                  '威严爆表！恋爱时！我靠"威严"征服男神！',
                  '运气爆表！恋爱时！我靠"运气"征服男神！'];
var backgourndImage = document.getElementById("background-image");
var avatarImage = document.getElementById("avatar-image");
var startButton = document.getElementById("start_button");
var shareLeadingMask = document.getElementById("share_leading_mask");
var shareLeadingView = document.getElementById("share_leading_view");
var viewport = document.querySelector("meta[name=viewport]");
var winWidths= window.innerWidth;
var densityDpi=608/winWidths;
densityDpi= densityDpi>1?300*608*densityDpi/608:densityDpi;
if(isWeixin()){
    viewport.setAttribute('content', 'width=608, target-densityDpi='+densityDpi);
}else{
    viewport.setAttribute('content', 'width=608, user-scalable=no');
    window.setTimeout(function(){
        viewport.setAttribute('content', 'width=608, user-scalable=yes');
    },1000);
}
function isWeixin(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

var Request = GetRequest();
var imageUrl = Request['imageUrl'];
var lastAction = cookie('lastAction');
var backgroundId = Request['backgroundId'];
if (!backgroundId && ('rule' == lastAction || 'result' == lastAction)) {
    backgroundId = cookie('backgroundId');
}
if (backgroundId) {
    backgourndImage.src = backgroundImageUrlsArray[backgroundId] + '?time=' + new Date().getTime();
} else {
    var randomId = Math.round(Math.random()*6);
    backgourndImage.src = backgroundImageUrlsArray[randomId] + '?time=' + new Date().getTime();
    backgroundId = randomId;
}
cookie('lastAction', 'result', { expires: 365, path: '/' });
cookie('backgroundId', backgroundId, { expires: 365, path: '/' });

backgourndImage.onload = function () {
    configurAllContext();

    wx.config(wxConfig);
    wx.ready(function () {
        var cfg = {
            title: titleArray[backgroundId],
            link: window.location.href + "&backgroundId=" + backgroundId, //use url Format
            imgUrl: imageUrl //use imageUrl
        };
        wx.onMenuShareTimeline(cfg);
        wx.onMenuShareAppMessage(cfg);
    });
    wx.error(function (res) {
        alert(res.errMsg);
    });
}

function configurAllContext () {
    fixBackgroundPosition();
    configureStartButton();
    avatarImage.onload = function () {
        fixAvatarPosition();
    }
    avatarImage.src = imageUrl;
    configureShareLeadingView();
}

function configureShareLeadingView () {
    shareLeadingMask.onclick = function () {
        shareLeadingMask.style.display = "none";
    }
    var isShowed = cookie('isShowed');
    if ('takePhoto' == lastAction && !isShowed) {
        shareLeadingView.style.left = (shareLeadingMask.offsetWidth - shareLeadingView.width) / 2 + "px";
        shareLeadingView.style.display = "inherit";
        cookie('isShowed', 'true', { expires: 365, path: '/' });
    } else {
        shareLeadingMask.style.display = "none";
    }
}

function fixBackgroundPosition () {
    backgourndImage.style.left = (document.body.offsetWidth - backgourndImage.width ) / 2 + "px";
}

function fixAvatarPosition () {
    avatarImage.style.width = backgourndImage.offsetHeight * (265 / 1645) + "px";
    avatarImage.style.height = backgourndImage.offsetHeight * (265 / 1645) + "px";
    avatarImage.style.left = (document.body.offsetWidth - avatarImage.width ) / 2 + "px";
    avatarImage.style.top = backgourndImage.offsetTop + backgourndImage.offsetHeight * (405 / 1645) + "px";
}

function configureStartButton () {
    startButton.style.top = (850 / 1645) * backgourndImage.offsetHeight + "px";
    startButton.style.width = (320 / 1645) * backgourndImage.offsetHeight + "px";
    startButton.style.height = (70 / 1645) * backgourndImage.offsetHeight + "px";
    startButton.style.left = (document.body.offsetWidth - startButton.offsetWidth) / 2 + "px";
    startButton.style.opacity = 1;
}

startButton.onclick = function () {
    window.location.href = "TakePhotoView.htm";
};

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
