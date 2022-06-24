// plopfile.js

module.exports = plop => {
    plop.setGenerator('addfile', {
      description: 'create the repeat file', // 功能描述
      prompts: [{
        type: 'input', // 问题的类型
        name: 'fileName', // 问题对应得到答案的变量名，可以在actions中使用该变量
        message: 'your fileName is', // 在命令行中的问题
        default: 'newFile' // 问题的默认答案
      }, {
        type: 'input',
        name: 'path',
        message: 'your path is pages',
        default: 'pages'
      }],
      actions: [{
        type: 'add',
        path: 'src/{{path}}/{{fileName}}/App.vue',
        templateFile: 'config/plop-temp/App.vue'
      }, {
        type: 'add',
        path: 'src/{{path}}/{{fileName}}/{{fileName}}.html',
        templateFile: 'config/plop-temp/temp.html'
      }, {
        type: 'add',
        path: 'src/{{path}}/{{fileName}}/{{fileName}}.js', // 添加的文件的路径
        templateFile: 'config/plop-temp/temp.js' // 模板文件的路径
      }]
    });
  };
  