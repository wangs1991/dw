let uuid = require('node-uuid')

// 前台唯一id生成函数
export const generateId = (prefix = '') => {
  return prefix + uuid.v4()
}

// localstorage数据存取
export const Storage = {
  get (key, del) {
    var ret = false

    try {
      ret = window.localStorage.getItem(key)
      ret = this.parseData(ret)
    } catch (e) { }
    if (del) {
      this.delete(key)
    }
    return ret
  },
  set (key, value) {
    var data = {}

    data.type = this.getType(value)
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      return false
    }
    return true
  },
  delete (key) {
    try {
      window.localStorage.removeItem(key)
    } catch (e) {
      return false
    }
    return true
  },
  getType (value) {
    var t = Object.prototype.toString.call(value)
    var reg = /[\s]+[a-zA-Z]+/g

    return reg.exec(t)[0]
  },
  parseData (value) {
    var t

    value = JSON.parse(value)
    switch (value.type) {
      case 'Number':
        t = parseFloat(value.data, 10)
        break
      case 'Undefined':
        t = undefined
        break
      case 'Null':
        t = null
        break
      default:
        t = JSON.parse(value.data)
        break
    }
    return t
  }
}

// 文件转化喻户僧城
export const fileTransfer = (() => {
  // 定义文件转换操作
  const transferCmds = {
    IMAGE (data) {
      var imgtype = ''
      var base64String = ''
      var reg = /(data:image\/)([jpg,png,jpeg]*)(;base64,)([\S]*)/i

      if (data.indexOf(reg) < 0) {
        imgtype = 'jpg'
        base64String = data
      } else {
        imgtype = data.replace(reg, '$2')
        base64String = data.replace(reg, '$4')
      }

      // 将base64解码
      // var bytes = atob(base64String)
      var bytesCode = new ArrayBuffer(base64String.length)
      // 转换为类型化数组
      var byteArray = new Uint8Array(bytesCode)

      // 将base64转换为ascii码
      for (var i = 0; i < base64String.length; i++) {
        byteArray[i] = base64String.charCodeAt(i)
      }

      // 生成Blob对象（文件对象）
      return new Blob([bytesCode], {type: imgtype})
    },
    JSON (data, optimize, type = 'BOOK') {
      const reg = /[\s]*/g
      let evalJS = 'Listener.trigger("' + type + '", [*code*])'
      var regReplace = /(\[\*code\*\])/

      if (window.Blob) {
        this.JSON = (data, optimize) => {
          data = JSON.stringify(data)
          data = evalJS.replace(regReplace, data)
          if (optimize) {
            data = data.replace(reg, '') // 代码压缩
          }
          return new Blob([data],
            {
              type: 'text/javascript',
              charset: 'UTF-8'
            })
        }
      } else {
        this.JSON = (data, optimize) => {
          // eslint-disable-next-line
          var builder = new BlobBuilder()
          var fileParts

          data = JSON.stringify(data)
          if (optimize) {
            data = data.replace(reg, '') // 代码压缩
          }

          fileParts = [data]
          builder.append(fileParts[0])
          return builder.getBlob('text/javascript')
        }
      }
      return this.JSON(data)
    }
  }
  return function (data, type, optimize = true) {
    try {
      return transferCmds[type.toUpperCase()](data, optimize)
    } catch (e) {
      return null
    }
  }
})()

/**
 * 订阅发布者模式脚本
 *
 */
/* eslint-disable */
export const Listener = (function () {

  var global = this, Event, _default = 'default';

  Event = function () {
    var _listen, _trigger, _remove, _slice = Array.prototype.slice, _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift, namespaceCache = {},
      _create,
      find,
      each = function (ary, fn) {
        var ret;
        for (var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i];
          ret = fn.call(n, i, n);
        }
        return ret;
      };

    _listen = function (key, fn, cache) {
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };

    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };

    _trigger = function () {
      var cache = _shift.call(arguments), key = _shift.call(arguments), args = arguments, _self = this, ret,
        stack = cache[key];

      if (!stack || !stack.length) {
        return;
      }

      return each(stack, function () {
        return this.apply(_self, args);
      });
    };

    _create = function (namespace) {
      var namespace = namespace || _default;
      var cache = {},
        offlineStack = [],    // 离线事件
        ret = {
          listen: function (key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) {
              return;
            }
            if (last === 'last') {
              offlineStack.length && offlineStack.pop()();
            } else {
              each(offlineStack, function () {
                this();
              });
            }

            offlineStack = null;
          },
          one: function (key, fn, last) {
            _remove(key, cache);
            this.listen(key, fn, last);
          },
          remove: function (key, fn) {
            _remove(key, cache, fn);
          },
          trigger: function () {
            var fn, args, _self = this;

            _unshift.call(arguments, cache);
            args = arguments;
            fn = function () {
              return _trigger.apply(_self, args);
            };
            if (offlineStack) {
              return offlineStack.push(fn);
            }
            return fn();
          }
        };

      return namespace ? ( namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret ) : ret;
    };

    return {
      create: _create,
      one: function (key, fn, last) {
        var event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        var event = this.create();
        event.remove(key, fn);
      },
      listen: function (key, fn, last) {
        var event = this.create();
        event.listen(key, fn, last);
      },
      trigger: function () {
        var event = this.create();
        event.trigger.apply(this, arguments);
      }
    };
  }();
  return window.Listener = Event;
})();
/* eslint-disable-end */

// 单例模式加载js脚本
export const loadScript = (function () {
  let script

  return url => {
    if (!script) {
      script = document.createElement('script')
      script.type = 'text/javascript'
      document.body.appendChild(script)
    }
    script.src = url
  }
})();

export const IsPC = () => {
  var userAgentInfo = navigator.userAgent,
    Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'],
    flag = true,
    v = 0;

  for (v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

// 移动端判断方法
export const platform = () => {
  // 移动端
  if (document.body.clientWidth <= 750 || !IsPC()) {
    return 'mobile'
  }
  return 'pc'
}
