let uuid = require('node-uuid')

export const generateId = (prefix) => {
  return prefix + uuid.v4()
}

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
    JSON (data, optimize) {
      const reg = /[\s]*/g

      if (window.Blob) {
        this.JSON = (data, optimize) => {
          data = JSON.stringify(data)
          if (optimize) {
            // data = data.replace(reg, '') // 代码压缩
          }
          return new Blob([data],
            {
              type: 'application/json'
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
          return builder.getBlob('application/json')
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
