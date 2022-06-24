var request_config = {
  // 纯粹的内网域名:appDomain
  appDomain: 'crowdfunding-cardmall.dongqiudi.com',
  // 静态资源请求域名:staticDomain
  staticDomain: '',
  // 安卓app内请求域名:androidDomain
  androidDomain: '',
  ENV_DETAIL: 'prod'
};

module.exports = {
  appDomain: 'https://' + request_config.appDomain,
  staticDomain: request_config.staticDomain,
  androidDomain: 'https://' + request_config.androidDomain,
  ENV_DETAIL: request_config.ENV_DETAIL
};
