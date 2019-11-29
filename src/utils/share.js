import wx from 'weixin-js-sdk';
import { Get } from './request';
import { isWeixin } from './index';

// 微信分享
export function wxShare (options = {
  title: '',
  link: '',
  desc: '',
  imgUrl: ''
}) {
  if (isWeixin()) {
    Get('/1.0/wechat/js_sdk/config?url=' + encodeURIComponent(location.href)).then(res => {
      wx.config(res.js_config);
      wx.ready(() => {
        // wechat moment
        wx.onMenuShareTimeline(options);
        // wechat friend
        wx.onMenuShareAppMessage(options);
        // Weibo
        wx.onMenuShareWeibo(options);
        // QZone
        wx.onMenuShareQZone(options);
      });
      wx.error(res => {
        alert('分享：' + JSON.stringify(res));
      });
    });
  }
}
