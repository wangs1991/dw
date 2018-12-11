// 多维链式数据操作方法
// 数据模板
/* let template = {
  '00001': {
    id: '00001',
    prev: null, // 数据头
    next: '00002',
    parent: null,
    children: [],
    otherData: 'hello 00001'
  },
  '00002': {
    id: '00002',
    prev: '00001',
    next: '00003',
    parent: null,
    children: ['00004'],
    otherData: 'hello 00002'
  },
  '00003': {
    id: '00003',
    prev: '00002',
    next: null,
    parent: null,
    children: [],
    otherData: 'hello 00003'
  },
  '00004': {
    id: '00004',
    prev: null,
    next: null, // 数据头
    parent: '00002',
    children: [],
    otherData: 'hello 00004'
  }
} */
export default {
  /* 获取第一个元素 */
  getHead (data, parent) {
    let i

    if (parent) {
      return data[data[parent].children[0]]
    } else {
      for (i in data) {
        if (data[i].prev === null && data[i].parent === null) {
          return data[i]
        }
      }
    }
    return null
  },
  /* 获取最后第一个元素 */
  getTail (data, parent) {
    let l
    let i

    if (parent) {
      l = data[parent].children.length
      return data[data[parent].children[l - 1]]
    } else {
      for (i in data) {
        if (data[i].next === null && data[i].children && data[i].children.length === 0) {
          return data[i]
        }
      }
    }
    return null
  },
  /* 数据查找方法 */
  forEach (data, cbk, start) {
    let current
    let next = true
    let ret
    let head

    head = this.getHead(data)
    if (!head) {
      return false
    }

    current = start ? data[start] : (data[head.id])
    if (!current) {
      return false
    }
    if (!this.has(data, current)) {
      current = data[this.getHead(data).id]
    }
    while (next) {
      ret = cbk.call(this, current, current.id)
      if (ret === false) {
        next = false
      }
      if (current.next) {
        current = data[current.next]
      } else {
        next = false
      }
    }
  },
  /* 数据查找 */
  find (data, handler, start, immedite) {
    let ret = []

    this.forEach(data, function (item, id) {
      if (handler.call(this, item, id)) {
        ret.push(item)
        if (immedite) {
          return false
        }
      }
    }, start)

    return ret
  },
  has (data, item) {
    if (!item) {
      return false
    }
    if (Object.prototype.toString.call(item).indexOf('Object') > 0) {
      return data[item.id] && data[item.id].id === item.id
      /* return this.find(data, it => {
        return it.id === item.id
      }, item.id, true).length > 0 */
    } else {
      return !!data[item]
    }
  },
  shift () {
  },
  unshift () {
  },
  pop () {
  },
  push (data, item, cbk, setter) {
    // 包装数据结构
    let tail

    if (this.has(data, item)) {
      console.log('新增元素id重复，push失败')
      return false
    }

    item.prev = null
    item.next = null
    item.parent = null
    item.children = item.children || []

    tail = this.getTail(data)
    if (tail) {
      item.prev = tail.id
      tail.next = item.id
    }

    if (setter) {
      setter(item)
    } else {
      data[item.id] = item
    }
    cbk && cbk.call(this, item, tail)
  },
  append () {
  },
  delete (data, id, cbk, handler) {
    let has
    let target
    let prev
    let next
    let parent

    // id为undefined清空数据
    if (id === undefined || id === '') {
      if (handler) {
        let ret
        ret = handler.call(this)
        cbk && cbk()
        return ret
      }
      data = {}
      cbk && cbk()
      return true
    }
    // 检查是否存在
    has = this.has(data, id)
    if (!has) {
      return false
    }

    target = data[id]
    prev = data[target.prev]
    next = data[target.next]

    if (prev) {
      prev.next = target.next
    }
    if (next) {
      next.prev = target.prev
    }

    // 如果父节点有引用
    parent = data[id].parent
    if (parent) {
      has = data[parent].children.indexOf(parent)
      data[parent].children.splice(has, 1)
    }
    if (handler) {
      let ret
      ret = handler.call(this, target, prev, next)
      cbk && cbk()
      return ret
    }
    delete data.id
    return true
  },
  clear (data) {

  },
  shiftChild () {
  },
  unshiftChild () {
  },
  popChild () {
  },
  hasChild (data, parent) {
    if (parent) {
      if (data[parent]) {
        return data[parent].children && data[parent].children.length > 0
      }
      return false
    }
    return data.children ? data.children.length > 0 : false
  },
  pushChild (data, parent, item, cbk, setter) {
    // 先检查附加子元素的父元素是非存在
    let has = this.has(data, parent)
    let tail

    if (!has) {
      console.warn('新增元素的父亲id: ' + parent + '不存在，pushChild失败')
      return false // 父元素不存在，添加子元素失败
    }
    if (this.has(data, item)) {
      console.warn('新增元素id重复，push失败')
      return false
    }

    item.prev = null
    item.next = null
    item.parent = parent
    item.children = item.children || []

    tail = this.getTail(data, parent)
    if (tail) {
      item.prev = tail.id
      tail.next = item.id
    }
    // 更新父亲元素的子元素字典
    data[parent].children.push(item.id)

    if (setter) {
      setter(data[parent], item, tail)
    } else {
      data[item.id] = item
    }
    cbk && cbk.call(this, data[parent], item, tail)
  },
  appendChild () {
  },
  deleteChild () {
  },
  removeAllChildren (data, cbk) {
    let children = data.children
    let i

    function doRemove (cdata) {
      cdata.children = []
      children.forEach(n => {
        delete cdata[n.id]
      })
      cbk && cbk(cdata)
    }

    if (children) {
      doRemove(data)
    } else {
      for (i in data) {
        children = data[i].children
        children && doRemove(data[i])
      }
    }
    return data
  },
  forEachChild (data, parentId, cbk, start) {
    if (!data) {
      return false
    }
    if (!data[parentId] || !data[parentId].children || data[parentId].children.length < 1) {
      return false
    }
    let current
    let next = true
    let ret

    current = start ? data[start] : data[data[parentId].children[0]]

    while (next) {
      ret = cbk ? cbk.call(this, current, current.id) : true
      if (ret === false) {
        next = false
      }
      if (current.next) {
        current = data[current.next]
      } else {
        next = false
      }
    }
  },
  everyChild (data, parentId, cbk) {
    let _self = this

    function every (data, parentId) {
      _self.forEachChild(data, parentId, function (n) {
        cbk(n, n.id)
        if (n.children.length > 0) {
          every(data, n.id)
        }
        return true
      })
    }
    every(data, parentId)
  },
  updateId (data, id, newId, cbk) {
    let children

    // 更新子元素参数
    if (this.hasChild(data, id)) {
      this.everyChild(data, id, (item) => {
        item.parent = newId
      })
    }
    // 更新父亲元素记录子元素集合改变

    if (data[id].parent && data[data[id].parent]) {
      children = data[data[id].parent].children
      children.splice(children.indexOf(id), 1, newId)
    }
    // 更新自身参数
    data[newId] = data[id]
    data[newId].id = newId
    delete data[id]
    if (cbk) {
      cbk(data)
    }
  }
}
