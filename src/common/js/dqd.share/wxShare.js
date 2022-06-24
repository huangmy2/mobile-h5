window.wx = require('weixin-js-sdk');
import jsonp from 'jsonp'
const WECHAT_JSONP_URL = 'https://api.dongqiudi.com/wechat/i?action=normal'
const DQD_LOGO = 'https://img1.qunliao.info/fastdfs3/M00/10/B9/ChONolxrsfSACS2BAAHS9Co6MWQ235.png'

export default function  (config) {
  config.imgUrl = config.imgUrl || DQD_LOGO
  console.log('wechatShare_config',config)
  jsonp(WECHAT_JSONP_URL, null, function (err, data) {
    console.log('jsonp',err,data)
    if (err) { return console.log(err) }
    let timestamp = data.timestamp
    let noncestr = data.noncestr
    let signature = data.signature
    wx.config({
      debug: false,
      appId: 'wxf573a1469de1033d',
      timestamp: timestamp,
      nonceStr: noncestr,
      signature: signature,
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
    })
    wx.ready(() => {
      wx.onMenuShareTimeline({
        title: config.title,
        link: config.link,
        imgUrl: config.imgUrl
      })
      wx.onMenuShareAppMessage({
        title: config.title,
        desc: config.desc,
        link: config.link,
        imgUrl: config.imgUrl,
        type: '',
        dataUrl: ''
      })
      wx.onMenuShareQQ({
        title: config.title,
        desc: config.desc,
        link: config.link,
        imgUrl: config.imgUrl
      })
      wx.onMenuShareQZone({
        title: config.title,
        desc: config.desc,
        link: config.link,
        imgUrl: config.imgUrl
      })
    })
  })
}
