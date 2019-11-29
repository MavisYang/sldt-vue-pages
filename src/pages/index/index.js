import '@/app';
import './index.scss';
import $ from 'jquery';
import { popup as Popup, wxShare, isWeixin, isIOS, isAndroid, getUrlParam } from '@/utils';

const $footer = $('#footer');
const $footerBtn = $('.panel', $footer);
// 底部按钮显示隐藏
function toggleFooter () {
  const scrollTop = $(window).scrollTop();
  if (scrollTop > $footer.height() || (scrollTop + $(window).innerHeight() > $footer.offset().top)) {
    $footerBtn.fadeIn();
  } else {
    $footerBtn.fadeOut();
  }
}
$(window).on('scroll resize load', toggleFooter);

// 弹框
const DowloadPopup = Popup({
  el: '#download-popup',
  closeBtn: true,
  preventTouchmove: true
});
// 引导弹框
const GuidePopup = Popup({
  el: '#guide-popup',
  position: '',
  effect: false,
  preventTouchmove: true
});

// 显示弹框
$('#main').on('click', function () {
  DowloadPopup.show();
});
// 点击打开App按钮
$('.open-app-btn').on('click', function () {
  // 如果是微信则弹出引导层
  if (isWeixin()) {
    $('img', GuidePopup.el).hide(0);
    if (isIOS()) {
      $('.ios', GuidePopup.el).css('display', 'block');
    } else if (isAndroid()) {
      $('.android', GuidePopup.el).css('display', 'block');
    }
    GuidePopup.show();
  } else {
    // 浏览器则直接打开app对应的详情页
    window.location.href = 'huagong://openapp/circle_detail?id=' + getUrlParam('forum_id');
  }
});

// 点击下载App按钮
$('.download-app-btn').on('click', function () {
  // 如果是ios则直接去App Store
  if (isIOS()) {
    window.location.href = 'https://apps.apple.com/cn/app/id1113951649';
  }
  // 如果是安卓
  if (isAndroid()) {
    // 如果是微信则跳转到介绍页
    if (isWeixin()) {
      // 跳转到介绍页
      window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.molbase.contactsapp';
    } else {
      // 浏览器则直接下载apk包
      window.location.href = 'http://contact-api.molbase.cn/download/appdownload';
    }
  }
});

// 分享
wxShare({
  title: $('#shareTitle').text(),
  link: location.href,
  desc: $('#shareDesc').text(),
  imgUrl: $('#shareImgUrl').attr('src')
});
