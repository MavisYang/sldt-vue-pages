import { getCookie } from '@/utils';

export default function () {
  // app中
  return getCookie('Authorization');

  // 企业认证审核通过
  // return 'e88bd2e0a5622e31cd6c0c2058e3b2c6';

  // 有定制商机的
  // return 'ce79d0f7c33530eb7f2ee5dacf86bb33';

  // 未提交企业认证
  // return 'de5080ecebdc63d23261d269811f58ab';

  // vip
  // return 'f69914bf057621147abe6aed3ce41fd9';

  // return 'de5080ecebdc63d23261d269811f58ab';
}
