import { formatDate } from '@/utils';

// 环境切换
export const ENV = (
  process.env.VUE_APP_ENV
  // 'development' //开发环境
  // 'test' //测试环境
  // 'production' //生产环境
);

// 版本号
export const VERSION = (
  process.env.VUE_APP_VERSION
);

// 编译时间
export const TIME = process.env.VUE_APP_TIME;

// 接口域名
export const SERVER_HOST = {
  development: 'http://dev-contact-api.molbase.cn/',
  test: 'http://dev-contact-api.molbase.cn/',
  production: 'http://contact-api.molbase.cn/'
}[ENV];

console.log(`

  编译环境 : ${ENV}

  当前版本 : ${VERSION}
  
  ${ENV !== 'development' ? `打包时间 : ${formatDate(TIME)}` : ''}

`);
