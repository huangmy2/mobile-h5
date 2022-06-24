/**
 * Created by liuhui on 2017/3/9.
 */
const router = require('koa-router')();
var url = require('url');

var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
var Hex = CryptoJS.enc.Hex;

var pptvH5Crypto = {
  getRandom: function() {
    for (var a = "", b = 0; b < 16; b++) {
      var c = parseInt(93 * Math.random() + 33);
      a += String.fromCharCode(c)
    }
    return a
  },
  getSignature: function(a, b) {
    var c = this.getRandom()
      , d = c + a + b
      , e = {}
      , f = this.toHexStr(d), h = Hex.parse(f)
      , g = SHA256(Hex.parse(f))
      , h = Hex.stringify(g);
    return e.sign = h,
      e.random = this.toHexStr(c),
      e
  },
  toHexStr: function(a) {
    for (var b = "", c = 0; c < a.length; c++)
      b += a.charCodeAt(c).toString(16);
    return b
  },
  BytesToStr: function(a) {
    for (var b, c = a.length, d = [], e = 0; e < c; e++)
      b = a[e],
        d.push(String.fromCharCode(b));
    return d.join("")
  }
}

router.get('*', async (ctx, next) => {
  if(ctx.method=='GET') {
    var url_parts = url.parse(ctx.url,true);
    var q = url_parts.query;
    var kk = q['kk'];
    var key = 'UwlJsRX59+ldn2gWmrUnxxFiVuzGL3V@';
    if (kk) {
      var s = pptvH5Crypto.getSignature(kk, key);
      ctx.body = s;
    }else{
      ctx.body = 'bye!';
    }
  }
});

module.exports = router;
