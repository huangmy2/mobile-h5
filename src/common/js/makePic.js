// 七牛绘图
var Base64 = require('js-base64').Base64;
function format (str) {
  return Base64.encode(str).replace(/[+]/ig, '-').replace(/[\/]/ig, '_');
}

function text (opt) {
  let text = `/text/${format(opt.text)}`; // 文字内容
  let font = opt.font ? `/font/${format(opt.font)}` : ''; // 文字字体
  let size = opt.size ? `/fontsize/${Math.floor(opt.size * 21.4)}` : ''; // 文字字号 750宽度的字号
  let color = opt.color ? `/fill/${format(opt.color)}` : ''; // 颜色
  let opacity = opt.opacity ? `/dissolve/${opt.opacity}` : ''; // 透明度
  let origin = `/gravity/${opt.origin || 'Center'}`; // 定位锚点 NorthWest NorthEast SouthWest SouthEast North West South East Center
  let x = opt.x ? `/dx/${opt.x}` : ''; // 基于锚点X轴便宜 正右 负左
  let y = opt.y ? `/dy/${opt.y}` : ''; // 基于锚点Y轴便宜 正下 负上
  return `${text}${font}${size}${color}${origin}${x}${y}${opacity}`;
};

function pic (opt) {
  let url = `/image/${format(opt.url)}`;
  let origin = `/gravity/${opt.origin || 'Center'}`; // 定位锚点 NorthWest NorthEast SouthWest SouthEast North West South East Center
  let opacity = opt.opacity ? `/dissolve/${opt.opacity}` : ''; // 透明度
  let x = opt.x ? `/dx/${opt.x}` : ''; // 基于锚点X轴便宜 正右 负左
  let y = opt.y ? `/dy/${opt.y}` : ''; // 基于锚点Y轴便宜 正下 负上
  let ws = `/ws/${opt.ws || 1}`; // 水印图片自适应原图的短边比例，ws的取值范围为0-1
  let wst = `/wst/${opt.wst || 1}`; // 缩放基准   0、1、2、3分别表示为 自适应原图的：短边、长边、宽、高
  return `${url}${origin}${x}${y}${ws}${wst}${opacity}`;
}

function textLine (list, opt) {
  // list<Array>中的文字对象 将会合成1排居中显示，
  let lengthMax = 0;
  let objList = [];
  let lastText = '';
  let urlText = '';
  list.forEach(element => {
    element = Object.assign({}, opt, element);
    element.len = element.text.length * (Math.floor(element.size || opt.size));
    for (let i = 0; i < element.text.length; i++) {
      const c = element.text[i];
      if (c >= '0' && c <= '9' || c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
        console.log('数字');
        element.len -= Math.floor((element.size || opt.size) / 2);
      }
    }
    objList.push(element);
    lengthMax += element.len;
  });
  objList.forEach(element => {
    if (lastText) {
      console.log(element.len);
      element.x = Math.floor(lastText.x + (element.len / 2) + (lastText.len / 2));
    } else {
      element.x = Math.floor((0 - lengthMax / 2) + (element.len / 2));
    }
    lastText = element;
    urlText += text(element);
  });
  return urlText;
}

export default function makePic (backPic, itemList) {
  let picUlr = backPic;
  if (itemList.length) {
    picUlr = backPic + '?watermark/3';
    itemList.forEach(element => {
      switch (element.type) {
      case 'pic':
        picUlr += pic(element);
        break;
      case 'text':
        picUlr += text(element);
        break;
      case 'textLine':
        picUlr += textLine(element.list, element.opt);
        break;
      default:
        break;
      }
    });
  }
  return picUlr;
}
