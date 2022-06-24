var fs = require('fs');
var path = require('path');
const chalk = require('chalk');
const pathListTmp = [];
const fileType = [
  'jpg',
  'jpeg',
  'png',
  'mp3',
  'mp4',
  'gif'
];
console.log(process.execPath);
console.log(process.cwd());
const workPath = [
  `${process.cwd()}/src/activities`,
  `${process.cwd()}/src/module`,
  `${process.cwd()}/src/pages`
];
const target = process.argv[2];
var asstesPath = '';
var porjectPath = '';
console.log(chalk.yellow.bold(`项目名：${target}`));

console.log('支持格式', fileType);
console.log('路径支持', workPath);

function getPath (name) {
  for (let i = 0; i < workPath.length; i++) {
    const element = workPath[i];
    let pathTmp = `${element}/${target}`;
    if (fs.existsSync(pathTmp)) {
      return pathTmp;
    }
  }
  return false;
}

porjectPath = getPath(target);
if (!porjectPath) {
  console.log(chalk.white.bgRed.bold(`未找到对应的目录 或 项目目录权限不足`));
} else {
  asstesPath = `${porjectPath}/assets`;
  if (fs.existsSync(asstesPath)) {
    myReadfile(asstesPath);
    // JSON.stringify(pathListTmp, null, '\t')
    fs.writeFile(`${asstesPath}/load.js`, makeCode(pathListTmp), 'utf8', (err) => {
      if (err) throw err;
      console.log(`查询到文件${pathListTmp.length}个有效资源文件`);
      console.log(chalk.white.bold(`加载器生成 ${asstesPath}/load.js`));
      console.log(chalk.bgGreen.white.bold(' DONE '));
      console.log(chalk.white.yellow.bold(`使用方法请参考loaderMaker.js最后面的注释`));
    });
  } else {
    console.log(asstesPath);
    console.log(chalk.white.bgRed.bold('未找到资源目录 或 资源目录权限不足'));
  }
}

function myReadfile (MyUrl) {
  let files = fs.readdirSync(MyUrl);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let fPath = path.join(MyUrl, file);
    if (fs.statSync(fPath).isFile()) {
      if (fileType.includes(path.extname(fPath).substring(1))) {
        pathListTmp.push(`./${fPath.split('assets/')[1]}`);
      }
    } else {
      console.log('目录', fPath);
      myReadfile(fPath);
    };
  }
}

function makeCode (load) {
  let tmp = `let dataList = [
`;
  for (let i = 0; i < load.length; i++) {
    tmp += `  require('${load[i]}')`;
    if (i < load.length - 1) {
      tmp += `,
`;
    } else {
      tmp += `
`;
    }
  }
  tmp += `];
  let loadedImgCount = 0;
  function checkLoaded (cb) {
    loadedImgCount++;
    cb(loadedImgCount);
    if (loadedImgCount >= dataList.length) {
      cb(0);
    }
  }
  module.exports = function loadDate (cb) {
    dataList.forEach(element => {
      const img = new Image();
      img.onload = () => {
        checkLoaded(cb);
      };
      img.onerror = () => {
        checkLoaded(cb);
      };
      img.src = element;
    });
    return dataList.length;
  };
  `;
  return tmp;
}

/* 使用参考
node getAssets.js 项目名
*/

/*  VUE调用参考
<template>
  <div class="loading-main">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
      <p>{{Math.floor(loadedImgCount*100/dataCount)}}%</p>
    </div>
  </div>
</template>
<script>
import load from '../assets/load.js';
export default {

  data () {
    return {
      dataCount: 0,
      loadedImgCount: 0
    };
  },
  created: function () {
    this.dataCount = load(count => {
      if (count) {
        this.loadedImgCount = count;
      } else {
        this.$bus.emit('assets_ready');
      }
    });
  },
  mounted: function () {
  },
  updated: (a) => {

  },
  computed: {
  },
  methods: {

  }
};
</script>

<style lang="less">
.loading-main {
  position: relative;
  height: 100%;
  width: 100%;
  background: black;
}

.spinner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 80px;
  height: 80px;
  margin: auto;
}

.spinner p {
  color: #ffd658;
  position: absolute;
  top: 100px;
  width: 100%;
  margin: 0;
  text-align: center;
  line-height: 30px;
}
.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #ffd658;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-animation: bounce 2s infinite ease-in-out;
  animation: bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }

  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }

  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>

*/
