const path = require('path')
var config = '';
function pathSplice(filePath){
  return path.join(__dirname, filePath)
}

var request_config = require(pathSplice('../../bin/config'));
const envNew = request_config.ENV_NEW || false
if(envNew){
  // 为了环境迁移引进的变量，解决新老环境共用同一git问题
  config = require(pathSplice('../../config/st-index.js'))
}else{
  config = require(pathSplice('../../config/index.js'))
}

const isProd = process.env.NODE_ENV === 'production'
//全局配置输出变量Authorization & UUID & apiDomain & staticDomain
module.exports = async(ctx, next) => {
  //输出配置Authorization & UUID,其中andriod获取authorization & uuid
  ctx.state.Authorization = ctx.header.Authorization || ctx.header.authorization || "";
  ctx.state.UUID = ctx.header.UUID || ctx.header.uuid || "";
  ctx.state['fingerprint-szlm'] = ctx.header['fingerprint-szlm'] || "";
  ctx.state['fingerprint_szlm'] = ctx.header['fingerprint_szlm'] || "";
  ctx.state['fingerprint']      = ctx.header['fingerprint'] || "";
  ctx.state['fingerprintShumei'] = ctx.header['fingerprint-shumei'] || "";
  ctx.state['androidChannel'] = ctx.header['android-channel'] || "";

  //输出配置apiDomain & staticDomain
  // ctx.state.apiDomain = config[ctx.hostname];
  // ctx.state.staticDomain = config.staticDomain;
  if(isProd){
    ctx.state.apiDomain    = config.build.appDomain;
    ctx.state.staticDomain = config.build.assetsPublicPath.replace(/\/$/ig,'');
  }else{
    ctx.state.apiDomain    = config.dev.appDomain;
    ctx.state.staticDomain = config.dev.assetsPublicPath.replace(/\/$/ig,'');
  }
  await next();
};
