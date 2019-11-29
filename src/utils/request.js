import axios from 'axios';
import { toast as Toast, protoType, extend, regExp, joinPath } from './index';
import { SERVER_HOST } from '@/api/config';
import getToken from './getToken';

const Loading = (() => {
  let count = 0;
  let instance;

  return {
    show (message) {
      count++;
      instance = Toast.loading(message);
    },
    hide () {
      if (count > 0 && !--count) {
        setTimeout(() => {
          if (count <= 0 && instance) {
            instance.destroy(true);
            instance = null;
          }
        });
      }
    }
  };
})();

function formatStatus (status) {
  return {
    400: '请求错误',
    401: '没有权限',
    403: '拒绝访问',
    404: '请求地址未发现',
    405: '请求方法未允许',
    406: '请求的格式不可得',
    408: '请求超时',
    410: '请求的资源被删除',
    422: '验证错误。',
    500: '服务器端出错',
    501: '网络未实现',
    502: '网络错误',
    503: '服务不可用',
    504: '网络超时'
  }[status] || `服务端异常${status || ''}`;
}

function Request (url, opt) {
  let options = {
    showLoading: true,
    loadingText: '加载中...',
    showError: true, // 接口返回status等于0时显示错误
    showAjaxError: true, // ajax状态不等于200显示错误
    timeout: 5000
  };
  if (protoType(url) === 'object') {
    options = extend(opt, url);
  } else {
    options = extend(options, { url }, opt);
  }

  options.method = (options.method || 'get').toLowerCase();

  const { method, showLoading, loadingText, showError, showAjaxError } = options;

  if (!regExp.isUrl(options.url)) {
    options.url = joinPath(SERVER_HOST, options.url);
  }

  const token = getToken();

  if (token) {
    if ('get'.indexOf(method) > -1) {
      options.params = extend({ token }, options.params);
    } else if ('post'.indexOf(method) > -1) {
      options.data = extend({ token }, options.data);
    }
  }

  if (showLoading) {
    Loading.show(loadingText);
  }

  return new Promise(resolve => {
    axios(options).then(({ data }) => {
      showLoading && Loading.hide();
      const obj = protoType(data) !== 'object' ? { status: 1, data } : data;
      showError && obj.status === 0 && Toast.fail(obj.message || '请求出错');
      resolve(obj);
    }, (error) => {
      console.log({ error });
      showLoading && Loading.hide();
      const obj = { status: 0, ajaxError: true, message: formatStatus(error.response && error.response.status) };
      showAjaxError && Toast.fail(obj.message);
      resolve(obj);
    });
  });
}

['get', 'post', 'put', 'delete'].forEach(method => {
  Request[method] = function (url, options) {
    return Request(url, extend({ method }, options));
  };
});

export const Get = Request.get;
export const Post = Request.post;
export const Put = Request.put;
export const Delete = Request.delete;

export default Request;
