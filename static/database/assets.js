module.exports = [{
  id: '000002',
  name: '字体',
  type: 'ASSET_FONT',
  data: {
    '000002': {
      id: '000002', // id标识
      type: 1, // 组件类型 1-文字组件
      alisa: 'ASSET_FONT',
      previwer: '', // 预览图片地址
      template: `<div class='asset-continer__root'>
              <div class='asset-font__root'>
                  <div class='asset-font__content'>双击修改文字</div>
                </div>
            </div>`, // html字符串
      content: 'HELLO 番茄号',
      style: {
        root: { // 限用属性【宽高、位置、边框、背景颜色】
          width: '100px',
          height: '18px',
          display: 'inline-block',
          cursor: 'move',
          position: 'absolute',
          left: '120px',
          top: '120px',
          zIndex: 1
        },
        content: { // 限用属性【变换属性】
          'color': '#f00',
          'fontFamily': 'Microsoft YaHei UI',
          'fontSize': '12px',
          lineHeight: '18px',
          letterSpacing: 0
        }
      }, // style 样式对象
      prev: null,
      next: null,
      parent: null,
      children: null
    }
  }
}, {
    id: '000003',
    name: '图片',
    type: 'ASSET_IMAGE',
    data: {
      '000003': {
        id: '000003', // id标识
        type: 2, // 组件类型 2-图片组件
        alisa: 'ASSET_IMAGE',
        previwer: '', // 预览图片地址
        template: `<div class='asset-continer__root'>
              <div class='asset-container__wraper'>
                <div class='asset-image__root'>
                  <div class='asset-image__content'>
                    <img src='' alt='' style="width: 100%; display: block;"/>
                  </div>
                </div>
                </div>
              </div>`, // html字符串
        content: '../../static/images/default_img.jpg',
        style: {
          root: { // 限用属性【宽高、位置、边框、背景颜色】
            width: '118px',
            height: '85px',
            display: 'inline-block',
            cursor: 'move',
            position: 'absolute',
            left: '120px',
            top: '20px',
            zIndex: 1
          },
          content: {
            'opacity': 1
          }
        }, // style 样式对象
        prev: null,
        next: null,
        parent: null,
        children: null
      }
    }
  }, {
  id: '000004',
  name: '形状',
  type: 'ASSET_SHAPE',
  data: {
    '000004': {
      id: '000004', // id标识
      type: 3, // 组件类型 2-图片组件
      alisa: 'ASSET_SHAPE',
      previwer: '', // 预览图片地址
      template: `<div class='asset-continer__root'>
                <div class='asset-container__wraper'>
                <div class='asset-shape__root'>
                  <div class='asset-shape__content'></div>
                </div>
              </div>
        </div>`, // html字符串
      style: {
        root: { // 限用属性【宽高、位置、边框、背景颜色】
          display: 'inline-block',
          cursor: 'move',
          width: '200px',
          height: '200px',
          position: 'absolute',
          left: '120px',
          top: '220px',
          zIndex: 1
        },
        content: {
          width: '190px',
          height: '190px',
          opacity: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          'borderTopWidth': '5px',
          'borderRightWidth': '5px',
          'borderBottomWidth': '5px',
          'borderLeftWidth': '5px',
          'borderTopColor': '#f0f',
          'borderRightColor': '#f0f',
          'borderBottomColor': '#f0f',
          'borderLeftColor': '#f0f',
          borderStyle: 'solid',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '4px',
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px'
        }
      }, // style 样式对象
      prev: null,
      next: null,
      parent: null,
      children: null
    }
  }
}]
