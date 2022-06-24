/**
 *  import Dialog from '../../common/js/dialog.js';
 *  Vue.use(Dialog);
 *  this.$dialog.tip('测试');
 *  this.$dialog.loading();
 *  this.$dialog.alert({
 *    title: '提示',
 *    content: '是否删除？'
 *  });
 */
function Dialog () {
  function Fn ({type = '', title = '', content = '', closeShow = 0, cancelCb = null, confirmShow = 0, cancelValue = '取消', confirmValue = '确认', confirmCb = null, time = 1600} = {}) {
    var _dialog = this;
    let el = document.createElement('div');
    el.className = 'dialog dialog-' + type;
    el.innerHTML = `<div class="dialog-main">
          <div class="dialog-main-close"></div>
          <h2 class="dialog-main-title">${title}</h2>
          <div class="dialog-main-cnt">${content}</div>
          <a class="dialog-main-btn btn-cancel">${cancelValue}</a>
          <a class="dialog-main-btn btn-confirm">${confirmValue}</a>
      </div>`;
    document.body.appendChild(el);
    let isCloseShow = closeShow ? '' : 'display:none;';
    let isContent = content ? '' : 'display:none;';
    let isTitle = title ? '' : 'display:none;';
    let isConfirmShow = confirmShow ? 'display:block;' : '';
    document.querySelector('.dialog').setAttribute('style', 'display: block;position: fixed;top: 0;left: 0;bottom: 0;right: 0;z-index: 999;background: rgba(0, 0, 0, 0.4)');
    document.querySelector('.dialog-main').setAttribute('style', 'width: 75%;padding: 6% 5%;border-radius: 5px;line-height: 20px;background: #fff;position: absolute;top: 46%;left: 50%;transform: translate(-50%, -50%);');
    document.querySelector('.dialog-main-close').setAttribute('style', isCloseShow + 'position: absolute;margin: auto;width: 28px;height: 28px;right: 5px;top: 5px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAMFBMVEUAAACMk5mMk5mMk5mMk5mMk5mMk5mMk5mMk5mMk5mMk5mMk5mMk5mMk5mMk5mMk5kkTwceAAAAD3RSTlMA8O06LegnPzEc3NDNV1SaiuMFAAAAq0lEQVQoz2XQMQrCUBCE4QELj5HGxsbkDLZaC2kUj6JHEDyEVTqP4AFykxew0WIF327+F7LVMnzNjPqnJrfbyFJTJssqqbNVGV3tq+2fgeygRVWyiw2NgoE0MlAwEAzkDAQDwQLBQLBAsPXZEWyoM4LV5oi7mz00i1p/mSCaMsH75E1B7Q0W7RiECXwQEIOARgYKBoKBYCBYRjAQDATrMoJ95AiW1L80uf3xB3SMhRHJar4AAAAAAElFTkSuQmCC) center center no-repeat;background-size: 14px 14px;');
    document.querySelector('.dialog-main-cnt').setAttribute('style', isContent + 'color:#666;font-size:14px;line-height:1.5em;margin:.75em 0;');
    document.querySelector('.dialog-main-btn').setAttribute('style', 'display: block;width: 80%;margin: 1em auto .5em;border-radius: 4px;text-align: center;font-size: 18px;background: #16b13a;color: #fff;line-height: 40px;');
    document.querySelector('.dialog-main-title').setAttribute('style', isTitle + 'text-align: center;font-size: 18px;line-height: 18px;color: #666;');
    document.querySelector('.btn-cancel').setAttribute('style', 'display:none');
    document.querySelector('.btn-confirm').setAttribute('style', 'display:none');

    if (type === 'confirm') {
      document.querySelector('.dialog-confirm').querySelector('.btn-confirm').setAttribute('style', isConfirmShow + 'text-align:center;width: 48%;color:#16b13a;background: #fff;line-height: 38px;border:1px solid #16b13a;width: 48%;float:right;');
      document.querySelector('.dialog-confirm').querySelector('.btn-cancel').setAttribute('style', isConfirmShow + 'text-align:center;float:left;width: 48%;color:#16b13a;background: #fff;line-height: 38px;border:1px solid #16b13a;');
    } else if (type === 'alert') {
      // document.querySelector('.dialog-alert').querySelector('h2').setAttribute('style', 'margin: 30px 15px');
    } else if (type === 'tip') {
      document.querySelector('.dialog-tip').setAttribute('style', 'display: block;position: fixed;top: 50%;width:100%;z-index: 999;');
      document.querySelector('.dialog-tip').querySelector('.dialog-main').setAttribute('style', 'position: absolute;top: 46%;left: 50%;transform: translate(-50%, -50%);width: auto;max-width: 79%;padding: 10px 20px;border-radius: 3px;display: flex;align-items: center;justify-content: center;background: rgba(0, 0, 0, 0.7);');
      document.querySelector('.dialog-tip').querySelector('.dialog-main-title').setAttribute('style', 'font-size: 14px;line-height: 14px;color:#fff;text-align: left;');
    } else if (type === 'loading') {
      document.querySelector('.dialog-loading').querySelector('.dialog-main').setAttribute('style', 'position: absolute;top: 46%;left: 50%;transform: translate(-50%, -50%);width: auto;max-width: 79%;padding: 3%;display: flex;align-items: center;justify-content: center;background: rgba(0, 0, 0, 0.7);');
      document.querySelector('.dialog-loading').querySelector('.dialog-main-title').setAttribute('style', 'background:url(data:image/gif;base64,R0lGODlhZABkAKIEAN7e3rq6uv///5mZmQAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBRjA4RUZDMDI3MjA2ODExODA4M0Y1OTQyMzVDRDM3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMzE0Rjk3NDdDRTgxMUUzOUJCRjk0NjAxMUE1NzRBMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMzE0Rjk3MzdDRTgxMUUzOUJCRjk0NjAxMUE1NzRBMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDVBMTZDQjczOTIwNjgxMTgwODNGNTk0MjM1Q0QzNzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUYwOEVGQzAyNzIwNjgxMTgwODNGNTk0MjM1Q0QzNzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+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) left center no-repeat;background-size: 20px auto;padding-left: 1.5em;height:20px;');
    }

    el.querySelector('.dialog-main-close').addEventListener('click', function () {
      cancelCb && cancelCb.apply(_dialog);
      _dialog.hide();
    });

    el.querySelector('.dialog-main-btn.btn-cancel').addEventListener('click', function () {
      cancelCb && cancelCb.apply(_dialog);
      _dialog.hide();
    });

    el.querySelector('.dialog-main-btn.btn-confirm').addEventListener('click', function () {
      confirmCb && confirmCb.apply(_dialog);
      _dialog.hide();
    });

    if (type === 'tip') {
      setTimeout(function () {
        _dialog.hide();
      }, time);
    }
    if (type === 'loading') {
      setTimeout(function () {
        _dialog.hide();
      }, time);
    }
    this.el = el;
    // promise操作
    this.then = function (resolve, reject) {
      confirmCb = resolve;
      cancelCb = reject;
    };
  }

  Fn.prototype.hide = function () {
    // this.el.style.display = 'none';
    this.el.remove();
  };
  Fn.prototype.show = function () {
    this.el.style.display = 'block';
  };

  return {
    alert: function (title) {
      let args = {};
      if (Object.prototype.toString.call(title) === '[object String]') {
        args = {
          title: title
        };
      } else {
        args = title;
      }

      args = Object.assign({
        type: 'alert',
        closeShow: 1,
        confirmShow: 1,
        confirmValue: '我知道了'
      }, args);
      return new Fn(args);
    },
    confirm: function (title, content, confirmCb) {
      let args = {};
      if (Object.prototype.toString.call(title) === '[object String]') {
        args = {
          title: title,
          content: content,
          confirmCb: confirmCb
        };
      } else {
        args = title;
      }

      args = Object.assign({
        type: 'confirm',
        closeShow: 0,
        confirmShow: 1
      }, args);
      return new Fn(args);
    },
    tip: function (title, time) {
      if (document.querySelector('.dialog-tip')) {
        document.querySelector('.dialog-tip').remove();
      }

      let args = {};
      if (Object.prototype.toString.call(title) === '[object String]') {
        args = {
          title: title,
          time: time
        };
      } else {
        args = title;
      }

      args = Object.assign({
        type: 'tip',
        closeShow: 0,
        confirmShow: 0
      }, args);

      return new Fn(args);
    },
    loading: function (title) {
      let args = {};
      if (Object.prototype.toString.call(title) === '[object String]') {
        args = {
          title: title
        };
      } else {
        args = title;
      }

      args = Object.assign({
        type: 'loading',
        closeShow: 0,
        confirmShow: 0,
        time: 5000
      }, args);
      return new Fn(args);
    },
    fn: function (args) {
      if (typeof args !== 'object') return;
      return new Fn(args);
    }
  };
}
var dialog = {
  install: function (Vue) {
    if (dialog.installed) {
      return;
    }
    let _dialog = new Dialog();

    Object.defineProperty(Vue.prototype, '$dialog', {
      get: function () {
        return _dialog;
      }
    });
  }
};

export default dialog;
